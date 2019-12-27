module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DB_URL: process.env.DB_URL || "postgresql://postgres@localhost/bestie",
  JWT_KEY: process.env.JWT_KEY || "Alberto",
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD
};
