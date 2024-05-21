document.addEventListener('DOMContentLoaded', () => {
  const backButton = document.getElementById("pressBack");
  if (backButton) {
      backButton.addEventListener("click", function() {
          window.location.href = "PageAccueil.html";
      });
  }

  const audio = document.getElementById('myAudio');
  if (audio) {
      audio.play();

      const muteButton = document.getElementById('muteButton');
      let isMuted = false;

      muteButton.addEventListener('click', () => {
          if (isMuted) {
              audio.play();
              muteButton.innerText = 'Mute';
          } else {
              audio.pause();
              muteButton.innerText = 'Unmute';
          }
          isMuted = !isMuted;
      });
  }

  fetch('Json/traduction.json')
      .then(response => response.json())
      .then(translations => {
          function changeLanguage(lang) {
              const elements = document.querySelectorAll('[data-translate]');
              elements.forEach(element => {
                  const key = element.getAttribute('data-translate');
                  element.textContent = translations[lang][key];
              });
          }

          const savedLanguage = sessionStorage.getItem('language');
          if (savedLanguage) {
              changeLanguage(savedLanguage);
          }

          const languageButtons = document.querySelectorAll('.language-button');
          languageButtons.forEach(button => {
              button.addEventListener('click', () => {
                  const lang = button.getAttribute('data-lang');
                  changeLanguage(lang);
                  sessionStorage.setItem('language', lang); 
              });
          });
      })
      .catch(error => console.error('Error loading translations:', error));
});
