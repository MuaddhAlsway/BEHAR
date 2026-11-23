
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowUpLeft,
  Search,
  X,
  Menu,
  Globe2,
  Command,
  BookOpen,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import "../../styles/navbar.css";

const translations = {
  en: {
    explore: "Explore courses",
    categories: "Categories",
    about: "Our story",
    login: "Log in",
    start: "Start learning",
    search: "What do you want to learn?",
    searchLabel: "Search courses",
    searchAction: "Search",
    menu: "Open menu",
    close: "Close menu",
    tagline: "A world of learning, made yours.",
    language: "العربية",
    discovery: "YOUR NEXT CHAPTER STARTS HERE",
    popular: "Discover something new",
    shortcut: "ESC TO CLOSE",
  },
  ar: {
    explore: "استكشف الدورات",
    categories: "التصنيفات",
    about: "قصتنا",
    login: "تسجيل الدخول",
    start: "ابدأ التعلم",
    search: "ماذا ترغب أن تتعلم؟",
    searchLabel: "البحث عن الدورات",
    searchAction: "بحث",
    menu: "فتح القائمة",
    close: "إغلاق القائمة",
    tagline: "عالم من المعرفة، على طريقتك.",
    language: "English",
    discovery: "فصلك القادم يبدأ من هنا",
    popular: "اكتشف شيئًا جديدًا",
    shortcut: "ESC للإغلاق",
  },
};

function getInitialLanguage() {
  if (typeof window === "undefined") return "en";

  try {
    return localStorage.getItem("behar-language") === "ar" ? "ar" : "en";
  } catch {
    return "en";
  }
}

