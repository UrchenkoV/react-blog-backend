import { body } from "express-validator";

export const postCreateValidation = [
  body("title", "Введите заголовок.").isLength({ min: 10 }).isString(),
  body("text", "Введите текст статьи.").isLength({ min: 10 }).isString(),
  body("tags", "Неверный тип тэгов (укажите массив).").optional().isArray(),
  body("image", "Неверно указана ссылка на картинку.").optional().isURL(),
];
