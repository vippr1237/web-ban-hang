const router = require('express').Router()
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')
const fs = require('fs')

// Upload image only admin can use
router.post('/upload',auth , authAdmin, (req, res) =>{
    try {
        if(!req.files || Object.keys(req.files).length === 0)
            return res.status(400).json({msg: 'No files were uploaded.'})
        
        const file = req.files.file;
        if(file.size > 1024*1024) {
            removeTmp(file.tempFilePath)
            return res.status(400).json({msg: "Size too large"})
        }

        if(file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png'){
            removeTmp(file.tempFilePath)
            return res.status(400).json({msg: "File format is incorrect."})
        }


        fs.copyFile( file.tempFilePath ,`./client/public/file_storage/${file.name}`, function(err){
        if (err) throw err
        removeTmp(file.tempFilePath)
        res.json({path: `file_storage/${file.name}`})
        })
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
})

// Delete image only admin can use
router.post('/destroy',auth , authAdmin, (req, res) =>{
    try {
        const {path} = req.body;
        if(!path) return res.status(400).json({msg: 'Hãy chọn hình ảnh'})

        fs.unlink(`./client/public/${path}`, function(err){
            if (err) {
                console.log(err);
            }
        })

        res.json({msg: "Đã xóa hình ảnh"})


    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
    
})


const removeTmp = (path) =>{
    fs.unlink(path, err=>{
        if(err) throw err;
    })
}

module.exports = router