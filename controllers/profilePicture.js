import EmployeeModel from "../models/EmployeeModel.js";
import cloudiaryMiddeware from "../utils/cloudinaryMiddleware.js";

export const uploadProfilePicture = async (req, res, next) => {
  try {
    const { id } = req.params;

    const employee = await EmployeeModel.findById(id);
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    const response = await cloudiaryMiddeware(
      req.body.profileImageUrl,
      employee.firstName + " " + employee.lastName,
      "profile_pictures"
    );

    await EmployeeModel.findByIdAndUpdate(
      id,
      {
        $set: {
          profilePicture: response.secure_url,
        },
      },
      { new: true }
    );

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
