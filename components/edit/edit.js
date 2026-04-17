export function mountEdit(data, onSave, onCancel) {

  Promise.all([
    fetch('./components/edit/edit.html').then(r => r.text()),
    loadCSS('./components/edit/edit.css')
  ]).then(([html]) => {

    document.body.insertAdjacentHTML('beforeend', html);

    const modal   = document.getElementById('edit-modal');
    const titleEl = document.getElementById('edit-title');
    const descEl  = document.getElementById('edit-desc');
    const priEl   = document.getElementById('edit-priority');
    const dueEl   = document.getElementById('edit-due');
    const list    = document.getElementById('subtask-list');

    // Pre-fill fields
    titleEl.value = data.title       || '';
    descEl.value  = data.description || '';
    priEl.value   = data.priority    || 'High';

    if (data.due) {
      dueEl.value = data.due.split('T')[0];
    }


    const subtasks = data.subtasks ? data.subtasks.map(s => ({ ...s })) : [];

    function renderSubtasks() {
      list.innerHTML = '';
      subtasks.forEach(function(task, index) {
        const row = document.createElement('div');
        row.className = 'subtask-row';

        row.innerHTML = `
          <input
            type="checkbox"
            aria-label="Mark subtask done"
            ${task.done ? 'checked' : ''}
          />
          <input
            type="text"
            value="${escapeHTML(task.text)}"
            placeholder="Subtask name"
            aria-label="Subtask text"
            class="${task.done ? 'done-text' : ''}"
          />
          <button type="button" class="subtask-remove-btn" aria-label="Remove subtask">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
            </svg>
          </button>
        `;

        const checkbox  = row.querySelector('input[type="checkbox"]');
        const textInput = row.querySelector('input[type="text"]');
        const removeBtn = row.querySelector('.subtask-remove-btn');

        checkbox.addEventListener('change', function() {
          subtasks[index].done = this.checked;
          textInput.classList.toggle('done-text', this.checked);
        });

        textInput.addEventListener('input', function() {
          subtasks[index].text = this.value;
        });

        removeBtn.addEventListener('click', function() {
          subtasks.splice(index, 1);
          renderSubtasks();
        });

        list.appendChild(row);
      });
    }

    renderSubtasks();

    document.getElementById('add-subtask-btn').addEventListener('click', function() {
      subtasks.push({ text: '', done: false });
      renderSubtasks();
      // Focus the newly added text input
      const inputs = list.querySelectorAll('input[type="text"]');
      if (inputs.length) inputs[inputs.length - 1].focus();
    });

    setTimeout(() => titleEl.focus(), 50);


    function close() {
      modal.remove();
      document.getElementById('btn-edit').focus();
      onCancel();
    }

    modal.addEventListener('click', function(e) {
      if (e.target === modal) close();
    });

    document.getElementById('modal-close').addEventListener('click', close);
    document.getElementById('btn-cancel').addEventListener('click', close);

    document.addEventListener('keydown', function onKey(e) {
      if (e.key === 'Escape') {
        document.removeEventListener('keydown', onKey);
        close();
      }
    });


    document.getElementById('btn-save').addEventListener('click', function() {
      const updated = {
        title:       titleEl.value.trim() || data.title,
        description: descEl.value.trim()  || data.description,
        priority:    priEl.value,
        due:         dueEl.value ? dueEl.value + 'T17:00:00Z' : data.due,
        subtasks:    subtasks.filter(s => s.text.trim() !== '') // drop empty rows
      };
      modal.remove();
      document.getElementById('btn-edit').focus();
      onSave(updated);
    });

  });
}

function loadCSS(href) {
  return new Promise((resolve) => {
    if (document.querySelector('link[href="' + href + '"]')) {
      resolve();
      return;
    }
    const link  = document.createElement('link');
    link.rel    = 'stylesheet';
    link.href   = href;
    link.onload = resolve;
    document.head.appendChild(link);
  });
}

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
