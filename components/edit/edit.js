export function mountEdit(container, data, onSave, onCancel) {
  fetch('./components/edit/edit.html')
    .then(res => res.text())
    .then(html => {
      container.insertAdjacentHTML('beforeend', html);

      const modal = container.querySelector('.modal-overlay');

      const form = modal.querySelector('[data-testid="test-todo-edit-form"]');

      const title = form.querySelector('#edit-title');
      const desc = form.querySelector('#edit-desc');
      const priority = form.querySelector('#edit-priority');
      const due = form.querySelector('#edit-due');

      // PREFILL
      title.value = data.title || '';
      desc.value = data.description || '';
      priority.value = data.priority || 'Low';
      due.value = data.due || '';

      // CLOSE FUNCTION
      function close() {
        modal.remove();
        onCancel?.();
      }

      modal.querySelector('#modal-close').onclick = close;

      modal.addEventListener('click', (e) => {
        if (e.target === modal) close();
      });

      // SAVE
      form.querySelector('[data-testid="test-todo-save-button"]').onclick = () => {
        onSave({
          title: title.value,
          description: desc.value,
          priority: priority.value,
          due: due.value
        });

        modal.remove();
      };

      // CANCEL
      form.querySelector('[data-testid="test-todo-cancel-button"]').onclick = close;
    });
}
