// Time remaining
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


// Status updates based on checkboxes
var checkboxes = document.querySelectorAll('.task-checkbox');
var card       = document.getElementById('todo-card');
var status     = document.getElementById('todo-status');

function updateStatus() {
  var checked = 0;
  checkboxes.forEach(function(cb) {
    if (cb.checked) checked++;
  });

  if (checked === 0) {
    status.textContent = 'Pending';
    status.className   = 'badge status-pending';
    status.setAttribute('aria-label', 'Status: Pending');
    card.classList.remove('completed');
  } else if (checked < checkboxes.length) {
    status.textContent = 'In Progress';
    status.className   = 'badge status-progress';
    status.setAttribute('aria-label', 'Status: In Progress');
    card.classList.remove('completed');
  } else {
    status.textContent = 'Done';
    status.className   = 'badge status-done';
    status.setAttribute('aria-label', 'Status: Done');
    card.classList.add('completed');
  }
}

checkboxes.forEach(function(cb) {
  cb.addEventListener('change', updateStatus);
});


// Dark / light toggle
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
