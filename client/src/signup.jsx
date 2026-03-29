import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Briefcase,
  Building2,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import "./App.css"; // Make sure this is imported

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    employeeId: "",
    role: "",
    department: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Password strength checker
  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);
  
  const getStrengthText = () => {
    if (formData.password.length === 0) return "";
    if (passwordStrength <= 2) return "Weak";
    if (passwordStrength <= 4) return "Medium";
    return "Strong";
  };

  const getStrengthColor = () => {
    if (formData.password.length === 0) return "";
    if (passwordStrength <= 2) return "#ff4444";
    if (passwordStrength <= 4) return "#ffa500";
    return "#00c851";
  };

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Enhanced validation
    if (!formData.name || !formData.email || !formData.password || !formData.employeeId) {
      setError("Please fill in all required fields (*)");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:3001/signup", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        employeeId: formData.employeeId,
        role: formData.role,
        department: formData.department,
      });

      setSuccess("Account created successfully! Redirecting...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);

      // Reset form
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        employeeId: "",
        role: "",
        department: ""
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      {/* Background Pattern */}
      <div className="signup-background-pattern"></div>
      
      {/* Main Card */}
      <div className="signup-card">
        <div className="signup-header">
          <Building2 size={48} color="#4F46E5" />
          <h1 className="signup-title">Taifa Systems</h1>
          <p className="signup-subtitle">Employee Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          <h2 className="signup-form-title">Create Account</h2>

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

          {/* Form Fields */}
          <div className="signup-input-group">
            <label className="signup-label">
              Full Name <span className="signup-required">*</span>
            </label>
            <div className="signup-input-wrapper">
              <User size={18} className="signup-input-icon" />
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                className="signup-input"
              />
            </div>
          </div>

          <div className="signup-input-group">
            <label className="signup-label">
              Employee ID <span className="signup-required">*</span>
            </label>
            <div className="signup-input-wrapper">
              <Briefcase size={18} className="signup-input-icon" />
              <input
                type="text"
                name="employeeId"
                placeholder="EMP-2024-001"
                value={formData.employeeId}
                onChange={handleChange}
                className="signup-input"
              />
            </div>
          </div>

          <div className="signup-input-group">
            <label className="signup-label">Email Address <span className="signup-required">*</span></label>
            <div className="signup-input-wrapper">
              <Mail size={18} className="signup-input-icon" />
              <input
                type="email"
                name="email"
                placeholder="john.doe@taifasystems.com"
                value={formData.email}
                onChange={handleChange}
                className="signup-input"
              />
            </div>
          </div>

          <div className="signup-row">
            <div className="signup-input-group" style={{ flex: 1, marginRight: '1rem' }}>
              <label className="signup-label">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="signup-select"
              >
                <option value="">Select Role</option>
                <option value="developer">Developer</option>
                <option value="designer">Designer</option>
                <option value="manager">Manager</option>
                <option value="hr">HR Specialist</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            <div className="signup-input-group" style={{ flex: 1 }}>
              <label className="signup-label">Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="signup-select"
              >
                <option value="">Select Department</option>
                <option value="engineering">Engineering</option>
                <option value="design">Design</option>
                <option value="hr">Human Resources</option>
                <option value="sales">Sales & Marketing</option>
                <option value="it">IT Support</option>
              </select>
            </div>
          </div>

          <div className="signup-input-group">
            <label className="signup-label">
              Password <span className="signup-required">*</span>
            </label>
            <div className="signup-input-wrapper">
              <Lock size={18} className="signup-input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                className="signup-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="signup-eye-button"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {formData.password && (
              <div className="signup-password-strength">
                <div 
                  className="signup-strength-bar" 
                  style={{ 
                    width: `${(passwordStrength / 5) * 100}%`, 
                    backgroundColor: getStrengthColor()
                  }}
                ></div>
                <span className="signup-strength-text" style={{ color: getStrengthColor() }}>
                  {getStrengthText()} Password
                </span>
              </div>
            )}
          </div>

          <div className="signup-input-group">
            <label className="signup-label">
              Confirm Password <span className="signup-required">*</span>
            </label>
            <div className="signup-input-wrapper">
              <Lock size={18} className="signup-input-icon" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="signup-input"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="signup-eye-button"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="signup-button">
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <p className="signup-text">
            Already have an account?{" "}
            <Link to="/login" className="signup-link">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;