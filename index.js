
const { nextISSTimesForMyLocation } = require('./iss');

const printPassTimings = (passTimes) => {
  for (const pass of passTimes) {
    const dateTime = new Date(0);
    dateTime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${dateTime} for ${duration} seconds!`);
  }
};

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  printPassTimings(passTimes);
});

module.exports = { printPassTimings };