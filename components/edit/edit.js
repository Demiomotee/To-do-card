export function mountEdit(container, data, onSave, onCancel) {
  fetch('./components/edit/edit.html')
    .then(res => res.text())
    .then(html => {
      container.innerHTML = html;

      const form = container.querySelector('[data-testid="test-todo-edit-form"]');

      const titleInput = form.querySelector('#edit-title');
      const descInput = form.querySelector('#edit-desc');
      const priorityInput = form.querySelector('#edit-priority');
      const dueInput = form.querySelector('#edit-due');

      // 👉 PREFILL DATA (THIS IS WHAT YOU ASKED FOR)
      titleInput.value = data.title;
      descInput.value = data.description;
      priorityInput.value = data.priority;
      dueInput.value = data.due;

      // SAVE
      form.querySelector('[data-testid="test-todo-save-button"]').onclick = () => {
        onSave({
          title: titleInput.value,
          description: descInput.value,
          priority: priorityInput.value,
          due: dueInput.value
        });
      };

      // CANCEL
      form.querySelector('[data-testid="test-todo-cancel-button"]').onclick = () => {
        onCancel();
      };
    });
}
