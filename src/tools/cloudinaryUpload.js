const CLOUD_NAME = "duxabhynb";
const UPLOAD_PRESET = "upload_react_submissions";

const VIDEO_EXTENSIONS = ['.avi', '.mp4'];

function getExtension(filename) {
    return filename.slice(filename.lastIndexOf('.')).toLowerCase();
}

function uploadFileToCloudinary(file, onProgress) {
    return new Promise((resolve, reject) => {
        const ext = getExtension(file.name);
        const resourceType = VIDEO_EXTENSIONS.includes(ext) ? 'video' : 'image';

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', UPLOAD_PRESET);
        formData.append('folder', 'submissionmedia');

        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable)
                onProgress(Math.round((e.loaded / e.total) * 100));
        });

        xhr.addEventListener('load', () => {
            const data = JSON.parse(xhr.responseText);
            if (data.error) return reject(new Error(data.error.message));
            resolve(data.secure_url);
        });

        xhr.addEventListener('error', () =>
            reject(new Error(`Upload failed: ${file.name}`))
        );

        xhr.open(
            'POST',
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`
        );
        xhr.send(formData);
    });
}

// Uploads files one by one, progress spans 0-100 across ALL files combined
export async function uploadAllFiles(files, onProgress) {
    const urls = [];
    for (let i = 0; i < files.length; i++) {
        const url = await uploadFileToCloudinary(files[i], (filePct) => {
            const overall = Math.round(((i + filePct / 100) / files.length) * 100);
            onProgress(overall);
        });
        if (url) urls.push(url); // only push if we got a real URL back
    }
    return urls;
}