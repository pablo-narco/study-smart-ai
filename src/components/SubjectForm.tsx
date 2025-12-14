import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, BookOpen } from "lucide-react";

interface SubjectFormProps {
  onAdd: (name: string, deadline: string, priority: string) => void;
}

export function SubjectForm({ onAdd }: SubjectFormProps) {
  const [name, setName] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("medium");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && deadline) {
      onAdd(name.trim(), deadline, priority);
      setName("");
      setDeadline("");
      setPriority("medium");
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 space-y-5 animate-slide-up">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-xl bg-primary/10">
          <BookOpen className="w-5 h-5 text-primary" />
        </div>
        <h3 className="font-display font-semibold text-lg text-foreground">Добавить предмет</h3>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject" className="text-sm font-medium text-muted-foreground">
          Название предмета
        </Label>
        <Input
          id="subject"
          placeholder="Например: Математика"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-glass h-12"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="deadline" className="text-sm font-medium text-muted-foreground">
            Дедлайн
          </Label>
          <Input
            id="deadline"
            type="date"
            min={today}
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="input-glass h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority" className="text-sm font-medium text-muted-foreground">
            Приоритет
          </Label>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger className="input-glass h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">🔴 Высокий</SelectItem>
              <SelectItem value="medium">🟡 Средний</SelectItem>
              <SelectItem value="low">🟢 Низкий</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        type="submit"
        disabled={!name.trim() || !deadline}
        className="w-full h-12 btn-gradient rounded-xl font-semibold"
      >
        <Plus className="w-5 h-5 mr-2" />
        Добавить предмет
      </Button>
    </form>
  );
}
