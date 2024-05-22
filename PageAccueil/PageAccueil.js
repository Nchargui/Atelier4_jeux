document.addEventListener('DOMContentLoaded', () => {
    // Sélection des boutons de la page
    const backButton = document.getElementById("pressBack");
    const startButton = document.getElementById("pressStartButton");
    const howToPlayButton = document.getElementById("pressHowToPlay");
    const languageButtons = document.querySelectorAll('.language-button');
    const buttons = [backButton, startButton, howToPlayButton, ...languageButtons].filter(button => button);

    // Gestion des clics sur les boutons de navigation
    if (backButton) {
        backButton.addEventListener("click", function() {
            window.location.href = "PageAccueil.html";
        });
    }
  
    if (startButton) {
        startButton.addEventListener("click", function() {
            window.location.href = "PageChoisirVoiture.html";
        });
    }
  
    if (howToPlayButton) {
        howToPlayButton.addEventListener("click", function() {
            window.location.href = "PageExplication.html";
        });
    }

    // Lecture audio
    const audio = document.getElementById('myAudio');
    audio.play();

    // Bouton de sourdine
    const muteButton = document.getElementById('muteButton');
    let isMuted = false;

    function updateMuteButtonIcon() {
        muteButton.innerHTML = isMuted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
    }

    muteButton.addEventListener('click', () => {
        isMuted ? audio.play() : audio.pause();
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

    // Contrôles de la manette de jeu
    let controllerIndex = null;

    window.addEventListener("gamepadconnected", (event) => {
        controllerIndex = event.gamepad.index;
        console.log("Manette connectée");
    });

    window.addEventListener("gamepaddisconnected", (event) => {
        controllerIndex = null;
        console.log("Manette déconnectée");
    });

    function handleGamepadInput() {
        if (controllerIndex !== null) {
            var gamepad = navigator.getGamepads()[controllerIndex];
            if (gamepad.buttons.length > 0) {
                var buttonUp = gamepad.buttons[12]; // Index du bouton "haut"
                var buttonDown = gamepad.buttons[13]; // Index du bouton "bas"
                var buttonLeft = gamepad.buttons[14]; // Index du bouton "gauche"
                var buttonRight = gamepad.buttons[15]; // Index du bouton "droite"
                var buttonX = gamepad.buttons[0]; // Index du bouton "X"

                // Navigation avec les boutons de direction
                if (buttonUp.pressed) {
                    selectedButtonIndex = (selectedButtonIndex - 1 + buttons.length) % buttons.length;
                } else if (buttonDown.pressed) {
                    selectedButtonIndex = (selectedButtonIndex + 1) % buttons.length;
                }

                // Action "Clic" avec le bouton X
                if (buttonX.pressed) {
                    const selectedButton = buttons[selectedButtonIndex];
                    if (selectedButton) {
                        selectedButton.click();
                    }
                }
            }
        }
    }

    function updateButtonSelection() {
        buttons.forEach((button, index) => {
            if (index === selectedButtonIndex) {
                button.classList.add('selected');
            } else {
                button.classList.remove('selected');
            }
        });
    }

    let selectedButtonIndex = 0;
    function updateGamepadControls() {
        handleGamepadInput();
        updateButtonSelection();
        requestAnimationFrame(updateGamepadControls);
    }

    updateGamepadControls();
});
