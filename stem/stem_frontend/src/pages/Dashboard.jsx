import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FlaskConical,
  Calculator,
  Atom,
  Sparkles,
  TrendingUp,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@radix-ui/themes/dist/cjs/index.js";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const mainUrl = import.meta.env.VITE_MAIN_URL || "http://localhost:5173";

const API = `${BACKEND_URL}/api`;

export default function Dashboard() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      await axios.post(`${API}/init-data`);
      setIsLoading(false);
    } catch (error) {
      console.error("Error initializing data:", error);
      setIsLoading(false);
    }
  };

  const subjects = [
    {
      id: "math",
      title: "Math Explorer",
      description: "Practice math problems and master numbers!",
      icon: Calculator,
      color: "#6366f1",
      bgImage:
        "https://images.unsplash.com/photo-1735116356965-ad5b323d1af8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODh8MHwxfHNlYXJjaHwyfHxtYXRoJTIwc3ltYm9scyUyMGNvbG9yZnVsJTIwaWxsdXN0cmF0aW9ufGVufDB8fHx8MTc2OTAxOTE4Mnww&ixlib=rb-4.1.0&q=85",
      path: "/math",
    },
    {
      id: "chemistry",
      title: "Chemistry Lab",
      description: "Mix, react, and discover amazing experiments!",
      icon: FlaskConical,
      color: "#84cc16",
      bgImage:
        "https://images.unsplash.com/photo-1633412748213-0cf8268c357f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxNzV8MHwxfHNlYXJjaHwyfHxjaGVtaXN0cnklMjBiZWFrZXIlMjByZWFjdGlvbiUyMGNhcnRvb258ZW58MHx8fHwxNzY5MDE5MTgzfDA&ixlib=rb-4.1.0&q=85",
      path: "/chemistry",
    },
    {
      id: "physics",
      title: "Physics Lab",
      description: "Explore forces, motion, and energy!",
      icon: Atom,
      color: "#f97316",
      bgImage:
        "https://images.unsplash.com/photo-1675627453075-0f170b02186a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTF8MHwxfHNlYXJjaHwxfHxwaHlzaWNzJTIwYXRvbSUyMG1hZ25ldCUyMGlsbHVzdHJhdGlvbnxlbnwwfHx8fDE3NjkwMTkxODV8MA&ixlib=rb-4.1.0&q=85",
      path: "/physics",
    },
  ];

  if (isLoading) {
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

  return (
    <div className="min-h-screen pb-20" data-testid="dashboard-page">
      {/* Back Button */}
      <div className="container mx-auto px-6 md:px-12 pt-6">
        <Button
          variant="outline"
          className="flex items-center gap-2 mb-4"
          onClick={() => navigate(window.location.href = mainUrl)}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-transparent to-lime-200 opacity-60"></div>
        <div className="container mx-auto px-6 md:px-12 pt-6 md:pt-20 pb-16 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-in">
            <h1
              className="text-5xl md:text-7xl font-black tracking-tight mb-6"
              data-testid="main-heading">
              Welcome to <span className="text-gradient">STEM Explorer</span>
            </h1>
            <p className="text-lg md:text-xl font-medium leading-relaxed text-slate-600 mb-8">
              Your digital science playground! Learn math, conduct experiments,
              and explore the amazing world of science.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                data-testid="ai-tutor-button"
                onClick={() => navigate("/tutor")}
                className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 rounded-full font-bold shadow-[0_4px_0_0_rgba(79,70,229,1)] active:shadow-none active:translate-y-[4px] transition-all">
                <Sparkles className="mr-2 h-5 w-5" />
                Ask AI Tutor
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="container mx-auto px-6 md:px-12 mt-8">
        <h2
          className="text-4xl md:text-5xl font-bold tracking-tight mb-8 text-center"
          data-testid="subjects-heading">
          Choose Your Adventure
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {subjects.map((subject) => {
            const IconComponent = subject.icon;
            return (
              <div
                key={subject.id}
                data-testid={`subject-card-${subject.id}`}
                onClick={() => navigate(subject.path)}
                className="subject-card group cursor-pointer rounded-3xl overflow-hidden h-80 relative transform transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95"
                style={{
                  backgroundImage: `url(${subject.bgImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}>
                <div className="subject-card-content h-full flex flex-col justify-end p-8 bg-gradient-to-t from-black/50 to-transparent">
                  <div className="mb-4">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
                      style={{ backgroundColor: subject.color }}>
                      <IconComponent
                        className="h-8 w-8 text-white"
                        strokeWidth={2.5}
                      />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2">
                    {subject.title}
                  </h3>
                  <p className="text-white/90 font-medium mb-4">
                    {subject.description}
                  </p>
                  <div className="flex items-center text-white font-bold">
                    Start Learning
                    <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="container mx-auto px-6 md:px-12 mt-16">
        <div className="bg-white rounded-3xl border-2 border-slate-100 shadow-lg p-8 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-black text-primary mb-2">100+</div>
              <div className="text-slate-600 font-medium">Math Problems</div>
            </div>
            <div>
              <div className="text-4xl font-black text-secondary mb-2">20+</div>
              <div className="text-slate-600 font-medium">Experiments</div>
            </div>
            <div>
              <div className="text-4xl font-black text-accent mb-2">24/7</div>
              <div className="text-slate-600 font-medium">AI Tutor Help</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
