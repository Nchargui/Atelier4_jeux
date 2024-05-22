document.addEventListener('DOMContentLoaded', () => {
  const backButton = document.getElementById("pressBack");
  if (backButton) {
      backButton.addEventListener("click", function() {
          window.location.href = "PageAccueil.html";
      });
  }

  const audio = document.getElementById('myAudio');
    audio.play();
  
    const muteButton = document.getElementById('muteButton');
    let isMuted = false;
  
    function updateMuteButtonIcon() {
        if (isMuted) {
            muteButton.innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else {
            muteButton.innerHTML = '<i class="fas fa-volume-up"></i>';
        }
    }

    muteButton.addEventListener('click', () => {
      if (isMuted) {
          audio.play();
      } else {
          audio.pause();
      }
      isMuted = !isMuted;
      updateMuteButtonIcon();
  });

  updateMuteButtonIcon();

  // Traduction
  fetch('Json/traduction.json')
      .then(response => response.json())
      .then(translations => {
          function changeLanguage(lang) {
              const elements = document.querySelectorAll('[data-translate]');
              elements.forEach(element => {
                  const key = element.getAttribute('data-translate');
                  element.textContent = translations[lang][key];
              });
              sessionStorage.setItem('language', lang);

              updateMuteButtonIcon();
          }

          const languageButtons = document.querySelectorAll('.language-button');
          languageButtons.forEach(button => {
              button.addEventListener('click', () => {
                  const lang = button.getAttribute('data-lang');
                  changeLanguage(lang);
              });
          });

          const savedLanguage = sessionStorage.getItem('language');
          if (savedLanguage) {
              changeLanguage(savedLanguage);
          }
      })
      .catch(error => console.error('Error loading translations:', error));
});
