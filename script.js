/**
 * INVENTORY MANAGEMENT SYSTEM
 */

// --- 1. INITIAL STATE & STORAGE ---
let inventory = JSON.parse(localStorage.getItem('inventory')) || [];
let lowStockFilterActive = false; // Track filter state

// --- 2. ELEMENT SELECTORS ---
const invBody = document.getElementById('inventory-body'); 
const prodForm = document.getElementById('product-form'); 
const fileInput = document.getElementById('csv-file');
const searchInput = document.getElementById('search');

// --- 3. SYSTEM NOTIFICATIONS ---
if (window.Notification && Notification.permission !== "granted") {
    Notification.requestPermission();
}

function sendSystemNotification(name, qty) {
    const msg = qty === 0 
        ? `${name} has been removed (Out of Stock).` 
        : `${name} is running low! Only ${qty} left.`;

    // Desktop System Notification 
    if (window.Notification && Notification.permission === "granted") {
        try {
            new Notification("Stock Alert", {
                body: msg,
                icon: "https://cdn-icons-png.flaticon.com/512/565/565547.png"
            });
        } catch (err) {
            console.log("System notification blocked by mobile OS, using Toast instead.");
        }
    }

    // Trigger In-App Toast Notification
    showToast(msg);
}

/**
 * Creates a visual popup at the top of the screen
 */
function showToast(msg) {
    let container = document.getElementById('toast-container');
    
    // Create container if it doesn't exist
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<strong>⚠️ Alert:</strong> ${msg}`;
    
    container.appendChild(toast);

    // Remove toast after 4 seconds with a fade-out effect
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(-20px)';
        setTimeout(() => toast.remove(), 500);
    }, 4000);
}

// --- 4. CORE RENDER ENGINE ---
function renderInventory(filterText = "") {
    invBody.innerHTML = '';
    let totalVal = 0;
    let alerts = 0;

    // 1. First, creating the filtered list based on Search and Low Stock Toggle
    let displayList = inventory.filter(item => 
        item.name.toLowerCase().includes(filterText.toLowerCase())
    );

    if (lowStockFilterActive) {
        displayList = displayList.filter(item => item.qty <= item.min);
    }

    // 2. calculating stats based ONLY on what is being displayed
    displayList.forEach((item) => {
        totalVal += (item.price * item.qty); // Updates valuation based on search
        
        const isLow = item.qty <= item.min && item.qty > 0;
        if (isLow) alerts++; // Updates alert count based on search

        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${item.name}</strong></td>
            <td>₹${parseFloat(item.price).toFixed(2)}</td>
            <td>
                <div class="qty-control">
                    <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
                    <span class="stock-value" ondblclick="enableManualEdit(this, ${item.id})">
                          ${item.qty}
                    </span>
                    <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
                </div>
            </td>
            <td><span class="badge ${isLow ? 'status-low' : 'status-ok'}">${isLow ? 'LOW' : 'OK'}</span></td>
            <td>
                <button onclick="deleteItem(${item.id})" style="color:#ef4444; background:none; border:none; cursor:pointer;">Delete</button>
            </td>
        `;
        invBody.appendChild(row);
    });

    // 3. Update UI elements with the "Live" values
    document.getElementById('total-val').innerText = `₹${totalVal.toFixed(2)}`;
    document.getElementById('alert-count').innerText = alerts;
    
    const alertCard = document.getElementById('alert-card');
    alertCard.classList.toggle('active-filter', lowStockFilterActive);

    localStorage.setItem('inventory', JSON.stringify(inventory));
}

// --- 5. FILTER TOGGLE LOGIC ---
window.toggleLowStockFilter = () => {
    lowStockFilterActive = !lowStockFilterActive;
    renderInventory(searchInput.value);
};

// --- 6. STOCK LOGIC (AUTO-DELETE & MANUAL EDIT) ---
window.changeQty = (id, amount) => {
    const index = inventory.findIndex(p => p.id === id);
    if (index !== -1) {
        const item = inventory[index];
        const wasAboveMin = item.qty > item.min
        
        item.qty = Math.max(0, item.qty + amount);

        if (item.qty === 0) {
            sendSystemNotification(item.name, 0);
            inventory.splice(index, 1);
        } else if (wasAboveMin && item.qty <= item.min) {
            sendSystemNotification(item.name, item.qty);
        }
        renderInventory(searchInput.value);
    }
};

window.enableManualEdit = (element, id) => {
    const currentValue = element.innerText;
    const input = document.createElement('input');
    input.type = 'number';
    input.value = currentValue;
    input.style.width = '60px';
    input.style.textAlign = 'center'
    input.className = 'manual-edit-input';

    const saveManualValue = () => {
        const newValue = parseInt(input.value);
        if (!isNaN(newValue)) {
            const item = inventory.find(p => p.id === id);
            if (item) {
                if (newValue <= 0) {
                    inventory = inventory.filter(p => p.id !== id);
                    sendSystemNotification(item.name, 0);
                } else {
                    item.qty = newValue;
                    if (newValue <= item.min) {
                        sendSystemNotification(item.name, newValue);
                    }
                }
            }
        }
        renderInventory(searchInput.value)
    };

    input.onblur = saveManualValue;
    input.onkeydown = (e) => { if (e.key === 'Enter') saveManualValue(); };
    element.replaceWith(input);
    input.focus();
};

// --- 7. EVENT HANDLERS ---
prodForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newItem = {
        id: Date.now(),
        name: document.getElementById('p-name').value,
        price: parseFloat(document.getElementById('p-price').value),
        qty: parseInt(document.getElementById('p-qty').value),
        min: parseInt(document.getElementById('p-min').value)
    };
    if ((newItem.qty > 0) && (newItem.price > 0) && (newItem.min < newItem.qty)) {
        inventory.push(newItem);
    } else {
        if (newItem.qty <= 0) {
            alert("Initial stock must be greater than zero.");
        }
        if (newItem.price <= 0) {
            alert("Price must be greater than zero")
        }
        if (newItem.min > newItem.qty) {
            alert("Threshold cannot be greater than current stock");
        }
    }
    prodForm.reset();
    renderInventory(searchInput.value);
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const reader = new FileReader()
    reader.onload = (event) => {
        const rows = event.target.result.split('\n').slice(1);
        rows.forEach((row, i) => {
            const cols = row.split(',');
            if (cols.length >= 4 && cols[0].trim()) {
                const q = parseInt(cols[2]) || 0;
                if (q > 0) {
                    inventory.push({
                        id: Date.now() + i,
                        name: cols[0].trim(),
                        price: parseFloat(cols[1]) || 0,
                        qty: q,
                        min: parseInt(cols[3]) || 0
                    });
                }
            }
        });
        renderInventory(searchInput.value);
    };
    reader.readAsText(file);
});

window.resetInventory = () => {
    if (confirm("Reset everything?")) {
        inventory = [];
        localStorage.removeItem('inventory');
        renderInventory();
    }
};

window.deleteItem = (id) => {
    inventory = inventory.filter(p => p.id !== id);
    renderInventory(searchInput.value);
};

searchInput.addEventListener('input', (e) => renderInventory(e.target.value));

renderInventory();