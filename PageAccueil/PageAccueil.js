//Button start --> Page choisir la voiture
document.getElementById("pressStartButton").addEventListener("click", function() {
    window.location.href = "PageChoisirVoiture.html";
});


//Button How to play --> Page Explication
document.getElementById("pressHowToPlay").addEventListener("click", function() {
    window.location.href = "PageExplication.html";
});
 
//audio
document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('myAudio');
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
});

//traduction
const translations ={
    en: {
        pressHowToPlay: "How to play",
        muteButton : "Mute",
        pressStartButton: "Start"
    },
    fr: {
        pressHowToPlay: "Comment jouer",
        muteButton : "Sourdine",
        pressStartButton: "Commencer"

    },
    es: {
        pressHowToPlay: "Cómo jugar",
        muteButton : "Mudo",
        pressStartButton: "Empezar"
    }
};
function changeLanguage(lang) {
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        element.textContent = translations[lang][key];
    });
}

const languageButtons = document.querySelectorAll('.language-button');
languageButtons.forEach(button => {
    button.addEventListener('click', () => {
        const lang = button.getAttribute('data-lang');
        changeLanguage(lang);
    });
});