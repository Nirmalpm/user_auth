import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
  APP_ERROR_CONTENT,
  USER_CREATION_MAIL,
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
    //console.log("Email sent successfully", response);
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
    //console.log("Welcome Email sent successfully", response);
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

export const sendErrorMailToAdmin = async (name, email, content) => {
  const recipients = [{ email: "admin@virtuours.com" }];
  const replacements = {
    "{error_content}": content,
    "{sender_name}": name,
    "{sender_email}": email,
  };
  const html = APP_ERROR_CONTENT.replace(
    /{error_content}|{sender_name}|{sender_email}/g,
    (matched) => replacements[matched]
  );
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipients,
      subject: " Exception in the application",
      html: html,
      category: "Application Exception",
    });
    //console.log("Email sent successfully", response);
  } catch (error) {
    console.error("Error sending exception email ", error.message);
    throw new Error(`Error sending exception email: ${error.message}`);
  }
};

export const sendEmployeeAddedMail = async (email, name, empId, pwd) => {
  const recipients = [{ email }];
  const replacements = {
    "{name}": name,
    "{empId}": empId,
    "{pwd}": pwd,
  };
  const html = USER_CREATION_MAIL.replace(
    /{empId}|{pwd}|{name}/g,
    (matched) => replacements[matched]
  );
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipients,
      subject: " Employee enrolled to the system",
      html: html,
      category: "Employee enroll",
    });
    //console.log("Email sent successfully", response);
  } catch (error) {
    console.error("Error sending employee added email ", error.message);
    throw new Error(`Error sending employee added email: ${error.message}`);
  }
};
