import createHttpError from "http-errors";
import { loginUser, logoutUser, registerUser } from "../services/auth.js";

export const register = async (req, res, next) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const session = await loginUser(req.body);
    res.status(200).json({ message: "Login successful", session });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    await logoutUser(req.user.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
