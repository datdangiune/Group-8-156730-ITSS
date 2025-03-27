import Cookies from 'js-cookie';
export async function getTokenFromCookies() {
    Cookies.get("adminToken")
}
export async function adminLogin(email: string, password: string): Promise<{ token: string }> {
    const response = await fetch('http://localhost:3000/api/admin/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, password }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
    }

    const data = await response.json();
    Cookies.set('adminToken', data.token, { expires: 1 });
    return data;
}

export async function adminRegister(username: string, password: string, email: string, name: string): Promise<void> {
    const response = await fetch('http://localhost:3000/api/admin/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, email, name}),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
    }
}

export function adminLogout() {
    Cookies.remove('adminToken'); // Xóa token khỏi cookie
    localStorage.removeItem('admin'); // Xóa thông tin admin khỏi localStorage
}