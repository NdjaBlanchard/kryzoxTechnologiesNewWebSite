import { Hono } from "hono";
import { renderer } from "./renderer";
import { serveStatic } from "hono/cloudflare-workers";

const app = new Hono();

app.use(renderer);
app.use("/static/*", serveStatic({ root: "./" }));

app.get("/", (c) => {
  return c.render(
    <>
      {/* ===== NAVBAR ===== */}
      <header id="navbar" class="navbar">
        <div class="navbar__inner">
          {/* Logo */}
          <a
            href="#accueil"
            class="navbar__logo"
            aria-label="KryzOx Technologies - Accueil"
          >
            <img
              src="/static/logo-white.png"
              alt="KryzOx Technologies"
              class="navbar__logo-img navbar__logo-white"
            />
            <img
              src="/static/logo-color.png"
              alt="KryzOx Technologies"
              class="navbar__logo-img navbar__logo-color"
            />
          </a>

          {/* Navigation desktop */}
          <nav
            class="navbar__nav"
            role="navigation"
            aria-label="Navigation principale"
          >
            <ul class="navbar__list">
              <li class="navbar__item">
                <a href="#accueil" class="navbar__link navbar__link--active">
                  Accueil
                </a>
              </li>
              <li class="navbar__item">
                <a href="#services" class="navbar__link">
                  Nos Services
                </a>
              </li>
              <li class="navbar__item">
                <a href="#apropos" class="navbar__link">
                  À Propos de Nous
                </a>
              </li>
              <li class="navbar__item navbar__item--dropdown">
                <button
                  class="navbar__link navbar__link--dropdown-trigger"
                  aria-expanded="false"
                  aria-haspopup="true"
                >
                  Ressources
                  <svg
                    class="navbar__chevron"
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 4L6 8L10 4"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>
                <div class="navbar__dropdown" role="menu">
                  <div class="navbar__dropdown-inner">
                    <a
                      href="#news"
                      class="navbar__dropdown-link"
                      role="menuitem"
                    >
                      <span class="navbar__dropdown-icon">
                        <i class="fas fa-newspaper" aria-hidden="true"></i>
                      </span>
                      <span>
                        <strong>News</strong>
                        <em>Actualités & annonces</em>
                      </span>
                    </a>
                    <a
                      href="#blog"
                      class="navbar__dropdown-link"
                      role="menuitem"
                    >
                      <span class="navbar__dropdown-icon">
                        <i class="fas fa-pen-nib" aria-hidden="true"></i>
                      </span>
                      <span>
                        <strong>Blog</strong>
                        <em>Articles & insights data</em>
                      </span>
                    </a>
                  </div>
                </div>
              </li>
              <li class="navbar__item">
                <a href="#contact" class="navbar__link navbar__link--cta">
                  Contact
                </a>
              </li>
            </ul>
          </nav>

          {/* Burger mobile */}
          <button
            class="navbar__burger"
            id="burgerBtn"
            aria-label="Ouvrir le menu"
            aria-expanded="false"
            aria-controls="mobileMenu"
          >
            <span class="navbar__burger-bar"></span>
            <span class="navbar__burger-bar"></span>
            <span class="navbar__burger-bar"></span>
          </button>
        </div>

        {/* Menu mobile */}
        <div class="navbar__mobile" id="mobileMenu" aria-hidden="true">
          <nav aria-label="Navigation mobile">
            <ul class="navbar__mobile-list">
              <li>
                <a href="#accueil" class="navbar__mobile-link">
                  Accueil
                </a>
              </li>
              <li>
                <a href="#services" class="navbar__mobile-link">
                  Nos Services
                </a>
              </li>
              <li>
                <a href="#apropos" class="navbar__mobile-link">
                  À Propos de Nous
                </a>
              </li>
              <li class="navbar__mobile-group">
                <button
                  class="navbar__mobile-link navbar__mobile-link--parent"
                  aria-expanded="false"
                >
                  Ressources{" "}
                  <i class="fas fa-chevron-down" aria-hidden="true"></i>
                </button>
                <ul class="navbar__mobile-sub">
                  <li>
                    <a href="#news" class="navbar__mobile-sublink">
                      <i class="fas fa-newspaper"></i> News
                    </a>
                  </li>
                  <li>
                    <a href="#blog" class="navbar__mobile-sublink">
                      <i class="fas fa-pen-nib"></i> Blog
                    </a>
                  </li>
                </ul>
              </li>
              <li>
                <a
                  href="#contact"
                  class="navbar__mobile-link navbar__mobile-link--cta"
                >
                  Contact
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* ===== HERO SECTION ===== */}
      <section id="accueil" class="hero" aria-label="Section principale">
        {/* Image de fond */}
        <div class="hero__bg">
          <img
            src="/static/hero-bg.jpg"
            alt=""
            class="hero__bg-img"
            aria-hidden="true"
          />
        </div>

        {/* Voile / Overlay */}
        <div class="hero__overlay" aria-hidden="true"></div>

        {/* Particules décoratives */}
        <div class="hero__particles" aria-hidden="true">
          <span class="hero__particle hero__particle--1"></span>
          <span class="hero__particle hero__particle--2"></span>
          <span class="hero__particle hero__particle--3"></span>
          <span class="hero__particle hero__particle--4"></span>
          <span class="hero__particle hero__particle--5"></span>
        </div>

        {/* Contenu */}
        <div class="hero__content">
          <div class="hero__badge">
            <span class="hero__badge-dot" aria-hidden="true"></span>
            Digital Factory Africaine
          </div>

          <h1 class="hero__title">
            Vos données,
            <br />
            votre souveraineté,
            <br />
            <span class="hero__title-accent">votre avantage décisif.</span>
          </h1>

          <p class="hero__subtitle">
            La Digital Factory qui transforme la donnée africaine en levier
            stratégique&nbsp;—
            <strong> en 90 jours, pas en 3 ans.</strong>
          </p>

          <div class="hero__actions">
            <a href="#services" class="hero__btn hero__btn--primary">
              Découvrir nos services
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M3 8H13M9 4L13 8L9 12"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </a>
            <a href="#contact" class="hero__btn hero__btn--outline">
              Parler à un expert
            </a>
          </div>

          {/* Stats */}
          <div class="hero__stats">
            <div class="hero__stat">
              <span class="hero__stat-number">90</span>
              <span class="hero__stat-label">Jours pour livrer</span>
            </div>
            <div class="hero__stat-divider" aria-hidden="true"></div>
            <div class="hero__stat">
              <span class="hero__stat-number">6</span>
              <span class="hero__stat-label">Domaines d'expertise</span>
            </div>
            <div class="hero__stat-divider" aria-hidden="true"></div>
            <div class="hero__stat">
              <span class="hero__stat-number">100%</span>
              <span class="hero__stat-label">Souverain & sécurisé</span>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div class="hero__scroll" aria-hidden="true">
          <span class="hero__scroll-text">Défiler</span>
          <div class="hero__scroll-mouse">
            <div class="hero__scroll-wheel"></div>
          </div>
        </div>
      </section>

      {/* ===== SECTION APERÇU : À PROPOS + SERVICES ===== */}
      <section id="apercu" class="apercu">
        <div class="apercu__inner">

          {/* ── Sous-section À propos ── */}
          <div id="apropos" class="apercu__about">

            {/* Image gauche */}
            <div class="apercu__about-visual">
              <img
                src="/static/about-africa.jpg"
                alt="Afrique — réseau de données KryzOx Technologies"
              />
            </div>

            {/* Contenu droite */}
            <div class="apercu__about-body">
              <span class="apercu__tag">À propos de nous</span>
              <h2 class="apercu__about-title">
                Une Digital Factory au service de la souveraineté des données africaines
              </h2>
              <p class="apercu__about-text">
                KryzOx Technologies accompagne les institutions publiques, banques, assurances,
                grandes entreprises et ONG dans leur transformation numérique souveraine.
                Notre mission&nbsp;: faire de la donnée le moteur de vos décisions stratégiques —
                avec des solutions robustes, éthiques et conçues pour l'Afrique.
              </p>
              <a href="#contact" class="apercu__about-link">
                Nous contacter
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </a>
            </div>

          </div>

          {/* ── Séparateur ── */}
          <hr class="apercu__divider" />

          {/* ── Sous-section Services ── */}
          <div id="services" class="apercu__services">

            {/* ══ Volet DATA ══ */}
            <div class="apercu__volet">
              <div class="apercu__volet-header">
                <h3 class="apercu__volet-title">DATA</h3>
                <div class="apercu__volet-line" aria-hidden="true"></div>
              </div>

              <div class="apercu__cards">

                {/* Card — Bases de données */}
                <article class="apercu__card">
                  <div class="apercu__card-icon">
                    <i class="fas fa-database" aria-hidden="true"></i>
                  </div>
                  <div class="apercu__card-body">
                    <h4 class="apercu__card-title">Bases de données</h4>
                    <p class="apercu__card-text">
                      Conception, administration et optimisation de bases de données Oracle &amp; PostgreSQL.
                      Haute disponibilité, sécurité renforcée et performance garanties pour vos environnements critiques.
                    </p>
                    <a href="#contact" class="apercu__card-link">
                      En savoir plus
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </a>
                  </div>
                </article>

                {/* Card — Intelligence des données */}
                <article class="apercu__card">
                  <div class="apercu__card-icon">
                    <i class="fas fa-brain" aria-hidden="true"></i>
                  </div>
                  <div class="apercu__card-body">
                    <h4 class="apercu__card-title">Intelligence des données</h4>
                    <p class="apercu__card-text">
                      Pipelines de données, BI, visualisation et IA appliquée pour transformer vos données brutes
                      en insights actionnables et en avantages compétitifs concrets.
                    </p>
                    <a href="#contact" class="apercu__card-link">
                      En savoir plus
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </a>
                  </div>
                </article>

              </div>
            </div>

            {/* ══ Volet CONSEIL ET FORMATION ══ */}
            <div class="apercu__volet">
              <div class="apercu__volet-header">
                <h3 class="apercu__volet-title">CONSEIL ET FORMATION</h3>
                <div class="apercu__volet-line" aria-hidden="true"></div>
              </div>

              <div class="apercu__cards">

                {/* Card — Stratégie data */}
                <article class="apercu__card">
                  <div class="apercu__card-icon">
                    <i class="fas fa-chess" aria-hidden="true"></i>
                  </div>
                  <div class="apercu__card-body">
                    <h4 class="apercu__card-title">Stratégie data</h4>
                    <p class="apercu__card-text">
                      Feuilles de route data, gouvernance, operating model Digital Factory et acculturation.
                      Nous définissons avec vous le chemin le plus court vers la maturité data.
                    </p>
                    <a href="#contact" class="apercu__card-link">
                      En savoir plus
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </a>
                  </div>
                </article>

                {/* Card — Formation */}
                <article class="apercu__card">
                  <div class="apercu__card-icon">
                    <i class="fas fa-graduation-cap" aria-hidden="true"></i>
                  </div>
                  <div class="apercu__card-body">
                    <h4 class="apercu__card-title">Formation</h4>
                    <p class="apercu__card-text">
                      Programmes sur mesure pour monter en compétence vos équipes&nbsp;: SQL avancé,
                      data engineering, BI et culture data. De l'initiation au coaching expert.
                    </p>
                    <a href="#contact" class="apercu__card-link">
                      En savoir plus
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </a>
                  </div>
                </article>

              </div>
            </div>

          </div>{/* fin apercu__services */}
        </div>{/* fin apercu__inner */}
      </section>
      <section
        id="news"
        style="height: 50vh; display:flex; align-items:center; justify-content:center; background:#f1f5f9;"
      >
        <p style="color:#00747c; font-size:1.5rem; font-family:'Inter',sans-serif;">
          Section News — À venir
        </p>
      </section>
      <section
        id="blog"
        style="height: 50vh; display:flex; align-items:center; justify-content:center; background:#f9f9f9;"
      >
        <p style="color:#00747c; font-size:1.5rem; font-family:'Inter',sans-serif;">
          Section Blog — À venir
        </p>
      </section>
      <section
        id="contact"
        style="height: 100vh; display:flex; align-items:center; justify-content:center; background:#f1f5f9;"
      >
        <p style="color:#00747c; font-size:1.5rem; font-family:'Inter',sans-serif;">
          Section Contact — À venir
        </p>
      </section>

      {/* Scripts */}
      <script src="/static/main.js"></script>
    </>,
  );
});

export default app;
