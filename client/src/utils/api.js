const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Login function (allowing email or username)
export const loginUser = async (emailOrUsername, password) => {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ emailOrUsername, password })
        });

        const data = await response.json();

        if (response.ok) {
            return {
                success: true,
                data: data, // Ensure `data` contains token and user_id
            };
        } else {
            return {
                success: false,
                message: data.message || "Login failed",
            };
        }

    } catch (error) {
        return { success: false, message: `Server Client/Login error: ${error.message}` };
    }
};

// Register function
export const registerUser = async (name, email, password) => {
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },  // Fix the content type to `application/json`
            body: JSON.stringify({ name, email, password })
        });

        if (!response.ok) {
            throw new Error('Failed to register');
        }

        return await response.json();
    } catch (error) {
        return { success: false, message: `Server Client/Register error: ${error.message}` };
    }
};
