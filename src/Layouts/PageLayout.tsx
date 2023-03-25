import Header from "../components/Header/Header";
import NavBar from "../components/NavBar/NavBar";
import Footer from "../components/Footer/Footer";
import "./pageLayout.css";

type Props = {
  children: JSX.Element;
};

function PageLayout({ children }: Props) {
  return (
    <div className="container">
      <Header />
      {children}
      <NavBar />
      <Footer />
    </div>
  );
}

export default PageLayout;
