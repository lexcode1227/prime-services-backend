import express from "express";
import { Resend } from "resend";
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
    
  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: ["henryagustin297@gmail.com"],
    subject: "Welcome, we're happy you're here.",
    html: "<strong>Funciona!</strong>",
  });

  if (error) {
    return res.status(400).json({ error });
  }

  res.status(200).json({ data });
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`))