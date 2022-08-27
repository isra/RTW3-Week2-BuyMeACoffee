const { ethers } = require('hardhat');
const hre = require('hardhat');

// Return the Ether balance of a given address.
async function getBalance(address) {
    const balanceBigInt = await hre.ethers.provider.getBalance(address);
    return hre.ethers.utils.formatEther(balanceBigInt);
}


// Logs the Ether balances for a list addresses.
async function printBalances(addresses) {
    let idx = 0;
    for (const address of addresses) {
        console.log(`Address ${idx} balance: `, await getBalance(address));
        idx++;
    }
}


// Logs the memos stored on chain from coffee purchases.
async function printMemos(memos) {
    for (const memo of memos) {
        const timestamp = memo.timestamp;
        const tipper = memo.name;
        const tipperAddress = memo.from;
        const message = memo.message;
        console.log(`At ${timestamp}, ${tipper} (${tipperAddress}) said: "${message}"`);
    }
}

async function main() {
    // Get the example accounts we'll be working with.
    const [owner, tipper, tipper2, tipper3] = await hre.ethers.getSigners();
    // const [tipper] = await hre.ethers.getSigners(1);

    // We get the contract to deploy
    const BuyMeACoffee = await hre.ethers.getContractFactory('BuyMeACoffee');
    const buyMeACoffee = await BuyMeACoffee.deploy();

    // Deploy the contract
    await buyMeACoffee.deployed();

    const weiAmount = (await owner.getBalance()).toString();
    // console.log('Current balance in owner:', (await ethers.utils.formatEther(weiAmount)));
    // console.log('BuyMeACoffee deployed to:', buyMeACoffee.address);

    const addresses = [owner.address, tipper.address, buyMeACoffee.address];
    console.log('=== start ===');
    await printBalances(addresses);

    // Buy the owner a few coffees.
    const tip = { value: hre.ethers.utils.parseEther('1') };
    await buyMeACoffee.connect(tipper).buyCoffee('Carolina', `You're the best!`, tip);
    await buyMeACoffee.connect(tipper2).buyCoffee('Diana', 'Amaizing teacher', tip);
    await buyMeACoffee.connect(tipper3).buyCoffee('Alondra', 'I love my Proof of knowledge', tip);

    console.log('=== bought coffee ===');
    await printBalances(addresses);

    // Withdraw
    await buyMeACoffee.connect(owner).withDrawTips();

    // Check balances after withdraw.
    console.log('=== withDrawTips ===');
    await printBalances(addresses);

    // Check out the memos.
    const memos = await buyMeACoffee.getMemos();
    printMemos(memos);

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log('Error', error);
        process.exit(1);
    });