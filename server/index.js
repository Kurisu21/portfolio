const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const Filter = require('bad-words');
const { ChatOpenAI } = require('@langchain/openai');
const { ChatPromptTemplate, MessagesPlaceholder } = require('@langchain/core/prompts');
const { BufferMemory } = require('langchain/memory');
const { ConversationChain } = require('langchain/chains');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
// Check if we're in production (set NODE_ENV=production or check if dist folder exists)
const NODE_ENV = process.env.NODE_ENV || (fs.existsSync(path.join(__dirname, '../client/dist')) ? 'production' : 'development');
const FLOWISE_API_URL = process.env.FLOWISE_API_URL || "http://localhost:3000/api/v1/prediction/YOUR_FLOW_ID";
const FLOWISE_API_KEY = process.env.FLOWISE_API_KEY; // Optional: for Flowise Cloud authentication
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1";

// CORS configuration - works for both Render and local development
const getAllowedOrigins = () => {
    const origins = [];
    
    if (NODE_ENV === 'production') {
        // Add custom CLIENT_URL if provided
        const clientUrl = process.env.CLIENT_URL || process.env.FRONTEND_URL;
        if (clientUrl) {
            origins.push(...clientUrl.split(',').map(url => url.trim()));
        }
        
        // Add Render frontend URL if available
        const renderUrl = process.env.RENDER_EXTERNAL_URL;
        if (renderUrl && !renderUrl.includes('server')) {
            // Only add if it's not the backend URL
            origins.push(renderUrl);
        }
        
        // Add specific Render frontend URL
        origins.push('https://ij-portfolio.onrender.com');
        
        // If no origins specified, allow all (for flexibility)
        return origins.length > 0 ? origins : '*';
    }
    
    // Development origins
    return ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173', 'http://localhost:5000'];
};

