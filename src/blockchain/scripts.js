let provider;
let signer;
let contract;
let addressWallet;
let addressLooser;

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

const contractAddress = '0x8464135c8F25Da09e49BC8782676a84730C318bC'

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
			document.getElementById("connectButton").disabled = false;
			sessionStorage.setItem("isConnected", true);
			if (sessionStorage.getItem("isConnected")) {
				const button = document.querySelector("#connectButton");
				button.innerHTML = "Disconnect";
				button.setAttribute("id", "Disconnect");
			}
		}
	} catch (error) {
		console.error("Erreur lors de la connexion au portefeuille:", error);
	}
};

if (sessionStorage.getItem("isConnected")) {
	connectWallet();
}

const getGame = async () => {
	if (addressWallet == null) {
		alert("Veuillez entrer une adresse de portefeuille");
		return;
	}
	const number = await contract.getGame(addressWallet);
	console.log(number);
	if (document.querySelector("#info") == null) {
		const divInfo = document.createElement("div");
		divInfo.setAttribute("id", "info");
		document.querySelector("#divInfo").appendChild(divInfo);
	}
	console.log(`Nombre de parties jouées: ${number[0]}<br>Nombre de parties gagnées: ${number[1]}<br>Nombre de parties perdues: ${number[2]}`);
	document.querySelector("#info").innerHTML = `Nombre de parties jouées: ${number[0]}<br>Nombre de parties gagnées: ${number[1]}<br>Nombre de parties perdues: ${number[2]}`;
};


const sendLooser = async () => {
	if (addressLooser == null) {
		alert("Veuillez entrer une adresse de portefeuille");
		return;
	}
	console.log(addressLooser);
	const contractWithWallet = contract.connect(signer);
	const tx = await contractWithWallet.win(addressLooser);
	await tx.wait();
	console.log(tx);
};

document.querySelector("#inputWallet").addEventListener("change", (e) => {
	addressWallet = e.target.value;
});

document.querySelector("#inputLooser").addEventListener("change", (e) => {
	addressLooser = e.target.value;
});

document.querySelector("#connectButton").addEventListener("click", () => {
	if (sessionStorage.getItem("isConnected")) {
		sessionStorage.removeItem("isConnected");
	} else {
		connectWallet();
	}
});

document.getElementById("connectButton").addEventListener("click", connectWallet);
// document.getElementById("getNumber").addEventListener("click", getNumber);
document.getElementById("sendLooser").addEventListener("click", sendLooser);
document.getElementById("getInfo").addEventListener("click", getGame);