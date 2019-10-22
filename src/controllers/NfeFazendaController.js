const Controller = require("./Controller");

async function searchMethod() {
  const browser = await Controller.createBrowser();
  const page = await Controller.createPage(browser);
  await page.goto(
    "http://www.nfe.fazenda.gov.br/portal/informe.aspx?ehCTG=false&page=0&pagesize=999999999"
  );

  // aguarda exibir esta seção para iniciar script
  await page.waitForSelector("div#conteudoDinamico");
  // injeção de script
  let data = await page.evaluate(() => {
    const articles = [];
    let articlesEl = document.querySelectorAll("div.divInforme");
    articlesEl.forEach(article => {
      let text = article.innerText;
      let header = text.split("\n\n", 1)[0];
      // let content = text.split(header)[1].replace("\n", "999").trim();
      let content = text.split(header)[1].trim();

      articles.push({
        time: header.split(" - ")[0],
        title: header.split(" - ")[1],
        content,
        link: "http://www.nfe.fazenda.gov.br/portal/informe.aspx?ehCTG=false&page=0&pagesize=999999999",
        sended: false
      });
    });
    return articles;
  });
  await browser.close(); // fecha navegador

  if (data.length > 0) {
    let dataForSave = [];
    let fileData = await Controller.loadFile("./src/files/alerts.txt");

    data.forEach(dt => {
      let found = false;
      fileData.forEach(fdt => {
        if (dt.time === fdt.time && dt.title === fdt.title) {
          found = true;
        }
      });
      if (!found) {
        dataForSave.push(dt);
        fileData.push(dt);
      }
    });
    await Controller.saveFile("./src/files/alerts.txt", fileData);
  }
}

module.exports = {
  async search() {
    await searchMethod();
  },
  async searchForce(req, res) {
    await searchMethod();
    return res.json({});
  },
  async list(req, res) {
    let data = [];
    // pegar valores anteriores
    data = await Controller.loadFile("./src/files/alerts.txt");
    //console.log(data);
    return res.json(data);
  }
};
