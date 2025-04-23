/**
 * Main Game class for the AI Defender game
 */
const Game = {
    /**
     * Initialize the game
     */
    init: function() {
        // Add loading class to body
        document.body.classList.add('loading');
        
        // Get canvas and context
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas size to window size
        this.resizeCanvas();
        
        // Set up resize listener
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Initialize game state
        this.isLoading = true;
        this.isRunning = false;
        this.lastTime = 0;
        this.difficultyTimer = 0;
        this.difficultyInterval = 30000; // Increase difficulty every 30 seconds
        
        // Initialize AI facts timer
        this.aiFactsTimer = 0;
        this.aiFactsInterval = 15000; // Display AI facts every 15 seconds (increased frequency)
        
        // Initialize enhanced background
        this.enhancedBackground = new EnhancedBackground(this.canvas.width, this.canvas.height);
        
        // Initialize game objects
        this.initializeGameObjects();
        
        // Initialize input handlers
        this.initializeInputHandlers();
        
        // Initialize UI
        UIManager.init();
        
        // Initialize leaderboard
        LeaderboardManager.init();
        
        // Initialize email collection
        EmailCollectionManager.init();
        
        // Initialize AI Facts Manager
        if (typeof AIFactsManager !== 'undefined') {
            AIFactsManager.init();
        }
        
        // Show loading screen initially
        UIManager.showLoadingScreen();
        
        // Load assets with a fallback
        this.loadAssets()
            .then(() => {
                // Show start screen when assets are loaded
                this.isLoading = false;
                document.body.classList.remove('loading');
                document.body.classList.add('game-started');
                UIManager.showStartScreen();
                console.log("Assets loaded successfully, showing start screen");
            })
            .catch(error => {
                // Handle loading errors by still showing the start screen
                console.error("Error loading assets:", error);
                this.isLoading = false;
                document.body.classList.remove('loading');
                document.body.classList.add('game-started');
                UIManager.showStartScreen();
            });
            
        // Fallback timer to ensure loading screen doesn't get stuck
        setTimeout(() => {
            if (this.isLoading) {
                console.log("Loading timeout reached, forcing start screen");
                this.isLoading = false;
                document.body.classList.remove('loading');
                document.body.classList.add('game-started');
                UIManager.showStartScreen();
            }
        }, 5000); // 5 second fallback
    },
    
    /**
     * Resize canvas to window size
     */
    resizeCanvas: function() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Update game objects if they exist
        if (this.player) {
            this.player.x = this.canvas.width / 2;
            this.player.y = this.canvas.height - 100;
        }
        
        // Update enhanced background if it exists
        if (this.enhancedBackground) {
            this.enhancedBackground.resize(this.canvas.width, this.canvas.height);
        }
    },
    
    /**
     * Initialize game objects
     */
    initializeGameObjects: function() {
        // Create player
        this.player = new Player(
            this.canvas.width / 2, // x
            this.canvas.height - 100, // y
            40, // width
            40 // height
        );
        
        // Create asteroid manager
        this.asteroidManager = new AsteroidManager(
            this.canvas.width,
            this.canvas.height
        );
        
        // Create enemy manager
        this.enemyManager = new EnemyManager(
            this.canvas.width,
            this.canvas.height
        );
        
        // Create power-up manager
        this.powerUpManager = new PowerUpManager(
            this.canvas.width,
            this.canvas.height
        );
    },
    
    /**
     * Initialize input handlers
     */
    initializeInputHandlers: function() {
        // Keyboard input
        document.addEventListener('keydown', (e) => {
            if (!this.isRunning) return;
            
            switch (e.key) {
                case 'ArrowLeft':
                    this.player.isMovingLeft = true;
                    break;
                case 'ArrowRight':
                    this.player.isMovingRight = true;
                    break;
                case ' ': // Spacebar
                    this.player.isShooting = true;
                    break;
            }
        });
        
        document.addEventListener('keyup', (e) => {
            if (!this.isRunning) return;
            
            switch (e.key) {
                case 'ArrowLeft':
                    this.player.isMovingLeft = false;
                    break;
                case 'ArrowRight':
                    this.player.isMovingRight = false;
                    break;
                case ' ': // Spacebar
                    this.player.isShooting = false;
                    break;
            }
        });
        
        // Touch input
        let touchStartX = 0;
        
        this.canvas.addEventListener('touchstart', (e) => {
            if (!this.isRunning) return;
            
            e.preventDefault();
            
            // Start shooting
            this.player.isShooting = true;
            
            // Store touch position
            touchStartX = e.touches[0].clientX;
        });
        
        this.canvas.addEventListener('touchmove', (e) => {
            if (!this.isRunning) return;
            
            e.preventDefault();
            
            // Calculate movement
            const touchX = e.touches[0].clientX;
            const deltaX = touchX - touchStartX;
            
            // Move player
            this.player.x += deltaX * 0.5;
            
            // Update touch position
            touchStartX = touchX;
        });
        
        this.canvas.addEventListener('touchend', (e) => {
            if (!this.isRunning) return;
            
            e.preventDefault();
            
            // Stop shooting
            this.player.isShooting = false;
        });
    },
    
    /**
     * Load game assets
     * @returns {Promise} Promise that resolves when assets are loaded
     */
    loadAssets: function() {
        return new Promise((resolve, reject) => {
            try {
                // In a full implementation, this would load images and sounds
                // For this demo, we'll just simulate loading time with a shorter delay
                setTimeout(() => {
                    // Check if EnhancedBackground is properly initialized
                    if (!this.enhancedBackground) {
                        console.error("EnhancedBackground not initialized");
                        this.enhancedBackground = new EnhancedBackground(this.canvas.width, this.canvas.height);
                    }
                    
                    // Check if other required objects are initialized
                    if (!this.player || !this.asteroidManager || !this.enemyManager || !this.powerUpManager) {
                        console.error("Game objects not properly initialized");
                        this.initializeGameObjects();
                    }
                    
                    resolve();
                }, 500); // Reduced loading time to 500ms
            } catch (error) {
                console.error("Error in loadAssets:", error);
                reject(error);
            }
        });
    },
    
    /**
     * Start the game
     */
    start: function() {
        if (this.isLoading) {
            console.log("Game still loading, cannot start yet");
            return;
        }
        
        // Reset game objects
        this.reset();
        
        // Update body class to indicate game is running
        document.body.classList.remove('game-started');
        document.body.classList.add('game-running');
        
        // Show game UI
        UIManager.showGameUI();
        
        // Start game loop
        this.isRunning = true;
        this.lastTime = performance.now();
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
        
        // Display initial AI fact
        setTimeout(() => {
            if (typeof AIFactsManager !== 'undefined') {
                AIFactsManager.displayRandomFact('fundamentals');
            }
        }, 2000);
        
        console.log("Game started, start screen should be hidden");
    },
    
    /**
     * Game loop
     * @param {number} timestamp - Current timestamp
     */
    gameLoop: function(timestamp) {
        // Calculate delta time
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw enhanced background
        if (this.enhancedBackground) {
            try {
                this.enhancedBackground.update(deltaTime);
                this.enhancedBackground.draw(this.ctx);
            } catch (error) {
                console.error("Error updating/drawing background:", error);
            }
        }
        
        // Update game objects
        this.update(deltaTime);
        
        // Draw game objects
        this.draw();
        
        // Continue game loop if running
        if (this.isRunning) {
            requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
        }
    },
    
    /**
     * Update game objects
     * @param {number} deltaTime - Time since last update in milliseconds
     */
    update: function(deltaTime) {
        try {
            // Update player
            this.player.update(deltaTime, this.canvas.width);
            
            // Update asteroid manager
            this.asteroidManager.update(deltaTime);
            
            // Update enemy manager
            this.enemyManager.update(deltaTime, this.player);
            
            // Update power-up manager
            this.powerUpManager.update(deltaTime);
            
            // Check collisions
            const collisionResult = CollisionManager.checkCollisions(
                this.player,
                this.asteroidManager,
                this.enemyManager,
                this.powerUpManager
            );
            
            // Update score
            if (collisionResult.score > 0) {
                this.player.score += collisionResult.score;
                UIManager.updateScore(this.player.score);
            }
            
            // Handle player damage
            if (collisionResult.playerDamaged) {
                UIManager.updateLives(this.player.lives);
                
                // Check for game over
                if (this.player.lives <= 0) {
                    this.gameOver();
                }
            }
            
            // Update difficulty
            this.difficultyTimer += deltaTime;
            if (this.difficultyTimer >= this.difficultyInterval) {
                this.increaseDifficulty();
                this.difficultyTimer = 0;
            }
            
            // Update AI facts display timer
            this.aiFactsTimer += deltaTime;
            if (this.aiFactsTimer >= this.aiFactsInterval && typeof AIFactsManager !== 'undefined') {
                AIFactsManager.displayRandomFact();
                this.aiFactsTimer = 0;
            }
        } catch (error) {
            console.error("Error in update:", error);
        }
    },
    
    /**
     * Draw game objects
     */
    draw: function() {
        try {
            // Draw asteroids
            this.asteroidManager.draw(this.ctx);
            
            // Draw enemies
            this.enemyManager.draw(this.ctx);
            
            // Draw power-ups
            this.powerUpManager.draw(this.ctx);
            
            // Draw player
            this.player.draw(this.ctx);
        } catch (error) {
            console.error("Error in draw:", error);
        }
    },
    
    /**
     * Increase game difficulty
     */
    increaseDifficulty: function() {
        // Increase asteroid difficulty
        this.asteroidManager.increaseDifficulty(0.1);
        
        // Increase enemy difficulty
        this.enemyManager.increaseDifficulty(0.1);
    },
    
    /**
     * Game over
     */
    gameOver: function() {
        // Stop game loop
        this.isRunning = false;
        
        // Update body class
        document.body.classList.remove('game-running');
        
        // Check if score is a high score
        const isHighScore = LeaderboardManager.isHighScore(this.player.score);
        
        // Show game over screen
        UIManager.showGameOverScreen(this.player.score, isHighScore);
    },
    
    /**
     * Reset game
     */
    reset: function() {
        // Reset player
        this.player.reset(this.canvas.width / 2, this.canvas.height - 100);
        
        // Reset asteroid manager
        this.asteroidManager.reset();
        
        // Reset enemy manager
        this.enemyManager.reset();
        
        // Reset power-up manager
        this.powerUpManager.reset();
        
        // Reset timers
        this.difficultyTimer = 0;
        this.aiFactsTimer = 0;
        
        // Update UI
        UIManager.updateScore(this.player.score);
        UIManager.updateLives(this.player.lives);
    }
};

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        Game.init();
    } catch (error) {
        console.error("Error initializing game:", error);
        // Force show start screen if initialization fails
        document.body.classList.remove('loading');
        document.body.classList.add('game-started');
        if (typeof UIManager !== 'undefined') {
            UIManager.showStartScreen();
        }
    }
});
