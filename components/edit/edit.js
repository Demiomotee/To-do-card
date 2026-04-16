export function mountEdit(data, onSave, onCancel) {
  // Remove any existing modal first
  document.querySelector('.modal-overlay')?.remove();

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-labelledby', 'modal-title');

  // Format datetime for input (local)
  function toDatetimeLocal(isoStr) {
    if (!isoStr) return '';
    const d = new Date(isoStr);
    const pad = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  const priorityVal = (data.priority || 'High').trim();
  const selClass = priorityVal === 'High' ? 'sel-high' : priorityVal === 'Medium' ? 'sel-medium' : 'sel-low';

  overlay.innerHTML = `
    <div class="modal-card">
      <div class="modal-header">
        <h2 id="modal-title">Edit Task</h2>
        <button class="modal-close" id="modal-close" aria-label="Close modal">✕</button>
      </div>

      <form data-testid="test-todo-edit-form" class="edit-form" novalidate>

        <div class="form-group">
          <label class="form-label" for="edit-title">Title</label>
          <input
            id="edit-title"
            data-testid="test-todo-edit-title-input"
            class="form-input"
            type="text"
            value="${escHtml(data.title || '')}"
            placeholder="Task title"
            required
          />
        </div>

        <div class="form-group">
          <label class="form-label" for="edit-desc">Description</label>
          <textarea
            id="edit-desc"
            data-testid="test-todo-edit-description-input"
            class="form-textarea"
            placeholder="What needs to be done?"
          >${escHtml(data.description || '')}</textarea>
        </div>

        <div class="form-row">
          <div class="form-group" style="margin-bottom:0">
            <label class="form-label" for="edit-priority">Priority</label>
            <div class="select-wrap">
              <select
                id="edit-priority"
                data-testid="test-todo-edit-priority-select"
                class="form-select ${selClass}"
              >
                <option value="High"   ${priorityVal==='High'   ? 'selected' : ''}>🔴 High</option>
                <option value="Medium" ${priorityVal==='Medium' ? 'selected' : ''}>🟡 Medium</option>
                <option value="Low"    ${priorityVal==='Low'    ? 'selected' : ''}>🟢 Low</option>
              </select>
            </div>
          </div>

          <div class="form-group" style="margin-bottom:0">
            <label class="form-label" for="edit-due">Due Date</label>
            <div class="datetime-wrap">
              <input
                id="edit-due"
                data-testid="test-todo-edit-due-date-input"
                class="form-datetime"
                type="datetime-local"
                value="${toDatetimeLocal(data.due)}"
              />
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button
            type="button"
            data-testid="test-todo-cancel-button"
            class="modal-btn modal-btn-cancel"
          >Cancel</button>
          <button
            type="button"
            data-testid="test-todo-save-button"
            class="modal-btn modal-btn-save"
          >Save changes</button>
        </div>

      </form>
    </div>
  `;

  document.body.appendChild(overlay);

  // Priority select colour update live
  const prioritySel = overlay.querySelector('#edit-priority');
  prioritySel.addEventListener('change', function () {
    this.className = 'form-select ' + (
      this.value === 'High' ? 'sel-high' :
      this.value === 'Medium' ? 'sel-medium' : 'sel-low'
    );
  });

  // Close helpers
  function close() {
    overlay.style.animation = 'fade-in 0.15s ease reverse both';
    overlay.querySelector('.modal-card').style.animation = 'slide-up 0.15s ease reverse both';
    setTimeout(() => { overlay.remove(); onCancel?.(); }, 150);
  }

  overlay.querySelector('#modal-close').addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', function escClose(e) {
    if (e.key === 'Escape') { close(); document.removeEventListener('keydown', escClose); }
  });

  // Save
  overlay.querySelector('[data-testid="test-todo-save-button"]').addEventListener('click', () => {
    const title = overlay.querySelector('#edit-title').value.trim();
    if (!title) {
      overlay.querySelector('#edit-title').focus();
      overlay.querySelector('#edit-title').style.borderColor = '#dc2626';
      return;
    }
    close();
    onSave({
      title,
      description: overlay.querySelector('#edit-desc').value.trim(),
      priority: overlay.querySelector('#edit-priority').value,
      due: overlay.querySelector('#edit-due').value
    });
  });

  // Focus trap — first input
  setTimeout(() => overlay.querySelector('#edit-title').focus(), 50);
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
