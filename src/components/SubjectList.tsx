import { Button } from "@/components/ui/button";
import { Trash2, Calendar, AlertCircle } from "lucide-react";

interface Subject {
  id: string;
  name: string;
  deadline: string;
  priority: string;
}

interface SubjectListProps {
  subjects: Subject[];
  onDelete: (id: string) => void;
}

const priorityColors: Record<string, string> = {
  high: "bg-destructive/10 text-destructive border-destructive/20",
  medium: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  low: "bg-accent/10 text-accent border-accent/20",
};

const priorityLabels: Record<string, string> = {
  high: "Высокий",
  medium: "Средний",
  low: "Низкий",
};

export function SubjectList({ subjects, onDelete }: SubjectListProps) {
  if (subjects.length === 0) {
    return (
      <div className="glass-card p-8 text-center animate-slide-up">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-muted mb-4">
          <AlertCircle className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground font-medium">Нет предметов</p>
        <p className="text-sm text-muted-foreground/70 mt-1">Добавьте предметы выше для создания плана</p>
      </div>
    );
  }

  const getDaysLeft = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="space-y-3">
      <h3 className="font-display font-semibold text-lg text-foreground px-1">
        Ваши предметы ({subjects.length})
      </h3>
      <div className="space-y-2">
        {subjects.map((subject, index) => {
          const daysLeft = getDaysLeft(subject.deadline);
          const isUrgent = daysLeft <= 3;

          return (
            <div
              key={subject.id}
              className="glass-card p-4 flex items-center justify-between gap-4 animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-foreground truncate">{subject.name}</h4>
                  <span
                    className={`px-2 py-0.5 text-xs font-medium rounded-full border ${priorityColors[subject.priority]}`}
                  >
                    {priorityLabels[subject.priority]}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {new Date(subject.deadline).toLocaleDateString("ru-RU", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                  <span className={`ml-1 ${isUrgent ? "text-destructive font-medium" : ""}`}>
                    ({daysLeft > 0 ? `${daysLeft} дн.` : "Сегодня!"})
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(subject.id)}
                className="shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
