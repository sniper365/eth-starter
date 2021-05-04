pragma solidity ^0.5.0;

import "./DaiToken.sol";
import "./AlexxToken.sol";

contract TokenFarm {
    string public name = "Dapp Token Farm";
    AlexxToken public alexxToken;
    DaiToken public daiToken;

    address[] public stakers;
    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    constructor(AlexxToken _alexxToken, DaiToken _daiToken) public {
        alexxToken = _alexxToken;
        daiToken = _daiToken;
    }
    //1. Stakes tokens (deposits dai tokens)
    function stakeTokens(uint _amount) public {
        
        //transfer mock dai tokens to this contract for staking
        daiToken.transferFrom(msg.sender, address(this), _amount);

        //update staking balance
        stakingBalance[msg.sender] = stakingBalance[msg.sender]+_amount;

        //add users to stakers array only if they havent staked
        if(!hasStaked[msg.sender]){
            stakers.push(msg.sender);
        }

        //update staker status
        hasStaked[msg.sender] = true;
        isStaking[msg.sender] = true;
    }
}
