/**
 * Enhanced Leaderboard Manager for the AI Defender game
 * This version includes improved functionality for the conference setting
 */
const LeaderboardManager = {
    /**
     * Initialize leaderboard
     */
    init: function() {
        // Initialize scores array
        this.scores = this.loadScores();
        
        // Update leaderboard display
        UIManager.updateLeaderboard(this.scores);
        
        // Add conference-specific functionality
        this.setupConferenceMode();
    },
    
    /**
     * Load scores from local storage
     * @returns {Array} Array of score objects
     */
    loadScores: function() {
        const savedScores = localStorage.getItem('aiDefenderScores');
        return savedScores ? JSON.parse(savedScores) : [];
    },
    
    /**
     * Save scores to local storage
     */
    saveScores: function() {
        localStorage.setItem('aiDefenderScores', JSON.stringify(this.scores));
    },
    
    /**
     * Check if score is a high score
     * @param {number} score - Score to check
     * @returns {boolean} True if score is a high score
     */
    isHighScore: function(score) {
        // Always a high score if less than 10 scores
        if (this.scores.length < 10) {
            return true;
        }
        
        // Check if score is higher than lowest score
        return score > this.scores[this.scores.length - 1].score;
    },
    
    /**
     * Add score to leaderboard
     * @param {string} name - Player name
     * @param {number} score - Player score
     */
    addScore: function(name, score) {
        // Create score object
        const scoreObj = {
            name: name,
            score: score,
            date: new Date().toISOString(),
            isConference: this.isConferenceMode
        };
        
        // Add to scores array
        this.scores.push(scoreObj);
        
        // Sort scores (highest first)
        this.scores.sort((a, b) => b.score - a.score);
        
        // Limit to top 10 scores
        if (this.scores.length > 10) {
            this.scores = this.scores.slice(0, 10);
        }
        
        // Save scores
        this.saveScores();
        
        // Update leaderboard display
        UIManager.updateLeaderboard(this.getFilteredScores());
    },
    
    /**
     * Submit score to leaderboard and collect email
     * @param {string} name - Player name
     * @param {string} email - Player email
     * @param {boolean} newsletter - Whether player wants to subscribe to newsletter
     */
    submitScore: function(name, email, newsletter) {
        // Add score to leaderboard
        this.addScore(name, Game.player.score);
        
        // Send email to server
        this.collectEmail(name, email, newsletter, Game.player.score);
        
        // Hide high score form
        document.getElementById('high-score-form').style.display = 'none';
        
        // Show thank you message
        const thankYouMessage = document.createElement('div');
        thankYouMessage.className = 'thank-you-message';
        thankYouMessage.innerHTML = `
            <h3>Thank you, ${name}!</h3>
            <p>Your score has been submitted to the leaderboard.</p>
            ${newsletter ? '<p>You have been subscribed to Tempus Innovation\'s AI newsletter.</p>' : ''}
            <p>Learn more about our AI workshops at <a href="https://tempusinnovation.com/intempo" target="_blank">tempusinnovation.com/intempo</a></p>
        `;
        
        // Insert before leaderboard
        const leaderboard = document.getElementById('leaderboard');
        leaderboard.parentNode.insertBefore(thankYouMessage, leaderboard);
    },
    
    /**
     * Collect email for newsletter
     * @param {string} name - Player name
     * @param {string} email - Player email
     * @param {boolean} newsletter - Whether player wants to subscribe to newsletter
     * @param {number} score - Player score
     */
    collectEmail: function(name, email, newsletter, score) {
        // Create email data object
        const emailData = {
            name: name,
            email: email,
            newsletter: newsletter,
            score: score,
            date: new Date().toISOString(),
            game: 'AI Defender',
            event: 'OCEA Spring Conference 2025',
            isConference: this.isConferenceMode
        };
        
        // Get existing email list or create new one
        let emailList = localStorage.getItem('aiDefenderEmails');
        emailList = emailList ? JSON.parse(emailList) : [];
        
        // Add new email data
        emailList.push(emailData);
        
        // Save to local storage
        localStorage.setItem('aiDefenderEmails', JSON.stringify(emailList));
        
        console.log('Email collected:', emailData);
        
        // In the final implementation, this would be replaced with an API call
        // to send the email data to Tempus Innovation's server
    },
    
    /**
     * Get collected emails (for admin use)
     * @returns {Array} Array of email data objects
     */
    getCollectedEmails: function() {
        const emailList = localStorage.getItem('aiDefenderEmails');
        return emailList ? JSON.parse(emailList) : [];
    },
    
    /**
     * Export collected emails as CSV (for admin use)
     * @returns {string} CSV string of collected emails
     */
    exportEmailsCSV: function() {
        const emails = this.getCollectedEmails();
        
        if (emails.length === 0) {
            return 'No emails collected';
        }
        
        // Create CSV header
        const headers = Object.keys(emails[0]);
        let csv = headers.join(',') + '\n';
        
        // Add rows
        for (const email of emails) {
            const row = headers.map(header => {
                // Wrap values in quotes and escape quotes
                const value = email[header].toString();
                return `"${value.replace(/"/g, '""')}"`;
            });
            
            csv += row.join(',') + '\n';
        }
        
        return csv;
    },
    
    /**
     * Set up conference-specific functionality
     */
    setupConferenceMode: function() {
        // Set conference mode flag
        this.isConferenceMode = true;
        
        // Add conference date to leaderboard title
        const leaderboardTitle = document.querySelector('#leaderboard h3');
        if (leaderboardTitle) {
            leaderboardTitle.textContent = 'OCEA Conference Leaderboard';
        }
        
        // Add filter options for conference vs all-time scores
        this.addLeaderboardFilters();
        
        // Add daily reset functionality for conference
        this.setupDailyReset();
    },
    
    /**
     * Add leaderboard filter options
     */
    addLeaderboardFilters: function() {
        // Create filter container
        const filterContainer = document.createElement('div');
        filterContainer.className = 'leaderboard-filters';
        filterContainer.style.marginBottom = '10px';
        
        // Create filter buttons
        const conferenceButton = document.createElement('button');
        conferenceButton.textContent = 'Conference';
        conferenceButton.className = 'active';
        conferenceButton.style.marginRight = '5px';
        conferenceButton.style.padding = '5px 10px';
        conferenceButton.style.backgroundColor = '#4a90e2';
        conferenceButton.style.border = 'none';
        conferenceButton.style.borderRadius = '3px';
        conferenceButton.style.color = 'white';
        conferenceButton.style.cursor = 'pointer';
        
        const allTimeButton = document.createElement('button');
        allTimeButton.textContent = 'All Time';
        allTimeButton.style.padding = '5px 10px';
        allTimeButton.style.backgroundColor = '#333';
        allTimeButton.style.border = 'none';
        allTimeButton.style.borderRadius = '3px';
        allTimeButton.style.color = 'white';
        allTimeButton.style.cursor = 'pointer';
        
        // Add click handlers
        conferenceButton.addEventListener('click', () => {
            conferenceButton.className = 'active';
            conferenceButton.style.backgroundColor = '#4a90e2';
            allTimeButton.className = '';
            allTimeButton.style.backgroundColor = '#333';
            this.currentFilter = 'conference';
            UIManager.updateLeaderboard(this.getFilteredScores());
        });
        
        allTimeButton.addEventListener('click', () => {
            allTimeButton.className = 'active';
            allTimeButton.style.backgroundColor = '#4a90e2';
            conferenceButton.className = '';
            conferenceButton.style.backgroundColor = '#333';
            this.currentFilter = 'allTime';
            UIManager.updateLeaderboard(this.getFilteredScores());
        });
        
        // Add buttons to container
        filterContainer.appendChild(conferenceButton);
        filterContainer.appendChild(allTimeButton);
        
        // Add container to leaderboard
        const leaderboard = document.getElementById('leaderboard');
        leaderboard.insertBefore(filterContainer, document.getElementById('leaderboard-list'));
        
        // Set default filter
        this.currentFilter = 'conference';
    },
    
    /**
     * Get scores filtered by current filter
     * @returns {Array} Filtered scores
     */
    getFilteredScores: function() {
        if (this.currentFilter === 'conference') {
            return this.scores.filter(score => score.isConference);
        } else {
            return this.scores;
        }
    },
    
    /**
     * Set up daily reset for conference
     */
    setupDailyReset: function() {
        // Check if we need to reset scores for a new conference day
        const lastResetDate = localStorage.getItem('aiDefenderLastReset');
        const today = new Date().toDateString();
        
        if (lastResetDate !== today) {
            // Archive yesterday's scores
            this.archiveScores();
            
            // Reset scores for today
            this.resetConferenceScores();
            
            // Update last reset date
            localStorage.setItem('aiDefenderLastReset', today);
        }
    },
    
    /**
     * Archive scores before reset
     */
    archiveScores: function() {
        const conferenceScores = this.scores.filter(score => score.isConference);
        
        if (conferenceScores.length === 0) {
            return;
        }
        
        // Get archived scores or create new archive
        let archivedScores = localStorage.getItem('aiDefenderArchivedScores');
        archivedScores = archivedScores ? JSON.parse(archivedScores) : {};
        
        // Add today's date as key with conference scores as value
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const dateKey = yesterday.toISOString().split('T')[0];
        
        archivedScores[dateKey] = conferenceScores;
        
        // Save archived scores
        localStorage.setItem('aiDefenderArchivedScores', JSON.stringify(archivedScores));
    },
    
    /**
     * Reset conference scores
     */
    resetConferenceScores: function() {
        // Remove conference scores but keep all-time scores
        this.scores = this.scores.filter(score => !score.isConference);
        this.saveScores();
        
        // Update leaderboard display
        UIManager.updateLeaderboard(this.getFilteredScores());
    },
    
    /**
     * Clear all scores and emails (for testing)
     */
    clearAll: function() {
        localStorage.removeItem('aiDefenderScores');
        localStorage.removeItem('aiDefenderEmails');
        localStorage.removeItem('aiDefenderLastReset');
        localStorage.removeItem('aiDefenderArchivedScores');
        this.scores = [];
        UIManager.updateLeaderboard(this.scores);
    }
};
