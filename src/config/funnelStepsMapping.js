import VideoStep1 from "../components/quiz/funnel-1/VideoStep";
import PaywallStep1 from "../components/quiz/funnel-1/PaywallStep";

import InitiateQuiz2 from "../components/quiz/funnel-2/InitiateQuiz";
import BirthDateWithZodiac from "../components/quiz/funnel-2/BirthDateWithZodiac";
import IdealPartnerQualities from "../components/quiz/funnel-2/IdealPartnerQualities";
import PartnerPreference from "../components/quiz/funnel-2/PartnerPreference";
import BirthChartResults from "../components/quiz/funnel-2/BirthChartResults";
import LoveChallenge from "../components/quiz/funnel-2/LoveChallenge";
import LoveDesire from "../components/quiz/funnel-2/LoveDesire";
import SoulmateConnection from "../components/quiz/funnel-2/SoulmateConnection";
import LoveLanguage from "../components/quiz/funnel-2/LoveLanguage";
import RelationshipEnergy from "../components/quiz/funnel-2/RelationshipEnergy";
import FutureScenario from "../components/quiz/funnel-2/FutureScenario";
import SocialProof from "../components/quiz/funnel-2/SocialProof";
import SoulmateDrawingLoading from "../components/quiz/funnel-2/SoulmateDrawingLoading";

import VideoStepAff from "../components/quiz/funnel-aff/VideoStep";
import PaywallStepAff from "../components/quiz/funnel-aff/PaywallStep";

import InitiateQuizAff2 from "../components/quiz/funnel-aff2/InitiateQuiz";
import BirthDateWithZodiacAff2 from "../components/quiz/funnel-aff2/BirthDateWithZodiac";
import LoveSituationStepAff2 from "../components/quiz/funnel-aff2/LoveSituationStep";
import IdealPartnerQualitiesAff2 from "../components/quiz/funnel-aff2/IdealPartnerQualities";
import PartnerPreferenceAff2 from "../components/quiz/funnel-aff2/PartnerPreference";
import BirthChartResultsAff2 from "../components/quiz/funnel-aff2/BirthChartResults";
import LoveChallengeAff2 from "../components/quiz/funnel-aff2/LoveChallenge";
import LoveDesireAff2 from "../components/quiz/funnel-aff2/LoveDesire";
import SoulmateConnectionAff2 from "../components/quiz/funnel-aff2/SoulmateConnection";
import LoveLanguageAff2 from "../components/quiz/funnel-aff2/LoveLanguage";
import RelationshipEnergyAff2 from "../components/quiz/funnel-aff2/RelationshipEnergy";
import FutureScenarioAff2 from "../components/quiz/funnel-aff2/FutureScenario";
import SocialProofAff2 from "../components/quiz/funnel-aff2/SocialProof";
import SoulmateDrawingLoadingAff2 from "../components/quiz/funnel-aff2/SoulmateDrawingLoading";
import PaywallStepAff2 from "../components/quiz/funnel-aff2/PaywallStep";

import VideoStepEsp from "../components/quiz/funnel-esp/VideoStep";
import NameCollectionEsp from "../components/quiz/funnel-esp/NameCollection";
import BirthDataCollectionEsp from "../components/quiz/funnel-esp/BirthDataCollection";
import LoveSituationStepEsp from "../components/quiz/funnel-esp/LoveSituationStep";
import PalmReadingResultsEsp from "../components/quiz/funnel-esp/PalmReadingResults";
import LoadingRevelationEsp from "../components/quiz/funnel-esp/LoadingRevelation";
import PaywallStepEsp from "../components/quiz/funnel-esp/PaywallStep";
import ThankYouStepEsp from "../components/quiz/funnel-esp/ThankYouStep";

import PaywallStep2Esp from "../components/quiz/funnel2-esp/PaywallStep";

import NameCollection from "../components/quiz/shared/NameCollection";
import BirthDataCollection from "../components/quiz/shared/BirthDataCollection";
import LoveSituationStep from "../components/quiz/shared/LoveSituationStep";
import PalmReadingResults from "../components/quiz/shared/PalmReadingResults";
import LoadingRevelation from "../components/quiz/shared/LoadingRevelation";
import TestimonialsCarousel from "../components/quiz/shared/TestimonialsCarousel";
import ThankYouStep from "../components/quiz/shared/ThankYouStep";

