(function () {
  const form = document.getElementById('feedbackForm');
  const title = document.getElementById('title');
  const message = document.getElementById('message');
  const submitBtn = document.getElementById('submitBtn');
  const submitText = document.getElementById('submitText');
  const submitSpinner = document.getElementById('submitSpinner');
  const successAlert = document.getElementById('successAlert');
  const errorAlert = document.getElementById('errorAlert');
  const errorAlertMessage = document.getElementById('errorAlertMessage');

  const bsSuccessAlert = new bootstrap.Alert(successAlert);
  const bsErrorAlert = new bootstrap.Alert(errorAlert);

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    e.stopPropagation();

    errorAlert.classList.add('d-none');

    form.classList.add('was-validated');

    if (!form.checkValidity()) return;

    submitBtn.disabled = true;
    submitText.classList.add('d-none');
    submitSpinner.classList.remove('d-none');

    try {
      const res = await fetch('/api/feedbacks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.value.trim(),
          message: message.value.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const errMsg =
          data.message && Array.isArray(data.message)
            ? data.message.join(', ')
            : data.message || 'Submission failed';
        throw new Error(errMsg);
      }

      successAlert.classList.remove('d-none');
      successAlert.classList.add('show');
      form.reset();
      form.classList.remove('was-validated');
      successAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (err) {
      errorAlertMessage.textContent = err.message;
      errorAlert.classList.remove('d-none');
      errorAlert.classList.add('show');
      errorAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } finally {
      submitBtn.disabled = false;
      submitText.classList.remove('d-none');
      submitSpinner.classList.add('d-none');
    }
  });
})();
