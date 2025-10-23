export const FUNNEL_DEFINITIONS = [
  {
    id: 'funnel-1',
    name: 'Funnel 1',
    slug: 'funnel-1',
    description: 'Funil com vídeo inicial',
    component: () => import('../pages/funnel-1'),
    status: 'active',
    tags: ['vídeo', 'quiz'],
    steps: [
      { name: 'video', label: 'Vídeo', component: 'VideoStep' },
      { name: 'testimonials', label: 'Depoimentos', component: 'TestimonialsCarousel' },
      { name: 'name', label: 'Nome', component: 'NameCollection' },
      { name: 'birth', label: 'Data Nascimento', component: 'BirthDataCollection' },
      { name: 'love_situation', label: 'Situação Amorosa', component: 'LoveSituationStep' },
      { name: 'palm_reading', label: 'Leitura Palma', component: 'PalmReadingResults' },
      { name: 'revelation', label: 'Revelação', component: 'LoadingRevelation' },
      { name: 'paywall', label: 'Checkout', component: 'PaywallStep' }
    ]
  },
  {
    id: 'funnel-aff',
    name: 'Funnel Aff',
    slug: 'funnel-aff',
    description: 'Funil para afiliados',
    component: () => import('../pages/funnel-aff'),
    status: 'active',
    tags: ['afiliados', 'vídeo', 'quiz'],
    steps: [
      { name: 'video', label: 'Vídeo', component: 'VideoStep' },
      { name: 'testimonials', label: 'Depoimentos', component: 'TestimonialsCarousel' },
      { name: 'name', label: 'Nome', component: 'NameCollection' },
      { name: 'birth', label: 'Data Nascimento', component: 'BirthDataCollection' },
      { name: 'love_situation', label: 'Situação Amorosa', component: 'LoveSituationStep' },
      { name: 'palm_reading', label: 'Leitura Palma', component: 'PalmReadingResults' },
      { name: 'revelation', label: 'Revelação', component: 'LoadingRevelation' },
      { name: 'paywall', label: 'Checkout', component: 'PaywallStep' }
    ]
  },
  {
    id: 'funnel-tt',
    name: 'Funnel TT',
    slug: 'funnel-tt',
    description: 'Funil TikTok',
    component: () => import('../pages/funnel-tt'),
    status: 'active',
    tags: ['tiktok', 'vídeo'],
    steps: [
      { name: 'video', label: 'Vídeo', component: 'VideoStep' },
      { name: 'testimonials', label: 'Depoimentos', component: 'TestimonialsCarousel' },
      { name: 'name', label: 'Nome', component: 'NameCollection' },
      { name: 'birth', label: 'Data Nascimento', component: 'BirthDataCollection' },
      { name: 'love_situation', label: 'Situação Amorosa', component: 'LoveSituationStep' },
      { name: 'palm_reading', label: 'Leitura Palma', component: 'PalmReadingResults' },
      { name: 'revelation', label: 'Revelação', component: 'LoadingRevelation' },
      { name: 'paywall', label: 'Checkout', component: 'PaywallStep' }
    ]
  },
  {
    id: 'funnel-esp',
    name: 'Funnel ESP (Español)',
    slug: 'funnel-esp',
    description: 'Funil em Espanhol - versão completa traduzida',
    component: () => import('../pages/funnel-esp'),
    status: 'active',
    tags: ['espanhol', 'internacional', 'español'],
    steps: [
      { name: 'video', label: 'Vídeo', component: 'VideoStep' },
      { name: 'testimonials', label: 'Depoimentos', component: 'TestimonialsCarousel' },
      { name: 'name', label: 'Nome', component: 'NameCollection' },
      { name: 'birth', label: 'Data Nascimento', component: 'BirthDataCollection' },
      { name: 'love_situation', label: 'Situação Amorosa', component: 'LoveSituationStep' },
      { name: 'palm_reading', label: 'Leitura Palma', component: 'PalmReadingResults' },
      { name: 'revelation', label: 'Revelação', component: 'LoadingRevelation' },
      { name: 'paywall', label: 'Checkout', component: 'PaywallStep' }
    ]
  },
  {
    id: 'funnel-2',
    name: 'Funnel 2',
    slug: 'funnel-2',
    description: 'Funil 2 - Quiz astrológico completo',
    component: () => import('../pages/funnel-2'),
    status: 'active',
    tags: ['astrologia', 'quiz', 'soulmate'],
    steps: [
      { name: 'initiate', label: 'Iniciar', component: 'InitiateQuiz' },
      { name: 'testimonials', label: 'Depoimentos', component: 'TestimonialsCarousel' },
      { name: 'birth_date', label: 'Data Nascimento', component: 'BirthDateWithZodiac' },
      { name: 'love_situation', label: 'Situação Amorosa', component: 'LoveSituationStep' },
      { name: 'qualities', label: 'Qualidades Ideais', component: 'IdealPartnerQualities' },
      { name: 'preference', label: 'Preferências', component: 'PartnerPreference' },
      { name: 'chart_results', label: 'Mapa Astral', component: 'BirthChartResults' },
      { name: 'challenge', label: 'Desafios', component: 'LoveChallenge' },
      { name: 'desire', label: 'Desejos', component: 'LoveDesire' },
      { name: 'connection', label: 'Conexão', component: 'SoulmateConnection' },
      { name: 'love_language', label: 'Linguagem do Amor', component: 'LoveLanguage' },
      { name: 'energy', label: 'Energia', component: 'RelationshipEnergy' },
      { name: 'future', label: 'Futuro', component: 'FutureScenario' },
      { name: 'social_proof', label: 'Prova Social', component: 'SocialProof' },
      { name: 'loading', label: 'Gerando Desenho', component: 'SoulmateDrawingLoading' },
      { name: 'paywall', label: 'Checkout', component: 'PaywallStep' }
    ]
  },
  {
    id: 'funnel-3',
    name: 'Funnel 3',
    slug: 'funnel-3',
    description: 'Funil 3 - cópia do Funnel 1',
    component: () => import('../pages/funnel-3'),
    status: 'active',
    tags: ['vídeo', 'quiz'],
    steps: [
      { name: 'video', label: 'Vídeo', component: 'VideoStep' },
      { name: 'testimonials', label: 'Depoimentos', component: 'TestimonialsCarousel' },
      { name: 'name', label: 'Nome', component: 'NameCollection' },
      { name: 'birth', label: 'Data Nascimento', component: 'BirthDataCollection' },
      { name: 'love_situation', label: 'Situação Amorosa', component: 'LoveSituationStep' },
      { name: 'palm_reading', label: 'Leitura Palma', component: 'PalmReadingResults' },
      { name: 'revelation', label: 'Revelação', component: 'LoadingRevelation' },
      { name: 'paywall', label: 'Checkout', component: 'PaywallStep' }
    ]
  }
];

export const getFunnelBySlug = (slug) => {
  return FUNNEL_DEFINITIONS.find(f => f.slug === slug);
};

export const getFunnelById = (id) => {
  return FUNNEL_DEFINITIONS.find(f => f.id === id);
};

export const getAllFunnels = () => {
  return FUNNEL_DEFINITIONS;
};