const corsOptions = {
    origin: getAllowedOrigins(),
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// Serve static files from React app in production (only if dist folder exists - for single-server deployment)
// For Render separate frontend/backend, this won't run since dist won't be in server directory
if (NODE_ENV === 'production' && fs.existsSync(path.join(__dirname, '../client/dist'))) {
    app.use(express.static(path.join(__dirname, '../client/dist')));
    console.log('Serving static files from client/dist');
}

// Personal information context for the chatbot
// TODO: Replace [Your ...] placeholders with your actual personal information
const personalInfo = `
You are a helpful AI assistant for an IT student's portfolio website. Here's information about the portfolio owner:

**Personal Information:**
- Name: [Your Name]
- Age: [Your Age]
- Location: [Your City, Country]
- Email: [Your Email] (optional - only if you want to share)
- Current Role: [Your Job Title or "Student" or "Freelancer", etc.]

**About:**
- An IT student with a love for creating beautiful, functional, and user-centered digital experiences
- Strong foundation in both frontend and backend development
- Enjoys turning complex problems into simple, elegant solutions
- When not coding, explores new technologies, contributes to open-source projects, and shares knowledge with the developer community
- Believes in writing clean, maintainable code and always strives to learn and grow
- Goal is to build products that make a difference and create value for users

**Skills & Technologies:**
- Frontend: React, Vue.js, TypeScript, Tailwind CSS, Next.js
- Backend: Node.js, Express, Python, MongoDB, PostgreSQL
- Tools: Git, Docker, AWS, CI/CD, Linux

**Interests:**
- Coding: Passionate about building elegant solutions
- Learning: Always exploring new technologies
- Innovation: Creating impactful digital experiences
- Open Source: Contributing to the community
- Anime: Loves anime, favorite anime is Steins Gate
- VTubers: Big fan of Hoshimachi Suisei

**Social Links:**
- GitHub: [Your GitHub username/URL] (users can ask for the link)

**Education:** (optional)
- [Your Degree, University, Year]

**Experience:** (optional)
- [Your work experience or projects]

Be friendly, helpful, and conversational. Answer questions about the portfolio owner's skills, projects, interests (including anime and VTubers), social links, background, and general software development topics. Keep responses concise but informative. When asked about social links like GitHub, provide the link or username.
`;

// Initialize LangChain with OpenRouter
let langchainChain = null;
let useLangChain = false;

if (OPENROUTER_API_KEY) {
    try {
        // For OpenRouter, we need to pass the API key in Authorization header
        // ChatOpenAI requires openAIApiKey, but OpenRouter uses it differently
        const model = new ChatOpenAI({
            modelName: "kwaipilot/kat-coder-pro:free",
            openAIApiKey: OPENROUTER_API_KEY, // Required by ChatOpenAI constructor
            configuration: {
                baseURL: OPENROUTER_BASE_URL,
                apiKey: OPENROUTER_API_KEY, // Also set here for OpenRouter
                defaultHeaders: {
                    "HTTP-Referer": "http://localhost:5000", // Optional: for OpenRouter analytics
                    "X-Title": "Portfolio Chatbot", // Optional: for OpenRouter analytics
                    "Authorization": `Bearer ${OPENROUTER_API_KEY}` // OpenRouter requires Bearer token
                }
            },
            temperature: 0.7,
        });

        const memory = new BufferMemory({
            returnMessages: true,
            memoryKey: "history"
        });

        const prompt = ChatPromptTemplate.fromMessages([
            ["system", personalInfo],
            new MessagesPlaceholder("history"),
            ["human", "{input}"]
        ]);

        langchainChain = new ConversationChain({
            llm: model,
            memory: memory,
            prompt: prompt,
        });

        useLangChain = true;
        console.log('LangChain with OpenRouter initialized successfully');
    } catch (error) {
        console.error('Error initializing LangChain:', error);
        console.log('Falling back to Flowise or error responses');
    }
} else {
    console.log('OPENROUTER_API_KEY not found. Using Flowise or fallback mode.');
}

// Initialize profanity filter
const filter = new Filter();
// You can add custom words to the filter if needed
// filter.addWords('customword1', 'customword2');
// You can also remove words from the filter if they're false positives
// filter.removeWords('hell'); // 'hell' might be used in legitimate contexts

// Input moderation function using third-party library
const moderateInput = (input) => {
    if (!input || typeof input !== 'string') {
        return { isValid: false, reason: 'Invalid input format' };
    }

    // Normalize input for checking (decode common encodings to catch obfuscated attacks)
    let normalizedInput = input.trim();
    
    // Decode URL encoding to catch obfuscated injection attempts
    try {
        normalizedInput = decodeURIComponent(normalizedInput);
    } catch (e) {
        // If decoding fails, use original input
    }

    // Check for empty or very short inputs
    if (normalizedInput.length < 2) {
        return { isValid: false, reason: 'Input is too short' };
    }

    // Check for extremely long inputs (potential spam/abuse)
    if (normalizedInput.length > 1000) {
        return { isValid: false, reason: 'Input is too long' };
    }

    // Use bad-words library to check for profanity
    if (filter.isProfane(normalizedInput)) {
        return { isValid: false, reason: 'Input contains inappropriate language' };
    }

    // Additional custom patterns for threats and spam
    const harmfulPatterns = [
        // Threats (context-aware - some words might be legitimate in other contexts)
        /\b(kill|murder|harm|hurt|attack|violence|bomb|weapon)\s+(you|me|them|us|him|her|yourself)\b/i,
        // Spam patterns
        /(spam|advertisement|promotion|buy now|click here|limited time offer)/i,
        // Excessive repetition (potential spam)
        /(.)\1{10,}/, // Same character repeated 10+ times
    ];

    // Check against additional harmful patterns
    for (const pattern of harmfulPatterns) {
        if (pattern.test(normalizedInput)) {
            return { isValid: false, reason: 'Input contains inappropriate content' };
        }
    }

    // Check for excessive special characters (potential injection attempts)
    const specialCharCount = (normalizedInput.match(/[<>{}[\]\\|`~!@#$%^&*()_+=]/g) || []).length;
    if (specialCharCount > normalizedInput.length * 0.3) {
        return { isValid: false, reason: 'Input contains too many special characters' };
    }

    // Comprehensive SQL Injection patterns
    const sqlInjectionPatterns = [
        // Basic SQL commands
        /\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|TRUNCATE|MERGE)\b/i,
        // SQL injection techniques
        /(\bOR\b|\bAND\b)\s+['"]?\d+['"]?\s*=\s*['"]?\d+/i, // OR 1=1, AND 1=1
        /\bUNION\s+(ALL\s+)?SELECT\b/i, // UNION SELECT
        /(\bOR\b|\bAND\b)\s+['"]?1['"]?\s*=\s*['"]?1/i, // OR '1'='1
        /;\s*(DROP|DELETE|TRUNCATE|ALTER)/i, // Command chaining
        /(\bOR\b|\bAND\b)\s+['"]?['"]?\s*=\s*['"]?['"]?/i, // OR ''=''
        /\b(SLEEP|WAITFOR|DELAY)\s*\(/i, // Time-based SQL injection
        /\b(BENCHMARK|PG_SLEEP)\s*\(/i, // MySQL/PostgreSQL time delays
        /(\bOR\b|\bAND\b)\s+\d+\s*=\s*\d+/i, // OR 1=1 variations
        /\bINTO\s+(OUTFILE|DUMPFILE)\b/i, // File writing attempts
        /\bLOAD_FILE\s*\(/i, // File reading attempts
        /\bCONCAT\s*\(/i, // SQL string concatenation (often in injections)
        /\bCHAR\s*\(/i, // SQL CHAR function (often used in obfuscation)
        /\bASCII\s*\(/i, // SQL ASCII function
        /\bSUBSTRING\s*\(/i, // SQL SUBSTRING (often in blind SQLi)
        /\bCAST\s*\(/i, // SQL CAST (type conversion attacks)
        /\bCONVERT\s*\(/i, // SQL CONVERT
        /\bEXEC\s*\(/i, // SQL EXEC
        /\bSP_EXECUTESQL\b/i, // SQL Server stored procedure
        /\bXP_CMDSHELL\b/i, // SQL Server extended procedure
        /\bINFORMATION_SCHEMA\b/i, // Database schema enumeration
        /\bSYS\./i, // Oracle system tables
        /\bpg_/i, // PostgreSQL system functions
    ];

    // XSS (Cross-Site Scripting) patterns
    const xssPatterns = [
        // Script tags
        /<script[\s>]/i,
        /<\/script>/i,
        // JavaScript protocol
        /javascript\s*:/i,
        /data\s*:\s*text\/html/i, // Data URI with HTML
        /vbscript\s*:/i, // VBScript protocol
        // Event handlers
        /\bon\w+\s*=/i, // onerror=, onclick=, onload=, etc.
        /\bonerror\s*=/i,
        /\bonload\s*=/i,
        /\bonclick\s*=/i,
        /\bonmouseover\s*=/i,
        /\bonfocus\s*=/i,
        /\bonblur\s*=/i,
        // HTML injection
        /<iframe[\s>]/i,
        /<object[\s>]/i,
        /<embed[\s>]/i,
        /<link[\s>]/i,
        /<meta[\s>]/i,
        /<style[\s>]/i,
        // SVG with script
        /<svg[\s>].*<script/i,
        // Expression injection (IE)
        /expression\s*\(/i,
        // Base64 encoded scripts
        /data\s*:\s*text\/html;base64/i,
        // HTML entities in suspicious contexts
        /&#x?[0-9a-f]+;.*script/i,
        // JavaScript functions commonly used in XSS
        /\b(eval|Function|setTimeout|setInterval)\s*\(/i,
        /\bdocument\.(cookie|write|writeln|location)/i,
        /\bwindow\.(location|open|eval)/i,
        /\binnerHTML\s*=/i,
        /\bouterHTML\s*=/i,
        /\bXMLHttpRequest/i,
        /\bfetch\s*\(/i,
    ];

    // Command Injection patterns (context-aware to avoid false positives)
    const commandInjectionPatterns = [
        // Command chaining with suspicious commands
        /;\s*(rm|cat|ls|pwd|whoami|id|uname|wget|curl|nc|netcat|sh|bash|cmd|powershell)/i,
        /\|\s*(rm|cat|ls|pwd|whoami|id|uname|wget|curl|nc|netcat|sh|bash|cmd|powershell)/i,
        // Command substitution (backticks and $())
        /`[^`]*(rm|cat|ls|pwd|whoami|id|uname|wget|curl|nc|netcat|sh|bash|cmd|powershell)[^`]*`/i,
        /\$\([^)]*(rm|cat|ls|pwd|whoami|id|uname|wget|curl|nc|netcat|sh|bash|cmd|powershell)[^)]*\)/i,
        // Path traversal attempts (multiple occurrences)
        /(\.\.\/){2,}/, // Multiple ../ (e.g., ../../)
        /(\.\.\\){2,}/, // Multiple ..\ (e.g., ..\..\)
        /\.\.%2F.*\.\.%2F/i, // URL encoded multiple ../
        /\.\.%5C.*\.\.%5C/i, // URL encoded multiple ..\
        // Windows command injection
        /\b(cmd|powershell|pwsh)\s*\/[ck]/i,
        // Unix command injection
        /\b(sh|bash|zsh|ksh)\s+-c\s+['"]/i,
        // Dangerous commands
        /\b(rm\s+-rf|del\s+\/f|format\s+\w+|mkfs|dd\s+if=)/i,
        // Process execution functions
        /\b(exec|system|popen|shell_exec|passthru|proc_open)\s*\(/i,
        // Suspicious shell variable usage
        /\$\{[^}]*\}/, // ${variable} syntax
        // Multiple command separators in sequence (highly suspicious)
        /[;&|]{2,}/, // Multiple separators like ;; or && or ||
    ];

    // NoSQL Injection patterns
    const nosqlInjectionPatterns = [
        /\$where/i, // MongoDB $where
        /\$ne\s*:/i, // MongoDB $ne (not equal)
        /\$gt\s*:/i, // MongoDB $gt (greater than)
        /\$lt\s*:/i, // MongoDB $lt (less than)
        /\$regex/i, // MongoDB $regex
        /\$exists/i, // MongoDB $exists
        /\$in\s*:/i, // MongoDB $in
        /\$nin\s*:/i, // MongoDB $nin (not in)
        /\$or\s*:/i, // MongoDB $or
        /\$and\s*:/i, // MongoDB $and
        /\$nor\s*:/i, // MongoDB $nor
        /\$not\s*:/i, // MongoDB $not
        /\$size\s*:/i, // MongoDB $size
        /\$type\s*:/i, // MongoDB $type
        /\$elemMatch/i, // MongoDB $elemMatch
        /\$text/i, // MongoDB $text
        /\$mod\s*:/i, // MongoDB $mod
        /\$all\s*:/i, // MongoDB $all
    ];

    // LDAP Injection patterns (context-aware)
    const ldapInjectionPatterns = [
        // LDAP filter injection patterns
        /\(&[^)]*\)/, // LDAP AND filter
        /\(\|[^)]*\)/, // LDAP OR filter
        /\(![^)]*\)/, // LDAP NOT filter
        /\*\)/, // Wildcard closing
        // Multiple LDAP operators (suspicious)
        /[&|!]{2,}/, // Multiple operators
        // LDAP injection with user input patterns
        /\([&|!].*[=<>].*\)/, // LDAP filter with operators
    ];

    // XML/XXE Injection patterns
    const xmlInjectionPatterns = [
        // External entity declarations (XXE)
        /<!ENTITY\s+\w+\s+SYSTEM/i,
        /<!ENTITY\s+\w+\s+PUBLIC/i,
        /<!DOCTYPE\s+\w+[^>]*SYSTEM/i,
        /<!DOCTYPE\s+\w+[^>]*PUBLIC/i,
        // Entity references in suspicious contexts
        /%[a-zA-Z0-9_]+;.*(file|http|ftp|php|expect):/i,
        /&[a-zA-Z0-9_]+;.*(file|http|ftp|php|expect):/i,
        // CDATA sections (can be used for obfuscation)
        /<\!\[CDATA\[.*(script|eval|exec)/i,
    ];

    // Combine all injection patterns
    const allInjectionPatterns = [
        ...sqlInjectionPatterns,
        ...xssPatterns,
        ...commandInjectionPatterns,
        ...nosqlInjectionPatterns,
        ...ldapInjectionPatterns,
        ...xmlInjectionPatterns,
    ];

    // Check for injection patterns
    for (const pattern of allInjectionPatterns) {
        if (pattern.test(normalizedInput)) {
            return { isValid: false, reason: 'Input contains potentially harmful code or injection attempts' };
        }
    }

    // Check for encoded injection attempts (double encoding, hex, etc.)
    const encodedPatterns = [
        /%3Cscript/i, // URL encoded <script
        /%3C%2Fscript/i, // URL encoded </script
        /&#60;script/i, // HTML entity <script
        /&#x3C;script/i, // Hex entity <script
        /\\x3Cscript/i, // Hex escape <script
        /\\u003Cscript/i, // Unicode escape <script
    ];

    for (const pattern of encodedPatterns) {
        if (pattern.test(input)) { // Check original input for encoded patterns
            return { isValid: false, reason: 'Input contains encoded potentially harmful code' };
        }
    }

    return { isValid: true };
};

// API health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Portfolio API is running' });
});

// Serve React app in production (only if dist exists - for single-server deployment)
// For Render separate frontend/backend, this won't run
if (NODE_ENV === 'production' && fs.existsSync(path.join(__dirname, '../client/dist'))) {
    // Catch all handler: send back React's index.html file for client-side routing
    app.get('*', (req, res) => {
        // Don't serve index.html for API routes
        if (req.path.startsWith('/api')) {
            return res.status(404).json({ error: 'API route not found' });
        }
        res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
} else {
    // Development mode or separate frontend/backend deployment
    app.get('/', (req, res) => {
        res.json({ 
            message: 'Portfolio API is running',
            mode: NODE_ENV,
            endpoints: {
                health: '/api/health',
                chat: '/api/chat'
            }
        });
    });
}

// Chat endpoint - tries LangChain first, then Flowise, then fallback
app.post('/api/chat', async (req, res) => {
    try {
        const { question } = req.body;

        if (!question) {
            return res.status(400).json({ 
                text: "Please provide a question." 
            });
        }

        // Moderate input before processing
        const moderation = moderateInput(question);
        if (!moderation.isValid) {
            return res.status(400).json({
                text: "I'm sorry, but I can't process that input. Please ask a different question."
            });
        }

        // Try LangChain first if available
        if (useLangChain && langchainChain) {
            try {
                const response = await langchainChain.invoke({
                    input: question
                });

                return res.json({
                    text: response.response || response.output || "I'm not sure how to respond to that."
                });
            } catch (langchainError) {
                console.error('LangChain error:', langchainError);
                // Fall through to Flowise or fallback
            }
        }

        // Try Flowise if LangChain is not available or failed
        if (FLOWISE_API_URL && !FLOWISE_API_URL.includes('YOUR_FLOW_ID')) {
            try {
                const headers = {
                    'Content-Type': 'application/json'
                };
                
                // Add Flowise API key if provided (for Flowise Cloud authentication)
                if (FLOWISE_API_KEY) {
                    headers['Authorization'] = `Bearer ${FLOWISE_API_KEY}`;
                }
                
                const response = await fetch(FLOWISE_API_URL, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({ question })
                });

                if (response.ok) {
                    const data = await response.json();
                    return res.json(data);
                }
            } catch (flowiseError) {
                console.error('Flowise error:', flowiseError);
            }
        }

        // Fallback response
        res.json({
            text: "I'm currently not connected to my AI brain. Please check the server configuration. Make sure OPENROUTER_API_KEY is set in your .env file, or Flowise is properly configured."
        });

    } catch (error) {
        console.error('Error in chat endpoint:', error);
        res.status(500).json({
            text: "Sorry, something went wrong. Please try again later."
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    if (useLangChain) {
        console.log('Chatbot: LangChain with OpenRouter is active');
    } else if (FLOWISE_API_URL && !FLOWISE_API_URL.includes('YOUR_FLOW_ID')) {
        console.log('Chatbot: Flowise mode (LangChain not configured)');
    } else {
        console.log('Chatbot: Please configure OPENROUTER_API_KEY or FLOWISE_API_URL');
    }
});
