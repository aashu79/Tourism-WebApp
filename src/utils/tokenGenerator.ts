import jwt, { JwtPayload, Secret } from "jsonwebtoken";

const generateActivateToken = (id: string) => {
  const payload = { _id: id };
  const options = { expiresIn: "1h" };
  const token = jwt.sign(
    payload,
    process.env.ACTIVATE_SECRET_KEY as Secret,
    options
  );
  return token;
};

const generateAccessToken = (id: string) => {
  const payload = { _id: id };
  const options = { expiresIn: "1d" };
  const token = jwt.sign(
    payload,
    process.env.ACCESS_SECRET_KEY as Secret,
    options
  );
  return token;
};

const generateRefreshToken = (id: string) => {
  const payload = { _id: id };
  const options = { expiresIn: "7d" };
  const token = jwt.sign(
    payload,
    process.env.REFRESH_SECRET_KEY as Secret,
    options
  );
  return token;
};

const verifyActivateToken = (token: string) => {
  try {
    const payload = jwt.verify(
      token,
      process.env.ACTIVATE_SECRET_KEY as Secret
    );
    return payload;
  } catch (error) {
    return null;
  }
};

const verifyAccessToken = (token: string) => {
  try {
    const payload = jwt.verify(
      token,
      process.env.ACCESS_SECRET_KEY as Secret
    ) as JwtPayload;
    return payload;
  } catch (error) {
    return null;
  }
};

const verifyRefreshToken = (token: string) => {
  try {
    const payload = jwt.verify(
      token,
      process.env.REFRESH_SECRET_KEY as Secret
    ) as JwtPayload;
    return payload;
  } catch (error) {
    return null;
  }
};

export {
  generateActivateToken,
  generateAccessToken,
  generateRefreshToken,
  verifyActivateToken,
  verifyAccessToken,
  verifyRefreshToken,
};
