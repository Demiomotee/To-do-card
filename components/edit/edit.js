export function mountEdit(container, data, onSave, onCancel) {
  fetch('./components/edit/edit.html')
    .then(res => res.text())
    .then(html => {
      container.innerHTML = html;

      const modal = document.getElementById('edit-modal');
      const form = modal.querySelector('[data-testid="test-todo-edit-form"]');

      const title = form.querySelector('#edit-title');
      const desc = form.querySelector('#edit-desc');
      const priority = form.querySelector('#edit-priority');
      const due = form.querySelector('#edit-due');
      const status = form.querySelector('#edit-status');

      const taskList = form.querySelector('#task-list');
      const addTaskBtn = form.querySelector('#add-task');

      // PREFILL
      title.value = data.title;
      desc.value = data.description;
      priority.value = data.priority;
      due.value = data.due;
      status.value = data.status || "Pending";

      updatePriorityStyle(priority);

      // PRIORITY STYLE CHANGE
      priority.addEventListener('change', () => {
        updatePriorityStyle(priority);
      });

      function updatePriorityStyle(el) {
        el.classList.remove('high','medium','low');
        if (el.value === 'High') el.classList.add('high');
        if (el.value === 'Medium') el.classList.add('medium');
        if (el.value === 'Low') el.classList.add('low');
      }

      // ADD TASK
      addTaskBtn.onclick = () => {
        const div = document.createElement('div');
        div.className = 'task-item';
        div.innerHTML = `<input type="text" placeholder="New task..." />`;
        taskList.appendChild(div);
      };

      // CLOSE
      document.getElementById('modal-close').onclick = close;
      modal.onclick = (e) => {
        if (e.target === modal) close();
      };

      function close() {
        container.innerHTML = '';
        onCancel();
      }

      // SAVE
      form.querySelector('[data-testid="test-todo-save-button"]').onclick = () => {
        const tasks = [...taskList.querySelectorAll('input')].map(i => i.value);

        onSave({
          title: title.value,
          description: desc.value,
          priority: priority.value,
          due: due.value,
          status: status.value,
          tasks
        });

        container.innerHTML = '';
      };

      // CANCEL
      form.querySelector('[data-testid="test-todo-cancel-button"]').onclick = close;
    });
}
