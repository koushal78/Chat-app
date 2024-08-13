import  Jwt  from "jsonwebtoken";


const generatejsonwebtokensetcookie =(userId,resp)=>{
const token = Jwt.sign({userId},process.env.JWT_SECRET,{
    expiresIn:"15d",
})
resp.cookie("Jwt",token,{
maxAge: 15*24*60*60*1000,
httpOnly:true,
sameSite:"strict",
secure:process.env.NODE_ENV !== "development",

})
}
export default generatejsonwebtokensetcookie; 