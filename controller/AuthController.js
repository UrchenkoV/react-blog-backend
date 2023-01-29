import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel from "../models/User.js";

export const register = async (req, res) => {
  try {
    const passwordTrim = req.body.password.trim();
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(passwordTrim, salt);

    const doc = new UserModel({
      fullName: req.body.fullName,
      email: req.body.email,
      password: passwordHash,
      avatar: req.body.avatar,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "urchenko",
      {
        expiresIn: "30d",
      }
    );

    const { password, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Регистрация не удалась.",
    });
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email }).select(
      "+password"
    );

    if (!user) {
      return res.status(404).json({ message: "Неверный логин или пароль." });
    }

    const isPassword = await bcrypt.compare(
      req.body.password,
      user._doc.password
    );

    if (!isPassword) {
      return res.status(400).json({ message: "Неверный логин или пароль." });
    }

    const token = jwt.sign({ _id: user._id }, "urchenko", {
      expiresIn: "30d",
    });

    const { password, ...userData } = user._doc;

    res.status(200).json({
      ...userData,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось авторизоваться.",
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(403).json({
        message: "Пользователь не найден.",
      });
    }

    const { password, ...userData } = user._doc;

    res.status(200).json(userData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Неудалось получить данные." });
  }
};
