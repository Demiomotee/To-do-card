export function mountEdit(data, onSave, onCancel) {

  Promise.all([
    fetch('./components/edit/edit.html').then(r => r.text()),
    loadCSS('./components/edit/edit.css')
  ]).then(([html]) => {

    document.body.insertAdjacentHTML('beforeend', html);

    const modal    = document.getElementById('edit-modal');
    const titleEl  = document.getElementById('edit-title');
    const descEl   = document.getElementById('edit-desc');
    const priEl    = document.getElementById('edit-priority');
    const dueEl    = document.getElementById('edit-due');

    titleEl.value = data.title       || '';
    descEl.value  = data.description || '';
    priEl.value   = data.priority    || 'High';

    if (data.due) {
      dueEl.value = data.due.split('T')[0];
    }

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

    document.getElementById('btn-save').addEventListener('click', function() {
      const updated = {
        title:       titleEl.value.trim() || data.title,
        description: descEl.value.trim()  || data.description,
        priority:    priEl.value,
        due:         dueEl.value ? dueEl.value + 'T17:00:00Z' : data.due
      };
      modal.remove();
      document.getElementById('btn-edit').focus();
      onSave(updated);
    });

    document.addEventListener('keydown', function onKey(e) {
      if (e.key === 'Escape') {
        document.removeEventListener('keydown', onKey);
        close();
      }
    });

  });
}

function loadCSS(href) {
  return new Promise((resolve) => {
    if (document.querySelector('link[href="' + href + '"]')) {
      resolve();
      return;
    }
    const link = document.createElement('link');
    link.rel   = 'stylesheet';
    link.href  = href;
    link.onload = resolve;
    document.head.appendChild(link);
  });
}
