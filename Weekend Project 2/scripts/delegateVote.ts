import { ethers } from "hardhat";
import { Ballot__factory } from "../typechain-types";
import * as dotenv from "dotenv"
import { sign } from "crypto";
dotenv.config()


// yarn ts-node --files .\scripts\castVotes.ts delegateAddress contractAddress

async function main() {
    const args = process.argv.slice(2)
    const delegateAddress = args[0]
    const contractAddress = args[1]
    console.log("Testing")
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "")
    console.log(`Using wallet address ${wallet.address}`)

    const provider = new ethers.providers.AlchemyProvider(
        "goerli",
        process.env.ALCHEMY_API_KEY
    )
    const lastBlock = await provider.getBlock("latest")
    console.log(`The last block is ${lastBlock.number}`)

    const signer = wallet.connect(provider)
    const balance = await signer.getBalance()
    console.log(`Balance is ${balance} WEI`)

    console.log("---------")

    const ballotFactory = new Ballot__factory(signer)
    const ballotContract = await ballotFactory.attach(contractAddress) 
    
    console.log(`Delegating vote to ${delegateAddress}`)
    const tx = await ballotContract.connect(signer).delegate(delegateAddress)
    await tx.wait()
    console.log(`Delegated vote from ${signer.address} to ${delegateAddress} at block ${tx.blockNumber} at transaction ${tx.hash}`)
}

main().catch((error) => {
    console.log(error)
    process.exitCode = 1
})