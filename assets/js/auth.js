document.querySelectorAll('[data-auth-provider]').forEach(button => {
  button.addEventListener('click', () => {
    const result = document.querySelector('.auth-provider-result');
    result.textContent = button.dataset.authProvider + ' sign-in is not connected yet. Please use the email form to explore the demo.';
    result.hidden = false;
  });
});
