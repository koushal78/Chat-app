import User from "../Model/user.model.js"

export const getuserForsideBar = async(req,res)=>{
    try {
        const loggedInUser = req.user._id
        const fillteruser = await User.find({_id:{$ne:loggedInUser}}).select("-password")

        res.status(200).json(fillteruser)
    } catch (error) {
        console.error("error in getuserForslideBar",error.message)
        res.status(500).json({error:'internal server error '})
        
    }
}