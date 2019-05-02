import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const resetPassword = async (email, token) => {
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

export default resetPassword;
