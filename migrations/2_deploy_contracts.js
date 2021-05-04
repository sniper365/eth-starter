const TokenFarm = artifacts.require("TokenFarm");
const DaiToken = artifacts.require("DaiToken");
const AlexxToken = artifacts.require("AlexxToken");

module.exports = async function(deployer, network, accounts) {
  //Deploy mock DAI token
  await deployer.deploy(DaiToken);
  const daiToken = await DaiToken.deployed();
  
  //Deploy alexx token
  await deployer.deploy(AlexxToken);
  const alexxToken = await AlexxToken.deployed();

  //Deploy token farm
  await deployer.deploy(TokenFarm, alexxToken.address, daiToken.address);
  const tokenFarm = await TokenFarm.deployed();

  //Transfer all tokens to tokenFarm (1 million)
  await alexxToken.transfer(tokenFarm.address, '1000000000000000000000000');

  //Transfer 100 mock dai tokens to investor
  await daiToken.transfer(accounts[1], '1000000000000000000000000');
};
