import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { GraduationCap, LogOut, Shield, User } from "lucide-react";

export function Navbar() {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <nav className="sticky top-0 z-50 glass-card rounded-none border-x-0 border-t-0">
      <div className="container max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary to-accent">
            <GraduationCap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-lg text-foreground">
            AI Study Planner
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              {isAdmin && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/admin")}
                  className="flex items-center gap-2"
                >
                  <Shield className="w-4 h-4" />
                  <span className="hidden sm:inline">Админ</span>
                </Button>
              )}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  {user.email?.split("@")[0]}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSignOut}
                className="text-muted-foreground hover:text-destructive"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={() => navigate("/auth")}
              className="btn-gradient"
            >
              Войти
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
