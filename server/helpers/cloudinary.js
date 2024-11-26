const cloudinary = require('cloudinary').v2

//configure with env data
cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
})

const uploadMediaToCloudinary = async(filePath)=> {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: 'auto'
        });
        
        return result;
    } catch (error) {
        console.log(error);
        throw new Error('Error uploading to cloudinary')
    }
};

const deleteMediaFromCloudinary = async(publicId)=> {
    const resourceTypes = ['image', 'video', 'raw']; // Các loại tài nguyên cần thử
    let deleted = false;

    for (const resourceType of resourceTypes) {
        try {
            const result = await cloudinary.uploader.destroy(publicId, {
                resource_type: resourceType,
                invalidate: true,
            });

            if (result.result === 'ok') {
                console.log(`Asset deleted successfully as ${resourceType}`);
                deleted = true;
                break;
            }
        } catch (error) {
            console.log(error);
            throw new Error('Failed to detete asset from cloudinary')
        }
    }
};

module.exports = {uploadMediaToCloudinary, deleteMediaFromCloudinary}