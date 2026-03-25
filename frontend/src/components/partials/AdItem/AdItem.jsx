import styles from "./styles.module.css";
import { Link } from "react-router-dom";

export const AdItem = ({ data, width, className = "", style = {} }) => {
  let price = data.priceNegotiable ? "Preço Negociável" : `R$ ${data.price}`;

  return (
    <div className={`${styles.aditem} ${className}`} style={{ width: width, ...style }}>
      <Link to={`/ad/${data.id}`}>
        <div className={styles.itemImage}>
          <img src={data.image} alt={data.title} />
        </div>
        <div className={styles.itemName}>{data.title}</div>
        <div className={styles.itemPrice}>{price}</div>
      </Link>
    </div>
  );
};
