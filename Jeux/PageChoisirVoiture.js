document.addEventListener('DOMContentLoaded', () => {
    const backButton = document.getElementById("pressBack");
    const startButton = document.getElementById("pressStartRacing");
    const languageButtons = document.querySelectorAll('.language-button');
    const buttons = [backButton, startButton, ...languageButtons].filter(button => button);

    if (backButton) {
        backButton.addEventListener("click", function () {
            window.location.href = "PageAccueil.html";
        });
    }
    ///pressStartRacing
    if (startButton) {
        startButton.addEventListener("click", function () {
            window.location.href = "PageChoisirVoiture.html";
        });
    }

    if (pressStartRacing) {
        pressStartRacing.addEventListener("click", function () {
            window.location.href = "decompte.html";
        });
    }

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

        // Ajout d'un délai pour la navigation entre les boutons
        let lastNavigationTime = 0;
        const navigationDelay = 200;

        function handleGamepadInput() {
            if (controllerIndex !== null) {
                var gamepad = navigator.getGamepads()[controllerIndex];
                if (gamepad.buttons.length > 0) {
                    var buttonUp = gamepad.buttons[12];
                    var buttonDown = gamepad.buttons[13];
                    var buttonX = gamepad.buttons[0];
                    var currentTime = Date.now();

                    // Navigation entre boutons
                    if (currentTime - lastNavigationTime > navigationDelay) {
                        if (buttonUp.pressed) {
                            selectedButtonIndex = (selectedButtonIndex - 1 + buttons.length) % buttons.length;
                            lastNavigationTime = currentTime;
                        } else if (buttonDown.pressed) {
                            selectedButtonIndex = (selectedButtonIndex + 1) % buttons.length;
                            lastNavigationTime = currentTime;
                        }
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
