import mongoose from "mongoose";
  

const connectDB=async()=>{
    try{
        mongoose.connection.on("connected",async()=>{
            console.log("MongoDB connected");
        });
        await mongoose.connect(process.env.MONGO_URL!);

    }catch(error:any){
        console.error(error);
        mongoose.exit(1);

    }
}

export default connectDB;