import Jwt from "jsonwebtoken"
import User from "../Model/user.model.js";

const protectRoute = async(req,resp,next)=>{
    try {
        const token =  req.cookies.Jwt;
        if(!token){
           return resp.status(401).json({error:"unauthorised -No token Provided"});

        }

        const decode = Jwt.verify(token,process.env.JWT_SECRET);
        if(!decode){
           return resp.status(401).json({error:"unauthorised -invalid token"});

        }
        const user = await User.findById(decode.userId).select("-password")

        
        if(!user){
          return  resp.status(404).json({error:"user not found"})
        }
        req.user = user;
        next();
        
    } catch (error) {
        console.log("error in protectRoute: ", error.message)
        resp.status(500).json({error:"invalid internal server "})
    }

}
export  default protectRoute;