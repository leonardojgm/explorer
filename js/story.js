let currentIndex = 0;
const slides = document.querySelector('.slides');
const totalSlides = document.querySelectorAll('.slide').length;

function moveSlide(direction) {
    currentIndex += direction;

    if (currentIndex < 0) currentIndex = totalSlides - 1;

    if (currentIndex >= totalSlides) currentIndex = 0;

    slides.style.transform = `translateX(-${currentIndex * 80}vw)`;
}