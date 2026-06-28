import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 引入 React Router 的跳转工具

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate(); // 启动跳转工具

    const handleLogin = async (e) => {
        if (e) e.preventDefault();
        
        const API_URL = "https://mediminder-api-production.up.railway.app/api/login";
        
        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            
            const result = await response.json();
            
            if (result.status === "success") {
                alert("登录成功！准备进入系统...");
                window.location.href = "/dashboard";
            } else {
                alert("登录失败: " + result.message);
            }
        } catch (err) {
            console.error(err);
            alert("网络错误，无法连接到后端服务器！");
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f4f7f6', fontFamily: 'sans-serif' }}>
            <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '380px' }}>
                <h2 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '10px' }}>Welcome to MediMinder</h2>
                <p style={{ textAlign: 'center', color: '#7f8c8d', marginBottom: '30px' }}>Sign in to continue</p>
                
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#34495e', fontWeight: '500' }}>Email Address</label>
                    <input 
                        type="email" 
                        placeholder="15251905087@163.com"
                        onChange={(e) => setEmail(e.target.value)} 
                        style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #dcdde1', boxSizing: 'border-box', backgroundColor: '#f8f9fa', outline: 'none' }}
                    />
                </div>
                
                <div style={{ marginBottom: '30px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#34495e', fontWeight: '500' }}>Password</label>
                    <input 
                        type="password" 
                        placeholder="••••••••"
                        onChange={(e) => setPassword(e.target.value)} 
                        style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #dcdde1', boxSizing: 'border-box', outline: 'none' }}
                    />
                </div>
                
                <button 
                    onClick={handleLogin} 
                    style={{ width: '100%', padding: '14px', backgroundColor: '#20c997', color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'background-color 0.3s' }}
                >
                    Sign In
                </button>
                
                <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#7f8c8d' }}>
    Don't have an account? 
    {/* 重点看这里：使用原生的 window.location.href，无视任何 React 路由限制，强行跳转！ */}
    <span 
        onClick={() => { window.location.href = '/register'; }} 
        style={{ color: '#20c997', cursor: 'pointer', fontWeight: 'bold', marginLeft: '5px' }}
    >
        Sign Up
    </span>
</p>
            </div>
        </div>
    );
}