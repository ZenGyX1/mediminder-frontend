import React, { useState } from 'react';

// 重点：接收 App.jsx 传过来的魔法棒
export default function Register({ setAuthPage }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async (e) => {
        if (e) e.preventDefault();
        const API_URL = "https://mediminder-api-production.up.railway.app/api/register";
        
        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, role: 'patient' })
            });
            const result = await response.json();
            
            if (result.status === "success" || result.status === 201) {
                alert("🎉 注册成功！请登录。");
                // 核心：注册成功后，切回登录页！
                setAuthPage("login");
            } else {
                alert("注册失败: " + (result.message || "未知错误"));
            }
        } catch (err) {
            alert("网络请求失败！");
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f4f7f6', fontFamily: 'sans-serif' }}>
            <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '380px' }}>
                <h2 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '10px' }}>Create an Account</h2>
                
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#34495e', fontWeight: '500' }}>Full Name</label>
                    <input type="text" onChange={(e) => setName(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #dcdde1', boxSizing: 'border-box', outline: 'none' }} />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#34495e', fontWeight: '500' }}>Email Address</label>
                    <input type="email" onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #dcdde1', boxSizing: 'border-box', outline: 'none' }} />
                </div>
                
                <div style={{ marginBottom: '30px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#34495e', fontWeight: '500' }}>Password</label>
                    <input type="password" onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #dcdde1', boxSizing: 'border-box', outline: 'none' }} />
                </div>
                
                <button onClick={handleRegister} style={{ width: '100%', padding: '14px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'background-color 0.3s' }}>
                    Sign Up
                </button>
                
                <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#7f8c8d' }}>
                    Already have an account? 
                    {/* 重点：点击切回登录页！ */}
                    <span onClick={() => setAuthPage("login")} style={{ color: '#3498db', cursor: 'pointer', fontWeight: 'bold', marginLeft: '5px' }}>
                        Sign In
                    </span>
                </p>
            </div>
        </div>
    );
}