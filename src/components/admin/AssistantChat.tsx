import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BookOpen, CreditCard, Crown, PencilLine, ShieldCheck, FolderTree, Loader2, Megaphone, Palette, History, ImagePlus, MessageCircle, Rocket, Plus, Send, Sparkles, Trash2, Truck, Wand2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { assistantApi } from '@/services/api/assistant';
import { platformApi } from '@/services/api/platform';
import { uploadImage } from '@/services/api/upload';
import {
  buildFlow,
  isCatalogWidget,
  isContentWidget,
  isAtzWidget,
  isLogoWidget,
  isDesignWidget,
  isGrowthWidget,
  isLegalWidget,
  isManageWidget,
  isMarketingWidget,
  isPhone,
  isShippingWidget,
  isToolWidget,
  parseAmount,
  widgetForStep,
  type AnyWidget,
  type FlowStepId,
  type FlowWidget,
} from '@/config/assistantFlow';
import { cn } from '@/lib/utils';
import { useAdminLocale } from '@/contexts/AdminLocaleContext';
import { useTenant } from '@/contexts/TenantContext';
import type { AdminMessageKey } from '@/i18n/admin/adminMessages';
import type { UpdateStoreSettingsRequest } from '@/types/api';
import type { Entry } from './assistantTypes';
import { useCatalogFlow } from './useCatalogFlow';
import { useDesignFlow } from './useDesignFlow';
import { usePaymentsFlow } from './usePaymentsFlow';
import { paletteFromFile, paletteFromUrl, type Palette as LogoPalette } from '@/config/paletteFromImage';
import { ASSISTANT_FLOW_EVENT, type AssistantFlowId } from '@/utils/assistantBus';
import { useAssistantTools } from './useAssistantTools';
import { useComplianceFlow } from './useComplianceFlow';
import { useContentFlow } from './useContentFlow';
import { useLogoFlow } from './useLogoFlow';
import { useGrowthFlow } from './useGrowthFlow';
import { useManageFlow } from './useManageFlow';
import { useMarketingFlow } from './useMarketingFlow';
import { useShippingFlow } from './useShippingFlow';
import { looksLikeSecret } from '@/config/sellFlow';
import type { StoreSettingsDTO } from '@/types/api';
import {
  ColorsWidget,
  LinkWidget,
  TextWidget,
  UploadWidget,
  YesNoWidget,
} from './AssistantWidgets';

const STORAGE_KEY = 'troco_assistant_chat';
const MAX_INPUT = 1000;
const SETTINGS_KEY = ['store-settings', 'me'];
const NUDGE_KEY = 'troco_assistant_nudge_seen';

// sessionStorage peut être indisponible (navigation privée) : le rappel s'affiche alors simplement tant que le chat est fermé.
const nudgeSeen = () => {
  try {
    return sessionStorage.getItem(NUDGE_KEY) === '1';
  } catch {
    return false;
  }
};
const markNudgeSeen = () => {
  try {
    sessionStorage.setItem(NUDGE_KEY, '1');
  } catch {
    /* ignore */
  }
};

/** Questions proposées selon l'écran ouvert (préfixe d'URL → clés de suggestions). */
const SUGGESTIONS: Record<string, AdminMessageKey[]> = {
  '/admin/dashboard': ['assistant.sug.dashboard1', 'assistant.sug.dashboard2'],
  '/admin/reglages': ['assistant.sug.settings1', 'assistant.sug.settings2'],
  '/admin/parametres': ['assistant.sug.appearance1', 'assistant.sug.appearance2'],
  '/admin/produits': ['assistant.sug.products1', 'assistant.sug.products2'],
  '/admin/commandes': ['assistant.sug.orders1'],
  '/admin/pages': ['assistant.sug.pages1'],
};
const DEFAULT_SUGGESTIONS: AdminMessageKey[] = ['assistant.sug.default1', 'assistant.sug.default2', 'assistant.sug.default3'];

function suggestionsFor(pathname: string): AdminMessageKey[] {
  const hit = Object.keys(SUGGESTIONS).find((p) => pathname === p || pathname.startsWith(`${p}/`));
  return hit ? SUGGESTIONS[hit] : DEFAULT_SUGGESTIONS;
}

const ASK_KEY: Record<FlowStepId, AdminMessageKey> = {
  logo: 'assistant.flow.logo.ask',
  colors: 'assistant.flow.colors.ask',
  tagline: 'assistant.flow.tagline.ask',
  phone: 'assistant.flow.phone.ask',
  whatsapp: 'assistant.flow.whatsapp.ask',
  cod: 'assistant.flow.cod.ask',
  freeShipping: 'assistant.flow.shipping.ask',
  whatsappBusiness: 'assistant.flow.wab.ask',
};

type Conversation = { id: string; title: string; entries: Entry[] };
type ChatStore = { active: string; items: Conversation[] };

