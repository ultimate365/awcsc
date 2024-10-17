import axios from "axios";
export const sendOTPSMS = async (phone: string, mobileOtp: number) => {
  try {
    const response = await axios.post(
      "https://www.fast2sms.com/dev/bulkV2",
      {
        variables_values: mobileOtp,
        route: "otp",
        numbers: phone,
      },
      {
        headers: {
          Authorization: process.env.AWCSC_FAST2SMS_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.message;
  } catch (error) {
    console.error({ success: false, message: "Failed to send OTP." }, error);
  }
};
