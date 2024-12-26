import type { Request, Response } from "express";
import type { User, UserDTO } from "../interfaces/user.model";
import UserModel from "../models/user.model";
const { GoogleSpreadsheet } = require("google-spreadsheet");
import { JWT } from "google-auth-library";
import { config } from "../config";
import EmailController from "./emails.controller";

const serviceAccountAuth = new JWT({
	email: config.client_email,
	key: config.private_key,
	scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

class UserController {
	async getUserList(_req: Request, res: Response) {
		const users = await UserModel.find({});

		if (!users || users.length === 0)
			return res.status(404).json({ error: "No users found" });

		return res.status(200).json(users);
	}

	async getUser(req: Request, res: Response) {
		const userId = req.params.id;

		try {
			const user = await UserModel.findById(userId);

			if (!user) {
				return res.status(404).json({ error: "User not found" });
			}

			return res.status(200).json(user);
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: "Internal Server Error" });
		}
	}

	async create(req: Request, res: Response) {
		const { firstName, lastName, membershipType, email, phone }: UserDTO =
			req.body;

		const existUser = await this.get(email);

		if (existUser) return res.status(200).json(existUser);

		const user = new UserModel({
			firstName,
			lastName,
			membershipType,
			email,
			phone,
		});

		const userSaved = await user.save();

		const doc = new GoogleSpreadsheet(config.SHEET_ID, serviceAccountAuth);

		await doc.loadInfo();

		const sheet = doc.sheetsByIndex[0];

		await sheet.addRow({
			"First Name": firstName,
			"Last Name": lastName,
			"Membership Type": membershipType,
			Email: email,
			"Phone Number": phone,
			"Created At": new Date(`${userSaved.createdAt}`).toUTCString(),
		});

		const { error } = await EmailController.sendEmail({email})

		if (error) {
			console.log("Error to send email after create user",error);
		}

		return res.status(201).json(userSaved);
	}

	private async get(email: string): Promise<User | null> {
		return await UserModel.findOne({ email });
	}

	async sinchronize(_req: Request, res: Response) {
		const doc = new GoogleSpreadsheet(config.SHEET_ID, serviceAccountAuth);

		await doc.loadInfo();

		const sheet = doc.sheetsByIndex[0];

		const rows = await sheet.getRows();

		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const usersInSheet = rows.map((row: any) => {
			return {
				firstName: row.get("First Name"),
				lastName: row.get("Last Name"),
				membershipType: row.get("Membership Type"),
				email: row.get("Email"),
				phone: row.get("Phone Number"),
			};
		});

		const users = await UserModel.find({});

		const usersFiltered = users.filter(
			(user) =>
				!usersInSheet.some(
					// biome-ignore lint/suspicious/noExplicitAny: <explanation>
					(userInSheet: any) => userInSheet.email === user.email,
				),
		);

		if (usersFiltered.length === 0) {
			return res
				.status(200)
				.json({ message: "Area contacts form is up to date" });
		}

		for await (const user of usersFiltered) {
			await sheet.addRow({
				"First Name": user.firstName,
				"Last Name": user.lastName,
				"Membership Type": user.membershipType,
				Email: user.email,
				"Phone Number": user.phone,
			});
		}

		return res
			.status(200)
			.json({ message: `${usersFiltered.length} new users added` });
	}
}

export default new UserController();
