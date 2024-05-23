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
                }, 1000); 
            }, 500); 
        }
    }, 700); 
});
