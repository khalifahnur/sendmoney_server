import express from 'express';

const router = express.Router();

const AdminSignup = require('../controller/auth/signup');
const AdminSignin = require('../controller/auth/signin');

router.post("/SignUp", AdminSignup);
router.post("/SignIn", AdminSignin);


module.exports = router;
