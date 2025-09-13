import mongoose from "mongoose";

const connectToDB = async () => {
  try {
    if (mongoose.connections[0].readyState) {
      return true;
    }

    await mongoose.connect(process.env.MONGO_DB_URL as string);
  } catch {
    return null;
  }
};

export default connectToDB;
