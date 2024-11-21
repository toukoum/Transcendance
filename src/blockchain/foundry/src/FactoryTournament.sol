// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./Tournament.sol";

contract TournamentFactory {
    Tournament[] public tournaments;

    event TournamentCreated(address indexed creator, address tournamentAddress);

    function createTournament() external {
        Tournament newTournament = new Tournament();
        tournaments.push(newTournament);
        emit TournamentCreated(msg.sender, address(newTournament));
    }

    function getTournaments() external view returns (Tournament[] memory) {
        return tournaments;
    }
}
