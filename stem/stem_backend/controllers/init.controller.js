import MathTopic from "../models/MathTopic.js";
import MathProblem from "../models/MathProblem.js";
import Experiment from "../models/Experiment.js";

export const initData = async (req, res) => {
  await MathTopic.deleteMany({});
  await MathProblem.deleteMany({});
  await Experiment.deleteMany({});

  /* ---------------- MATH TOPICS ---------------- */
  const topics = await MathTopic.insertMany([
    {
      title: "Addition & Subtraction",
      difficulty: "easy",
      category: "arithmetic",
      description: "Learn to add and subtract numbers",
    },
    {
      title: "Multiplication Tables",
      difficulty: "easy",
      category: "arithmetic",
      description: "Master multiplication from 1 to 12",
    },
    {
      title: "Division Basics",
      difficulty: "medium",
      category: "arithmetic",
      description: "Understanding division and remainders",
    },
    {
      title: "Fractions",
      difficulty: "medium",
      category: "arithmetic",
      description: "Working with fractions and decimals",
    },
    {
      title: "Basic Algebra",
      difficulty: "hard",
      category: "algebra",
      description: "Introduction to variables and equations",
    },
    {
      title: "Geometry Shapes",
      difficulty: "easy",
      category: "geometry",
      description: "Learn about shapes and their properties",
    },
    {
      title: "Angles & Lines",
      difficulty: "medium",
      category: "geometry",
      description: "Understanding angles, lines, and measurements",
    },
    {
      title: "Measurement",
      difficulty: "easy",
      category: "measurement",
      description: "Length, weight, volume, and time",
    },
  ]);

  /* ---------------- MATH PROBLEMS ---------------- */
  await MathProblem.insertMany([
    // Addition & Subtraction
    {
      topic_id: topics[0]._id,
      question: "What is 15 + 23?",
      answer: "38",
      difficulty: "easy",
      explanation: "Add ones then tens",
    },
    {
      topic_id: topics[0]._id,
      question: "What is 50 - 17?",
      answer: "33",
      difficulty: "easy",
      explanation: "Subtract step by step",
    },
    {
      topic_id: topics[0]._id,
      question: "What is 120 + 45?",
      answer: "165",
      difficulty: "easy",
      explanation: "Add hundreds and tens",
    },
    {
      topic_id: topics[0]._id,
      question: "What is 200 - 89?",
      answer: "111",
      difficulty: "easy",
      explanation: "Borrow and subtract",
    },

    // Multiplication
    {
      topic_id: topics[1]._id,
      question: "What is 7 × 8?",
      answer: "56",
      difficulty: "easy",
      explanation: "7 times 8",
    },
    {
      topic_id: topics[1]._id,
      question: "What is 12 × 6?",
      answer: "72",
      difficulty: "easy",
      explanation: "Multiply 12 by 6",
    },
    {
      topic_id: topics[1]._id,
      question: "What is 9 × 9?",
      answer: "81",
      difficulty: "easy",
      explanation: "Square of 9",
    },
    {
      topic_id: topics[1]._id,
      question: "What is 15 × 4?",
      answer: "60",
      difficulty: "easy",
      explanation: "Multiply tens",
    },

    // Division
    {
      topic_id: topics[2]._id,
      question: "What is 24 ÷ 6?",
      answer: "4",
      difficulty: "medium",
      explanation: "Division by grouping",
    },
    {
      topic_id: topics[2]._id,
      question: "What is 81 ÷ 9?",
      answer: "9",
      difficulty: "medium",
      explanation: "Division facts",
    },

    // Fractions
    {
      topic_id: topics[3]._id,
      question: "What is 1/2 + 1/4?",
      answer: "3/4",
      difficulty: "medium",
      explanation: "Common denominator",
    },
    {
      topic_id: topics[3]._id,
      question: "What is 3/4 - 1/4?",
      answer: "1/2",
      difficulty: "medium",
      explanation: "Subtract fractions",
    },
  ]);

  /* ---------------- EXPERIMENTS ---------------- */
  await Experiment.insertMany([
    {
      title: "Color Changing Cabbage",
      subject: "chemistry",
      difficulty: "easy",
      description: "Test acids and bases using red cabbage juice",
      materials: ["Red cabbage", "Water", "Vinegar", "Baking soda"],
      steps: ["Boil cabbage", "Collect juice", "Add liquids"],
      safety_notes: ["Adult supervision"],
      learning_objectives: ["Understand pH"],
    },
    {
      title: "Volcano Reaction",
      subject: "chemistry",
      difficulty: "easy",
      description: "Baking soda and vinegar eruption",
      materials: ["Baking soda", "Vinegar", "Bottle"],
      steps: ["Add soda", "Pour vinegar"],
      safety_notes: ["Do outdoors"],
      learning_objectives: ["Chemical reactions"],
    },
    {
      title: "Paper Airplanes",
      subject: "physics",
      difficulty: "easy",
      description: "Test aerodynamics",
      materials: ["Paper"],
      steps: ["Fold plane", "Throw"],
      safety_notes: ["Clear area"],
      learning_objectives: ["Lift"],
    },
  ]);

  res.json({ message: "Sample data initialized successfully 🚀" });
};
