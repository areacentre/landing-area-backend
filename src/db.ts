import mongoose, { type Connection } from "mongoose";
import { config } from "./config";

let cachedConnection: Connection | null = null;

export async function connectDB() {
	console.log("Connecting to database...");
	if (cachedConnection) {
		return cachedConnection;
	}

	try {
		const mongo = await mongoose.connect(config.DATA_BASE_URL as string);
		cachedConnection = mongo.connection;

		console.log("Connected to database");

		return cachedConnection;
	} catch (error) {
		console.error(error);
	}
}
