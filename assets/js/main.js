// ==========================================================================
// SmartStudy AI — shared interactions
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();

  /* ---- Navbar scroll state ---- */
  const nav = document.querySelector('.navbar');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 12);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- Mobile menu ---- */
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('flex');
      mobileMenu.classList.toggle('hidden');
      menuBtn.querySelector('[data-icon="open"]').classList.toggle('hidden');
      menuBtn.querySelector('[data-icon="close"]').classList.toggle('hidden');
    });
  }

  /* ---- Scroll reveal ---- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-scale');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* ---- Animated counters ---- */
  const counters = document.querySelectorAll('[data-counter]');
  const animateCounter = (el) => {
    const target = parseFloat(el.dataset.counter);
    const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
    const suffix = el.dataset.suffix || '';
    const duration = 1600;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = target * eased;
      el.textContent = val.toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window && counters.length) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          cio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(el => cio.observe(el));
  }

  /* ---- FAQ accordion ---- */
  document.querySelectorAll('[data-faq-trigger]').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('[data-faq-item]');
      const panel = item.querySelector('[data-faq-panel]');
      const icon = btn.querySelector('[data-faq-icon]');
      const isOpen = item.classList.contains('open');

      document.querySelectorAll('[data-faq-item].open').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('open');
          openItem.querySelector('[data-faq-panel]').style.maxHeight = null;
          openItem.querySelector('[data-faq-icon]').style.transform = 'rotate(0deg)';
        }
      });

      if (isOpen) {
        item.classList.remove('open');
        panel.style.maxHeight = null;
        icon.style.transform = 'rotate(0deg)';
      } else {
        item.classList.add('open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
        icon.style.transform = 'rotate(45deg)';
      }
    });
  });

  /* ---- Pricing toggle (monthly / yearly) ---- */
  const pricingToggle = document.getElementById('pricingToggle');
  if (pricingToggle) {
    pricingToggle.addEventListener('change', () => {
      document.querySelectorAll('[data-price-monthly]').forEach(el => {
        el.classList.toggle('hidden', pricingToggle.checked);
      });
      document.querySelectorAll('[data-price-yearly]').forEach(el => {
        el.classList.toggle('hidden', !pricingToggle.checked);
      });
    });
  }

  /* ---- Testimonial marquee pause on hover handled via CSS ---- */

  /* ---- Dashboard preview tab switch (landing hero) ---- */
  document.querySelectorAll('[data-agent-tab]').forEach(tab => {
    tab.addEventListener('click', () => {
      const group = tab.closest('[data-agent-tabs]');
      group.querySelectorAll('[data-agent-tab]').forEach(t => t.classList.remove('active-tab'));
      tab.classList.add('active-tab');
    });
  });
});
