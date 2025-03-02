document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('guestbook-form');
    const entriesList = document.getElementById('entries-list');
    
    // Fetch and display existing entries
    fetchEntries();
    
    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const nameInput = document.getElementById('name');
        const messageInput = document.getElementById('message');
        
        const name = nameInput.value.trim();
        const message = messageInput.value.trim();
        
        if (!name || !message) {
            alert('Please fill in all fields');
            return;
        }
        
        try {
            const response = await fetch('/api/entries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, message })
            });
            
            if (!response.ok) {
                throw new Error('Failed to submit entry');
            }
            
            // Clear form
            nameInput.value = '';
            messageInput.value = '';
            
            // Refresh entries
            fetchEntries();
            
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    });
    
    // Function to fetch and display entries
    async function fetchEntries() {
        try {
            const response = await fetch('/api/entries');
            if (!response.ok) {
                throw new Error('Failed to fetch entries');
            }
            
            const entries = await response.json();
            displayEntries(entries);
            
        } catch (error) {
            console.error('Error:', error);
            entriesList.innerHTML = '<p>Failed to load entries. Please try again later.</p>';
        }
    }
    
    // Function to display entries
    function displayEntries(entries) {
        if (entries.length === 0) {
            entriesList.innerHTML = '<p>No entries yet. Be the first to leave a message!</p>';
            return;
        }
        
        // Sort entries by date (newest first)
        entries.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        entriesList.innerHTML = entries.map(entry => {
            const date = new Date(entry.date).toLocaleString();
            return `
                <div class="entry">
                    <div class="entry-header">
                        <span class="entry-name">${escapeHtml(entry.name)}</span>
                        <span class="entry-date">${date}</span>
                    </div>
                    <div class="entry-message">${escapeHtml(entry.message)}</div>
                </div>
            `;
        }).join('');
    }
    
    // Helper function to escape HTML
    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
    
    // Check if version is set in environment
    fetch('/api/entries')
        .then(response => {
            // Just to trigger the server log that shows the version
        })
        .catch(error => console.error('Error:', error));
});