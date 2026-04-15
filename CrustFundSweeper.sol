// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title CrustFundSweeper
 * @dev A degen-grade crumb (dust) converter that swaps multiple ERC20 tokens 
 * for native ETH/Currency and takes a 5% Chef's Fee.
 */

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);
}

interface IUniswapV2Router {
    function swapExactTokensForETH(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);
    
    function WETH() external pure returns (address);
}

abstract contract ReentrancyGuard {
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;
    uint256 private _status;

    constructor() {
        _status = _NOT_ENTERED;
    }

    modifier nonReentrant() {
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");
        _status = _ENTERED;
        _;
        _status = _NOT_ENTERED;
    }
}

contract CrustFundSweeper is ReentrancyGuard {
    address public chef; // The fee recipient
    uint256 public constant FEE_BPS = 500; // 5% (500 / 10000)
    IUniswapV2Router public immutable router;

    event CrumbsBaked(address indexed user, uint256 totalReceived, uint256 feeTaken);
    event ChefChanged(address indexed oldChef, address indexed newChef);

    constructor(address _router, address _chef) {
        require(_router != address(0), "Invalid router");
        require(_chef != address(0), "Invalid chef");
        router = IUniswapV2Router(_router);
        chef = _chef;
    }

    modifier onlyChef() {
        require(msg.sender == chef, "Only the Chef can do this!");
        _;
    }

    /**
     * @notice Bake multiple crumbs (tokens) into native currency
     * @param tokens Array of ERC20 token addresses to sweep
     * @param amountsIn Array of amounts to swap for each token
     * @param minAmountsOut Array of minimum native currency to receive for each swap (slippage protection)
     */
    function bakeCrumbs(
        address[] calldata tokens,
        uint256[] calldata amountsIn,
        uint256[] calldata minAmountsOut
    ) external nonReentrant {
        require(tokens.length == amountsIn.length && tokens.length == minAmountsOut.length, "Array mismatch");
        require(tokens.length > 0, "No tokens provided");
        
        uint256 totalNativeReceived = 0;
        address weth = router.WETH();

        for (uint256 i = 0; i < tokens.length; i++) {
            address token = tokens[i];
            uint256 amount = amountsIn[i];
            if (amount == 0) continue;

            // 1. Pull tokens from user (User must have approved this contract first)
            require(IERC20(token).transferFrom(msg.sender, address(this), amount), "Transfer failed");

            // 2. Approve Router to spend tokens
            IERC20(token).approve(address(router), amount);

            // 3. Setup swap path (Token -> WETH)
            address[] memory path = new address[](2);
            path[0] = token;
            path[1] = weth;

            // 4. Perform the swap
            uint256 balanceBefore = address(this).balance;
            
            router.swapExactTokensForETH(
                amount,
                minAmountsOut[i],
                path,
                address(this),
                block.timestamp + 600 // 10 minute deadline
            );

            uint256 received = address(this).balance - balanceBefore;
            totalNativeReceived += received;
        }

        require(totalNativeReceived > 0, "No value received");

        // 5. Calculate and take the Chef's Fee (5%)
        uint256 feeAmount = (totalNativeReceived * FEE_BPS) / 10000;
        uint256 userAmount = totalNativeReceived - feeAmount;

        // 6. Send funds
        (bool feeSuccess, ) = payable(chef).call{value: feeAmount}("");
        require(feeSuccess, "Fee transfer failed");

        (bool userSuccess, ) = payable(msg.sender).call{value: userAmount}("");
        require(userSuccess, "User transfer failed");

        emit CrumbsBaked(msg.sender, userAmount, feeAmount);
    }

    /**
     * @notice Change the Chef address (only current Chef can call)
     */
    function setChef(address _newChef) external onlyChef {
        require(_newChef != address(0), "Chef cannot be zero address");
        emit ChefChanged(chef, _newChef);
        chef = _newChef;
    }

    // Allow contract to receive ETH from Uniswap Router
    receive() external payable {}
}
