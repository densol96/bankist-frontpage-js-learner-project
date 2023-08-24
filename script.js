'use strict';

///////////////////////////////////////
// SELECTIONS
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const btnScrollTo = document.querySelector('.btn--scroll-to');
const sectionOne = document.querySelector('#section--1');
const sectionOneCoord = sectionOne.getBoundingClientRect();

const sections = document.querySelectorAll(".section");
const footer = document.querySelector(".footer");

const navLinks = document.querySelectorAll(".nav__link");
const navLinksBar = document.querySelector(".nav__links");
const nav = document.querySelector(".nav");
const firstOpenBtn = document.querySelector("a.btn--show-modal");

const logo = document.querySelector("#logo");
const header = document.querySelector(".header");

const lazyImages = document.querySelectorAll(".lazy-img");

const tabContainer = document.querySelector(".operations__tab-container");

const slider = document.querySelector(".slider");
const slides = document.querySelectorAll(".slide");
const rightBtn = document.querySelector(".slider__btn--right");
const leftBtn = document.querySelector(".slider__btn--left");
const dotContainer = document.querySelector(".dots");
////////////////////////////////////////
// MODAL

// const scrollUp = function() {
//     header.scrollIntoView({behviour: "smooth"});
// }

logo.addEventListener("click", () => header.scrollIntoView({ behviour: "smooth" }))

const openModal = function (e) {
    e.preventDefault();
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
};

const closeModal = function () {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);

overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
    }
});

////////////////////////////////////////
// SCROLLING
btnScrollTo.addEventListener('click', function (e) {
    // window.scrollTo({
    //   left: sectionOneCoord.left,
    //   top: sectionOneCoord.top + window.pageYOffset,
    //   behavior: 'smooth'
    // });

    // window.scrollBy({
    //   left: sectionOneCoord.left,
    //   top: sectionOneCoord.top,
    //   behavior: 'smooth'
    // });

    // AN EASIER AND MORE MODERN SOLUTION
    sectionOne.scrollIntoView({ behavior: 'smooth' });
})

////////////////////////////////////////
// PAGE NAVIGATION
navLinksBar.addEventListener("click", (e) => {
    e.preventDefault();
    if (e.target.classList.contains("nav__link") && !e.target.classList.contains("btn--show-modal")) {
        const sectionId = e.target.getAttribute("href");
        document.querySelector(sectionId).scrollIntoView({ behavior: "smooth" });
    }
})

////////////////////////////////////////
// BUILDING A TABBED COMPONENT
tabContainer.addEventListener("click", (e) => {
    const button = e.target.closest(".operations__tab");

    if (!button) return;

    const currentActiveBtn = tabContainer.querySelector(".operations__tab--active")
    currentActiveBtn.classList.remove("operations__tab--active");
    button.classList.add("operations__tab--active");

    const off = currentActiveBtn.getAttribute("data-tab");
    const on = button.getAttribute("data-tab");

    document.querySelector(`.operations__content--${off}`).classList.remove("operations__content--active");
    document.querySelector(`.operations__content--${on}`).classList.add("operations__content--active");
})

////////////////////////////////////////
// MENU FADE ANIMATION
const handleHover = function (e) {
    if (e.target.classList.contains("nav__link") && e.target !== firstOpenBtn) {
        const touched = e.target;
        const siblings = touched.closest(".nav").querySelectorAll(".nav__link");

        siblings.forEach(el => {
            if (el !== touched && el !== firstOpenBtn) {
                el.style.opacity = this;
            }
        })
    }
}

nav.addEventListener("mouseover", handleHover.bind(0.4))
nav.addEventListener("mouseout", handleHover.bind(1))
////////////////////////////////////////
// STICKY NAVIGATION
// OPTION ONE - not the best in terms of perfomance, especially on movile devices

// window.addEventListener("scroll", function (e) {
//     if (window.scrollY > sectionOneCoord.top) {
//         nav.classList.add("sticky")
//     } else {
//         nav.classList.remove("sticky")
//     }
// })

// OPTION TWO - The Interscetion Observer API
const navHeight = nav.getBoundingClientRect().height;

const stickyObserver = function (entries) {
    const [entry] = entries; // entries is an array of threshold entries

    if (!entry.isIntersecting) {
        nav.classList.add("sticky");
    } else {
        nav.classList.remove("sticky");
    }
}
const observerOptions = {
    root: null, // null for the viewport
    threshold: 0,
    rootMargin: `-${navHeight}px`
}

const headerObserver = new IntersectionObserver(stickyObserver, observerOptions);
headerObserver.observe(header);

////////////////////////////////
// REVEALING ELEMENTS ON SCROLL
// const pageParts = [...sections];

const revealHiddenSections = function (entries) {
    const [entry] = entries;
    if (entry.isIntersecting) {
        entry.target.classList.remove("section--hidden");
        hiddenSectionObserver.unobserve(entry.target);
    }
}

const revealOptions = {
    root: null,
    threshold: 0.3
}

const hiddenSectionObserver = new IntersectionObserver(revealHiddenSections, revealOptions);
sections.forEach(section => {
    section.classList.add("section--hidden");
    hiddenSectionObserver.observe(section);
});

//////////////////////////////////
// LAZY LOADING IMAGES
const revealLazyImages = function (entries) {
    const [entry] = entries;

    entry.target.src = entry.target.dataset.src;
    entry.target.addEventListener("load", function () {
        entry.target.classList.remove("lazy-img");
    })
    lazyImgObserver.unobserve(entry.target);
}
const lazyImgOptions = {
    root: null,
    threshold: 0,
    rootMargin: "200px"
}

const lazyImgObserver = new IntersectionObserver(revealLazyImages, lazyImgOptions);
lazyImages.forEach(img => lazyImgObserver.observe(img));
//////////////////////////////////////
// BUILDING A SLIDER COMPONENT
slides.forEach((slide, i) => {
    slide.style.transform = `translateX(${i * 100}%)`;
})

let currentSlide = 0;

const goToSlide = function (argSlide) {
    slides.forEach((slide, i) => {
        slide.style.transform = `translateX(${(i - argSlide) * 100}%)`;
    })
}

const goRight = function () {
    if (currentSlide < slides.length - 1) {
        currentSlide++;
    } else {
        currentSlide = 0;
    }
    goToSlide(currentSlide);
    activeDot(currentSlide);
}

const goLeft = function () {
    if (currentSlide > 0) {
        currentSlide--;
    } else {
        currentSlide = slides.length - 1;
    }
    goToSlide(currentSlide);
    activeDot(currentSlide);
}

rightBtn.addEventListener("click", goRight);
leftBtn.addEventListener("click", goLeft);

document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") {
        goLeft();
    } else if (e.key === "ArrowRight") {
        goRight();
    }
})

const createDots = function () {
    slides.forEach((_, i) => {
        dotContainer.insertAdjacentHTML("beforeend",
            `<button class="dots__dot" data-slide="${i}"></button>`);
    })
}
createDots();

const activeDot = function (slide) {
    dotContainer.querySelector(".dots__dot--active")?.classList.remove("dots__dot--active");
    dotContainer.querySelector(`[data-slide="${slide}"]`).classList.add("dots__dot--active");
}
activeDot(currentSlide);

dotContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots__dot")) {
        const slideNumDot = e.target.getAttribute("data-slide");
        currentSlide = Number(slideNumDot);
        goToSlide(currentSlide);
        activeDot(currentSlide);
    }
})
