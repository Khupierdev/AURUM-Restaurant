/**
 * AURUM RESTAURANT — Reservation Form
 * =====================================
 * Handles:
 *   - Real-time field validation
 *   - Form submission (simulated)
 *   - Success / error states
 */

'use strict';


/* ---- Validators ---- */

const validators = {
  nombre: (val) => val.trim().length >= 2
    ? null
    : 'Por favor, introduce tu nombre completo.',

  email: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())
    ? null
    : 'Introduce un correo electrónico válido.',

  telefono: (val) => /^[+]?[\d\s\-()]{7,15}$/.test(val.trim())
    ? null
    : 'Introduce un número de teléfono válido.',

  fecha: (val) => {
    if (!val) return 'Selecciona una fecha de reserva.';
    const chosen = new Date(val);
    const today  = new Date();
    today.setHours(0, 0, 0, 0);
    return chosen >= today ? null : 'La fecha debe ser hoy o posterior.';
  },

  hora: (val) => val ? null : 'Selecciona un horario.',

  comensales: (val) => (parseInt(val) >= 1 && parseInt(val) <= 20)
    ? null
    : 'Indica el número de comensales (1–20).',
};


/* ---- Field helpers ---- */

const showError = (input, message) => {
  input.classList.add('error');
  const errEl = input.closest('.form-group').querySelector('.form-error-msg');
  if (errEl) {
    errEl.textContent = message;
    errEl.classList.add('visible');
  }
};

const clearError = (input) => {
  input.classList.remove('error');
  const errEl = input.closest('.form-group').querySelector('.form-error-msg');
  if (errEl) errEl.classList.remove('visible');
};

const validateField = (input) => {
  const name = input.name;
  if (!validators[name]) return true;

  const error = validators[name](input.value);
  if (error) {
    showError(input, error);
    return false;
  } else {
    clearError(input);
    return true;
  }
};


/* ---- Set min date on date input ---- */

const setMinDate = () => {
  const dateInput = document.getElementById('fecha');
  if (!dateInput) return;

  const today = new Date().toISOString().split('T')[0];
  dateInput.setAttribute('min', today);
};


/* ---- Simulate API submission ---- */

const submitReservation = (formData) => {
  return new Promise((resolve) => {
    // Simulate network delay (replace with real fetch in production)
    setTimeout(() => {
      console.log('Reservation submitted:', Object.fromEntries(formData));
      resolve({ ok: true });
    }, 1400);
  });
};


/* ---- Main form init ---- */

export const initForm = () => {
  const form = document.getElementById('reservation-form');
  if (!form) return;

  setMinDate();

  // Real-time validation on blur
  form.querySelectorAll('input, select, textarea').forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) validateField(input);
    });
  });

  // Submit handler
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate all required fields
    const fields = form.querySelectorAll('[name]');
    let valid = true;
    fields.forEach(field => {
      if (field.name in validators) {
        if (!validateField(field)) valid = false;
      }
    });

    if (!valid) return;

    // Show loading state
    const submitBtn = form.querySelector('[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Enviando…</span>';

    try {
      const formData = new FormData(form);
      await submitReservation(formData);

      // Show success message
      form.style.display = 'none';
      const successEl = document.getElementById('form-success');
      if (successEl) successEl.classList.add('visible');

    } catch (err) {
      console.error('Submission error:', err);
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
};
