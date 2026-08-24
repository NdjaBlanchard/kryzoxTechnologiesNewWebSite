/* ============================================================
   KryzOx Technologies — Formulaire de contact
   Envoie vers l'API /api/contact → email à contact@kryzotec.com
   ============================================================ */

(function () {
  const form     = document.getElementById('contactForm');
  const btn      = document.getElementById('contactSubmit');
  const success  = document.getElementById('contactSuccess');
  const error    = document.getElementById('contactError');

  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Réinitialiser feedbacks
    success.classList.remove('contact__feedback--visible');
    error.classList.remove('contact__feedback--visible');

    // Validation basique
    const name    = form.querySelector('#cf-name').value.trim();
    const email   = form.querySelector('#cf-email').value.trim();
    const message = form.querySelector('#cf-message').value.trim();

    if (!name || !email || !message) {
      form.querySelectorAll(':invalid').forEach(el => el.classList.add('contact__input--error'));
      return;
    }

    // État chargement
    btn.classList.add('contact__submit--loading');
    btn.disabled = true;

    try {
      const payload = {
        name,
        email,
        company : form.querySelector('#cf-company').value.trim(),
        service : form.querySelector('#cf-service').value,
        message,
      };

      const res = await fetch('/api/contact', {
        method  : 'POST',
        headers : { 'Content-Type': 'application/json' },
        body    : JSON.stringify(payload),
      });

      if (res.ok) {
        form.reset();
        success.classList.add('contact__feedback--visible');
        // Scroll doux vers le message
        success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        throw new Error('Server error ' + res.status);
      }
    } catch (err) {
      console.error('Contact form error:', err);
      error.classList.add('contact__feedback--visible');
    } finally {
      btn.classList.remove('contact__submit--loading');
      btn.disabled = false;
    }
  });

  // Retirer la classe erreur à la saisie
  form.querySelectorAll('.contact__input, .contact__textarea').forEach(el => {
    el.addEventListener('input', () => el.classList.remove('contact__input--error'));
  });
})();
