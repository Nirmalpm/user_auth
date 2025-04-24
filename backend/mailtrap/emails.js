import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
} from "./emailTemplate.js";
import { mailtrapClient, sender } from "./mailtrap.config.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  const recipients = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipients,
      subject: " Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
      category: "Email Verification",
    });
    console.log("Email sent successfully", response);
  } catch (error) {
    console.error("Error sending verification email ", error.message);
    throw new Error(`Error sending verification email: ${error.message}`);
  }
};

export const sendWelcomeEmail = async (email, name) => {
  const recipients = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipients,
      //template_uuid: "2e5a3d27-e7e2-4755-b5a4-23891c93021e",
      template_uuid: "c99038b2-fbe4-42cf-a2bd-b98ff965e60d",
      template_variables: {
        company_info_name: "VIRTUOURS.COM",
        name: name,
      },
    });
    console.log("Welcome Email sent successfully", response);
  } catch (error) {
    console.error("Error sending Welcome email ", error.message);
    throw new Error(`Error sending Welcome email: ${error.message}`);
  }
};

export const sendPasswordResetEmail = async (email, resetUrl) => {
  const recipients = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipients,
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetUrl),
      category: "Password Reset",
    });
  } catch (error) {
    console.error("Error sending password reset email ", error.message);
    throw new Error(`Error sending password reset  email: ${error.message}`);
  }
};

export const sendResetSuccessEmail = async (email) => {
  const recipients = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipients,
      subject: "Reset password successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password Reset",
    });
  } catch (error) {
    console.error("Error sending password reset success email ", error.message);
    throw new Error(
      `Error sending password reset success email: ${error.message}`
    );
  }
};
