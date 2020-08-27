const axios = require('axios-https-proxy-fix');

class Http {
  /**
   *
   * @param options
   * @returns {Promise<* | void>}
   */
  static async request (options) {
    try {
      const { data } = await axios(options);

      return data;
    } catch (error) {
      console.log(error.message)
      const { response } = error;

      if (response) {
        const { status } = response;

        switch (status) {
          case 400: throw new Error('Invalid request.');
          case 401: throw new Error('Invalid token.');
          case 403: throw new Error('Insufficient scope.');

          default:
        }
      }

      throw error;
    }
  }
}

module.exports = Http;
