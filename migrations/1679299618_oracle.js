const Oracle = artifacts.require("Oracle.json");

module.exports = deployer => {
  deployer.deploy(Oracle); 
};