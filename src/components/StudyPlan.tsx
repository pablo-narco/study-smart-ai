import { Sparkles, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

interface StudyPlanProps {
  plan: string;
}

export function StudyPlan({ plan }: StudyPlanProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(plan);
    setCopied(true);
    toast.success("План скопирован!");
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple markdown-like rendering
  const renderContent = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, i) => {
      // Headers
      if (line.startsWith("## ")) {
        return (
          <h2 key={i} className="text-xl font-display font-bold text-foreground mt-6 mb-3 first:mt-0">
            {line.replace("## ", "")}
          </h2>
        );
      }
      if (line.startsWith("### ")) {
        return (
          <h3 key={i} className="text-lg font-display font-semibold text-foreground mt-4 mb-2">
            {line.replace("### ", "")}
          </h3>
        );
      }
      if (line.startsWith("# ")) {
        return (
          <h1 key={i} className="text-2xl font-display font-bold gradient-text mt-6 mb-4 first:mt-0">
            {line.replace("# ", "")}
          </h1>
        );
      }
      // Bold text with **
      if (line.includes("**")) {
        const parts = line.split(/\*\*(.*?)\*\*/g);
        return (
          <p key={i} className="text-foreground/90 leading-relaxed mb-2">
            {parts.map((part, j) =>
              j % 2 === 1 ? (
                <strong key={j} className="font-semibold text-foreground">
                  {part}
                </strong>
              ) : (
                part
              )
            )}
          </p>
        );
      }
      // List items
      if (line.startsWith("- ") || line.startsWith("* ")) {
        return (
          <li key={i} className="text-foreground/90 ml-4 mb-1 list-disc">
            {line.replace(/^[-*] /, "")}
          </li>
        );
      }
      if (line.match(/^\d+\. /)) {
        return (
          <li key={i} className="text-foreground/90 ml-4 mb-1 list-decimal">
            {line.replace(/^\d+\. /, "")}
          </li>
        );
      }
      // Empty lines
      if (!line.trim()) {
        return <div key={i} className="h-2" />;
      }
      // Regular paragraphs
      return (
        <p key={i} className="text-foreground/90 leading-relaxed mb-2">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="glass-card p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-display font-semibold text-lg text-foreground">Ваш учебный план</h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={copyToClipboard}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? "Скопировано" : "Копировать"}
        </Button>
      </div>
      <div className="prose prose-sm max-w-none">{renderContent(plan)}</div>
    </div>
  );
}
