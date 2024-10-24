// pages/api/send-email.js
import nodemailer from 'nodemailer';
import Cors from 'cors';
import initMiddleware from '../../utils/init-middleware';

const cors = initMiddleware(
    Cors({
        origin: ['http://localhost:5173', 'https://uganda-saxonypartnership.org'],
        methods: ['POST'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
    })
);

// Set up the transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const handler = async (req, res) => {
    await cors(req, res); // Run the CORS middleware

    if (req.method === 'POST') {
        const { from_name, from_email, from_mobile, from_address, from_organisation, message } = req.body;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER2,
            subject: `New message from ${from_name}`,
            html: `
            <div style="font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 20px; max-width: 600px; margin: 0 auto;">
                <div style="background-color: #fff; border:1px solid #1e8e2c; padding: 10px; text-align: center;">
                    <img height="60" width="80" src="https://uganda-saxonypartnership.org/cms/wp-content/uploads/2024/08/Group-50-1.png" alt="Logo" style="max-width: 150px; height: auto;">
                </div>
                <div style="padding: 20px; background-color: #f9f9f9;">
                    <h2 style="color: #333;">New message from ${from_name} - ${from_organisation}</h2>
                    <hr></hr>
                    <p><strong>Name:</strong> ${from_name}</p>
                    <p><strong>Email:</strong> ${from_email}</p>
                    <p><strong>Phone:</strong> ${from_mobile}</p>
                    <p><strong>Address:</strong> ${from_address}</p>
                    <p><strong>Organisation:</strong> ${from_organisation}</p>
                    <p><strong>Message:</strong> ${message}</p>
                </div>
                <div style="text-align: center; padding: 10px; background-color: #f1f1f1; color: #777;">
                    <p>&copy; ${new Date().getFullYear()} Uganda Saxony</p>
                </div>
            </div>
            `,
        };

        try {
            await transporter.sendMail(mailOptions);
            return res.status(200).json({ message: "Email sent successfully" });
        } catch (error) {
            return res.status(500).json({ message: "Error sending email", error });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
};

export default handler;
