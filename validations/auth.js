import { body } from "express-validator";

export const registerValidation = [
  body("fullName", "Имя минимум 3 символа.").isLength({ min: 3 }),
  body("email", "Укажите правильно почту.").isEmail(),
  body("password", "Пароль не менее 5 символов.").isLength({ min: 5 }),
  body("avatar", "Укажите ссылку на аватарку.").optional().isURL(),
];

export const loginValidation = [
  body("email", "Укажите правильно почту.").isEmail(),
  body("password", "Пароль не менее 5 символов.").isLength({ min: 5 }),
];
