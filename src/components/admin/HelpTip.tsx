import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, HelpCircle, Lightbulb } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getHelpTopic } from '@/config/helpTopics';
import { cn } from '@/lib/utils';

type Props = {
  /** Clé dans `HELP_TOPICS`. */
  topic: string;
  className?: string;
};

/**
 * Petite icône « ? » : ouvre une fenêtre qui explique le réglage (à quoi ça sert, comment faire, conseils).
 */
export function HelpTip({ topic, className }: Props) {
  const [open, setOpen] = useState(false);
  const content = getHelpTopic(topic);
  if (!content) return null;

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        aria-label={`Aide : ${content.title}`}
        title={`Aide : ${content.title}`}
        className={cn(
          'inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
          className,
        )}
      >
        <HelpCircle className="h-4 w-4" aria-hidden />
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" aria-hidden />
              {content.title}
            </DialogTitle>
            <DialogDescription className="text-left text-sm leading-relaxed text-foreground/80">
              {content.summary}
            </DialogDescription>
          </DialogHeader>
          {content.steps?.length ? (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Comment faire</p>
              <ol className="space-y-2">
                {content.steps.map((step, i) => (
                  <li key={step} className="flex gap-2 text-sm">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}
          {content.tips?.length ? (
            <div className="rounded-lg bg-amber-50 p-3 text-amber-900">
              <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide">
                <Lightbulb className="h-3.5 w-3.5" aria-hidden />À savoir
              </p>
              <ul className="space-y-1">
                {content.tips.map((tip) => (
                  <li key={tip} className="flex gap-1.5 text-sm">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" aria-hidden />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {content.link ? (
            <Link
              to={content.link.href}
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-primary underline-offset-2 hover:underline"
            >
              {content.link.label} →
            </Link>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
