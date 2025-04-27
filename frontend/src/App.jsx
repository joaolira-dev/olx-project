import { useSelector } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { Template } from "./components/MainComponents.jsx";
import Header from "./components/partials/Header/Header.jsx"
import Footer from "./components/partials/Footer/Footer.jsx"
import Routes from "./routes/mainRoutes.jsx";


const App = () => {
  const user = useSelector((state) => state.user);

  return (
    <BrowserRouter>
      <Template>
        <Header />
        <Routes />
        <Footer />
      </Template>
    </BrowserRouter>
  );
};

export default App;
