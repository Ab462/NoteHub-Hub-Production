import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.mjs";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import fetchUser from "../middleware/fetchUser.mjs";
const router = express.Router();

// Creating a user using POST "/api/auth/Signup" no auth required

router.post("/Signup", [
  body("name", "name should be 3 characters long").isLength({ min: 3 }).notEmpty(),
  body("email", "Enter a valid email").isEmail().notEmpty(),
  body("password", "password should be 8 characters long").isLength({ min: 8 }).notEmpty(),
], async (req, res) => {
  let success = false;
  // Check for validation errors
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }

  try {
    // Check whether a user with this email already exist 
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ success, error: 'Sorry a user with this email already exist' })
    }

    // securing the password 
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    const data = {
      userId: {
        id: user.id
      }
    }

    const authToken = jwt.sign(data, process.env.SECRET_KEY);
    res.status(200).header('auth-token', authToken);

    return res.status(201).json({ success: true, message: 'Account Created Successfully ', Token: authToken })
  } catch (error) {
    return res.status(500).send('Internal Server Error', error);

  }

});

// Logging a user using POST "/api/auth/login" No auth required

router.post("/login", [
  body("email", "Enter a valid email").isEmail().notEmpty(),
  body("password", "Password cannot be blank").notEmpty()
], async (req, res) => {
  let success = false;
  // Check for validation errors
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }

  try {

    let olduser = await User.findOne({ email: req.body.email });
    if (!olduser) {
      return res.status(400).json({ success, error: 'Please try to login with correct credentials' });
    }

    const comparePassword = await bcrypt.compare(req.body.password, olduser.password);
    if (!comparePassword) {
      return res.status(400).json({ success, error: 'Please try to login with correct credentials' });
    }

    const data = {
      userId: {
        id: olduser.id
      }
    }

    const authToken = jwt.sign(data, process.env.SECRET_KEY);
    res.status(200).header('auth-token', authToken);

    return res.status(201).json({ success: true, message: 'Logged in Successfully', Token: authToken });

  } catch (error) {
    return res.status(500).send('Internal Server Error');
  }

})

// Get Logged in user using POST "/api/auth/getuser" auth required
router.post('/getuser', fetchUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const loggeduser = await User.findById(userId).select('-password');
    res.status(200).send(loggeduser);

  } catch (error) {
    return res.status(500).send('Internal Server Error');
  }
});

export default router;
