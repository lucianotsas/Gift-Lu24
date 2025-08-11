document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const selectFileButton = document.getElementById('selectFile');
    const preview = document.getElementById('preview');
    const gifPreview = document.getElementById('gifPreview');
    const optimizeButton = document.getElementById('optimizeGif');
    const convertMp4Button = document.getElementById('convertMp4');
    const getHtmlButton = document.getElementById('getHtml');

    let currentFile = null;

    selectFileButton.addEventListener('click', () => {
        fileInput.click();
    });

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
        handleFiles(e.dataTransfer.files);
    });

    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    function handleFiles(files) {
        const file = files[0];
        if (file && file.type === 'image/gif') {
            currentFile = file;
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

    optimizeButton.addEventListener('click', () => optimizeGif(currentFile));
    convertMp4Button.addEventListener('click', () => convertToMp4(currentFile));
    getHtmlButton.addEventListener('click', () => getHtmlCode(currentFile));
});

async function optimizeGif(file) {
    if (!file) {
        alert('Por favor, selecciona un GIF primero.');
        return;
    }

    try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        const img = new Image();
        img.src = URL.createObjectURL(file);
        
        await new Promise((resolve, reject) => {
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                
                canvas.toBlob((blob) => {
                    const optimizedFile = new File([blob], 'optimized-' + file.name, {
                        type: 'image/gif'
                    });
                    
                    const downloadLink = document.createElement('a');
                    downloadLink.href = URL.createObjectURL(optimizedFile);
                    downloadLink.download = optimizedFile.name;
                    downloadLink.click();
                    
                    resolve();
                }, 'image/gif', 0.7);
            };
            img.onerror = reject;
        });
    } catch (error) {
        console.error('Error al optimizar el GIF:', error);
        alert('Hubo un error al optimizar el GIF.');
    }
}

async function convertToMp4(file) {
    if (!file) {
        alert('Por favor, selecciona un GIF primero.');
        return;
    }

    try {
        const video = document.createElement('video');
        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        
        const stream = video.captureStream();
        const mediaRecorder = new MediaRecorder(stream, {
            mimeType: 'video/webm',
            videoBitsPerSecond: 5000000
        });
        
        const chunks = [];
        mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
        mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'video/mp4' });
            const url = URL.createObjectURL(blob);
            
            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.download = file.name.replace('.gif', '.mp4');
            downloadLink.click();
        };
        
        video.src = URL.createObjectURL(file);
        video.oncanplay = () => {
            mediaRecorder.start();
            setTimeout(() => {
                mediaRecorder.stop();
                video.remove();
            }, 3000);
        };
    } catch (error) {
        console.error('Error al convertir a MP4:', error);
        alert('Hubo un error al convertir el GIF a MP4.');
    }
}

function getHtmlCode(file) {
    if (!file) {
        alert('Por favor, selecciona un GIF primero.');
        return;
    }

    const objectURL = URL.createObjectURL(file);
    
    const htmlCode = `<!-- Código generado por Gift-Lu24 -->
<figure class="gif-container">
    <img src="${file.name}" alt="GIF animado" width="100%" height="auto">
    <figcaption>
        <p>Nombre del archivo: ${file.name}</p>
        <p>Tamaño: ${(file.size / 1024).toFixed(2)} KB</p>
    </figcaption>
</figure>

<style>
.gif-container {
    max-width: 100%;
    margin: 1em 0;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: #fff;
}

.gif-container img {
    display: block;
    max-width: 100%;
    height: auto;
}

.gif-container figcaption {
    margin-top: 8px;
    font-size: 0.9em;
    color: #666;
}
</style>`;

    const blob = new Blob([htmlCode], { type: 'text/html' });
    
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = file.name.replace('.gif', '_code.html');
    downloadLink.click();
    
    URL.revokeObjectURL(objectURL);
}