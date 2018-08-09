
const nodemailer = require('nodemailer');
const config = require('./config');
const markdown = require('nodemailer-markdown').markdown;

// Setup mailer
const transporterConfig = {
    host: config.smtpHost,
    port: config.smtpPort,
    secure: config.smtpSsl,
    auth: (config.smtpAuth && config.smtpUser && config.smtpPass ? {
        user: config.smtpUser,
        pass: config.smtpPass
    } : false),
    tls: {
        rejectUnauthorized: config.smtpSsl
    }
};

console.log(transporterConfig);

const transporter = nodemailer.createTransport(transporterConfig);

// Use Markdown
transporter.use('compile', markdown());

module.exports = transporter;
