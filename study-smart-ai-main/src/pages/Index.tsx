import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { HeroSection } from "@/components/HeroSection";
import { SubjectForm } from "@/components/SubjectForm";
import { SubjectList } from "@/components/SubjectList";
import { StudyPlan } from "@/components/StudyPlan";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Sparkles, Loader2 } from "lucide-react";

interface Subject {
  id: string;
  name: string;
  deadline: string;
  priority: string;
}

const Index = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [studyPlan, setStudyPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const { data, error } = await supabase
        .from("subjects")
        .select("*")
        .order("deadline", { ascending: true });

      if (error) throw error;
      setSubjects(data || []);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      toast.error("Ошибка загрузки предметов");
    } finally {
      setIsFetching(false);
    }
  };

  const addSubject = async (name: string, deadline: string, priority: string) => {
    try {
      const { data, error } = await supabase
        .from("subjects")
        .insert([{ name, deadline, priority }])
        .select()
        .single();

      if (error) throw error;
      setSubjects((prev) => [...prev, data].sort((a, b) => 
        new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
      ));
      toast.success("Предмет добавлен!");
    } catch (error) {
      console.error("Error adding subject:", error);
      toast.error("Ошибка добавления предмета");
    }
  };

  const deleteSubject = async (id: string) => {
    try {
      const { error } = await supabase.from("subjects").delete().eq("id", id);
      if (error) throw error;
      setSubjects((prev) => prev.filter((s) => s.id !== id));
      toast.success("Предмет удалён");
    } catch (error) {
      console.error("Error deleting subject:", error);
      toast.error("Ошибка удаления");
    }
  };

  const generatePlan = async () => {
    if (subjects.length === 0) {
      toast.error("Добавьте хотя бы один предмет");
      return;
    }

    setIsLoading(true);
    setStudyPlan(null);

    try {
      const { data, error } = await supabase.functions.invoke("generate-study-plan", {
        body: { subjects },
      });

      if (error) throw error;
      
      if (data.error) {
        throw new Error(data.error);
      }

      setStudyPlan(data.studyPlan);
      toast.success("План создан!");
    } catch (error: any) {
      console.error("Error generating plan:", error);
      toast.error(error.message || "Ошибка генерации плана");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <main className="container max-w-2xl mx-auto px-4 py-12">
        <HeroSection />

        <div className="space-y-6">
          <SubjectForm onAdd={addSubject} />

          {isFetching ? (
            <div className="glass-card p-8 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : (
            <SubjectList subjects={subjects} onDelete={deleteSubject} />
          )}

          <Button
            onClick={generatePlan}
            disabled={isLoading || subjects.length === 0}
            className="w-full h-14 btn-gradient rounded-xl text-lg font-semibold"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Создаём план...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Создать учебный план
              </>
            )}
          </Button>

          {studyPlan && <StudyPlan plan={studyPlan} />}
        </div>
      </main>
    </div>
  );
};

export default Index;
