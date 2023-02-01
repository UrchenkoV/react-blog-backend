import { body } from "express-validator";

export const commentCreateValidation = [
  body("text", "Напишите комментарий.").isLength({ min: 3 }).isString(),
];
