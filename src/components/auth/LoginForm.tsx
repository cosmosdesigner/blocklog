import React, { useState } from "react";
import { authAPI } from "../../services/api";
import { Button } from "../Button";

interface LoginFormProps {
  onSuccess: () => void;
  onSwitchToRegister?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onSwitchToRegister,
}) => {
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("testpassword123");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await authAPI.login(email, password);
      onSuccess();
    } catch (err: any) {
      setError(err?.message || "Login failed. Please check your credentials.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Login to Blocklog
        </h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-300 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-300 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6"
            variant="primary"
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>

        {onSwitchToRegister && (
          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="text-blue-400 hover:text-blue-300 underline focus:outline-none"
              >
                Create one here
              </button>
            </p>
          </div>
        )}

        <div className="mt-6 p-4 bg-slate-700/50 rounded-lg">
          <p className="text-sm text-slate-400 text-center">Test Account:</p>
          <p className="text-sm text-slate-300 text-center">
            Email: test@example.com
            <br />
            Password: testpassword123
          </p>
        </div>
      </div>
    </div>
  );
};
