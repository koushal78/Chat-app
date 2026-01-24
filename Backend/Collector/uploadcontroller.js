
import multer from "multer";

import { v2 as cloudinary  } from "cloudinary";

const storage = multer.memoryStorage();

export const upload  = multer({
    storage,
    limits:{
        fileSize:10*1024*1024
    }

})



export const handleUpload = async(req,res)=>{
    try {
        if(!req.file){
            return res.status(400).json({error:"NO file upload"})
        }
          const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

          const uploadResponse = await cloudinary.uploader.upload(fileStr,{
            folder:"chat-app",
            resource_type:"auto",
          })
        
          res.json({
             url: uploadResponse.secure_url,
             public_id: uploadResponse.public_id,
             type: req.file.mimetype, 
             name: req.file.originalname, 
             size:uploadResponse.bytes / (1024*1024)
          })
        
    } catch (error) {
       console.error("Cloudinary upload error:", error);
  res.status(500).json({
    error: "Upload failed",
    details: error.message,
  });
        
    }

}


