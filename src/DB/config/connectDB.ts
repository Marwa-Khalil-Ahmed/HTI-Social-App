import mongoose from "mongoose";

export const DBConnection = async () => {
  return await mongoose
    .connect(process.env.LOCAL_DATA_BASE_URL as string)
    .then(() => {
      console.log("Database connected successfully");
    })
    .catch((err) => {
      console.log("DB Error => ", err);
    });
};
