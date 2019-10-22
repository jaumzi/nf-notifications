module.exports = {
  alertsModel(data) {
    let alertHtml = "";
    data.forEach(d => {
      alertHtml += `
      <div
        class="content box"
        style="width: 100%;max-width: 700px;border-collapse: collapse;padding: 12px 8px;margin: 8px auto;box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.25);border-radius: 10px;background-color: white;"
      >
        <div class="content-header-title" style="float: left;padding: 0px 8px;">
          <h3 style="
      white-space: nowrap;
      width: 100%;
      max-width: 540px;
      overflow: hidden;
      text-overflow: ellipsis;
      " >${d.title.trim()}</h3>
        </div>
        <div
          class="content-header-time"
          style="float: right;padding: 0px 12px;"
        >
          <p>${d.time.trim()}</p>
        </div>
        <div class="content-body" style="padding: 12px 8px;clear: both;">
          <p>${d.content.replace("\n", "").trim()}</p>
        </div>
        <div class="content-action">
          <a
            class="link"
            href="${d.link.trim()}"
            target="_blank"
            style="color: inherit;text-decoration: none;"
          >
            <div
              class="button"
              style="background: rgba(0, 0, 0, 0.6);margin: 8px auto;width: 200px;height: 50px;overflow: hidden;text-align: center;transition: 0.2s;cursor: pointer;border-radius: 3px;box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.2);"
            >
              <p
                class="btnText"
                style="color: white;transition: 0.3s;margin-block-start: 1em;margin-block-end: 1em;text-transform: uppercase;font-weight: bold;letter-spacing: 1px;"
              >
                Ver no site
              </p>
            </div>
          </a>
        </div>
      </div>
      `;
    });
    const html = `
    <html>
  <style>
    @import url(https://fonts.googleapis.com/css?family=Roboto:400);
    * {
        font-family: Roboto;
    }
  </style>
  <body style="margin: 0; background-color: #49abff;">
    <div style="height: 100%; background-color: #49abff; margin-bottom: 20px">
      <br />
      <br />
      <h1 style="color: white; text-align: center;">
        SNN - Sistema de notificação de NF
      </h1>
      <br />
    ${alertHtml}
    <br />
    <br />
    </div>
  </body>
</html>
      `;
    return html;
  }
};
