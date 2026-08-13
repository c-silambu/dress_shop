const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({ destination: 'uploads/', filename: (req,file,cb)=> cb(null, Date.now()+'-'+file.originalname.replace(/\s+/g,'-')) });
const fileFilter=(req,file,cb)=> /jpeg|jpg|png|webp/.test(path.extname(file.originalname).toLowerCase()) ? cb(null,true) : cb(new Error('Only images allowed'));
module.exports = multer({ storage, fileFilter });
