var express = require('express');
var auth = require('http-auth');
var formidable = require('formidable');
var nodemailer = require('nodemailer');
var markdown = require('nodemailer-markdown').markdown;

// Setup server
var app = express();
app.get('/', (req, res, next) => {
    return showServiceRunning(res);
});
var basic = auth.basic({
    realm: "Maily-Form Administration"
}, (username, password, callback) => {
    callback(username === (process.env.ADMIN_USERNAME || "Admin") && password === (process.env.ADMIN_PASSWORD || "reallyinsecure"));
});
app.get('/admin', auth.connect(basic), (req, res) => {
    return showAdminUI(res);
});
app.post('/', (req, res) => {
    return processFormFields(req, res);
});
var listener = app.listen(process.env.PORT || 8080, () => {
    console.log("server listening on ", listener.address().port);
});

// Show message that service is running
function showServiceRunning(res) {
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    res.write("<a href=\"https://github.com/jlelse/Maily-Form\">Maily-Form</a> works!");
    res.end();
}

// Show admin UI
function showAdminUI(res) {
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    res.write("Fancy Admin!");
    res.end();
}

// Process Form Fields
function processFormFields(req, res) {
    let text = "**New submission:**  \n";
    let to = process.env.TO;
    let replyTo;
    let redirectTo;
    let formName;
    let botTest = true;
    let form = new formidable.IncomingForm();
    form.on('field', (field, value) => {
        if (field == "_to") to = value;
        else if (field == "_replyTo") replyTo = value;
        else if (field == "_redirectTo") redirectTo = value;
        else if (field == "_formName") formName = value;
        else if (field == "_t_email") botTest = value == "";
        else {
            text += `  \n**${field}**: ${value}`;
        }
    });
    form.on('end', () => {
        if (redirectTo) {
            res.writeHead(302, {
                'location': redirectTo
            })
        }
        else {
            res.writeHead(200, {
                'content-type': 'text/plain'
            });
            res.write(process.env.MESSAGE || 'Thank you for your submission.');
        }
        if (botTest){
            console.log("The submission is probably no spam. Sending mail...");
            sendMail(text, to, replyTo, formName);
        } else {
            console.log(`Didn't send mail. It's probably spam. From: ${replyTo} Message: ${text}`);
        }
        res.end();
    });
    form.parse(req);
}

// Setup nodemailer
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE == "true",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
// Use Markdown
transporter.use('compile', markdown());

// Send mail with text
function sendMail(markdown, to, replyTo, formName) {
    if (process.env.ALLOWED_TO) {
        if (!process.env.ALLOWED_TO.includes(to)) {
            console.log("Tried to send to %s, but that isn't allowed. Sending to %s instead.", to, process.env.TO);
            to = process.env.TO;
        }
    }
    // Setup mail
    let mailOptions = {
        from: process.env.FROM,
        to: to || process.env.TO,
        replyTo: replyTo || process.env.FROM,
        subject: `New submission${formName ? ` on ${formName}` : ''}`,
        markdown: markdown
    };
    console.log('Sending mail: ', mailOptions);
    // Send mail
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Mail %s sent: %s', info.messageId, info.response);
    });
}