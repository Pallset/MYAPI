document.addEventListener('DOMContentLoaded', () => {
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    const apiButtons = document.querySelectorAll('.api-button');
    const runtimeText = document.getElementById('runtime-text');
    const popupPromo = document.getElementById('popup-promo');
    const profileIntro = document.getElementById('profile-intro');
    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.dataset.target;
            const targetContent = document.getElementById(targetId);
            if (targetContent.style.display === 'block') {
                targetContent.style.display = 'none';
                button.textContent = '▼';
            } else {
                targetContent.style.display = 'block';
                button.textContent = '▲';
            }
        });
    });

    apiButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const endpoint = button.dataset.endpoint;
            window.location.href = endpoint;
        });
    });
    runtimeText.textContent = new Date().toLocaleTimeString();
    function showPopupPromo() {
  popupPromo.style.display = 'block';
        popupPromo.style.animation = 'popupAnimation 0.5s ease-in-out';
    }
    function hidePopupPromo() {
        popupPromo.style.animation = 'popupAnimationReverse 0.5s ease-in-out forwards';
        setTimeout(() => {
            popupPromo.style.display = 'none';
        }, 500);
    }
    setInterval(showPopupPromo, 300000);
    const promoButton = document.querySelector('.promo-button');
    promoButton.addEventListener('click', hidePopupPromo);
    const introText = "Perkenalkan Nama Saya Adalah PallxMods Saya Suka Mencoba Belajar Bahasa Pemrograman Di Bawah Ini";
    let charIndex = 0;
    let sentenceCount = 0;

    function typeWriter() {
        if (charIndex < introText.length) {
            profileIntro.innerHTML += introText.charAt(charIndex);
            charIndex++;
            if (introText.charAt(charIndex - 1) === ' ') {
                sentenceCount++;
                if (sentenceCount === 3) {
                    profileIntro.innerHTML += '<br>';
                    sentenceCount = 0;
                }
            }
            setTimeout(typeWriter, 50);
        }
    }

    typeWriter();
});