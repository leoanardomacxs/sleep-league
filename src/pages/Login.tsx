import { useState } from "react";
import { motion } from "framer-motion";
import { Moon, Eye, EyeOff, ArrowRight } from "lucide-react";

interface LoginProps {
  onLogin: () => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, just log in directly (no backend)
    onLogin();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full"
        style={{
          background: "radial-gradient(circle, hsl(265 100% 70% / 0.15), transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm relative z-10"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", damping: 12 }}
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{
              background: "linear-gradient(135deg, hsl(265 100% 70%), hsl(190 100% 65%))",
            }}
          >
            <Moon size={28} className="text-white" />
          </motion.div>
          <h1 className="text-3xl font-display text-foreground">Dormio</h1>
          <p className="text-sm text-muted-foreground font-body mt-1">
            Evolua seu sono
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {isSignUp && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
              <input
                type="text"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-12 rounded-xl bg-card border border-border px-4 text-sm text-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </motion.div>
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full h-12 rounded-xl bg-card border border-border px-4 text-sm text-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-12 rounded-xl bg-card border border-border px-4 pr-12 text-sm text-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <motion.button
            type="submit"
            whileTap={{ scale: 0.97 }}
            className="w-full h-12 rounded-xl flex items-center justify-center gap-2 text-sm font-ui uppercase text-primary-foreground"
            style={{
              background: "linear-gradient(135deg, hsl(265 100% 70%), hsl(190 100% 65%))",
            }}
          >
            {isSignUp ? "Criar Conta" : "Entrar"}
            <ArrowRight size={16} />
          </motion.button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground font-ui">ou continue com</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Social login */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onLogin}
            className="flex-1 h-12 rounded-xl bg-card border border-border flex items-center justify-center gap-2 text-sm font-ui text-foreground active:scale-95 transition-transform"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google
          </button>
          <button
            type="button"
            onClick={onLogin}
            className="flex-1 h-12 rounded-xl bg-card border border-border flex items-center justify-center gap-2 text-sm font-ui text-foreground active:scale-95 transition-transform"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.53-3.23 0-1.44.62-2.2.44-3.06-.4C3.79 16.22 4.36 9.5 8.66 9.26c1.26.06 2.14.72 2.88.76.93-.19 1.82-.87 3.17-.79 1.07.07 2.04.51 2.67 1.31-2.42 1.46-1.84 4.67.67 5.57-.5 1.32-1.15 2.62-2.28 3.7l1.28-.53zM12.03 9.2c-.15-2.23 1.66-4.07 3.74-4.2.29 2.58-2.34 4.5-3.74 4.2z" />
            </svg>
            Apple
          </button>
        </div>

        {/* Toggle */}
        <p className="text-center text-sm text-muted-foreground font-body mt-6">
          {isSignUp ? "Já tem conta?" : "Não tem conta?"}{" "}
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-primary font-ui"
          >
            {isSignUp ? "Entrar" : "Criar conta"}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
