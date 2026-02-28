import mongoose from "mongoose";

interface IUser {
  userId: string;
  password: string;
}

const UserSchema = new mongoose.Schema<IUser>({
  userId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
