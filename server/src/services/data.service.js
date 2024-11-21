exports.getPenguinData = async () => {
   //read the data from the file
   const fs = require('fs');
   const data = fs.readFileSync('./src/data/penguins.json');
   //parse the data into a JSON object
   const penguins = JSON.parse(data);
   return penguins;
}

exports.getFlightData = async () => {
   //read the data from the file
   const fs = require('fs');
   const data = fs.readFileSync('./src/data/flights.json');
   //parse the data into a JSON object
   const flights = JSON.parse(data);
   return flights;
}

  
