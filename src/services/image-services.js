require('dotenv').config();
const ImageKit = require("imagekit");

const imageKit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

const getImageUrl = async (content) => {
    try {
        const result = await imageKit.listFiles({
            searchQuery: `name:"${content}"`,
            limit: 1
        });
        return result.length > 0 ? result[0].url : null;
    } catch (error) {
        console.error('Error fetching image:', error);
        return null;
    }
};

const getImageUrls = async (content) => {
    try {
        const result = await imageKit.listFiles({
            searchQuery: `name:"${content}"`
        });
        return result.map(file => file.url); // Trả về mảng các URL
    } catch (error) {
        console.error('Error fetching images:', error);
        return [];
    }
};

const uploadImage = async (base64Image, content) => {
    const fileName = `${content}${Date.now()}`; // Tạo tên file dựa trên M_Id và CS_Id

    try {
        const result = await imageKit.upload({
            file: base64Image, // base64 encoded image
            fileName: fileName
        });
        return result.url; // Trả về URL của ảnh
    } catch (error) {
        console.error('Error uploading image:', error);
        return null;
    }
};

const deleteImage = async (imageNameOrUrl) => {
    // Giả định imageNameOrUrl là URL, cắt lấy phần tên file
    const fileName = imageNameOrUrl.split("/").pop();

    try {
        const files = await imageKit.listFiles({
            searchQuery: `name:"${fileName}"`
        });

        if (files.length > 0) {
            const result = await imageKit.deleteFile(files[0].fileId);
            return result;
        }
        return null;
    } catch (error) {
        console.error('Error deleting image:', error);
        return null;
    }
};

module.exports = {
    getImageUrl,
    getImageUrls,
    uploadImage,
    deleteImage,
};
