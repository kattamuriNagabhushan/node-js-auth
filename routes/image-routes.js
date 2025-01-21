const express = require('express')

const authMiddleware = require("../middleware/auth-middleware")
const adminMiddleware = require("../middleware/admin-middleware")
const {uploadImageController, fetchImagesController, deleteImageController} = require('../controllers/image-controller')
const uploadMiddleware = require("../middleware/upload-middleware")

const router = express.Router()

//upload the image

router.post('/upload' ,authMiddleware , 
    adminMiddleware , uploadMiddleware.single('image') ,
    uploadImageController  )

router.get('/get' ,authMiddleware , fetchImagesController)
//get all images

//delete image route
//678bfcee0e757510d9398b69
router.delete('/:id' , authMiddleware , adminMiddleware , deleteImageController)

module.exports = router;