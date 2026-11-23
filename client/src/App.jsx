
import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

import Navbar from "./components/navigation/Navbar";
import Home from "./pages/public/Home";
import Footer from "./layouts/Footer";

function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 520);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      className="behar-scroll-top"
      onClick={scrollToTop}
      aria-label="Scroll to top"
      style={{
        opacity: visible ? 1 : 0,
        visibility: visible ? "visible" : "hidden",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <ArrowUp size={18} strokeWidth={1.8} aria-hidden="true" />
    </button>
  );
}

function App() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <Home />
      </main>
       <Footer />
      <ScrollToTop />
    </>
  );
}

export default App;
