import Home from "./Components/Pages/Home"
import { Routes, Route } from "react-router-dom";
import Contact from "./Components/Pages/Contact";
import Services from "./Components/Pages/Services";
import LearnMore from "./Components/Pages/LearnMore";
import Results from "./Components/Pages/Results";

function App() {

  return (
    <>
      <Routes >
        <Route path="/" element={<Home />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/LearnMore" element={<LearnMore />} />
        <Route path="/Services" element={<Services />} />
        <Route path="/Results" element={<Results />} />
      </Routes>
    </>
  )
}

export default App
