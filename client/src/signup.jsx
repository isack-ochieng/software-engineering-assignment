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
    <div style={styles.container}>
      {/* Background Pattern */}
      <div style={styles.backgroundPattern}></div>
      
      {/* Main Card */}
      <div style={styles.card}>
        <div style={styles.header}>
          <Building2 size={48} color="#4F46E5" />
          <h1 style={styles.title}>Taifa Systems</h1>
          <p style={styles.subtitle}>Employee Management System</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <h2 style={styles.formTitle}>Create Account</h2>

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

          {/* Form Fields */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              Full Name <span style={styles.required}>*</span>
            </label>
            <div style={styles.inputWrapper}>
              <User size={18} style={styles.inputIcon} />
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              Employee ID <span style={styles.required}>*</span>
            </label>
            <div style={styles.inputWrapper}>
              <Briefcase size={18} style={styles.inputIcon} />
              <input
                type="text"
                name="employeeId"
                placeholder="EMP-2024-001"
                value={formData.employeeId}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address <span style={styles.required}>*</span></label>
            <div style={styles.inputWrapper}>
              <Mail size={18} style={styles.inputIcon} />
              <input
                type="email"
                name="email"
                placeholder="john.doe@taifasystems.com"
                value={formData.email}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.row}>
            <div style={{...styles.inputGroup, flex: 1, marginRight: '1rem'}}>
              <label style={styles.label}>Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                style={styles.select}
              >
                <option value="">Select Role</option>
                <option value="developer">Developer</option>
                <option value="designer">Designer</option>
                <option value="manager">Manager</option>
                <option value="hr">HR Specialist</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            <div style={{...styles.inputGroup, flex: 1}}>
              <label style={styles.label}>Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                style={styles.select}
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

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              Password <span style={styles.required}>*</span>
            </label>
            <div style={styles.inputWrapper}>
              <Lock size={18} style={styles.inputIcon} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                style={styles.input}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {formData.password && (
              <div style={styles.passwordStrength}>
                <div style={{...styles.strengthBar, width: `${(passwordStrength / 5) * 100}%`, backgroundColor: getStrengthColor()}}></div>
                <span style={{...styles.strengthText, color: getStrengthColor()}}>
                  {getStrengthText()} Password
                </span>
              </div>
            )}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              Confirm Password <span style={styles.required}>*</span>
            </label>
            <div style={styles.inputWrapper}>
              <Lock size={18} style={styles.inputIcon} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                style={styles.input}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeButton}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <p style={styles.text}>
            Already have an account?{" "}
            <Link to="/login" style={styles.link}>
              Sign in
            </Link>
          </p>
        </form>
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
    maxWidth: "500px",
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
    marginBottom: "1.5rem",
    textAlign: "center",
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
  required: {
    color: "#ff4444",
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
  select: {
    width: "100%",
    padding: "12px",
    fontSize: "14px",
    border: "1px solid #e0e0e0",
    borderRadius: "10px",
    transition: "all 0.3s ease",
    outline: "none",
    backgroundColor: "white",
    cursor: "pointer",
    "&:focus": {
      borderColor: "#667eea",
      boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
    },
  },
  row: {
    display: "flex",
    gap: "1rem",
    marginBottom: "1.25rem",
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
  passwordStrength: {
    marginTop: "0.5rem",
  },
  strengthBar: {
    height: "4px",
    borderRadius: "2px",
    transition: "all 0.3s ease",
    marginBottom: "0.25rem",
  },
  strengthText: {
    fontSize: "12px",
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
    marginTop: "1rem",
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
};

// Add animation keyframes (you'll need to add this to your global CSS or use a CSS-in-JS library)
// @keyframes slideUp {
//   from {
//     opacity: 0;
//     transform: translateY(20px);
//   }
//   to {
//     opacity: 1;
//     transform: translateY(0);
//   }
// }

export default Signup;