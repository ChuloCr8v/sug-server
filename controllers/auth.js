import bcrypt from "bcrypt";
import crypto from "crypto";
import CompanyModel from "../models/CompanyModel.js";
import EmployeeModel from "../models/EmployeeModel.js";
import { createError } from "../error.js";
import jwt from "jsonwebtoken";
import TokenModel from "../models/TokenModel.js";
import { sendMail } from "../utils/sendEmail.js";

const baseUrl = process.env.BASE_URL;

//Company Signup
export const companySignup = async (req, res, next) => {
  try {
    const { companyEmail } = req.body;

    const verifyExstingOrganizationEmail = await CompanyModel.findOne({
      email: companyEmail,
    });

    const verifyExistingEmployeeEmail = await EmployeeModel.findOne({
      email: companyEmail,
    });

    if (verifyExstingOrganizationEmail || verifyExistingEmployeeEmail) {
      return res
        .status(501)
        .json("Error, email already exists, try a new one.");
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const newCompany = new CompanyModel({ ...req.body, password: hash });
    const saveCompany = await newCompany.save();

    res.status(200).json({
      message: "New Company Added Successfully",
      company: saveCompany,
    });

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = bcrypt.hashSync(verificationToken, salt);
    await new TokenModel({
      token: hashedToken,
      userId: saveCompany._id,
      createdAt: new Date().getTime(),
      expireAt: new Date().getTime() + 30 * 60 * 1000,
    }).save();

    const link = `${process.env.BASE_URL}/verify-organization/${verificationToken}/${saveCompany._id}`;

    await sendMail({
      receiver: saveCompany.companyEmail,
      subject: "Verify Account",
      message: `
        <p>Hello ${saveCompany.companyName},</p>
        <p>Welcome to SugBox</p>
        <p>Your first digital suggestion app</p>
        <p>Click on the link below to verify your organization account.</p>
        <a
          style="background: green; color: white; padding: 4px; border-radius: 10px; text-decoration: none;"
          href="${link}"
        >
          Verify Organization
        </a>
        <p>Thanks</p>

      `,
    });
  } catch (err) {
    // next(err);
    console.log(err);
    return res
      .status(500)
      .json("Error creating account. Check your network and try again.");
  }
};

//organization verification
export const verifyAccount = async (req, res, next) => {
  try {
    const organization = await CompanyModel.findById(req.params.id);
    if (!organization) {
      return res.status(404).json("This organization does not exist");
    }

    const verifyToken = await TokenModel.findOne({ userId: req.params.id });

    if (!verifyToken) {
      return res.status(401).json("No token found for this account");
    }

    await CompanyModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: { isVerified: true },
      },
      { new: true }
    );
    res.status(200).json("Account verification successfull");

    await sendMail({
      receiver: organization.companyEmail,
      subject: "Account Verification Successful",
      message:
        `
        <p>Hello ${organization.companyName},</p>
        <p>Your account has been successfully verified. Click on the link below to continue to login.</p>
        <a
          style="background: green; color: white; padding: 4px; border-radius: 10px; text-decoration: none;"
          href=`(baseUrl) /
        login /
        admin`
        >
         Login
        </a>
      `,
    });

    await TokenModel.findByIdAndDelete(verifyToken._id);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(
        "Organization account creation failed, check your network try again."
      );
  }
};

//Company Sign in
export const companyLogin = async (req, res, next) => {
  try {
    const getCompany = await CompanyModel.findOne({
      companyEmail: req.body.email,
    });
    if (!getCompany)
      return res.status(404).json(createError(404, "company does not exist"));

    const verifyPassword = await bcrypt.compare(
      req.body.password,
      getCompany.password
    );
    if (!verifyPassword)
      return res.status(401).json(createError(401, "Wrong credential"));

    const token = jwt.sign(
      { companyId: getCompany._id },
      process.env.JWT_SEC_PHRASE
    );

    const { password, suggestions, employees, ...others } = getCompany._doc;

    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({
        message: `${getCompany.companyName} logged in successfully!`,
        others,
        token: token,
      });
  } catch (error) {
    next(error);
  }
};

