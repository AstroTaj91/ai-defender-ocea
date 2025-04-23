/**
 * AI Facts Manager for the AI Defender game
 * Displays educational AI facts during gameplay
 */
const AIFactsManager = {
    /**
     * Initialize the facts display
     */
    init: function() {
        this.factContainer = document.getElementById('ai-fact-display');
        this.factDisplayTime = 8000; // Display facts for 8 seconds
        this.currentTimeout = null;
        this.factInterval = 15000; // Show facts every 15 seconds
        this.factTimer = 0;
        this.isActive = true;
    },
    
    /**
     * Update the facts timer and display facts periodically
     * @param {number} deltaTime - Time since last update in milliseconds
     */
    update: function(deltaTime) {
        if (!this.isActive) return;
        
        this.factTimer += deltaTime;
        if (this.factTimer >= this.factInterval) {
            this.displayRandomFact();
            this.factTimer = 0;
        }
    },
    
    /**
     * Start displaying facts periodically
     */
    start: function() {
        this.isActive = true;
        this.factTimer = this.factInterval - 2000; // Show first fact soon after game starts
    },
    
    /**
     * Stop displaying facts
     */
    stop: function() {
        this.isActive = false;
        this.hideFactWithAnimation();
    },
    
    /**
     * Display a random AI fact
     * @param {string} category - Optional category to filter facts
     */
    displayRandomFact: function(category = null) {
        // Clear any existing timeout
        if (this.currentTimeout) {
            clearTimeout(this.currentTimeout);
        }
        
        // Get facts from the specified category or all categories
        let facts = [];
        if (category) {
            facts = this.facts[category] || [];
        } else {
            // Get a random category
            const categories = Object.keys(this.facts);
            const randomCategory = categories[Math.floor(Math.random() * categories.length)];
            facts = this.facts[randomCategory] || [];
        }
        
        // If no facts found, use fundamentals
        if (facts.length === 0) {
            facts = this.facts.fundamentals;
        }
        
        // Get a random fact
        const fact = facts[Math.floor(Math.random() * facts.length)];
        
        // Display the fact with animation
        this.showFactWithAnimation(fact);
        
        // Set timeout to hide the fact
        this.currentTimeout = setTimeout(() => {
            this.hideFactWithAnimation();
        }, this.factDisplayTime);
    },
    
    /**
     * Show fact with animation
     * @param {string} fact - Fact to display
     */
    showFactWithAnimation: function(fact) {
        // Create or update the fact text element
        if (!this.factContainer.querySelector('.fact-text')) {
            const factText = document.createElement('div');
            factText.className = 'fact-text';
            this.factContainer.appendChild(factText);
        }
        
        const factText = this.factContainer.querySelector('.fact-text');
        factText.textContent = "AI Fact: " + fact;
        
        // Show the container with fade-in and slide-down animation
        this.factContainer.style.opacity = '0';
        this.factContainer.style.transform = 'translateY(-20px)';
        this.factContainer.style.display = 'block';
        
        // Trigger animation
        setTimeout(() => {
            this.factContainer.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            this.factContainer.style.opacity = '1';
            this.factContainer.style.transform = 'translateY(0)';
        }, 10);
    },
    
    /**
     * Hide fact with animation
     */
    hideFactWithAnimation: function() {
        if (!this.factContainer) return;
        
        // Hide with fade-out and slide-up animation
        this.factContainer.style.opacity = '0';
        this.factContainer.style.transform = 'translateY(-20px)';
        
        // Hide after animation completes
        setTimeout(() => {
            this.factContainer.style.display = 'none';
        }, 500);
    },
    
    /**
     * AI facts by category
     */
    facts: {
        fundamentals: [
            "AI (Artificial Intelligence) refers to systems that can perform tasks that typically require human intelligence.",
            "Machine Learning is a subset of AI that enables systems to learn from data without explicit programming.",
            "Deep Learning uses neural networks with many layers to analyze various factors of data.",
            "Neural networks are computing systems inspired by the human brain's biological neural networks.",
            "AI systems can recognize patterns in data that humans might miss.",
            "The term 'Artificial Intelligence' was coined by John McCarthy in 1956.",
            "The Turing Test, proposed by Alan Turing in 1950, tests a machine's ability to exhibit intelligent behavior.",
            "Computer vision is an AI field that trains computers to interpret and understand visual information.",
            "Natural Language Processing (NLP) helps computers understand and interpret human language.",
            "AI ethics involves ensuring AI systems are designed and used in ways that benefit humanity."
        ],
        applications: [
            "AI is used in healthcare to help diagnose diseases and develop treatment plans.",
            "Self-driving cars use AI to navigate roads and avoid obstacles.",
            "AI-powered virtual assistants like Siri and Alexa help with daily tasks and information retrieval.",
            "AI systems help detect fraudulent transactions in banking and finance.",
            "Recommendation systems use AI to suggest products, movies, or music based on your preferences.",
            "AI is used in agriculture to monitor crop health and optimize farming practices.",
            "Smart home devices use AI to learn your preferences and automate your living environment.",
            "AI helps in weather forecasting by analyzing patterns in meteorological data.",
            "Educational applications use AI to personalize learning experiences for students.",
            "AI is revolutionizing manufacturing through predictive maintenance and quality control."
        ],
        education: [
            "AI tutoring systems can adapt to individual student learning styles and pace.",
            "Automated grading systems use AI to evaluate essays and provide feedback.",
            "AI can identify students who may need additional support or different teaching approaches.",
            "Virtual reality combined with AI creates immersive educational experiences.",
            "AI helps create personalized learning paths based on student strengths and weaknesses.",
            "Intelligent content creation tools help educators develop customized learning materials.",
            "AI-powered language learning apps adapt to help students master new languages efficiently.",
            "Educational chatbots provide 24/7 support for student questions.",
            "AI analytics help schools and universities improve educational outcomes.",
            "AI can make education more accessible for students with disabilities through adaptive technologies."
        ],
        future: [
            "AI may help solve complex global challenges like climate change and disease.",
            "Quantum computing could dramatically accelerate AI capabilities in the future.",
            "AI might eventually develop general intelligence comparable to humans.",
            "Brain-computer interfaces may one day allow direct communication between humans and AI.",
            "AI could help extend human lifespans through personalized medicine and health monitoring.",
            "Future AI systems might be able to understand and replicate human emotions.",
            "AI could revolutionize space exploration by making autonomous decisions in distant environments.",
            "The integration of AI with robotics will transform manufacturing, healthcare, and daily life.",
            "AI might help us understand and communicate with other species.",
            "Ethical frameworks for AI will become increasingly important as capabilities advance."
        ],
        careers: [
            "AI specialists are among the highest-paid professionals in the technology sector.",
            "Data science is a rapidly growing field that combines statistics, programming, and domain expertise.",
            "Machine learning engineers design and implement AI algorithms and models.",
            "AI ethics consultants help ensure AI systems are developed responsibly.",
            "Robotics engineers combine AI with mechanical engineering to create intelligent machines.",
            "Natural language processing specialists help computers understand human language.",
            "Computer vision engineers teach computers to interpret and understand visual information.",
            "AI research scientists advance the fundamental capabilities of artificial intelligence.",
            "AI product managers bridge the gap between technical development and business applications.",
            "The demand for AI professionals is expected to grow significantly in the coming decades."
        ]
    }
};
