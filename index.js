import express from "express";
import dotenv from "dotenv";
import auth from "./routes/auth.js";
import company from "./routes/company.js";
import employee from "./routes/employee.js";
import suggestion from "./routes/suggestion.js";
import comment from "./routes/comment.js";
import reply from "./routes/reply.js";
import OTP from "./routes/otp.js";
import imageUploads from "./routes/imageUploads.js";
import uploadFiles from "./routes/uploadFiles.js";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();

const PORT = process.env.PORT || 8000;

//middlewares
app.use(
  express.json({
    limit: "50mb",
  })
);
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

mongoose.set("strictQuery", false);

const connect = async () => {
  await mongoose
    .connect(`${process.env.MONGOOSE_URL}`)
    .then(() => {
      console.log("Database Connected successfully");
    })
    .catch((error) => {
      console.log(error);
    });
};

//Routers
app.use("/api/", auth);
app.use("/api/organizations", company);
app.use("/api/employee", employee);
app.use("/api/suggestion/", suggestion);
app.use("/api/comment/", comment);
app.use("/api/reply/", reply);
app.use("/api/otp/", OTP);
app.use("/api/uploads/", imageUploads);
app.use("/api/files/", uploadFiles);

app.listen(PORT, () => {
  console.log("app is listening on port" + " " + PORT);
  connect();
});
