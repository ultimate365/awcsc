import nodemailer from "nodemailer";
const sendEmail = async ({ email, code, name }: any) => {
  try {
    const mail = process.env.AWCSC_GMAIL_ID;
    const mailpassword = process.env.AWCSC_GMAIL_PASSWORD;
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: mail,
        pass: mailpassword,
      },
    });

    const mailOptions = {
      from: mail,
      to: email,
      subject: `Reset your Password: Mail no ${Math.floor(
        Math.random() * 1000 + 1
      )}`,
      // text: `Your OTP is ${otp}`,
      html: `<h1 style="text-align:center; color:blue; ">Hello Dear ${name}!</h1>
        <h2 style="text-align:center; color:blue;">Your OTP is ${code}. Please use this OTP to reset your password.</h2>`,
    };
    const mailResponse = await transport.sendMail(
      mailOptions,
      function (error: any, info: any) {
        if (error) {
          console.log("error", error);
        } else {
          console.log("Email Sent: " + info.response);
        }
      }
    );

    return mailResponse;
  } catch (error) {
    console.log(error);
  }
};

export default sendEmail;
