import { GraduationCap, Clock, Target, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <div className="text-center mb-10 animate-fade-in">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10 mb-6 animate-float">
        <GraduationCap className="w-10 h-10 text-primary" />
      </div>
      
      <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
        <span className="gradient-text">AI Study Planner</span>
      </h1>
      
      <p className="text-lg text-muted-foreground max-w-md mx-auto mb-8">
        Умный помощник для планирования учёбы. Добавьте предметы и получите персональный план.
      </p>

      <div className="flex flex-wrap justify-center gap-4">
        <FeatureBadge icon={Clock} text="Экономия времени" />
        <FeatureBadge icon={Target} text="Чёткие цели" />
        <FeatureBadge icon={Sparkles} text="AI планирование" />
      </div>
    </div>
  );
}

function FeatureBadge({ icon: Icon, text }: { icon: typeof Clock; text: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50">
      <Icon className="w-4 h-4 text-primary" />
      <span className="text-sm font-medium text-foreground">{text}</span>
    </div>
  );
}
