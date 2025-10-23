import nodemailer from "nodemailer";

export const SendEmail = ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  const transportOptions = {
    host: process.env.HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: true,
    service: "gmail",
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
  };

  const transporter = nodemailer.createTransport(transportOptions);

  const main = async () => {
    const info = await transporter.sendMail({
      from: `Social App<${process.env.USER}>`,
      to,
      subject,
      html,
    });
    console.log({ info });
  };
  main().catch((err) => {
    console.log({ err });
  });
};
