pragma solidity 0.7.6;
pragma abicoder v2;


interface IPrimitiveEngine {
    struct Position {
        address owner;
        uint nonce;
        uint BX1;
        uint BY2;
        uint liquidity;
        bool unlocked;
    }
    // ==== State =====
    function initialize(uint strike_, uint32 sigma_, uint32 time_) external;
    function start(uint deltaX, uint deltaY) external returns (bool);
    function addBoth(address owner, uint nonce, uint deltaL) external returns (uint, uint);
    function removeBoth(uint nonce, uint deltaL) external returns (uint, uint);
    function addX(address owner, uint nonce, uint deltaX, uint minDeltaY) external returns (uint);
    function removeX(address owner, uint nonce, uint deltaX, uint maxDeltaY) external returns (uint);

    function directDeposit(address owner, uint nonce, uint deltaX, uint deltaY) external returns (bool);
    function directWithdrawal(address owner, uint nonce, uint deltaX, uint deltaY) external returns (bool);
    
    // ===== View =====
    function getInvariant(uint postR1, uint postR2) external view returns (int128);
    function getOutputAmount(uint deltaX) external view returns (uint);
    function getInputAmount(uint deltaX) external view returns (uint);
    function getPosition(address owner, uint nonce) external view returns (Position memory);
    function invariantLast() external view returns (int128);
    function getBX1() external view returns (uint);
    function getBY2() external view returns (uint);
    function TX1() external view returns (address);
    function TY2() external view returns (address);
    function FEE() external view returns (uint);
    function INIT_SUPPLY() external view returns (uint);
}