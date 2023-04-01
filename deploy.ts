// const ethers = require("ethers");
// const fs = require("fs-extra");
// require("dotenv").config();

import { ethers } from "ethers";
import fs from "fs-extra";
import "dotenv/config";

//https://stackoverflow.com/questions/74197765/i-am-experiencing-a-could-not-detect-network-event-nonetwork-code-network-e
async function main() {
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL!);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
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
    console.log(`Contract address: ${contract.address}`);

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
