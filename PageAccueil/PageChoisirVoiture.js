//Button back --> Page accueil
document.getElementById("pressBack").addEventListener("click", function() {
    window.location.href = "PageAccueil.html";
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
