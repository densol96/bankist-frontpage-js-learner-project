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

const header = document.querySelector(".header");

const lazyImages = document.querySelectorAll(".lazy-img");
////////////////////////////////////////
// MODAL
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
const tabContainer = document.querySelector(".operations__tab-container");

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