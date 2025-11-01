const API_URL = "http://localhost:33333";
const tokenKey = "user_token";

// Login
if (document.getElementById("loginForm")) {
  document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const res = await fetch(`${API_URL}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem(tokenKey, data.token);
        window.location.href = "notas.html";
      } else {
        document.getElementById("message").innerText = data.message || "Erro no login";
      }
    } catch {
      document.getElementById("message").innerText = "Erro de conexão.";
    }
  });
}

// Cadastro
if (document.getElementById("cadastroForm")) {
  document.getElementById("cadastroForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("newUsername").value;
    const password = document.getElementById("newPassword").value;

    try {
      const res = await fetch(`${API_URL}/user/cadastro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (res.ok) {
        alert("Usuário cadastrado com sucesso!");
        window.location.href = "login.html";
      } else {
        document.getElementById("message").innerText = data.message || "Erro no cadastro";
      }
    } catch {
      document.getElementById("message").innerText = "Erro de conexão.";
    }
  });
}

// Calcular média
if (document.getElementById("notasForm")) {
  document.getElementById("notasForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = localStorage.getItem(tokenKey);
    if (!token) {
      alert("Faça login primeiro!");
      window.location.href = "login.html";
      return;
    }

    const nota1 = parseFloat(document.getElementById("nota1").value);
    const nota2 = parseFloat(document.getElementById("nota2").value);
    const nota3 = parseFloat(document.getElementById("nota3").value);

    try {
      const res = await fetch(`${API_URL}/calcular/notas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nota1, nota2, nota3 }),
      });

      const data = await res.json();
      if (res.ok) {
        document.getElementById("resultado").innerText = `Média: ${data.media}`;
      } else {
        document.getElementById("resultado").innerText = data.message || "Erro ao calcular";
      }
    } catch {
      document.getElementById("resultado").innerText = "Erro de conexão.";
    }
  });
}
