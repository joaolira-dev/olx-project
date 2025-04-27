import animations from "../../animations.module.css";
import styles from "./styles.module.css";
import useApi from "../../helpers/olx-api";
import {
  PageArea,
  PageTitle,
  PageContainer,
  ErrorMessage,
} from "../../components/MainComponents";
import { doLogin } from "../../helpers/Authentication";
import { useState } from "react";

const Signin = () => {
  const api = useApi();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberPassword, setRememberPassword] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisabled(true);
    setError("");

    const json = await api.login(email, password);

    if (json.error) {
      setError(json.error);
    } else {
      doLogin(json.token, rememberPassword);
      window.location.href = "/";
    }

    setDisabled(false);
  };

  return (
    <PageContainer className={`${animations.slideInLeft} ${styles.pageContainer}`}>
      <PageTitle>Login</PageTitle>
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
            <div className={styles.areaTitle}>E-mail</div>
            <div className={styles.areaInput}>
              <input
                type="email"
                disabled={disabled}
                required
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
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </label>
          <label className={styles.area}>
            <div className={styles.areaTitle}>Lembrar senha</div>
            <div className={styles.areaInput}>
              <input
                type="checkbox"
                disabled={disabled}
                checked={rememberPassword}
                onChange={(e) => setRememberPassword(e.target.value)}
              />
            </div>
          </label>
          <label className={styles.area}>
            <div className={styles.areaTitle}></div>
            <div className={styles.areaInput}>
              <button disabled={disabled}>Fazer Login</button>
            </div>
          </label>
        </form>
      </PageArea>
    </PageContainer>
  );
};

export default Signin;
