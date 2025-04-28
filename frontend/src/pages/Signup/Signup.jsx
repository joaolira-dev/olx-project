/* eslint-disable react-hooks/exhaustive-deps */
import styles from "./styles.module.css";
import animations from "../../animations.module.css";
import useApi from "../../helpers/olx-api";
import { useEffect, useState } from "react";
import {
  PageArea,
  PageTitle,
  PageContainer,
  ErrorMessage,
} from "../../components/MainComponents";
import { doLogin } from "../../helpers/Authentication";

const Signup = () => {
  const api = useApi();

  const [statesList, setStatesList] = useState([]);
  const [name, setName] = useState("");
  const [stateLoc, setStateLoc] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStates = async () => {
      const res = await api.getStates();
      setStatesList(res);
    };

    fetchStates();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisabled(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Senhas não coincidem!");
      setDisabled(false);
      return;
    }

    const json = await api.register(name, email, password, stateLoc);

    if (json.error) {
      setError(json.error);
    } else {
      doLogin(json.token);
      window.location.href = "/"
    }

    setDisabled(false);
  };

  return (
    <PageContainer className={`${animations.slideInLeft} ${styles.pageContainer}`}>
      <PageTitle>Cadastro</PageTitle>
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
            <div className={styles.areaTitle}>Nome Completo</div>
            <div className={styles.areaInput}>
              <input
                type="text"
                disabled={disabled}
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </label>
          <label className={styles.area}>
            <div className={styles.areaTitle}>Estado</div>
            <div className={styles.areaInput}>
              <select
                required
                value={stateLoc}
                onChange={(e) => setStateLoc(e.target.value)}
              >
                <option value="">Selecione</option>
                {statesList.map((state, index) => (
                  <option key={index} value={state._id}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>
          </label>
          <label className={styles.area}>
            <div className={styles.areaTitle}>E-mail</div>
            <div className={styles.areaInput}>
              <input
                type="email"
                disabled={disabled}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </label>
          <label className={styles.area}>
            <div className={styles.areaTitle}>Senha</div>
            <div className={styles.areaInput}>
              <input
                type="password"
                disabled={disabled}
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </label>
          <label className={styles.area}>
            <div className={styles.areaTitle}>Confirmar Senha</div>
            <div className={styles.areaInput}>
              <input
                type="password"
                disabled={disabled}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </label>
          <label className={styles.area}>
            <div className={styles.areaTitle}></div>
            <div className={styles.areaInput}>
              <button disabled={disabled}>Fazer Cadastro</button>
            </div>
          </label>
        </form>
      </PageArea>
    </PageContainer>
  );
};

export default Signup;