//Employee Signup
export const employeeSignup = async (req, res, next) => {
  console.log(req.body);
  const { email } = req.body;
  const company = await CompanyModel.findById(req.params.id);

  if (req.params.id !== req.user)
    return res.status(401).json("You are not authorized!");

  const verifyExstingOrganizationEmail = await CompanyModel.findOne({
    companyEmail: email,
  });

  const verifyExistingEmployeeEmail = await EmployeeModel.findOne({
    email: email,
  });

  if (verifyExstingOrganizationEmail || verifyExistingEmployeeEmail) {
    return res.status(501).json("Error, email already exists, try a new one.");
  }

  const password = crypto.randomBytes(8).toString("hex");

  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const newEmployee = new EmployeeModel({
      ...req.body,
      password: hash,
      companyId: req.params.id,
    });

    const saveEmployee = await newEmployee.save();
    console.log(saveEmployee);
    //Update Company Employee List
    await CompanyModel.findByIdAndUpdate(req.params.id, {
      $push: { employees: newEmployee._id },
    });

    res.status(200).json({
      message: "New Employee Added Successfully",
      employee: newEmployee,
    });

    await sendMail({
      receiver: company.companyEmail,
      subject: `Invitation Sent Successfully.`,
      message: `
        <p>Hello ${company.companyName},</p>
        <p>You have successfully invited ${
          saveEmployee.firstName + " " + saveEmployee.lastName
        } to Suggbox.
         </p>
         <p>Hang on and hear what they have to say.</p>
      `,
    });

    await sendMail({
      receiver: saveEmployee.email,
      subject: `Invitation to Suggbox from ${company.companyName}`,
      message: `
        <p>Hello ${saveEmployee.firstName},</p>
        <p>You have been invited by ${company.companyName} to Suggbox, a digital suggestions app for organizations.</p>
        <p style="display: block">Your password is <i style="color: blue; font-weight: bold;">${password}</i>.</p>
        <p>Don't forget to reset your password after you have logged in.</p>
        <p>Click on the link below to get started:</p>
        <p>Thanks.</p>
        <a
          style="background: green; color: white; padding: 4px; border-radius: 10px; text-decoration: none;"
          href="${process.env.BASE_URL}/login/employee"
        >
          Login
        </a>
      `,
    });
  } catch (err) {
    next(err);
  }
};

//Employee Sign in
export const employeeLogin = async (req, res, next) => {
  try {
    const employee = await EmployeeModel.findOne({
      email: req.body.email,
    });
    if (!employee)
      return res.status(404).json(createError(404, "employee does not exist"));
    console.log("emmmp", employee);
    console.log("passs", req.body.password);
    const verifyPassword = await bcrypt.compare(
      req.body.password,
      employee.password
    );
    if (!verifyPassword)
      return res.status(401).json(createError(401, "Wrong credential"));

    const token = jwt.sign(
      { employeeId: employee._id },
      process.env.JWT_SEC_PHRASE
    );

    const { password, company, comments, ...others } = employee._doc;

    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({
        message: `${
          employee.firstName + " " + employee.lastName
        } logged in successfully!`,
        others,
        token: token,
      });
  } catch (error) {
    next(error);
  }
};

//Reset Password

