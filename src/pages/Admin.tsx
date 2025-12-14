import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Shield, 
  Users, 
  BookOpen, 
  Loader2, 
  Trash2, 
  Crown,
  ArrowLeft
} from "lucide-react";

interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  created_at: string;
  role?: string;
}

interface Subject {
  id: string;
  name: string;
  deadline: string;
  priority: string;
  user_id: string;
}

const Admin = () => {
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"users" | "subjects">("users");

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate("/auth");
      } else if (!isAdmin) {
        toast.error("Доступ запрещён");
        navigate("/");
      } else {
        fetchData();
      }
    }
  }, [user, isAdmin, authLoading, navigate]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch profiles with roles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*");

      if (profilesError) throw profilesError;

      // Fetch roles
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("*");

      if (rolesError) throw rolesError;

      // Merge profiles with roles
      const usersWithRoles = profiles?.map(profile => ({
        ...profile,
        role: roles?.find(r => r.user_id === profile.user_id)?.role || "user"
      })) || [];

      setUsers(usersWithRoles);

      // Fetch all subjects
      const { data: subjectsData, error: subjectsError } = await supabase
        .from("subjects")
        .select("*")
        .order("created_at", { ascending: false });

      if (subjectsError) throw subjectsError;
      setSubjects(subjectsData || []);

    } catch (error) {
      console.error("Error fetching admin data:", error);
      toast.error("Ошибка загрузки данных");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAdminRole = async (userId: string, currentRole: string) => {
    try {
      if (currentRole === "admin") {
        // Remove admin role
        const { error } = await supabase
          .from("user_roles")
          .update({ role: "user" })
          .eq("user_id", userId);

        if (error) throw error;
        toast.success("Роль администратора снята");
      } else {
        // Add admin role
        const { error } = await supabase
          .from("user_roles")
          .update({ role: "admin" })
          .eq("user_id", userId);

        if (error) throw error;
        toast.success("Назначен администратором");
      }
      fetchData();
    } catch (error) {
      console.error("Error toggling role:", error);
      toast.error("Ошибка изменения роли");
    }
  };

  const deleteSubject = async (id: string) => {
    try {
      const { error } = await supabase.from("subjects").delete().eq("id", id);
      if (error) throw error;
      setSubjects(prev => prev.filter(s => s.id !== id));
      toast.success("Предмет удалён");
    } catch (error) {
      console.error("Error deleting subject:", error);
      toast.error("Ошибка удаления");
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <main className="container max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Панель администратора
            </h1>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === "users" ? "default" : "outline"}
            onClick={() => setActiveTab("users")}
            className="flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            Пользователи ({users.length})
          </Button>
          <Button
            variant={activeTab === "subjects" ? "default" : "outline"}
            onClick={() => setActiveTab("subjects")}
            className="flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            Предметы ({subjects.length})
          </Button>
        </div>

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="space-y-3">
            {users.map((profile) => (
              <div
                key={profile.id}
                className="glass-card p-4 flex items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-foreground truncate">
                      {profile.full_name || "Без имени"}
                    </h4>
                    {profile.role === "admin" && (
                      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
                        Админ
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {profile.email}
                  </p>
                </div>
                {profile.user_id !== user?.id && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleAdminRole(profile.user_id, profile.role || "user")}
                    className="shrink-0 flex items-center gap-2"
                  >
                    <Crown className="w-4 h-4" />
                    {profile.role === "admin" ? "Снять админа" : "Сделать админом"}
                  </Button>
                )}
              </div>
            ))}
            {users.length === 0 && (
              <div className="glass-card p-8 text-center">
                <p className="text-muted-foreground">Нет пользователей</p>
              </div>
            )}
          </div>
        )}

        {/* Subjects Tab */}
        {activeTab === "subjects" && (
          <div className="space-y-3">
            {subjects.map((subject) => (
              <div
                key={subject.id}
                className="glass-card p-4 flex items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground truncate mb-1">
                    {subject.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Дедлайн: {new Date(subject.deadline).toLocaleDateString("ru-RU")}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteSubject(subject.id)}
                  className="shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            {subjects.length === 0 && (
              <div className="glass-card p-8 text-center">
                <p className="text-muted-foreground">Нет предметов</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
