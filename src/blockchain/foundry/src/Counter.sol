// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Pong {
	address[] public players;
	address public winner;

	mapping(uint8 => address[]) public rounds;
	uint8 public currentRound;

	event PlayerRegistered(address indexed player);
	event RoundUpdated(uint8 indexed round, address[] players);
	event WinnerDeclared(address indexed winner);

	modifier validPlayer(address player) {
		bool isValid = false;
		for (uint8 i = 0; i < players.length; i++) {
			if (players[i] == player) {
				isValid = true;
				break;
			}
		}
		require(isValid, "Not a valid player");
		_;
	}

	function register() external {
		require(players.length < 4, "Tournament is full");
		require(currentRound == 0, "Registration phase is over");

		for (uint8 i = 0; i < players.length; i++) {
			require(players[i] != msg.sender, "Player already registered");
		}

		players.push(msg.sender);
		emit PlayerRegistered(msg.sender);

		if (players.length == 4) {
			rounds[currentRound] = players;
			emit RoundUpdated(currentRound, players);
		}
	}

	function setWinners(address[] calldata roundWinners) external {
		require(roundWinners.length == rounds[currentRound].length / 2, "Invalid number of winners");
		require(currentRound >= 0 && currentRound <= 2, "Invalid round");

		rounds[currentRound + 1] = roundWinners;
		emit RoundUpdated(currentRound + 1, roundWinners);

		currentRound++;

		if (currentRound == 2) {
			require(roundWinners.length == 1, "Final round must have one winner");
			winner = roundWinners[0];
			emit WinnerDeclared(winner);
		}
	}

	function getPlayersInRound(uint8 round) external view returns (address[] memory) {
		return rounds[round];
	}

	function getPlayers() external view returns (address[] memory) {
		return players;
	}
}
