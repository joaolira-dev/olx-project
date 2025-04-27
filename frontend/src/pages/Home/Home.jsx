/* eslint-disable react-hooks/exhaustive-deps */
import styles from "./styles.module.css";
import animations from "../../animations.module.css"
import useApi from "../../helpers/olx-api";
import { FiSearch } from "react-icons/fi";
import { useState, useEffect } from "react";
import { AdItem } from "../../components/partials/AdItem/AdItem";
import { Link } from "react-router-dom";

import {
  PageArea,
  PageContainer,
  SearchArea,
} from "../../components/MainComponents";

const Home = () => {
  const api = useApi();

  const [adsList, setAdsList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [categories, setCategories] = useState([]);

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

  useEffect(() => {
    const getRecentAds = async () => {
      const json = await api.getAds({
        order: "desc",
        limit: 8,
      });
      setAdsList(json.ads);
    };
    getRecentAds();
  }, []);

  return (
    <>
      <SearchArea className={animations.fadeIn}>
        <PageContainer className={`${styles.pageContainer} ${animations.fadeIn}`}>
          <div className={styles.searchBox}>
            <form method="GET" action="/ads" className={styles.formHome}>
              <input
                type="text"
                name="q"
                placeholder="O que você procura?"
                className={styles.inputHome}
              />
              <select name="state" className={styles.selectHome}>
                <option value="">Estado</option>
                {stateList.map((state, index) => (
                  <option key={index} value={state.name}>
                    {state.name}
                  </option>
                ))}
              </select>
              <button type="submit" className={styles.searchButton}>
                <FiSearch size={24} className={styles.imgButton}/>
              </button>
            </form>
          </div>
          <div className={styles.categoryList}>
            {categories.map((c, index) => (
              <Link
                key={index}
                to={`/ads?cat=${c.slug}`}
                className={styles.categoryItem}
              >
                <img src={c.img} alt={c.name} />
                <span>{c.name}</span>
              </Link>
            ))}
          </div>
        </PageContainer>
      </SearchArea>
      <PageContainer className={animations.fadeIn}>
        <PageArea className={animations.fadeIn}>
          <h2>Anúncios Recentes</h2>
          <div className={styles.list}>
            {adsList.map((ad, index) => (
              <AdItem key={index} data={ad} width="25%" />
            ))}
          </div>
          <Link to="/ads" className={styles.seeAllLink}>
            Ver todos
          </Link>
          <hr />
        </PageArea>
      </PageContainer>
    </>
  );
};

export default Home;
