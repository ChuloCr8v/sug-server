import { createError } from "../error.js";
import CompanyModel from "../models/CompanyModel.js";

export const editCompany = async (req, res, next) => {
  try {
    const company = await CompanyModel.findOne({ _id: req.params.id });
    if (!company) return res.status(401).json("Company does not exist.");

    if (company._id.toString(16) !== req.user)
      return res.status(401).json("You can only edit your company details.");
    const updateCompany = await CompanyModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updateCompany);
  } catch (error) {
    next(error);
  }
};

export const deleteCompany = async (req, res, next) => {
  try {
    const company = await CompanyModel.findOne({ _id: req.params.id });
    if (!company) return res.status(401).json("Company does not exist.");

    if (company._id.toString(16) !== req.user)
      return res.status(401).json("You can only delete your company.");
    await CompanyModel.findByIdAndDelete(req.params.id);
    res.status(200).json("Company deleted successfully");
  } catch (error) {
    next(error);
  }
};

export const getCompanies = async (req, res, next) => {
  try {
    const companies = await CompanyModel.find();
    res.status(200).json(companies);
  } catch (error) {
    next(error);
  }
};

export const getCompany = async (req, res, next) => {
  try {
    const company = await CompanyModel.findOne({ _id: req.params.id });
    res.status(200).json(company);
  } catch (error) {
    next(error);
  }
};
