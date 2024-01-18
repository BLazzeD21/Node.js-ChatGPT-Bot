export const generatePassword = async () => {
  const template: string = '*******-*******-*******';
  let password: string = '';

  for (let i = 0; i < template.length; i++) {
    if (template[i] === '*') {
      const randomChar =
        Math.random() < 0.5 ?
          await generateRandomLetter() :
          await generateRandomDigit();
      password += randomChar;
    } else {
      password += template[i];
    }
  }

  return password;
};

const generateRandomLetter = async () => {
  const letters: string =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const randomIndex: number = Math.floor(Math.random() * letters.length);
  return letters[randomIndex];
};

const generateRandomDigit = async () => {
  const digits: string = '0123456789';
  const randomIndex: number = Math.floor(Math.random() * digits.length);
  return digits[randomIndex];
};
