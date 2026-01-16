import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";
import path from "path";

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

// ✅ 1. IMAGE HELPER
const uploadOnCloudinary = async (filePath) => {
    try {
       if (!filePath) return null;
       const absolutePath = path.resolve(filePath);
       const uploadResult = await cloudinary.uploader.upload(absolutePath, {
           resource_type: 'auto',
       });
       
       try { fs.unlinkSync(absolutePath); } catch(e){} 
       return uploadResult.secure_url;
    } catch (error) {
        console.error("❌ Cloudinary Image Error:", error.message);
        try { fs.unlinkSync(filePath); } catch(e){}
        return null;
    }
};

// ✅ 2. PDF HELPER (FIXED for memory storage)
// In uploadFileToCloudinary function, modify the public_id:
// ✅ 2. PDF HELPER (FIXED for memory storage)
export const uploadFileToCloudinary = async (fileBuffer, originalName) => {
    try {
        if (!fileBuffer) return null;
        
        // Keep the original extension
        const safeName = originalName.replace(/\s+/g, '_');
        const extension = safeName.includes('.') ? safeName.substring(safeName.lastIndexOf('.')) : '';
        const nameWithoutExtension = safeName.replace(/\.[^/.]+$/, "");
        
        console.log(`🚀 Uploading PDF: ${safeName}`);

        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: "raw",
                    folder: "course_notes",
                    public_id: `${Date.now()}-${nameWithoutExtension}`,
                    use_filename: true,
                    unique_filename: false,
                    access_mode: "public",
                    timeout: 300000,
                    // Remove raw_convert parameter as it's not valid for raw files
                    type: 'upload'
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(fileBuffer);
        });

        console.log("✅ PDF Upload Success:", result.secure_url);
        
        // Return URL with .pdf parameter for forced download
        const pdfUrl = `${result.secure_url}?fl_attachment`;
        return pdfUrl;
        
    } catch (error) {
        console.error("❌ Cloudinary PDF Error:", error.message);
        console.error("❌ Full error details:", error);
        return null;
    }
};
// ✅ 3. VIDEO HELPER (UPDATED for memory storage)
// ✅ 3. VIDEO HELPER (UPDATED for memory storage)
export const uploadMediaWithAudio = async (fileBuffer, originalName) => {
    try {
        if (!fileBuffer) return null;
        const safeName = originalName.replace(/\s+/g, '_');

        console.log(`🚀 Uploading Video: ${safeName}`);

        // Convert buffer to base64 for Cloudinary upload
        const base64Data = fileBuffer.toString('base64');
        const dataUri = `data:video/mp4;base64,${base64Data}`;

        const result = await cloudinary.uploader.upload(dataUri, {
            resource_type: 'video',
            folder: "course_content",
            public_id: `${Date.now()}-${safeName.replace(/\.[^/.]+$/, "")}`,
            timeout: 600000,
            eager: [
                {
                    format: 'mp3',
                    audio_codec: 'mp3'
                }
            ],
            eager_async: false
        });

        console.log("✅ Video Upload Success:", result.secure_url);
        
        return {
            videoUrl: result.secure_url,
            audioUrl: result.eager?.[0]?.secure_url || null
        };
    } catch (error) {
        console.error("❌ Cloudinary Video Error:", error.message);
        console.error("❌ Error details:", error);
        return null;
    }
};

export default uploadOnCloudinary;