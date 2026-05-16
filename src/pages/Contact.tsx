import { useState } from 'react';
import Layout from '@/components/layout/Layout';

const CONTACT_WHATSAPP = 'https://wa.me/212600000000';
const CONTACT_INSTAGRAM = 'https://www.instagram.com/gold_yara_/';

const Contact = () => {
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

  return (
    <Layout>
      <div className="bg-ivory-warm bg-silk-texture min-h-screen">
        {/* Hero Section */}
        <section className="py-14 md:py-16 text-center">
        <div className="max-w-[1280px] mx-auto px-6">
          <span className="text-accent-beige uppercase tracking-[0.4em] text-xs mb-4 block">Service Client d'Excellence</span>
          <h2 className="text-5xl md:text-6xl font-display text-secondary-dark mb-6">Contactez-nous</h2>
          <div className="ornate-divider max-w-sm mx-auto">
            <span className="material-symbols-outlined text-primary text-xl">auto_awesome</span>
          </div>
          <p className="max-w-2xl mx-auto text-secondary-dark/70 leading-relaxed font-light text-lg italic">
            Pour toute demande d'information, conseil personnalisé ou création sur-mesure, nos experts joailliers sont à votre entière disposition.
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="pb-20 md:pb-24">
        <div className="max-w-5xl xl:max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 xl:gap-14 items-stretch">
            {/* Form */}
            <div className="bg-white p-8 sm:p-10 md:p-12 border border-accent-beige/20 shadow-xl flex flex-col min-h-0">
              <h3 className="text-2xl font-display mb-8 text-secondary-dark border-b border-primary/20 pb-4">Votre demande</h3>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col">
                    <label className="text-xs uppercase tracking-widest text-accent-beige mb-1">Nom Complet</label>
                    <input 
                      className="form-input-luxury" 
                      placeholder="M. Jean Dupont" 
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs uppercase tracking-widest text-accent-beige mb-1">Email</label>
                    <input 
                      className="form-input-luxury" 
                      placeholder="votre@email.com" 
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div className="border-b border-primary/30"></div>
                
                <div className="flex flex-col">
                  <label className="text-xs uppercase tracking-widest text-accent-beige mb-1">Téléphone</label>
                  <input 
                    className="form-input-luxury" 
                    placeholder="+212 6..." 
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="border-b border-primary/30"></div>
                
                <div className="flex flex-col">
                  <label className="text-xs uppercase tracking-widest text-accent-beige mb-1">Votre Message</label>
                  <textarea 
                    className="form-input-luxury resize-none" 
                    placeholder="Comment pouvons-nous vous accompagner ?" 
                    rows={4}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="border-b border-primary/30"></div>
                <div className="pt-4">
                  <button 
                    className="w-full bg-secondary-dark text-white px-8 py-4 text-sm uppercase tracking-widest font-bold hover:bg-primary transition-all duration-300 shadow-lg group flex items-center justify-center gap-3" 
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
              <div className="flex w-full flex-col bg-white p-8 sm:p-10 md:p-12 border border-accent-beige/20 shadow-xl">
                <header className="mb-8 border-b border-primary/20 pb-5">
                  <h3 className="text-2xl font-display text-secondary-dark">Une réponse rapide</h3>
                  <p className="mt-2 text-sm leading-relaxed text-secondary-dark/65">
                    Joignez-nous par téléphone, e-mail ou messagerie — nous revenons vers vous dans les meilleurs délais.
                  </p>
                </header>

                <div className="flex flex-1 flex-col gap-9">
                  <div className="space-y-3">
                    <h4 className="text-xs uppercase tracking-[0.3em] text-primary font-bold">Téléphone</h4>
                    <a
                      className="inline-flex w-fit max-w-full items-center gap-3 rounded-lg border border-accent-beige/25 bg-secondary-dark/[0.02] px-4 py-3 text-secondary-dark transition-colors hover:border-primary/40 hover:bg-primary/[0.04]"
                      href="tel:+212522000000"
                    >
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <span className="material-symbols-outlined text-primary text-xl">phone_iphone</span>
                      </span>
                      <span className="font-medium tracking-wide">+212 5 22 00 00 00</span>
                    </a>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs uppercase tracking-[0.3em] text-primary font-bold">Email</h4>
                    <a
                      className="inline-flex w-fit max-w-full items-center gap-3 rounded-lg border border-accent-beige/25 bg-secondary-dark/[0.02] px-4 py-3 text-secondary-dark transition-colors hover:border-primary/40 hover:bg-primary/[0.04]"
                      href="mailto:contact@goldyara.com"
                    >
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <span className="material-symbols-outlined text-primary text-xl">mail</span>
                      </span>
                      <span className="break-all font-medium">contact@goldyara.com</span>
                    </a>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs uppercase tracking-[0.3em] text-primary font-bold">Messagerie</h4>
                    <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-3">
                      <a
                        href={CONTACT_WHATSAPP}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-green-700/25 bg-green-50/90 px-4 py-3.5 text-sm font-semibold text-green-900 shadow-sm transition-all hover:border-green-700 hover:bg-green-700 hover:text-white"
                      >
                        <svg className="size-5 shrink-0 fill-current" viewBox="0 0 24 24" aria-hidden>
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                        WhatsApp
                      </a>
                      <a
                        href={CONTACT_INSTAGRAM}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-pink-900/15 bg-gradient-to-br from-amber-50/90 via-rose-50/80 to-fuchsia-50/90 px-4 py-3.5 text-sm font-semibold text-secondary-dark shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
                      >
                        <svg className="size-5 shrink-0 fill-current text-pink-900/90" viewBox="0 0 24 24" aria-hidden>
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z" />
                        </svg>
                        Instagram
                      </a>
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
        <div className="w-48 h-px bg-accent-beige/20 relative">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-3 rotate-45 border border-primary bg-white"></div>
        </div>
      </div>
      </div>
    </Layout>
  );
};

export default Contact;
