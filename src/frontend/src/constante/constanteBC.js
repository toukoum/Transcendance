export const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
export const ABI = `[
	{
		"type": "function",
		"name": "createTournament",
		"inputs": [],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "getTournaments",
		"inputs": [],
		"outputs": [
			{
				"name": "",
				"type": "address[]",
				"internalType": "contract Tournament[]"
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "tournaments",
		"inputs": [
			{
				"name": "",
				"type": "uint256",
				"internalType": "uint256"
			}
		],
		"outputs": [
			{
				"name": "",
				"type": "address",
				"internalType": "contract Tournament"
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "event",
		"name": "TournamentCreated",
		"inputs": [
			{
				"name": "creator",
				"type": "address",
				"indexed": true,
				"internalType": "address"
			},
			{
				"name": "tournamentAddress",
				"type": "address",
				"indexed": false,
				"internalType": "address"
			}
		],
		"anonymous": false
	}
]`;