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
    id: 'funnel-vsl',
    name: 'Funnel VSL',
    slug: 'funnel-vsl',
    description: 'Funil Video Sales Letter',
    component: () => import('../pages/funnel-vsl'),
    status: 'active',
    tags: ['vsl', 'vídeo'],
    steps: []
  },
  {
    id: 'funnelesp',
    name: 'Funnel ESP',
    slug: 'funnelesp',
    description: 'Funil em Espanhol',
    component: () => import('../pages/funnelesp'),
    status: 'active',
    tags: ['espanhol', 'internacional'],
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
    id: 'funnel-star2',
    name: 'Funil Star 2',
    slug: 'funnel-star2',
    description: 'Funil Star variação 2',
    component: () => import('../pages/funnel-star2'),
    status: 'active',
    tags: ['star', 'quiz'],
    steps: []
  },
  {
    id: 'funnel-star3',
    name: 'Funil Star 3',
    slug: 'funnel-star3',
    description: 'Funil Star variação 3',
    component: () => import('../pages/funnel-star3'),
    status: 'active',
    tags: ['star', 'quiz'],
    steps: []
  },
  {
    id: 'funnel-star4',
    name: 'Funil Star 4',
    slug: 'funnel-star4',
    description: 'Funil Star variação 4',
    component: () => import('../pages/funnel-star4'),
    status: 'active',
    tags: ['star', 'quiz'],
    steps: []
  },
  {
    id: 'funnel-star5',
    name: 'Funil Star 5',
    slug: 'funnel-star5',
    description: 'Funil Star variação 5',
    component: () => import('../pages/funnel-star5'),
    status: 'active',
    tags: ['star', 'quiz'],
    steps: []
  },
  {
    id: 'funnel-chat1',
    name: 'Funnel Chat 1',
    slug: 'funnel-chat1',
    description: 'Funil com interface de chat',
    component: () => import('../pages/funnel-chat1'),
    status: 'active',
    tags: ['chat', 'interativo'],
    steps: []
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
