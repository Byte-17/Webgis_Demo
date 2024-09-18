document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (await verifyUser(username, password)) {
        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = 'main_page.html'; // 确保登录成功后跳转到main_page.html
    } else {
        alert('用户名或密码错误');
    }
});