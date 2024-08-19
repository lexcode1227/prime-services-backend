import express from "express";
import { Resend } from "resend";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import {fileURLToPath} from 'url';
import 'dotenv/config'
const app = express()
const port = 3000

const resend = new Resend(process.env.API_KEY);

app.use(express.json());

app.post('/send-email', async (req, res) => {
  const { to, subject, templateName } = req.body;

  try {
      const htmlTemplate = getHtmlTemplate(templateName);
      const response = await resend.emails.send({
          from: "info@psbposv.com",
          to: [to],
          bcc: [process.env.MAIL_OWNER],
          subject,
          html: htmlTemplate,
      });

      res.status(200).json({ message: 'Email sent successfully', response });
  } catch (error) {
      console.error('Error al enviar el correo electrónico:', error)
      res.status(500).json({ errorMessage: 'Failed to send email', error });
  }
});

function getHtmlTemplate(templateName) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const filePath = join(__dirname, 'templates', `${templateName}.html`);
  
  try {
      const htmlContent = readFileSync(filePath, 'utf8');
      return htmlContent;
  } catch (error) {
      console.error(`Error loading template ${templateName}:`, error);
      return `<h1>Default Email Template</h1><p>There was an error loading the template.</p>`;
  }
}

app.listen(port, () => console.log(`Example app listening on port ${port}!`))