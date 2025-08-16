import { createRoute, useNavigate } from "@tanstack/react-router";
import { rootRoute } from "@/Routes";
import { LoginForm } from "../components/auth/LoginForm";

export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: function LoginView() {
    const navigate = useNavigate();

    const handleSuccess = () => {
      // After successful login, navigate to dashboard/home
      navigate({ to: "/" });
    };

    const handleSwitchToRegister = () => {
      navigate({ to: "/register" });
    };

    return (
      <LoginForm 
        onSuccess={handleSuccess}
        onSwitchToRegister={handleSwitchToRegister}
      />
    );
  },
});
