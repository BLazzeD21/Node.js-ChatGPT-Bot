export const generatePassword = async () => {
  const template = '*******-*******-*******';
  let password = '';

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
  const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const randomIndex = Math.floor(Math.random() * letters.length);
  return letters[randomIndex];
};

const generateRandomDigit = async () => {
  const digits = '0123456789';
  const randomIndex = Math.floor(Math.random() * digits.length);
  return digits[randomIndex];
};
