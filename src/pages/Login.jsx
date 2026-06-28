import { useState } from "react";

export default function Login({ setAuthPage, setIsAuthenticated, setRole }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // 发送请求到 PHP 后端 (请确保 URL 和你的 Laragon 本地地址一致)
      const response = await fetch("http://mediminder-api-production.up.railway.app", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.status !== "error") {
        // 登录成功：放行，并设置角色
        setRole(data.role || "patient"); // 假设后端返回了 role，默认 patient
        setIsAuthenticated(true);
      } else {
        setError(data.message || "登录失败，请检查邮箱和密码");
      }
    } catch (err) {
      setError("网络错误：无法连接到后端服务器");
      console.error(err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome to MediMinder</h2>
        <p className="auth-subtitle">Sign in to continue</p>
        
        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="auth-btn">Sign In</button>
        </form>

        <p className="auth-switch">
          Don't have an account? 
          <span onClick={() => setAuthPage("register")}> Sign Up</span>
        </p>
      </div>
    </div>
  );
}