document.addEventListener('DOMContentLoaded', () => {
    const backButton = document.getElementById("pressBack");
    const startButton = document.getElementById("pressStartButton");
    const howToPlayButton = document.getElementById("pressHowToPlay");
    const languageButtons = document.querySelectorAll('.language-button');
    const muteButton = document.getElementById('muteButton');
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

    // Audio
    const audio = document.getElementById('myAudio');
    audio.play();

    let isMuted = false;

    function updateMuteButtonIcon() {
        if (isMuted) {
            muteButton.innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else {
            muteButton.innerHTML = '<i class="fas fa-volume-up"></i>';
        }
    }

    function toggleMute() {
        if (isMuted) {
            audio.play();
        } else {
            audio.pause();
        }
        isMuted = !isMuted;
        updateMuteButtonIcon();
    }

    if (muteButton) {
        muteButton.addEventListener('click', () => {
            toggleMute();
        });
    }

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

    let selectedButtonIndex = 0;

    function updateButtonSelection() {
        buttons.forEach((button, index) => {
            if (index === selectedButtonIndex) {
                button.classList.add('selected');
            } else {
                button.classList.remove('selected');
            }
        });
    }

    document.addEventListener('mousemove', (event) => {
        const mouseY = event.clientY;
        const buttonHeight = buttons[0].offsetHeight;
        selectedButtonIndex = Math.floor(mouseY / buttonHeight);
        if (selectedButtonIndex < 0) {
            selectedButtonIndex = 0;
        } else if (selectedButtonIndex >= buttons.length) {
            selectedButtonIndex = buttons.length - 1;
        }

        updateButtonSelection();
    });

    document.addEventListener('click', () => {
        const selectedButton = buttons[selectedButtonIndex];
        if (selectedButton) {
            selectedButton.click();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'x') {
            toggleMute();
        }
    });
});
