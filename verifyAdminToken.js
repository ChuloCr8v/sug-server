import { createError } from "./error.js";
import jwt from "jsonwebtoken";

export const verifyAdminToken = (req, res, next) => {
  const token = req.headers.authorization;
  // const token =
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55SWQiOiI2NDM3YzU0NjhiNjhiYmYxMTViYTE4N2MiLCJpYXQiOjE2ODMxOTQzODB9.O5R54Vqg361Q2kLvoY4wfK2QdytRGJaaROjB2E7Mrqs";
  if (!token) return next(createError(401, "You are not authorized vat!"));

  jwt.verify(token, process.env.JWT_SEC_PHRASE, (err, user) => {
    if (err) return next(createError(403, "Invalid Token!"));
    req.user = user.companyId;
  });
  next();
};
