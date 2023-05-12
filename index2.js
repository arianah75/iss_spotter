const { nextISSTimesForMyLocation } = require('./iss_promised');
const { printPassTimings } = require('./index.js');

nextISSTimesForMyLocation()
  .then((passTimes) => {
    printPassTimings(passTimes);
  })
  .catch((error) => {
    console.log("It didn't work: ", error.message);
  });
