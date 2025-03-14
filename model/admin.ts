import mongoose from "mongoose";
const { Schema, model } = mongoose;

const adminSchema = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber:{type:String,required: true},
  createdAt: { type: Date, default: Date.now },
  verificationCode: { type: String },
  verificationCodeExpiration: { type: Date },
});

const Admin = model("Admin", adminSchema);
module.exports = Admin;
