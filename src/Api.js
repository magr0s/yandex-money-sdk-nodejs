const querystring = require('querystring');
const Http = require('./Http');

const { MONEY_URI } = require('./config');

class YandexMoneyApi {
  /**
   *
   * @param {string} clientId
   * @param {string} redirectURI
   * @param {string[]} scope
   * @param {string} [instanceName]
   * @returns {string}
   */
  static buildObtainTokenUrl (
    clientId,
    redirectURI,
    scope = [],
    instanceName
  ) {
    const queryStr = querystring.stringify({
      client_id: clientId,
      instance_name: instanceName,
      redirect_uri: redirectURI,
      scope: scope.join(' '),
      response_type: 'code'
    });

    return `${MONEY_URI}/oauth/authorize?${queryStr}`;
  }

  /**
   *
   * @param {string} clientId
   * @param {string} code
   * @param {string} redirectURI
   * @param {string} [clientSecret]
   * @param {object} [requestOptions]
   * @returns {Promise}
   */
  static getAccessToken (
    clientId,
    code,
    redirectURI,
    clientSecret,
    requestOptions = {}
  ) {
    const data = {
      client_id: clientId,
      code,
      redirect_uri: redirectURI,
      client_secret: clientSecret,
      grant_type: 'authorization_code'
    };

    const options = Object.assign({}, requestOptions, {
      method: 'POST',
      url: `${MONEY_URI}/oauth/token`,
      data
    });

    return Http.request(options)
      .then((result) => {
        const {
          error,
          access_token: accessToken
        } = result;

        switch (error) {
          case 'invalid_request': throw new Error('Invalid request.');
          case 'unauthorized_client': throw new Error('Unauthorized client.');
          case 'invalid_grant': throw new Error('Invalid grant.');

          default: if (!accessToken) throw new Error('Token undefined.');
        }

        return accessToken;
      });
  }
}

module.exports = YandexMoneyApi;
