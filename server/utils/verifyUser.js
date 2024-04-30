import { errorHandler } from "./error.handler.js";
import jwt from "jsonwebtoken";

export const verifyUser = (req, res, next) => {
  const cookiesWithName = req.headers.cookie;
  if (!cookiesWithName) {
    return next(errorHandler(401, "Unauthorized"));
  }

  const cookies = cookiesWithName.split(";").reduce((cookiesObj, cookie) => {
    const [name, value] = cookie.trim().split("=");
    cookiesObj[name] = value;
    return cookiesObj;
  }, {});

  const token = cookies.access_token;
  if (!token) {
    return next(errorHandler(401, "Unauthorized"));
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return next(errorHandler(401, "Unauthorized"));
    }
    req.user = user;
    next();
  });
};
