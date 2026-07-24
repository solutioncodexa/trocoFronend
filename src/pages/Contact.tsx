import { useState } from 'react';
import { Facebook, Instagram, Sparkles } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useSocialNetworks } from '@/hooks/useSocialNetworks';

import {
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_E164,
} from '@/config/site';

const Contact = () => {
  const { isEnabled, getUrl } = useSocialNetworks();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const inputClass =
    'w-full rounded-xl border border-input bg-card px-3.5 py-2.5 text-sm text-foreground shadow-soft placeholder:text-muted-foreground/80 hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:border-primary transition-colors';

  return (
    <Layout>
      <div className="bg-background min-h-screen animate-fade-in">
        {/* Hero Section */}
        <section className="py-14 md:py-16 text-center">
        <div className="max-w-[1280px] mx-auto px-6">
          <span className="text-primary uppercase tracking-[0.4em] text-xs mb-4 block font-semibold">Service Client d'Excellence</span>
          <h2 className="text-5xl md:text-6xl font-display text-foreground mb-6">Contactez-nous</h2>
          <div className="mx-auto my-6 flex max-w-sm items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <Sparkles className="h-5 w-5 text-primary" aria-hidden />
            <span className="h-px flex-1 bg-border" />
          </div>
          <p className="max-w-2xl mx-auto text-muted-foreground leading-relaxed text-lg">
            Pour toute demande d'information, conseil personnalisé ou emballage sur-mesure, notre équipe est à votre entière disposition.
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="pb-20 md:pb-24">
        <div className="max-w-5xl xl:max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 xl:gap-14 items-stretch">
            {/* Form */}
            <div className="bg-card rounded-2xl p-8 sm:p-10 md:p-12 border border-border shadow-card flex flex-col min-h-0">
              <h3 className="text-2xl font-display mb-8 text-foreground border-b border-border pb-4">Votre demande</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs uppercase tracking-widest text-muted-foreground">Nom Complet</label>
                    <input 
                      className={inputClass} 
                      placeholder="M. Jean Dupont" 
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs uppercase tracking-widest text-muted-foreground">Email</label>
                    <input 
                      className={inputClass} 
                      placeholder="votre@email.com" 
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Téléphone</label>
                  <input 
                    className={inputClass} 
                    placeholder="+212 6..." 
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Votre Message</label>
                  <textarea 
                    className={`${inputClass} resize-none`} 
                    placeholder="Comment pouvons-nous vous accompagner ?" 
                    rows={4}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                  />
                </div>

                <div className="pt-2">
                  <button 
                    className="w-full bg-primary text-primary-foreground rounded-2xl px-8 py-4 text-sm uppercase tracking-widest font-bold hover:bg-primary/90 transition-all duration-300 shadow-card group flex items-center justify-center gap-3" 
                    type="submit"
                  >
                    <span>Envoyer le message</span>
                    <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">east</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Contact Info — carte alignée sur le formulaire */}
            <aside className="flex min-h-0 w-full">
              <div className="flex w-full flex-col bg-card rounded-2xl p-8 sm:p-10 md:p-12 border border-border shadow-card">
                <header className="mb-8 border-b border-border pb-5">
                  <h3 className="text-2xl font-display text-foreground">Une réponse rapide</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Joignez-nous par téléphone, e-mail ou messagerie — nous revenons vers vous dans les meilleurs délais.
                  </p>
                </header>

                <div className="flex flex-1 flex-col gap-9">
                  <div className="space-y-3">
                    <h4 className="text-xs uppercase tracking-[0.3em] text-primary font-bold">Téléphone</h4>
                    <a
                      className="inline-flex w-fit max-w-full items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3 text-foreground transition-colors hover:border-primary/40 hover:bg-primary/[0.06]"
                      href={`tel:${CONTACT_PHONE_E164}`}
                    >
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <span className="material-symbols-outlined text-primary text-xl">phone_iphone</span>
                      </span>
                      <span className="font-medium tracking-wide">{CONTACT_PHONE_DISPLAY}</span>
                    </a>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs uppercase tracking-[0.3em] text-primary font-bold">Email</h4>
                    <a
                      className="inline-flex w-fit max-w-full items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3 text-foreground transition-colors hover:border-primary/40 hover:bg-primary/[0.06]"
                      href={`mailto:${CONTACT_EMAIL}`}
                    >
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <span className="material-symbols-outlined text-primary text-xl">mail</span>
                      </span>
                      <span className="break-all font-medium">{CONTACT_EMAIL}</span>
                    </a>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs uppercase tracking-[0.3em] text-primary font-bold">Messagerie</h4>
                    <div className="flex -space-x-2 overflow-hidden">
                      {isEnabled('facebook') && getUrl('facebook') ? (
                        <a href={getUrl('facebook')} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 ring-2 ring-card transition-colors hover:bg-blue-700 sm:h-10 sm:w-10">
                          <Facebook className="h-5 w-5 text-white" />
                        </a>
                      ) : null}
                      {isEnabled('instagram') && getUrl('instagram') ? (
                        <a href={getUrl('instagram')} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-600 ring-2 ring-card transition-colors hover:from-purple-700 hover:to-pink-700 sm:h-10 sm:w-10">
                          <Instagram className="h-5 w-5 text-white" />
                        </a>
                      ) : null}
                      {isEnabled('tiktok') && getUrl('tiktok') ? (
                        <a href={getUrl('tiktok')} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-foreground ring-2 ring-card transition-colors hover:bg-black sm:h-10 sm:w-10">
                          <svg className="h-5 w-5 text-background" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                          </svg>
                        </a>
                      ) : null}
                      {isEnabled('whatsapp') && getUrl('whatsapp') ? (
                        <a href={getUrl('whatsapp')} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-green-600 ring-2 ring-card transition-colors hover:bg-green-700 sm:h-10 sm:w-10">
                          <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                          </svg>
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="flex justify-center py-12">
        <div className="w-48 h-px bg-border relative">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-3 rotate-45 border border-primary bg-card"></div>
        </div>
      </div>
      </div>
    </Layout>
  );
};

export default Contact;
