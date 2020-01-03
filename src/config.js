module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL:
    process.env.DATABASE_URL || "postgresql://postgres@localhost/bestie",
  TEST_DATABASE_URL:
    process.env.TEST_DATABASE_URL ||
    "postgresql://postgres@localhost/bestie-test",
  JWT_KEY: process.env.JWT_KEY || "Alberto",
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || "89297060Kz"
};