export const FUNNEL_STEPS_MAP = {
  'funnel-1': [
    { id: 'video', name: 'Video Step', component: VideoStep1, description: 'Video introdutório do quiz' },
    { id: 'testimonials', name: 'Testimonials', component: TestimonialsCarousel, description: 'Carrossel de depoimentos' },
    { id: 'name', name: 'Name Collection', component: NameCollection, description: 'Coleta do nome do usuário' },
    { id: 'birth', name: 'Birth Data', component: BirthDataCollection, description: 'Coleta de data de nascimento' },
    { id: 'love_situation', name: 'Love Situation', component: LoveSituationStep, description: 'Situação amorosa atual' },
    { id: 'palm_reading', name: 'Palm Reading', component: PalmReadingResults, description: 'Resultados da leitura de palma' },
    { id: 'revelation', name: 'Loading Revelation', component: LoadingRevelation, description: 'Tela de carregamento com revelação' },
    { id: 'paywall', name: 'Paywall', component: PaywallStep1, description: 'Página de pagamento' },
    { id: 'thank_you', name: 'Thank You', component: ThankYouStep, description: 'Página de agradecimento' }
  ],
  'funnel-2': [
    { id: 'initiate', name: 'Initiate Quiz', component: InitiateQuiz2, description: 'Tela inicial do quiz' },
    { id: 'testimonials', name: 'Testimonials', component: TestimonialsCarousel, description: 'Carrossel de depoimentos' },
    { id: 'birth_date', name: 'Birth Date with Zodiac', component: BirthDateWithZodiac, description: 'Data de nascimento com signo' },
    { id: 'love_situation', name: 'Love Situation', component: LoveSituationStep, description: 'Situação amorosa atual' },
    { id: 'qualities', name: 'Ideal Partner Qualities', component: IdealPartnerQualities, description: 'Qualidades do parceiro ideal' },
    { id: 'preference', name: 'Partner Preference', component: PartnerPreference, description: 'Preferência de parceiro' },
    { id: 'chart_results', name: 'Birth Chart Results', component: BirthChartResults, description: 'Resultados do mapa astral' },
    { id: 'challenge', name: 'Love Challenge', component: LoveChallenge, description: 'Desafio amoroso' },
    { id: 'desire', name: 'Love Desire', component: LoveDesire, description: 'Desejo amoroso' },
    { id: 'connection', name: 'Soulmate Connection', component: SoulmateConnection, description: 'Conexão com alma gêmea' },
    { id: 'love_language', name: 'Love Language', component: LoveLanguage, description: 'Linguagem do amor' },
    { id: 'energy', name: 'Relationship Energy', component: RelationshipEnergy, description: 'Energia do relacionamento' },
    { id: 'future', name: 'Future Scenario', component: FutureScenario, description: 'Cenário futuro' },
    { id: 'social_proof', name: 'Social Proof', component: SocialProof, description: 'Prova social' },
    { id: 'loading', name: 'Soulmate Drawing Loading', component: SoulmateDrawingLoading, description: 'Carregando desenho da alma gêmea' },
    { id: 'paywall', name: 'Paywall', component: PaywallStep1, description: 'Página de pagamento' },
    { id: 'thank_you', name: 'Thank You', component: ThankYouStep, description: 'Página de agradecimento' }
  ],
  'funnel-3': [
    { id: 'video', name: 'Video Step', component: VideoStep1, description: 'Video introdutório' },
    { id: 'testimonials', name: 'Testimonials', component: TestimonialsCarousel, description: 'Carrossel de depoimentos' },
    { id: 'name', name: 'Name Collection', component: NameCollection, description: 'Coleta do nome' },
    { id: 'birth', name: 'Birth Data', component: BirthDataCollection, description: 'Dados de nascimento' },
    { id: 'love_situation', name: 'Love Situation', component: LoveSituationStep, description: 'Situação amorosa' },
    { id: 'palm_reading', name: 'Palm Reading', component: PalmReadingResults, description: 'Leitura de palma' },
    { id: 'revelation', name: 'Loading Revelation', component: LoadingRevelation, description: 'Revelação' },
    { id: 'paywall', name: 'Paywall', component: PaywallStep1, description: 'Página de pagamento' },
    { id: 'thank_you', name: 'Thank You', component: ThankYouStep, description: 'Agradecimento' }
  ],
  'funnel-aff': [
    { id: 'video', name: 'Video Step', component: VideoStepAff, description: 'Video introdutório' },
    { id: 'testimonials', name: 'Testimonials', component: TestimonialsCarousel, description: 'Carrossel de depoimentos' },
    { id: 'name', name: 'Name Collection', component: NameCollection, description: 'Coleta do nome' },
    { id: 'birth', name: 'Birth Data', component: BirthDataCollection, description: 'Dados de nascimento' },
    { id: 'love_situation', name: 'Love Situation', component: LoveSituationStep, description: 'Situação amorosa' },
    { id: 'palm_reading', name: 'Palm Reading', component: PalmReadingResults, description: 'Leitura de palma' },
    { id: 'revelation', name: 'Loading Revelation', component: LoadingRevelation, description: 'Revelação' },
    { id: 'paywall', name: 'Paywall', component: PaywallStepAff, description: 'Página de pagamento' },
    { id: 'thank_you', name: 'Thank You', component: ThankYouStep, description: 'Agradecimento' }
  ],
  'funnel-aff2': [
    { id: 'initiate', name: 'Initiate Quiz', component: InitiateQuizAff2, description: 'Tela inicial do quiz' },
    { id: 'testimonials', name: 'Testimonials', component: TestimonialsCarousel, description: 'Carrossel de depoimentos' },
    { id: 'birth_date', name: 'Birth Date with Zodiac', component: BirthDateWithZodiacAff2, description: 'Data com signo' },
    { id: 'love_situation', name: 'Love Situation', component: LoveSituationStepAff2, description: 'Situação amorosa' },
    { id: 'qualities', name: 'Ideal Partner Qualities', component: IdealPartnerQualitiesAff2, description: 'Qualidades ideais' },
    { id: 'preference', name: 'Partner Preference', component: PartnerPreferenceAff2, description: 'Preferência de parceiro' },
    { id: 'chart_results', name: 'Birth Chart Results', component: BirthChartResultsAff2, description: 'Resultados do mapa astral' },
    { id: 'challenge', name: 'Love Challenge', component: LoveChallengeAff2, description: 'Desafio amoroso' },
    { id: 'desire', name: 'Love Desire', component: LoveDesireAff2, description: 'Desejo amoroso' },
    { id: 'connection', name: 'Soulmate Connection', component: SoulmateConnectionAff2, description: 'Conexão com alma gêmea' },
    { id: 'love_language', name: 'Love Language', component: LoveLanguageAff2, description: 'Linguagem do amor' },
    { id: 'energy', name: 'Relationship Energy', component: RelationshipEnergyAff2, description: 'Energia do relacionamento' },
    { id: 'future', name: 'Future Scenario', component: FutureScenarioAff2, description: 'Cenário futuro' },
    { id: 'social_proof', name: 'Social Proof', component: SocialProofAff2, description: 'Prova social' },
    { id: 'loading', name: 'Soulmate Drawing Loading', component: SoulmateDrawingLoadingAff2, description: 'Carregando desenho' },
    { id: 'paywall', name: 'Paywall', component: PaywallStepAff2, description: 'Página de pagamento' },
    { id: 'thank_you', name: 'Thank You', component: ThankYouStep, description: 'Agradecimento' }
  ],
  'funnel-esp': [
    { id: 'video', name: 'Video Step', component: VideoStepEsp, description: 'Video introdutório' },
    { id: 'testimonials', name: 'Testimonials', component: TestimonialsCarousel, description: 'Depoimentos' },
    { id: 'name', name: 'Name Collection', component: NameCollectionEsp, description: 'Coleta do nome' },
    { id: 'birth', name: 'Birth Data', component: BirthDataCollectionEsp, description: 'Dados de nascimento' },
    { id: 'love_situation', name: 'Love Situation', component: LoveSituationStepEsp, description: 'Situação amorosa' },
    { id: 'palm_reading', name: 'Palm Reading', component: PalmReadingResultsEsp, description: 'Leitura de palma' },
    { id: 'revelation', name: 'Loading Revelation', component: LoadingRevelationEsp, description: 'Revelação' },
    { id: 'paywall', name: 'Paywall', component: PaywallStepEsp, description: 'Página de pagamento' },
    { id: 'thank_you', name: 'Thank You', component: ThankYouStepEsp, description: 'Agradecimento' }
  ],
  'funnel2-esp': [
    { id: 'video', name: 'Video Step', component: VideoStepEsp, description: 'Video introdutório' },
    { id: 'testimonials', name: 'Testimonials', component: TestimonialsCarousel, description: 'Depoimentos' },
    { id: 'name', name: 'Name Collection', component: NameCollectionEsp, description: 'Coleta do nome' },
    { id: 'birth', name: 'Birth Data', component: BirthDataCollectionEsp, description: 'Dados de nascimento' },
    { id: 'love_situation', name: 'Love Situation', component: LoveSituationStepEsp, description: 'Situação amorosa' },
    { id: 'palm_reading', name: 'Palm Reading', component: PalmReadingResultsEsp, description: 'Leitura de palma' },
    { id: 'revelation', name: 'Loading Revelation', component: LoadingRevelationEsp, description: 'Revelação' },
    { id: 'paywall', name: 'Paywall', component: PaywallStep2Esp, description: 'Página de pagamento' },
    { id: 'thank_you', name: 'Thank You', component: ThankYouStepEsp, description: 'Agradecimento' }
  ]
};

export const getMockPropsForStep = (funnelId, stepId) => {
  const mockData = {
    name: 'Preview User',
    userName: 'Preview User',
    birth_date: '1990-01-01',
    birthDate: '1990-01-01',
    birth_time: '12:00',
    zodiac_sign: 'Capricorn',
    zodiacSign: 'Capricorn',
    love_situation: 'single',
    quizResultId: 'preview-mode',
    onContinue: () => console.log('Preview: Continue clicked'),
    onSubmit: (data) => console.log('Preview: Submit', data),
    onNameSubmit: (name) => console.log('Preview: Name submitted', name),
    onSelect: (value) => console.log('Preview: Selected', value),
    onComplete: () => console.log('Preview: Completed')
  };

  return mockData;
};

export const getFunnelSteps = (funnelSlug) => {
  const funnelId = funnelSlug.replace(/^\//, '');
  return FUNNEL_STEPS_MAP[funnelId] || [];
};
