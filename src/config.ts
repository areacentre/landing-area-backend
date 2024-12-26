import dotenv from "dotenv";
dotenv.config();

export const config = {
	DATA_BASE_URL: process.env.DATA_BASE_URL,
	PORT: process.env.PORT || 3001,
	type: process.env.type,
	project_id: process.env.project_id,
	private_key_id: process.env.private_key_id,
	private_key: process.env.private_key,
	client_email: process.env.client_email,
	client_id: process.env.client_id,
	auth_uri: process.env.auth_uri,
	token_uri: process.env.token_uri,
	auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
	client_x509_cert_url: process.env.client_x509_cert_url,
	universe_domain: process.env.universe_domain,
	SHEET_ID: process.env.SHEET_ID,
	resend_api: process.env.resend_api,
	own_email: process.env.own_email,
	google_sheet_url: process.env.google_sheet_url
};
