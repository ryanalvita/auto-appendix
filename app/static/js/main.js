const fileInput = document.getElementById('fileInput');
const fileCount = document.getElementById('fileCount');
const uploadArea = document.getElementById('uploadArea');
const widthSlider = document.getElementById('imageWidth');
const widthValue = document.getElementById('widthValue');
const uploadForm = document.getElementById('uploadForm');
const submitBtn = document.getElementById('submitBtn');
const resetBtn = document.getElementById('resetBtn');
const themeToggle = document.getElementById('themeToggle');

// Theme toggle functionality
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    themeToggle.checked = theme === 'dark';
    localStorage.setItem('theme', theme);
}

// Initialize theme from localStorage or default to light mode
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        // Default to light mode
        setTheme('light');
    }
}

themeToggle.addEventListener('change', () => {
    const newTheme = themeToggle.checked ? 'dark' : 'light';
    setTheme(newTheme);
});

// Initialize theme on load
initTheme();

// File selection handler
fileInput.addEventListener('change', updateFileCount);

function updateFileCount() {
    const count = fileInput.files.length;
    if (count > 0) {
        fileCount.textContent = `✓ ${count} image${count > 1 ? 's' : ''} selected`;
        resetBtn.style.display = 'block';
    } else {
        fileCount.textContent = '';
        resetBtn.style.display = 'none';
    }
}

// Reset button handler
resetBtn.addEventListener('click', function() {
    fileInput.value = '';
    updateFileCount();
});

// Range slider handler
widthSlider.addEventListener('input', function() {
    widthValue.textContent = this.value + ' cm';
});

// Drag and drop handlers
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    fileInput.files = files;
    updateFileCount();
});

// Form submission handler with loading indicator
uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Show loading state
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span>Generating...';
    
    try {
        const formData = new FormData(uploadForm);
        
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            // Get the filename from Content-Disposition header
            const contentDisposition = response.headers.get('Content-Disposition');
            let filename = 'appendix.docx';
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename=(.+)/);
                if (filenameMatch) {
                    filename = filenameMatch[1].replace(/['"]/g, '');
                }
            }
            
            // Create blob and download
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            // Show success message
            submitBtn.innerHTML = '✓ Download Started!';
            submitBtn.style.backgroundColor = '#28a745';
            
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.backgroundColor = '';
                submitBtn.disabled = false;
            }, 3000);
        } else {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || 'Upload failed');
        }
    } catch (error) {
        console.error('Error:', error);
        submitBtn.innerHTML = '✗ Error - Try Again';
        submitBtn.style.backgroundColor = '#dc3545';
        
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.backgroundColor = '';
            submitBtn.disabled = false;
        }, 3000);
    }
});

// Toggle Advanced Settings
function toggleAdvancedSettings() {
    const advancedSettings = document.getElementById('advancedSettings');
    const toggleIcon = document.getElementById('advancedToggleIcon');
    
    advancedSettings.classList.toggle('expanded');
    toggleIcon.classList.toggle('rotated');
}
