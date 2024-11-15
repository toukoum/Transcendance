const { ethers } = require("ethers");

const INFURA_ID = '441b5d323cc249bda928fc2039f139f6'
const provider = new ethers.providers.JsonRpcProvider()

const contractAddress = '0x5fbdb2315678afecb367f032d93f642f64180aa3'
const ABI = `[
	{
		"inputs": [],
		"name": "decre",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "incre",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_number",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "number",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]`

const privateKey1 = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80' // Private key of account 1
const wallet = new ethers.Wallet(privateKey1, provider)

const contract = new ethers.Contract(contractAddress, ABI, provider)

const main = async () => {
    const name = await contract.number()
    console.log(`\nReading from ${contractAddress}\n`)
    console.log(`Name: ${name}`)

	const contractWithWallet = contract.connect(wallet)

	const tx = await contractWithWallet.incre()
    await tx.wait()

    console.log(tx)

    const after = await contract.number()
    console.log(`\nReading from ${contractAddress}\n`)
    console.log(`after: ${after}`)
}

main()