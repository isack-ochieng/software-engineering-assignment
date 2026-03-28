import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Building2,
  LogIn,
  AlertCircle,
  CheckCircle,
  Fingerprint
} from "lucide-react";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!formData.email || !formData.password) {
      setError("Please enter your email and password");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:3001/login", {
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe
      });

      // Check if 2FA is required
      if (res.data.requires2FA) {
        setShow2FA(true);
        setSuccess("Please enter your 2FA verification code");
        setLoading(false);
        return;
      }

      // Store token based on remember me preference
      if (formData.rememberMe) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      } else {
        sessionStorage.setItem("token", res.data.token);
        sessionStorage.setItem("user", JSON.stringify(res.data.user));
      }

      setSuccess("Login successful! Redirecting to dashboard...");
      console.log(res.data);

      // Redirect after login
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);

    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle 2FA verification
  const handle2FASubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await axios.post("http://localhost:3001/verify-2fa", {
        email: formData.email,
        code: verificationCode
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      
      setSuccess("2FA verified! Redirecting...");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      setError("Invalid verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle forgot password
  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div style={styles.container}>
      {/* Background Pattern */}
      <div style={styles.backgroundPattern}></div>
      
      {/* Main Card */}
      <div style={styles.card}>
        <div style={styles.header}>
          <Building2 size={48} color="white" />
          <h1 style={styles.title}>Taifa Systems</h1>
          <p style={styles.subtitle}>Employee Management System</p>
        </div>

        {!show2FA ? (
          <form onSubmit={handleSubmit} style={styles.form}>
            <h2 style={styles.formTitle}>Welcome Back</h2>
            <p style={styles.welcomeText}>Sign in to access your employee dashboard</p>

            {/* Alerts */}
            {error && (
              <div style={styles.alertError}>
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div style={styles.alertSuccess}>
                <CheckCircle size={18} />
                <span>{success}</span>
              </div>
            )}

            {/* Email Field */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Email Address
              </label>
              <div style={styles.inputWrapper}>
                <Mail size={18} style={styles.inputIcon} />
                <input
                  type="email"
                  name="email"
                  placeholder="john.doe@taifasystems.com"
                  value={formData.email}
                  onChange={handleChange}
                  style={styles.input}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Password
              </label>
              <div style={styles.inputWrapper}>
                <Lock size={18} style={styles.inputIcon} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  style={styles.input}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div style={styles.optionsRow}>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  style={styles.checkbox}
                />
                <span style={styles.checkboxText}>Remember me</span>
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                style={styles.forgotLink}
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <button type="submit" disabled={loading} style={styles.button}>
              {loading ? (
                <span style={styles.loadingText}>Signing in...</span>
              ) : (
                <>
                  <LogIn size={18} />
                  <span>Sign In</span>
                </>
              )}
            </button>

            {/* Demo Credentials (Optional - remove in production) */}
            <div style={styles.demoBox}>
              <p style={styles.demoTitle}>Demo Credentials:</p>
              <div style={styles.demoCredentials}>
                <span>admin@taifasystems.com</span>
                <span style={styles.demoPassword}>password123</span>
              </div>
            </div>

            {/* Sign Up Link */}
            <p style={styles.text}>
              Don't have an account?{" "}
              <Link to="/signup" style={styles.link}>
                Create Account
              </Link>
            </p>

            {/* Additional Security Note */}
            <div style={styles.securityNote}>
              <Fingerprint size={14} />
              <span>Your data is protected with enterprise-grade security</span>
            </div>
          </form>
        ) : (
          // 2FA Verification Form
          <form onSubmit={handle2FASubmit} style={styles.form}>
            <h2 style={styles.formTitle}>Two-Factor Authentication</h2>
            <p style={styles.welcomeText}>
              Please enter the verification code sent to your email
            </p>

            {error && (
              <div style={styles.alertError}>
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div style={styles.alertSuccess}>
                <CheckCircle size={18} />
                <span>{success}</span>
              </div>
            )}

            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Verification Code
              </label>
              <div style={styles.inputWrapper}>
                <Fingerprint size={18} style={styles.inputIcon} />
                <input
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  style={styles.input}
                  maxLength="6"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} style={styles.button}>
              {loading ? "Verifying..." : "Verify Code"}
            </button>

            <button
              type="button"
              onClick={() => setShow2FA(false)}
              style={styles.backButton}
            >
              Back to Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// Modern CSS-in-JS styling
const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    position: "relative",
    padding: "2rem",
  },
  backgroundPattern: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 2%, transparent 2.5%),
                      radial-gradient(circle at 80% 30%, rgba(255,255,255,0.1) 2%, transparent 2.5%)`,
    backgroundSize: "40px 40px",
    backgroundPosition: "0 0, 20px 20px",
    pointerEvents: "none",
  },
  card: {
    background: "white",
    borderRadius: "24px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
    overflow: "hidden",
    width: "100%",
    maxWidth: "450px",
    animation: "slideUp 0.5s ease-out",
  },
  header: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "2rem",
    textAlign: "center",
    color: "white",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    margin: "0.5rem 0 0 0",
    letterSpacing: "-0.5px",
  },
  subtitle: {
    fontSize: "14px",
    opacity: 0.9,
    margin: "0.5rem 0 0 0",
  },
  form: {
    padding: "2rem",
  },
  formTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "0.5rem",
    textAlign: "center",
  },
  welcomeText: {
    fontSize: "14px",
    color: "#666",
    textAlign: "center",
    marginBottom: "1.5rem",
  },
  inputGroup: {
    marginBottom: "1.25rem",
  },
  label: {
    display: "block",
    marginBottom: "0.5rem",
    fontSize: "14px",
    fontWeight: "500",
    color: "#555",
  },
  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  inputIcon: {
    position: "absolute",
    left: "12px",
    color: "#999",
  },
  input: {
    width: "100%",
    padding: "12px 12px 12px 40px",
    fontSize: "14px",
    border: "1px solid #e0e0e0",
    borderRadius: "10px",
    transition: "all 0.3s ease",
    outline: "none",
    fontFamily: "inherit",
    "&:focus": {
      borderColor: "#667eea",
      boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
    },
  },
  eyeButton: {
    position: "absolute",
    right: "12px",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#999",
    padding: 0,
    display: "flex",
    alignItems: "center",
    "&:hover": {
      color: "#667eea",
    },
  },
  optionsRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },
  checkbox: {
    marginRight: "0.5rem",
    cursor: "pointer",
  },
  checkboxText: {
    fontSize: "13px",
    color: "#666",
  },
  forgotLink: {
    background: "none",
    border: "none",
    color: "#667eea",
    fontSize: "13px",
    cursor: "pointer",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  button: {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    fontWeight: "600",
    color: "white",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 10px 20px rgba(102, 126, 234, 0.3)",
    },
    "&:active": {
      transform: "translateY(0)",
    },
    "&:disabled": {
      opacity: 0.6,
      cursor: "not-allowed",
      transform: "none",
    },
  },
  backButton: {
    width: "100%",
    padding: "12px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#667eea",
    background: "white",
    border: "1px solid #e0e0e0",
    borderRadius: "10px",
    cursor: "pointer",
    marginTop: "1rem",
    transition: "all 0.2s",
    "&:hover": {
      background: "#f5f5f5",
      borderColor: "#667eea",
    },
  },
  text: {
    marginTop: "1.5rem",
    fontSize: "14px",
    textAlign: "center",
    color: "#666",
  },
  link: {
    color: "#667eea",
    textDecoration: "none",
    fontWeight: "600",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  alertError: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.75rem",
    backgroundColor: "#fee",
    color: "#c33",
    borderRadius: "10px",
    fontSize: "14px",
    marginBottom: "1rem",
  },
  alertSuccess: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.75rem",
    backgroundColor: "#e8f5e9",
    color: "#2e7d32",
    borderRadius: "10px",
    fontSize: "14px",
    marginBottom: "1rem",
  },
  loadingText: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  demoBox: {
    marginTop: "1.5rem",
    padding: "1rem",
    backgroundColor: "#f8f9fa",
    borderRadius: "10px",
    border: "1px solid #e0e0e0",
  },
  demoTitle: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#666",
    marginBottom: "0.5rem",
    textAlign: "center",
  },
  demoCredentials: {
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
    fontSize: "12px",
    fontFamily: "monospace",
    color: "#333",
  },
  demoPassword: {
    color: "#667eea",
  },
  securityNote: {
    marginTop: "1.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    fontSize: "11px",
    color: "#999",
  },
};

export default Login;