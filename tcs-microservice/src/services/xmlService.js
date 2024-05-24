const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

class XmlService {
  async parseXmlFile(filename) {
    const filePath = path.join(__dirname, '..', 'downloads', filename);
    const xmlContent = fs.readFileSync(filePath, 'utf-8');
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(xmlContent);

    const info = {
      cNF: result.nfeProc.NFe[0].infNFe[0].$.Id,
      emitCNPJ: result.nfeProc.NFe[0].infNFe[0].emit[0].CNPJ[0],
      emitNome: result.nfeProc.NFe[0].infNFe[0].emit[0].xNome[0],
      destCNPJ: result.nfeProc.NFe[0].infNFe[0].dest[0].CNPJ[0],
      destNome: result.nfeProc.NFe[0].infNFe[0].dest[0].xNome[0],
      produtos: result.nfeProc.NFe[0].infNFe[0].det.map((det) => ({
        descricao: det.prod[0].xProd[0],
        peso: det.prod[0].qCom[0]
      }))
    };

    return info;
  }
}

module.exports = new XmlService();
