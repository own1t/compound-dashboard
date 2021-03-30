import Head from "next/head";
import Link from "next/link";
import styles from "./Layout.module.css";
import HorizontalSplitIcon from "@material-ui/icons/HorizontalSplit";

const Layout = ({ children, title = "Compound Dashboard" }) => {
  return (
    <div className={styles.layout}>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <HorizontalSplitIcon className={styles.header_icon} />
        <p className={styles.header_title}>COMPOUND DASHBOARD</p>
      </header>

      <main className={styles.content}>{children}</main>

      <footer className={styles.footer}>
        <div className={styles.footer_container}>
          <div className={styles.footer_content}>
            <Link href="https://compound.finance/docs#protocol-math">
              <a target="_blank" rel="noreferrer">
                Protocol Math from Compound Doc
              </a>
            </Link>
          </div>
          <div className={styles.footer_content}>
            <Link href="https://compound.finance/docs/compound-js#introduction">
              <a target="_blank" rel="noreferrer">
                Compound.JS Doc
              </a>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
