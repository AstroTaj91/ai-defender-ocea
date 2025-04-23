/**
 * Enhanced background system for AI Defender game
 * Includes parallax scrolling stars, planets, and interstellar dust
 */
class EnhancedBackground {
    /**
     * Create a new enhanced background
     * @param {number} canvasWidth - Canvas width
     * @param {number} canvasHeight - Canvas height
     */
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        
        // Initialize star layers (parallax effect)
        this.starLayers = [
            { stars: [], speed: 0.05, size: { min: 0.5, max: 1.5 }, count: 100 },   // Distant stars (slowest)
            { stars: [], speed: 0.1, size: { min: 1, max: 2 }, count: 70 },         // Mid-distance stars
            { stars: [], speed: 0.2, size: { min: 1.5, max: 2.5 }, count: 40 }      // Close stars (fastest)
        ];
        
        // Initialize dust particles
        this.dustParticles = [];
        this.dustCount = 60;
        this.dustSpeed = 0.15;
        
        // Initialize planets
        this.planets = [];
        this.planetCount = 3;
        this.planetSpeed = 0.03;
        
        // Initialize nebula
        this.nebulae = [];
        this.nebulaCount = 2;
        this.nebulaSpeed = 0.02;
        
        // Generate all background elements
        this.generateStars();
        this.generateDust();
        this.generatePlanets();
        this.generateNebulae();
    }
    
    /**
     * Resize the background when canvas size changes
     * @param {number} canvasWidth - New canvas width
     * @param {number} canvasHeight - New canvas height
     */
    resize(canvasWidth, canvasHeight) {
        // Update canvas dimensions
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        
        // Adjust star positions to fit new canvas size
        this.starLayers.forEach(layer => {
            layer.stars.forEach(star => {
                // Keep stars within new canvas bounds
                if (star.x > this.canvasWidth) {
                    star.x = Math.random() * this.canvasWidth;
                }
                if (star.y > this.canvasHeight) {
                    star.y = Math.random() * this.canvasHeight;
                }
            });
        });
        
        // Adjust dust particle positions
        this.dustParticles.forEach(dust => {
            // Keep dust within new canvas bounds
            if (dust.x > this.canvasWidth) {
                dust.x = Math.random() * this.canvasWidth;
            }
            if (dust.y > this.canvasHeight) {
                dust.y = Math.random() * this.canvasHeight;
            }
        });
        
        // Adjust planet positions
        this.planets.forEach(planet => {
            // Keep planets within new canvas width
            if (planet.x > this.canvasWidth) {
                planet.x = Math.random() * this.canvasWidth;
            }
        });
        
        // Adjust nebula positions
        this.nebulae.forEach(nebula => {
            // Keep nebulae within new canvas width
            if (nebula.x > this.canvasWidth) {
                nebula.x = Math.random() * this.canvasWidth;
            }
        });
    }
    
    /**
     * Generate stars for each layer
     */
    generateStars() {
        this.starLayers.forEach(layer => {
            layer.stars = []; // Clear existing stars
            for (let i = 0; i < layer.count; i++) {
                layer.stars.push({
                    x: Math.random() * this.canvasWidth,
                    y: Math.random() * this.canvasHeight,
                    size: Math.random() * (layer.size.max - layer.size.min) + layer.size.min,
                    brightness: Math.random() * 0.5 + 0.5, // 0.5 to 1.0
                    twinkleSpeed: Math.random() * 0.01 + 0.005,
                    twinklePhase: Math.random() * Math.PI * 2
                });
            }
        });
    }
    
    /**
     * Generate interstellar dust particles
     */
    generateDust() {
        this.dustParticles = []; // Clear existing dust
        for (let i = 0; i < this.dustCount; i++) {
            this.dustParticles.push({
                x: Math.random() * this.canvasWidth,
                y: Math.random() * this.canvasHeight,
                size: Math.random() * 1.5 + 0.5,
                opacity: Math.random() * 0.3 + 0.1, // 0.1 to 0.4
                color: this.getRandomDustColor()
            });
        }
    }
    
    /**
     * Generate foreground planets
     */
    generatePlanets() {
        this.planets = []; // Clear existing planets
        const planetTypes = [
            { color: '#a67c52', hasRings: false, minSize: 40, maxSize: 80 },  // Rocky planet
            { color: '#e67e22', hasRings: false, minSize: 60, maxSize: 100 }, // Gas giant
            { color: '#3498db', hasRings: false, minSize: 50, maxSize: 70 },  // Ice planet
            { color: '#27ae60', hasRings: false, minSize: 45, maxSize: 65 },  // Earth-like
            { color: '#f1c40f', hasRings: true, minSize: 70, maxSize: 120 }   // Ringed planet
        ];
        
        // Place some planets on screen initially for immediate visibility
        for (let i = 0; i < this.planetCount; i++) {
            const planetType = planetTypes[Math.floor(Math.random() * planetTypes.length)];
            const size = Math.random() * (planetType.maxSize - planetType.minSize) + planetType.minSize;
            
            // Position planets at different parts of the screen
            let yPos;
            if (i === 0) {
                // First planet visible at top portion
                yPos = this.canvasHeight * 0.2;
            } else if (i === 1) {
                // Second planet in middle portion
                yPos = this.canvasHeight * 0.5;
            } else {
                // Others randomly positioned or off-screen
                yPos = Math.random() > 0.5 ? 
                       Math.random() * this.canvasHeight : 
                       -size - Math.random() * this.canvasHeight;
            }
            
            this.planets.push({
                x: Math.random() * this.canvasWidth,
                y: yPos,
                size: size,
                color: planetType.color,
                hasRings: planetType.hasRings,
                ringColor: this.getRandomRingColor(),
                ringWidth: Math.random() * 0.4 + 0.2, // 0.2 to 0.6 (relative to planet size)
                ringAngle: Math.random() * 0.3 + 0.1, // 0.1 to 0.4 radians
                details: this.generatePlanetDetails(planetType.color)
            });
        }
    }
    
    /**
     * Generate nebulae (colorful gas clouds)
     */
    generateNebulae() {
        this.nebulae = []; // Clear existing nebulae
        const nebulaColors = [
            { main: '#3498db', secondary: '#9b59b6' }, // Blue-purple
            { main: '#e74c3c', secondary: '#f39c12' }, // Red-orange
            { main: '#2ecc71', secondary: '#3498db' }, // Green-blue
            { main: '#9b59b6', secondary: '#e74c3c' }  // Purple-red
        ];
        
        // Place some nebulae on screen initially for immediate visibility
        for (let i = 0; i < this.nebulaCount; i++) {
            const colorScheme = nebulaColors[Math.floor(Math.random() * nebulaColors.length)];
            const width = Math.random() * 300 + 200;
            const height = Math.random() * 300 + 200;
            
            // Position nebulae at different parts of the screen
            let yPos;
            if (i === 0) {
                // First nebula visible in the background
                yPos = this.canvasHeight * 0.3;
            } else {
                // Others randomly positioned
                yPos = Math.random() * this.canvasHeight;
            }
            
            this.nebulae.push({
                x: Math.random() * this.canvasWidth,
                y: yPos,
                width: width,
                height: height,
                colorMain: colorScheme.main,
                colorSecondary: colorScheme.secondary,
                opacity: Math.random() * 0.2 + 0.1, // 0.1 to 0.3
                cloudPoints: this.generateCloudPoints(width, height, 8)
            });
        }
    }
    
    /**
     * Generate random dust color
     * @returns {string} CSS color string
     */
    getRandomDustColor() {
        const colors = [
            'rgba(173, 216, 230, 0.7)', // Light blue
            'rgba(221, 160, 221, 0.7)', // Plum
            'rgba(255, 192, 203, 0.7)', // Pink
            'rgba(240, 248, 255, 0.7)', // Alice blue
            'rgba(176, 224, 230, 0.7)'  // Powder blue
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    /**
     * Generate random ring color
     * @returns {string} CSS color string
     */
    getRandomRingColor() {
        const colors = [
            '#d35400', // Dark orange
            '#7f8c8d', // Gray
            '#bdc3c7', // Silver
            '#f39c12', // Orange
            '#95a5a6'  // Light gray
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    /**
     * Generate planet surface details
     * @param {string} baseColor - Base planet color
     * @returns {Array} Array of detail objects
     */
    generatePlanetDetails(baseColor) {
        const details = [];
        const detailCount = Math.floor(Math.random() * 5) + 3;
        
        for (let i = 0; i < detailCount; i++) {
            details.push({
                offsetX: Math.random() * 2 - 1, // -1 to 1
                offsetY: Math.random() * 2 - 1, // -1 to 1
                radius: Math.random() * 0.3 + 0.1, // 0.1 to 0.4 (relative to planet size)
                color: this.adjustColor(baseColor, Math.random() * 30 - 15) // Slightly darker or lighter
            });
        }
        
        return details;
    }
    
    /**
     * Generate cloud-like points for nebulae
     * @param {number} width - Nebula width
     * @param {number} height - Nebula height
     * @param {number} pointCount - Number of control points
     * @returns {Array} Array of point coordinates
     */
    generateCloudPoints(width, height, pointCount) {
        const points = [];
        const angleStep = (Math.PI * 2) / pointCount;
        
        for (let i = 0; i < pointCount; i++) {
            const angle = i * angleStep;
            const radius = (Math.random() * 0.3 + 0.7) * Math.min(width, height) / 2; // 70% to 100% of size
            
            points.push({
                x: Math.cos(angle) * radius,
                y: Math.sin(angle) * radius
            });
        }
        
        return points;
    }
    
    /**
     * Adjust color brightness
     * @param {string} color - Hex color string
     * @param {number} amount - Amount to adjust (-255 to 255)
     * @returns {string} Adjusted hex color
     */
    adjustColor(color, amount) {
        const hex = color.replace('#', '');
        let r = parseInt(hex.substring(0, 2), 16);
        let g = parseInt(hex.substring(2, 4), 16);
        let b = parseInt(hex.substring(4, 6), 16);
        
        r = Math.max(0, Math.min(255, r + amount));
        g = Math.max(0, Math.min(255, g + amount));
        b = Math.max(0, Math.min(255, b + amount));
        
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
    
    /**
     * Update background elements
     * @param {number} deltaTime - Time since last update in milliseconds
     */
    update(deltaTime) {
        // Update stars
        this.starLayers.forEach(layer => {
            layer.stars.forEach(star => {
                // Move stars downward
                star.y += layer.speed * deltaTime / 16;
                
                // Wrap stars around when they go off screen
                if (star.y > this.canvasHeight) {
                    star.y = 0;
                    star.x = Math.random() * this.canvasWidth;
                }
                
                // Update twinkle effect
                star.twinklePhase += star.twinkleSpeed * deltaTime / 16;
                if (star.twinklePhase > Math.PI * 2) {
                    star.twinklePhase -= Math.PI * 2;
                }
            });
        });
        
        // Update dust particles
        this.dustParticles.forEach(dust => {
            // Move dust downward
            dust.y += this.dustSpeed * deltaTime / 16;
            
            // Wrap dust around when it goes off screen
            if (dust.y > this.canvasHeight) {
                dust.y = 0;
                dust.x = Math.random() * this.canvasWidth;
                dust.opacity = Math.random() * 0.3 + 0.1;
            }
        });
        
        // Update planets
        this.planets.forEach(planet => {
            // Move planets downward
            planet.y += this.planetSpeed * deltaTime / 16;
            
            // Reset planets when they go off screen
            if (planet.y - planet.size > this.canvasHeight) {
                planet.y = -planet.size - Math.random() * this.canvasHeight;
                planet.x = Math.random() * this.canvasWidth;
            }
        });
        
        // Update nebulae
        this.nebulae.forEach(nebula => {
            // Move nebulae downward
            nebula.y += this.nebulaSpeed * deltaTime / 16;
            
            // Reset nebulae when they go off screen
            if (nebula.y - nebula.height > this.canvasHeight) {
                nebula.y = -nebula.height - Math.random() * this.canvasHeight;
                nebula.x = Math.random() * this.canvasWidth;
            }
        });
    }
    
    /**
     * Draw background on canvas
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    draw(ctx) {
        // Draw background gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, this.canvasHeight);
        gradient.addColorStop(0, '#0a0a2a'); // Dark blue
        gradient.addColorStop(0.5, '#1a1a4a'); // Medium blue
        gradient.addColorStop(1, '#2a2a6a'); // Lighter blue
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        
        // Draw nebulae (behind everything)
        this.drawNebulae(ctx);
        
        // Draw stars (all layers)
        this.drawStars(ctx);
        
        // Draw dust particles
        this.drawDust(ctx);
        
        // Draw planets (in foreground)
        this.drawPlanets(ctx);
    }
    
    /**
     * Draw star layers
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    drawStars(ctx) {
        this.starLayers.forEach(layer => {
            layer.stars.forEach(star => {
                // Calculate twinkle effect
                const twinkleFactor = 0.7 + 0.3 * Math.sin(star.twinklePhase);
                const brightness = star.brightness * twinkleFactor;
                
                // Draw star with glow
                ctx.save();
                
                // Draw glow
                const gradient = ctx.createRadialGradient(
                    star.x, star.y, 0,
                    star.x, star.y, star.size * 2
                );
                gradient.addColorStop(0, `rgba(255, 255, 255, ${brightness * 0.8})`);
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
                ctx.fill();
                
                // Draw star center
                ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.restore();
            });
        });
    }
    
    /**
     * Draw dust particles
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    drawDust(ctx) {
        this.dustParticles.forEach(dust => {
            ctx.fillStyle = dust.color;
            ctx.globalAlpha = dust.opacity;
            ctx.beginPath();
            ctx.arc(dust.x, dust.y, dust.size, 0, Math.PI * 2);
            ctx.fill();
        });
        
        // Reset global alpha
        ctx.globalAlpha = 1;
    }
    
    /**
     * Draw planets
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    drawPlanets(ctx) {
        this.planets.forEach(planet => {
            ctx.save();
            ctx.translate(planet.x, planet.y);
            
            // Draw rings if planet has them
            if (planet.hasRings) {
                ctx.save();
                ctx.rotate(planet.ringAngle);
                
                // Draw outer ring
                ctx.beginPath();
                ctx.ellipse(0, 0, planet.size * (1 + planet.ringWidth), planet.size * (1 + planet.ringWidth) * 0.3, 0, 0, Math.PI * 2);
                ctx.fillStyle = planet.ringColor;
                ctx.globalAlpha = 0.7;
                ctx.fill();
                
                // Draw inner ring (cutout)
                ctx.globalCompositeOperation = 'destination-out';
                ctx.beginPath();
                ctx.ellipse(0, 0, planet.size * 1.1, planet.size * 1.1 * 0.3, 0, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.restore();
            }
            
            // Draw planet base
            const gradient = ctx.createRadialGradient(
                -planet.size * 0.3, -planet.size * 0.3, 0,
                0, 0, planet.size
            );
            gradient.addColorStop(0, this.adjustColor(planet.color, 30)); // Lighter
            gradient.addColorStop(1, this.adjustColor(planet.color, -20)); // Darker
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(0, 0, planet.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw planet details
            planet.details.forEach(detail => {
                ctx.fillStyle = detail.color;
                ctx.beginPath();
                ctx.arc(
                    detail.offsetX * planet.size * 0.7,
                    detail.offsetY * planet.size * 0.7,
                    detail.radius * planet.size,
                    0, Math.PI * 2
                );
                ctx.fill();
            });
            
            ctx.restore();
        });
    }
    
    /**
     * Draw nebulae
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    drawNebulae(ctx) {
        this.nebulae.forEach(nebula => {
            ctx.save();
            ctx.translate(nebula.x, nebula.y);
            ctx.globalAlpha = nebula.opacity;
            
            // Create gradient
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, nebula.width / 2);
            gradient.addColorStop(0, nebula.colorMain);
            gradient.addColorStop(1, nebula.colorSecondary);
            
            // Draw nebula cloud
            ctx.fillStyle = gradient;
            ctx.beginPath();
            
            // Start at first point
            const firstPoint = nebula.cloudPoints[0];
            ctx.moveTo(firstPoint.x, firstPoint.y);
            
            // Draw bezier curves between points
            for (let i = 0; i < nebula.cloudPoints.length; i++) {
                const current = nebula.cloudPoints[i];
                const next = nebula.cloudPoints[(i + 1) % nebula.cloudPoints.length];
                
                const cp1x = current.x + (next.x - current.x) * 0.5;
                const cp1y = current.y;
                const cp2x = current.x + (next.x - current.x) * 0.5;
                const cp2y = next.y;
                
                ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, next.x, next.y);
            }
            
            ctx.closePath();
            ctx.fill();
            
            ctx.restore();
        });
    }
}
