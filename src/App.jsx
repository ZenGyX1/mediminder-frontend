import { useState } from "react";
import Sidebar from "./components/Sidebar";
import PatientDashboard from "./pages/PatientDashboard";
import CaregiverDashboard from "./pages/CaregiverDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import MedicationsPage from "./pages/MedicationsPage";
import AdherenceReport from "./pages/AdherenceReport";
import RemindersPage from "./pages/RemindersPage";

// 引入登录和注册页面
import Login from "./pages/Login";
import Register from "./pages/Register";

import "./App.css";

export default function App() {
  // === 1. 从硬盘读取状态，解决刷新失忆 ===
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem("isAuthenticated") === "true");
  const [role, setRole] = useState(localStorage.getItem("userRole") || "");

  // === 2. 页面与 UI 状态 ===
  const [page, setPage] = useState("today");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [authPage, setAuthPage] = useState("login"); // 控制登录/注册页

  // === 3. 退出登录功能 ===
  function handleLogout() {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
    setIsAuthenticated(false);
  }

  // === 4. 路由与菜单点击逻辑 ===
  function navigate(newPage) {
    if (newPage === "caregiver" || newPage === "admin" || newPage === "patient") {
      setRole(newPage);
      setPage("today");
    } else {
      setPage(newPage);
    }
    // 点击菜单后自动收起移动端侧边栏
    setIsMobileMenuOpen(false);
  }

  // === 5. 核心主页面渲染 ===
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

  // === 6. 拦截：如果未登录，只渲染登录/注册页 ===
  if (!isAuthenticated) {
    return authPage === "login" 
      ? <Login setAuthPage={setAuthPage} setIsAuthenticated={setIsAuthenticated} setRole={setRole} />
      : <Register setAuthPage={setAuthPage} setIsAuthenticated={setIsAuthenticated} setRole={setRole} />;
  }

  // === 7. 已登录：渲染带侧边栏的主界面 ===
  return (
    <div className="app">
      {/* 移动端专属：汉堡菜单按钮 */}
      <button 
        className="mobile-menu-btn" 
        onClick={() => setIsMobileMenuOpen(true)}
      >
        ☰
      </button>

      {/* 侧边栏 */}
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