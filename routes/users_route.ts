// user route


import express from "express"
import { register } from "../controllers/users";
const router = express.Router();

router.post("/register",register);