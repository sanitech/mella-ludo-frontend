export const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  needsUppercase: true,
  needsLowercase: true,
  needsNumber: true,
  needsSpecialChar: true,
  allowedSpecialChars: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

export const EXAMPLE_PASSWORDS = [
  "MyPass123!",
  "Secure#2024",
  "Admin@123",
  "Game$2024",
  "Next#Game1",
  "Super@Admin",
  "Moderator#1",
  "Admin$2024!",
  "Game#Admin1",
  "Next@Game2024",
];

export const validatePassword = (password) => {
  const errors = [];

  if (password.length < PASSWORD_REQUIREMENTS.minLength) {
    errors.push(
      `Password must be at least ${PASSWORD_REQUIREMENTS.minLength} characters long`
    );
  }

  if (PASSWORD_REQUIREMENTS.needsUppercase && !/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter (A-Z)");
  }

  if (PASSWORD_REQUIREMENTS.needsLowercase && !/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter (a-z)");
  }

  if (PASSWORD_REQUIREMENTS.needsNumber && !/\d/.test(password)) {
    errors.push("Password must contain at least one number (0-9)");
  }

  if (
    PASSWORD_REQUIREMENTS.needsSpecialChar &&
    !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  ) {
    errors.push(
      `Password must contain at least one special character (${PASSWORD_REQUIREMENTS.allowedSpecialChars})`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const getPasswordStrength = (password) => {
  let score = 0;

  // Length
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;

  // Character types
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 1;

  // Variety bonus
  const uniqueChars = new Set(password).size;
  if (uniqueChars >= 8) score += 1;

  if (score <= 3) return { strength: "weak", score };
  if (score <= 5) return { strength: "medium", score };
  return { strength: "strong", score };
};

export const generateRandomPassword = () => {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const special = "!@#$%^&*()_+-=[]{}|;:,.<>?";

  let password = "";

  // Ensure one of each required type
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];

  // Add 4 more random characters
  const allChars = uppercase + lowercase + numbers + special;
  for (let i = 0; i < 4; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password
  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
};
