import { useLocation } from "react-router-dom";
import Header from "../components/Header/Header";
import NavBar from "../components/NavBar/NavBar";
import Footer from "../components/Footer/Footer";
import "./pageLayout.css";

type Props = {
  children: JSX.Element;
};

function PageLayout({ children }: Props) {
  const location = useLocation();
  return (
    <div className="container">
      <Header />
      {children}
      {location.pathname !== "/wikiloc/" ? <NavBar /> : ""}
      <Footer />
    </div>
  );
}

export default PageLayout;
