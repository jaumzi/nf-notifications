const fs = require("fs");
const puppeteer = require("puppeteer");

module.exports = {
  async registerLog(obj) {
    let logs = await this.loadFile("./src/files/logs.txt");
    logs.push({ ...obj, date: new Date().toLocaleString("pt-Br") });
    await this.saveFile("./src/files/logs.txt", logs);
  },
  async saveFile(path, data) {
    await fs.writeFile(path, JSON.stringify(data), function(err) {
      if (err) {
        console.log(`Erro ao salvar arquivo '${path}': ${err}`);
        return false;
      }
      return true;
    });
  },
  async loadFile(path) {
    let data = await fs.readFileSync(path, {
      encoding: "utf-8",
      flag: "as+"
    });
    return data ? JSON.parse(data) : [];
  },
  async createBrowser() {
    return await puppeteer.launch({
      headless: true // false exibe navegador, true esconde
    });
  },
  async createPage(browser) {
    const page = await browser.newPage(); // abre navegador
    await page.setRequestInterception(true); // interceptar requisição
    page.on("request", req => {
      if (
        req.resourceType() === "stylesheet" ||
        req.resourceType() == "font" ||
        req.resourceType() === "font"
      ) {
        req.abort(); // bloquear CSS, fontes e imagens
      } else {
        req.continue(); // continuar
      }
    });
    await page.setViewport({ width: 920, height: 520 }); // define tamanho da janela
    return page;
  }
};
