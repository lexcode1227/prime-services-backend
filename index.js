import express from "express";
import { Resend } from "resend";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import {fileURLToPath} from 'url';
import { createTransport } from "nodemailer";
import 'dotenv/config'
import multer from "multer";
const app = express()
const port = 3000

const resend = new Resend(process.env.API_KEY);
const upload = multer({ storage: multer.memoryStorage() }); 

app.use(express.json());

app.post('/apply-job', upload.single("file") ,async (req, res) => {
    const { fullname, email, country, city, phone } = req.body;
    const file = req.file;
    
    if (!fullname || !email || !phone || !file) {
        return res.status(401).json({ errorMessage: 'Incomplete required fields'});
    }

    try {
        const transporter = createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: process.env.ADMIN_MAIL,
            pass: process.env.ADMIN_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.ADMIN_MAIL,
        to: process.env.MAIL_OWNER,
        subject: 'Nuevo empleado potencial',
        text: `Nuevo empleado potencial listo para añadir a tu base de datos. Nombre: ${fullname}, con email: ${email}, número de telefono: ${phone} y se ha contactado desde: ${city}, ${country}. Anexo esta su CV`,
        attachments: [{
            filename: file.originalname, 
            content: file.buffer, 
            contentType: file.mimetype 
        }]
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        } else {
            console.log('Correo enviado correctamente: ' + info.response);
        }
    });
    try {
        const htmlTemplate = getHtmlTemplate("newProspect");
        const response = await resend.emails.send({
            from: "info@psbposv.com",
            to: [email],
            subject: "Prime Services | Well done for your application!",
            html: htmlTemplate,
        });
        return res.status(200).json({ message: 'Email sent successfully', response });
    } catch (error) {
        console.error('Error al enviar el correo electrónico:', error)
        return res.status(500).json({ errorMessage: 'Failed to send email - resend', error });
    }

  } catch (error) {
    // console.error('Error al enviar el correo electrónico:', error)
    res.status(500).json({ errorMessage: 'Failed to send email - nodemailer', error });
  }
});

app.post('/contact-us' ,async (req, res) => {
  const { name, lastname, companyName, email, phoneNumber, message } = req.body;

  try {
    if (!name || !email || !phoneNumber) {
        return res.status(401).json({ message: 'Incomplete required fields' });
    }
    const transporter = createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: process.env.ADMIN_MAIL,
            pass: process.env.ADMIN_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.ADMIN_MAIL,
        to: process.env.MAIL_OWNER,
        subject: 'Nuevo cliente potencial',
        text: `Nuevo cliente potencial listo para añadir a tu base de datos. Nombre: ${name} ${lastname}, proveniente de la empresa: ${companyName}, con email: ${email}, número de telefono: ${phoneNumber} y se ha contactado para: ${message}`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        } else {
            console.log('Correo enviado correctamente: ' + info.response);
        }
    });

    try {
        const htmlTemplate = getHtmlTemplate("newProspect");
        const response = await resend.emails.send({
            from: "info@psbposv.com",
            to: [email],
            subject: "Prime Services | Thank you for contact us!",
            html: htmlTemplate,
        });
        return res.status(200).json({ message: 'Email sent successfully', response });
    } catch (error) {
        console.error('Error al enviar el correo electrónico:', error)
        return res.status(500).json({ errorMessage: 'Failed to send email - resend', error });
    }
    // res.status(200).json({ message: 'New prospect information received successfully' });
  } catch (error) {
    console.error('Error al enviar el correo electrónico de nuevo prospecto desde nodemailer:', error)
    return res.status(500).json({ errorMessage: 'Failed to sent email - nodemailer', error });
  }
});

// app.post('/send-email', async (req, res) => {
//   const { to, subject, templateName } = req.body;

//   try {
//     const htmlTemplate = getHtmlTemplate(templateName);
//     const response = await resend.emails.send({
//         from: "info@psbposv.com",
//         to: [to],
//         subject,
//         html: htmlTemplate,
//     });
//     res.status(200).json({ message: 'Email sent successfully', response });
//   } catch (error) {
//     console.error('Error al enviar el correo electrónico:', error)
//     res.status(500).json({ errorMessage: 'Failed to send email', error });
//   }
// });

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

app.listen(port, () => console.log(`app listening on port ${port}!`))