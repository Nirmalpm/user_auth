import { sendErrorMailToAdmin } from "../mailtrap/emails.js";

export const sendErrorMail = async (req, res) => {
  const { name, email, content } = req.body;
  console.log(name, email, content);
  try {
    await sendErrorMailToAdmin(name, email, content);

    res.status(200).json({
      success: true,
      message: "Error mail sent successfully",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
