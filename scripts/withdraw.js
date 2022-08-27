const hre = require("hardhat");
const abi = require("../artifacts/contracts/BuyMeACoffee.sol/BuyMeACoffee.json");

async function getBalance(provider, address) {
  const balanceBigInt = await provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

async function main() {
  // Get the contract that has been deployed to Goerli
  const constractAddress = "0xD568d4d4723dB7D0f5c97B27d29d73be69353ceF";
  const contractABI = abi.abi;

  // Get the node connection and wallet connection.
  const provider = new hre.ethers.providers.AlchemyProvider(
    "goerli",
    process.env.ALCHEMY_KEY
  );

  // Ensure that signer is the same address as the original contract deployer,
  // or else this script will fail with an error.
  const signer = new hre.ethers.Wallet(process.env.PRIVATE_KEY, provider);

  // Instance connected contract.
  const buyMeACoffee = new hre.ethers.Contract(
    constractAddress,
    contractABI,
    signer
  );

  // Check starting balances.
  console.log(
    "Current balance of owner:",
    await getBalance(provider, signer.address)
  );
  const contractBalance = await getBalance(provider, buyMeACoffee.address);
  console.log("contractBalance", contractBalance);
  console.log(
    "Current balance of contract:",
    await getBalance(provider, buyMeACoffee.address),
    "ETH"
  );

  // withdraw founds if there are founds to witdraw.
  if (contractBalance !== "0.0") {
    console.log("widthdrawing found...");
    const withDrawTxn = await buyMeACoffee.withDrawTips();
    await withDrawTxn.wait();
  } else {
    console.log('No founds to widhdraw!');
  }

  console.log('Current balance of owner:', await getBalance(provider, signer.address), 'ETH');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log("Error:", error);
    process.exit(1);
  });
