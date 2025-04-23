/**
 * Utility functions for the AI Defender game
 */
const Utils = {
    /**
     * Generate a random number between min and max (inclusive)
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} Random number
     */
    randomRange: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    /**
     * Format number with commas for thousands
     * @param {number} num - Number to format
     * @returns {string} Formatted number
     */
    formatNumber: function(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    
    /**
     * Constrain a value between min and max
     * @param {number} value - Value to constrain
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} Constrained value
     */
    clamp: function(value, min, max) {
        return Math.min(Math.max(value, min), max);
    },
    
    /**
     * Check if two circles collide
     * @param {Object} circle1 - First circle with x, y, and radius properties
     * @param {Object} circle2 - Second circle with x, y, and radius properties
     * @returns {boolean} True if circles collide
     */
    circleCollision: function(circle1, circle2) {
        const dx = circle1.x - circle2.x;
        const dy = circle1.y - circle2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        return distance < circle1.radius + circle2.radius;
    },
    
    /**
     * Create particle explosion effect
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} count - Number of particles
     * @param {string} color - Particle color
     * @param {number} speed - Particle speed
     * @param {number} size - Particle size
     * @param {number} duration - Effect duration in milliseconds
     */
    createParticles: function(ctx, x, y, count, color, speed, size, duration) {
        const particles = [];
        
        // Create particles
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * speed;
            
            particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                size: Math.random() * size + 1,
                color: color,
                alpha: 1,
                life: Math.random() * duration + duration / 2
            });
        }
        
        // Start animation
        let startTime = performance.now();
        
        function animate() {
            const currentTime = performance.now();
            const elapsed = currentTime - startTime;
            
            // Clear previous frame (only the particles area)
            ctx.clearRect(x - 100, y - 100, 200, 200);
            
            // Update and draw particles
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                
                // Update position
                p.x += p.vx;
                p.y += p.vy;
                
                // Update alpha based on life
                p.alpha = p.life / duration;
                
                // Reduce life
                p.life -= 16; // Approximately 16ms per frame at 60fps
                
                // Remove dead particles
                if (p.life <= 0) {
                    particles.splice(i, 1);
                    continue;
                }
                
                // Draw particle
                ctx.globalAlpha = p.alpha;
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            }
            
            ctx.globalAlpha = 1;
            
            // Continue animation if particles remain and duration not exceeded
            if (particles.length > 0 && elapsed < duration) {
                requestAnimationFrame(animate);
            }
        }
        
        // Start animation
        animate();
    }
};
