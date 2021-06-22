import express from "express";
import crypto from "crypto";
import fileUpload, { UploadedFile } from "express-fileupload";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config()


//Express related stuff
const PORT = parseInt(process.env.PORT || "3000");
const HOSTNAME = process.env.HOSTNAME || "127.0.0.1";
const UPLOAD_KEY = process.env.UPLOAD_KEY || "test_pass";

//Key related stuff
const NAME_LENGTH = parseInt(process.env.NAME_LENGTH || "32")/2;

//Embed related stuff
const EMBED_TITLE = process.env.EMBED_TITLE || "Embed Title Not Set";
const EMBED_DESC = process.env.EMBED_DESC || "Embed Desc Not Set";

const makeImgDir = async () => {
	if(!fs.existsSync("images"))
		await fs.promises.mkdir("images")
}

(async () => {
	const app = express();
	app.use(fileUpload())
	
	await makeImgDir()

	app.post("/upload", async(req, res) => {
		if(req.body.key !== UPLOAD_KEY)
			return res.status(403).json({
				code: 403,
				message: "Unauthorized"
			})
		if(req.files == null)
			return res.status(400).json({
				code: 400,
				message: "No files uploaded"
			})
		if(req.files["file"] == null)
			return res.status(400).json({
				code: 400,
				message: "File must be uploaded with field `file`"
			})
		
		await makeImgDir()

		const file = req.files["file"] as UploadedFile

		const iv = crypto.randomBytes(8).toString("hex"); //Random 16 character iv
		const key = crypto.randomBytes(16).toString('hex'); //Random 32 byte string

		const name = crypto.randomBytes(NAME_LENGTH).toString('hex'); //Random 32 character name
		var cipher = crypto.createCipheriv("aes-256-ctr", key, iv);  
		const encrypted = cipher.update(file.data);

		await fs.promises.writeFile(`images/${name}`, Buffer.concat([encrypted, cipher.final()]))

		return res.status(200).json({
			code: 200,
			name: name,
			key: `${key}:${iv}`
		})
	})

	app.get("/image/:name/:key", async (req, res) => {
		const data = await fs.promises.readFile(`images/${req.params.name}`)
		const separatedKey = req.params.key.split(":")
		const key = separatedKey[0]
		const iv = separatedKey[1]

		const decipher = crypto.createDecipheriv("aes-256-ctr", key, iv);
		var decrypt = Buffer.concat([decipher.update(data), decipher.final()])
		res.setHeader("content-type", "image/jpeg")
		res.status(200).send(decrypt)
	})
	
	app.get("/embed/:name/:key", async (req, res) => {
		return res.status(200).send(
			`
			<!DOCTYPE html>
			<html>
				<head>
					<meta property="og:image" content="/image/${req.params.name}/${req.params.key}"/>
					<meta property="og:description" content="${EMBED_DESC}"/>
					<meta property="og:title" content="${EMBED_TITLE}"/>
				</head>
				<body>
					<img src="/image/${req.params.name}/${req.params.key}" />
				</body>
			</html>
			`
		)
	})

	app.listen(PORT, HOSTNAME)
})()
