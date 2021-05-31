pragma solidity 0.8.0;

import "../../libraries/Position.sol";

interface IPrimitiveLendingCallback {
    function borrowCallback(uint deltaL, uint deltaRisky, uint deltaStable) external;
    function repayFromExternalCallback(uint deltaStable) external;
}
