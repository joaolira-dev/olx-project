import { useEffect, useState } from "react";
import { FiUser, FiMail, FiMapPin, FiEdit2 } from "react-icons/fi";
import animations from "../../animations.module.css";
import styles from "./styles.module.css";
import useApi from "../../helpers/olx-api";
import Cookies from "js-cookie";
import {
  PageArea,
  PageTitle,
  PageContainer,
  ErrorMessage,
} from "../../components/MainComponents";
import { AdItem } from "../../components/partials/AdItem/AdItem";

const Signin = () => {
  const api = useApi();

  const [seeAds, setSeeAds] = useState(false);
  const [adsList, setAdsList] = useState([]);
  const [error, setError] = useState("");
  const [stateList, setStateList] = useState([]);
  const [account, setAccount] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getAccountInfo = async () => {
      const json = await api.getAccount();
      setAccount(json);
      setAdsList(
        json.ads.map((ad) => {
          const defaultImage =
            ad.images.find((img) => img.default)?.url ||
            ad.images[0]?.url ||
            "";
          return {
            id: ad._id,
            title: ad.title,
            price: ad.price,
            priceNegotiable: ad.priceNegotiable,
            image: `https://olx-project-k5fv.onrender.com/media/${defaultImage}`,
          };
        })
      );
    };
    getAccountInfo();
  }, []);

  useEffect(() => {
    if (isEditing && stateList.length === 0) {
      const getStates = async () => {
        const st = await api.getStates();
        setStateList(st);
      };
      getStates();
    }
  }, [isEditing]);

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleEditAccount = async () => {
    setLoading(true);
    setError("");
    const json = await api.editAccount(account);
    if (json.error) {
      setError(json.error);
    } else {
      setIsEditing(false);
      setLoading(false);
    }
  };

  const handleSeeAds = () => {
    setSeeAds(!seeAds);
  };

  return (
    <PageContainer
      className={`${animations.slideInLeft} ${styles.pageContainer}`}
    >
      <div className={styles.header}>
        <PageTitle>Minha Conta</PageTitle>
        <button
          onClick={handleEdit}
          className={styles.editButton}
          disabled={loading}
        >
          <FiEdit2 /> {isEditing ? "Cancelar" : "Editar"}
        </button>
      </div>
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
      <PageArea>
        <div className={styles.accountCard}>
          <div className={styles.profileHeader}>
            <div className={styles.avatar}>
              {account.name?.charAt(0)?.toUpperCase()}
            </div>
            <h2>{account.name}</h2>
          </div>

          <div className={styles.accountInfo}>
            <div className={styles.infoItem}>
              <FiUser className={styles.icon} />
              <div>
                <label>Nome</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={account.name || ""}
                    onChange={(e) =>
                      setAccount({ ...account, name: e.target.value })
                    }
                    disabled={loading}
                  />
                ) : (
                  <p>{account.name}</p>
                )}
              </div>
            </div>

            <div className={styles.infoItem}>
              <FiMail className={styles.icon} />
              <div>
                <label>E-mail</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={account.email || ""}
                    onChange={(e) =>
                      setAccount({ ...account, email: e.target.value })
                    }
                    disabled={loading}
                  />
                ) : (
                  <p>{account.email}</p>
                )}
              </div>
            </div>

            <div className={styles.infoItem}>
              <FiMapPin className={styles.icon} />
              <div>
                <label>Estado</label>
                {isEditing ? (
                  <select
                    value={account.state || ""}
                    onChange={(e) =>
                      setAccount({ ...account, state: e.target.value })
                    }
                    disabled={loading}
                  >
                    {stateList.length > 0 ? (
                      stateList.map((state) => (
                        <option value={state.name} key={state._id}>
                          {state.name}
                        </option>
                      ))
                    ) : (
                      <option value="">Carregando estados...</option>
                    )}
                  </select>
                ) : (
                  <p>{account.state}</p>
                )}
              </div>
            </div>
          </div>

          {isEditing && (
            <div className={styles.actionButtons}>
              <button
                className={styles.saveButton}
                onClick={handleEditAccount}
                disabled={loading}
              >
                {loading ? "Salvando..." : "Salvar Alterações"}
              </button>
            </div>
          )}
        </div>
        <div className={styles.adsArea}>
          <button className={styles.seeAdsButton} onClick={handleSeeAds}>
            {seeAds ? "Esconder Anúncios" : "Ver anúncios da Conta"}
          </button>

          <div className={styles.ads}>
            {seeAds &&
              (adsList.length > 0 ? (
                adsList.map((ad) => (
                  <AdItem data={ad} key={ad.id} width="25%" className={styles.aditem} />
                ))
              ) : (
                <p>Nenhum anúncio encontrado</p>
              ))}
          </div>
        </div>
      </PageArea>
    </PageContainer>
  );
};

export default Signin;
