import { mountEdit } from './components/edit/edit.js';

const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];
const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

function setLiveDate() {
  const n = new Date();
  document.getElementById('live-day-number').textContent = n.getDate();
  document.getElementById('live-day-month').textContent  = MONTHS[n.getMonth()];
  document.getElementById('live-day-name').textContent   = DAYS[n.getDay()];
}

setLiveDate();

(function scheduleMidnight() {
  const n  = new Date();
  const ms = new Date(n.getFullYear(), n.getMonth(), n.getDate() + 1) - n;
  setTimeout(function() {
    setLiveDate();
    setInterval(setLiveDate, 86400000);
  }, ms);
})();


let DUE_DATE = new Date('2026-04-18T17:00:00Z');

function getTimeText() {
  const diff  = DUE_DATE - Date.now();
  const abs   = Math.abs(diff);
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
  const chip = document.getElementById('time-remaining');
  const r    = getTimeText();
  chip.textContent = r.text;
  chip.className   = 'time-chip ' + r.cls;
}

updateTimeChip();
setInterval(updateTimeChip, 60000);

const checkboxes     = document.querySelectorAll('.task-checkbox');
const card           = document.getElementById('todo-card');
const statusBadge    = document.getElementById('todo-status');
const todoCountLabel = document.getElementById('todo-count-label');

function updateStatus() {
  const total = checkboxes.length;
  let checked = 0;
  checkboxes.forEach(function(cb) { if (cb.checked) checked++; });

  const remaining = total - checked;
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
checkboxes.forEach(cb => cb.addEventListener('change', updateStatus));


const descEl      = document.getElementById('todo-desc');
const seeMoreBtn  = document.getElementById('see-more-btn');

function checkDescOverflow() {
  // Check if text is being clamped
  if (descEl.scrollHeight > descEl.clientHeight + 2) {
    seeMoreBtn.classList.add('visible');
  } else {
    seeMoreBtn.classList.remove('visible');
  }
}

window.addEventListener('load', checkDescOverflow);

seeMoreBtn.addEventListener('click', function() {
  const isExpanded = descEl.classList.contains('expanded');
  descEl.classList.toggle('expanded', !isExpanded);
  seeMoreBtn.textContent     = isExpanded ? 'See more' : 'See less';
  seeMoreBtn.setAttribute('aria-expanded', !isExpanded);
});



const banner     = document.getElementById('alert-banner');
const alertMsg   = document.getElementById('alert-msg');
const alertClose = document.getElementById('alert-close');
let hideTimer    = null;

function showAlert(msg, type) {
  clearTimeout(hideTimer);
  banner.className     = 'alert-banner alert-' + type + ' visible';
  alertMsg.textContent = msg;
  hideTimer = setTimeout(() => banner.classList.remove('visible'), 3500);
}

alertClose.addEventListener('click', function() {
  clearTimeout(hideTimer);
  banner.classList.remove('visible');
});



document.getElementById('btn-edit').addEventListener('click', () => {

  const currentData = {
    title:       document.getElementById('todo-title').textContent.trim(),
    description: document.getElementById('todo-desc').textContent.trim(),
    priority:    document.getElementById('priority-badge').textContent.trim(),
    due:         document.getElementById('due-date-display').getAttribute('datetime')
  };

  mountEdit(
    currentData,

    (updated) => {
      document.getElementById('todo-title').textContent = updated.title;
      document.getElementById('todo-desc').textContent  = updated.description;

  
      const pb  = document.getElementById('priority-badge');
      const cls = { High: 'priority-high', Medium: 'priority-medium', Low: 'priority-low' };
      pb.textContent = updated.priority;
      pb.className   = 'badge ' + (cls[updated.priority] || 'priority-high');
      pb.setAttribute('aria-label', 'Priority: ' + updated.priority);

      if (updated.due) {
        const d      = new Date(updated.due);
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const label  = 'Due ' + months[d.getUTCMonth()] + ' ' + d.getUTCDate() + ', ' + d.getUTCFullYear();
        document.getElementById('due-date-display').textContent = label;
        document.getElementById('due-date-display').setAttribute('datetime', updated.due);
        DUE_DATE = new Date(updated.due);
        updateTimeChip();
      }

      descEl.classList.remove('expanded');
      seeMoreBtn.textContent = 'See more';
      setTimeout(checkDescOverflow, 50);

      showAlert('Changes saved.', 'save');
    },
    () => {}
  );
});


document.getElementById('btn-delete').addEventListener('click', function() {
  showAlert('Delete action triggered.', 'delete');
});



const toggleBtn   = document.getElementById('theme-toggle');
const iconMoon    = document.getElementById('icon-moon');
const iconSun     = document.getElementById('icon-sun');
const toggleLabel = document.getElementById('toggle-label');
const html        = document.documentElement;

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

const saved = localStorage.getItem('theme') || 'light';
applyTheme(saved);

toggleBtn.addEventListener('click', function() {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem('theme', next);
});
