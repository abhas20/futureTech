import Experiment from "../models/Experiment.js";

export const getChemistryExperiments = async (req, res) => {
  res.json(await Experiment.find({ subject: "chemistry" }));
};

export const getPhysicsExperiments = async (req, res) => {
  res.json(await Experiment.find({ subject: "physics" }));
};

export const getExperimentById = async (req, res) => {
  const { id } = req.params;

  const experiment = await Experiment.findById(id); // uses Mongo _id

  if (!experiment) {
    return res.status(404).json({ detail: "Experiment not found" });
  }

  res.json(experiment);
};
