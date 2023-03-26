const ethers = require("ethers");
const fs = require("fs-extra");
//https://stackoverflow.com/questions/74197765/i-am-experiencing-a-could-not-detect-network-event-nonetwork-code-network-e
async function main() {
	//http://127.0.0.1:8545
	const provider = new ethers.providers.JsonRpcProvider(
		"http://127.0.0.1:8545"
	);
	const wallet = new ethers.Wallet(
		"0xccf64d6390a0938b30cf8d9dbded876cf5960bb5080625ce17535ae26935c092",
		provider
	);
	const abi = fs.readFileSync(
		"./SimpleStorage_sol_SimpleStorage.abi",
		"utf8"
	);
	const binary = fs.readFileSync(
		"SimpleStorage_sol_SimpleStorage.bin",
		"utf8"
	);
	const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
	console.log("Deploying, please wait...");
	const contract = await contractFactory.deploy();
	await contract.deployTransaction.wait(1);

	// Get favorite number
	const currentFavoriteNumber = await contract.retrieve();
	console.log(`Current favorite number: ${currentFavoriteNumber.toString()}`);
	const transactionResponse = await contract.store("7");
	const transactionReceipt = await transactionResponse.wait(1);
	const updatedFavoriteNumber = await contract.retrieve();
	console.log(`Updated favorite number: ${updatedFavoriteNumber.toString()}`);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