export const resetPassword = async (req, res, next) => {
  try {
    const { email } = req.params;
    const { oldPassword, newPassword } = req.body.formData;
    const { action, token } = req.body;

    console.log(oldPassword, newPassword, action, token, email);

    const employee = await EmployeeModel.findOne({ email: email });
    const organization = await CompanyModel.findOne({ companyEmail: email });
    if (!employee && !organization) {
      return res.status(404).json("This account does not exist.");
    }

    const currentAccount = employee ? employee : organization;
    const currentModel = employee ? EmployeeModel : CompanyModel;

    if (action === "resetPassword") {
      const isOldPasswordValid = await bcrypt.compare(
        oldPassword,
        currentAccount.password
      );

      if (!isOldPasswordValid) {
        return res.status(401).json("Incorrect Old Password");
      }
    } else if (action === "forgotPassword") {
      const getToken = await TokenModel.findOne({ userId: currentAccount._id });
      if (!getToken) {
        return res.status(404).json("No token found");
      }

      const isTokenValid = await bcrypt.compare(token, getToken.token);
      if (!isTokenValid) {
        return res.status(401).json("Invalid Token");
      }

      const isTokenNotExpired = getToken.expireAt > Date.now();
      if (!isTokenNotExpired) {
        await TokenModel.findByIdAndDelete(getToken._id);
        return res.status(401).json("Token has expired.");
      }
    }

    const isNewPasswordUnique = await bcrypt.compare(
      newPassword,
      currentAccount.password
    );

    if (isNewPasswordUnique) {
      return res
        .status(403)
        .json(
          "Old password and new password are the same, use a new password."
        );
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(newPassword, salt);

    const currentEmail = employee ? "email" : "companyEmail";

    await currentModel.findOneAndUpdate(
      { [currentEmail]: email },
      { $set: { password: hash } },
      { new: true }
    );

    res.status(200).json("Password Updated Successfully");

    sendMail({
      receiver: employee ? employee.email : organization.companyEmail,
      subject: "Password Reset Successful",
      message: "Your password has been successfully reset",
    });

    await TokenModel.findOneAndDelete({ userId: currentAccount._id });
  } catch (error) {
    console.error(error);
    res.status(500).json("Password reset failed. Please try again.");
  }
};

//Forgot Password

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.params;

    const employee = await EmployeeModel.findOne({ email: email });
    const organization = await CompanyModel.findOne({ companyEmail: email });

    if (!employee && !organization) {
      return res.status(404).json("This account does not exist.");
    }

    const currentAccount = employee !== null ? employee : organization;

    const existingToken = await TokenModel.findOne({
      userId: currentAccount._id.toString(),
    });

    if (existingToken) {
      console.log("TOKEN", existingToken);
      await TokenModel.findByIdAndDelete(existingToken._id);
    }

    const newToken = crypto.randomBytes(32).toString("hex");

    const salt = await bcrypt.genSaltSync(10);
    const hash = await bcrypt.hash(newToken, salt);

    await new TokenModel({
      token: hash,
      userId: currentAccount._id,
      createdAt: new Date().getTime(),
      expireAt: new Date().getTime() + 30 * 60 * 1000,
    }).save();

    const link = `${process.env.BASE_URL}/change-password/${newToken}/${currentAccount._id}`;

    await sendMail({
      receiver: "nkematu5@gmail.com",
      subject: "Password Reset",
      message: `
        <p>Hello ${
          employee === null ? organization.companyName : employee.firstName
        },</p>
        <p>Click the link below to reset your password:</p>
        <a
          style="background: green; color: white; padding: 4px; border-radius: 10px; text-decoration: none;"
          href="${link}"
        >
          Reset Password
        </a>
      `,
    });

    res.status(200).json("Password reset link sent successfully.");
  } catch (error) {
    console.log(error);
    return res.status(500).json("Error, Check your internet and try again");
  }
};

//Verify Old password is correct during password reset
export const verifyEmployeePasswordMatch = async (req, res, next) => {
  try {
    const employee = await EmployeeModel.findById(req.params.id);
    if (!employee) {
      return res.status(404).json("This employee does not exist.");
    }

    const oldPassword = req.body.oldPassword;
    const verifyPassword = await bcrypt.compare(oldPassword, employee.password);
    if (!verifyPassword) {
      return res.status(401).json("Incorrect Old Password!");
    }
    res.status(200).json("Correct Old Password");
  } catch (error) {
    next(error);
  }
};

//RESET EMAIL

export const resetEmail = async (req, res, next) => {
  try {
    const { isAdmin, email } = req.body;
    const { id } = req.params;

    const Model = isAdmin ? CompanyModel : EmployeeModel;
    const currentEmail = isAdmin ? "companyEmail" : "email";

    const verifyEmailDoesNotExist = await Model.findOne({
      currentEmail: email,
    });

    const user = await Model.findById(id);

    if (user[currentEmail] === email) {
      return res
        .status(400)
        .json("You cannot reuse your current email. Enter a new one.");
    }

    if (verifyEmailDoesNotExist) {
      return res.status(400).json("This email already exists, try a new one.");
    }

    await Model.findByIdAndUpdate(
      id,
      {
        [currentEmail]: email,
      },
      { new: true }
    );

    sendMail({
      receiver: user[currentEmail],
      subject: "Email Update Successful",
      message: `<div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <p>Hello ${isAdmin ? user.companyName : user.firstName},</p>
        <p>Your email has been successfully updated.</p>
        <p>Thank you.</p>
      </div>`,
    });
    res.status(200).json("email update successfull");
  } catch (error) {
    next(error);
  }
};
