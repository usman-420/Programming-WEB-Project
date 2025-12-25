const nodemailer = require('nodemailer');
const config = require('../config/config');

// Create transporter
const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: config.email.secure,
  auth: {
    user: config.email.user,
    pass: config.email.password
  }
});

// Send email
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const info = await transporter.sendMail({
      from: config.email.from,
      to,
      subject,
      html,
      text
    });
    
    console.log('✅ Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email error:', error.message);
    return { success: false, error: error.message };
  }
};

// Send missed workout notification to trainer
const sendMissedWorkoutEmail = async (trainerEmail, memberData, workoutData) => {
  const subject = `⚠️ Member Workout Alert - ${memberData.name}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #FF6B35;">Missed Workout Notification</h2>
      <p>Hi ${trainerEmail.split('@')[0]},</p>
      <p>Your member <strong>${memberData.name}</strong> has missed a scheduled workout:</p>
      
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>📅 Date:</strong> ${workoutData.date}</p>
        <p><strong>🏋️ Workout Plan:</strong> ${workoutData.planName}</p>
        <p><strong>📧 Email:</strong> ${memberData.email}</p>
        <p><strong>📱 Phone:</strong> ${memberData.phone || 'N/A'}</p>
      </div>
      
      <p>Please reach out to check if they need support or plan adjustment.</p>
      
      <p style="color: #666; font-size: 12px;">
        This is an automated message from Gym Tracker System.
      </p>
    </div>
  `;
  
  const text = `
Missed Workout Notification

Hi ${trainerEmail.split('@')[0]},

Your member ${memberData.name} has missed a scheduled workout:

Date: ${workoutData.date}
Workout Plan: ${workoutData.planName}
Email: ${memberData.email}
Phone: ${memberData.phone || 'N/A'}

Please reach out to check if they need support or plan adjustment.
  `;
  
  return await sendEmail({ to: trainerEmail, subject, html, text });
};

// Send welcome email
const sendWelcomeEmail = async (userEmail, userName, role) => {
  const subject = `🎉 Welcome to Gym Tracker!`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #FF6B35;">Welcome to Gym Tracker!</h2>
      <p>Hi ${userName},</p>
      <p>Welcome to Gym Tracker! We're excited to have you join our fitness community.</p>
      
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Your account has been created successfully:</strong></p>
        <p>📧 Email: ${userEmail}</p>
        <p>👤 Role: ${role}</p>
      </div>
      
      <p><strong>Next steps:</strong></p>
      <ol>
        <li>Log in to your account</li>
        <li>Complete your profile</li>
        <li>Check out your dashboard</li>
      </ol>
      
      <p>Need help? Contact us at support@gym.com</p>
      
      <p>Let's achieve your fitness goals together!</p>
      
      <p style="color: #666; font-size: 12px;">
        Best regards,<br/>
        The Gym Tracker Team
      </p>
    </div>
  `;
  
  const text = `
Welcome to Gym Tracker!

Hi ${userName},

Welcome to Gym Tracker! We're excited to have you join our fitness community.

Your account has been created successfully:
Email: ${userEmail}
Role: ${role}

Next steps:
1. Log in to your account
2. Complete your profile
3. Check out your dashboard

Need help? Contact us at support@gym.com

Let's achieve your fitness goals together!

Best regards,
The Gym Tracker Team
  `;
  
  return await sendEmail({ to: userEmail, subject, html, text });
};

module.exports = { sendEmail, sendMissedWorkoutEmail, sendWelcomeEmail };
