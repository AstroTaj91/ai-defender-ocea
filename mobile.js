/**
 * Mobile optimization enhancements for AI Defender game
 * This file adds touch controls and responsive design improvements
 */

document.addEventListener('DOMContentLoaded', () => {
    // Check if device is mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        // Add mobile-specific CSS class to body
        document.body.classList.add('mobile-device');
        
        // Enhance touch controls
        enhanceTouchControls();
        
        // Optimize UI for mobile
        optimizeMobileUI();
    }
    
    // Add responsive design improvements for all devices
    improveResponsiveness();
});

/**
 * Enhance touch controls for mobile devices
 */
function enhanceTouchControls() {
    const canvas = document.getElementById('game-canvas');
    
    // Prevent default touch actions to avoid scrolling while playing
    canvas.addEventListener('touchmove', function(e) {
        e.preventDefault();
    }, { passive: false });
    
    canvas.addEventListener('touchstart', function(e) {
        e.preventDefault();
    }, { passive: false });
    
    // Add visible touch controls for mobile
    addVisibleTouchControls();
}

/**
 * Add visible touch controls for mobile devices
 */
function addVisibleTouchControls() {
    // Create touch controls container
    const touchControls = document.createElement('div');
    touchControls.id = 'touch-controls';
    touchControls.style.position = 'fixed';
    touchControls.style.bottom = '20px';
    touchControls.style.left = '0';
    touchControls.style.width = '100%';
    touchControls.style.display = 'flex';
    touchControls.style.justifyContent = 'space-between';
    touchControls.style.padding = '0 20px';
    touchControls.style.zIndex = '100';
    touchControls.style.pointerEvents = 'none'; // Don't interfere with canvas touch events
    
    // Create left and right indicators
    const leftControl = document.createElement('div');
    leftControl.innerHTML = '← Slide Left';
    leftControl.style.color = 'rgba(255, 255, 255, 0.7)';
    leftControl.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
    leftControl.style.padding = '10px 15px';
    leftControl.style.borderRadius = '5px';
    
    const rightControl = document.createElement('div');
    rightControl.innerHTML = 'Slide Right →';
    rightControl.style.color = 'rgba(255, 255, 255, 0.7)';
    rightControl.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
    rightControl.style.padding = '10px 15px';
    rightControl.style.borderRadius = '5px';
    
    // Add controls to container
    touchControls.appendChild(leftControl);
    touchControls.appendChild(rightControl);
    
    // Add container to game container
    document.getElementById('game-container').appendChild(touchControls);
    
    // Show controls only during gameplay
    const gameUI = document.getElementById('game-ui');
    
    // Create MutationObserver to watch for game UI visibility changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'style') {
                if (gameUI.style.display === 'block') {
                    touchControls.style.display = 'flex';
                } else {
                    touchControls.style.display = 'none';
                }
            }
        });
    });
    
    // Start observing
    observer.observe(gameUI, { attributes: true });
}

/**
 * Optimize UI for mobile devices
 */
function optimizeMobileUI() {
    // Increase button sizes for touch
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.style.minHeight = '44px'; // Apple's recommended minimum touch target size
        button.style.minWidth = '44px';
    });
    
    // Increase form input sizes
    const inputs = document.querySelectorAll('input[type="text"], input[type="email"]');
    inputs.forEach(input => {
        input.style.height = '44px';
        input.style.fontSize = '16px'; // Prevent iOS zoom on focus
    });
    
    // Adjust game over screen for better mobile viewing
    const gameOverScreen = document.getElementById('game-over-screen');
    gameOverScreen.style.padding = '10px';
    
    // Make leaderboard more compact on mobile
    const leaderboardList = document.getElementById('leaderboard-list');
    leaderboardList.style.maxHeight = '150px';
}

/**
 * Improve responsiveness for all devices
 */
function improveResponsiveness() {
    // Handle window resize
    window.addEventListener('resize', () => {
        // Update canvas size
        if (Game && Game.resizeCanvas) {
            Game.resizeCanvas();
        }
        
        // Adjust UI based on window size
        adjustUIForScreenSize();
    });
    
    // Initial UI adjustment
    adjustUIForScreenSize();
}

/**
 * Adjust UI based on screen size
 */
function adjustUIForScreenSize() {
    const width = window.innerWidth;
    
    // Small screens (phones)
    if (width < 480) {
        document.body.classList.add('small-screen');
        document.body.classList.remove('medium-screen', 'large-screen');
    }
    // Medium screens (tablets)
    else if (width < 768) {
        document.body.classList.add('medium-screen');
        document.body.classList.remove('small-screen', 'large-screen');
    }
    // Large screens (desktops)
    else {
        document.body.classList.add('large-screen');
        document.body.classList.remove('small-screen', 'medium-screen');
    }
}

// Add device orientation handling for mobile
if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', handleOrientation);
}

/**
 * Handle device orientation changes
 * @param {DeviceOrientationEvent} event - Orientation event
 */
function handleOrientation(event) {
    // Only use orientation if game is running
    if (!Game || !Game.isRunning || !Game.player) return;
    
    // Get gamma rotation (left to right tilt)
    const gamma = event.gamma;
    
    // Use gamma to control player movement
    if (gamma < -5) {
        // Tilting left
        Game.player.isMovingLeft = true;
        Game.player.isMovingRight = false;
    } else if (gamma > 5) {
        // Tilting right
        Game.player.isMovingLeft = false;
        Game.player.isMovingRight = true;
    } else {
        // Neutral position
        Game.player.isMovingLeft = false;
        Game.player.isMovingRight = false;
    }
}
