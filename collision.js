/**
 * Collision detection and handling for the AI Defender game
 */
const CollisionManager = {
    /**
     * Check all collisions in the game
     * @param {Player} player - Player object
     * @param {AsteroidManager} asteroidManager - Asteroid manager
     * @param {EnemyManager} enemyManager - Enemy manager
     * @param {PowerUpManager} powerUpManager - Power-up manager
     * @returns {Object} Collision results including score and damage
     */
    checkCollisions: function(player, asteroidManager, enemyManager, powerUpManager) {
        const result = {
            score: 0,
            playerDamaged: false,
            powerUpCollected: null
        };
        
        // Check player bullets against asteroids
        result.score += asteroidManager.checkBulletCollisions(player);
        
        // Check player bullets against enemies
        result.score += enemyManager.checkBulletCollisions(player);
        
        // Check player against asteroids
        if (asteroidManager.checkPlayerCollision(player)) {
            result.playerDamaged = player.takeDamage();
        }
        
        // Check player against enemies
        if (enemyManager.checkPlayerCollision(player)) {
            result.playerDamaged = player.takeDamage();
        }
        
        // Check player against power-ups
        const powerUpType = powerUpManager.checkCollisions(player);
        if (powerUpType) {
            result.powerUpCollected = powerUpType;
            player.applyPowerUp(powerUpType);
        }
        
        return result;
    }
};