const MAX_CONVERSATIONS = 10;
const FAB_HIDDEN_KEY = 'troco_assistant_fab_hidden';

const newConversation = (): Conversation => ({
  id: `c${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
  title: '',
  entries: [],
});

/** Une clé par boutique : deux boutiques ouvertes dans le même navigateur ne partagent jamais leurs conversations. */
const storageKeyFor = (tenantId: number | string | null | undefined) => `${STORAGE_KEY}:${tenantId ?? 'none'}`;

function isEntry(m: unknown): m is Entry {
  const e = m as Entry | null;
  return !!e && (e.role === 'user' || e.role === 'assistant') && typeof e.content === 'string';
}

function loadStore(key: string): ChatStore {
  try {
    const raw = sessionStorage.getItem(key);
    const parsed = raw ? (JSON.parse(raw) as Partial<ChatStore>) : null;
    const items = Array.isArray(parsed?.items)
      ? parsed.items
          .filter((c): c is Conversation => !!c && typeof c.id === 'string' && Array.isArray(c.entries))
          .map((c) => ({ id: c.id, title: String(c.title ?? ''), entries: c.entries.filter(isEntry) }))
      : [];
    if (items.length === 0) items.push(newConversation());
    const active = items.some((c) => c.id === parsed?.active) ? (parsed?.active as string) : items[0].id;
    return { active, items };
  } catch {
    const c = newConversation();
    return { active: c.id, items: [c] };
  }
}

/** Les outils (widgets) ne sont pas conservés : une configuration interrompue se relance depuis le début. */
function saveStore(key: string, store: ChatStore) {
  try {
    const items = store.items.slice(0, MAX_CONVERSATIONS).map((c) => ({
      id: c.id,
      title: c.title,
      entries: c.entries.slice(-30).map(({ role, content }) => ({ role, content })),
    }));
    sessionStorage.setItem(key, JSON.stringify({ active: store.active, items }));
  } catch {
    /* stockage indisponible : les conversations restent en mémoire */
  }
}

const titleFrom = (entries: Entry[]) => {
  const first = entries.find((e) => e.role === 'user')?.content.trim().replace(/\s+/g, ' ') ?? '';
  return first.length > 40 ? `${first.slice(0, 40)}…` : first;
};

/** Transforme les adresses d'écrans admin (/admin/reglages) en liens cliquables. */
function linkify(text: string, onNavigate: () => void): ReactNode[] {
  return text.split(/(\/admin(?:\/[a-z0-9-]+)+)/g).map((part, i) =>
    /^\/admin(\/[a-z0-9-]+)+$/.test(part) ? (
      <Link
        key={i}
        to={part}
        onClick={onNavigate}
        className="font-medium text-primary underline underline-offset-2"
      >
        {part}
      </Link>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

/**
 * Assistant de configuration : bouton flottant + panneau de chat dans l'admin.
 * Il répond aux questions et peut mener une configuration guidée (il pose les questions et
 * affiche l'outil adapté). Les enregistrements passent par l'API existante, jamais par le modèle.
 */
export function AssistantChat() {
  const { pathname } = useLocation();
  const { t, locale, dir } = useAdminLocale();
  const { store, refresh: refreshTenant, loadFromAdminSession } = useTenant();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const tenantKey = storageKeyFor(store?.fournisseurId);
  const [chatStore, setChatStore] = useState<ChatStore>(() => loadStore(tenantKey));
  const [loadedKey, setLoadedKey] = useState(tenantKey);
  const [showHistory, setShowHistory] = useState(false);
  const [fabHidden, setFabHidden] = useState(() => {
    try {
      return localStorage.getItem(FAB_HIDDEN_KEY) === '1';
    } catch {
      return false;
    }
  });
  const storeRef = useRef(chatStore);
  storeRef.current = chatStore;
  useEffect(() => {
    if (tenantKey === loadedKey) return;
    setLoadedKey(tenantKey);
    setShowHistory(false);
    const loaded = loadStore(tenantKey);
    storeRef.current = loaded;
    setChatStore(loaded);
  }, [tenantKey, loadedKey]);
  const active = chatStore.items.find((c) => c.id === chatStore.active) ?? chatStore.items[0];
  const entries = active.entries;
  /** Met à jour les messages de la conversation active et les enregistre pour la boutique courante. */
  const setEntries = (update: Entry[] | ((prev: Entry[]) => Entry[])) => {
    const cur = storeRef.current;
    const conv = cur.items.find((c) => c.id === cur.active) ?? cur.items[0];
    const nextEntries = typeof update === 'function' ? update(conv.entries) : update;
    const next: ChatStore = {
      ...cur,
      items: cur.items.map((c) =>
        c.id === conv.id ? { ...c, entries: nextEntries, title: c.title || titleFrom(nextEntries) } : c,
      ),
    };
    storeRef.current = next;
    setChatStore(next);
    saveStore(tenantKey, next);
  };
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [flowStep, setFlowStep] = useState<string | null>(null);
  // Parcours « de A à Z » : enchaîne les parcours existants, chacun pouvant être lancé, passé ou arrêté.
  const atz = useRef({ active: false, idx: -1, running: false });
  const atzAdvance = useRef<() => void>(() => undefined);
  /** Fin d'un parcours (étape remise à zéro) : si le A à Z est en cours, on propose l'étape suivante. */
  const stepWatch = (step: string | null) => {
    setFlowStep(step);
    if (step === null && atz.current.active && atz.current.running) {
      atz.current.running = false;
      window.setTimeout(() => atzAdvance.current(), 700);
    }
  };
  /** Étape du A à Z affichée dans la barre de progression (null : parcours inactif). */
  const [atzIdx, setAtzIdx] = useState<number | null>(null);
  const stopAtz = () => {
    atz.current = { active: false, idx: -1, running: false };
    setAtzIdx(null);
  };
  const [busy, setBusy] = useState(false);
  const [showAllFlows, setShowAllFlows] = useState(false);
  // Rempli à chaque rendu : lance un parcours demandé depuis un autre écran (ex. liste « Premiers pas »).
  const runFlow = useRef<((id: AssistantFlowId) => void) | null>(null);
  const [logoPalette, setLogoPalette] = useState<LogoPalette | null>(null);
  const queue = useRef<FlowStepId[]>([]);
  const endRef = useRef<HTMLDivElement>(null);

  const { data: status } = useQuery({
    queryKey: ['assistant-status'],
    queryFn: assistantApi.status,
    staleTime: Infinity,
    retry: false,
  });

  const push = (...added: Entry[]) =>
    setEntries((prev) => [...prev, ...added]);

  const clearWidgets = () => setEntries((prev) => prev.map((e) => (e.widget ? { ...e, widget: undefined } : e)));

  const tools = useAssistantTools({
    t,
    busy,
    setBusy,
    push,
    clearWidgets,
    refresh: async () => {
      await queryClient.invalidateQueries({
        predicate: (q) => /store-settings|categor|product|store-pages/i.test(JSON.stringify(q.queryKey)),
      });
      await refreshTenant();
      await loadFromAdminSession();
    },
  });

  const chat = useMutation({
    mutationFn: (history: Entry[]) =>
      assistantApi.chat(
        history.map(({ role, content }) => ({ role, content })),
        pathname,
        locale,
        flowStep ?? undefined,
      ),
    onSuccess: ({ reply, actions }) => tools.handleReply(reply, actions),
    onError: (e: unknown) => {
      // apiRequest renvoie ce texte générique quand la réponse n'a pas de message exploitable
      // (ex. 504 HTML de nginx quand le modèle met trop de temps à répondre).
      const msg = e instanceof Error ? e.message : '';
      setError(!msg || msg === 'Une erreur est survenue' ? t('assistant.errorSlow') : msg);
    },
  });

  /** Met à jour le cache et la session avec des réglages déjà renvoyés par le serveur. */
  const applySettings = async (settings: StoreSettingsDTO) => {
    queryClient.setQueryData(SETTINGS_KEY, settings);
    await refreshTenant();
    await loadFromAdminSession();
  };

  const saveSettings = async (payload: UpdateStoreSettingsRequest) => {
    const updated = await platformApi.updateMyStoreSettings(payload);
    await applySettings(updated);
    return updated;
  };

  const catalog = useCatalogFlow({
    t,
    lang: locale,
    busy,
    setBusy,
    push,
    clearWidgets,
    setStep: stepWatch,
    storeName: store?.siteName,
    invalidate: () =>
      void queryClient.invalidateQueries({ predicate: (q) => /categor|product/i.test(JSON.stringify(q.queryKey)) }),
  });

  const design = useDesignFlow({
    t,
    busy,
    setBusy,
    push,
    clearWidgets,
    setStep: stepWatch,
    planCode: store?.planCode,
    saveSettings,
    invalidate: () =>
      void queryClient.invalidateQueries({
        predicate: (q) => /store-pages|store-settings/i.test(JSON.stringify(q.queryKey)),
      }),
  });

  const shipping = useShippingFlow({
    t,
    busy,
    setBusy,
    push,
    clearWidgets,
    setStep: stepWatch,
    invalidate: () =>
      void queryClient.invalidateQueries({ predicate: (q) => /shipping/i.test(JSON.stringify(q.queryKey)) }),
  });

  const marketing = useMarketingFlow({
    t,
    lang: locale,
    busy,
    setBusy,
    push,
    clearWidgets,
    setStep: stepWatch,
    saveSettings,
    invalidate: () =>
      void queryClient.invalidateQueries({
        predicate: (q) => /store-pages|store-settings|categor|promo/i.test(JSON.stringify(q.queryKey)),
      }),
  });

  const growth = useGrowthFlow({
    t,
    lang: locale,
    busy,
    setBusy,
    push,
    clearWidgets,
    setStep: stepWatch,
    saveSettings,
    applySettings,
  });

  const compliance = useComplianceFlow({
    t,
    busy,
    setBusy,
    push,
    clearWidgets,
    setStep: stepWatch,
    saveSettings,
    invalidate: () =>
      void queryClient.invalidateQueries({ predicate: (q) => /store-pages|store-settings/i.test(JSON.stringify(q.queryKey)) }),
  });

  const manage = useManageFlow({
    t,
    busy,
    setBusy,
    push,
    clearWidgets,
    setStep: stepWatch,
    invalidate: () =>
      void queryClient.invalidateQueries({ predicate: (q) => /product|categor/i.test(JSON.stringify(q.queryKey)) }),
  });

  const content = useContentFlow({
    t,
    lang: locale,
    busy,
    setBusy,
    push,
    clearWidgets,
    setStep: stepWatch,
    saveSettings,
    invalidate: () =>
      void queryClient.invalidateQueries({ predicate: (q) => /store-pages|store-settings/i.test(JSON.stringify(q.queryKey)) }),
  });

  const logoFlow = useLogoFlow({
    t,
    busy,
    setBusy,
    push,
    clearWidgets,
    setStep: stepWatch,
    saveSettings,
    invalidate: () =>
      void queryClient.invalidateQueries({ predicate: (q) => /store-settings|tenant|storefront/i.test(JSON.stringify(q.queryKey)) }),
  });

  const payments = usePaymentsFlow({
    t,
    busy,
    setBusy,
    push,
    clearWidgets,
    setStep: stepWatch,
    saveSettings,
    applySettings,
  });

  // Seul le dernier outil affiché reste actif (une question libre peut s'intercaler dans la conversation).
  let widgetIndex = -1;
  entries.forEach((e, i) => {
    if (e.widget) widgetIndex = i;
  });

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ block: 'end' });
  }, [open, entries, chat.isPending]);

  // Palette du logo déjà en ligne : lue seulement quand le chat est ouvert, sans erreur si l'image n'est pas lisible.
  const existingLogo = store?.logoUrl;
  useEffect(() => {
    if (!open || logoPalette || !existingLogo) return;
    let cancelled = false;
    void paletteFromUrl(existingLogo).then((p) => {
      if (!cancelled && p) setLogoPalette(p);
    });
    return () => {
      cancelled = true;
    };
  }, [open, existingLogo, logoPalette]);

  // Rappel discret : nombre d'étapes de base encore à faire, tant que le chat n'a pas été ouvert pendant cette session.
  /** Chat libre (LLM) : peut être coupé ; les parcours guidés restent disponibles. */
  const aiChatEnabled = status?.enabled === true;

  const { data: nudgeSettings } = useQuery({
    queryKey: SETTINGS_KEY,
    queryFn: () => platformApi.getMyStoreSettings(),
    enabled: !open,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
  const pendingSteps = nudgeSettings
    ? buildFlow(nudgeSettings, nudgeSettings.planCode ?? store?.planCode).filter(
        (s) => s !== 'colors' && s !== 'whatsappBusiness',
      ).length
    : 0;
  const showNudge = pendingSteps > 0 && !nudgeSeen();

  useEffect(() => {
    const onFlow = (e: Event) => {
      const flow = (e as CustomEvent<{ flow: AssistantFlowId }>).detail?.flow;
      if (!flow) return;
      markNudgeSeen();
      setOpen(true);
      runFlow.current?.(flow);
    };
    window.addEventListener(ASSISTANT_FLOW_EVENT, onFlow);
    return () => window.removeEventListener(ASSISTANT_FLOW_EVENT, onFlow);
  }, []);

  // ───────────── Configuration guidée ─────────────

  const askNext = () => {
    const next = queue.current.shift();
    if (!next) {
      stepWatch(null);
      push({ role: 'assistant', content: t('assistant.flow.done') });
      return;
    }
    setFlowStep(next);
    push({ role: 'assistant', content: t(ASK_KEY[next]), widget: widgetForStep(next) });
  };

  const startFlow = async () => {
    setError(null);
    setBusy(true);
    try {
      const settings = await queryClient.fetchQuery({
        queryKey: SETTINGS_KEY,
        queryFn: () => platformApi.getMyStoreSettings(),
        staleTime: 0,
      });
      queue.current = buildFlow(settings, settings.planCode ?? store?.planCode);
      push(
        { role: 'user', content: t('assistant.flow.start') },
        { role: 'assistant', content: t('assistant.flow.intro') },
      );
      askNext();
    } catch {
      setError(t('assistant.flow.error'));
    } finally {
      setBusy(false);
    }
  };

  /** Enregistre la réponse puis passe à l'étape suivante ; en cas d'échec, redemande la même chose. */
  const answer = async (
    echo: string,
    retry: FlowWidget,
    save: () => Promise<unknown>,
    doneKey: AdminMessageKey,
  ) => {
    clearWidgets();
    push({ role: 'user', content: echo });
    setBusy(true);
    try {
      await save();
      push({ role: 'assistant', content: t(doneKey) });
      askNext();
    } catch {
      push({ role: 'assistant', content: t('assistant.flow.error'), widget: retry });
    } finally {
      setBusy(false);
    }
  };

  const skip = () => {
    clearWidgets();
    push({ role: 'user', content: t('assistant.flow.skip') });
    askNext();
  };

  const invalid = (widget: FlowWidget) => push({ role: 'assistant', content: t('assistant.flow.invalid'), widget });

  const onYes = (w: Extract<FlowWidget, { kind: 'yesno' }>) => {
    if (w.stepId === 'logo') {
      clearWidgets();
      push(
        { role: 'user', content: t('assistant.flow.yes') },
        { role: 'assistant', content: t('assistant.flow.logo.upload'), widget: { kind: 'upload', stepId: 'logo' } },
      );
    } else if (w.stepId === 'cod') {
      void answer(t('assistant.flow.yes'), w, () => saveSettings({ paymentCodEnabled: true }), 'assistant.flow.cod.done');
    } else if (w.stepId === 'whatsappBusiness') {
      clearWidgets();
      push(
        { role: 'user', content: t('assistant.flow.yes') },
        {
          role: 'assistant',
          content: t('assistant.flow.wab.hint'),
          widget: { kind: 'link', stepId: 'whatsappBusiness', href: '/admin/reglages' },
        },
      );
    }
  };

  const onText = (w: Extract<FlowWidget, { kind: 'text' }>, value: string) => {
    switch (w.stepId) {
      case 'tagline':
        return void answer(value, w, () => saveSettings({ tagline: value }), 'assistant.flow.saved');
      case 'phone':
        return isPhone(value)
          ? void answer(value, w, () => saveSettings({ contactPhone: value }), 'assistant.flow.saved')
          : invalid(w);
      case 'whatsapp':
        return isPhone(value)
          ? void answer(value, w, () => saveSettings({ contactWhatsapp: value }), 'assistant.flow.saved')
          : invalid(w);
      case 'freeShipping': {
        const amount = parseAmount(value);
        return amount !== null
          ? void answer(value, w, () => saveSettings({ freeShippingThreshold: amount }), 'assistant.flow.saved')
          : invalid(w);
      }
    }
  };

  const flowList: { key: AssistantFlowId; label: string; Icon: typeof Wand2; run: () => void }[] = [
    { key: 'atz', label: t('assistant.atz.start'), Icon: Rocket, run: () => startAtz() },
    { key: 'basics', label: t('assistant.flow.start'), Icon: Wand2, run: () => void startFlow() },
    { key: 'catalog', label: t('assistant.catalog.start'), Icon: FolderTree, run: () => void catalog.start() },
    { key: 'design', label: t('assistant.design.start'), Icon: Palette, run: () => void design.start() },
    { key: 'logo', label: t('assistant.logo.start'), Icon: ImagePlus, run: () => void logoFlow.start() },
    { key: 'shipping', label: t('assistant.ship.start'), Icon: Truck, run: () => void shipping.start() },
    { key: 'marketing', label: t('assistant.mkt.start'), Icon: Megaphone, run: () => void marketing.start() },
    { key: 'growth', label: t('assistant.growth.start'), Icon: Crown, run: () => void growth.start() },
    { key: 'legal', label: t('assistant.legal.start'), Icon: ShieldCheck, run: () => void compliance.start() },
    { key: 'manage', label: t('assistant.manage.start'), Icon: PencilLine, run: () => manage.start() },
    { key: 'content', label: t('assistant.content.start'), Icon: BookOpen, run: () => void content.start() },
    { key: 'payments', label: t('assistant.pay.start'), Icon: CreditCard, run: () => void payments.start() },
  ];
  // Ordre du A à Z : l'essentiel d'abord, puis l'identité, le contenu, le catalogue, la vente et la conformité.
  const ATZ_ORDER: AssistantFlowId[] = ['basics', 'logo', 'design', 'content', 'catalog', 'shipping', 'payments', 'legal', 'marketing'];
  const atzLabel = (key: AssistantFlowId) => flowList.find((f) => f.key === key)?.label ?? key;

  atzAdvance.current = () => {
    const state = atz.current;
    if (!state.active) return;
    state.idx += 1;
    state.running = false;
    setAtzIdx(state.idx < ATZ_ORDER.length ? state.idx : null);
    if (state.idx >= ATZ_ORDER.length) {
      stopAtz();
      setFlowStep(null);
      push({ role: 'assistant', content: t('assistant.atz.done') });
      return;
    }
    push({
      role: 'assistant',
      content: t('assistant.atz.step', { n: state.idx + 1, total: ATZ_ORDER.length, name: atzLabel(ATZ_ORDER[state.idx]) }),
      widget: { kind: 'atz' },
    });
  };

  const startAtz = () => {
    atz.current = { active: true, idx: -1, running: false };
    push({ role: 'user', content: t('assistant.atz.start') }, { role: 'assistant', content: t('assistant.atz.intro') });
    atzAdvance.current();
  };

  const atzGo = () => {
    const key = ATZ_ORDER[atz.current.idx];
    clearWidgets();
    push({ role: 'user', content: t('assistant.atz.go') });
    atz.current.running = true;
    flowList.find((f) => f.key === key)?.run();
  };
  const atzSkip = () => {
    clearWidgets();
    push({ role: 'user', content: t('assistant.flow.skip') });
    atzAdvance.current();
  };
  const atzStop = () => {
    clearWidgets();
    push({ role: 'user', content: t('assistant.atz.stop') }, { role: 'assistant', content: t('assistant.atz.stopped') });
    stopAtz();
    setFlowStep(null);
  };

  runFlow.current = (id) => (id === 'atz' ? startAtz() : flowList.find((f) => f.key === id)?.run());
  // Écran d'accueil du chat : les 6 parcours essentiels, les autres derrière « Plus de parcours ».
  const visibleFlows = showAllFlows ? flowList : flowList.slice(0, 6);

  const renderWidget = (w: AnyWidget): ReactNode => {
    switch (w.kind) {
      case 'yesno':
        return <YesNoWidget busy={busy} onYes={() => onYes(w)} onNo={skip} />;
      case 'upload':
        return (
          <UploadWidget
            busy={busy}
            onSkip={skip}
            onFile={(file) => {
              void paletteFromFile(file).then((p) => p && setLogoPalette(p));
              void answer(
                file.name,
                w,
                async () => saveSettings({ logoUrl: await uploadImage(file) }),
                'assistant.flow.logo.done',
              );
            }}
          />
        );
      case 'colors':
        return (
          <ColorsWidget
            busy={busy}
            logoPalette={logoPalette}
            onSkip={skip}
            onApply={(primary, secondary) =>
              void answer(
                primary,
                w,
                () => saveSettings({ primaryColor: primary, secondaryColor: secondary }),
                'assistant.flow.colors.done',
              )
            }
          />
        );
      case 'text':
        return (
          <TextWidget
            key={`${w.stepId}-${entries.length}`}
            busy={busy}
            onSkip={skip}
            onSubmit={(value) => onText(w, value)}
            inputMode={w.stepId === 'phone' || w.stepId === 'whatsapp' ? 'tel' : w.stepId === 'freeShipping' ? 'decimal' : 'text'}
            placeholder={t(
              w.stepId === 'tagline'
                ? 'assistant.flow.tagline.placeholder'
                : w.stepId === 'freeShipping'
                  ? 'assistant.flow.shipping.placeholder'
                  : 'assistant.flow.phone.placeholder',
            )}
          />
        );
      case 'link':
        return <LinkWidget href={w.href} openLabel={t('assistant.flow.wab.open')} onContinue={() => { clearWidgets(); push({ role: 'user', content: t('assistant.flow.continue') }); askNext(); }} />;
      default:
        if (isCatalogWidget(w)) return catalog.renderWidget(w);
        if (isDesignWidget(w)) return design.renderWidget(w);
        if (isShippingWidget(w)) return shipping.renderWidget(w);
        if (isMarketingWidget(w)) return marketing.renderWidget(w);
        if (isGrowthWidget(w)) return growth.renderWidget(w);
        if (isLegalWidget(w)) return compliance.renderWidget(w);
        if (isManageWidget(w)) return manage.renderWidget(w);
        if (isContentWidget(w)) return content.renderWidget(w);
        if (isLogoWidget(w)) return logoFlow.renderWidget(w);
        if (isAtzWidget(w)) {
          return (
            <div className="mt-2 flex flex-wrap gap-2">
              <Button type="button" size="sm" disabled={busy} onClick={atzGo}>
                {t('assistant.atz.go')}
              </Button>
              <Button type="button" size="sm" variant="outline" disabled={busy} onClick={atzSkip}>
                {t('assistant.flow.skip')}
              </Button>
              <Button type="button" size="sm" variant="ghost" disabled={busy} onClick={atzStop}>
                {t('assistant.atz.stop')}
              </Button>
            </div>
          );
        }
        if (isToolWidget(w)) return tools.renderWidget(w);
        return payments.renderWidget(w);
    }
  };

  // ───────────── Conversation libre ─────────────

  const send = (text: string) => {
    const content = text.trim().slice(0, MAX_INPUT);
    if (!content || chat.isPending) return;
    if (!aiChatEnabled) {
      setError(t('assistant.aiDisabled'));
      return;
    }
    if (looksLikeSecret(content)) {
      setInput('');
      setError(t('assistant.secret.blocked'));
      return;
    }
    const next: Entry[] = [...entries, { role: 'user', content }];
    setEntries(next);
    setInput('');
    setError(null);
    chat.mutate(next);
  };

  const reset = () => {
    stopAtz();
    queue.current = [];
    setFlowStep(null);
    setEntries([]);
    setError(null);
  };

  const commit = (next: ChatStore) => {
    storeRef.current = next;
    setChatStore(next);
    saveStore(tenantKey, next);
  };

  const startConversation = () => {
    stopAtz();
    queue.current = [];
    setFlowStep(null);
    setError(null);
    setShowHistory(false);
    const cur = storeRef.current;
    // Une conversation vide existe déjà : on la réutilise plutôt que d'en empiler.
    const empty = cur.items.find((c) => c.entries.length === 0);
    const conv = empty ?? newConversation();
    commit({ active: conv.id, items: empty ? cur.items : [conv, ...cur.items].slice(0, MAX_CONVERSATIONS) });
  };

  const switchConversation = (id: string) => {
    stopAtz();
    queue.current = [];
    setFlowStep(null);
    setError(null);
    setShowHistory(false);
    commit({ ...storeRef.current, active: id });
  };

  const deleteConversation = (id: string) => {
    const cur = storeRef.current;
    let items = cur.items.filter((c) => c.id !== id);
    if (items.length === 0) items = [newConversation()];
    commit({ active: items.some((c) => c.id === cur.active) ? cur.active : items[0].id, items });
  };

  const setFabVisibility = (hidden: boolean) => {
    setFabHidden(hidden);
    try {
      localStorage.setItem(FAB_HIDDEN_KEY, hidden ? '1' : '0');
    } catch {
      /* préférence non conservée */
    }
  };

  return (
    <>
      {!open && fabHidden ? (
        <button
          type="button"
          onClick={() => setFabVisibility(false)}
          aria-label={t('assistant.showFab')}
          title={t('assistant.showFab')}
          className="fixed bottom-4 end-0 z-40 flex h-10 w-3 items-center justify-center rounded-s-md bg-primary/50 text-primary-foreground opacity-60 transition hover:w-5 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          <MessageCircle className="h-3 w-3" aria-hidden />
        </button>
      ) : !open ? (
        <div className="group fixed bottom-4 end-4 z-40">
          <button
            type="button"
            onClick={() => setFabVisibility(true)}
            aria-label={t('assistant.hideFab')}
            title={t('assistant.hideFab')}
            className="absolute -start-2 -top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full border bg-background text-muted-foreground shadow transition hover:text-foreground focus-visible:opacity-100 max-sm:opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
          >
            <X className="h-3 w-3" aria-hidden />
          </button>
        <button
          type="button"
          onClick={() => {
            markNudgeSeen();
            setOpen(true);
          }}
          aria-label={t('assistant.openAria')}
          className="relative flex h-12 items-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground shadow-lg transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          <MessageCircle className="h-5 w-5" aria-hidden />
          <span className="hidden sm:inline">{t('assistant.fab')}</span>
          {showNudge ? (
            <span
              className="absolute -end-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[11px] font-semibold text-destructive-foreground"
              title={t('assistant.nudge', { n: pendingSteps })}
            >
              {pendingSteps}
              <span className="sr-only">{t('assistant.nudge', { n: pendingSteps })}</span>
            </span>
          ) : null}
        </button>
        </div>
      ) : (
        <section
          role="dialog"
          aria-label={t('assistant.title')}
          dir={dir}
          className="fixed bottom-4 end-4 z-40 flex h-[min(34rem,calc(100vh-2rem))] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-xl border bg-background shadow-2xl"
        >
          <header className="flex items-center justify-between gap-2 border-b bg-primary/5 px-3 py-2.5">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="h-4 w-4 text-primary" aria-hidden />
              {t('assistant.title')}
            </div>
            <div className="flex items-center gap-1">
              <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={startConversation} aria-label={t('assistant.newChat')} title={t('assistant.newChat')}>
                <Plus className="h-4 w-4" aria-hidden />
              </Button>
              {chatStore.items.length > 1 ? (
                <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowHistory((v) => !v)} aria-expanded={showHistory} aria-label={t('assistant.history')} title={t('assistant.history')}>
                  <History className="h-4 w-4" aria-hidden />
                </Button>
              ) : null}
              {entries.length > 0 ? (
                <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={reset} aria-label={t('assistant.clear')} title={t('assistant.clear')}>
                  <Trash2 className="h-4 w-4" aria-hidden />
                </Button>
              ) : null}
              <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => setOpen(false)} aria-label={t('assistant.close')}>
                <X className="h-4 w-4" aria-hidden />
              </Button>
            </div>
          </header>

          {showHistory ? (
            <ul className="max-h-48 divide-y overflow-y-auto border-b bg-background text-sm" aria-label={t('assistant.history')}>
              {chatStore.items.map((c) => (
                <li key={c.id} className={cn('flex items-center gap-1 px-2', c.id === active.id && 'bg-primary/5')}>
                  <button type="button" className="min-w-0 flex-1 truncate py-2 text-start" onClick={() => switchConversation(c.id)}>
                    {c.title || t('assistant.untitled')}
                  </button>
                  <Button type="button" variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => deleteConversation(c.id)} aria-label={t('assistant.deleteChat')} title={t('assistant.deleteChat')}>
                    <Trash2 className="h-3.5 w-3.5" aria-hidden />
                  </Button>
                </li>
              ))}
            </ul>
          ) : null}

          <div className="flex-1 space-y-3 overflow-y-auto p-3 text-sm" aria-live="polite">
            {entries.length === 0 ? (
              <div className="space-y-3">
                <p className="text-muted-foreground">{t('assistant.intro')}</p>
                {visibleFlows.map(({ key, label, Icon, run }, i) => (
                  <Button
                    key={key}
                    type="button"
                    variant={i === 0 ? 'default' : 'outline'}
                    className="w-full justify-start"
                    onClick={run}
                    disabled={busy}
                  >
                    {busy && i === 0 ? <Loader2 className="me-2 h-4 w-4 animate-spin" aria-hidden /> : <Icon className="me-2 h-4 w-4" aria-hidden />}
                    {label}
                  </Button>
                ))}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  aria-expanded={showAllFlows}
                  onClick={() => setShowAllFlows((v) => !v)}
                >
                  {showAllFlows ? t('assistant.flows.less') : t('assistant.flows.more')}
                </Button>
                {aiChatEnabled ? (
                  <div className="flex flex-col gap-2">
                    {suggestionsFor(pathname).map((key) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => send(t(key))}
                        className="rounded-lg border px-3 py-2 text-start text-sm transition hover:bg-primary/5"
                      >
                        {t(key)}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
                    {t('assistant.aiDisabled')}
                  </p>
                )}
              </div>
            ) : (
              entries.map((m, i) => (
                <div key={i} className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
                  <div
                    className={cn(
                      'max-w-[92%] whitespace-pre-wrap rounded-2xl px-3 py-2 leading-relaxed',
                      m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted',
                    )}
                  >
                    {m.role === 'assistant' ? linkify(m.content, () => setOpen(false)) : m.content}
                    {i === widgetIndex && m.widget ? <div className="whitespace-normal">{renderWidget(m.widget)}</div> : null}
                  </div>
                </div>
              ))
            )}
            {chat.isPending ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                {t('assistant.thinking')}
              </div>
            ) : null}
            {error ? (
              <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-destructive">
                {error}
              </p>
            ) : null}
            <div ref={endRef} />
          </div>

          {atzIdx !== null ? (
            <div className="flex items-center justify-between gap-2 border-t bg-primary/5 px-3 py-1.5 text-xs">
              <span className="font-medium">
                {t('assistant.atz.step', { n: atzIdx + 1, total: ATZ_ORDER.length, name: atzLabel(ATZ_ORDER[atzIdx]) })}
              </span>
              <span className="flex shrink-0 gap-1">
                <Button type="button" variant="ghost" size="sm" className="h-6 px-2 text-xs" disabled={busy} onClick={atzSkip}>
                  {t('assistant.flow.skip')}
                </Button>
                <Button type="button" variant="ghost" size="sm" className="h-6 px-2 text-xs" disabled={busy} onClick={atzStop}>
                  {t('assistant.atz.stop')}
                </Button>
              </span>
            </div>
          ) : null}

          <form
            className="flex items-end gap-2 border-t p-2"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              maxLength={MAX_INPUT}
              rows={2}
              disabled={!aiChatEnabled}
              placeholder={aiChatEnabled ? t('assistant.placeholder') : t('assistant.aiDisabled')}
              aria-label={t('assistant.inputLabel')}
              className="min-h-[2.5rem] flex-1 resize-none rounded-md border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!aiChatEnabled || !input.trim() || chat.isPending}
              aria-label={t('assistant.send')}
            >
              <Send className="h-4 w-4" aria-hidden />
            </Button>
          </form>
        </section>
      )}
    </>
  );
}

