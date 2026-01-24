import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Atom, Zap } from "lucide-react";
import { Button } from "@radix-ui/themes/dist/cjs/index.js";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function PhysicsLab() {
  const navigate = useNavigate();
  const [experiments, setExperiments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExperiments();
  }, []);

  const fetchExperiments = async () => {
    try {
      const response = await axios.get(`${API}/physics/experiments`);
      setExperiments(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching experiments:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-dots flex gap-2">
          <span className="w-3 h-3 bg-accent rounded-full"></span>
          <span className="w-3 h-3 bg-accent rounded-full"></span>
          <span className="w-3 h-3 bg-accent rounded-full"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20" data-testid="physics-lab-page">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-b-2 border-slate-100">
        <div className="container mx-auto px-6 md:px-12 py-8">
          <Button
            data-testid="back-button"
            onClick={() => navigate("/")}
            className="hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-xl px-4 py-2 font-bold mb-4"
            variant="ghost"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Home
          </Button>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center shadow-lg">
              <Atom className="h-8 w-8 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight" data-testid="page-heading">Physics Lab</h1>
              <p className="text-lg font-medium text-slate-600 mt-1">Explore forces and motion!</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiments.map((experiment) => (
            <div
              key={experiment._id}
              data-testid={`experiment-card-${experiment._id}`}
              onClick={() => navigate(`/experiment/physics/${experiment._id}`)}
              className="experiment-card bg-white rounded-3xl border-2 border-slate-100 shadow-sm p-6 cursor-pointer active:scale-95"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Zap className="h-6 w-6 text-accent" strokeWidth={2.5} />
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    experiment.difficulty === "easy"
                      ? "bg-green-100 text-green-700"
                      : experiment.difficulty === "medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {experiment.difficulty}
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2">{experiment.title}</h3>
              <p className="text-slate-600 font-medium mb-4">{experiment.description}</p>
              <div className="flex flex-wrap gap-2">
                {experiment.materials.slice(0, 3).map((material, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-700"
                  >
                    {material}
                  </span>
                ))}
                {experiment.materials.length > 3 && (
                  <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-700">
                    +{experiment.materials.length - 3} more
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
