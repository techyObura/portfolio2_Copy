import mongoose from "mongoose";

const connectDB = async () => {
  await mongoose
    .connect(process.env.db_uri)
    .then((conn) => {
      console.log(`MongoDB connected to ${conn.connection.host}`);
    })
    .catch((err) => {
      console.log(err.message);
    });
};

export default connectDB;
