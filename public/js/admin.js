(function () {
  const API_BASE = '/api/feedbacks';

  const tbody = document.getElementById('feedbacksTableBody');
  const loadingSkeleton = document.getElementById('loadingSkeleton');
  const emptyState = document.getElementById('emptyState');
  const errorState = document.getElementById('errorState');
  const errorStateMessage = document.getElementById('errorStateMessage');
  const retryBtn = document.getElementById('retryBtn');
  const totalCount = document.getElementById('totalCount');
  const newCount = document.getElementById('newCount');
  const inReviewCount = document.getElementById('inReviewCount');
  const resolvedCount = document.getElementById('resolvedCount');
  const confirmModalEl = document.getElementById('confirmModal');
  const confirmMessage = document.getElementById('confirmMessage');
  const confirmBtn = document.getElementById('confirmBtn');
  const successToast = new bootstrap.Toast(document.getElementById('successToast'));
  const errorToast = new bootstrap.Toast(document.getElementById('errorToast'));
  const successToastMessage = document.getElementById('successToastMessage');
  const errorToastMessage = document.getElementById('errorToastMessage');

  const confirmModal = new bootstrap.Modal(confirmModalEl);
  let pendingChange = null;

  const statusLabels = {
    NEW: { label: 'New', class: 'bg-secondary' },
    IN_REVIEW: { label: 'In Review', class: 'bg-warning text-dark' },
    RESOLVED: { label: 'Resolved', class: 'bg-success' },
  };

  function showLoading() {
    tbody.innerHTML = '';
    loadingSkeleton.classList.remove('d-none');
    emptyState.classList.add('d-none');
    errorState.classList.add('d-none');
    totalCount.textContent = '-';
    newCount.textContent = '-';
    inReviewCount.textContent = '-';
    resolvedCount.textContent = '-';
  }

  function showError(msg) {
    loadingSkeleton.classList.add('d-none');
    emptyState.classList.add('d-none');
    errorState.classList.remove('d-none');
    errorStateMessage.textContent = msg;
  }

  function showEmpty() {
    loadingSkeleton.classList.add('d-none');
    emptyState.classList.remove('d-none');
    errorState.classList.add('d-none');
    tbody.innerHTML = '';
    totalCount.textContent = '0';
    newCount.textContent = '0';
    inReviewCount.textContent = '0';
    resolvedCount.textContent = '0';
  }

  async function loadFeedbacks() {
    showLoading();
    try {
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error('Failed to fetch feedbacks');
      const json = await res.json();
      renderFeedbacks(json.data);
    } catch (err) {
      showError(err.message);
    }
  }

  function renderFeedbacks(feedbacks) {
    loadingSkeleton.classList.add('d-none');

    if (!feedbacks || feedbacks.length === 0) {
      showEmpty();
      return;
    }

    emptyState.classList.add('d-none');
    errorState.classList.add('d-none');

    let total = 0, newFb = 0, inReview = 0, resolved = 0;

    const rows = feedbacks.map(fb => {
      total++;
      if (fb.status === 'NEW') newFb++;
      else if (fb.status === 'IN_REVIEW') inReview++;
      else if (fb.status === 'RESOLVED') resolved++;

      const status = statusLabels[fb.status] || statusLabels.NEW;
      const date = new Date(fb.createdAt).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit',
      });

      const statusOptions = Object.entries(statusLabels)
        .map(([key, val]) =>
          `<option value="${key}" ${key === fb.status ? 'selected' : ''}>${val.label}</option>`
        )
        .join('');

      return `<tr>
        <td><strong>${escapeHtml(fb.title)}</strong></td>
        <td style="max-width:300px">${escapeHtml(fb.message)}</td>
        <td><span class="badge ${status.class}">${status.label}</span></td>
        <td class="text-secondary">${date}</td>
        <td>
          <select class="form-select form-select-sm status-select" data-id="${fb._id}" data-original="${fb.status}" style="width:140px">
            ${statusOptions}
          </select>
        </td>
      </tr>`;
    }).join('');

    tbody.innerHTML = rows;
    updateCards(total, newFb, inReview, resolved);

    document.querySelectorAll('.status-select').forEach(sel => {
      sel.addEventListener('change', handleStatusChange);
    });
  }

  function handleStatusChange(e) {
    const sel = e.target;
    pendingChange = {
      id: sel.dataset.id,
      element: sel,
      newStatus: sel.value,
      oldStatus: sel.dataset.original,
    };

    confirmMessage.textContent = `Change status from "${statusLabels[sel.dataset.original].label}" to "${statusLabels[sel.value].label}"?`;
    confirmModal.show();
  }

  function confirmStatusChange() {
    if (!pendingChange) return;

    const { id, element, newStatus, oldStatus } = pendingChange;
    pendingChange = null;

    element.disabled = true;

    fetch(`${API_BASE}/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Update failed');
        return res.json();
      })
      .then(() => {
        successToastMessage.textContent = 'Status updated successfully.';
        successToast.show();
        loadFeedbacks();
      })
      .catch(err => {
        element.value = oldStatus;
        errorToastMessage.textContent = 'Failed to update status. Please try again.';
        errorToast.show();
        loadFeedbacks();
      });
  }

  function cancelStatusChange() {
    if (pendingChange) {
      pendingChange.element.value = pendingChange.oldStatus;
      pendingChange = null;
    }
  }

  function updateCards(total, newFb, inReview, resolved) {
    totalCount.textContent = total;
    newCount.textContent = newFb;
    inReviewCount.textContent = inReview;
    resolvedCount.textContent = resolved;
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  confirmModalEl.addEventListener('hidden.bs.modal', cancelStatusChange);
  confirmBtn.addEventListener('click', function () {
    confirmModal.hide();
    confirmStatusChange();
  });
  retryBtn.addEventListener('click', loadFeedbacks);

  loadFeedbacks();
})();
