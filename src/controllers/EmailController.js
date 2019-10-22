const nodemailer = require("nodemailer");
const Controller = require("./Controller");
const EmailModel = require("../models/EmailModel");

function sendEmailMethod(
  title = "SNN - Novo aviso",
  to = "joaovribeirojv.rcs@gmail.com",
  html = ""
) {
  const emailAddress = "joaovribeirojv.rcs@gmail.com";
  let transporter = nodemailer.createTransport({
    host: "smtp.googlemail.com", // Gmail Host
    port: 465, // Port
    secure: true, // this is true as port is 465
    auth: {
      user: emailAddress, // email Gmail
      pass: "rcs@123rcs" // senha Gmail
    }
  });

  let mailOptions = {
    from: `"SNN - Sistema de Notificação de NF (RCS)" <${emailAddress}>`,
    to: to, // destino. Multiple emails can send separated by commas
    subject: title, // titulo
    html // conteudo
  };
  let result = false;
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      Controller.registerLog({
        msg: `Falha ao enviar email para ${to}! Erro: ${error}`
      });
      result = false;
    }
    if (info.rejected.length > 0) {
      info.rejected.forEach(rej => {
        Controller.registerLog({ msg: `Email rejeitado por ${rej}!` });
      });
    }
    result = true;
  });
  return result;
}
module.exports = {
  async sendEmail() {
    await sendEmailMethod();
  },
  async sendEmailForce(req, res) {
    await sendEmailMethod();
    return res.json({});
  },
  async sendAlerts() {
    console.log("Processando alertas");
    let data = [];
    data = await Controller.loadFile("./src/files/alerts.txt");

    let dataForSend = data.filter(d => !d.sended);
    if (dataForSend.length > 0) {
      let model = EmailModel.alertsModel(dataForSend);

      const users = await Controller.loadFile("./src/files/users.txt");
      users.forEach(async user => {
        console.log("Enviar para " + user.email);
        sendEmailMethod("SNN - Novo alerta", user.email, model);
      });

      console.log("Alertas enviados!");
      // alterar status sended
      data = data.map(d => {
        return { ...d, sended: true };
      });
      await Controller.saveFile("./src/files/alerts.txt", data);
    } else {
      console.log("Sem alertas para enviar!");
    }
  }
};
