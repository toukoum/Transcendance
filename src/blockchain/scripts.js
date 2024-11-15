let provider;
let signer;
let contract;
const ABI = `[
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "walletLooser",
				"type": "address"
			}
		],
		"name": "win",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "wallet",
				"type": "address"
			}
		],
		"name": "getGame",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]`;

const contractAddress = '0x5fbdb2315678afecb367f032d93f642f64180aa3'

const connectWallet = async () => {
	try {
		if (typeof window.ethereum === 'undefined') {
			alert("MetaMask n'est pas installé !");
			return;
		}
		if (provider == null && signer == null) {
			console.log("Connexion au portefeuille en cours...");
			document.getElementById("connectButton").innerHTML = "Connexion en cours...";
			document.getElementById("connectButton").disabled = true;
			const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
			console.log("Connecté avec le compte:", accounts[0]);
			document.getElementById("connectButton").innerHTML = "Wallet connecté";
			provider = new ethers.providers.Web3Provider(window.ethereum);
			const balance = await provider.getBalance(accounts[0]);
			console.log("Balance:", ethers.utils.formatEther(balance), "ETH");
			signer = provider.getSigner();
			contract = new ethers.Contract(contractAddress, ABI, signer);
		}
	} catch (error) {
		console.error("Erreur lors de la connexion au portefeuille:", error);
	}
};



const reloadContract = async () => {
	contract = new ethers.Contract(contractAddress, ABI, signer);
};

const getNumber = async () => {
	const number = await contract.number();
	console.log(`Number: ${number}`);
};


const incr = async () => {
	const contractWithWallet = contract.connect(signer);
	const tx = await contractWithWallet.incre();
	await tx.wait();
	console.log(tx);
	const after = await contract.number()
    console.log(`after: ${after}`)
};

const decr = async () => {
	sessionStorage.setItem("number", Number(sessionStorage.getItem("number")) + 1);
	console.log(sessionStorage.getItem("number"));
};

document.getElementById("connectButton").addEventListener("click", connectWallet);
document.getElementById("getNumber").addEventListener("click", getNumber);
document.getElementById("incr").addEventListener("click", incr);
document.getElementById("decr").addEventListener("click", decr);