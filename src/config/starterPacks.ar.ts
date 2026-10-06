import type { StarterPack } from '@/config/starterPacks';

type ArProduct = { name: string; short: string; description: string };
type ArPack = {
  label: string;
  description: string;
  categories: Record<string, { name: string; description: string }>;
  products: Record<string, ArProduct>;
};

/** Noms et descriptions arabes des packs marocains (les prix restent en MAD). */
export const STARTER_PACK_AR: Record<string, ArPack> = {
  artisanat: {
    label: 'الصناعة التقليدية المغربية',
    description: 'فخار وزليج وجلد وزربي ونحاس مصنوعون يدويًا.',
    categories: {
      'poterie-zellige': { name: 'فخار وزليج', description: 'طواجن وصحون وقطع من الزليج.' },
      'cuir-textile': { name: 'جلد ونسيج', description: 'بلغة وبوف وزربي وأغطية.' },
      'cuivre-decoration': { name: 'نحاس وديكور', description: 'فوانيس وصواني شاي وقطع ديكور.' },
    },
    products: {
      'Tajine en terre cuite décoré': {
        name: 'طاجين فخار مزيّن',
        short: 'قطر 30 سم، صناعة يدوية من آسفي.',
        description: 'طاجين من الفخار المطلي والمرسوم يدويًا. يصلح للطبخ وللتقديم على المائدة.',
      },
      'Plat en zellige fait main': {
        name: 'طبق زليج مصنوع يدويًا',
        short: 'قطر 25 سم، نقوش هندسية.',
        description: 'طبق زينة من فسيفساء الزليج المنحوت يدويًا في فاس. كل قطعة فريدة.',
      },
      'Babouches en cuir véritable': {
        name: 'بلغة من الجلد الطبيعي',
        short: 'نعل جلد، عدة ألوان.',
        description: 'بلغة تقليدية من الجلد المدبوغ، مخيطة يدويًا. متوفرة بالأصفر والأبيض وألوان زاهية.',
      },
      'Pouf en cuir tressé': {
        name: 'بوف جلد مضفور',
        short: 'محشو، قطر 50 سم.',
        description: 'بوف من جلد الماعز مضفور يدويًا، يُسلَّم محشوًا. مناسب للصالون أو غرفة النوم.',
      },
      'Tapis berbère en laine': {
        name: 'زربية أمازيغية من الصوف',
        short: '120 × 180 سم، منسوجة يدويًا.',
        description: 'زربية أمازيغية من الصوف الخالص، منسوجة يدويًا في الأطلس. نقوش معيّنة، دافئة ومتينة.',
      },
      'Lanterne en cuivre ajouré': {
        name: 'فانوس نحاس مخرّم',
        short: 'ارتفاع 35 سم، للشمعة.',
        description: 'فانوس مغربي من النحاس المنقوش يعكس ضوءًا جميلًا. الشمعة غير مرفقة.',
      },
      'Plateau à thé en cuivre martelé': {
        name: 'صينية شاي من النحاس المطروق',
        short: 'قطر 45 سم.',
        description: 'صينية شاي كبيرة من النحاس المطروق والمنقوش، مناسبة للتقديم التقليدي.',
      },
    },
  },
  traditionnel: {
    label: 'الأزياء التقليدية',
    description: 'قفاطن وتكشيطات وجلابيب وقنادر.',
    categories: {
      'caftans-takchitas': { name: 'قفاطن وتكشيطات', description: 'ألبسة الأعياد والأعراس.' },
      'djellabas-gandouras': { name: 'جلابيب وقنادر', description: 'ألبسة يومية للنساء والرجال.' },
    },
    products: {
      'Caftan brodé main': {
        name: 'قفطان مطرز يدويًا',
        short: 'ساتان وتطريز السفيفة.',
        description: 'قفطان من الساتان بتطريز السفيفة اليدوي. الحزام الموافق مرفق. يمكن تفصيله حسب المقاس.',
      },
      'Takchita deux pièces perlée': {
        name: 'تكشيطة من قطعتين باللؤلؤ',
        short: 'داخلية وخارجية، لؤلؤ.',
        description: 'تكشيطة من قطعتين مزيّنة باللؤلؤ والخيوط، للأعراس والمناسبات الكبرى.',
      },
      'Caftan moderne en satin': {
        name: 'قفطان عصري من الساتان',
        short: 'قصة مستقيمة وأكمام واسعة.',
        description: 'قفطان بسيط وأنيق من الساتان المنساب، للدعوات والحفلات العائلية.',
      },
      'Djellaba femme à capuche': {
        name: 'جلابة نسائية بقلنسوة',
        short: 'قماش خفيف وتطريز بسيط.',
        description: 'جلابة مريحة بقلنسوة وسحاب وتطريز صغير في الأمام.',
      },
      'Gandoura d’été': {
        name: 'قندورة صيفية',
        short: 'قطن خفيف وأكمام قصيرة.',
        description: 'قندورة خفيفة ومريحة للأيام الحارة، سهلة الارتداء والعناية.',
      },
      'Djellaba homme en laine': {
        name: 'جلابة رجالية من الصوف',
        short: 'قلنسوة وقصة كلاسيكية.',
        description: 'جلابة للرجال من الصوف السميك، مناسبة للشتاء وبتشطيبات متقنة.',
      },
      'Ensemble jabador homme': {
        name: 'طقم جبادور رجالي',
        short: 'سترة وسروال من القطن.',
        description: 'طقم جبادور من قطعتين، لباس مناسب ليوم الجمعة والأعياد.',
      },
    },
  },
  naturel: {
    label: 'مستحضرات طبيعية والحمام',
    description: 'أركان وصابون بلدي وغاسول ومياه الزهور.',
    categories: {
      'argan-huiles': { name: 'أركان وزيوت', description: 'زيوت خالصة للبشرة والشعر.' },
      'hammam-soins': { name: 'الحمام والعناية', description: 'صابون بلدي وغاسول ومقشرات وحناء.' },
    },
    products: {
      'Huile d’argan cosmétique': {
        name: 'زيت الأركان التجميلي',
        short: 'قارورة زجاج 50 مل.',
        description: 'زيت أركان خالص 100٪ معصور على البارد من تعاونية. للبشرة والشعر والأظافر.',
      },
      'Huile de nigelle (Habba Sawda)': {
        name: 'زيت حبة البركة',
        short: 'قارورة 100 مل.',
        description: 'زيت بذور حبة البركة معصور على البارد، للاستعمال الخارجي على البشرة والشعر.',
      },
      'Savon beldi à l’eucalyptus': {
        name: 'صابون بلدي بالأوكالبتوس',
        short: 'علبة 200 غ.',
        description: 'صابون أسود بلدي بزيت الزيتون والأوكالبتوس، للحمام مع الكيس.',
      },
      'Ghassoul (rhassoul) naturel': {
        name: 'غاسول طبيعي',
        short: 'كيس 250 غ.',
        description: 'طين طبيعي من الأطلس للوجه والجسم والشعر. يُخلط بماء الورد.',
      },
      'Eau de rose de Kelaa M’Gouna': {
        name: 'ماء ورد قلعة مكونة',
        short: 'قارورة 250 مل.',
        description: 'ماء ورد مقطّر، منشط لطيف للوجه وعطر طبيعي.',
      },
      'Coffret hammam (savon, kessa, ghassoul)': {
        name: 'علبة حمام (صابون، كيس، غاسول)',
        short: 'علبة هدية.',
        description: 'علبة حمام: صابون بلدي وكيس وغاسول وماء ورد. مناسبة كهدية.',
      },
    },
  },
  patisserie: {
    label: 'حلويات وضيافة',
    description: 'حلويات مغربية وصواني وطلبات حسب الطلب.',
    categories: {
      'patisseries-marocaines': { name: 'حلويات مغربية', description: 'كعب الغزال والشباكية والسلو وغيرها.' },
      'plateaux-traiteur': { name: 'صواني وضيافة', description: 'صواني الأعياد والبريوات والأطباق الجاهزة.' },
    },
    products: {
      'Cornes de gazelle (500 g)': {
        name: 'كعب الغزال (500 غ)',
        short: 'لوز وماء الزهر.',
        description: 'كعب الغزال محشو بمعجون اللوز، يُحضَّر في اليوم نفسه.',
      },
      'Chebakia au miel (500 g)': {
        name: 'شباكية بالعسل (500 غ)',
        short: 'سمسم وعسل.',
        description: 'شباكية مقرمشة بالسمسم والعسل، من حلويات رمضان.',
      },
      'Sellou (Slilou) 500 g': {
        name: 'سلو 500 غ',
        short: 'لوز وسمسم ودقيق محمص.',
        description: 'سلو تقليدي باللوز والسمسم، غني بالطاقة.',
      },
      'Plateau de gâteaux assortis': {
        name: 'صينية حلويات مشكلة',
        short: '30 قطعة.',
        description: 'تشكيلة من 30 حلوى مغربية للأعراس والعيد والاستقبالات. الطلب قبل 48 ساعة.',
      },
      'Briouates salées (lot de 20)': {
        name: 'بريوات مالحة (20 قطعة)',
        short: 'دجاج أو كفتة.',
        description: 'بريوات ذهبية بالدجاج أو الكفتة، تُسخَّن في الفرن. الطلب قبل 24 ساعة.',
      },
      'Pastilla au poulet (6 personnes)': {
        name: 'بسطيلة بالدجاج (6 أشخاص)',
        short: 'لوز وقرفة.',
        description: 'بسطيلة بالدجاج واللوز، مورقة ومعطّرة، جاهزة للتسخين.',
      },
    },
  },
};

export function localizeStarterPack(pack: StarterPack, lang?: string | null): StarterPack {
  if (lang !== 'ar') return pack;
  const ar = STARTER_PACK_AR[pack.key];
  if (!ar) return pack;
  return {
    ...pack,
    label: ar.label,
    description: ar.description,
    categories: pack.categories.map((c) => {
      const t = ar.categories[c.slug];
      return t ? { ...c, name: t.name, description: t.description } : c;
    }),
    products: pack.products.map((p) => {
      const t = ar.products[p.name];
      return t
        ? { ...p, name: t.name, shortDescription: t.short, description: t.description }
        : p;
    }),
  };
}
