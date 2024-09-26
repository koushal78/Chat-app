import bcrypt from 'bcryptjs'
import User from "../Model/user.model.js";
import generatejsonwebtokensetcookie from '../utils/jwttoken.js';


export const Signup = async (req,resp)=>{
try {
    const {fullName,username,password,confirmPassword,gender} = req.body;

    if(password !== confirmPassword){
        return resp.status(400).json({error:'Password not match'})
    }
    const user = await User.findOne({username})
    if(user){
        return resp.status(400).json({error:"User already exist "})
    }

    //Haspassword

    const salt = await bcrypt.genSalt(10)
    const Haspassword = await bcrypt.hash(password,salt)

    // https://avatar.iran.liara.run/username?username=Scott+Wilson?/
    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`

    const newuser =  new User({
        fullName,username,password:Haspassword,
        gender,Profilepic : gender === "male" ?  boyProfilePic : girlProfilePic 
    })
    if(newuser){
      
         generatejsonwebtokensetcookie(newuser._id,resp)

        await newuser.save();
        
        resp.status(201).json({
            _id:newuser._id,
            fullName:newuser.fullName,
            username:newuser.username,
            Profilepic:newuser.Profilepic
        })
       
    }
    else{
        resp.status(400).json({error:"invalid user data"})
    }

} catch (error) {
    console.log("error in signup controller",error.message);
    resp.status(500).json({error:"Internal server error fghj"})
    
}
}

export const login = async (req, resp) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
  
      if (!user) {
        return resp.status(400).json({ error: 'Invalid user ID' }); // Early return if user is not found
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password || '');
  
      if (!isPasswordValid) {
        return resp.status(400).json({ error: 'Invalid credentials' }); // Early return if password is invalid
      }
  
      // Generate JWT and set cookie
      generatejsonwebtokensetcookie(user._id, resp);
  
      // Send user information as response
      resp.status(200).json({
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        profilePic: user.profilePic
      });
  
    } catch (error) {
      console.log('Error in login controller: ', error.message);
      resp.status(500).json({ error: 'Internal server error' });
    }
  };
export const logout = (req,resp)=>{
try {
    resp.cookie("Jwt","",{maxAge:0})
    resp.status(200).json({massage:"user logout"})
    
} catch (error) {
    console.log("error in login controller",error.message);
    resp.status(500).json({error:"Internal server error fghj"})
}
}