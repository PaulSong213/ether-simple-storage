const ethers = require("ethers");
const fs = require("fs-extra");
//https://stackoverflow.com/questions/74197765/i-am-experiencing-a-could-not-detect-network-event-nonetwork-code-network-e
async function main() {
	//http://127.0.0.1:8545
	const provider = new ethers.providers.JsonRpcProvider(
		"http://127.0.0.1:8545"
	);
	const wallet = new ethers.Wallet(
		"0xd6e421bd2a58a2c0a030278c7af0f906f98af8c4de85a5482c029f2cb5d55458",
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
	console.log(contract);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
