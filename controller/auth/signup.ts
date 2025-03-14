import bcrypt from "bcrypt";
import { Request, Response } from "express";

const AdminAuth = require("../../model/admin");

const signUpAdmin = async (req: Request, res: Response) => {
  try {
    const { firstname, lastname, email, password, phoneNumber } = req.body;
    console.log("Received request body:", req.body);

    if (!firstname || !lastname || !email || !password || !phoneNumber) {
      console.log("Missing required field:", {
        firstname,
        lastname,
        email,
        password,
        phoneNumber,
      });
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await AdminAuth.findOne({ email });

    if (existingUser) {
      return res.status(401).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new AdminAuth({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      phoneNumber,
    });

    await newUser.save();
    res.status(200).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating user" });
    console.log("Error occurred during signup:", error);
  }
};

module.exports = signUpAdmin;
