import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Lightbulb, AlertTriangle, Target, CheckCircle } from "lucide-react";
import { Button } from "@radix-ui/themes/dist/cjs/index.js";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function ExperimentDetail() {
  const { subject, id } = useParams();
  const navigate = useNavigate();
  const [experiment, setExperiment] = useState(null);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExperiment();
  }, [subject, id]);

  const fetchExperiment = async () => {
    try {
      const response = await axios.get(`${API}/${subject}/experiments/${id}`);
      setExperiment(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching experiment:", error);
      setLoading(false);
    }
  };

  const toggleStep = (index) => {
    setCompletedSteps((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-dots flex gap-2">
          <span className="w-3 h-3 bg-primary rounded-full"></span>
          <span className="w-3 h-3 bg-primary rounded-full"></span>
          <span className="w-3 h-3 bg-primary rounded-full"></span>
        </div>
      </div>
    );
  }

  if (!experiment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Experiment not found</h2>
          <Button onClick={() => navigate("/")} className="bg-primary text-white rounded-full px-6 py-3">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  const subjectColor = subject === "chemistry" ? "#84cc16" : "#f97316";

  return (
    <div className="min-h-screen pb-20" data-testid="experiment-detail-page">
      {/* Header */}
      <div
        className="border-b-2 border-slate-100"
        style={{
          background: `linear-gradient(135deg, ${subjectColor}15 0%, ${subjectColor}30 100%)`
        }}
      >
        <div className="container mx-auto px-6 md:px-12 py-8">
          <Button
            data-testid="back-button"
            onClick={() => navigate(`/${subject}`)}
            className="hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-xl px-4 py-2 font-bold mb-4"
            variant="ghost"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to {subject === "chemistry" ? "Chemistry" : "Physics"} Lab
          </Button>
          <div className="max-w-4xl">
            <div
              className="inline-block px-4 py-1 rounded-full text-sm font-bold mb-4"
              style={{ backgroundColor: `${subjectColor}20`, color: subjectColor }}
            >
              {subject === "chemistry" ? "Chemistry" : "Physics"} Experiment
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4" data-testid="experiment-title">
              {experiment.title}
            </h1>
            <p className="text-lg font-medium text-slate-600">{experiment.description}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Materials */}
          <div className="bg-white rounded-3xl border-2 border-slate-100 shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                <Lightbulb className="h-6 w-6 text-primary" strokeWidth={2.5} />
              </div>
              <h2 className="text-2xl font-bold">Materials Needed</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {experiment.materials.map((material, index) => (
                <div key={index} className="flex items-center gap-3 bg-slate-50 rounded-xl p-3">
                  <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0" />
                  <span className="font-medium text-slate-700">{material}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Safety Notes */}
          <div className="bg-amber-50 rounded-3xl border-2 border-amber-200 shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-amber-200 rounded-xl flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-amber-700" strokeWidth={2.5} />
              </div>
              <h2 className="text-2xl font-bold text-amber-900">Safety First!</h2>
            </div>
            <ul className="space-y-2">
              {experiment.safety_notes.map((note, index) => (
                <li key={index} className="flex items-start gap-3 font-medium text-amber-900">
                  <span className="text-amber-600 font-bold mt-1">•</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Steps */}
          <div className="bg-white rounded-3xl border-2 border-slate-100 shadow-sm p-8">
            <h2 className="text-2xl font-bold mb-6">Experiment Steps</h2>
            <div className="space-y-4">
              {experiment.steps.map((step, index) => (
                <div
                  key={index}
                  data-testid={`step-${index}`}
                  onClick={() => toggleStep(index)}
                  className="flex items-start gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer"
                  style={{
                    backgroundColor: completedSteps.includes(index) ? `${subjectColor}10` : "#f8fafc",
                    borderColor: completedSteps.includes(index) ? subjectColor : "#e2e8f0"
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-white"
                    style={{ backgroundColor: completedSteps.includes(index) ? subjectColor : "#94a3b8" }}
                  >
                    {completedSteps.includes(index) ? "✓" : index + 1}
                  </div>
                  <p className="font-medium text-slate-700 pt-1">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Objectives */}
          <div className="bg-white rounded-3xl border-2 border-slate-100 shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Target className="h-6 w-6 text-purple-600" strokeWidth={2.5} />
              </div>
              <h2 className="text-2xl font-bold">What You'll Learn</h2>
            </div>
            <ul className="space-y-3">
              {experiment.learning_objectives.map((objective, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold mt-1">•</span>
                  <span className="font-medium text-slate-700">{objective}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Button */}
          <div className="text-center">
            <Button
              data-testid="ask-tutor-button"
              onClick={() => navigate("/tutor")}
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 rounded-full font-bold shadow-[0_4px_0_0_rgba(79,70,229,1)] active:shadow-none active:translate-y-[4px] transition-all"
            >
              Ask AI Tutor About This Experiment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
