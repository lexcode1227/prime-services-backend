import express from "express";
import { Resend } from "resend";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import {fileURLToPath} from 'url';
const app = express()
const port = 3000
const api_key = "re_JyKsFqsh_Ah84MQx8NfwyJyHEj9dQ8XPR"

const resend = new Resend(api_key);

app.get("/api/welcomeEmail", async (req, res) => {
  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: ["henryagustin297@gmail.com"],
    subject: "hello world",
    html: "<strong>Funciona!</strong>",
  });

  if (error) {
    return res.status(400).json({ error });
  }

  res.status(200).json({ data });
});

app.get("/api/newClientForm", async (req, res) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const filePath = join(__dirname, 'templates', `new-prospect.html`);
  const htmlContent = readFileSync(filePath, 'utf8');
  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: ["henryagustin297@gmail.com"],
    subject: "Welcome, we're happy you're here.",
    html: htmlContent,
  });

  if (error) {
    return res.status(400).json({ errorMessage: 'Failed to send email',error });
  }

  res.status(200).json({ message: 'Email sent successfully',data });
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`))