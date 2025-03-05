const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Login function (allowing email or username)
export const loginUser = async (emailOrUsername, password, navigate) => {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ emailOrUsername, password }),
        });

        const data = await response.json();
        if (!data.success) throw new Error(data.message);

        if (response.ok) {
            // Store data in localStorage
            localStorage.setItem("token", data.data.token);
            localStorage.setItem("user_id", data.data.user_id);
            localStorage.setItem("username", data.data.username); // Store username
            
            // Navigate to dashboard (Ensure navigate is passed as a prop)
            navigate("/dashboard");

        if (!data.success) throw new Error(data.message);

        return data; // Ensure data is returned correctly
        } else {
            return { success: false, message: data.message || "Login failed" };
        }
    } catch (error) {
        console.error("Login error:", error);
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
        console.error("Register error:", error);
        return { success: false, message: `Server Client/Register error: ${error.message}` };
    }
};
