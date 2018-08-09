
# Maily Form

![Travis](https://travis-ci.org/glenux/contrib-maily-form.svg?branch=master) | ![Docker Pulls](https://img.shields.io/docker/pulls/jlelse/maily-form.svg)

*Available on [DockerHub](https://hub.docker.com/r/jlelse/maily-form/)*

This is a self-hosted service you can use to place forms on static sites. It uses [nodemailer](https://nodemailer.com/about/) and you can host it with Docker. 


:warning: __It is currently in development and it's not advised to use in production yet.__

## Server parameters

To run the server, you must set a few environment variables from the list below.

### Parameters that control email delivery

| Name          | Type     | Default value | Usage                           |
|---------------|----------|---------|----------------------------------------|
| **`SMTP_USER`** | required |       - | The SMTP user                          |
| **`SMTP_PASS`** | required |       - | The SMTP password                      |
| **`SMTP_HOST`** | required |       - | The SMTP host                          |
| **`SMTP_PORT`** | required |       - | The SMTP port                          |
| **`SMTP_SSL`**  | optional | `false` | If the SMTP server uses encryption     |
| **`SMTP_AUTH`** | optional | `false` | If the SMTP server uses authentication |

### Parameters that control email headers

| Name          | Type     | Default value | Usage                           |
|----------------|----------|---|--------------------------------------------|
| **`EMAIL_FROM`** | required | - | The sender (ex: `Forms forms@example.com`) |
| **`EMAIL_TO`**   | required | - | Default recipient                          |


### Parameters that control the service

| Name          | Type     | Default value | Usage                           |
|---------------|----------|---------------|---------------------------------------------|
| **`PORT`**        | optional |        `8080` | The port on which the server should listen  |
| **`HOST`**        | optional | `"127.0.0.1"` | The host on which the server should listen  |
| **`ALLOWED_TO`**  | optional | the value of `EMAIL_TO` | All allowed recipients                      |
| **`CORS_HEADER`** | optional |         `"*"` | The Access-Control-Allow-Origin CORS header |

### Parameters that control the admin panel 

If you want to use the admin panel at `/admin`, you have to set this too:  

| Name          | Type     | Default value | Usage                           |
|--------------------|----------|-------------------------------|----------------|
| **`ADMIN_USER`** | optional |                             - | Admin username |
| **`ADMIN_PASS`** | optional |                             - | Admin password |
| **`ADMIN_REALM`**    | optional | `"Maily-Form Administration"` | Admin realm    |

## Special form fields

| Name              | Type     | Default value | Usage                           |
|-------------------|----------|---|----------------|
| **`_to`**         | optional | - | Recipient, if `ALLOWED_TO` is set, it must be in that list, hidden |
| **`_replyTo`**    | optional | - | Email address which should be configured as replyTo, (most probably not hidden)  |
| **`_redirectTo`** | optional | - | URL to redirect to, hidden |
| **`_formName`**   | optional | - | Name of the form, hidden  |
| **`_t_email`**    | optional | - | "Honeypot" field, not hidden, advised (see notice below)  |

You can find a sample in the `form.html` file.

**Notice to the honeypot field:** Maily Form offers the option to use a [Honeypot](https://en.wikipedia.org/wiki/Honeypot\_(computing)) field, which is basically another input, but it's hidden to the user with either a CSS rule or some JavaScript. It is very likely, that your public form will get the attention of some bots some day and then the spam starts. But bots try to fill every possible input field and will also fill the honeypot field. But Maily Form is really clever and refuses to send mails where the honeypot field is filled. So you should definitely use it.

## Installation

You can simply start a Docker container with the parameters listed above. You can also use `docker-compose`.

Sample `docker-compose.yml` file for Maily Form:

```
version: '3'
services:
    forms:
        image: jlelse/maily-form
        container_name: forms
        restart: unless-stopped
        environment:
            - SMTP_USER=mail@example.com
            - SMTP_PASS=yourSUPERsecretPASSWORD123
            - SMTP_HOST=smtp.your-mail-provider.com
            - SMTP_PORT=587
            - SMTP_SSL=true
            - SMTP_AUTH=true
            - EMAIL_TO=mail@example.com
            - EMAIL_FROM="Forms forms@example.com"
            - ALLOWED_TO="mail1@example.com,mail2@example.com"
            - CORS_HEADER="example.com"
```

## Authors 

* Original source code [jlelse](https://about.jlelse.de) mainly for own purposes.
* Contributors:
    * [glenux](https://glenux.net) made it ready for production at [boldcode.io](https://boldcode.io)

## Licence

This project is under the GNU GENERAL PUBLIC LICENCE version 3

