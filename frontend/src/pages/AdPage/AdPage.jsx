/* eslint-disable react-hooks/exhaustive-deps */
import styles from "./styles.module.css";
import animations from "../../animations.module.css";
import { useParams, Link } from "react-router-dom";
import useApi from "../../helpers/olx-api";
import { PageArea, PageContainer, Fake, BreadCrumb } from "../../components/MainComponents";
import { useState, useEffect } from "react";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import { AdItem } from "../../components/partials/AdItem/AdItem";

const AdPage = () => {
  const api = useApi();

  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [adInfo, setAdInfo] = useState({});

  useEffect(() => {
    const getInfo = async (id) => {
      const json = await api.getAd(id, true);
      setAdInfo(json);
      setLoading(false);
      console.log(json);
    };
    getInfo(id);
  }, []);

  const formatDate = (date) => {
    let cDate = new Date(date);

    let months = [
      "janeiro",
      "fevereiro",
      "marco",
      "abril",
      "maio",
      "junho",
      "julho",
      "agosto",
      "setembro",
      "outubro",
      "novembro",
      "dezembro",
    ];
    let cDay = cDate.getDate();
    let cMonth = cDate.getMonth();
    let cYear = cDate.getFullYear();

    return `${cDay} de ${months[cMonth]} de ${cYear}`;
  };

  return (
    <PageContainer className={`${styles.pageContainer} ${animations.scaleIn}`}>
      {adInfo.category && 
      <BreadCrumb className={styles.BreadCrumb}>
        Você está aqui:
        <Link to="/">Home</Link>
        /
        <Link to={`/ads?state=${adInfo.stateName}`}>{adInfo.stateName}</Link>
        /
        <Link to={`/ads?state=${adInfo.stateName}&cat=${adInfo.category.slug}`}>{adInfo.category.name}</Link>
        / {adInfo.title}
      </BreadCrumb>
      }

      <PageArea className={styles.pageArea}>
        <div className={styles.leftSide}>
          <div className={styles.box}>
            <div className={styles.adImage}>
              {loading && <Fake height={300} className={styles.Fake} />}
              {adInfo.images && (
                <Slide
                  duration={2000}
                  autoplay={true}
                  transitionDuration={500}
                  arrows={true}
                  infinite={true}
                >
                  {adInfo.images.map((img, index) => (
                    <div key={index} className={styles.eachSlide}>
                      <img src={img} alt={`img-${index}`} />
                    </div>
                  ))}
                </Slide>
              )}
            </div>
            <div className={styles.adInfo}>
              <div className={styles.adName}>
                {loading && <Fake height={20} className={styles.Fake} />}
                {adInfo.title && <h2>{adInfo.title}</h2>}
                {adInfo.dateCreated && (
                  <small>Criado em {formatDate(adInfo.dateCreated)}</small>
                )}
              </div>
              <div className={styles.adDescription}>
                {loading && <Fake height={100} className={styles.Fake} />}
                {adInfo.description}
                <hr />
                {adInfo.views && <small>Visualizacoes: {adInfo.views}</small>}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.rightSide}>
          <div className={`${styles.box} ${styles.boxPadding}`}>
            {loading && <Fake height={20} className={styles.Fake} />}
            {adInfo.priceNegotiable && "Preço negociavel"}
            {!adInfo.priceNegotiable && adInfo.price && (
              <div className={styles.price}>
                Preço:
                <span className={styles.spanPrice}>R$ {adInfo.price}</span>
              </div>
            )}
          </div>
          {loading && <Fake height={50} className={styles.Fake} />}
          {adInfo.userInfo && (
            <>
              <a
                href={`mailto:${adInfo.userInfo.email}?subject=Interesse no anúncio&body=Olá, vi seu anúncio no site.`}
                target="_blank"
                className={styles.contactSellerLink}
              >
                Fale com o vendedor
              </a>
              <div
                className={`${styles.box} ${styles.boxPadding} ${styles.createdBy}`}
              >
                Criado por: <strong>{adInfo.userInfo.name}</strong>
                <small>E-mail: {adInfo.userInfo.email}</small>
                <small>Estado: {adInfo.stateName}</small>
              </div>
            </>
          )}
        </div>
      </PageArea>

      <div className={styles.othersArea}>
        {adInfo.others && (
          <>
            <h2>Outras ofertas do mesmo vendedor</h2>
            <div className={styles.list}>
              {adInfo.others.map((other, index) => (
                <AdItem key={index} data={other} width="25%" className={styles.aditem}/>
              ))}
            </div>
          </>
        )}
      </div>
    </PageContainer>
  );
};

export default AdPage;
