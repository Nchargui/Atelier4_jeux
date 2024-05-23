document.addEventListener('DOMContentLoaded', () => {
    const backButton = document.getElementById("pressBack");
    const muteButton = document.getElementById('muteButton');
    const audio = document.getElementById('myAudio');
    const languageButtons = document.querySelectorAll('.language-button');
    const buttons = [backButton, ...languageButtons].filter(button => button);

    // Initialisation des variables
    let isMuted = false;
    let controllerIndex = null;
    let lastNavigationTime = 0;
    const navigationDelay = 200;
    let selectedButtonIndex = 0;

    // Gestion des clics sur les boutons de navigation
    if (backButton) {
        backButton.addEventListener("click", () => {
            window.location.href = "PageAccueil.html";
        });
    }

    // Lecture audio
    if (audio) {
        audio.play();
    }

    // Mise à jour de l'icône du bouton de sourdine
    function updateMuteButtonIcon() {
        if (isMuted) {
            muteButton.innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else {
            muteButton.innerHTML = '<i class="fas fa-volume-up"></i>';
        }
    }

    if (muteButton) {
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
    }

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
            const gamepad = navigator.getGamepads()[controllerIndex];
            if (gamepad && gamepad.buttons.length > 0) {
                const buttonX = gamepad.buttons[0];

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


    function updateGamepadControls() {
        handleGamepadInput();
        requestAnimationFrame(updateGamepadControls);
    }

    updateGamepadControls();
});
