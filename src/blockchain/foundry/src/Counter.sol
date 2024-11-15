// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;
contract Pong{

	struct Game {
		uint gamesPlayed;
		uint wins;
		uint loses;
	}

	mapping(address => Game) private addressToGame;

    function win(address walletLooser) public {
		addressToGame[msg.sender].gamesPlayed += 1;
		addressToGame[walletLooser].gamesPlayed += 1;
		addressToGame[msg.sender].wins += 1;
		addressToGame[walletLooser].loses += 1;
    }

	function getGame(address wallet) public view returns (uint, uint, uint) {
		return (addressToGame[wallet].gamesPlayed, addressToGame[wallet].wins, addressToGame[wallet].loses);
	}
}
