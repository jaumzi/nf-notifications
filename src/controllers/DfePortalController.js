const Controller = require("./Controller");

async function searchMethod() {
  let data = [];
  const browser = await Controller.createBrowser();
  const page = await Controller.createPage(browser);
  await page.goto("https://dfe-portal.svrs.rs.gov.br/Mdfe/Avisos");
  // aguarda exibir esta seção para iniciar script
  await page.waitForSelector("section#pagedlistItens");

  // injeção de script
  data = await page.evaluate(() => {
    let articles = [];
    // inicio de mapeamento html
    let articlesEl = document.querySelectorAll("article.conteudo-lista__item");
    articlesEl.forEach(article => {
      let contentEls = article.querySelectorAll("p");
      let content = "";
      let contentElsFiltered = [];
      contentEls.forEach(c => {
        if (!!c.innerText.replace("\n", "").trim()) {
          contentElsFiltered.push(c);
        }
      });
      contentElsFiltered.forEach((c, i) => {
        let contentC = c.innerText.replace("\n", "").trim();
        content += contentC;
        if (contentElsFiltered.length > i + 1) {
          if (!!contentC) {
            content += " ";
          }
        }
      });

      articles.push({
        time: article.querySelector(
          "article.conteudo-lista__item > header > time"
        ).innerText,
        title: article.querySelector(
          "article.conteudo-lista__item > header > h2 > a"
        ).innerText,
        content,
        link: "https://dfe-portal.svrs.rs.gov.br/Mdfe/Avisos",
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
    return res.json(data);
  }
};
