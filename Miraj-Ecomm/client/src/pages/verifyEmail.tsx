import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';

const VerifyEmail: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = (location.state as { email?: string })?.email || "";
  const api = (import.meta as any).env.VITE_API;

  const [otp, setOtp] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Normally, you'd call API to reset password
    console.log("Resetting password for:", email, "with OTP:", otp);

    const res = await axios.post(`${api}/verify-email`, { email, otp });
    if(res.status == 200) {
      alert("Registration completed successfully!");
      navigate("/user/login");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>Reset Password</h2>
      <p>OTP sent to: <b>{email}</b></p>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label>OTP</label>
          <input
            type="text"
            value={otp}
            placeholder="Enter OTP"
            onChange={(e) => setOtp(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "5px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
        </div>
        {/* <div style={{ marginBottom: "15px" }}>
          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            placeholder="Enter new password"
            onChange={(e) => setNewPassword(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "5px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            placeholder="Confirm new password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "5px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
        </div> */}
        <button type="submit" style={{ padding: "10px 20px", border: "1px solid #ccc", borderRadius: "4px" }}>
          Send
        </button>
      </form>
    </div>
  );
};

export default VerifyEmail;
