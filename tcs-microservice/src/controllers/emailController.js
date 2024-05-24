const EmailService = require('../services/emailService');
const XmlService = require('../services/xmlService');
const Document = require('../models/document');
const fs = require('fs');
const path = require('path');

class EmailController {
  async getDocuments(req, res) {
    const { email, password, host, port } = req.body;

    try {
      await EmailService.getEmails({ email, password, host, port });

      const files = fs.readdirSync(path.join(__dirname, '..', 'downloads'));
      const xmlFiles = files.filter(file => file.endsWith('.xml'));

      const documents = [];
      for (const file of xmlFiles) {
        const info = await XmlService.parseXmlFile(file);
        documents.push({
          date: new Date(),
          filename: file,
          contentFile: info
        });

        const document = new Document({
          date: new Date(),
          filename: file,
          contentFile: info
        });

        await document.save();
      }

      res.json(documents);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async getInfoDocument(req, res) {
    const { filename } = req.params;

    try {
      const info = await XmlService.parseXmlFile(filename);
      res.json(info);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
}

module.exports = new EmailController();
