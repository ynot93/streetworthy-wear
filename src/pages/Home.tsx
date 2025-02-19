import Hero from "../components/Hero";
import Questionnaire from "../components/Questionnaire";
import ProductShowcase from "../components/ProductShowcase";
import Footer from "../components/Footer";

const Home: React.FC = () => (
  <>
    <Hero />
    <ProductShowcase />
    <Questionnaire />
    <Footer />
  </>
);
export default Home;