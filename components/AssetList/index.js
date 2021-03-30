import styles from "./AssetList.module.css";

const AssetList = ({ apys }) => {
  const formatNumber = (number) => `${new Number(number).toFixed(2)}`;
  const formatPercent = (number) => `${new Number(number).toFixed(2)}%`;

  return (
    <div className={styles.content_container}>
      <div className={styles.content_header}>
        <div className={styles.header_list}>
          <div className={styles.header_item}>
            <p className={styles.crypto_text}>Ticker</p>
          </div>
          <div className={styles.header_item}>
            <p className={styles.crypto_text}>Total Supply</p>
          </div>
          <div className={styles.header_item}>
            <p className={styles.crypto_text}>Supply APY</p>
          </div>
          <div className={styles.header_item}>
            <p className={styles.crypto_text}>Total Borrow</p>
          </div>
          <div className={styles.header_item}>
            <p className={styles.crypto_text}>Borrow APY</p>
          </div>
          <div className={styles.header_item}>
            <p className={styles.crypto_text}>Exchange Rate</p>
          </div>
          <div className={styles.header_item}>
            <p className={styles.crypto_text}>COMP APY</p>
          </div>
        </div>
      </div>

      <div className={styles.content_body}>
        {apys &&
          apys.map((apy) => (
            <div className={styles.content_row} key={apy.ticker}>
              <div className={styles.content_item}>
                <img
                  className={styles.crypto_img}
                  src={`assets/${apy.ticker.toLowerCase()}.webp`}
                  alt={apy.ticker}
                />
                <p className={styles.crypto_data}>{apy.ticker}</p>
              </div>
              <div className={styles.content_item}>
                <p className={styles.crypto_data}>
                  ${formatNumber(apy.totalSupply / 10e11)}M
                </p>
              </div>
              <div className={styles.content_item}>
                <p className={styles.crypto_data}>
                  {formatPercent(apy.supplyApy)}
                </p>
              </div>
              <div className={styles.content_item}>
                {apy.totalBorrows < 10e4 ? (
                  <p className={styles.crypto_data}>
                    ${formatNumber(apy.totalBorrows)}M
                  </p>
                ) : (
                  <p className={styles.crypto_data}>
                    ${formatNumber(apy.totalBorrows / 10e11)}M
                  </p>
                )}
              </div>
              <div className={styles.content_item}>
                <p className={styles.crypto_data}>
                  {formatPercent(apy.borrowApy)}
                </p>
              </div>
              <div className={styles.content_item}>
                <p className={(styles.crypto_data, styles.exchange_rate)}>
                  1 {apy.ticker} = {formatNumber(apy.exchangeRate)} c
                  {apy.ticker}
                </p>
              </div>
              <div className={styles.content_item}>
                <p className={styles.crypto_data}>
                  {formatPercent(apy.compApy)}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default AssetList;
