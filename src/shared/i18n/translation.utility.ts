export class Translation {
  static Translator(
    lang = 'en',
    file: string,
    variable: string,
    parameters: {} = {},
  ) {
    let jsonData;

    switch (lang.toLowerCase()) {
      case 'en':
        jsonData = require(process.cwd() + `/src/shared/i18n/en/${file}.json`);
        break;

      default:
        jsonData = require(process.cwd() + `/src/shared/i18n/en/${file}.json`);
        break;
    }

    let msgData = jsonData[`${variable}`];

    if (!msgData) {
      jsonData = require(process.cwd() + `/src/shared/i18n/en/${file}.json`);
      msgData = jsonData[`${variable}`];

      if (!msgData) {
        msgData = variable;
      }
    }

    function renderString(msg: string, object) {
      return msg.match(/\{(.*?)\}/gi).reduce((acc, binding) => {
        const property = binding.substring(1, binding.length - 1);
        const str = acc == '' || acc == null ? msg : acc;
        return `${str.replace(/\{(.*?)\}/, object[property])}`;
      }, '');
    }
    if (msgData.match(/\{(.*?)\}/gi)) {
      return renderString(msgData, parameters);
    } else {
      return msgData;
    }
  }
}
