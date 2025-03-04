const API_URL = import.meta.env.REACT_APP_API_URL || `http://localhost:5000`;

// Login function (allowing email or username)
export const loginUser = async (emailOrUsername, password) => {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ emailOrUsername, password })
        });

        return await response.json();
    } catch (error) {
        return { success: false, message: `Server Client/Login error: ${error.message}` }
    }
};

// Register function
export const registerUser = async (name, email, password) => {
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/JSON' },
            body: JSON.stringify({ name, email, password })
        })

        return await response.json();
    } catch (error) {
        return { success: false, message: `Server Client/Register error: ${error.message}` }
    }
};