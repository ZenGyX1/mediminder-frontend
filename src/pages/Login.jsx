import React, { useState } from 'react';

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        if (e) e.preventDefault();
        
        // 强制写死云端绝对路径
        const API_URL = "https://mediminder-api-production.up.railway.app/api/login";
        
        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            
            const result = await response.json();
            console.log("登录响应:", result);
            
            if (result.status === "success") {
                alert("登录成功！准备进入系统...");
                // 登录成功后原生跳转
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
                    {/* 彻底移除 react-router-dom 插件，改用 HTML 最底层的原生 <a> 标签跳转，杜绝任何报错 */}
                    <a 
                        href="/register" 
                        style={{ color: '#20c997', cursor: 'pointer', fontWeight: 'bold', marginLeft: '5px', textDecoration: 'none' }}
                    >
                        Sign Up
                    </a>
                </p>
            </div>
        </div>
    );
}