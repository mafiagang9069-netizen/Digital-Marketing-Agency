/* ==========================================================================
   SIGNAL & SCALE — Vanilla JS Interactions
   Template by PixelNestByNS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Navigation Drawer
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', String(!isExpanded));
      mobileDrawer.hidden = isExpanded;
    });

    mobileDrawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileDrawer.hidden = true;
      });
    });
  }

  // 2. Interactive ROAS Estimator
  const adSpendRange = document.getElementById('adSpendRange');
  const adSpendValue = document.getElementById('adSpendValue');
  const estRevenue = document.getElementById('estRevenue');
  const estLift = document.getElementById('estLift');

  if (adSpendRange && adSpendValue && estRevenue && estLift) {
    const currency = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    });

    const updateEstimator = () => {
      const spend = Number(adSpendRange.value);
      const projectedRevenue = Math.round(spend * 3.8);
      const lift = Math.round(projectedRevenue * 0.28);
      adSpendValue.textContent = currency.format(spend);
      estRevenue.textContent = currency.format(projectedRevenue);
      estLift.textContent = `+${currency.format(lift)}/mo`;
    };

    adSpendRange.addEventListener('input', updateEstimator);
    updateEstimator();
  }

  // 3. Monthly / Quarterly Retainer Toggle
  const billingBtns = document.querySelectorAll('.toggle-btn');
  const priceVals = document.querySelectorAll('.price-val');

  billingBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.billing;
      billingBtns.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      priceVals.forEach((val) => {
        val.textContent = mode === 'quarterly' ? val.dataset.quarterly : val.dataset.monthly;
      });
    });
  });

  // 4. FAQ Accordion
  const accordionTriggers = document.querySelectorAll('.accordion-trigger');
  accordionTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const expanded = trigger.getAttribute('aria-expanded') === 'true';
      const panel = trigger.nextElementSibling;
      trigger.setAttribute('aria-expanded', String(!expanded));
      if (panel) {
        panel.hidden = expanded;
      }
    });
  });

  // 5. Audit Form Validation & Static-Site Integration Notice
  /*
   * FORM INTEGRATION NOTE:
   * By default, this static HTML template validates inputs and shows a confirmation message
   * without sending data to a server. To connect a live backend such as Formspree or Web3Forms:
   *   1. Set action="https://formspree.io/f/YOUR_FORM_ID" on <form id="auditForm">.
   *   2. Replace the demo block below with a fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } }).
   */
  const auditForm = document.getElementById('auditForm');
  const formFeedback = document.getElementById('formFeedback');

  if (auditForm && formFeedback) {
    auditForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const name = auditForm.name.value.trim();
      const email = auditForm.email.value.trim();
      const website = auditForm.website.value.trim();
      const message = auditForm.message.value.trim();

      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!name || !emailValid || !website || !message) {
        formFeedback.textContent = 'Please complete all required fields with a valid work email and URL.';
        formFeedback.className = 'form-feedback is-error';
        return;
      }

      formFeedback.textContent =
        'Validation passed (Demo Mode): Connect Formspree or Netlify Forms in index.html to receive live submissions.';
      formFeedback.className = 'form-feedback is-success';
      auditForm.reset();
    });
  }
});
