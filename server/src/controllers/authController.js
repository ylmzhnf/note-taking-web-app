import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { OAuth2Client } from "google-auth-library";


const saltRounds = 10;
const JWT_SECRET = process.env.JWT_SECRET;

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userResult = await prisma.user.findUnique({
      where: { email },
    });

    if (!userResult) {
      return res.status(401).json({
        error: "Invalid email or password.",
      });
    }
    const storedHashedPassword = userResult.passwordHash;
    const isMatch = await bcrypt.compare(password, storedHashedPassword);
    if (!isMatch) {
      return res.status(401).json({
        error: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      { id: userResult.id, email: userResult.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({
      message: "Login successful",
      token: token,
      userId: userResult.id,
      username: userResult.username,
    });
  } catch (error) {
    console.error("Error during login: ", error);
    res.status(500).json("Internal server error");
  }
};

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Username, email, and password are required." });
  }

  try {
    const checkResult = await prisma.user.findUnique({
      where: { email },
    });
    if (checkResult) {
      res.status(409).json("User already exists");
    } else {
      try {
        const hash = await bcrypt.hash(password, saltRounds);
        console.log("Attempting to create user with data:", { username, email, passwordHash: hash });
        const createUser = await prisma.user.create({
          data: {
            username,
            email,
            passwordHash: hash,
          },
          select: {
            id: true,
            username: true,
            email: true,
            createdAt: true,
          },
        });
        res.json({
          message: "Registration successful",
          user: createUser,
        });
      } catch (hashErr) {
        console.error("Error hashing or inserting user: ", hashErr);
        res.status(500).json({ error: "Internal server error", details: hashErr.message, code: hashErr.code });
      }
    }
  } catch (error) {
    console.error("Error during registration: ", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
};

export const passwordForget = async (req, res) => {
  const { email } = req.body;
  try {
    const checkEmail = await prisma.user.findUnique({
      where: { email },
    });
    if (!checkEmail) {
      return res
        .status(200)
        .json({ message: "Şifre sıfırlama talebiniz işlenmiştir." });
    }
    const rawResetToken = crypto.randomBytes(32).toString("hex");
    const hashedResetToken = await bcrypt.hash(rawResetToken, saltRounds);
    const resetExpires = new Date(Date.now() + 900000);
    const updateUser = await prisma.user.update({
      where: { email },
      data: {
        passwordResetToken: hashedResetToken,
        passwordResetExpires: resetExpires,
      },
    });
    console.log("User updated: ", updateUser);

    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    })
    const sendMail = await transport.sendMail({
      from: "Note Taking App",
      to: email,
      subject: "Password Reset Request",
      text: `You requested a password reset. Use the following token to reset your password: ${rawResetToken}. This token is valid for 15 minutes.`,
    })
    console.log("Email sent: ", sendMail);
    res.status(200).json({ message: "Password reset email sent." });

  } catch (error) {
    console.error("Error during password reset: ", error);
    res.status(500).json("Internal server error");
  }
};

export const passwordReset = async (req, res) => {
  const { email, token, newPassword, } = req.body;
  try {
    const checkEmail = await prisma.user.findUnique({
      where: { email }
    })
    if (!checkEmail) {
      return res.status(400).json({ error: "Invalid email or token." });
    }

    if (checkEmail.passwordResetExpires < new Date()) {
      return res.status(400).json({ error: "Token has expired." });
    }
    const isTokenValid = await bcrypt.compare(token, checkEmail.passwordResetToken);
    if (!isTokenValid) {
      return res.status(400).json({
        error: "Invalid email or token."
      })
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
    const updatePassword = await prisma.user.update({
      where: { email },
      data: {
        passwordHash: hashedNewPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      }
    })
    console.log("Password updated: ", updatePassword);
    res.status(200).json({
      message: "Password has been reset successfully."
    })


  } catch (error) {
    console.error("Error during password rest: ", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message
    })

  }
}

export const googleAuth = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: "Google ID token is required." });
  }

  try {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    const { email, name, sub: googleId } = payload;

    const user = await prisma.user.upsert({
      where: { email },
      update: {
        googleId
      },
      create: {
        email,
        username: name,
        googleId
      }
    });
    const jwtToken = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({
      message: "Login successful",
      token: jwtToken,
      userId: user.id,
      username: user.username,
    });
  } catch (error) {
    console.error("Error during Google authentication: ", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
}
