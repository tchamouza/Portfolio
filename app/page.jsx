"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image"


const THEMES = ["light", "dark", "system"];
const THEME_LABELS = { light: "☀ Clair", dark: "☾ Sombre", system: "◑ Auto" };

export default function HomePage() {
  const curRef = useRef(null);
  const outRef = useRef(null);
  const [menu, setMenu] = useState(false);
  const [theme, setTheme] = useState("system");
  const [cvFile, setCvFile] = useState(null); // { name, size, url, blob }
  const [cvBanner, setCvBanner] = useState(false);
  const [bannerTimeout, setBannerTimeout] = useState(null);

  // Apply theme to <html>
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Restore CV from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("portfolio_cv_name");
    const savedUrl = localStorage.getItem("portfolio_cv_url");
    if (saved && savedUrl) setCvFile({ name: saved, size: "", url: savedUrl });
  }, []);

  // Cursor
  let mx = 0,
    my = 0,
    ox = 0,
    oy = 0;
  useEffect(() => {
    const cur = curRef.current,
      out = outRef.current;
    if (!cur || !out) return;
    const mv = (e) => {
      mx = e.clientX;
      my = e.clientY;
      cur.style.left = mx - 5 + "px";
      cur.style.top = my - 5 + "px";
    };
    const anim = () => {
      ox += (mx - ox - 15) * 0.13;
      oy += (my - oy - 15) * 0.13;
      out.style.left = ox + "px";
      out.style.top = oy + "px";
      requestAnimationFrame(anim);
    };
    window.addEventListener("mousemove", mv);
    anim();
    const onEnter = () => {
      cur.style.transform = "scale(3)";
      out.style.transform = "scale(0.5)";
    };
    const onLeave = () => {
      cur.style.transform = "scale(1)";
      out.style.transform = "scale(1)";
    };
    document.querySelectorAll("a,button,label").forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });
    return () => window.removeEventListener("mousemove", mv);
  }, []);

  const CV_URL = "/cv.pdf";
  const handleCvUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setCvFile({ name: file.name, size: file.size, url });
    localStorage.setItem("portfolio_cv_name", file.name);
    localStorage.setItem("portfolio_cv_url", url);

    // reset input
    e.target.value = null;
  }, []);

  const handleCvRemove = useCallback(() => {
    setCvFile(null);
    localStorage.removeItem("portfolio_cv_name");
    localStorage.removeItem("portfolio_cv_url");
  }, []);

  const handleCvDownload = useCallback(() => {
    const a = document.createElement("a");
    a.href = CV_URL;
    a.download = "CV_TCHAMOUZA.pdf";
    a.click();

    setCvBanner(true);

    // clear ancien timeout
    if (bannerTimeout) clearTimeout(bannerTimeout);

    // nouveau timeout
    const t = setTimeout(() => {
      setCvBanner(false);
    }, 5000);

    setBannerTimeout(t);
  }, [bannerTimeout]);

  const navSections = [
    ["#profile", "Profil"],
    ["#apropos", "À propos"],
    ["#formation", "Formation"],
    ["#competences", "Compétences"],
    ["#services", "Services"],
    ["#contact", "Contact"],
  ];

  const skills = [
    {
      num: "01",
      title: "Développement Web",
      sub: "Full-stack",
      items: ["HTML5 & CSS3", "JavaScript", "PHP / MVC", "MySQL", "Frameworks (Next.js)"],
      lvl: 4,
    },
    {
      num: "02",
      title: "Cybersécurité",
      sub: "Defensive &amp; Offensives",
      items: ["Nmap", "Wireshark", ],
      lvl: 3,
    },
    {
      num: "03",
      title: "Réseaux & Systèmes",
      sub: "Administration",
      items: ["Cisco / VLAN", "Linux (Debian)", "VMware", "Nagios", "Windows Server"],
      lvl: 4,
    },
    {
      num: "04",
      title: "Mathématiques",
      sub: "Pures",
      items: ["Algèbre", "Analyse", "Topologie", "Logique"],
      lvl: 5,
    },
    {
      num: "05",
      title: "Programmation",
      sub: "Scripting",
      items: ["Python", "C", "Bash", "Algorithmique","Powershell"],
      lvl: 4,
    },
  ];

  return (
    <>
      <div className="cursor" ref={curRef} />
      <div className="cursor-outline" ref={outRef} />

      {/* CV SUCCESS BANNER */}
      <div className={`cv-banner${cvBanner ? " visible" : ""}`}>
        <div className="cv-banner-icon">✅</div>
        <div>
          <div className="cv-banner-title">CV disponible</div>
          <div className="cv-banner-sub">{cvFile?.name}</div>
        </div>
        <button className="cv-banner-close" onClick={() => setCvBanner(false)}>
          ✕
        </button>
      </div>

      {/* NAV */}
      <nav>
        <a href="#profile" className="nav-brand">
          Toï<span>.</span>Ewaza
        </a>

        <ul className={`nav-links${menu ? " open" : ""}`}>
          {navSections.map(([h, l]) => (
            <li key={h}>
              <a href={h} onClick={() => setMenu(false)}>
                {l}
              </a>
            </li>
          ))}
        </ul>

        {/* THEME SWITCHER */}
        <div className="nav-controls">
          <div className="theme-btn" role="group" aria-label="Thème">
            {THEMES.map((t) => (
              <button
                key={t}
                className={`theme-opt${theme === t ? " active" : ""}`}
                onClick={() => setTheme(t)}
                title={THEME_LABELS[t]}
              >
                {THEME_LABELS[t]}
              </button>
            ))}
          </div>
        </div>

        {/* CV NAV BUTTON */}
          <button
            className="cv-download-btn"
            onClick={handleCvDownload}
            style={{ marginLeft: "auto", marginRight: "20px" }}
          >
            CV
          </button>

        <a
          href="#contact"
          className="nav-contact"
          style={menu ? { display: "none" } : {}}
        >
          Me contacter
        </a>
        <button
          className="nav-toggle"
          onClick={() => setMenu((v) => !v)}
          aria-label="Menu"
        >
          <span
            style={
              menu ? { transform: "rotate(45deg) translate(4px,5px)" } : {}
            }
          />
          <span style={menu ? { opacity: 0 } : {}} />
          <span
            style={
              menu ? { transform: "rotate(-45deg) translate(4px,-5px)" } : {}
            }
          />
        </button>
      </nav>

      {/* HERO */}
      <header id="profile" className="hero">
        <div className="hero-main">
          <div className="hero-left">
            <div>
              <p className="hero-overline a1">Disponible — Lomé, Togo</p>
              <h1 className="hero-name a2">
                Toï
                <br />
                Ewaza
                <br />
                <em>Tchamouza</em>
              </h1>
              <div className="hero-roles a3">
                {[
                  "Etudiant Mathématiques Fondamentales - Université de Lomé",
                  "Cybersécurité - ESIG Global Success",
                  "Administration Systèmes & Réseaux - ESIG Global Success",
                  "Développeur Web - ESIG Global Success",
                ].map((r, i) => (
                  <div className="hero-role" key={i}>
                    <span className="role-dot" />
                    {r}
                  </div>
                ))}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
                marginTop: "auto",
              }}
            >
              <a href="#contact" className="cta-primary">
                Me contacter
              </a>
              <a href="#services" className="cta-secondary">
                Mes services
              </a>
              {cvFile && (
                <button
                  className="cta-primary"
                  onClick={handleCvDownload}
                  style={{ cursor: "pointer", border: "none" }}
                >
                  ↓ Mon CV
                </button>
              )}
            </div>
          </div>
          <div className="hero-right">
            <p className="hero-right-overline">Portfolio — 2026</p>
            <div className="hero-portrait">
              <img src="/me.jpg" alt="Toï Ewaza" className="portrait-img" />

              <span className="portrait-badge">Toï Ewaza · TG</span>
            </div>
            <div className="hero-info-grid">
              {[
                ["Formation", "Mathématiques Fondamentales"],
                ["École", "ESIG Global Success"],
                ["Statut", "Disponible · Freelance"],
              ].map(([k, v]) => (
                <div className="info-cell" key={k}>
                  <div className="info-label">{k}</div>
                  <div className="info-val">{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="hero-ticker a5">
          {[
            ["3", "ans d'études — Univ. de Lomé"],
            ["2024", "entrée en formation professionnelle"],
            ["5+", "technologies maîtrisées"],
          ].map(([n, l], i) => (
            <div
              key={i}
              style={{ display: "flex", alignItems: "center", gap: "48px" }}
            >
              <div className="ticker-item">
                <div className="ticker-num">
                  {n}
                  <sup>+</sup>
                </div>
                <div className="ticker-label">{l}</div>
              </div>
              {i < 3 && <span className="ticker-sep">·</span>}
            </div>
          ))}
        </div>
      </header>

      {/* ABOUT */}
      <section id="apropos" className="section">
        <div className="section-inner">
          <div className="section-header">
            <span className="section-num">01 / À propos</span>
            <div>
              <h2 className="section-title">
                Rigueur scientifique &amp;
                <br />
                expertise technique
              </h2>
              <p className="section-sub">
                Une combinaison rare entre pensée mathématique abstraite et
                ingénierie concrète.
              </p>
            </div>
          </div>
          <div className="about-layout">
            <div className="about-col">
              <div className="about-text">
                <p>
                  Passionné par les <strong>mathématiques fondamentales</strong>{" "}
                  et les technologies de l'information, je combine une pensée
                  analytique rigoureuse avec une expertise technique pour
                  concevoir des solutions{" "}
                  <span className="hl">élégantes et performantes.</span>
                </p>
                <p>
                  Étudiant à l'<strong>Université de Lomé</strong>, je développe aussi une
                  approche unique alliant théorie mathématique et cybersécurité
                   a ESIG Global Success.Je suis capable de résoudre des problèmes complexes avec une précision algorithmique tout en assurant la robustesse et la sécurité
                  des systèmes que je conçois.Pour moi, chaque projet est une opportunité de fusionner la beauté abstraite des mathématiques avec l'efficacité pragmatique de la technologie.
                  Je suis a la recherche de stage et de mission freelance dans les domaines du développement web, de la cybersécurité et de l'administration systèmes et réseaux.
                </p>
                <p>
                  Ma formation en cybersécurité, me permet d'aborder chaque
                  projet avec une vision globale : fonctionnel, sécurisé,
                  scalable.
                </p>
              </div>
            </div>
            <div className="about-col">
              <div className="about-facts">
                {[
                  [
                    "Université",
                    "Université de Lomé — Mathématiques Fondamentales",
                  ],
                  [
                    "Formation tech",
                    "ESIG Global Success — Cybersécurité",
                  ],
                  ["Localisation", "Lomé, Togo"],
                  [
                    "Email",
                    <a href="mailto:tchamouzabeni68@gmail.com" key="e">
                      tchamouzabeni68@gmail.com
                    </a>,
                  ],
                  ["Disponibilité", "Freelance & Stages — Immédiat"],
                ].map(([k, v]) => (
                  <div className="fact" key={k}>
                    <span className="fact-k">{k}</span>
                    <span className="fact-v">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FORMATION */}
      <section id="formation" className="section">
        <div className="section-inner">
          <div className="section-header">
            <span className="section-num">02 / Formation</span>
            <h2 className="section-title">
              Parcours
              <br />
              Académique
            </h2>
          </div>
          <div className="tl-grid">
            {[
              {
                num: "I",
                year: "Juin 2022",
                school: "Lycée Avedji Elavagnon",
                degree: "Baccalauréat Série C4",
                desc: "Formation scientifique en Mathématiques & Sciences Physiques, développant la logique analytique et la rigueur de raisonnement.",
                tags: ["Mathématiques", "Physique", "Sciences"],
              },
              {
                num: "II",
                year: "Oct 2022 — Présent",
                school: "Université de Lomé",
                degree: "Licence — Mathématiques Fondamentales",
                desc: "Formation approfondie en algèbre abstraite, analyse réelle, géométrie différentielle, topologie et logique mathématique.",
                tags: [
                  "Algèbre",
                  "Analyse",
                  "Topologie",
                  "Logique",
                  "Géométrie",
                ],
              },
              {
                num: "III",
                year: "2024 — Présent",
                school: "ESIG Global Success",
                degree: "Développement Web & Cybersécurité",
                desc: "Formation technique intensive en cybersécurité. Administration systèmes Linux & Windows.",
                tags: [
                  "PHP / MySQL",
                  "Python",
                  "Linux",
                  "Pentest",
                  "Cisco",
                  "Bash",
                ],
              },
            ].map((t) => (
              <div className="tl-card" key={t.num} data-num={t.num}>
                <span className="tl-year">{t.year}</span>
                <div className="tl-school">{t.school}</div>
                <h3 className="tl-degree">{t.degree}</h3>
                <p className="tl-desc">{t.desc}</p>
                <div className="tl-tags">
                  {t.tags.map((g) => (
                    <span className="tl-tag" key={g}>
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPETENCES */}
      <section id="competences" className="section">
        <div className="section-inner">
          <div className="section-header">
            <span className="section-num">03 / Compétences</span>
            <h2 className="section-title">
              Stack &amp;
              <br />
              Savoir-faire
            </h2>
          </div>
          <table className="skills-table">
            <tbody>
              {skills.map((s) => (
                <tr key={s.num}>
                  <td className="td-num">{s.num}</td>
                  <td className="td-title">
                    <div className="st-title">{s.title}</div>
                    <div className="st-sub">{s.sub}</div>
                  </td>
                  <td className="td-items">
                    <div className="skill-items">
                      {s.items.map((it) => (
                        <span className="skill-item" key={it}>
                          {it}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="td-level">
                    <div className="level-bar">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <span
                          className={`lb${i <= s.lvl ? " on" : ""}`}
                          key={i}
                        />
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="section">
        <div className="section-inner">
          <div className="section-header">
            <span className="section-num">04 / Services</span>
            <h2 className="section-title">
              Ce que je
              <br />
              propose
            </h2>
          </div>
        </div>
        <div className="svc-grid">
          {[
            {
              title: "Développement Web Sécurisé",
              desc: "Applications web modernes avec focus sécurité, performances et bonnes pratiques. Front-end, back-end, intégration BDD complète.",
            },
            {
              title: "Réseaux & Systèmes",
              desc: "Installation, configuration et sécurisation de routeurs, switches, antennes Wi-Fi. Administration Linux & Windows en environnement professionnel.",
            },
            {
              title: "Cours de Mathématiques",
              desc: "Répétitions pour élèves du secondaire (6ème à Terminale, toutes séries). Approche pédagogique structurée et méthodes de résolution efficaces.",
            },
          ].map((s, i) => (
            <div className="svc-card" key={i}>
              <span className="svc-num">0{i + 1}</span>
              <h3 className="svc-title">{s.title}</h3>
              <p className="svc-desc">{s.desc}</p>
              <a href="#contact" className="svc-link">
                Demander un devis →
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="section">
        <div className="section-inner">
          <div className="section-header">
            <span className="section-num">05 / Contact</span>
            <h2 className="section-title">
              Travaillons
              <br />
              ensemble
            </h2>
          </div>
        </div>
        <div className="contact-layout">
          <div className="contact-col">
            <h3 className="contact-headline">
              Vous avez un
              <br />
              <em>projet ?</em>
              <br />
              Parlons-en.
            </h3>
            <p className="contact-intro">
              Disponible pour des missions freelance, des collaborations
              techniques ou des opportunités de stage. Réponse garantie sous
              24h.
            </p>
            <div className="channels">
              {[
                {
                  icon: "📞",
                  type: "Téléphone",
                  label: "+228 92 58 88 95",
                  href: "tel:+22892588895",
                },
                {
                  icon: "✉",
                  type: "Email",
                  label: "tchamouzabeni68@gmail.com",
                  href: "mailto:tchamouzabeni68@gmail.com",
                },
                {
                  icon: "💬",
                  type: "WhatsApp",
                  label: "Me contacter sur WhatsApp",
                  href: "https://wa.me/22892588895",
                },
              ].map((c) => (
                <a
                  href={c.href}
                  className="ch"
                  key={c.type}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                >
                  <div className="ch-icon">{c.icon}</div>
                  <div>
                    <div className="ch-type">{c.type}</div>
                    <div className="ch-label">{c.label}</div>
                  </div>
                  <span className="ch-arr">→</span>
                </a>
              ))}
            </div>
          </div>
          <div className="contact-col">
            <div
              className="socials-section"
              style={{ marginTop: 0, paddingTop: 0, borderTop: "none" }}
            >
              <div className="socials-title">Retrouvez-moi en ligne</div>
              <div className="socials-row">
                {[
                  {
                    icon: "⌥",
                    label: "GitHub",
                    sub: "github.com/tchamouza",
                    href: "https://github.com/tchamouza",
                  },
                  {
                    icon: "◈",
                    label: "LinkedIn",
                    sub: "linkedin.com/in/toï-ewaza-tchamouza",
                    href: "http://linkedin.com/in/toï-ewaza-tchamouza/",
                  },
                  {
                    icon: "✉",
                    label: "Email direct",
                    sub: "tchamouzabeni68@gmail.com",
                    href: "mailto:tchamouzabeni68@gmail.com",
                  },
                ].map((s) => (
                  <a
                    href={s.href}
                    className="soc"
                    key={s.label}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="soc-icon">{s.icon}</span>
                    <div>
                      <div
                        style={{
                          fontWeight: 500,
                          color: "var(--ink)",
                          fontSize: ".88rem",
                        }}
                      >
                        {s.label}
                      </div>
                      <div
                        style={{ fontSize: ".72rem", color: "var(--muted)" }}
                      >
                        {s.sub}
                      </div>
                    </div>
                    <span
                      style={{
                        marginLeft: "auto",
                        fontSize: ".8rem",
                        color: "var(--accent)",
                      }}
                    >
                      ↗
                    </span>
                  </a>
                ))}
              </div>
              <div
                style={{
                  marginTop: 24,
                  padding: 24,
                  background: "var(--ink)",
                  borderRadius: 8,
                  color: "var(--paper)",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: ".6rem",
                    letterSpacing: ".15em",
                    textTransform: "uppercase",
                    color: "rgba(128,128,120,.6)",
                    marginBottom: 12,
                  }}
                >
                  Disponibilité
                </div>
                <div
                  style={{
                    fontFamily: "var(--serif)",
                    fontSize: "1.3rem",
                    fontWeight: 700,
                    lineHeight: 1.1,
                    marginBottom: 10,
                  }}
                >
                  Ouvert aux
                  <br />
                  <span style={{ color: "var(--accent)" }}>
                    nouvelles opportunités
                  </span>
                </div>
                <div
                  style={{ fontSize: ".8rem", lineHeight: 1.8, opacity: 0.6 }}
                >
                  Freelance, stages et collaborations. Je réponds sous 24h à
                  toutes les demandes sérieuses.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="footer-brand">
          Toï<span>.</span>Ewaza TCHAMOUZA
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div className="footer-copy">© 2026 — Tous droits réservés</div>
        </div>
      </footer>
    </>
  );
}
