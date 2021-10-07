export const authConfig = {
  jwt: {
    secret: process.env.SECRET_KEY,
    expiresIn: process.env.SECRET_EXPIRES,
  },
};
