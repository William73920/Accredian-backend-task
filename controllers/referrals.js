import { PrismaClient } from "@prisma/client";
import { createError } from "../error.js";
import nodemailer from "nodemailer";
import { google } from "googleapis";

const prisma = new PrismaClient();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendMail(name, email, referredBy, course) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "rrozario958@gmail.com",
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    const mailOptions = {
      from: "referral <referral@mail.com>",
      to: email,
      subject: "You have been referred by " + referredBy,
      text: "Email body content",
      html:
        "<p> Hello " +
        name +
        ", You have been referred by " +
        referredBy +
        " to learn " +
        course +
        " from Accredian" +
        " </p>",
    };

    const result = await transport.sendMail(mailOptions);

    return result;
  } catch (error) {
    console.error("Error sending email:", error);
    return error;
  }
}
export const addReferral = async (req, res, next) => {
  const { name, email, referredBy, course } = req.body;

  if (!name || !email || !referredBy || !course) {
    next(createError(400, "All fields are required"));
    return;
  }

  try {
    const referral = await prisma.referral.create({
      data: {
        name,
        email,
        referredBy,
        course,
      },
    });

    await sendMail(name, email, referredBy, course);

    res.status(200).json({
      success: true,
      message: "Referral added successfully",
      data: referral,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteAllReferral = async (req, res, next) => {
  try {
    const referrals = await prisma.referral.deleteMany();
    res.status(200).json({
      success: true,
      message: "Referrals deleted successfully",
      data: referrals,
    });
  } catch (err) {
    next(err);
  }
};

export const getReferrals = async (req, res, next) => {
  try {
    const referrals = await prisma.referral.findMany();
    res.status(200).json({
      success: true,
      message: "Referrals fetched successfully",
      data: referrals,
    });
  } catch (err) {
    next(err);
  }
};
