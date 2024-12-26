import type { User } from "../interfaces/user.model";
import { Schema, models, model } from "mongoose";

const userSchema = new Schema<User>(
	{
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		phone: { type: String, required: true },
		membershipType: { type: String, required: true },
	},
	{ timestamps: true },
);

const userModel = models.User || model<User>("User", userSchema);

export default userModel;
