import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../../../../api/axiosClient";
import { AuthAPI } from "../../../../api";
import { AuthContext } from "../../../../context/AuthContext";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const {saveLoginData} = useContext(AuthContext);
  let navigate = useNavigate();

  let {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm();

  // try {
  //   axiosClient.get("/users", {
  //     params: { page: 1, limit: 10, tags: ["admin"] },
  //   });
  // } catch (error) {
  //   //
  // }

  const onSubmit = async (data) => {
    try {
      const response = await AuthAPI.Login(data);
      localStorage.setItem("token", response.data.token);
      saveLoginData();
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="title">
        <h3 className="h5">Log In</h3>
        <span className="text-muted">
          Welcome Back! Please enter your details
        </span>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="input-group mb-2">
          <span className="input-group-text">
            <i className="fa fa-envelope"></i>
          </span>
          <input
            {...register("email", {
              required: "Field is required",
              pattern: {
                value: /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                message: "Email is not valid",
              },
            })}
            type="email"
            placeholder="enter your email"
            className="form-control"
            aria-describedby="emailelpBlock"
          />
        </div>
        {errors.email && (
          <span className="text-danger">{errors.email.message}</span>
        )}
        <div className="input-group">
          <span className="input-group-text">
            <i className="fa fa-key"></i>
          </span>
          <input
            {...register("password", {
              required: "Field is required",
            })}
            type={showPassword ? "text" : "password"}
            placeholder="enter your password"
            className="form-control"
            aria-describedby="passwordelpBlock"
          />
          {showPassword ? (
            <span
              className="input-group-text"
              style={{ cursor: "pointer" }}
              onClick={() => setShowPassword(false)}
            >
              <i className="fa fa-eye text-muted"></i>
            </span>
          ) : (
            <span
              className="input-group-text"
              style={{ cursor: "pointer" }}
              onClick={() => setShowPassword(true)}
            >
              <i className="fa fa-eye-slash text-muted"></i>
            </span>
          )}
        </div>
        {errors.password && (
          <span className="text-danger">{errors.password.message}</span>
        )}

        <div className="links d-flex justify-content-between my-3">
          <Link to="/register" className="text-muted text-decoration-none">
            Register Now?
          </Link>
          <Link to="/forget-pass" className="text-success text-decoration-none">
            Forget Paasword?
          </Link>
        </div>
        <button className="btn btn-success w-100" disabled={isSubmitting}>
          {isSubmitting ? "Submitting" : "LogIn"}
        </button>
      </form>
    </div>
  );
}
