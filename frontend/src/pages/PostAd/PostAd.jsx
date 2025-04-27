/* eslint-disable react-hooks/exhaustive-deps */
import styles from "./styles.module.css";
import animations from "../../animations.module.css";
import useApi from "../../helpers/olx-api";
import { useNavigate } from "react-router-dom";
import {
  PageArea,
  PageTitle,
  PageContainer,
  ErrorMessage,
} from "../../components/MainComponents";
import { NumericFormat } from "react-number-format";
import { useState, useRef, useEffect } from "react";

const Signin = () => {
  const api = useApi();
  const navigate = useNavigate();
  const fileField = useRef();

  const [categories, setCategories] = useState([]);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [priceNegotiable, setPriceNegotiable] = useState(false);
  const [desc, setDesc] = useState("");
  const [error, setError] = useState("");
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    const getCategories = async () => {
      const cats = await api.getCategories();
      setCategories(cats);
    };
    getCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisabled(true);
    setError("");

    const fData = new FormData();
    fData.append("title", title);
    fData.append("desc", desc);
    fData.append("cat", category);
    fData.append("price", price);
    fData.append("priceneg", priceNegotiable);

    if (fileField.current.files.length > 0) {
      for (let i = 0; i < fileField.current.files.length; i++) {
        fData.append("img", fileField.current.files[i]);
      }
    }

    const json = await api.postAd(fData)

    if (json.error) {
      setError(json.error);
    } else {
      navigate(`/ad/${json.id}`)
    }

    setDisabled(false);
  };

  return (
    <PageContainer className={animations.slideInLeft}>
      <PageTitle>Postar um anúncio</PageTitle>
      <PageArea>
        {error &&
          (typeof error === "object" ? (
            Object.entries(error).map(([value], index) => (
              <ErrorMessage key={index}>
                {typeof value === "object" && value.msg
                  ? value.msg
                  : String(value)}
              </ErrorMessage>
            ))
          ) : (
            <ErrorMessage>{error}</ErrorMessage>
          ))}

        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.area}>
            <div className={styles.areaTitle}>Título</div>
            <div className={styles.areaInput}>
              <input
                type="text"
                disabled={disabled}
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </label>
          <label className={styles.area}>
            <div className={styles.areaTitle}>Descrição</div>
            <div className={styles.areaInput}>
              <textarea
                disabled={disabled}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              ></textarea>
            </div>
          </label>
          <label className={styles.area}>
            <div className={styles.areaTitle}>Categoria</div>
            <div className={styles.areaInput}>
              <select
                disabled={disabled}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option></option>
                {categories &&
                  categories.map((c) => (
                    <option value={c.name} key={c._id}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>
          </label>
          {!priceNegotiable && (
            <label className={styles.area}>
              <div className={styles.areaTitle}>Preço</div>
              <div className={styles.areaInput}>
                <NumericFormat
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix="R$ "
                  decimalScale={2}
                  fixedDecimalScale={true}
                  value={price}
                  onValueChange={(values) => {
                    const { floatValue } = values;
                    setPrice(floatValue || "");
                  }}
                  className={styles.input}
                  disabled={disabled}
                />
              </div>
            </label>
          )}
          <label className={styles.area}>
            <div className={styles.areaTitle}>Preço Negociável</div>
            <div className={styles.areaInput}>
              <input
                type="checkbox"
                disabled={disabled}
                checked={priceNegotiable}
                onChange={() => setPriceNegotiable(!priceNegotiable)}
              />
            </div>
          </label>
          <label className={styles.area}>
            <div className={styles.areaTitle}>Imagens</div>
            <div className={styles.areaInput}>
              <input
                type="file"
                disabled={disabled}
                ref={fileField}
                multiple
              />
            </div>
          </label>
          <label className={styles.area}>
            <div className={styles.areaTitle}></div>
            <div className={styles.areaInput}>
              <button disabled={disabled}>Adicionar Anúncio</button>
            </div>
          </label>
        </form>
      </PageArea>
    </PageContainer>
  );
};

export default Signin;
