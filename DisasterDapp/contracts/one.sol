pragma solidity ^0.4.20;


contract one{
   
    uint256 public totalSupply;
    event Transfer(address indexed from, address indexed to, uint tokens);
    mapping(address => uint256) balances;
    uint256 public lockedtokens;
    address owner;
    
    constructor(uint intialSupply) public{
        /* give all tokens to creater of contract */
        balances[msg.sender] = intialSupply;
        totalSupply = intialSupply;
        owner = msg.sender;
    }
    
    function GetResources(uint256 requiredresources) public returns(bool)  { 
        bool result = false;
        if(totalSupply >= requiredresources 
            && ((lockedtokens + requiredresources) <= totalSupply)) 
        {
            lockedtokens = lockedtokens + requiredresources;
            result= true;
        }    
        return result;    
    }
    
    function balanceOf(address tokenOwner) public view returns (uint balance) {
        return balances[tokenOwner];
    }

     function isOwner() public view returns (bool result) {
         if(msg.sender == owner)
          return true;
         else
         return false;
           
        // return balances[tokenOwner];
    }

   function CompleteTransaction(address to, uint tokens) public returns (bool success) {
        balances[msg.sender] = balances[msg.sender] - tokens;
        balances[to] = balances[to]+ tokens;
        emit Transfer(msg.sender, to, tokens);
        return true;
    }
    
}