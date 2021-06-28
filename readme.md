# 🔒 Encrypted ShareX
Encrypted ShareX is a self-hosted node.js express-based file uploader designed for ShareX (A screenshot and file upload tool).
It utilises AES-256 encryption to encrypt files, and returns a randomised image name, and key to decrypt the image with. (Similar to https://mega.nz).

I am NOT a security expert, this is my first encryption project so probably isn't perfect, I welcome pull requests to improve security, but would like to avoid feature creep, or increase difficulty of use.

DISCLAIMER: I am not responsible if there are issues with this project.
This project will not be secure if it's used on hosting that other people can access. And is only as secure as the server it's installed on.

## 💻 Setup
This project is made in TypeScript using node.js 14.7 LTS, but may work with older versions. 

### Environment Variables
This project is configured with environment variables, and supports .env files.

| Variable Name | Value     | Default   | Purpose                                                      |
|---------------|-----------|-----------|--------------------------------------------------------------|
| PORT          | 0-65535   | 3000      | Specifies the port to listen on                              |
| HOSTNAME      | string    | 127.0.0.1 | The hostname to listen on. E.g. 127.0.0.1                    |
| UPLOAD_KEY    | string    | test_pass | The key that authenticates sharex to upload                  |
| NAME_LENGTH   | int       | 32        | The length of the random name for the image uploaded         |
| EMBED_TITLE   | string    | None      | Sets the optional embed title (Used for things like discord) |
| EMBED_DESC    | string    | None      | Sets the optional embed description                          |
| EMBED_COLOR   | Hex color | #FF0000   | Sets the optional embed color                                |

### Running

You can run with either NPM or Yarn (Yarn is preferable)

NPM:
```cmd
npm i
npm start
```
Or with Yarn:
```cmd
yarn
yarn start
```