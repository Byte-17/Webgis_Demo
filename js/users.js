async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

async function verifyUser(username, password) {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const storedHash = users[username];
    return storedHash && storedHash === await hashPassword(password);
}

// 初始化用户数据
(async function() {
    if (!localStorage.getItem('users')) {
        const adminPasswordHash = await hashPassword('webgis123');
        const users = {
            'admin': adminPasswordHash
        };
        localStorage.setItem('users', JSON.stringify(users));
    }
})();