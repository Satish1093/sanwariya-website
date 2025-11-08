const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer'); 
const { v2: cloudinary } = require('cloudinary');

router.post('/upload', upload.single('dishImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const oldPublicId = req.body.oldPublicId;

    if (oldPublicId) {
      try {
        await cloudinary.uploader.destroy(oldPublicId);
        console.log('🗑️ Old image deleted:', oldPublicId);
      } catch (err) {
        console.warn('⚠️ Failed to delete old image:', err.message);
      }
    }

    const imageUrl = req.file.path;      
    const publicId = req.file.filename;  

    res.status(200).json({ imageUrl, publicId });
  } catch (err) {
    console.error('❌ Image upload failed:', err.message);
    res.status(500).json({ message: 'Image upload failed' });
  }
});

module.exports = router;