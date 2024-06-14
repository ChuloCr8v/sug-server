import CompanyModel from "../models/CompanyModel.js";
import EmployeeModel from "../models/EmployeeModel.js";
import { sendMail } from "../utils/sendEmail.js";

export const editEmployee = async (req, res, next) => {
  try {
    const employee = await EmployeeModel.findOne({ _id: req.params.id });
    if (!employee) return res.status(401).json("Employee does not exist.");

    // if (employee.companyId !== req.user)
    //   return res.status(401).json("You can only edit your employee details.");
    const updateEmployee = await EmployeeModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updateEmployee);
  } catch (error) {
    next(error);
  }
};

export const updateEmployeeRole = async (req, res, next) => {
  try {
    const employee = await EmployeeModel.findOne({ _id: req.params.id });
    if (!employee) return res.status(401).json("Employee does not exist.");
    if (employee.companyId.toString(16) !== req.user)
      return res.status(401).json("You can only update your employee role.");

    const currentRole = employee.isModerator ? false : true;

    await EmployeeModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: { isModerator: currentRole },
      },
      { new: true }
    );
    res.status(200).json("Employee administrative role updated successfully");
  } catch (error) {
    next(error);
  }
};

// export const emmployeeDepartment = async (req, res, next) => {
//   try {
//     const employee = await EmployeeModel.findOne({ _id: req.params.id });
//     if (!employee) return res.status(401).json("Employee does not exist.");
//     if (employee.companyId.toString(16) !== req.user)
//       return res.status(401).json("You can only update your employee role.");
//     await EmployeeModel.findByIdAndUpdate(
//       req.params.id,
//       {
//         $set: req.body,
//       },
//       { new: true }
//     );
//     // await CompanyModel.findByIdAndUpdate(req.user, {
//     //   $push: { employees: { _id: employee._id } },
//     // });
//     res.status(200).json("Employee administrative role updated successfully");
//   } catch (error) {
//     next(error);
//   }
// };

export const disableEmployee = async (req, res, next) => {
  try {
    const employee = await EmployeeModel.findOne({ _id: req.params.id });
    if (!employee) return res.status(401).json("Employee does not exist.");
    if (employee.companyId.toString(16) !== req.user)
      return res.status(401).json("You can only disable your employee.");
    await EmployeeModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    await CompanyModel.findByIdAndUpdate(req.user, {
      $push: { employees: { _id: employee._id } },
    });
    res.status(200).json("Employee disabled successfully");
  } catch (error) {
    next(error);
  }
};

export const getEmployees = async (req, res, next) => {
  try {
    const employees = await EmployeeModel.find();
    res.status(200).json(employees);
  } catch (error) {
    next(error);
  }
};
4;

export const getEmployee = async (req, res, next) => {
  try {
    const employee = await EmployeeModel.findById(req.params.id);
    res.status(200).json(employee);
  } catch (error) {
    next(error);
  }
};

export const sendEmailToEmployee = async (req, res, next) => {
  const { emailAddress, subject, email } = req.body;

  try {
    const employee = await EmployeeModel.find({ email: emailAddress });

    if (!employee) {
      res.status(404).json("Error, employee does not exist");
      return;
    }

    if (!email) {
      res.status(404).json("Error, Please include email body and try again");
      return;
    }

    await sendMail({
      receiver: emailAddress,
      subject: `${subject ? subject : "Email from your ADMIN on sugbox"}`,
      message: `
        <p>${email}</p>
      `,
    });

    res.status(200).json("email sent successfully");
  } catch (error) {
    next(error);
  }
};
