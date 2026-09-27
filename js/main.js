/**
 * Lauryn and Littles - Interactive Logic for Hero Landing Page & Footer
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Request Modal (Tell us what you need)
  const requestModal = document.getElementById('request-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const roleFamilyBtn = document.getElementById('role-family-btn');
  const roleSitterBtn = document.getElementById('role-sitter-btn');
  const requestTypeInput = document.getElementById('request-type');

  window.setRole = (role) => {
    if (role === 'sitter') {
      if (roleFamilyBtn) roleFamilyBtn.classList.remove('active');
      if (roleSitterBtn) roleSitterBtn.classList.add('active');
      if (roleFamilyBtn) roleFamilyBtn.setAttribute('aria-selected', 'false');
      if (roleSitterBtn) roleSitterBtn.setAttribute('aria-selected', 'true');
      if (requestTypeInput) requestTypeInput.value = 'Sitter looking for a Family';
    } else {
      if (roleSitterBtn) roleSitterBtn.classList.remove('active');
      if (roleFamilyBtn) roleFamilyBtn.classList.add('active');
      if (roleSitterBtn) roleSitterBtn.setAttribute('aria-selected', 'false');
      if (roleFamilyBtn) roleFamilyBtn.setAttribute('aria-selected', 'true');
      if (requestTypeInput) requestTypeInput.value = 'Family needing a Sitter';
    }
  };

  if (roleFamilyBtn) roleFamilyBtn.addEventListener('click', () => window.setRole('family'));
  if (roleSitterBtn) roleSitterBtn.addEventListener('click', () => window.setRole('sitter'));

  window.openRequestModal = (role = 'family') => {
    if (!requestModal) return;
    window.setRole(role);
    requestModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closeRequestModal = () => {
    if (!requestModal) return;
    requestModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', window.closeRequestModal);

  // Close modal on clicking overlay background
  if (requestModal) {
    requestModal.addEventListener('click', (e) => {
      if (e.target === requestModal) {
        window.closeRequestModal();
      }
    });
  }

  // Escape key closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      window.closeRequestModal();
    }
  });

  // Attach buttons to open the modal
  const heroFindSitterBtn = document.getElementById('hero-find-sitter');
  const heroFindFamilyBtn = document.getElementById('hero-find-family');

  if (heroFindSitterBtn) {
    heroFindSitterBtn.addEventListener('click', () => window.openRequestModal('family'));
  }
  if (heroFindFamilyBtn) {
    heroFindFamilyBtn.addEventListener('click', () => window.openRequestModal('sitter'));
  }

  // 2. Toast Notification Helper
  window.showToast = (message, icon = '♡') => {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span style="color: #e5aba0; font-size: 1.2rem;">${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  };

  // 3. Boutique Custom Select Dropdowns (No OS default blue popups)
  const customSelects = document.querySelectorAll('.custom-select');

  customSelects.forEach((selectEl) => {
    const trigger = selectEl.querySelector('.custom-select-trigger');
    const label = selectEl.querySelector('.custom-select-label');
    const options = selectEl.querySelectorAll('.custom-select-option');
    const hiddenInput = selectEl.querySelector('input[type="hidden"]');

    if (!trigger) return;

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = selectEl.classList.contains('open');

      // Close all other dropdowns & calendar
      closeAllDropdowns();

      if (!isOpen) {
        selectEl.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });

    options.forEach((opt) => {
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        const value = opt.getAttribute('data-value');
        const text = opt.querySelector('span:first-child')?.textContent || value;

        options.forEach(o => {
          o.classList.remove('selected');
          o.setAttribute('aria-selected', 'false');
        });

        opt.classList.add('selected');
        opt.setAttribute('aria-selected', 'true');

        if (label) label.textContent = text;
        if (hiddenInput) hiddenInput.value = value;

        selectEl.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
      });
    });
  });

  // 4. Boutique Custom Calendar Date Picker (No OS blue calendar popup)
  const dateWrap = document.getElementById('custom-date-picker');
  const dateTrigger = document.getElementById('date-picker-trigger');
  const dateDisplayLabel = document.getElementById('date-display-label');
  const hiddenDateInput = document.getElementById('need-date-picker');
  const calPrevBtn = document.getElementById('cal-prev-month');
  const calNextBtn = document.getElementById('cal-next-month');
  const calMonthYear = document.getElementById('cal-month-year');
  const calDaysGrid = document.getElementById('cal-days-grid');
  const calTodayBtn = document.getElementById('cal-btn-today');
  const calClearBtn = document.getElementById('cal-btn-clear');

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNamesShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  let currentDate = new Date();
  let selectedDate = new Date();
  let viewYear = currentDate.getFullYear();
  let viewMonth = currentDate.getMonth();

  // Helper to format date for display
  const formatDateDisplay = (d) => {
    if (!d) return 'Select Date';
    const dayName = dayNamesShort[d.getDay()];
    const dateNum = d.getDate();
    const monthName = monthNames[d.getMonth()].slice(0, 3);
    const yr = d.getFullYear();
    return `${dayName}, ${dateNum} ${monthName} ${yr}`;
  };

  // Helper to format YYYY-MM-DD
  const formatISO = (d) => {
    if (!d) return '';
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  // Set initial date to today
  if (hiddenDateInput && dateDisplayLabel) {
    hiddenDateInput.value = formatISO(selectedDate);
    dateDisplayLabel.textContent = formatDateDisplay(selectedDate);
  }

  const renderCalendar = (year, month) => {
    if (!calDaysGrid || !calMonthYear) return;

    calMonthYear.textContent = `${monthNames[month]} ${year}`;
    calDaysGrid.innerHTML = '';

    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Empty lead slots
    for (let i = 0; i < firstDayIndex; i++) {
      const emptySpan = document.createElement('span');
      calDaysGrid.appendChild(emptySpan);
    }

    // Days of current month
    for (let d = 1; d <= totalDays; d++) {
      const dayDate = new Date(year, month, d);
      dayDate.setHours(0, 0, 0, 0);

      const dayBtn = document.createElement('button');
      dayBtn.type = 'button';
      dayBtn.className = 'calendar-day-btn';
      dayBtn.textContent = d;

      // Check if past date
      if (dayDate < today) {
        dayBtn.classList.add('disabled');
        dayBtn.disabled = true;
      } else {
        // Today indicator
        if (dayDate.getTime() === today.getTime()) {
          dayBtn.classList.add('today');
        }

        // Selected indicator
        if (selectedDate && dayDate.getTime() === selectedDate.getTime()) {
          dayBtn.classList.add('selected');
        }

        dayBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          selectedDate = new Date(year, month, d);
          selectedDate.setHours(0, 0, 0, 0);

          if (hiddenDateInput) hiddenDateInput.value = formatISO(selectedDate);
          if (dateDisplayLabel) dateDisplayLabel.textContent = formatDateDisplay(selectedDate);

          if (dateWrap) dateWrap.classList.remove('open');
          if (dateTrigger) dateTrigger.setAttribute('aria-expanded', 'false');

          renderCalendar(viewYear, viewMonth);
        });
      }

      calDaysGrid.appendChild(dayBtn);
    }
  };

  renderCalendar(viewYear, viewMonth);

  if (dateTrigger && dateWrap) {
    dateTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dateWrap.classList.contains('open');
      closeAllDropdowns();

      if (!isOpen) {
        dateWrap.classList.add('open');
        dateTrigger.setAttribute('aria-expanded', 'true');
        renderCalendar(viewYear, viewMonth);
      }
    });
  }

  if (calPrevBtn) {
    calPrevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      viewMonth--;
      if (viewMonth < 0) {
        viewMonth = 11;
        viewYear--;
      }
      renderCalendar(viewYear, viewMonth);
    });
  }

  if (calNextBtn) {
    calNextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      viewMonth++;
      if (viewMonth > 11) {
        viewMonth = 0;
        viewYear++;
      }
      renderCalendar(viewYear, viewMonth);
    });
  }

  if (calTodayBtn) {
    calTodayBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      selectedDate = now;
      viewYear = now.getFullYear();
      viewMonth = now.getMonth();

      if (hiddenDateInput) hiddenDateInput.value = formatISO(selectedDate);
      if (dateDisplayLabel) dateDisplayLabel.textContent = formatDateDisplay(selectedDate);

      if (dateWrap) dateWrap.classList.remove('open');
      if (dateTrigger) dateTrigger.setAttribute('aria-expanded', 'false');
      renderCalendar(viewYear, viewMonth);
    });
  }

  if (calClearBtn) {
    calClearBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      selectedDate = null;
      if (hiddenDateInput) hiddenDateInput.value = '';
      if (dateDisplayLabel) dateDisplayLabel.textContent = 'Select Date';

      if (dateWrap) dateWrap.classList.remove('open');
      if (dateTrigger) dateTrigger.setAttribute('aria-expanded', 'false');
      renderCalendar(viewYear, viewMonth);
    });
  }

  // Global close on click outside
  const closeAllDropdowns = () => {
    customSelects.forEach(s => {
      s.classList.remove('open');
      const trig = s.querySelector('.custom-select-trigger');
      if (trig) trig.setAttribute('aria-expanded', 'false');
    });
    if (dateWrap) {
      dateWrap.classList.remove('open');
      if (dateTrigger) dateTrigger.setAttribute('aria-expanded', 'false');
    }
  };

  document.addEventListener('click', (e) => {
    // If click is outside modal inputs
    if (!e.target.closest('.custom-select') && !e.target.closest('.custom-date-wrap')) {
      closeAllDropdowns();
    }
  });

  // 3. Form Submission Handler
  // ============================================================================
  // INTEGRATION PLACEHOLDER: Google Sheets & Email Notification
  // Once the client provides the Google Sheets App Script / Webhook URL and email,
  // enter them below. Left blank for now as requested.
  // ============================================================================
  const GOOGLE_SHEETS_WEBHOOK_URL = ''; // TODO: Paste client's Google Sheets webhook URL here
  const NOTIFICATION_EMAIL = '';        // TODO: Paste client's notification email here

  window.submitRequest = async () => {
    const roleType = requestTypeInput ? requestTypeInput.value : 'Family needing a Sitter';
    const clientName = document.getElementById('client-name')?.value || 'there';
    const clientPhone = document.getElementById('client-phone')?.value || '';
    const clientEmail = document.getElementById('client-email')?.value || '';
    const specificNeed = document.getElementById('specific-need')?.value || '';
    const dateNeeded = document.getElementById('need-date-picker')?.value || '';
    const scheduleType = document.getElementById('need-schedule-type')?.value || '';
    const startTime = document.getElementById('need-start-time')?.value || '';
    const duration = document.getElementById('need-duration')?.value || '';
    const location = document.getElementById('need-location')?.value || '';
    const additionalNotes = document.getElementById('need-details')?.value || '';

    const payload = {
      role: roleType,
      fullName: clientName,
      phone: clientPhone,
      email: clientEmail,
      specificNeed: specificNeed,
      dates: dateNeeded,
      frequency: scheduleType,
      startTime: startTime,
      duration: duration,
      location: location,
      notes: additionalNotes,
      submittedAt: new Date().toLocaleString('en-AU', { timeZone: 'Australia/Sydney' })
    };

    // If Google Sheets webhook is configured, dispatch the entry
    if (GOOGLE_SHEETS_WEBHOOK_URL) {
      try {
        await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } catch (err) {
        console.warn('Google Sheets dispatch notice:', err);
      }
    }

    window.closeRequestModal();
    window.showToast(`Thank you, ${clientName}! Your request has been received. We are preparing your accurate quotes now.`);
    const form = document.getElementById('request-form');
    if (form) form.reset();

    // Re-default date picker after form reset
    if (datePicker) {
      datePicker.value = new Date().toISOString().split('T')[0];
    }
  };

  // 4. Header Scroll Transparency Effect
  const siteHeader = document.getElementById('site-header');
  if (siteHeader) {
    const handleHeaderScroll = () => {
      if (window.scrollY > 20) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll(); // Check on initial page load
  }
});

