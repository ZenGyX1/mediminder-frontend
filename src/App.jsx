import { useState } from "react";
import Sidebar from "./components/Sidebar";
import PatientDashboard from "./pages/PatientDashboard";
import CaregiverDashboard from "./pages/CaregiverDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import MedicationsPage from "./pages/MedicationsPage";
import AdherenceReport from "./pages/AdherenceReport";
import RemindersPage from "./pages/RemindersPage";

// 【新增】引入我们即将创建的登录和注册页面
import Login from "./pages/Login";
import Register from "./pages/Register";

import "./App.css";

export default function App() {
  // === 1. 鉴权与路由状态 ===
  // 🚨 修改：每次刷新时，先去本地硬盘看一眼是不是登录过了
// === 1. 从硬盘读取的登录状态 ===
const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem("isAuthenticated") === "true");
const [role, setRole] = useState(localStorage.getItem("userRole") || "");

// === 2. 页面的导航状态 ===
const [page, setPage] = useState("today");
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

// 🚨 补上这行控制登录/注册页面的状态！
const [authPage, setAuthPage] = useState("login");

// 顺便加上退出登录的功能（绑定到你的 Logout 按钮上）
const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
    setIsAuthenticated(false);
};
  // 原有的角色和页面状态
  const [page, setPage] = useState("today");

  // === 2. 移动端侧边栏状态 ===
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // === 页面切换逻辑 ===
  function navigate(newPage) {
    if (newPage === "caregiver" || newPage === "admin" || newPage === "patient") {
      setRole(newPage);
      setPage("today");
    } else {
      setPage(newPage);
    }
    // 点击任何菜单后，移动端侧边栏自动收起
    setIsMobileMenuOpen(false);
  }

  // === 核心主页面渲染 ===
  function renderPage() {
    if (role === "caregiver") return <CaregiverDashboard />;
    if (role === "admin") return <AdminDashboard />;
    switch (page) {
      case "today":      return <PatientDashboard />;
      case "meds":       return <MedicationsPage />;
      case "adherence":  return <AdherenceReport />;
      case "reminders":  return <RemindersPage />;
      default:           return <PatientDashboard />;
    }
  }

  // === 3. 拦截：如果未登录，只渲染登录/注册页 ===
  if (!isAuthenticated) {
    return authPage === "login" 
      ? <Login setAuthPage={setAuthPage} setIsAuthenticated={setIsAuthenticated} setRole={setRole} />
      : <Register setAuthPage={setAuthPage} setIsAuthenticated={setIsAuthenticated} setRole={setRole} />;
  }

  // === 4. 已登录：渲染带侧边栏的主界面 ===
  return (
    <div className="app">
      {/* 移动端专属：汉堡菜单按钮 */}
      <button 
        className="mobile-menu-btn" 
        onClick={() => setIsMobileMenuOpen(true)}
      >
        ☰
      </button>

      {/* 侧边栏：通过类名动态控制滑入滑出 */}
      <div className={`sidebar-wrapper ${isMobileMenuOpen ? 'open' : ''}`}>
        <Sidebar role={role} page={page} navigate={navigate} />
      </div>

      {/* 移动端专属：点击可关闭侧边栏的暗色遮罩层 */}
      {isMobileMenuOpen && (
        <div className="mobile-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      {/* 主内容区 */}
      <div className="main">{renderPage()}</div>
    </div>
  );
}