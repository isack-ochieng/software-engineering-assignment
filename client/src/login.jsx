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
// No need to import App.css again if already imported in App.jsx
// But you can keep it if you want
import "./App.css";

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
    <div className="signup-container">
      {/* Background Pattern */}
      <div className="signup-background-pattern"></div>
      
      {/* Main Card */}
      <div className="signup-card">
        <div className="signup-header">
          <Building2 size={48} color="white" />
          <h1 className="signup-title">Taifa Systems</h1>
          <p className="signup-subtitle">Employee Management System</p>
        </div>

        {!show2FA ? (
          <form onSubmit={handleSubmit} className="signup-form">
            <h2 className="signup-form-title">Welcome Back</h2>
            <p className="signup-welcome-text">Sign in to access your employee dashboard</p>

            {/* Alerts */}
            {error && (
              <div className="signup-alert-error">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="signup-alert-success">
                <CheckCircle size={18} />
                <span>{success}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="signup-input-group">
              <label className="signup-label">
                Email Address
              </label>
              <div className="signup-input-wrapper">
                <Mail size={18} className="signup-input-icon" />
                <input
                  type="email"
                  name="email"
                  placeholder="john.doe@taifasystems.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="signup-input"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="signup-input-group">
              <label className="signup-label">
                Password
              </label>
              <div className="signup-input-wrapper">
                <Lock size={18} className="signup-input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="signup-input"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="signup-eye-button"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="signup-options-row">
              <label className="signup-checkbox-label">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="signup-checkbox"
                />
                <span className="signup-checkbox-text">Remember me</span>
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="signup-forgot-link"
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <button type="submit" disabled={loading} className="signup-button">
              {loading ? (
                <span className="signup-loading-text">Signing in...</span>
              ) : (
                <span className="signup-button-content">
                  <LogIn size={18} />
                  <span>Sign In</span>
                </span>
              )}
            </button>

            {/* Demo Credentials (Optional - remove in production) */}
            <div className="signup-demo-box">
              <p className="signup-demo-title">Demo Credentials:</p>
              <div className="signup-demo-credentials">
                <span>admin@taifasystems.com</span>
                <span className="signup-demo-password">password123</span>
              </div>
            </div>

            {/* Sign Up Link */}
            <p className="signup-text">
              Don't have an account?{" "}
              <Link to="/signup" className="signup-link">
                Create Account
              </Link>
            </p>

            {/* Additional Security Note */}
            <div className="signup-security-note">
              <Fingerprint size={14} />
              <span>Your data is protected with enterprise-grade security</span>
            </div>
          </form>
        ) : (
          // 2FA Verification Form
          <form onSubmit={handle2FASubmit} className="signup-form">
            <h2 className="signup-form-title">Two-Factor Authentication</h2>
            <p className="signup-welcome-text">
              Please enter the verification code sent to your email
            </p>

            {error && (
              <div className="signup-alert-error">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="signup-alert-success">
                <CheckCircle size={18} />
                <span>{success}</span>
              </div>
            )}

            <div className="signup-input-group">
              <label className="signup-label">
                Verification Code
              </label>
              <div className="signup-input-wrapper">
                <Fingerprint size={18} className="signup-input-icon" />
                <input
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="signup-input"
                  maxLength="6"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="signup-button">
              {loading ? "Verifying..." : "Verify Code"}
            </button>

            <button
              type="button"
              onClick={() => setShow2FA(false)}
              className="signup-back-button"
            >
              Back to Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;