import { createRoute, useNavigate } from "@tanstack/react-router";
import { rootRoute } from "@/Routes";
import { RegisterForm } from "../components/auth/RegisterForm";

export const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: function RegisterView() {
    const navigate = useNavigate();

    const handleSuccess = () => {
      // After successful registration, navigate to login
      navigate({ to: "/login" });
    };

    const handleSwitchToLogin = () => {
      navigate({ to: "/login" });
    };

    return (
      <RegisterForm 
        onSuccess={handleSuccess}
        onSwitchToLogin={handleSwitchToLogin}
      />
    );
  },
});
