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

  // 5. Audit Form Validation & Google Forms Submission
  const GOOGLE_FORM_CONFIG = {
    // Paste your Google Form responder URL here (e.g. https://docs.google.com/forms/d/e/.../viewform or /formResponse)
    formUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSdbDiN6CSJ4paFV6-j2AXuLa_pTeZg7z5b53iCrNt5wCLtxDA/viewform',
    // Replace each value with the matching entry.<id> from Google Forms ("Get pre-filled link")
    fields: {
      name: 'entry.459135839',
      email: 'entry.108625520',
      website: 'entry.450833107',
      budget: 'entry.270905387',
      message: 'entry.104189477',
    },
  };

  const resolveGoogleFormEndpoint = (rawUrl) => {
    const trimmed = rawUrl.trim();
    if (!trimmed.startsWith('https://docs.google.com/forms/')) {
      return null;
    }
    const base = trimmed.split('?')[0].replace(/\/viewform\/?$/, '/formResponse');
    return base.endsWith('/formResponse') ? base : `${base.replace(/\/$/, '')}/formResponse`;
  };

  const auditForm = document.getElementById('auditForm');
  const formFeedback = document.getElementById('formFeedback');
  const monthlySpend = document.getElementById('monthlySpend');
  const customBudgetField = document.getElementById('customBudgetField');
  const customBudgetInput = document.getElementById('customBudget');

  if (monthlySpend && customBudgetField && customBudgetInput) {
    const syncCustomBudgetField = () => {
      const isCustom = monthlySpend.value === 'custom';
      customBudgetField.hidden = !isCustom;
      customBudgetInput.required = isCustom;
      if (isCustom) {
        customBudgetInput.focus();
      } else {
        customBudgetInput.value = '';
      }
    };

    monthlySpend.addEventListener('change', syncCustomBudgetField);
    syncCustomBudgetField();
  }

  if (auditForm && formFeedback) {
    const submitBtn = auditForm.querySelector('button[type="submit"]');

    auditForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const name = auditForm.name.value.trim();
      const email = auditForm.email.value.trim();
      const website = auditForm.website.value.trim();
      const selectedBudget = auditForm.budget.value;
      const customBudget = customBudgetInput ? customBudgetInput.value.trim() : '';
      const budget = selectedBudget === 'custom' ? customBudget : selectedBudget;
      const message = auditForm.message.value.trim();

      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!name || !emailValid || !website || !message) {
        formFeedback.textContent = 'Please complete all required fields with a valid work email and URL.';
        formFeedback.className = 'form-feedback is-error';
        return;
      }

      if (selectedBudget === 'custom' && !customBudget) {
        formFeedback.textContent = 'Please enter your custom monthly ad budget.';
        formFeedback.className = 'form-feedback is-error';
        if (customBudgetInput) customBudgetInput.focus();
        return;
      }

      const endpoint = resolveGoogleFormEndpoint(GOOGLE_FORM_CONFIG.formUrl);
      const hasPlaceholderFields = Object.values(GOOGLE_FORM_CONFIG.fields).some(
        (id) => !/^entry\.\d+$/.test(id)
      );

      if (!endpoint || hasPlaceholderFields) {
        formFeedback.textContent =
          'Form setup incomplete: add your Google Form URL and entry IDs to GOOGLE_FORM_CONFIG in script.js.';
        formFeedback.className = 'form-feedback is-error';
        return;
      }

      const payload = new URLSearchParams();
      payload.append(GOOGLE_FORM_CONFIG.fields.name, name);
      payload.append(GOOGLE_FORM_CONFIG.fields.email, email);
      payload.append(GOOGLE_FORM_CONFIG.fields.website, website);
      payload.append(GOOGLE_FORM_CONFIG.fields.budget, budget);
      payload.append(GOOGLE_FORM_CONFIG.fields.message, message);

      if (submitBtn) submitBtn.disabled = true;
      formFeedback.textContent = 'Sending your audit request...';
      formFeedback.className = 'form-feedback';

      try {
        await fetch(endpoint, {
          method: 'POST',
          mode: 'no-cors',
          body: payload,
        });
        formFeedback.textContent =
          'Thanks! Your growth audit request has been submitted. We’ll send your teardown within 48 hours.';
        formFeedback.className = 'form-feedback is-success';
        auditForm.reset();
        if (customBudgetField && customBudgetInput) {
          customBudgetField.hidden = true;
          customBudgetInput.required = false;
        }
      } catch (error) {
        formFeedback.textContent = 'Could not send your request right now. Please try again in a moment.';
        formFeedback.className = 'form-feedback is-error';
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }
});
