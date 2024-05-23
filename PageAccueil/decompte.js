document.addEventListener('DOMContentLoaded', function() {
    var countdownElement = document.getElementById('countdown');
    var count = 5;
    var countdown = setInterval(function() {
        if (count > 0) {
            countdownElement.textContent = count;
            count--;
        } else {
            clearInterval(countdown);
            setTimeout(function() {
                countdownElement.textContent = "Go!";
                setTimeout(function() {
                    window.location.href = 'sender.html';
                }, 1000); // Attendre 1 seconde avant la redirection après "Go!"
            }, 500); // Attendre 0.5 seconde avant d'afficher "Go!" après la fin du compte à rebours
        }
    }, 700); // Intervalles de 0.5 seconde pour le compte à rebours
});
