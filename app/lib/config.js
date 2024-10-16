
let config;

if (process.env.NODE_ENV === 'production') {
    // In production : read config from the environment or use default values
    config = {
        formName: 'anonymous',
        database: process.env.DATABASE_PATH || 'data/submissions.db',

        // Admin credentials to access the dashboard
        adminUsername: process.env.ADMIN_USER || null,
        adminPassword: process.env.ADMIN_PASS || null,
        adminRealm: process.env.ADMIN_REALM || 'Maily-Form Administration',

        // Parameters to send emails
        smtpHost: process.env.SMTP_HOST || null,
        smtpPort: process.env.SMTP_PORT || null,
        smtpUser: process.env.SMTP_USER || null,
        smtpPass: process.env.SMTP_PASS || null,
        smtpSsl: (process.env.SMTP_SSL === "true") || false,
        smtpAuth: (process.env.SMTP_AUTH === "true") || false,

        // Header content for emails
        emailFrom: process.env.EMAIL_FROM || 'noreply@example.com',
        emailTo: process.env.EMAIL_TO || 'noone@example.com',

        // Text content for success and error messages
        messageSuccess: process.env.MESSAGE_SUCCESS || 'Thank you for your submission.',
        messageError: process.env.MESSAGE_ERROR || 'Unable to send your submission',

        subjectSuccess: process.env.SUBJECT_SUCCESS || 'New submission from __FORM_NAME__',
        subjectError: process.env.SUBJECT_ERROR || 'Error in submission from __FORM_NAME__',

        // Allowed recipients
        allowedTo: process.env.ALLOWED_TO || false,

        // Response format (accepts 'json' or 'html')
        responseFormat: process.env.RESPONSE_FORMAT || 'json',

        // Security (or lack-of)
        corsHeader: process.env.CORS_HEADER || '*',

        // Server (should be secure by default)
        host: process.env.HOST || '127.0.0.1',
        port: process.env.PORT || 8080
    }
} else {
    // In test : set hard-coded values
    config = {
        formName: 'anonymous',
        database: 'data/submissions-test.db',

        // Admin credentials to access the dashboard
        adminUsername: 'admin',
        adminPassword: 'admin',
        adminRealm: 'Maily-Form Administration',

        // Parameters to send emails
        smtpHost: 'localhost',
        smtpPort: 1025,
        smtpUser: null,
        smtpPass: null,
        smtpSsl: false,
        smtpAuth: false,

        // Header content for emails
        emailFrom: 'noreply@example.com',
        emailTo: 'noone@example.com',

        // Text content for success and error messages
        messageSuccess: 'Thank you for your submission.',
        messageError: 'Unable to forward your submission',

        subjectSuccess: 'New submission from __FORM_NAME__',
        subjectError: 'Error in submission from __FORM_NAME__',

        // Allowed recipients
        allowedTo: false,

        // Response format (accepts 'json' or 'html')
        responseFormat: 'html',
       
        // Security (or lack-of)
        corsHeader: '*',

        // Server
        host: '127.0.0.1',
        port: 8080
    }
}

module.exports = config;

