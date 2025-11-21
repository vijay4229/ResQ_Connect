// Global Chart Instance
let incidentChart = null;

// --- 1. Fetch & Render Dashboard Data ---
async function loadDashboard() {
    try {
        const res = await fetch(`${API_BASE}/api/incidents.php`);
        const incidents = await res.json();
        
        // A. Update Stats Cards
        const pendingCount = incidents.filter(i => i.status === 'Pending').length;
        const resolvedCount = incidents.filter(i => i.status === 'Resolved' || i.status === 'Rescue Sent').length;
        
        document.getElementById('stat-pending').innerText = pendingCount;
        document.getElementById('stat-resolved').innerText = resolvedCount;

        // B. Render Chart
        renderChart(incidents);

        // C. Render Incident List
        const list = document.getElementById('incidentList');
        if(incidents.length === 0) {
            list.innerHTML = '<p class="text-center text-gray-400 py-4">System secure. No active threats.</p>';
            return;
        }

        list.innerHTML = incidents.map(inc => `
            <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between gap-4 hover:shadow-md transition group">
                
                <div class="flex gap-4">
                    <div class="flex-shrink-0">
                        <div class="w-12 h-12 rounded-full flex items-center justify-center ${getIconColor(inc.type)}">
                            <i class="fa-solid ${getIcon(inc.type)} text-xl"></i>
                        </div>
                    </div>
                    <div>
                        <div class="flex items-center gap-2 mb-1">
                            <span class="text-xs font-bold uppercase px-2 py-0.5 rounded ${getStatusBadge(inc.status)}">
                                ${inc.status}
                            </span>
                            <span class="text-xs text-gray-400"><i class="fa-regular fa-clock"></i> ${inc.reported_at}</span>
                        </div>
                        <h4 class="font-bold text-gray-800 text-lg">${inc.type}</h4>
                        <p class="text-sm text-gray-600"><i class="fa-solid fa-location-dot text-red-400"></i> ${inc.city} - ${inc.location}</p>
                        <p class="text-sm text-gray-500 mt-1 italic">"${inc.description}"</p>
                    </div>
                </div>

                <div class="flex items-center gap-2 self-start md:self-center">
                    ${inc.status === 'Pending' ? `
                        <button onclick="updateStatus(${inc.id}, 'Rescue Sent')" class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-bold shadow hover:-translate-y-0.5 transition">
                            <i class="fa-solid fa-truck-medical"></i> Deploy
                        </button>
                        <button onclick="updateStatus(${inc.id}, 'Resolved')" class="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-xs font-bold shadow hover:-translate-y-0.5 transition">
                            <i class="fa-solid fa-check"></i> Resolve
                        </button>
                    ` : `
                        <span class="text-gray-300 font-bold text-2xl"><i class="fa-solid fa-circle-check"></i></span>
                    `}
                </div>
            </div>
        `).join('');

    } catch (err) {
        console.error("Dashboard Error:", err);
    }
}

// --- 2. Chart.js Logic ---
function renderChart(data) {
    const ctx = document.getElementById('incidentChart').getContext('2d');
    
    // Count types (Flood: 2, Fire: 1, etc.)
    const counts = {};
    data.forEach(item => { counts[item.type] = (counts[item.type] || 0) + 1; });

    if (incidentChart) incidentChart.destroy(); // Destroy old chart to avoid overlapping

    incidentChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(counts),
            datasets: [{
                data: Object.values(counts),
                backgroundColor: ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#6366F1'],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'right', labels: { usePointStyle: true, font: { size: 10 } } }
            }
        }
    });
}

// --- 3. Action Handlers ---

// Update Incident Status
async function updateStatus(id, newStatus) {
    if(!confirm(`Update status to "${newStatus}"?`)) return;

    try {
        const res = await fetch(`${API_BASE}/api/incidents.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'update_status', id: id, status: newStatus })
        });
        loadDashboard(); // Refresh UI immediately
    } catch (err) { console.error(err); }
}

// Load Safety Places
async function loadSafetyPlaces() {
    const res = await fetch(`${API_BASE}/api/safety_places.php`);
    const data = await res.json();
    const list = document.getElementById('safetyList');
    
    list.innerHTML = data.map(p => `
        <li class="flex justify-between items-center p-2 border-b border-gray-100 last:border-0">
            <div>
                <p class="font-bold text-sm text-gray-700">${p.name}</p>
                <p class="text-xs text-gray-500">${p.city}</p>
            </div>
            <span class="text-xs font-bold px-2 py-1 rounded-full ${p.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">
                ${p.status}
            </span>
        </li>
    `).join('');
}

// Add Safety Place Form
document.getElementById('safetyForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const place = {
        name: document.getElementById('placeName').value,
        city: document.getElementById('placeCity').value,
        capacity: document.getElementById('placeCap').value,
        status: 'Open'
    };

    await fetch(`${API_BASE}/api/safety_places.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(place)
    });

    e.target.reset();
    loadSafetyPlaces();
});

// Helpers
function getIcon(type) {
    const map = { 'Fire': 'fa-fire', 'Flood': 'fa-water', 'Earthquake': 'fa-house-crack', 'Medical': 'fa-truck-medical' };
    return map[type] || 'fa-triangle-exclamation';
}
function getIconColor(type) {
    const map = { 'Fire': 'bg-orange-100 text-orange-600', 'Flood': 'bg-blue-100 text-blue-600', 'Earthquake': 'bg-amber-100 text-amber-700' };
    return map[type] || 'bg-gray-100 text-gray-600';
}
function getStatusBadge(status) {
    return status === 'Pending' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600';
}

// Init
loadDashboard();
loadSafetyPlaces();
setInterval(loadDashboard, 5000); // Real-time refresh