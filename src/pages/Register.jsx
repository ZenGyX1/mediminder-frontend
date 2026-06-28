import { useState } from "react";

export default function Register({ setAuthPage }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
    dob: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // 发送请求到 PHP 后端的注册接口
      const response = await fetch("http://mediminder-api-production.up.railway.app", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.status !== "error") {
        setSuccess(true);
        // 注册成功后，延迟 1.5 秒自动跳回登录页
        setTimeout(() => setAuthPage("login"), 1500);
      } else {
        setError(data.message || "注册失败，请重试");
      }
    } catch (err) {
      setError("网络错误：无法连接到后端服务器");
      console.error(err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create an Account</h2>
        <p className="auth-subtitle">Join MediMinder today</p>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">注册成功！正在跳转登录...</div>}

        <form onSubmit={handleRegister} className="auth-form">
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Role</label>
              <select name="role" value={formData.role} onChange={handleChange}>
                <option value="patient">Patient (患者)</option>
                <option value="caregiver">Caregiver (看护者)</option>
              </select>
            </div>
            <div className="form-group">
              <label>Date of Birth</label>
              <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
            </div>
          </div>

          <button type="submit" className="auth-btn">Sign Up</button>
        </form>

        <p className="auth-switch">
          Already have an account? 
          <span onClick={() => setAuthPage("login")}> Sign In</span>
        </p>
      </div>
    </div>
  );
}