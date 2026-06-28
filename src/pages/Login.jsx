const handleLogin = async (e) => {
    e.preventDefault();
    // 强制写死，避免任何变量读取导致的 undefined
    const API_URL = "https://mediminder-api-production.up.railway.app/index.php";
    
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        
        const result = await response.json();
        console.log("最终调试数据:", result); // 这里能看到后端返回的 debug_info
        
        if (result.status === "success") {
            alert("连接成功！");
        } else {
            alert("后端报错: " + result.message);
        }
    } catch (err) {
        alert("网络完全断开: " + err.message);
    }
};