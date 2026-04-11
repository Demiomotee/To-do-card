// ── Time remaining ──────────────────────────────────────

const DUE_DATE = new Date('2026-04-18T17:00:00Z');

function getTimeText() {
  const diff = DUE_DATE - Date.now();
  const abs  = Math.abs(diff);

  const mins  = Math.floor(abs / 60000);
  const hours = Math.floor(abs / 3600000);
  const days  = Math.floor(abs / 86400000);

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
  var result = getTimeText();
  chip.textContent = result.text;
  chip.className = 'time-chip ' + result.cls;
}

updateTimeChip();
setInterval(updateTimeChip, 60000);


// ── Checkbox toggle ─────────────────────────────────────

var checkbox = document.getElementById('todo-complete');
var card     = document.getElementById('todo-card');
var status   = document.getElementById('todo-status');
var mainText = document.getElementById('main-todo-text');

checkbox.addEventListener('change', function() {
  if (this.checked) {
    card.classList.add('completed');
    status.textContent = 'Done';
    status.className = 'badge status-done';
    status.setAttribute('aria-label', 'Status: Done');
  } else {
    card.classList.remove('completed');
    status.textContent = 'In Progress';
    status.className = 'badge status-progress';
    status.setAttribute('aria-label', 'Status: In Progress');
  }
});


// ── Dark / Light theme toggle ───────────────────────────

var toggleBtn  = document.getElementById('theme-toggle');
var toggleIcon = document.getElementById('toggle-icon');
var html       = document.documentElement;

// Load saved preference
var saved = localStorage.getItem('theme');
if (saved) {
  html.setAttribute('data-theme', saved);
  toggleIcon.textContent = saved === 'dark' ? '☀️' : '🌙';
}

toggleBtn.addEventListener('click', function() {
  var current = html.getAttribute('data-theme');
  var next    = current === 'dark' ? 'light' : 'dark';

  html.setAttribute('data-theme', next);
  toggleIcon.textContent = next === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('theme', next);
});
