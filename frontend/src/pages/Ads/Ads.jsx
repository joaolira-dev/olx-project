/* eslint-disable react-hooks/exhaustive-deps */
import styles from "./styles.module.css";
import useApi from "../../helpers/olx-api";
import notFound from "../../assets/notFound.png"
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdItem } from "../../components/partials/AdItem/AdItem";

import { PageArea, PageContainer } from "../../components/MainComponents";
let timer;

const Home = () => {
  const api = useApi();
  const navigate = useNavigate();

  const useQueryString = () => {
    return new URLSearchParams(window.location.search);
  };
  const query = useQueryString();

  const [q, setQ] = useState(query.get("q") !== null ? query.get("q") : "");
  const [cat, setCat] = useState(
    query.get("cat") !== null ? query.get("cat") : ""
  );

  const [state, setState] = useState(
    query.get("state") !== null ? query.get("state") : ""
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [adsTotal, setAdsTotal] = useState(0);
  const [adsList, setAdsList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);

  const getAdsList = async () => {
    let skip = (currentPage - 1) * 2;

    const json = await api.getAds({
      sort: "desc",
      limit: 6,
      q,
      cat,
      state,
      skip,
    });
    setAdsList(json.ads);
    setLoading(false);
    setAdsTotal(json.total);
  };

  useEffect(() => {
    if (adsList.length > 0) {
      setPageCount(Math.ceil(adsTotal / adsList.length));
    } else {
      setPageCount(0);
    }
  }, [adsTotal]);

  useEffect(() => {
    let queryString = [];
    if (q) {
      queryString.push(`q=${q}`);
    }
    if (cat) {
      queryString.push(`cat=${cat}`);
    }
    if (state) {
      queryString.push(`state=${state}`);
    }
    navigate(`?${queryString.join("&")}`);

    clearTimeout(timer);

    setLoading(true);

    timer = setTimeout(getAdsList, 1000);
    setCurrentPage(1);
  }, [q, cat, state]);

  useEffect(() => {
    getAdsList();
  }, [currentPage]);

  useEffect(() => {
    const getStates = async () => {
      const list = await api.getStates();
      setStateList(list);
    };
    getStates();
  }, []);

  useEffect(() => {
    const getCategories = async () => {
      const cats = await api.getCategories();
      setCategories(cats);
    };
    getCategories();
  }, []);

  let pagination = [];
  for (let i = 1; i <= pageCount; i++) {
    pagination.push(i);
  }

  return (
    <>
      <PageContainer>
        <PageArea className={styles.pageArea}>
          <div className={styles.leftSide}>
            <form method="GET">
              <input
                type="text"
                name="q"
                className={styles.leftInput}
                placeholder="O que você procura?"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />

              <div className={styles.filterName}>Estado:</div>
              <select
                name="state"
                className={styles.leftSelect}
                value={state}
                onChange={(e) => setState(e.target.value)}
              >
                <option></option>
                {stateList.map((state, index) => (
                  <option value={state.name} key={index}>
                    {state.name}
                  </option>
                ))}
              </select>

              <div className={styles.filterName}>Categoria:</div>
              <ul>
                {categories.map((category, index) => (
                  <li
                    key={index}
                    className={
                      cat == category.slug
                        ? `${styles.categoryItem} ${styles.active}`
                        : `${styles.categoryItem}`
                    }
                    onClick={() =>
                      cat !== category.slug ? setCat(category.slug) : setCat("")
                    }
                  >
                    <img src={category.img} />
                    <span>{category.name}</span>
                  </li>
                ))}
              </ul>
            </form>
          </div>
          <div className={styles.rightSide}>
            <h2>Anúncios</h2>
            {loading ? (
              <div className={styles.loadingArea}>
                <div className={styles.spinner}></div>
              </div>
            ) : adsList.length > 0 ? (
              <div className={styles.list}>
                {adsList.map((ad, index) => (
                  <AdItem key={index} data={ad} width="33%" />
                ))}
              </div>
            ) : (
              <div className={styles.notFound}>
                <img src={notFound} alt="Nada encontrado" />
                <h3>Nenhum anúncio encontrado</h3>
                <p>
                  Tente ajustar os filtros ou buscar por outra palavra-chave.
                </p>
              </div>
            )}

            {!loading && (
              <div className={styles.pagination}>
                {pagination.map((page, index) => (
                  <div
                    onClick={() => setCurrentPage(page)}
                    className={
                      page === currentPage
                        ? `${styles.pagItem} ${styles.active}`
                        : `${styles.pagItem}`
                    }
                    key={index}
                  >
                    {page}
                  </div>
                ))}
              </div>
            )}
          </div>
        </PageArea>
      </PageContainer>
    </>
  );
};

export default Home;
