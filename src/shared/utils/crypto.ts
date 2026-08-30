import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  if (!password || typeof password !== "string") {
    throw new TypeError("Password must be a non-empty string.");
  }

  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  if (!password || typeof password !== "string") {
    return false;
  }

  if (!hashedPassword || typeof hashedPassword !== "string") {
    return false;
  }

  return bcrypt.compare(password, hashedPassword);
}
