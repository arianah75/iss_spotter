const request = require('request');

const fetchMyIP = (cb) => {
  request.get(
    'https://api64.ipify.org/?format=json',
    (error, response, body) => {
      if (error) {
        return cb(error, null);
      }
      if (response.statusCode !== 200) {
        cb(
          Error(`Status Code ${response.statusCode} when fetching IP: ${body}`),
          null
        );
        return;
      }
      const ip = JSON.parse(body).ip;
      cb(null, ip);
    }
  );
};
const fetchCoordsByIP = (ip, cb) => {
  request(`https://ipwho.is/${ip}`, (error, response, body) => {
    if (error) {
      return cb(error, null);
    }
    const parsedBody = JSON.parse(body);

    if (!parsedBody.success) {
      const message = `Success status was ${parsedBody.success}. Server message says: ${parsedBody.message} when fetching for IP ${parsedBody.ip}`;
      cb(Error(message), null);
      return;
    }

    const { latitude, longitude } = parsedBody;

    cb(null, { latitude, longitude });
  });
};


const fetchISSFlyOverTimes = function(coords, cb) {
  request(`https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`, (error, response, body) => {
    if (error) {
      return cb(error, null);
    }
    if (response.statusCode !== 200) {
      cb(Error(`Status Code ${response.statusCode} when fetching ISS pass times: ${body}`), null);
      return;
    }

    const passes = JSON.parse(body).response;
    cb(null, passes);
  });
};

const nextISSTimesForMyLocation = (cb) => {
  fetchMyIP((error, ip) => {
    if (error) {
      return cb(error, null);
    }
    fetchCoordsByIP(ip, (error, coords) => {
      if (error) {
        return cb(error, null);
      }
      fetchISSFlyOverTimes(coords, (error, passes) => {
        if (error) {
          return cb(error, null);
        }
        cb(null, passes);
      });
    });
  });
};



module.exports = { nextISSTimesForMyLocation };
