var one = artifacts.require("./one.sol");

module.exports = function (deployer) {
    deployer.deploy(one,1000);
};

