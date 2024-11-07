import { AnswerOption } from "../types/CourseTypes.ts";

export const shuffle = (array: readonly AnswerOption[], shouldShuffle = true): AnswerOption[] => {
  if (!shouldShuffle) return [...array]; // Возвращаем копию массива, если перемешивание не нужно

  const newArray = [...array]; // Создаем изменяемую копию массива
  let m = newArray.length, t, i;

  // Пока есть элементы для перемешивания
  while (m) {
    // Взять оставшийся элемент
    i = Math.floor(Math.random() * m--);

    // И поменять его местами с текущим элементом
    t = newArray[m];
    newArray[m] = newArray[i];
    newArray[i] = t;
  }

  return newArray;
};
