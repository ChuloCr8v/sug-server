import EmployeeModel from "../models/EmployeeModel.js";
import uploadImage from "../utils/uploadImage.js ";

export const uploadProfilePicture = async (req, res, next) => {
  try {
    const { id } = req.params;

    const employee = await EmployeeModel.findById(id);
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    const response = await uploadImage(req.body.profileImageUrl);

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
