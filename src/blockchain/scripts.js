let provider;

// const connectWallet = async () => {
// 	try {
// 		if (typeof window.ethereum === 'undefined') {
// 			alert("MetaMask n'est pas installé !");
// 			return;
// 		}

// 		provider = new ethers.providers.JsonRpcProvider();
// 		await provider.send("eth_requestAccounts", []);
// 		const signer = provider.getSigner();
// 		console.log("Signer:", signer);
// 		console.log("Adresse du compte:", await signer.getAddress());
// 	} catch (error) {
// 		console.error("Erreur lors de la connexion au portefeuille:", error);
// 	}
// };

const jsonAbi = [
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
];

const iface = new Interface(jsonAbi);
iface.format(FormatTypes.full);
console.log(iface);

const address = '0x5fbdb2315678afecb367f032d93f642f64180aa3'

const contract = new ethers.Contract(address, ERC20_ABI, provider)

const feur = async () => {
	const name = await contract.number()
	console.log(`Name: ${name}`)
};

// const provider = new ethers.providers.JsonRpcProvider()

// const address = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'
// const balance = await provider.getBalance(address)
// console.log(`ETH Balance of ${address} --> ${ethers.utils.formatEther(balance)} ETH\n`)
// document.getElementById("connectButton").addEventListener("click", connectWallet);
document.querySelector("#salut").addEventListener("click", feur);