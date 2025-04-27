import { Link } from "react-router-dom"
import styles from "./styles.module.css";
import animations from "../../../animations.module.css"

const Footer = () => {
  return (
    <footer className={`${styles.footer} ${animations.fadeIn}`} >
      <div className={styles.footerContainer}>
        <div className={styles.footerSection}>
          <h4>Sobre</h4>
          <p>
            Clone do OLX feito para fins de estudo por João DEV. Todos os
            direitos reservados © {new Date().getFullYear()}.
          </p>
        </div>

        <div className={styles.footerSection}>
          <h4>Links Rápidos</h4>
          <ul>
            <li>
              <Link to="/">Início</Link>
            </li>
            <li>
              <Link to="/ads">Ver Anúncios</Link>
            </li>
            <li>
              <Link to="/post-an-ad">Postar Anúncio</Link>
            </li>
            <li>
              <Link to="/signin">Login</Link>
            </li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h4>Contato</h4>
          <p>Email: joaoliradev@hotmail .com</p>
          <p>
            GitHub:{" "}
            <a href="https://github.com/joaolira-dev" target="_blank">
              /joaolira-dev
            </a>
          </p>
        </div>
      </div>

      <div className={styles.copy}>
        <p>Desenvolvido com 💜 por João DEV</p>
      </div>
    </footer>
  );
};

export default Footer;
