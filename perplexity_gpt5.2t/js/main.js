import { initThreeBackground } from './three-bg.js';

const qs = (s, root = document) => root.querySelector(s);
const qsa = (s, root = document) => Array.from(root.querySelectorAll(s));

function initYear() {
  const yearEl = qs('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

function initMobileMenu() {
  const burger = qs('#burger');
  const nav = qs('#nav');
  if (!burger || !nav) return;

  const close = () => {
    nav.classList.remove('nav--open');
    burger.setAttribute('aria-expanded', 'false');
  };

  burger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('nav--open');
    burger.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu after click
  qsa('a', nav).forEach((a) => {
    a.addEventListener('click', () => close());
  });

  // Close on Escape
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
}

function initFAQ() {
  const items = qsa('.faq__item');
  if (!items.length) return;

  items.forEach((btn) => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      items.forEach((b) => b.setAttribute('aria-expanded', 'false'));
      btn.setAttribute('aria-expanded', String(!expanded));
    });
  });
}

function initAOS() {
  if (!window.AOS) return;

  window.AOS.init({
    once: true,
    offset: 120,
    duration: 700,
    easing: 'ease-out-cubic',
  });
}

function initGSAPIntro() {
  if (!window.gsap) return;

  const tl = window.gsap.timeline({ defaults: { ease: 'power2.out' } });

  tl.from('.header', { y: -14, opacity: 0, duration: 0.55 })
    .from('.pill', { y: 10, opacity: 0, duration: 0.45 }, '-=0.25')
    .from('.hero__title', { y: 12, opacity: 0, duration: 0.6 }, '-=0.15')
    .from('.hero__subtitle', { y: 10, opacity: 0, duration: 0.5 }, '-=0.25')
    .from('.hero__cta .btn', { y: 10, opacity: 0, duration: 0.45, stagger: 0.08 }, '-=0.2')
    .from('.hero__card', { y: 16, opacity: 0, duration: 0.6 }, '-=0.35')
    .from('.stat', { y: 10, opacity: 0, duration: 0.4, stagger: 0.08 }, '-=0.35');
}

function initContactForm() {
  const form = qs('#contactForm');
  const toast = qs('#toast');
  if (!form || !toast) return;

  const showToast = (text, type = 'ok') => {
    toast.textContent = text;
    toast.classList.remove('toast--show', 'toast--ok', 'toast--error');
    toast.classList.add('toast--show', type === 'ok' ? 'toast--ok' : 'toast--error');

    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => {
      toast.classList.remove('toast--show');
    }, 3200);
  };

  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || '').trim());

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const fd = new FormData(form);
    const name = String(fd.get('name') || '').trim();
    const email = String(fd.get('email') || '').trim();
    const message = String(fd.get('message') || '').trim();

    if (name.length < 2) {
      showToast('Введите имя (минимум 2 символа).', 'error');
      return;
    }
    if (!isEmail(email)) {
      showToast('Проверьте email — кажется, он введён с ошибкой.', 'error');
      return;
    }
    if (message.length < 10) {
      showToast('Опишите проект чуть подробнее (минимум 10 символов).', 'error');
      return;
    }

    // Здесь обычно отправка на backend/CRM
    form.reset();
    showToast('Спасибо! Заявка отправлена — свяжемся с вами в течение 1 рабочего дня.', 'ok');
  });
}

// Init
initYear();
initMobileMenu();
initFAQ();

initThreeBackground();
initAOS();
initGSAPIntro();
initContactForm();
