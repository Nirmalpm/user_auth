import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    console.log("Mongo URI:", process.env.MONGO_URI);
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Mongo DB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("Error connecting to Mongo DB ", error.message);
    process.exit(1); //(1) is failure, o is success
  }
};
