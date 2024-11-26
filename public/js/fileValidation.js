const uploadForm = document.getElementById('uploadForm');
        const fileInput = document.getElementById('fileInput');
        const fileError = document.getElementById('fileError');
    
        uploadForm.addEventListener('submit', (e) => {
            const file = fileInput.files[0];
            if (!file) {
                fileError.textContent = 'Please select a file.';
                e.preventDefault();
                return;
            }
    
            const allowedExtensions = /(\.xlsx)$/i;
            if (!allowedExtensions.exec(file.name)) {
                fileError.textContent = 'Invalid file type. Please upload an .xlsx file.';
                e.preventDefault();
            } else {
                fileError.textContent = '';
            }
        });