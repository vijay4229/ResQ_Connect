document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;
    const confirm = document.getElementById('regConfirmPassword').value;
    const msg = document.getElementById('regMsg');

    // 1. Client-side validation
    if (password !== confirm) {
        msg.textContent = "Passwords do not match!";
        msg.className = "text-center mt-4 text-sm text-red-500";
        msg.classList.remove('hidden');
        return;
    }

    try {
        // 2. Send to Backend
        const response = await fetch(`${API_BASE}/auth/register.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();

        if (data.status === 'success') {
            msg.textContent = "Registration Successful! Redirecting...";
            msg.className = "text-center mt-4 text-sm text-green-600 font-bold";
            msg.classList.remove('hidden');
            
            // Wait 1.5 seconds then go to login
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            msg.textContent = data.message;
            msg.className = "text-center mt-4 text-sm text-red-500";
            msg.classList.remove('hidden');
        }
    } catch (err) {
        console.error(err);
        msg.textContent = "Connection Error";
        msg.classList.remove('hidden');
    }
});