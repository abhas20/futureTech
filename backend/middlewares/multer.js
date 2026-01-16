import multer from "multer";

// ✅ Memory Storage for Cloudinary uploads
const storage = multer.memoryStorage();

const upload = multer({ 
    storage,
    limits: {
        fileSize: 500 * 1024 * 1024, // 500MB limit
        files: 10 // Max 10 files
    },
    fileFilter: (req, file, cb) => {
        // Accept video, PDF, and image files
        const allowedMimes = [
            'video/mp4', 'video/mov', 'video/avi', 'video/webm',
            'application/pdf',
            'image/jpeg', 'image/png', 'image/gif'
        ];
        
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`Unsupported file type: ${file.mimetype}`), false);
        }
    }
});

export default upload;