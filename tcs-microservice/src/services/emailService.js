const imaps = require('imap-simple');
const fs = require('fs');
const path = require('path');

class EmailService {
  async getEmails({ email, password, host, port }) {
    const connection = await imaps.connect({
      imap: {
        user: email,
        password: password,
        host: host,
        port: port,
        tls: true,
        authTimeout: 3000
      }
    });

    await connection.openBox('INBOX');

    const searchCriteria = ['UNSEEN'];
    const fetchOptions = { bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)'], struct: true };

    const messages = await connection.search(searchCriteria, fetchOptions);

    for (let message of messages) {
      const all = imaps.getParts(message.attributes.struct);
      const attachments = all.filter(part => part.disposition && part.disposition.type === 'attachment');

      for (let attachment of attachments) {
        const partData = await connection.getPartData(message, attachment);
        if (attachment.params.name.endsWith('.xml')) {
          const filePath = path.join(__dirname, '..', 'downloads', attachment.params.name);
          fs.writeFileSync(filePath, partData);
        }
      }
    }

    await connection.end();
  }
}

module.exports = new EmailService();
