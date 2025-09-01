import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const api = (import.meta as any).env.VITE_API;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter your email");
      return;
    }

    // Normally, you'd call API here to send OTP
    console.log("Sending OTP to:", email);

    const res = await axios.post(`${api}/forgot-password`, { email });
    if(res.status == 200) navigate("/user/reset_password", { state: { email } });
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "5px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
        </div>
        <button type="submit" style={{ padding: "10px 20px", border: "1px solid #ccc", borderRadius: "4px" }}>
          Send OTP
        </button>
      </form>
    </div>
  );
};

export { ForgotPassword };
