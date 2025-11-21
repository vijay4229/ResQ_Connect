// --- 1. Report Incident ---
document.getElementById('reportForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    const report = {
        type: document.getElementById('incType').value,
        city: document.getElementById('incCity').value,
        location: document.getElementById('incLoc').value,
        description: document.getElementById('incDesc').value
    };

    try {
        const res = await fetch(`${API_BASE}/api/incidents.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(report)
        });
        
        const data = await res.json();
        
        if (data.status === 'success') {
            alert('🚨 Report Sent Successfully! \nAuthorities have been notified of your location.');
            e.target.reset();
        } else {
            alert('Error: ' + data.message);
        }
    } catch (err) {
        console.error(err);
        alert('Network Error: Could not connect to server.');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
});

// --- 2. Load Safe Zones ---
async function loadSafetyPlaces() {
    try {
        const res = await fetch(`${API_BASE}/api/safety_places.php`);
        const data = await res.json();
        
        const container = document.getElementById('citizenSafetyList');
        
        if(data.length === 0) {
            container.innerHTML = '<p class="text-center text-gray-400 text-sm">No safe zones currently listed.</p>';
            return;
        }

        container.innerHTML = data.map(p => `
            <div class="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center group hover:border-green-200 transition">
                <div class="flex items-center gap-3">
                    <div class="bg-green-50 text-green-600 w-10 h-10 rounded-full flex items-center justify-center">
                        <i class="fa-solid fa-shield-halved"></i>
                    </div>
                    <div>
                        <h4 class="font-bold text-gray-800 text-sm">${p.name}</h4>
                        <p class="text-xs text-gray-500">${p.city}</p>
                    </div>
                </div>
                <div class="text-right">
                    <span class="block text-[10px] uppercase font-bold ${p.status === 'Open' ? 'text-green-600' : 'text-red-500'}">
                        ${p.status}
                    </span>
                    <span class="text-[10px] text-gray-400">Cap: ${p.capacity}</span>
                </div>
            </div>
        `).join('');
    } catch (err) { console.error(err); }
}

// --- 3. Load Safety Tips ---
async function loadSafetyTips() {
    try {
        // Ensure you created backend/api/tips.php in previous steps.
        // If not, this will fail gracefully.
        const res = await fetch(`${API_BASE}/api/tips.php`);
        const data = await res.json();
        
        const container = document.getElementById('tipsList');
        
        container.innerHTML = data.map(tip => `
            <div class="flex items-start gap-3 bg-blue-50 p-3 rounded-lg border border-blue-100">
                <i class="fa-solid ${tip.icon || 'fa-circle-info'} text-blue-500 mt-1"></i>
                <div>
                    <h4 class="font-bold text-blue-800 text-sm">${tip.title}</h4>
                    <p class="text-xs text-blue-700 mt-1 leading-relaxed">${tip.content}</p>
                </div>
            </div>
        `).join('');
    } catch (err) { 
        // Fallback if database tips are empty
        document.getElementById('tipsList').innerHTML = `
            <div class="text-center text-gray-400 text-xs p-4">
                Stay calm. Follow local news for updates.
            </div>
        `;
    }
}

// Init
loadSafetyPlaces();
loadSafetyTips();