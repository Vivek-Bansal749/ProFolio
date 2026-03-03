import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: process.cwd().endsWith('backend') ? '../.env' : '.env' });

// Check if Cloudinary credentials are configured
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
    console.warn('Cloudinary credentials not found in .env file!');
    console.warn('Please add: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET');
} else {
    console.log('Cloudinary credentials configured');
}

// Configure Cloudinary
cloudinary.config({
    cloud_name: cloudName || 'demo',
    api_key: apiKey || '',
    api_secret: apiSecret || '',
});

// Create Cloudinary storage for profile pictures
const profilePictureStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'linkedin-clone/profile-pictures',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        transformation: [{ width: 500, height: 500, crop: 'limit' }],
    },
});

// Create Cloudinary storage for post media
const postMediaStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'linkedin-clone/posts',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'mov'],
        resource_type: 'auto',
    },
});

// Create multer instances with Cloudinary storage
export const uploadProfilePicture = multer({ 
    storage: profilePictureStorage 
});

export const uploadPostMedia = multer({ 
    storage: postMediaStorage 
});

export default cloudinary;