export default function Navbar() {
  const [language, setLanguage] = useState(getInitialLanguage);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const searchInputRef = useRef(null);
  const searchTriggerRef = useRef(null);
  const searchPanelRef = useRef(null);
  const menuTriggerRef = useRef(null);
  const mobilePanelRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const isArabic = language === "ar";
  const t = translations[language];

  const links = [
    { label: t.explore, to: "/courses", number: "01" },
    { label: t.categories, to: "/categories", number: "02" },
    { label: t.about, to: "/about", number: "03" },
  ];

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isArabic ? "rtl" : "ltr";

    try {
      localStorage.setItem("behar-language", language);
    } catch {
      // Continue without persistence when storage is unavailable.
    }
  }, [language, isArabic]);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (searchOpen) {
      searchInputRef.current?.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    if (!menuOpen && !searchOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        if (searchOpen) {
          setSearchOpen(false);
          searchTriggerRef.current?.focus();
        } else {
          setMenuOpen(false);
          menuTriggerRef.current?.focus();
        }
      }
    };

    const handlePointerDown = (event) => {
      if (
        searchOpen &&
        !searchPanelRef.current?.contains(event.target) &&
        !searchTriggerRef.current?.contains(event.target)
      ) {
        setSearchOpen(false);
      }

      if (
        menuOpen &&
        !mobilePanelRef.current?.contains(event.target) &&
        !menuTriggerRef.current?.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [menuOpen, searchOpen]);

  const changeLanguage = () => {
    setLanguage((current) => (current === "en" ? "ar" : "en"));
  };

  const openSearch = () => {
    setMenuOpen(false);
    setSearchOpen((current) => !current);
  };

  const openMenu = () => {
    setSearchOpen(false);
    setMenuOpen((current) => !current);
  };

  const handleSearch = (event) => {
    event.preventDefault();

    const term = query.trim();
    if (!term) {
      searchInputRef.current?.focus();
      return;
    }

    navigate(`/courses?search=${encodeURIComponent(term)}`);
    setSearchOpen(false);
    setMenuOpen(false);
  };

  const DiagonalArrow = isArabic ? ArrowUpLeft : ArrowUpRight;
  const ForwardArrow = isArabic ? ArrowLeft : ArrowRight;

  return (
    <header className="behar-header" dir={isArabic ? "rtl" : "ltr"}>
      <div className="behar-navbar">
        <div className="behar-navbar__inner">
          <Link
            to="/"
            className="behar-brand"
            aria-label="BEHAR — Home"
            onClick={() => {
              setMenuOpen(false);
              setSearchOpen(false);
            }}
          >
            <span className="behar-brand__symbol" aria-hidden="true">
              <span className="behar-brand__symbol-letter">B</span>
              <span className="behar-brand__symbol-dot" />
            </span>

            <span className="behar-brand__identity">
              <span className="behar-brand__name">BEHAR</span>
              <span className="behar-brand__descriptor">
                LEARNING, REIMAGINED.
              </span>
            </span>
          </Link>

          <nav className="behar-navlinks" aria-label="Primary navigation">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `behar-navlink ${isActive ? "is-active" : ""}`
                }
              >
                <span className="behar-navlink__number">{link.number}</span>
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="behar-actions">
            <button
              ref={searchTriggerRef}
              type="button"
              className={`behar-icon-button ${
                searchOpen ? "is-active" : ""
              }`}
              aria-label={t.searchLabel}
              aria-expanded={searchOpen}
              aria-controls="behar-search-panel"
              onClick={openSearch}
            >
              {searchOpen ? <X size={19} /> : <Search size={19} />}
            </button>

            <span className="behar-actions__separator" aria-hidden="true" />

            <button
              type="button"
              className="behar-language"
              onClick={changeLanguage}
              aria-label={
                isArabic ? "Switch to English" : "التبديل إلى العربية"
              }
            >
              <Globe2 size={17} strokeWidth={1.8} />
              <span>{t.language}</span>
            </button>

            <Link to="/login" className="behar-login">
              {t.login}
            </Link>

            <Link to="/register" className="behar-cta">
              <span>{t.start}</span>
              <span className="behar-cta__icon">
                <DiagonalArrow size={18} strokeWidth={2} />
              </span>
            </Link>

            <button
              ref={menuTriggerRef}
              type="button"
              className="behar-menu-toggle"
              aria-label={menuOpen ? t.close : t.menu}
              aria-expanded={menuOpen}
              aria-controls="behar-mobile-panel"
              onClick={openMenu}
            >
              {menuOpen ? <X size={23} /> : <Menu size={23} />}
            </button>
          </div>
        </div>
      </div>

      {/* Expandable search experience */}
      <div
        id="behar-search-panel"
        ref={searchPanelRef}
        className={`behar-search-panel ${searchOpen ? "is-open" : ""}`}
        aria-hidden={!searchOpen}
        inert={!searchOpen}
      >
        <div className="behar-search-panel__inner">
          <div className="behar-search-panel__eyebrow">
            <Command size={14} />
            <span>{t.discovery}</span>
          </div>

          <form onSubmit={handleSearch} className="behar-search-form">
            <Search size={26} strokeWidth={1.5} />

            <input
              ref={searchInputRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t.search}
              aria-label={t.searchLabel}
              tabIndex={searchOpen ? 0 : -1}
            />

            <button type="submit" className="behar-search-submit">
              <span>{t.searchAction}</span>
              <ForwardArrow size={20} />
            </button>
          </form>

          <div className="behar-search-panel__bottom">
            <span>
              <BookOpen size={15} />
              {t.popular}
            </span>
            <span className="behar-search-panel__hint">
              {t.shortcut}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      <div
        id="behar-mobile-panel"
        ref={mobilePanelRef}
        className={`behar-mobile-panel ${menuOpen ? "is-open" : ""}`}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <div className="behar-mobile-panel__inner">
          <div className="behar-mobile-panel__label">
            <span>BEHAR / MENU</span>
            <span>001 — 003</span>
          </div>

          <nav aria-label="Mobile navigation" className="behar-mobile-links">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="behar-mobile-link"
                tabIndex={menuOpen ? 0 : -1}
              >
                <span className="behar-mobile-link__number">
                  {link.number}
                </span>
                <span className="behar-mobile-link__title">
                  {link.label}
                </span>
                <DiagonalArrow size={24} strokeWidth={1.5} />
              </NavLink>
            ))}
          </nav>

          <div className="behar-mobile-panel__footer">
            <p>{t.tagline}</p>

            <div className="behar-mobile-panel__buttons">
              <Link
                to="/login"
                className="behar-mobile-login"
                onClick={() => setMenuOpen(false)}
                tabIndex={menuOpen ? 0 : -1}
              >
                {t.login}
              </Link>

              <Link
                to="/register"
                className="behar-mobile-cta"
                onClick={() => setMenuOpen(false)}
                tabIndex={menuOpen ? 0 : -1}
              >
                {t.start}
                <DiagonalArrow size={19} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
