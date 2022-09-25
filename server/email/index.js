const path       = require('path');
const _          = require('lodash');
const moment     = require('moment');
const nodemailer = require('nodemailer');
const Email      = require('email-templates');
const config     = require('../config'); 

let transport;

if (config.smtp) {
    transport = nodemailer.createTransport(config.smtp);
}

const email = new Email({
    views: {
        root: path.join(__dirname, 'templates', 'views')
    },
    juice: true,
    juiceResources: {
        preserveImportant: true,
        webResources: {
            relativeTo: path.join(__dirname, 'templates')
        }
    },
    i18n: {},
    message: {
        from: '"CMS-BLOG" <hello@paalamugan.com>'
    },
    preview: false,
    send: true,
    transport: transport || {
        jsonTransport: true
    }
});

const defaultTemplateData = (data) => {

    data = data || {};

    data.locale = data.locale || "en";
    data._ = _;
    data.moment = moment;

    data.app = {
        title: 'CMS-BLOG',
        domain: data.domain || config.domain,
        contactEmail: 'contact@paalamugan.com',
        year: (new Date()).getFullYear()
    }

    return data;
};

const render = async (templateName, type, data) => {

    if (!templateName) {
        throw new Error("template name is missing");
    } else if (!type) {
        throw new Error("template type is missing");
    }

    data = defaultTemplateData(data);

    return email.render(templateName +'/'+ type, data);
};

const renderAll = async (templateName, data) => {

    if (!templateName) {
        throw new Error("template name is missing");
    }

    data = defaultTemplateData(data);

    return email.renderAll(templateName, data);
};

const send = async (templateName, message, data) => {

    if (!templateName) {
        throw new Error("template name is missing");
    }

    data = defaultTemplateData(data);

    return email.send({
        template: templateName,
        message: message,
        locals: data
    });
}

module.exports = {
    render,
    renderAll,
    send
}