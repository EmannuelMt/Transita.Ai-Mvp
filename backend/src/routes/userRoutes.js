const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const auth = require('../middlewares/auth');
const multer = require('multer');

// Limites e filtro para uploads de avatar
const upload = multer({
    limits: { fileSize: 3 * 1024 * 1024 }, // 3 MB
    fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowed.includes(file.mimetype)) {
            const err = new Error('Tipo de arquivo não permitido');
            err.code = 'LIMIT_FILE_TYPE';
            return cb(err);
        }
        cb(null, true);
    }
});

router.get('/me', auth, UserController.getProfile);
router.put('/me', auth, UserController.updateProfile);
router.post('/me/photo', auth, UserController.updatePhoto);
router.post('/me/photo-upload', auth, upload.single('avatar'), UserController.uploadPhotoFile);
router.post('/me/photo-upload-url', auth, UserController.generateUploadUrl);
router.post('/me/photo-upload-finalize', auth, UserController.finalizeUpload);
router.get('/me/usage', auth, UserController.getUsage);
router.get('/me/preferences', auth, UserController.getPreferences);
router.put('/me/preferences', auth, UserController.updatePreferences);

module.exports = router;