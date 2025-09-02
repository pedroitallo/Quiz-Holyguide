{
  console.log(`[BUTTON CLICK TRACKING] Button: \"${buttonName}\" clicked on Step: \"${stepName}\"`);
  // Você pode estender isso para enviar dados para outras ferramentas de analytics aqui.
  // Exemplo para Google Analytics (se gtag.js estiver carregado):
  // if (typeof window.gtag === 'function') {
  //   window.gtag('event', 'button_click', {
  //     event_category: 'Quiz Interaction',
  //     event_label: `${stepName} - ${buttonName}`,
  //     value: 1
  //   });
  // }
  // Exemplo para Facebook Pixel (se fbq estiver carregado):
  // if (typeof window.fbq === 'function') {
  //   window.fbq('trackCustom', 'QuizButtonClick', {
  //     step: stepName,
  //     button: buttonName
  //   });
  // }
};
">