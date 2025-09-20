function sanitizeInput(input) {
  if (!input || typeof input !== "string") {
    return "";
  }
  return input.trim();
}

function validateUsername(username) {
  const reg = /^[a-zA-Z0-9_]+$/;
  const minLength = 3;
  const maxLength = 20;

  if (
    username.length < minLength ||
    username.length > maxLength ||
    !reg.test(username)
  ) {
    return false;
  }

  return true;
}

function validatePassword(password) {
  const minLength = 6;
  const maxLength = 32;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (
    password.length < minLength ||
    password.length > maxLength ||
    !(hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar)
  ) {
    return false;
  }

  return true;
}

export function isValidData(data) {
  const errors = [];
  const roles = ["user", "admin"];
  let { username, password, role } = data;

  username = sanitizeInput(username);
  password = sanitizeInput(password);
  role = role ? sanitizeInput(role) : "user";

  if (!validateUsername(username)) {
    errors.push(
      "Invalid username. It should be 3-20 characters long and contain only letters, numbers, and underscores."
    );
  }

  if (!validatePassword(password)) {
    errors.push(
      "Invalid password. It should be 6-32 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character."
    );
  }

  if (role && !roles.includes(role)) {
    errors.push('Invalid role. It should be either "user" or "admin".');
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return { valid: true, user: { username, password, role } };
}
