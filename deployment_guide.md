# AI Defender - Conference Deployment Guide

## Overview
This document provides instructions for deploying the AI Defender game at the OCEA Spring Conference 2025 booth for Tempus Innovation InTempo.

## Game Description
AI Defender is an engaging space shooter game designed to attract school counselors to the Tempus Innovation booth. Players control a spaceship to dodge asteroids, collect power-ups, and learn AI facts while playing. The game includes a leaderboard and email collection system to gather contacts for the AI newsletter.

## Technical Requirements

### Hardware
- Tablet or laptop with touch capabilities (recommended)
- External monitor or display (optional for larger visibility)
- Internet connection (optional - game works offline)
- Power source for devices

### Software
- Modern web browser (Chrome, Firefox, Safari, or Edge)
- Web server for hosting (if not using the packaged version)

## Setup Instructions

### Option 1: Local Deployment (Recommended for Conference)
1. Copy the entire `ai-defender` folder to the device
2. Open the `index.html` file directly in a browser
3. For best results, use full-screen mode (F11 on most browsers)
4. Test the game before the conference starts

### Option 2: Web Server Deployment
1. Upload the entire `ai-defender` folder to a web server
2. Access the game via the URL provided by the web server
3. Ensure the server has HTTPS if collecting emails online

## Conference-Specific Features

### Admin Controls
- Press `Ctrl+Shift+A` to access admin controls
- Export collected emails as CSV
- View statistics on collected emails and newsletter signups

### Daily Reset
- The leaderboard automatically resets each day of the conference
- Previous days' scores are archived and can be accessed via admin controls

### Conference Branding
- The game includes OCEA Spring Conference 2025 branding
- Leaderboard is labeled as "OCEA Conference Leaderboard"

## Email Collection

### Data Storage
- In the local deployment, emails are stored in the browser's localStorage
- Export emails regularly using the admin controls
- After the conference, compile all collected emails into a single list

### Privacy Considerations
- The game includes a checkbox for newsletter consent
- Only users who check this box should be added to marketing lists
- Follow all applicable privacy regulations when using collected data

## Troubleshooting

### Game Not Loading
- Ensure all files are present in the correct directory structure
- Try a different browser
- Clear browser cache and reload

### Touch Controls Not Working
- Ensure device has touch capabilities
- Try reloading the page
- Check if device orientation is locked

### Leaderboard Issues
- If leaderboard doesn't display, try clearing localStorage
- Access admin controls and check for any error messages

## Post-Conference

### Data Collection
1. Export all emails using admin controls
2. Save the CSV file securely
3. Import contacts into your newsletter system

### Game Analytics
- Review game statistics to understand engagement
- Note which AI facts were most frequently displayed
- Use insights to improve future conference activities

## Contact Information
For technical support or questions about the game, contact:
- Taj Sarin, Tempus Innovation
- Website: https://tempusinnovation.com/intempo
