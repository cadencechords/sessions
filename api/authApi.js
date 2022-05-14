const { default: axios } = require("axios");
const API_URL = process.env.API_URL;

class AuthApi {
  static async getMe({ token, client, uid }) {
    try {
      let { data } = await axios.get(`${API_URL}/users/me`, {
        headers: {
          "access-token": token,
          client,
          uid,
        },
      });

      return data;
    } catch (error) {
      console.log(error.response);
      return null;
    }
  }
}

module.exports = AuthApi;
