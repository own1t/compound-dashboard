import Compound from "@compound-finance/compound-js";

const provider = process.env.INFURA_URL;

const comptroller = Compound.util.getAddress(Compound.Comptroller);
const opf = Compound.util.getAddress(Compound.PriceFeed);

const ethMantissa = Math.pow(10, 18);
const blocksPerDay = 4 * 60 * 24;
const daysPerYear = 365;
const cTokenDecimals = 8;

const calculateSupplyApy = async (cToken) => {
  const supplyRatePerBlock = await Compound.eth.read(
    cToken,
    "function supplyRatePerBlock() returns (uint)",
    [],
    { provider }
  );

  const supplyApy =
    (Math.pow(
      (supplyRatePerBlock / ethMantissa) * blocksPerDay + 1,
      daysPerYear
    ) -
      1) *
    100;

  return supplyApy;
};

const calculateBorrowApy = async (cToken) => {
  const borrowRatePerBlock = await Compound.eth.read(
    cToken,
    "function borrowRatePerBlock() returns (uint)",
    [],
    { provider }
  );

  const borrowApy =
    (Math.pow(
      (borrowRatePerBlock / ethMantissa) * blocksPerDay + 1,
      daysPerYear
    ) -
      1) *
    100;

  return borrowApy;
};

const calculateExchangeRates = async (cToken, underlyingDecimals) => {
  const exchangeRateCurrent = await Compound.eth.read(
    cToken,
    "function exchangeRateCurrent() public view returns (uint)",
    [],
    { provider }
  );

  const mantissa = 18 + underlyingDecimals - cTokenDecimals;

  const oneCTokenInUnderlying = exchangeRateCurrent / Math.pow(10, mantissa);
  const cTokensInOneUnderlying = Math.pow(10, mantissa) / exchangeRateCurrent;

  return cTokensInOneUnderlying;
};

const calculateTotalSupply = async (cToken, ticker, underlyingDecimals) => {
  let totalSupply = await Compound.eth.read(
    cToken,
    "function totalSupply() public view returns (uint)",
    [],
    { provider }
  );

  let exchangeRate = await Compound.eth.read(
    cToken,
    "function exchangeRateCurrent() public view returns (uint)",
    [],
    { provider }
  );

  let underlyingPrice = await Compound.eth.read(
    opf,
    "function price(string memory symbol) external view returns (uint)",
    [ticker],
    { provider }
  );

  exchangeRate = +exchangeRate.toString() / ethMantissa;

  const fixedTotalSupply =
    (+totalSupply.toString() * exchangeRate * underlyingPrice) /
    Math.pow(10, underlyingDecimals);

  return fixedTotalSupply;
};

const calculateTotalBorrows = async (cToken, ticker) => {
  const totalBorrows = await Compound.eth.read(
    cToken,
    "function totalBorrows() public view returns (uint)",
    [],
    { provider }
  );

  const underlyingPrice = await Compound.eth.read(
    opf,
    "function price(string memory symbol) external view returns (uint)",
    [ticker],
    { provider }
  );

  const fixedTotalBorrows = (totalBorrows * underlyingPrice) / Math.pow(10, 18);

  return fixedTotalBorrows;
};

const calculateCompApy = async (cToken, ticker, underlyingDecimals) => {
  let compSpeed = await Compound.eth.read(
    comptroller,
    "function compSpeeds(address cToken) public view returns (uint)",
    [cToken],
    { provider }
  );

  let compPrice = await Compound.eth.read(
    opf,
    "function price(string memory symbol) external view returns (uint)",
    [Compound.COMP],
    { provider }
  );

  let underlyingPrice = await Compound.eth.read(
    opf,
    "function price(string memory symbol) external view returns (uint)",
    [ticker],
    { provider }
  );

  let totalSupply = await Compound.eth.read(
    cToken,
    "function totalSupply() public view returns (uint)",
    [],
    { provider }
  );

  let exchangeRate = await Compound.eth.read(
    cToken,
    "function exchangeRateCurrent() public view returns (uint)",
    [],
    { provider }
  );

  compSpeed = compSpeed / 1e18;
  compPrice = compPrice / 1e6;
  underlyingPrice = underlyingPrice / 1e6;
  exchangeRate = +exchangeRate.toString() / ethMantissa;
  totalSupply =
    (+totalSupply.toString() * exchangeRate * underlyingPrice) /
    Math.pow(10, underlyingDecimals);
  const compPerDay = compSpeed * blocksPerDay;

  const compApy = 100 * ((compPrice * compPerDay) / totalSupply) * 365;

  return compApy;
};

const calculateApys = async (cTokenTicker, underlyingTicker) => {
  const underlyingDecimals = Compound.decimals[underlyingTicker];
  const cTokenAddress = Compound.util.getAddress(cTokenTicker);

  const [
    supplyApy,
    borrowApy,
    exchangeRate,
    totalSupply,
    totalBorrows,
    compApy,
  ] = await Promise.all([
    calculateSupplyApy(cTokenAddress),
    calculateBorrowApy(cTokenAddress),
    calculateExchangeRates(cTokenAddress, underlyingDecimals),
    calculateTotalSupply(cTokenAddress, underlyingTicker, underlyingDecimals),
    calculateTotalBorrows(cTokenAddress, underlyingTicker),
    calculateCompApy(cTokenAddress, underlyingTicker, underlyingDecimals),
  ]);

  return {
    ticker: underlyingTicker,
    supplyApy,
    borrowApy,
    exchangeRate,
    totalSupply,
    totalBorrows,
    compApy,
  };
};

export default calculateApys;
