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
            <img src={olxLogo} />
          </Link>
        </div>
        <nav>
          <ul>
            {logged && (
              <>
                <li>
                  <Link to="/my-account" className={styles.headerStyle}>
                    Minha Conta
                  </Link>
                </li>
                <li>
                  <Link className={styles.headerStyle} onClick={handleLogout}>
                    Sair
                  </Link>
                </li>
                <li>
                  <Link to="/post-an-ad" className={styles.button}>
                    Postar Anúncio
                  </Link>
                </li>
              </>
            )}
            {!logged && (
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
                <li>
                  <Link to="/post-an-ad" className={styles.button}>
                    Postar Anúncio
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </PageContainer>
    </div>
  );
};

export default Header;
