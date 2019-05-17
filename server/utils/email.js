import sgMail from '@sendgrid/mail';
import { config } from 'dotenv';

config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * This is a helper function that sends an email to a user
 * with a URL containing the token to reset password
 * @param {string} email - The receivers email
 * @param {string} token - Unique token to be sent to the user
 */
const resetPasswordEmail = async (email, token) => {
  /**
   * This is the message object that will be sent using the SendGrid API
   * @type {object}
   */
  const msg = {
    to: email,
    from: { email: 'noreply@quickcredit.com', name: 'Quick Credit' },
    subject: 'Reset Password',
    templateId: 'd-0b92405f99f7426891802286f01428fa',
    dynamic_template_data: {
      url: `https://ibkadeeko.github.io/quick-credit/UI/html/changepassword.html?token=${token}`,
    },
    mailSettings: {
      sandbox_mode: {
        enable: true,
      },
    },
  };

  try {
    const response = await sgMail.send(msg);
    return response;
  } catch (error) {
    return false;
  }
};

export default resetPasswordEmail;
