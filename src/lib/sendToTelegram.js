import axios from "axios";

const sendToTelegram = async (message) => {
  try {
    await axios.post(
      `https://api.telegram.org/bot${process.env.AWCSC_TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: process.env.AWCSC_TELEGRAM_GROUP_ID, // Replace 'CHAT_ID' with your actual chat ID
        text: message,
      }
    );
    // console.log('Message sent:', response.data);
  } catch (error) {
    // console.error('Error sending message:', error);
  }
};
export default sendToTelegram;
