// Admin password (change this to your desired password)
const ADMIN_PASSWORD = "discord123";

// DOM Elements
const adminBtn = document.getElementById('adminBtn');
const adminPanel = document.getElementById('adminPanel');
const adminPassword = document.getElementById('adminPassword');
const submitPassword = document.getElementById('submitPassword');
const adminControls = document.getElementById('adminControls');
const addEntryBtn = document.getElementById('addEntry');
const clearDataBtn = document.getElementById('clearData');
const leaderInput = document.getElementById('leader');
const support1Input = document.getElementById('support1');
const support2Input = document.getElementById('support2');
const leaderList = document.getElementById('leaderList');

// State
let isAdmin = false;

// Initialize the app
function init() {
    loadEntries();
    setupEventListeners();
}

// Set up event listeners
function setupEventListeners() {
    adminBtn.addEventListener('click', toggleAdminPanel);
    submitPassword.addEventListener('click', authenticateAdmin);
    addEntryBtn.addEventListener('click', addNewEntry);
    clearDataBtn.addEventListener('click', clearAllData);
}

// Toggle admin panel visibility
function toggleAdminPanel() {
    adminPanel.classList.toggle('hidden');
    if (adminPanel.classList.contains('hidden')) {
        isAdmin = false;
        adminControls.classList.add('hidden');
        adminPassword.value = '';
    }
}

// Authenticate admin
function authenticateAdmin() {
    if (adminPassword.value === ADMIN_PASSWORD) {
        isAdmin = true;
        adminControls.classList.remove('hidden');
        adminPassword.value = '';
    } else {
        alert('Incorrect password!');
        adminPassword.value = '';
    }
}

// Add new entry
function addNewEntry() {
    const leader = leaderInput.value.trim();
    const support1 = support1Input.value.trim();
    const support2 = support2Input.value.trim();
    
    if (!leader || !support1 || !support2) {
        alert('Please fill in all fields!');
        return;
    }
    
    const today = new Date();
    const dateString = today.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    });
    
    const entry = {
        date: dateString,
        timestamp: today.getTime(),
        leader,
        support1,
        support2
    };
    
    // Get existing entries or initialize empty array
    const entries = JSON.parse(localStorage.getItem('leaderEntries')) || [];
    
    // Check if entry already exists for today
    const todayEntryIndex = entries.findIndex(e => {
        const entryDate = new Date(e.timestamp);
        return (
            entryDate.getDate() === today.getDate() &&
            entryDate.getMonth() === today.getMonth() &&
            entryDate.getFullYear() === today.getFullYear()
        );
    });
    
    if (todayEntryIndex !== -1) {
        // Update existing entry
        entries[todayEntryIndex] = entry;
    } else {
        // Add new entry
        entries.push(entry);
    }
    
    // Sort entries by date (newest first)
    entries.sort((a, b) => b.timestamp - a.timestamp);
    
    // Save to localStorage
    localStorage.setItem('leaderEntries', JSON.stringify(entries));
    
    // Clear inputs
    leaderInput.value = '';
    support1Input.value = '';
    support2Input.value = '';
    
    // Refresh the display
    loadEntries();
}

// Load entries from storage
function loadEntries() {
    const entries = JSON.parse(localStorage.getItem('leaderEntries')) || [];
    leaderList.innerHTML = '';
    
    if (entries.length === 0) {
        leaderList.innerHTML = '<p class="no-entries">No entries yet. Check back later!</p>';
        return;
    }
    
    entries.forEach((entry, index) => {
        const entryElement = document.createElement('div');
        entryElement.className = 'leader-entry';
        
        entryElement.innerHTML = `
            <div class="entry-date">${entry.date}</div>
            <div class="entry-content">
                <div class="entry-leader">Leader: ${entry.leader}</div>
                <div class="entry-support">Support 1: ${entry.support1}</div>
                <div class="entry-support">Support 2: ${entry.support2}</div>
            </div>
            ${isAdmin ? `<button class="delete-btn" data-index="${index}">Delete</button>` : ''}
        `;
        
        leaderList.appendChild(entryElement);
    });
    
    // Add event listeners to delete buttons if admin
    if (isAdmin) {
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', deleteEntry);
        });
    }
}

// Delete an entry
function deleteEntry(e) {
    if (!isAdmin) return;
    
    if (!confirm('Are you sure you want to delete this entry?')) {
        return;
    }
    
    const index = parseInt(e.target.getAttribute('data-index'));
    const entries = JSON.parse(localStorage.getItem('leaderEntries')) || [];
    
    if (index >= 0 && index < entries.length) {
        entries.splice(index, 1);
        localStorage.setItem('leaderEntries', JSON.stringify(entries));
        loadEntries();
    }
}

// Clear all data
function clearAllData() {
    if (!isAdmin) return;
    
    if (!confirm('Are you sure you want to delete ALL entries? This cannot be undone!')) {
        return;
    }
    
    localStorage.removeItem('leaderEntries');
    loadEntries();
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);
