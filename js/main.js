/**
 * Lauryn and Littles - Interactive Logic for Hero Landing Page & Footer
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Request Modal (Tell us what you need)
  const requestModal = document.getElementById('request-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const roleFamilyBtn = document.getElementById('role-family-btn');
  const roleSitterBtn = document.getElementById('role-sitter-btn');
  const modalTitle = document.getElementById('modal-title');
  const requestForm = document.getElementById('request-form');
  const waitingListForm = document.getElementById('waiting-list-form');
  const requestTypeInput = document.getElementById('request-type');

  window.setRole = (role) => {
    if (role === 'sitter') {
      if (roleFamilyBtn) {
        roleFamilyBtn.classList.remove('active');
        roleFamilyBtn.setAttribute('aria-selected', 'false');
      }
      if (roleSitterBtn) {
        roleSitterBtn.classList.add('active');
        roleSitterBtn.setAttribute('aria-selected', 'true');
      }
      if (requestTypeInput) requestTypeInput.value = 'Sitter looking for a Family';
      if (modalTitle) modalTitle.textContent = 'JOIN OUR WAITING LIST';
      if (requestForm) requestForm.style.display = 'none';
      if (waitingListForm) waitingListForm.style.display = 'flex';
    } else {
      if (roleSitterBtn) {
        roleSitterBtn.classList.remove('active');
        roleSitterBtn.setAttribute('aria-selected', 'false');
      }
      if (roleFamilyBtn) {
        roleFamilyBtn.classList.add('active');
        roleFamilyBtn.setAttribute('aria-selected', 'true');
      }
      if (requestTypeInput) requestTypeInput.value = 'Family needing a Sitter';
      if (modalTitle) modalTitle.textContent = 'Tell us what you need';
      if (waitingListForm) waitingListForm.style.display = 'none';
      if (requestForm) requestForm.style.display = 'flex';
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

  // 4. Boutique Custom Calendar Date Range Picker (Hotel Booking Style 2-Click Selection)
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
  const calRangeHint = document.getElementById('cal-range-hint');

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNamesShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  let currentDate = new Date();
  let rangeStartDate = null;
  let rangeEndDate = null;
  let viewYear = currentDate.getFullYear();
  let viewMonth = currentDate.getMonth();

  // Helper to format short date
  const formatShortDate = (d) => {
    if (!d) return '';
    const dayName = dayNamesShort[d.getDay()];
    const dateNum = d.getDate();
    const monthName = monthNames[d.getMonth()].slice(0, 3);
    return `${dayName}, ${dateNum} ${monthName}`;
  };

  // Helper to format YYYY-MM-DD
  const formatISO = (d) => {
    if (!d) return '';
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const updateDateDisplay = () => {
    if (rangeStartDate && rangeEndDate) {
      if (rangeStartDate.getTime() === rangeEndDate.getTime()) {
        if (dateDisplayLabel) dateDisplayLabel.textContent = `${formatShortDate(rangeStartDate)} (1 day)`;
        if (hiddenDateInput) hiddenDateInput.value = formatISO(rangeStartDate);
      } else {
        const diffTime = Math.abs(rangeEndDate - rangeStartDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        if (dateDisplayLabel) dateDisplayLabel.textContent = `${formatShortDate(rangeStartDate)} – ${formatShortDate(rangeEndDate)} (${diffDays} days)`;
        if (hiddenDateInput) hiddenDateInput.value = `${formatISO(rangeStartDate)} to ${formatISO(rangeEndDate)}`;
      }
      if (calRangeHint) calRangeHint.textContent = 'Dates selected. Click any date to adjust end date.';
    } else if (rangeStartDate) {
      if (dateDisplayLabel) dateDisplayLabel.textContent = `${formatShortDate(rangeStartDate)} – Click end date`;
      if (hiddenDateInput) hiddenDateInput.value = formatISO(rangeStartDate);
      if (calRangeHint) calRangeHint.textContent = 'Step 2: Click departure / end date';
    } else {
      if (dateDisplayLabel) dateDisplayLabel.textContent = 'Select Dates';
      if (hiddenDateInput) hiddenDateInput.value = '';
      if (calRangeHint) calRangeHint.textContent = 'Step 1: Click start date';
    }
  };

  // Initialize date display
  updateDateDisplay();

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
      const dayTime = dayDate.getTime();

      const dayBtn = document.createElement('button');
      dayBtn.type = 'button';
      dayBtn.className = 'calendar-day-btn';
      dayBtn.textContent = d;
      dayBtn.dataset.time = dayTime;

      // Check if past date
      if (dayDate < today) {
        dayBtn.classList.add('disabled');
        dayBtn.disabled = true;
      } else {
        // Today indicator
        if (dayTime === today.getTime()) {
          dayBtn.classList.add('today');
        }

        // Range styling
        if (rangeStartDate && dayTime === rangeStartDate.getTime()) {
          dayBtn.classList.add('range-start', 'selected');
        }
        if (rangeEndDate && dayTime === rangeEndDate.getTime()) {
          dayBtn.classList.add('range-end', 'selected');
        }
        if (rangeStartDate && rangeEndDate && dayTime > rangeStartDate.getTime() && dayTime < rangeEndDate.getTime()) {
          dayBtn.classList.add('in-range');
        }

        dayBtn.addEventListener('mouseenter', () => {
          if (rangeStartDate && !rangeEndDate) {
            const allDayBtns = calDaysGrid.querySelectorAll('.calendar-day-btn:not(.disabled)');
            allDayBtns.forEach((btn) => {
              const bTime = Number(btn.dataset.time);
              if (bTime > rangeStartDate.getTime() && bTime <= dayTime) {
                btn.classList.add('range-hover');
              } else {
                btn.classList.remove('range-hover');
              }
            });
          }
        });

        dayBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const clickedDate = new Date(year, month, d);
          clickedDate.setHours(0, 0, 0, 0);

          if (!rangeStartDate) {
            // No start date: set start date
            rangeStartDate = clickedDate;
            rangeEndDate = null;
          } else if (rangeStartDate && !rangeEndDate) {
            // Selecting end date
            if (clickedDate.getTime() < rangeStartDate.getTime()) {
              rangeStartDate = clickedDate;
              rangeEndDate = null;
            } else {
              rangeEndDate = clickedDate;
            }
          } else if (rangeStartDate && rangeEndDate) {
            // Both already selected:
            // Clicking any date after start date adjusts the END DATE directly!
            if (clickedDate.getTime() > rangeStartDate.getTime()) {
              rangeEndDate = clickedDate;
            } else if (clickedDate.getTime() === rangeStartDate.getTime()) {
              rangeEndDate = rangeStartDate;
            } else {
              // Clicked earlier date: start a new range from this date
              rangeStartDate = clickedDate;
              rangeEndDate = null;
            }
          }

          updateDateDisplay();
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
      rangeStartDate = now;
      rangeEndDate = now;
      viewYear = now.getFullYear();
      viewMonth = now.getMonth();
      updateDateDisplay();
      renderCalendar(viewYear, viewMonth);
    });
  }

  const calDoneBtn = document.getElementById('cal-btn-done');
  if (calDoneBtn) {
    calDoneBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (dateWrap) dateWrap.classList.remove('open');
      if (dateTrigger) dateTrigger.setAttribute('aria-expanded', 'false');
    });
  }

  if (calClearBtn) {
    calClearBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      rangeStartDate = null;
      rangeEndDate = null;
      updateDateDisplay();
      renderCalendar(viewYear, viewMonth);
    });
  }

  // 4b. Boutique Custom Hours Range Picker (2-Click Range Selection)
  const timeWrap = document.getElementById('custom-time-picker');
  const timeTrigger = document.getElementById('hours-picker-trigger');
  const timeDisplayLabel = document.getElementById('hours-display-label');
  const hiddenTimeInput = document.getElementById('need-start-time');
  const timeSlotsGrid = document.getElementById('time-slots-grid');
  const timeRangeHint = document.getElementById('time-range-hint');
  const timeAllDayBtn = document.getElementById('time-btn-all-day');
  const timeResetBtn = document.getElementById('time-btn-reset');

  const TIME_SLOTS = [
    '7:00 AM', '8:00 AM', '9:00 AM',
    '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM',
    '4:00 PM', '5:00 PM', '6:00 PM',
    '7:00 PM', '8:00 PM', '9:00 PM',
    '10:00 PM', '11:00 PM', 'Overnight'
  ];

  let timeStartIdx = null;
  let timeEndIdx = null;

  const updateTimeDisplay = () => {
    if (timeStartIdx !== null && timeEndIdx !== null) {
      const startSlot = TIME_SLOTS[timeStartIdx];
      const endSlot = TIME_SLOTS[timeEndIdx];
      if (timeStartIdx === timeEndIdx) {
        if (timeDisplayLabel) timeDisplayLabel.textContent = `${startSlot} (1 hr)`;
        if (hiddenTimeInput) hiddenTimeInput.value = startSlot;
      } else {
        const diffHrs = timeEndIdx - timeStartIdx;
        const hrText = (startSlot !== 'Overnight' && endSlot !== 'Overnight') ? ` (${diffHrs} hrs)` : '';
        if (timeDisplayLabel) timeDisplayLabel.textContent = `${startSlot} – ${endSlot}${hrText}`;
        if (hiddenTimeInput) hiddenTimeInput.value = `${startSlot} - ${endSlot}`;
      }
      if (timeRangeHint) timeRangeHint.textContent = 'Hours selected. Click any slot to adjust end hour.';
    } else if (timeStartIdx !== null) {
      const startSlot = TIME_SLOTS[timeStartIdx];
      if (timeDisplayLabel) timeDisplayLabel.textContent = `${startSlot} – Click end hour`;
      if (hiddenTimeInput) hiddenTimeInput.value = startSlot;
      if (timeRangeHint) timeRangeHint.textContent = 'Step 2: Click end hour';
    } else {
      if (timeDisplayLabel) timeDisplayLabel.textContent = 'Select Hours';
      if (hiddenTimeInput) hiddenTimeInput.value = '';
      if (timeRangeHint) timeRangeHint.textContent = 'Step 1: Click start hour';
    }
  };

  updateTimeDisplay();

  const renderTimeSlots = () => {
    if (!timeSlotsGrid) return;
    timeSlotsGrid.innerHTML = '';

    TIME_SLOTS.forEach((slot, idx) => {
      const slotBtn = document.createElement('button');
      slotBtn.type = 'button';
      slotBtn.className = 'time-slot-btn';
      slotBtn.textContent = slot;
      slotBtn.dataset.idx = idx;

      // Active styling
      if (timeStartIdx !== null && idx === timeStartIdx) {
        slotBtn.classList.add('range-start', 'selected');
      }
      if (timeEndIdx !== null && idx === timeEndIdx) {
        slotBtn.classList.add('range-end', 'selected');
      }
      if (timeStartIdx !== null && timeEndIdx !== null && idx > timeStartIdx && idx < timeEndIdx) {
        slotBtn.classList.add('in-range');
      }

      slotBtn.addEventListener('mouseenter', () => {
        if (timeStartIdx !== null && timeEndIdx === null) {
          const allBtns = timeSlotsGrid.querySelectorAll('.time-slot-btn');
          allBtns.forEach((btn) => {
            const bIdx = Number(btn.dataset.idx);
            if (bIdx > timeStartIdx && bIdx <= idx) {
              btn.classList.add('range-hover');
            } else {
              btn.classList.remove('range-hover');
            }
          });
        }
      });

      slotBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (timeStartIdx === null) {
          // 1st click
          timeStartIdx = idx;
          timeEndIdx = null;
        } else if (timeStartIdx !== null && timeEndIdx === null) {
          // 2nd click
          if (idx < timeStartIdx) {
            timeStartIdx = idx;
            timeEndIdx = null;
          } else {
            timeEndIdx = idx;
          }
        } else if (timeStartIdx !== null && timeEndIdx !== null) {
          // Both already selected:
          // Clicking any slot after start time adjusts the END HOUR directly!
          if (idx > timeStartIdx) {
            timeEndIdx = idx;
          } else if (idx === timeStartIdx) {
            timeEndIdx = timeStartIdx;
          } else {
            // Clicked earlier slot: start new selection from this hour
            timeStartIdx = idx;
            timeEndIdx = null;
          }
        }
        updateTimeDisplay();
        renderTimeSlots();
      });

      timeSlotsGrid.appendChild(slotBtn);
    });
  };

  renderTimeSlots();

  if (timeTrigger && timeWrap) {
    timeTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = timeWrap.classList.contains('open');
      closeAllDropdowns();

      if (!isOpen) {
        timeWrap.classList.add('open');
        timeTrigger.setAttribute('aria-expanded', 'true');
        renderTimeSlots();
      }
    });
  }

  if (timeAllDayBtn) {
    timeAllDayBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      timeStartIdx = 2; // 9:00 AM
      timeEndIdx = 10;  // 5:00 PM
      updateTimeDisplay();
      renderTimeSlots();
    });
  }

  if (timeResetBtn) {
    timeResetBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      timeStartIdx = null;
      timeEndIdx = null;
      updateTimeDisplay();
      renderTimeSlots();
    });
  }

  const timeDoneBtn = document.getElementById('time-btn-done');
  if (timeDoneBtn) {
    timeDoneBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (timeWrap) timeWrap.classList.remove('open');
      if (timeTrigger) timeTrigger.setAttribute('aria-expanded', 'false');
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
    if (timeWrap) {
      timeWrap.classList.remove('open');
      if (timeTrigger) timeTrigger.setAttribute('aria-expanded', 'false');
    }
  };

  document.addEventListener('click', (e) => {
    // If click is outside modal inputs
    if (!e.target.closest('.custom-select') && !e.target.closest('.custom-date-wrap') && !e.target.closest('.custom-time-wrap')) {
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
    const hoursNeeded = document.getElementById('need-start-time')?.value || '';
    const location = document.getElementById('need-location')?.value || '';
    const additionalNotes = document.getElementById('need-details')?.value || '';

    const payload = {
      role: roleType,
      fullName: clientName,
      phone: clientPhone,
      email: clientEmail,
      specificNeed: specificNeed,
      dates: dateNeeded,
      hours: hoursNeeded,
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

    // Re-default date range and hours range after form reset
    rangeStartDate = null;
    rangeEndDate = null;
    updateDateDisplay();

    timeStartIdx = null;
    timeEndIdx = null;
    updateTimeDisplay();
  };

  window.submitWaitingList = async () => {
    const fullName = document.getElementById('waiting-name')?.value || 'there';
    const email = document.getElementById('waiting-email')?.value || '';
    const phone = document.getElementById('waiting-phone')?.value || '';
    const city = document.getElementById('waiting-city')?.value || '';

    const payload = {
      role: 'Sitter looking for a Family (Waiting List)',
      fullName: fullName,
      email: email,
      phone: phone,
      city: city,
      submittedAt: new Date().toLocaleString('en-AU', { timeZone: 'Australia/Sydney' })
    };

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
    window.showToast(`Thank you, ${fullName}! You’ve been added to our waiting list.`);
    const waitingForm = document.getElementById('waiting-list-form');
    if (waitingForm) waitingForm.reset();
  };

  // 4. Header Scroll Transparency Effect (Hero Page only)
  const siteHeader = document.getElementById('site-header');
  const isLegalPage = document.body.classList.contains('legal-page-body');
  if (siteHeader && !isLegalPage) {
    const handleHeaderScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      if (scrollY > 12) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    window.addEventListener('touchmove', handleHeaderScroll, { passive: true });
    document.addEventListener('scroll', handleHeaderScroll, { passive: true });
    window.addEventListener('resize', handleHeaderScroll, { passive: true });
    window.addEventListener('load', handleHeaderScroll, { passive: true });
    handleHeaderScroll(); // Check on initial page load
  }

  // 5. Scroll Entrance Reveal for Footer (Across All Pages)
  const siteFooter = document.querySelector('.site-footer');
  if (siteFooter) {
    if ('IntersectionObserver' in window) {
      const footerObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            siteFooter.classList.add('footer-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px 40px 0px' });
      footerObserver.observe(siteFooter);
    } else {
      siteFooter.classList.add('footer-visible');
    }
  }
});


