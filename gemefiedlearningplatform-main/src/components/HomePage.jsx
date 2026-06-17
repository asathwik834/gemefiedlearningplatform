import HeroSection from "./HeroSection";
import FeatureCards from "./FeatureCards";
import CoursesSection from "./CoursesSection";
import PartnersSection from "./PartnersSection";
import Footer from "./Footer";
const HomePage = () => {
  return <div className="min-h-screen bg-white"><main><HeroSection /><FeatureCards /><CoursesSection /><PartnersSection /></main><Footer /></div>;
};
export default HomePage;
