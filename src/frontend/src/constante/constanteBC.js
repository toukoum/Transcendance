export const contractAddressFactory = "0x5dc3EDbd95369CEd28F7826d434a1747b8175bBB";
export const contractAddressTournament = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
export const ABIFactory = `[
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

export const ABITournament = `[
		{
			"type": "function",
			"name": "checkIfIsAlreadyInside",
			"inputs": [
				{
					"name": "player",
					"type": "address",
					"internalType": "address"
				}
			],
			"outputs": [
				{
					"name": "",
					"type": "bool",
					"internalType": "bool"
				}
			],
			"stateMutability": "view"
		},
		{
			"type": "function",
			"name": "currentRound",
			"inputs": [],
			"outputs": [
				{
					"name": "",
					"type": "uint8",
					"internalType": "uint8"
				}
			],
			"stateMutability": "view"
		},
		{
			"type": "function",
			"name": "getPlayers",
			"inputs": [],
			"outputs": [
				{
					"name": "",
					"type": "address[]",
					"internalType": "address[]"
				}
			],
			"stateMutability": "view"
		},
		{
			"type": "function",
			"name": "getPlayersInRound",
			"inputs": [
				{
					"name": "round",
					"type": "uint8",
					"internalType": "uint8"
				}
			],
			"outputs": [
				{
					"name": "",
					"type": "address[]",
					"internalType": "address[]"
				}
			],
			"stateMutability": "view"
		},
		{
			"type": "function",
			"name": "hasWonInRound",
			"inputs": [
				{
					"name": "",
					"type": "uint8",
					"internalType": "uint8"
				},
				{
					"name": "",
					"type": "address",
					"internalType": "address"
				}
			],
			"outputs": [
				{
					"name": "",
					"type": "bool",
					"internalType": "bool"
				}
			],
			"stateMutability": "view"
		},
		{
			"type": "function",
			"name": "players",
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
					"internalType": "address"
				}
			],
			"stateMutability": "view"
		},
		{
			"type": "function",
			"name": "register",
			"inputs": [],
			"outputs": [],
			"stateMutability": "nonpayable"
		},
		{
			"type": "function",
			"name": "rounds",
			"inputs": [
				{
					"name": "",
					"type": "uint8",
					"internalType": "uint8"
				},
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
					"internalType": "address"
				}
			],
			"stateMutability": "view"
		},
		{
			"type": "function",
			"name": "setWinner",
			"inputs": [],
			"outputs": [],
			"stateMutability": "nonpayable"
		},
		{
			"type": "function",
			"name": "winner",
			"inputs": [],
			"outputs": [
				{
					"name": "",
					"type": "address",
					"internalType": "address"
				}
			],
			"stateMutability": "view"
		},
		{
			"type": "event",
			"name": "PlayerRegistered",
			"inputs": [
				{
					"name": "player",
					"type": "address",
					"indexed": true,
					"internalType": "address"
				}
			],
			"anonymous": false
		},
		{
			"type": "event",
			"name": "RoundUpdated",
			"inputs": [
				{
					"name": "round",
					"type": "uint8",
					"indexed": true,
					"internalType": "uint8"
				},
				{
					"name": "players",
					"type": "address[]",
					"indexed": false,
					"internalType": "address[]"
				}
			],
			"anonymous": false
		},
		{
			"type": "event",
			"name": "WinnerDeclared",
			"inputs": [
				{
					"name": "winner",
					"type": "address",
					"indexed": true,
					"internalType": "address"
				}
			],
			"anonymous": false
		}
	]`;