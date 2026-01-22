import { useState } from "react";
import instance from "../../Api/Axios";
import classes from "./login.module.css";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
function Login({ onSwitch }) {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await instance.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });
      // console.log(response.data)
      localStorage.setItem("token", response.data.token); // Store the token in local storage
      window.location.href = "/"; // This will navigate to the / page and refresh the application
      if (response.status === 200) {
        setSuccess("Login successful! Redirecting...");
        await Swal.fire({
          title: "Success!",
          text: "User Loggedin successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });
        setError(null);
      } else {
        setError(response.data.msg || "Login failed.");
        await Swal.fire({
          title: "Error",
          text:
            response.data.message || "Error submitting the form. Please try again",
          icon: "error",
          confirmButtonText: "OK",
        });
        setSuccess(null);
      }
    } catch (err) {
        let message = "Something went wrong. Please try again.";

  if (err.response) {
    const status = err.response.status;

    if (status === 401) {
      message = "Email or password is incorrect.";
    } else if (status === 404) {
      message = "Account not found.";
    } else if (status === 400) {
      message = "Please fill in all required fields correctly.";
    } else if (status === 500) {
      message = "Server error. Please try again later.";
    }
  }

  setError(message);

  // Swal.fire({
  //   title: "Login Failed",
  //   text: message,
  //   icon: "error",
  // });
    }
  };

  return (
    <div className={classes.formcontainer}>
      <div className={classes.innerContainer}>
        <div className={classes.heading}>
          <h2 className={classes.title}>Login to your account</h2>
          <p className={classes.signuptext}>
            Don't have an account?{" "}
            <a
              onClick={onSwitch}
              style={{ cursor: "pointer", color: "var(--primary-color)" }}
            >
              create a new account
            </a>
          </p>
          {error && (
            <p className={classes.error} style={{ marginBottom: "10px" }}>
              {error}
            </p>
          )}{" "}
          {/* Display error message */}
          {success && <p className={classes.success}>{success}</p>}
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="email"
            placeholder="User name or Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <div className={classes.passwordinput}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button type="button" onClick={handleTogglePassword} style={{}}>
              {showPassword ? "🙉" : "🙈"}
            </button>
          </div>
          <p className={classes.forgotpasswordtext}>
            <Link to="/forgetPass">Forgot password?</Link>
          </p>
          <button type="submit" className={classes.submitbtn}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
