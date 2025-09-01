import nodemailer from "nodemailer";
import pug from "pug";

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export const emailService = {
  transporter: null as nodemailer.Transporter | null,

  initialize() {
    const emailConfig: EmailConfig = {
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: parseInt(process.env.EMAIL_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER || "",
        pass: process.env.EMAIL_PASS || "",
      },
    };

    this.transporter = nodemailer.createTransport(emailConfig);
  },

  async sendOTP(email: string, otpCode: string): Promise<void> {
    if (process.env.NODE_ENV === "test") {
      console.log(`[TEST] OTP ${otpCode} sent to ${email}`);
      return;
    }

    if (!this.transporter) {
      this.initialize();
    }

    if (!this.transporter) {
      throw new Error("Email service not configured");
    }

    const html = pug.renderFile(
      __dirname + "/../mail-templates/otp-email.pug",
      {
        subject: "Your OTP Code - BrgyKonek",
        heading: "BrgyKonek OTP Verification",
        message: "Your OTP code is:",
        otpCode,
        footer: "If you didn't request this code, please ignore this email.",
      }
    );

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code - BrgyKonek",
      html,
      attachments: [
        {
          filename: "brand-logo.png",
          path: __dirname + "/../../public/images/brand-logo.png",
          cid: "brand-logo",
        },
      ],
    };

    await this.transporter.sendMail(mailOptions);
  },

  async sendPasswordResetOTP(email: string, otpCode: string): Promise<void> {
    if (process.env.NODE_ENV === "test") {
      console.log(`[TEST] Password Reset OTP ${otpCode} sent to ${email}`);
      return;
    }

    if (!this.transporter) {
      this.initialize();
    }

    if (!this.transporter) {
      throw new Error("Email service not configured");
    }

    const html = pug.renderFile(
      __dirname + "/../mail-templates/otp-email.pug",
      {
        subject: "Password Reset OTP - BrgyKonek",
        heading: "BrgyKonek Password Reset",
        message: "Your password reset OTP code is:",
        otpCode,
        footer:
          "If you didn't request a password reset, please ignore this email and ensure your account is secure.",
      }
    );

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP - BrgyKonek",
      html,
      attachments: [
        {
          filename: "brand-logo.png",
          path: __dirname + "/../../public/images/brand-logo.png",
          cid: "brand-logo",
        },
      ],
    };

    await this.transporter.sendMail(mailOptions);
  },
};
