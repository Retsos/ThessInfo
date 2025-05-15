import Home from "./Components/Pages/Home"
import { Routes, Route } from "react-router-dom";
import Contact from "./Components/Pages/Contact";
import Services from "./Components/Pages/Services";
import LearnMore from "./Components/Pages/LearnMore";
import Results from "./Components/Pages/Results";
import ScrollToTop from "./Components/SmallComponents/ScrollToTop";
import ArrayMapSection from "./Components/Pages/ArrayMapSection";


function App() {

  return (
    <>
      <ScrollToTop>
        <Routes >
          <Route path="/" element={<Home />} />
          <Route path="/Contact" element={<Contact />} />
          <Route path="/LearnMore" element={<LearnMore />} />
          <Route path="/Services" element={<Services />} />
          <Route path="/Results" element={<Results />} />
          <Route path="/ArrayMapSection" element={<ArrayMapSection />} />
        </Routes>
      </ScrollToTop>
    </>
  )
}

export default App
