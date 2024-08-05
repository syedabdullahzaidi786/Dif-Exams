document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('login-btn');
    const userIdInput = document.getElementById('user-id');
    const passwordInput = document.getElementById('password');
    const loginError = document.getElementById('login-error');
    const loginContainer = document.getElementById('login-container');

    // Fetch CSV data and parse it
    async function fetchCSV() {
        const response = await fetch('users.csv');
        const data = await response.text();
        return parseCSV(data);
    }

    function parseCSV(data) {
        const lines = data.trim().split('\n');
        const headers = lines[0].split(',');
        const users = [];

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',');
            const user = {};
            headers.forEach((header, index) => {
                user[header.trim()] = values[index].trim();
            });
            users.push(user);
        }

        return users;
    }

    // Validate user login
    async function validateLogin(userId, password) {
        const users = await fetchCSV();
        return users.find(user => user.id === userId && user.password === password);
    }

    // Event listener for login button
    loginBtn.addEventListener('click', async () => {
        const userId = userIdInput.value.trim();
        const password = passwordInput.value.trim();

        const user = await validateLogin(userId, password);

        if (user) {
            // Store user information in localStorage
            localStorage.setItem('userId', user.id);
            localStorage.setItem('userName', user.name);

            // Redirect to rules page
            window.location.href = 'rules.html';
        } else {
            loginError.classList.remove('hide');
        }
    });

    // Display user info on rules page
    const userIdDisplay = document.getElementById('user-id-display');
    const userNameDisplay = document.getElementById('user-name-display');

    if (userIdDisplay && userNameDisplay) {
        const storedUserId = localStorage.getItem('userId');
        const storedUserName = localStorage.getItem('userName');

        if (storedUserId && storedUserName) {
            userIdDisplay.textContent = storedUserId;
            userNameDisplay.textContent = storedUserName;
        } else {
            // If user info is not available, redirect to login page
            window.location.href = 'index.html';
        }
    }
});
