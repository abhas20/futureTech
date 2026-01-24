import Progress from "../models/Progress.js";

export const saveProgress = async (req, res) => {
  await Progress.create(req.body);
  res.json({ success: true });
};

export const getProgress = async (req, res) => {
  res.json(
    await Progress.find({ user_id: req.params.user_id }, { _id: 0 })
  );
};
