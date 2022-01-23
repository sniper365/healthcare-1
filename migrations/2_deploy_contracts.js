var HealthCare = artifacts.require("./HealthCare.sol");

module.exports = function(deployer) {
  deployer.deploy(HealthCare);
  // function saveFrontendFiles(token) {
    // const fs = require("fs");
    // const contractsDir = __dirname + "/../src/contracts";
  
    // if (!fs.existsSync(contractsDir)) {
    //   fs.mkdirSync(contractsDir);
    // }
  
    // fs.writeFileSync(
    //   "/contract-address.json",
    //   JSON.stringify({ address: HealthCare.address}, undefined, 2)
    // );  
  // }
};
