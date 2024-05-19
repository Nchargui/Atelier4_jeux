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
  