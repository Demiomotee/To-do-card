// ── Real-time date ─────────────────────────────────────────────────────────
var MONTHS = ['January','February','March','April','May','June',
              'July','August','September','October','November','December'];
var DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

function setLiveDate() {
  var n = new Date();
  document.getElementById('live-day-number').textContent = n.getDate();
  document.getElementById('live-day-month').textContent  = MONTHS[n.getMonth()];
  document.getElementById('live-day-name').textContent   = DAYS[n.getDay()];
}

setLiveDate();
(function scheduleMidnight() {
  var n   = new Date();
  var ms  = new Date(n.getFullYear(), n.getMonth(), n.getDate() + 1) - n;
  setTimeout(function() { setLiveDate(); setInterval(setLiveDate, 86400000); }, ms);
})();

// ── Time chip ──────────────────────────────────────────────────────────────
var DUE_DATE = new Date('2026-04-18T17:00:00Z');

function getTimeText() {
  var diff  = DUE_DATE - Date.now();
  var abs   = Math.abs(diff);
  var mins  = Math.floor(abs / 60000);
  var hours = Math.floor(abs / 3600000);
  var days  = Math.floor(abs / 86400000);
  if (abs < 60000) return { text: 'Due now!', cls: 'time-now' };
  if (diff > 0) {
    if (days >= 2)  return { text: 'Due in ' + days + ' days', cls: 'time-future' };
    if (days === 1) return { text: 'Due tomorrow',              cls: 'time-future' };
    if (hours >= 1) return { text: 'Due in ' + hours + 'h',    cls: 'time-future' };
                    return { text: 'Due in ' + mins + 'm',     cls: 'time-future' };
  } else {
    if (days >= 2)  return { text: 'Overdue by ' + days + ' days', cls: 'time-overdue' };
    if (days === 1) return { text: 'Overdue by 1 day',              cls: 'time-overdue' };
    if (hours >= 1) return { text: 'Overdue by ' + hours + 'h',    cls: 'time-overdue' };
                    return { text: 'Overdue by ' + mins + 'm',     cls: 'time-overdue' };
  }
}

function updateTimeChip() {
  var chip = document.getElementById('time-remaining');
  var r    = getTimeText();
  chip.textContent = r.text;
  chip.className   = 'time-chip ' + r.cls;
}

updateTimeChip();
setInterval(updateTimeChip, 60000);

// ── Status + count ─────────────────────────────────────────────────────────
var checkboxes     = document.querySelectorAll('.task-checkbox');
var card           = document.getElementById('todo-card');
var statusBadge    = document.getElementById('todo-status');
var todoCountLabel = document.getElementById('todo-count-label');

function updateStatus() {
  var total   = checkboxes.length;
  var checked = 0;
  checkboxes.forEach(function(cb) { if (cb.checked) checked++; });

  var remaining = total - checked;
  todoCountLabel.textContent = remaining + ' To-do' + (remaining !== 1 ? 's' : '');

  if (checked === 0) {
    statusBadge.textContent = 'Pending';
    statusBadge.className   = 'badge status-pending';
    statusBadge.setAttribute('aria-label', 'Status: Pending');
    card.classList.remove('completed');
  } else if (checked < total) {
    statusBadge.textContent = 'In Progress';
    statusBadge.className   = 'badge status-progress';
    statusBadge.setAttribute('aria-label', 'Status: In Progress');
    card.classList.remove('completed');
  } else {
    statusBadge.textContent = 'Done';
    statusBadge.className   = 'badge status-done';
    statusBadge.setAttribute('aria-label', 'Status: Done');
    card.classList.add('completed');
  }
}

updateStatus();
checkboxes.forEach(function(cb) { cb.addEventListener('change', updateStatus); });

// ── Alert banner ───────────────────────────────────────────────────────────
var banner     = document.getElementById('alert-banner');
var alertMsg   = document.getElementById('alert-msg');
var alertClose = document.getElementById('alert-close');
var hideTimer  = null;

function showAlert(msg, type) {
  clearTimeout(hideTimer);
  banner.className     = 'alert-banner alert-' + type + ' visible';
  alertMsg.textContent = msg;
  hideTimer = setTimeout(function() { banner.classList.remove('visible'); }, 3500);
}

alertClose.addEventListener('click', function() {
  clearTimeout(hideTimer);
  banner.classList.remove('visible');
});

// ── Edit button ────────────────────────────────────────────────────────────
document.getElementById('btn-edit').addEventListener('click', function() {
  alert('edit clicked');
  showAlert('Edit action triggered.', 'edit');
});

// ── Delete button ──────────────────────────────────────────────────────────
document.getElementById('btn-delete').addEventListener('click', function() {
  alert('Delete clicked');
  showAlert('Delete action triggered.', 'delete');
});

// ── Dark / light toggle ────────────────────────────────────────────────────
var toggleBtn   = document.getElementById('theme-toggle');
var iconMoon    = document.getElementById('icon-moon');
var iconSun     = document.getElementById('icon-sun');
var toggleLabel = document.getElementById('toggle-label');
var html        = document.documentElement;

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  if (theme === 'dark') {
    iconMoon.style.display  = 'none';
    iconSun.style.display   = 'block';
    toggleLabel.textContent = 'Light';
  } else {
    iconMoon.style.display  = 'block';
    iconSun.style.display   = 'none';
    toggleLabel.textContent = 'Dark';
  }
}

var saved = localStorage.getItem('theme') || 'light';
applyTheme(saved);

toggleBtn.addEventListener('click', function() {
  var next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem('theme', next);
});
