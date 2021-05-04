pragma solidity ^0.5.0;

import "./DaiToken.sol";
import "./AlexxToken.sol";

contract TokenFarm {
    string public name = "Dapp Token Farm";
    AlexxToken public alexxToken;
    DaiToken public daiToken;

    constructor(AlexxToken _alexxToken, DaiToken _daiToken) public {
        alexxToken = _alexxToken;
        daiToken = _daiToken;
    }

}
