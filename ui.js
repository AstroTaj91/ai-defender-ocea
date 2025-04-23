/**
 * UI Manager for the AI Defender game
 */
const UIManager = {
    /**
     * Initialize UI elements
     */
    init: function() {
        // Get UI elements
        this.loadingScreen = document.getElementById('loading-screen');
        this.startScreen = document.getElementById('start-screen');
        this.gameUI = document.getElementById('game-ui');
        this.gameOverScreen = document.getElementById('game-over-screen');
        this.scoreDisplay = document.getElementById('score');
        this.livesDisplay = document.getElementById('lives');
        this.finalScoreDisplay = document.getElementById('final-score');
        this.highScoreForm = document.getElementById('high-score-form');
        this.leaderboardList = document.getElementById('leaderboard-list');
        
        // Get buttons
        this.startButton = document.getElementById('start-button');
        this.playAgainButton = document.getElementById('play-again-button');
        
        // Set up event listeners
        this.startButton.addEventListener('click', () => {
            if (typeof Game !== 'undefined') {
                Game.start();
            }
        });
        
        this.playAgainButton.addEventListener('click', () => {
            if (typeof Game !== 'undefined') {
                Game.reset();
                Game.start();
            }
        });
        
        // Set up leaderboard form submission
        document.getElementById('leaderboard-form').addEventListener('submit', (e) => {
            e.preventDefault();
            if (typeof LeaderboardManager !== 'undefined') {
                const name = document.getElementById('player-name').value;
                const email = document.getElementById('player-email').value;
                const newsletter = document.getElementById('newsletter-signup').checked;
                
                LeaderboardManager.submitScore(name, email, newsletter);
            }
        });
        
        // Initially show loading screen
        this.showLoadingScreen();
    },
    
    /**
     * Show loading screen
     */
    showLoadingScreen: function() {
        if (this.loadingScreen) {
            this.loadingScreen.style.display = 'flex';
        }
        if (this.startScreen) {
            this.startScreen.style.display = 'none';
        }
        if (this.gameUI) {
            this.gameUI.style.display = 'none';
        }
        if (this.gameOverScreen) {
            this.gameOverScreen.style.display = 'none';
        }
        console.log("Loading screen displayed");
    },
    
    /**
     * Show start screen
     */
    showStartScreen: function() {
        try {
            if (this.loadingScreen) {
                this.loadingScreen.style.display = 'none';
            }
            if (this.startScreen) {
                this.startScreen.style.display = 'flex';
            }
            if (this.gameUI) {
                this.gameUI.style.display = 'none';
            }
            if (this.gameOverScreen) {
                this.gameOverScreen.style.display = 'none';
            }
            console.log("Start screen displayed");
        } catch (error) {
            console.error("Error showing start screen:", error);
            // Force display as a fallback
            if (this.loadingScreen) {
                this.loadingScreen.style.display = 'none';
            }
            if (this.startScreen) {
                this.startScreen.style.display = 'flex';
            }
        }
    },
    
    /**
     * Show game UI
     */
    showGameUI: function() {
        if (this.loadingScreen) {
            this.loadingScreen.style.display = 'none';
        }
        if (this.startScreen) {
            this.startScreen.style.display = 'none';
        }
        if (this.gameUI) {
            this.gameUI.style.display = 'block';
        }
        if (this.gameOverScreen) {
            this.gameOverScreen.style.display = 'none';
        }
        console.log("Game UI displayed");
    },
    
    /**
     * Show game over screen
     * @param {number} score - Final score
     * @param {boolean} isHighScore - Whether score is a high score
     */
    showGameOverScreen: function(score, isHighScore) {
        if (this.loadingScreen) {
            this.loadingScreen.style.display = 'none';
        }
        if (this.startScreen) {
            this.startScreen.style.display = 'none';
        }
        if (this.gameUI) {
            this.gameUI.style.display = 'none';
        }
        if (this.gameOverScreen) {
            this.gameOverScreen.style.display = 'flex';
        }
        
        // Update final score
        if (this.finalScoreDisplay && typeof Utils !== 'undefined') {
            this.finalScoreDisplay.textContent = Utils.formatNumber(score);
        } else if (this.finalScoreDisplay) {
            this.finalScoreDisplay.textContent = score;
        }
        
        // Show/hide high score form
        if (this.highScoreForm) {
            this.highScoreForm.style.display = isHighScore ? 'block' : 'none';
        }
        
        console.log("Game over screen displayed");
    },
    
    /**
     * Update score display
     * @param {number} score - Current score
     */
    updateScore: function(score) {
        if (this.scoreDisplay && typeof Utils !== 'undefined') {
            this.scoreDisplay.textContent = Utils.formatNumber(score);
        } else if (this.scoreDisplay) {
            this.scoreDisplay.textContent = score;
        }
    },
    
    /**
     * Update lives display
     * @param {number} lives - Current lives
     */
    updateLives: function(lives) {
        if (this.livesDisplay) {
            this.livesDisplay.textContent = lives;
        }
    },
    
    /**
     * Update leaderboard display
     * @param {Array} scores - Array of score objects with name and score properties
     */
    updateLeaderboard: function(scores) {
        if (!this.leaderboardList) return;
        
        // Clear current leaderboard
        this.leaderboardList.innerHTML = '';
        
        // Add scores to leaderboard
        for (let i = 0; i < scores.length; i++) {
            const score = scores[i];
            const li = document.createElement('li');
            if (typeof Utils !== 'undefined') {
                li.innerHTML = `<span>${i + 1}. ${score.name}</span><span>${Utils.formatNumber(score.score)}</span>`;
            } else {
                li.innerHTML = `<span>${i + 1}. ${score.name}</span><span>${score.score}</span>`;
            }
            this.leaderboardList.appendChild(li);
        }
    }
};
