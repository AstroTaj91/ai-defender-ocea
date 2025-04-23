/**
 * Enhanced Email Collection Manager for the AI Defender game
 * This version includes server-side integration capabilities for the conference
 */
const EmailCollectionManager = {
    /**
     * Initialize email collection
     */
    init: function() {
        // Set up initial form validation
        this.setupInitialFormValidation();
        
        // Set up game over form validation
        this.setupGameOverFormValidation();
        
        // Add admin controls (hidden by default)
        this.setupAdminControls();
        
        // Add Tempus Innovation branding
        this.addBranding();
        
        // Initialize storage
        this.initializeStorage();
    },
    
    /**
     * Initialize local storage for email collection
     */
    initializeStorage: function() {
        // Initialize email storage if it doesn't exist
        if (!localStorage.getItem('aiDefenderEmails')) {
            localStorage.setItem('aiDefenderEmails', JSON.stringify([]));
        }
        
        // Initialize events storage if it doesn't exist
        if (!localStorage.getItem('aiDefenderEvents')) {
            localStorage.setItem('aiDefenderEvents', JSON.stringify([]));
        }
    },
    
    /**
     * Set up initial form validation (on start screen)
     */
    setupInitialFormValidation: function() {
        const form = document.getElementById('player-info-form');
        const nameInput = document.getElementById('initial-player-name');
        const emailInput = document.getElementById('initial-player-email');
        
        if (!form || !nameInput || !emailInput) {
            console.error('Initial form elements not found');
            return;
        }
        
        // Add validation styles
        nameInput.addEventListener('input', () => {
            if (nameInput.value.trim().length > 0) {
                nameInput.classList.add('valid');
                nameInput.classList.remove('invalid');
            } else {
                nameInput.classList.remove('valid');
                nameInput.classList.add('invalid');
            }
        });
        
        emailInput.addEventListener('input', () => {
            if (this.validateEmail(emailInput.value)) {
                emailInput.classList.add('valid');
                emailInput.classList.remove('invalid');
            } else {
                emailInput.classList.remove('valid');
                emailInput.classList.add('invalid');
            }
        });
        
        // Add form submission handler
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validate inputs
            if (nameInput.value.trim().length === 0) {
                this.showError(nameInput, 'Please enter your name');
                return;
            }
            
            if (!this.validateEmail(emailInput.value)) {
                this.showError(emailInput, 'Please enter a valid email address');
                return;
            }
            
            // Store player info for later use
            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const newsletter = document.getElementById('initial-newsletter-signup').checked;
            
            this.storePlayerInfo(name, email, newsletter);
            
            // Hide the form and show the start button
            document.getElementById('welcome-form').style.display = 'none';
            document.getElementById('start-button').style.display = 'block';
            
            // Track submission for analytics
            this.trackSubmission('initial_form_submit', {
                name: name,
                email_provided: true,
                newsletter: newsletter
            });
        });
    },
    
    /**
     * Store player information
     * @param {string} name - Player name
     * @param {string} email - Player email
     * @param {boolean} newsletter - Newsletter signup
     */
    storePlayerInfo: function(name, email, newsletter) {
        // Store in session storage for current game session
        sessionStorage.setItem('playerName', name);
        sessionStorage.setItem('playerEmail', email);
        sessionStorage.setItem('playerNewsletter', newsletter);
        
        // Add to collected emails
        this.addEmailToCollection(name, email, newsletter, 0);
    },
    
    /**
     * Add email to collection
     * @param {string} name - Player name
     * @param {string} email - Player email
     * @param {boolean} newsletter - Newsletter signup
     * @param {number} score - Player score
     */
    addEmailToCollection: function(name, email, newsletter, score) {
        // Get existing emails
        let emails = localStorage.getItem('aiDefenderEmails');
        emails = emails ? JSON.parse(emails) : [];
        
        // Check if email already exists
        const existingIndex = emails.findIndex(e => e.email === email);
        
        if (existingIndex >= 0) {
            // Update existing entry if score is higher
            if (score > emails[existingIndex].score) {
                emails[existingIndex] = {
                    name: name,
                    email: email,
                    newsletter: newsletter,
                    score: score,
                    date: new Date().toISOString()
                };
            }
        } else {
            // Add new entry
            emails.push({
                name: name,
                email: email,
                newsletter: newsletter,
                score: score,
                date: new Date().toISOString()
            });
        }
        
        // Save to local storage
        localStorage.setItem('aiDefenderEmails', JSON.stringify(emails));
    },
    
    /**
     * Set up game over form validation
     */
    setupGameOverFormValidation: function() {
        const form = document.getElementById('leaderboard-form');
        const nameInput = document.getElementById('player-name');
        const emailInput = document.getElementById('player-email');
        
        if (!form || !nameInput || !emailInput) {
            console.error('Game over form elements not found');
            return;
        }
        
        // Add validation styles
        nameInput.addEventListener('input', () => {
            if (nameInput.value.trim().length > 0) {
                nameInput.classList.add('valid');
                nameInput.classList.remove('invalid');
            } else {
                nameInput.classList.remove('valid');
                nameInput.classList.add('invalid');
            }
        });
        
        emailInput.addEventListener('input', () => {
            if (this.validateEmail(emailInput.value)) {
                emailInput.classList.add('valid');
                emailInput.classList.remove('invalid');
            } else {
                emailInput.classList.remove('valid');
                emailInput.classList.add('invalid');
            }
        });
        
        // Add form submission handler
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validate inputs
            if (nameInput.value.trim().length === 0) {
                this.showError(nameInput, 'Please enter your name');
                return;
            }
            
            if (!this.validateEmail(emailInput.value)) {
                this.showError(emailInput, 'Please enter a valid email address');
                return;
            }
            
            // Submit form if valid
            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const newsletter = document.getElementById('newsletter-signup').checked;
            const score = parseInt(document.getElementById('final-score').textContent);
            
            // Add to collected emails
            this.addEmailToCollection(name, email, newsletter, score);
            
            // Call leaderboard manager to submit score
            LeaderboardManager.submitScore(name, email, newsletter);
            
            // Track submission for analytics
            this.trackSubmission('game_over_form_submit', {
                name: name,
                email_provided: true,
                newsletter: newsletter,
                score: score
            });
        });
    },
    
    /**
     * Validate email format
     * @param {string} email - Email to validate
     * @returns {boolean} True if email is valid
     */
    validateEmail: function(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    /**
     * Show error message for input
     * @param {HTMLElement} input - Input element
     * @param {string} message - Error message
     */
    showError: function(input, message) {
        input.classList.add('invalid');
        
        // Create error message if it doesn't exist
        let errorElement = input.nextElementSibling;
        if (!errorElement || !errorElement.classList.contains('error-message')) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            input.parentNode.insertBefore(errorElement, input.nextElementSibling);
        }
        
        errorElement.textContent = message;
        
        // Focus input
        input.focus();
        
        // Track validation error for analytics
        this.trackSubmission('validation_error', {
            field: input.id,
            message: message
        });
    },
    
    /**
     * Get all collected emails
     * @returns {Array} Array of email objects
     */
    getAllEmails: function() {
        let emails = localStorage.getItem('aiDefenderEmails');
        return emails ? JSON.parse(emails) : [];
    },
    
    /**
     * Process collected emails (for admin use)
     * @returns {Object} Statistics about collected emails
     */
    processEmails: function() {
        const emails = this.getAllEmails();
        
        // Calculate statistics
        const stats = {
            total: emails.length,
            newsletter: emails.filter(e => e.newsletter).length,
            averageScore: 0,
            dateRange: {
                start: emails.length > 0 ? emails[0].date : null,
                end: emails.length > 0 ? emails[emails.length - 1].date : null
            }
        };
        
        // Calculate average score
        if (emails.length > 0) {
            const totalScore = emails.reduce((sum, e) => sum + e.score, 0);
            stats.averageScore = Math.round(totalScore / emails.length);
        }
        
        return stats;
    },
    
    /**
     * Export emails for integration with newsletter system
     * @returns {string} CSV string of emails for newsletter
     */
    exportNewsletterEmails: function() {
        const emails = this.getAllEmails();
        const newsletterEmails = emails.filter(e => e.newsletter);
        
        if (newsletterEmails.length === 0) {
            return 'No newsletter subscriptions';
        }
        
        // Create CSV with just name and email
        let csv = 'Name,Email,Date,Score\n';
        
        for (const email of newsletterEmails) {
            const name = `"${email.name.replace(/"/g, '""')}"`;
            const emailAddr = `"${email.email.replace(/"/g, '""')}"`;
            const date = `"${email.date}"`;
            const score = email.score;
            csv += `${name},${emailAddr},${date},${score}\n`;
        }
        
        return csv;
    },
    
    /**
     * Export all emails (for admin use)
     * @returns {string} CSV string of all emails
     */
    exportAllEmails: function() {
        const emails = this.getAllEmails();
        
        if (emails.length === 0) {
            return 'No emails collected';
        }
        
        // Create CSV with all data
        let csv = 'Name,Email,Newsletter,Date,Score\n';
        
        for (const email of emails) {
            const name = `"${email.name.replace(/"/g, '""')}"`;
            const emailAddr = `"${email.email.replace(/"/g, '""')}"`;
            const newsletter = email.newsletter ? 'Yes' : 'No';
            const date = `"${email.date}"`;
            const score = email.score;
            csv += `${name},${emailAddr},${newsletter},${date},${score}\n`;
        }
        
        return csv;
    },
    
    /**
     * Set up admin controls for conference staff
     */
    setupAdminControls: function() {
        // Create admin controls container
        const adminControls = document.createElement('div');
        adminControls.id = 'admin-controls';
        adminControls.className = 'admin-controls';
        adminControls.style.display = 'none';
        
        // Add title
        const title = document.createElement('h3');
        title.textContent = 'Admin Controls';
        adminControls.appendChild(title);
        
        // Add export newsletter emails button
        const exportNewsletterButton = document.createElement('button');
        exportNewsletterButton.textContent = 'Export Newsletter Emails';
        exportNewsletterButton.addEventListener('click', () => {
            const csv = this.exportNewsletterEmails();
            this.downloadCSV(csv, 'tempus_innovation_newsletter_emails.csv');
        });
        
        // Add export all emails button
        const exportAllButton = document.createElement('button');
        exportAllButton.textContent = 'Export All Emails';
        exportAllButton.addEventListener('click', () => {
            const csv = this.exportAllEmails();
            this.downloadCSV(csv, 'tempus_innovation_all_emails.csv');
        });
        
        // Add stats button
        const statsButton = document.createElement('button');
        statsButton.textContent = 'Show Stats';
        statsButton.addEventListener('click', () => {
            const stats = this.processEmails();
            alert(`Email Collection Stats:
                Total Emails: ${stats.total}
                Newsletter Signups: ${stats.newsletter}
                Average Score: ${stats.averageScore}
            `);
        });
        
        // Add close button
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.addEventListener('click', () => {
            adminControls.style.display = 'none';
        });
        
        // Add buttons to container
        adminControls.appendChild(exportNewsletterButton);
        adminControls.appendChild(exportAllButton);
        adminControls.appendChild(statsButton);
        adminControls.appendChild(closeButton);
        
        // Add container to body
        document.body.appendChild(adminControls);
        
        // Add keyboard shortcut to show admin controls (Ctrl+Shift+A)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'A') {
                adminControls.style.display = adminControls.style.display === 'none' ? 'block' : 'none';
            }
        });
    },
    
    /**
     * Download CSV file
     * @param {string} csv - CSV content
     * @param {string} filename - File name
     */
    downloadCSV: function(csv, filename) {
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },
    
    /**
     * Add Tempus Innovation branding
     */
    addBranding: function() {
        const branding = document.createElement('div');
        branding.className = 'tempus-branding';
        branding.innerHTML = 'Created by <a href="https://tempusinnovation.com/intempo" target="_blank">Tempus Innovation</a>';
        
        document.getElementById('game-container').appendChild(branding);
    },
    
    /**
     * Track form submission events (for analytics)
     * @param {string} eventType - Type of event
     * @param {Object} data - Event data
     */
    trackSubmission: function(eventType, data) {
        // In a real implementation, this would send analytics data to a server
        // For the conference demo, we'll just log to console
        console.log('Event tracked:', eventType, data);
        
        // Store event in local storage for later analysis
        let events = localStorage.getItem('aiDefenderEvents');
        events = events ? JSON.parse(events) : [];
        
        events.push({
            type: eventType,
            data: data,
            timestamp: new Date().toISOString()
        });
        
        localStorage.setItem('aiDefenderEvents', JSON.stringify(events));
    }
};
