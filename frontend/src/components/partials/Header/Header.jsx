import styles from "./styles.module.css";
import { Link } from "react-router-dom";
import olxLogo from "../../../assets/olx-logo.png";
import { isLogged, doLogout } from "../../../helpers/Authentication";
import { PageContainer } from "../../MainComponents";

const Header = () => {
  let logged = isLogged();

  const handleLogout = () => {
    doLogout();
    window.location.href = "/";
  };

  return (
    <div className={styles.headerDiv}>
      <PageContainer className={styles.pageContainer}>
        <div className={styles.logo}>
          <Link to="/">
            <img src={olxLogo} alt="OLX Logo" />
          </Link>
        </div>
        <nav className={styles.nav}>
          <ul className={styles.ul}>
            {logged ? (
              <>
                <li>
                  <Link to="/my-account" className={styles.headerStyle}>
                    Minha Conta
                  </Link>
                </li>
                <li>
                  <Link to="/" onClick={handleLogout} className={styles.headerStyle}>
                    Sair
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/signin" className={styles.headerStyle}>
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/signup" className={styles.headerStyle}>
                    Cadastrar
                  </Link>
                </li>
              </>
            )}
          </ul>
          <Link to="/post-an-ad" className={styles.button}>
            Postar Anúncio
          </Link>
        </nav>
      </PageContainer>
    </div>
  );
};

export default Header;
