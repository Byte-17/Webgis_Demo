document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (await verifyUser(username, password)) {
        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = 'index.html'; // 登录成功，跳转到主页
    } else {
        alert('用户名或密码错误');
    }
});