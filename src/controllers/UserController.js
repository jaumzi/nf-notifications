const Controller = require("./Controller");

module.exports = {
  async save(req, res) {
    const { email } = req.body;
    if (email) {
      let data = [];
      // pegar valores anteriores
      data = await Controller.loadFile("./src/files/users.txt");

      data = data ? JSON.parse(data) : [];
      let user = data.filter(user => user.email === email)[0];
      if (!user) {
        user = { email };
        data.push(user);
        if (await Controller.saveFile("./src/files/users.txt", data)) {
          return res
            .status(500)
            .json({ error: `Erro ao salvar usuario '${user}'! ${err}` });
        }
      }
      return res.json(user);
    }
    return res
      .status(400)
      .json({ error: "Erro na requisição! Email não informado!" });
  },
  async delete(req, res) {
    const { email } = req.body;
    if (email) {
      let data = [];
      // pegar valores anteriores
      data = await Controller.loadFile("./src/files/users.txt");

      data = data ? JSON.parse(data) : [];
      let user = data.filter(user => user.email === email)[0];
      if (user) {
        // excluir
        data = data.filter(user => user.email !== email);
        if (await Controller.saveFile("./src/files/users.txt", data)) {
          return res
            .status(500)
            .json({ error: `Erro ao excluir usuario '${user}'! ${err}` });
        }
        return res.json(user);
      }
      return res.status(500).json({
        error: `Erro na requisição! Usuário '${email}' não encontrado!`
      });
    }
    return res
      .status(400)
      .json({ error: "Erro na requisição! Email não informado!" });
  },
  async list(req, res) {
    let data = [];
    // pegar valores anteriores
    data = await Controller.loadFile("./src/files/users.txt");

    return res.json(data ? JSON.parse(data) : []);
  }
};
