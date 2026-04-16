import { mountEdit } from './components/edit/edit.js';

const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];
const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

/* ── Live date ── */
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
  setTimeout(() => { setLiveDate(); setInterval(setLiveDate, 86400000); }, ms);
})();

/* ── Due date state ── */
let currentDue = new Date('2026-04-18T17:00:00Z');
let isDone = false;

function getTimeText() {
  if (isDone) return { text: 'Completed', cls: 'time-done' };
  const diff  = currentDue - Date.now();
  const abs   = Math.abs(diff);
  const mins  = Math.floor(abs / 60000);
  const hours = Math.floor(abs / 3600000);
  const days  = Math.floor(abs / 86400000);
  if (abs < 60000) return { text: 'Due now!', cls: 'time-now' };
  if (diff > 0) {
    if (days >= 2)  return { text: `Due in ${days} days`,  cls: 'time-future' };
    if (days === 1) return { text: 'Due tomorrow',          cls: 'time-future' };
    if (hours >= 1) return { text: `Due in ${hours}h`,     cls: 'time-future' };
                    return { text: `Due in ${mins}m`,      cls: 'time-future' };
  } else {
    if (days >= 2)  return { text: `Overdue by ${days} days`, cls: 'time-overdue' };
    if (days === 1) return { text: 'Overdue by 1 day',         cls: 'time-overdue' };
    if (hours >= 1) return { text: `Overdue by ${hours}h`,     cls: 'time-overdue' };
                    return { text: `Overdue by ${mins}m`,      cls: 'time-overdue' };
  }
}

function updateTimeChip() {
  const chip    = document.getElementById('time-remaining');
  const overdue = document.getElementById('overdue-indicator');
  const r       = getTimeText();
  chip.textContent = r.text;
  chip.className   = 'time-chip ' + r.cls;
  if (r.cls === 'time-overdue') {
    overdue.classList.remove('hidden');
  } else {
    overdue.classList.add('hidden');
  }
}

updateTimeChip();
setInterval(updateTimeChip, 30000);

/* ── Checkboxes + status sync ── */
const checkboxes     = document.querySelectorAll('.task-checkbox');
const card           = document.getElementById('todo-card');
const statusBadge    = document.getElementById('todo-status');
const statusSelect   = document.getElementById('status-control');
const todoCountLabel = document.getElementById('todo-count-label');
const priorityBadge  = document.getElementById('priority-badge');
const priorityBar    = document.getElementById('priority-indicator');

function applyStatusUI(status) {
  const done = status === 'Done';
  isDone = done;
  statusBadge.textContent = status;
  statusBadge.className   = `badge status-${status === 'In Progress' ? 'progress' : status.toLowerCase()}`;
  statusBadge.setAttribute('aria-label', `Status: ${status}`);
  card.classList.toggle('done-state', done);
  statusSelect.value = status;
  // sync checkboxes
  checkboxes.forEach(cb => { cb.checked = done; });
  updateTimeChip();
  updateCount();
}

function updateCount() {
  const total   = checkboxes.length;
  const checked = [...checkboxes].filter(cb => cb.checked).length;
  const rem     = total - checked;
  todoCountLabel.textContent = `${rem} To-do${rem !== 1 ? 's' : ''}`;
}

function deriveStatusFromCheckboxes() {
  const total   = checkboxes.length;
  const checked = [...checkboxes].filter(cb => cb.checked).length;
  if (checked === 0)     return 'Pending';
  if (checked < total)   return 'In Progress';
  return 'Done';
}

checkboxes.forEach(cb => {
  cb.addEventListener('change', () => {
    applyStatusUI(deriveStatusFromCheckboxes());
  });
});

statusSelect.addEventListener('change', () => {
  applyStatusUI(statusSelect.value);
});

applyStatusUI('Pending');

/* ── Priority helpers ── */
function applyPriority(p) {
  const map = {
    High:   { badge: 'priority-high',   bar: 'priority-high-bar',   label: 'Priority: High' },
    Medium: { badge: 'priority-medium', bar: 'priority-medium-bar', label: 'Priority: Medium' },
    Low:    { badge: 'priority-low',    bar: 'priority-low-bar',    label: 'Priority: Low' }
  };
  const m = map[p] || map.High;
  priorityBadge.textContent = p;
  priorityBadge.className   = `badge ${m.badge}`;
  priorityBadge.setAttribute('aria-label', m.label);
  priorityBar.className     = `priority-indicator ${m.bar}`;
}

applyPriority('High');

/* ── Expand / collapse description ── */
const expandBtn     = document.getElementById('expand-toggle');
const collapsible   = document.getElementById('collapsible-section');

expandBtn.addEventListener('click', () => {
  const isExpanded = collapsible.classList.toggle('expanded');
  collapsible.classList.toggle('collapsed', !isExpanded);
  expandBtn.setAttribute('aria-expanded', String(isExpanded));
  expandBtn.textContent = isExpanded ? 'See less' : 'See more';
});

/* ── Alert banner ── */
const banner     = document.getElementById('alert-banner');
const alertMsg   = document.getElementById('alert-msg');
const alertClose = document.getElementById('alert-close');
let hideTimer    = null;

function showAlert(msg, type) {
  clearTimeout(hideTimer);
  banner.className     = `alert-banner alert-${type} visible`;
  alertMsg.textContent = msg;
  hideTimer = setTimeout(() => banner.classList.remove('visible'), 3500);
}

alertClose.addEventListener('click', () => {
  clearTimeout(hideTimer);
  banner.classList.remove('visible');
});

/* ── Edit button — single listener ── */
document.getElementById('btn-edit').addEventListener('click', () => {
  mountEdit(
    {
      title:       document.getElementById('todo-title').textContent.trim(),
      description: document.getElementById('todo-desc').textContent.trim(),
      priority:    priorityBadge.textContent.trim(),
      due:         currentDue.toISOString()
    },
    (updated) => {
      // Apply title
      document.getElementById('todo-title').textContent = updated.title;

      // Apply description
      document.getElementById('todo-desc').textContent = updated.description;

      // Apply priority
      applyPriority(updated.priority);

      // Apply due date
      if (updated.due) {
        currentDue = new Date(updated.due);
        const opts = { month: 'short', day: 'numeric', year: 'numeric' };
        const display = currentDue.toLocaleDateString('en-US', opts);
        const dueEl = document.getElementById('due-date-display');
        dueEl.textContent = `Due ${display}`;
        dueEl.setAttribute('datetime', currentDue.toISOString());
        updateTimeChip();
      }

      showAlert('Task updated successfully.', 'edit');
      document.getElementById('btn-edit').focus();
    },
    () => {
      // cancelled — return focus
      document.getElementById('btn-edit').focus();
    }
  );
});

/* ── Delete button ── */
document.getElementById('btn-delete').addEventListener('click', () => {
  showAlert('Delete action triggered.', 'delete');
});

/* ── Theme toggle ── */
const toggleBtn   = document.getElementById('theme-toggle');
const iconMoon    = document.getElementById('icon-moon');
const iconSun     = document.getElementById('icon-sun');
const toggleLabel = document.getElementById('toggle-label');
const html        = document.documentElement;

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  iconMoon.style.display  = theme === 'dark' ? 'none'  : 'block';
  iconSun.style.display   = theme === 'dark' ? 'block' : 'none';
  toggleLabel.textContent = theme === 'dark' ? 'Light' : 'Dark';
  localStorage.setItem('theme', theme);
}

applyTheme(localStorage.getItem('theme') || 'light');
toggleBtn.addEventListener('click', () => {
  applyTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});
