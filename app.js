const DUE_DATE = new Date('2026-04-18T17:00:00Z');

function getTimeText() {
  const diff = DUE_DATE - Date.now();
  const abs  = Math.abs(diff);

  const mins  = Math.floor(abs / 60000);
  const hours = Math.floor(abs / 3600000);
  const days  = Math.floor(abs / 86400000);

  if (abs < 60000) return { text: 'Due now!', cls: 'time-now' };

  if (diff > 0) {
    if (days >= 2)  return { text: `Due in ${days} days`, cls: 'time-future' };
    if (days === 1) return { text: 'Due tomorrow',        cls: 'time-future' };
    if (hours >= 1) return { text: `Due in ${hours}h`,    cls: 'time-future' };
                    return { text: `Due in ${mins}m`,     cls: 'time-future' };
  } else {
    if (days >= 2)  return { text: `Overdue by ${days} days`, cls: 'time-overdue' };
    if (days === 1) return { text: 'Overdue by 1 day',        cls: 'time-overdue' };
    if (hours >= 1) return { text: `Overdue by ${hours}h`,    cls: 'time-overdue' };
                    return { text: `Overdue by ${mins}m`,     cls: 'time-overdue' };
  }
}

function updateTimeChip() {
  const chip = document.getElementById('time-remaining');
  const { text, cls } = getTimeText();
  chip.textContent = text;
  chip.className = 'time-chip ' + cls;
}

updateTimeChip();
setInterval(updateTimeChip, 60000);


// Checkbox toggle
const checkbox = document.getElementById('todo-complete');
const card     = document.getElementById('todo-card');
const status   = document.getElementById('todo-status');

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


