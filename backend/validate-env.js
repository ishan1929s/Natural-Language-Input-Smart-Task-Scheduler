import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Required environment variables
const requiredEnvVars = [
    'MONGODB_URL',
    'JWT_ACCESS_TOKEN',
    'JWT_REFRESH_TOKEN',
    'PORT'
];

// Optional environment variables (with defaults)
const optionalEnvVars = {
    'NODE_ENV': 'development',
    'EMAIL_HOST': '',
    'EMAIL_PORT': '587',
    'EMAIL_USER': '',
    'EMAIL_PASS': '',
    'WIT_API_KEY': '',
    'MICROSOFT_SPEECH_KEY': '',
    'MICROSOFT_SPEECH_REGION': ''
};

// Validate required environment variables
function validateEnvironment() {
    const missingVars = [];
    
    // Check required variables
    for (const envVar of requiredEnvVars) {
        if (!process.env[envVar]) {
            missingVars.push(envVar);
        }
    }
    
    // Set optional variables with defaults
    for (const [envVar, defaultValue] of Object.entries(optionalEnvVars)) {
        if (!process.env[envVar]) {
            process.env[envVar] = defaultValue;
        }
    }
    
    if (missingVars.length > 0) {
        console.error('Missing required environment variables:');
        missingVars.forEach(varName => {
            console.error(`   - ${varName}`);
        });
        console.error('\nPlease create a .env file with the required variables.');
        process.exit(1);
    }
    
    console.log('Environment variables validated successfully');
}

// Export validation function
export { validateEnvironment };

// Run validation if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    validateEnvironment();
}
