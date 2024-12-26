import type { Types } from "mongoose";

export interface User {
	_id: Types.ObjectId;
	firstName: string;
  lastName: string;
	email: string;
	phone: string;
	membershipType: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface UserDTO extends Omit<User, "_id"> {}
