function validatePasswords() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const errorSpan = document.getElementById('password-error');

    if (password !== confirmPassword) {
        errorSpan.textContent = 'Passwords do not match!';
        return false;
    }

    errorSpan.textContent = '';
    return true;
}