const expressJwt = require("express-jwt");

const authJwt = () => {
    const secret = process.env.SECRET;
    const API = process.env.API_URL;

    return expressJwt({
      secret,
      algorithms: ["HS256"],
      isRevoked: isRevoked
    }).unless({
      path: [
        { url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS'] },
        `${API}/auth/login`,
        `${API}/auth/register`,
      ],
    });
}

const isRevoked = async (req, payload, done) => {
  if (!payload.role) {
    done(null, true);
  }

  done();
};


module.exports = authJwt;