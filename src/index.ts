import express, { type Application } from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import { connectDB } from "./db";
import { config } from "./config";
import routes from "./routes/index";

connectDB();

const app: Application = express();

app.use(
	cors({
		credentials: true,
		methods: ["GET", "POST", "PUT"],
		optionsSuccessStatus: 200,
	}),
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

app.use("/", routes);

app.listen(config.PORT, () => {
	console.log(`server running on http://localhost:${config.PORT}`);
});
