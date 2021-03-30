import Compound from "@compound-finance/compound-js";
import calculateApys from "../apy";

import Layout from "../components/Layout";
import AssetList from "../components/AssetList";

export default function Home({ apys }) {
  return (
    <Layout>
      <div className="comp_app">
        <AssetList apys={apys} />
      </div>
    </Layout>
  );
}

export const getStaticProps = async () => {
  const apys = await Promise.all([
    calculateApys(Compound.cETH, "ETH"),
    calculateApys(Compound.cUSDC, "USDC"),
    calculateApys(Compound.cDAI, "DAI"),
    calculateApys(Compound.cUSDT, "USDT"),
    calculateApys(Compound.cUNI, "UNI"),
    calculateApys(Compound.cZRX, "ZRX"),
    calculateApys(Compound.cBAT, "BAT"),
    calculateApys(Compound.cCOMP, "COMP"),
  ]);

  return {
    props: {
      apys,
    },
  };
};
