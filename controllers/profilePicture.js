import EmployeeModel from "../models/EmployeeModel.js";
import CompanyModel from "../models/CompanyModel.js";
import cloudiaryMiddeware from "../utils/cloudinaryMiddleware.js";

export const uploadProfilePicture = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isAdmin } = req.body;

    if (isAdmin) {
      const organization = await CompanyModel.findById(req.user);

      if (!organization)
        return res.status(404).json({ message: "Organization not found" });

      const response = await cloudiaryMiddeware(
        req.body.profileImageUrl,
        organization.companyName,
        "profile_pictures"
      );

      await CompanyModel.findByIdAndUpdate(
        id,
        {
          $set: {
            profilePicture: response.secure_url,
          },
        },
        { new: true }
      );

      return res.status(200).json(response);
    }

    const employee = await EmployeeModel.findById(id);

    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    const response = await cloudiaryMiddeware(
      req.body.profileImageUrl,
      employee.firstName + " " + employee.lastName,
      "profile_pictures"
    );

    console.log(id);

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
