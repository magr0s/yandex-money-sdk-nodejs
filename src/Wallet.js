const Http = require('./Http');

const { MONEY_URI } = require('./config');


class WalletApi {
  /**
   *
   * @param {string} accessToken
   * @param {object} [params]
   * @param {object} [params.requestOptions]
   */
  constructor (accessToken, params = {}) {
    const {
      requestOptions = {}
    } = params;

    this.accessToken = accessToken;
    this.requestOptions = requestOptions;
  }

  /**
   *
   * @returns {Promise<*|void>}
   */
  accountInfo () {
    return this.sendRequest('/api/account-info');
  }

  /**
   *
   * @param {object} [params]
   * @param {string} [params.type]
   * @param {string} [params.label]
   * @param {string} [params.from] - datetime
   * @param {string} [params.till] - datetime
   * @param {string} [params.startRecord]
   * @param {number} [params.records]
   * @param {boolean} [params.details]
   * @returns {Promise<*>}
   */
  operationHistory (params) {
    return this.sendRequest('/api/operation-history', params)
      .then((result) => {
        const { error } = result;

        if (error) throw new Error(error);

        return result;
      });
  }

  /**
   * @param {string} id
   * @returns {Promise<*>}
   */
  operationDetails (id) {
    return this.sendRequest('/api/operation-details', {
      operation_id: id
    })
      .then((result) => {
        const { error } = result;

        if (error) throw new Error(error);

        return result;
      });
  }

  /**
   *
   * @param {string} endpoint
   * @param {object} [data]
   * @returns {Promise<*|void>}
   */
  sendRequest (endpoint, data) {
    const url = MONEY_URI + endpoint;

    const { headers = {} } = this.requestOptions;

    const options = Object.assign({}, this.requestOptions, {
      method: 'POST',
      url,
      data,
      headers: Object.assign({}, headers, {
        Authorization: `Bearer ${this.accessToken}`
      })
    });

    console.log(options)

    return Http.request(options);
  }
}

module.exports = WalletApi;
