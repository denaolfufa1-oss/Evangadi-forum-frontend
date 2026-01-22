 import { useState } from "react";
import classes from "./signUp.module.css";
import { Link } from "react-router-dom";
import instance from "../../Api/Axios";
import Swal from "sweetalert2";

function Signup({ onSwitch }) {
   

  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null); // cler error when user edits
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  // ================= VALIDATION =================
  function validateUserData(fname, lname, username) {
    const isValidFname = /^[A-Za-z]{2,}$/.test(fname.trim());
    const isValidLname = /^[A-Za-z]{2,}$/.test(lname.trim());
    const isValidUsername = /^[A-Za-z0-9]{2,}$/.test(username.trim());

    return isValidFname && isValidLname && isValidUsername;
  }

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !validateUserData(
        formData.firstName,
        formData.lastName,
        formData.username
      )
    ) {
      return Swal.fire({
        title: "Invalid Input",
        text:
          "First name, last name must be letters only (min 2 chars). Username must be alphanumeric.",
        icon: "error",
      });
    }

    try {
      const response = await instance.post("/auth/register", {
        username: formData.username,
        firstname: formData.firstName,
        lastname: formData.lastName,
        email: formData.email,
        password: formData.password,
      });

      if (response.status === 201) {
        setError(null);

        await Swal.fire({
          title: "Registration Successful 🎉",
          text: "Your account has been created. Please login to continue.",
          icon: "success",
          confirmButtonText: "Go to Login",
        });
        onSwitch();    //  Redirect to LOGIN
       
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
      message = "You already have an account. Please sign in.";
    } else if (status === 500) {
      message = "Server error. Please try again later.";
    }
  }

  setError(message);

    }
  };

  // ================= JSX =================
  return (
    <div className={classes.formcontainer}>
      <h2>Join the network</h2>

      <p className="signin-text">
        Already have an account?{" "}
        <span
          onClick={onSwitch}
          style={{ cursor: "pointer", color: "var(--primary-color)" }}
        >
          Sign in
        </span>
      </p>

      {error && <p className={classes.error}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <div className={classes.nameinputs}>
          <input
            type="text"
            name="firstName"
            placeholder="First name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <input
          type="email"
          name="email"
          placeholder="Email address"
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
          <button
            type="button"
            onClick={handleTogglePassword}
            className={classes.togglebtn}
          >
            {showPassword ? "🙉" : "🙈"}
          </button>
        </div>

        <div style={{ padding: "5px", fontSize: "14px" }}>
          I agree to the <Link to="/privacyPolicy">privacy policy</Link> and{" "}
          <Link to="/terms">terms of service</Link>.
        </div>

        <button type="submit" className={classes.submitbtn}>
          Agree and Join
        </button>
      </form>
    </div>
  );
}

export default Signup;
