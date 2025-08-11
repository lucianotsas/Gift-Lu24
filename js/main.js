document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const selectFileButton = document.getElementById('selectFile');
    const preview = document.getElementById('preview');
    const gifPreview = document.getElementById('gifPreview');
    const optimizeButton = document.getElementById('optimizeGif');
    const convertMp4Button = document.getElementById('convertMp4');
    const getHtmlButton = document.getElementById('getHtml');

    // Evento para seleccionar archivo con el botón
    selectFileButton.addEventListener('click', () => {
        fileInput.click();
    });

    // Eventos para arrastrar y soltar
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        const files = e.dataTransfer.files;
        handleFiles(files);
    });

    // Evento para cuando se selecciona un archivo con el input
    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    // Función para manejar los archivos
    function handleFiles(files) {
        const file = files[0];
        if (file && file.type === 'image/gif') {
            const reader = new FileReader();
            reader.onload = (e) => {
                gifPreview.src = e.target.result;
                preview.classList.remove('hidden');
            };
            reader.readAsDataURL(file);
        } else {
            alert('Por favor, selecciona un archivo GIF válido.');
        }
    }

    // Eventos para los botones de conversión
    optimizeButton.addEventListener('click', optimizeGif);
    convertMp4Button.addEventListener('click', convertToMp4);
    getHtmlButton.addEventListener('click', getHtmlCode);
});

// Función para optimizar el GIF
function optimizeGif() {
    // TODO: Implementar la optimización del GIF
    console.log('Optimizing GIF...');
}

// Función para convertir a MP4
function convertToMp4() {
    // TODO: Implementar la conversión a MP4
    console.log('Converting to MP4...');
}

// Función para obtener el código HTML
function getHtmlCode() {
    // TODO: Implementar la generación de código HTML
    console.log('Generating HTML code...');
}