import "./styles.css";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="notfound-container">
      <h1>404</h1>
      <h2>Página não encontrada</h2>
      <p>A página que você tentou acessar não existe ou foi removida.</p>
      <Link to="/" className="back-home">Voltar para a Home</Link>
    </div>
  );
};

export default NotFound;
