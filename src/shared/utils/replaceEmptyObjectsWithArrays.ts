export function replaceEmptyObjectsWithArrays<T>(obj: T): T {
  if (Array.isArray(obj)) {
    // console.log("Массив найден:", obj);
    return obj.map(replaceEmptyObjectsWithArrays) as unknown as T;
  } else if (typeof obj === 'object' && obj !== null) {
    // console.log("Объект найден:", obj);

    // Проверяем, все ли значения свойств объекта являются null или undefined
    const allPropertiesEmpty = Object.keys(obj).every((key) => {
      const value = (obj as Record<string, unknown>)[key];
      return (value === null ||
        value === undefined || (typeof value === 'object' && true && Object.keys(value).length === 0));
    });

    if (allPropertiesEmpty) {
      // console.log('Пустой объект найден:', obj);
      return [] as unknown as T;
    }

    const newObj = {} as Record<string, unknown>;
    Object.keys(obj).forEach((key) => {
      // console.log(`Рекурсивный вызов для ключа ${key}`);
      newObj[key] = replaceEmptyObjectsWithArrays((obj as Record<string, unknown>)[key]);
    });
    return newObj as T;
  } else {
    // console.log("Значение:", obj);
  }
  return obj;
}
