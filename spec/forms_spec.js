
const chai = require('chai');
const mocha = require('mocha');
const request = require('request');

const assert = chai.assert;
// const expect = chai.expect;

const describe = mocha.describe;
const beforeEach = mocha.beforeEach;
const afterEach = mocha.afterEach;
const it = mocha.it;

const withSmtpServer = require('./lib/with_smtp_server');

const app = require('../app/server');
var port, server, url;

beforeEach((done) => {
    // create listener with random port & store port when ready
    server = app.listen(0, () => {
        port = server.address().port;
        url = `http://localhost:${port}/`;
        done();
    });
});

afterEach((done) => {
    server.close(done);
});

describe('Forms API', () => {
    describe('POST /', () => {
        it('sends email and returns HTTP status code 200', (done) => {
            let formData = {};

            withSmtpServer({
                onListen: (_server) => {
                    request.post(
                        { url, formData },
                        (_error, response, _body) => {
                            // console.log(error);
                            assert.strictEqual(response.statusCode, 200);
                        }
                    );
                },

                onClose: () => {
                    done();
                }
            });
        });

        it('sends email and takes _replyTo in account in mail header (when set)', (done) => {
            let formData = {
                "_replyTo": 'loveIsAll@example.com'
            };
            let messageCounter = 0;

            withSmtpServer({
                onMessage: (mailObject) => {
                    messageCounter += 1;
                    assert.strictEqual(
                        mailObject.headers['reply-to'],
                        /* eslint-disable-next-line no-underscore-dangle */
                        formData._replyTo
                    );
                },

                onListen: () => {
                    request.post(
                        { url, formData },
                        (_error, _response, _body) => {
                            // do nothing
                        }
                    );
                },

                onClose: () => {
                    assert.strictEqual(messageCounter, 1);
                    done();
                }
            });
        });

        it('sends email and redirects according to _redirectTo (when set)', (done) => {
            let formData = {
                "_redirectTo": 'https://example.com'
            };
            let messageCounter = 0;

            withSmtpServer({
                onMessage: (_mailObject) => { messageCounter += 1; },

                onListen: () => {
                    request.post(
                        { url, formData },
                        (_error, response, _body) => {
                            // Final location must be _redirectTo value
                            assert.strictEqual(
                                response.headers.location,
                                /* eslint-disable-next-line no-underscore-dangle */
                                formData._redirectTo
                            );
                        }
                    );
                },

                onClose: () => {
                    assert.strictEqual(messageCounter, 1);
                    done();
                }
            });

        });

        /*
        it('send email with formName in title (when set)', (done) => {
            let formData = {
                "_formName": 'loveIsAll'
            };
            let messageCounter = 0;

            withSmtpServer({
                onMessage: (mailObject) => {
                    messageCounter += 1;
                    assert.include(
                        mailObject.subject,
                        // eslint-disable-next-line no-underscore-dangle
                        formData._formName
                    );
                },

                onListen: () => {
                    request.post(
                        { url, formData },
                        (_error, _response, _body) => {
                            // do nothing
                        }
                    );
                },

                onClose: () => {
                    assert.strictEqual(messageCounter, 1);
                    done();
                }
            });
        });
        */

        it('blocks email when _t_email is not empty', (done) => {
            let formData = {
                "_t_email": 'iAmABot'
            };

            let messageCounter = 0;
            withSmtpServer({
                onMessage: (_mailObject) => { messageCounter += 1; },

                onListen: () => {
                    request.post(
                        { url, formData },
                        (_error, _response, _body) => {
                            // do nothing
                        }
                    );
                },

                onClose: () => {
                    assert.strictEqual(messageCounter, 0);
                    done();
                }
            });
        });

        it('returns a success message', (done) => {
            let formData = {};
            let messageCounter = 0;

            withSmtpServer({
                onMessage: (_mailObject) => { messageCounter += 1; },

                onListen: () => {
                    request.post(
                        { url, formData },
                        (_error, _response, body) => {
                            // console.log(error);
                            // console.log(body);
                            assert.include(body, 'Success');
                        }
                    );
                },

                onClose: () => {
                    assert.strictEqual(messageCounter, 1);
                    done();
                }
            });
        });
    });
});

