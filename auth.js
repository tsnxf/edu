function initAuthUI() {
  const userBadgeEl = document.getElementById("userBadge");
  const openRegisterEl = document.getElementById("openRegister");
  const openLoginEl = document.getElementById("openLogin");
  const logoutBtnEl = document.getElementById("logoutBtn");
  const authModalEl = document.getElementById("authModal");
  const modalTitleEl = document.getElementById("modalTitle");
  const authUsernameEl = document.getElementById("authUsername");
  const authPasswordEl = document.getElementById("authPassword");
  const modalActionEl = document.getElementById("modalAction");
  const closeModalEl = document.getElementById("closeModal");
  const authMessageEl = document.getElementById("authMessage");
  if (!userBadgeEl || !openRegisterEl || !openLoginEl || !logoutBtnEl || !authModalEl || !modalTitleEl || !authUsernameEl || !authPasswordEl || !modalActionEl || !closeModalEl || !authMessageEl) return;
  let authMode = "login";

  function getUsers() {
    try {
      const raw = localStorage.getItem("edu_users") || "[]";
      const users = JSON.parse(raw);
      return Array.isArray(users) ? users : [];
    } catch {
      return [];
    }
  }

  function setUsers(users) {
    localStorage.setItem("edu_users", JSON.stringify(users));
  }

  function setCurrentUser(username) {
    if (username) localStorage.setItem("edu_current_user", username);
    else localStorage.removeItem("edu_current_user");
    updateAuthView();
  }

  function getCurrentUser() {
    return localStorage.getItem("edu_current_user") || "";
  }

  function updateAuthView() {
    const current = getCurrentUser();
    const loggedIn = !!current;
    userBadgeEl.style.display = loggedIn ? "inline-flex" : "none";
    userBadgeEl.textContent = loggedIn ? `会员：${current}` : "";
    openRegisterEl.style.display = loggedIn ? "none" : "inline-block";
    openLoginEl.style.display = loggedIn ? "none" : "inline-block";
    logoutBtnEl.style.display = loggedIn ? "inline-block" : "none";
  }

  function openAuthModal(mode) {
    authMode = mode;
    modalTitleEl.textContent = mode === "login" ? "会员登录" : "会员注册";
    modalActionEl.textContent = mode === "login" ? "登录" : "注册";
    authUsernameEl.value = "";
    authPasswordEl.value = "";
    authMessageEl.textContent = "";
    authModalEl.classList.add("show");
  }

  function closeAuthModal() {
    authModalEl.classList.remove("show");
    authMessageEl.textContent = "";
  }

  function submitAuth() {
    const username = authUsernameEl.value.trim();
    const password = authPasswordEl.value;
    if (!username || !password) {
      authMessageEl.textContent = "请输入用户名和密码";
      return;
    }
    const users = getUsers();
    if (authMode === "register") {
      const exists = users.some((u) => u.username === username);
      if (exists) {
        authMessageEl.textContent = "用户名已存在";
        return;
      }
      users.push({ username, password });
      setUsers(users);
      setCurrentUser(username);
      closeAuthModal();
      return;
    }
    const match = users.find((u) => u.username === username && u.password === password);
    if (!match) {
      authMessageEl.textContent = "用户名或密码错误";
      return;
    }
    setCurrentUser(username);
    closeAuthModal();
  }

  updateAuthView();
  openRegisterEl.onclick = () => openAuthModal("register");
  openLoginEl.onclick = () => openAuthModal("login");
  closeModalEl.onclick = closeAuthModal;
  modalActionEl.onclick = submitAuth;
  logoutBtnEl.onclick = () => setCurrentUser("");
  authModalEl.addEventListener("click", (e) => {
    if (e.target === authModalEl) closeAuthModal();
  });
  authPasswordEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") submitAuth();
  });
  authUsernameEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") submitAuth();
  });
}

window.initAuthUI = initAuthUI;
