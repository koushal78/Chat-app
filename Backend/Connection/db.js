import mongoose from "mongoose";

const connectdb = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_DB_URL);
        console.log("connected with mongoose")
        
    } catch (error) {
        console.log("problem with connection to mongoose ",error.message)
        
    }
}
export default connectdb;