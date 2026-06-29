import React, { useState } from 'react';

// 重点：接收 App.jsx 传过来的魔法棒 (props)
export default function Login({ setAuthPage, setIsAuthenticated, setRole }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        if (e) e.preventDefault();
        const API_URL = "https://mediminder-api-production.up.railway.app/api/login";
        
        // 👇 try 开始了！
        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            
            const result = await response.json();
            
            // 🚨 核心重点：必须写在这个 if 里面！
            if (response.ok && result.status === "success") {
                alert("🎉 登录成功！");
                
                // ===== 【写在这里！】=====
                // 只有拿到服务器的 Success 通行证，才把状态刻进硬盘
                localStorage.setItem("isAuthenticated", "true");
                localStorage.setItem("userRole", result.role || "patient");
                // ==========================
                
                if (result.role) setRole(result.role);
                setIsAuthenticated(true); 
            } else {
                alert("登录失败: " + (result.message || "未知原因"));
            }
        } catch (err) {
            // 👇 如果网络断了，直接跳到这里报错，根本不会执行存硬盘的代码
            console.error("Fetch 错误:", err);
            alert("无法连接服务器，请检查网络！");
        }
    };
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f4f7f6', fontFamily: 'sans-serif' }}>
            <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '380px' }}>
                <h2 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '10px' }}>Welcome to MediMinder</h2>
                <p style={{ textAlign: 'center', color: '#7f8c8d', marginBottom: '30px' }}>Sign in to continue</p>
                
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#34495e', fontWeight: '500' }}>Email Address</label>
                    <input type="email" onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #dcdde1', boxSizing: 'border-box', backgroundColor: '#f8f9fa', outline: 'none' }} />
                </div>
                
                <div style={{ marginBottom: '30px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#34495e', fontWeight: '500' }}>Password</label>
                    <input type="password" onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #dcdde1', boxSizing: 'border-box', outline: 'none' }} />
                </div>
                
                <button onClick={handleLogin} style={{ width: '100%', padding: '14px', backgroundColor: '#20c997', color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'background-color 0.3s' }}>
                    Sign In
                </button>
                
                <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#7f8c8d' }}>
                    Don't have an account? 
                    {/* 重点：点击时调用状态切换，秒切注册页！ */}
                    <span onClick={() => setAuthPage("register")} style={{ color: '#20c997', cursor: 'pointer', fontWeight: 'bold', marginLeft: '5px' }}>
                        Sign Up
                    </span>
                </p>
            </div>
        </div>
    );
}