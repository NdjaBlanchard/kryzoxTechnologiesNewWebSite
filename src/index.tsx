import { Hono } from "hono";
import { renderer } from "./renderer";
import { serveStatic } from "hono/cloudflare-workers";

const app = new Hono();

app.use(renderer);
app.use("/static/*", serveStatic({ root: "./" }));

/* ── Route API : formulaire de contact → email ── */
app.post("/api/contact", async (c) => {
  try {
    const body = await c.req.json<{
      name: string;
      email: string;
      company?: string;
      service?: string;
      message: string;
    }>();

    const { name, email, company, service, message } = body;

    if (!name || !email || !message) {
      return c.json({ error: "Champs obligatoires manquants" }, 400);
    }

    const serviceLabels: Record<string, string> = {
      bdd: "Bases de données",
      intelligence: "Intelligence des données",
      strategie: "Stratégie data",
      postgresql: "PostgreSQL Enterprise",
      formation: "Formation",
      autre: "Autre",
    };

    const serviceLabel = service ? (serviceLabels[service] ?? service) : "Non précisé";

    const emailBody = [
      `Nouveau message depuis le site KryzOx Technologies`,
      ``,
      `Nom      : ${name}`,
      `Email    : ${email}`,
      `Entreprise: ${company || "Non précisée"}`,
      `Service  : ${serviceLabel}`,
      ``,
      `Message :`,
      `${message}`,
    ].join("\n");

    // Envoi via l'API Web Fetch (compatible Cloudflare Workers)
    // Utilise un service SMTP-to-HTTP ou Mailgun si configuré
    // En l'absence de clé API, on log et on retourne succès (dev mode)
    const env = c.env as Record<string, string>;
    const mailgunKey = env?.MAILGUN_API_KEY;
    const mailgunDomain = env?.MAILGUN_DOMAIN || "kryzotec.com";

    if (mailgunKey) {
      const formData = new FormData();
      formData.append("from", `KryzOx Website <noreply@${mailgunDomain}>`);
      formData.append("to", "contact@kryzotec.com");
      formData.append("subject", `[KryzOx] Nouveau message de ${name}`);
      formData.append("text", emailBody);
      formData.append("h:Reply-To", email);

      const mgRes = await fetch(
        `https://api.mailgun.net/v3/${mailgunDomain}/messages`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${btoa(`api:${mailgunKey}`)}`,
          },
          body: formData,
        }
      );

      if (!mgRes.ok) {
        const err = await mgRes.text();
        console.error("Mailgun error:", err);
        return c.json({ error: "Échec envoi email" }, 500);
      }
    } else {
      // Mode dev — log uniquement
      console.log("=== CONTACT FORM (dev mode) ===");
      console.log(emailBody);
      console.log("=== END ===");
    }

    return c.json({ success: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return c.json({ error: "Erreur serveur" }, 500);
  }
});

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

      {/* ===== SECTION APERÇU : À PROPOS ===== */}
      <section id="apercu" class="apercu">
        <div class="apercu__inner">
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
        </div>
      </section>

      {/* ===== SECTION SERVICES ===== */}
      <section id="services" class="svc">

        {/* Topbar — même style que #postgresql */}
        <div class="svc__topbar">
          <div class="svc__topbar-line"></div>
          <span class="svc__topbar-label">Nos Services</span>
          <div class="svc__topbar-line"></div>
        </div>

        <div class="svc__inner">

          {/* Intro centrée */}
          <div class="svc__intro">
            <span class="svc__intro-eyebrow">Ce que nous faisons</span>
            <h2 class="svc__intro-title">
              Des expertises data pensées pour{" "}
              <span class="svc__intro-accent">l'Afrique digitale</span>
            </h2>
            <p class="svc__intro-lead">
              De la gestion de bases de données critiques à la formation de vos équipes,
              nos offres couvrent l'ensemble de la chaîne de valeur de la donnée.
            </p>
          </div>

          {/* ══ Volet DATA ══ */}
          <div class="svc__volet">
            <div class="svc__volet-header">
              <div class="svc__volet-line"></div>
              <h3 class="svc__volet-title">DATA</h3>
              <div class="svc__volet-line"></div>
            </div>

            <div class="svc__cards">

              {/* Card — Bases de données */}
              <article class="svc__card">
                <div class="svc__card-visual">
                  <img src="/static/svc-database.jpg" alt="Bases de données" />
                  <div class="svc__card-visual-overlay"></div>
                  <span class="svc__card-badge">
                    <i class="fas fa-database" aria-hidden="true"></i>
                  </span>
                </div>
                <div class="svc__card-body">
                  <h4 class="svc__card-title">Bases de données</h4>
                  <p class="svc__card-text">
                    Conception, administration et optimisation Oracle &amp; PostgreSQL.
                    Haute disponibilité, sécurité renforcée et performance garanties pour
                    vos environnements critiques.
                  </p>
                  <a href="#contact" class="svc__card-link">
                    En savoir plus
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </a>
                </div>
              </article>

              {/* Card — Intelligence des données */}
              <article class="svc__card">
                <div class="svc__card-visual">
                  <img src="/static/svc-intelligence.jpg" alt="Intelligence des données" />
                  <div class="svc__card-visual-overlay"></div>
                  <span class="svc__card-badge">
                    <i class="fas fa-brain" aria-hidden="true"></i>
                  </span>
                </div>
                <div class="svc__card-body">
                  <h4 class="svc__card-title">Intelligence des données</h4>
                  <p class="svc__card-text">
                    Pipelines de données, BI, visualisation et IA appliquée pour transformer
                    vos données brutes en insights actionnables et avantages compétitifs concrets.
                  </p>
                  <a href="#contact" class="svc__card-link">
                    En savoir plus
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </a>
                </div>
              </article>

            </div>
          </div>

          {/* ══ Volet CONSEIL ET FORMATION ══ */}
          <div class="svc__volet">
            <div class="svc__volet-header">
              <div class="svc__volet-line"></div>
              <h3 class="svc__volet-title">Conseil &amp; Formation</h3>
              <div class="svc__volet-line"></div>
            </div>

            <div class="svc__cards">

              {/* Card — Stratégie data */}
              <article class="svc__card">
                <div class="svc__card-visual">
                  <img src="/static/svc-strategie.jpg" alt="Stratégie data" />
                  <div class="svc__card-visual-overlay"></div>
                  <span class="svc__card-badge">
                    <i class="fas fa-chess" aria-hidden="true"></i>
                  </span>
                </div>
                <div class="svc__card-body">
                  <h4 class="svc__card-title">Stratégie data</h4>
                  <p class="svc__card-text">
                    Feuilles de route data, gouvernance, operating model Digital Factory et
                    acculturation. Le chemin le plus court vers votre maturité data.
                  </p>
                  <a href="#contact" class="svc__card-link">
                    En savoir plus
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </a>
                </div>
              </article>

              {/* Card — Formation */}
              <article class="svc__card">
                <div class="svc__card-visual">
                  <img src="/static/svc-formation.jpg" alt="Formation" />
                  <div class="svc__card-visual-overlay"></div>
                  <span class="svc__card-badge">
                    <i class="fas fa-graduation-cap" aria-hidden="true"></i>
                  </span>
                </div>
                <div class="svc__card-body">
                  <h4 class="svc__card-title">Formation</h4>
                  <p class="svc__card-text">
                    Programmes sur mesure&nbsp;: SQL avancé, data engineering, BI et culture data.
                    De l'initiation au coaching expert pour vos équipes.
                  </p>
                  <a href="#contact" class="svc__card-link">
                    En savoir plus
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </a>
                </div>
              </article>

            </div>
          </div>

          {/* CTA global */}
          <div class="svc__cta-wrap">
            <a href="#contact" class="svc__cta-btn">
              <i class="fas fa-envelope" aria-hidden="true"></i>
              Discuter de votre projet
            </a>
            <a href="#postgresql" class="svc__cta-ghost">
              Découvrir notre expertise PostgreSQL
            </a>
          </div>

        </div>
      </section>
      {/* ===== SECTION VALEURS + SECTEURS ===== */}
      <section id="valeurs" class="valeurs">
        <div class="valeurs__inner">

          {/* Colonne gauche — Secteurs */}
          <div class="valeurs__sectors">
            <p class="valeurs__sectors-intro">
              KryzOx Technologies intervient dans de multiples secteurs d'activité,
              notamment mais sans s'y limiter&nbsp;:
            </p>
            <ul class="valeurs__sectors-list">
              {[
                { icon: "fa-landmark", label: "Secteur Financier & Bancaire" },
                { icon: "fa-shield-halved", label: "Assurance" },
                { icon: "fa-tower-broadcast", label: "Télécommunications" },
                { icon: "fa-store", label: "Commerce & Distribution" },
                { icon: "fa-graduation-cap", label: "Enseignement Supérieur" },
                { icon: "fa-building-columns", label: "Secteur Public" },
                { icon: "fa-industry", label: "Mines & Industrie" },
                { icon: "fa-heart-pulse", label: "Santé & Pharma" },
              ].map((s) => (
                <li class="valeurs__sector-item">
                  <span class="valeurs__sector-icon">
                    <i class={`fas ${s.icon}`} aria-hidden="true"></i>
                  </span>
                  <span class="valeurs__sector-label">{s.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne droite — Valeurs */}
          <div class="valeurs__values">
            <div class="valeurs__values-header">
              <span class="valeurs__values-eyebrow">Qui nous sommes</span>
              <h2 class="valeurs__values-title">Nos valeurs fondamentales</h2>
            </div>

            <div class="valeurs__cards">

              <div class="valeurs__card">
                <div class="valeurs__card-icon">
                  <i class="fas fa-handshake-angle" aria-hidden="true"></i>
                </div>
                <h3 class="valeurs__card-title">Excellence du Service</h3>
                <p class="valeurs__card-text">
                  Nous livrons des solutions de haute qualité, dans les délais,
                  avec un accompagnement proactif à chaque étape.
                </p>
              </div>

              <div class="valeurs__card">
                <div class="valeurs__card-icon">
                  <i class="fas fa-scale-balanced" aria-hidden="true"></i>
                </div>
                <h3 class="valeurs__card-title">Intégrité & Respect</h3>
                <p class="valeurs__card-text">
                  Transparence, honnêteté et éthique guident chacune de nos
                  décisions et de nos relations client.
                </p>
              </div>

              <div class="valeurs__card">
                <div class="valeurs__card-icon">
                  <i class="fas fa-people-group" aria-hidden="true"></i>
                </div>
                <h3 class="valeurs__card-title">Passion & Connexion</h3>
                <p class="valeurs__card-text">
                  Nous créons des liens durables entre les données, les équipes
                  et les opportunités pour propulser l'Afrique digitale.
                </p>
              </div>

              <div class="valeurs__card">
                <div class="valeurs__card-icon">
                  <i class="fas fa-lightbulb" aria-hidden="true"></i>
                </div>
                <h3 class="valeurs__card-title">Innovation Continue</h3>
                <p class="valeurs__card-text">
                  Nous adoptons les meilleures technologies mondiales et les
                  adaptons aux réalités et défis du continent africain.
                </p>
              </div>

            </div>

            <div class="valeurs__values-cta">
              <a href="#contact" class="valeurs__cta-btn">
                En savoir plus
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* ===== SECTION POSTGRESQL ===== */}
      <section id="postgresql" class="postgres">

        {/* En-tête centré */}
        <div class="postgres__topbar">
          <div class="postgres__topbar-line"></div>
          <span class="postgres__topbar-label">PostgreSQL</span>
          <div class="postgres__topbar-line"></div>
        </div>

        <div class="postgres__inner">

          {/* Image gauche — mascotte */}
          <div class="postgres__visual">
            <div class="postgres__visual-badge">Enterprise</div>
            <img
              src="/static/postgres-elephant.jpg"
              alt="Mascotte PostgreSQL — KryzOx Technologies"
              class="postgres__img"
            />
            <div class="postgres__visual-glow"></div>
          </div>

          {/* Contenu droite */}
          <div class="postgres__content">

            <p class="postgres__eyebrow">Distributeur Officiel Entreprise</p>
            <h2 class="postgres__title">
              Expert & Distributeur Officiel de solutions{" "}
              <span class="postgres__title-accent">PostgreSQL Enterprise</span>{" "}
              en Afrique
            </h2>
            <p class="postgres__lead">
              KryzOx Technologies est distributeur agréé de solutions PostgreSQL
              Enterprise pour l'Afrique et le Moyen-Orient, avec une expertise
              approfondie en migration, implémentation et optimisation de bases
              de données critiques.
            </p>

            <h3 class="postgres__why-title">
              <i class="fas fa-bolt" aria-hidden="true"></i>
              Pourquoi choisir PostgreSQL ?
            </h3>

            <ul class="postgres__checklist">
              {[
                "Avantages économiques majeurs vs solutions propriétaires",
                "Base de données relationnelle la plus avancée au monde",
                "Migration facilitée depuis Oracle, SQL Server, MySQL",
                "Garantie SLA 24h/7 — support entreprise de niveau mondial",
                "Sécurité & conformité aux standards les plus exigeants",
                "Haute disponibilité et réplication native",
                "Base transactionnelle ACID — données critiques sécurisées",
                "Déployable partout : on-premise, cloud, hybride",
                "Prêt pour les conteneurs (Docker / Kubernetes)",
                "Adoption rapide et courbe d'apprentissage maîtrisée",
                "Formation et montée en compétence incluses",
                "Communauté mondiale active et mises à jour régulières",
              ].map((item) => (
                <li class="postgres__check-item">
                  <span class="postgres__check-icon">
                    <i class="fas fa-check" aria-hidden="true"></i>
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div class="postgres__ctas">
              <a href="#contact" class="postgres__btn postgres__btn--primary">
                <i class="fas fa-envelope" aria-hidden="true"></i>
                Demander une démo
              </a>
              <a href="#contact" class="postgres__btn postgres__btn--ghost">
                En savoir plus
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* ===== SECTION INTELLIGENCE DES DONNÉES ===== */}
      <section id="intelligence" class="intel">

        {/* Topbar — même style, couleurs adaptées au fond clair */}
        <div class="intel__topbar">
          <div class="intel__topbar-line"></div>
          <span class="intel__topbar-label">Intelligence des données</span>
          <div class="intel__topbar-line"></div>
        </div>

        <div class="intel__inner">

          {/* Contenu GAUCHE */}
          <div class="intel__content">

            <p class="intel__eyebrow">Notre expertise</p>
            <h2 class="intel__title">
              Transformez vos données brutes en{" "}
              <span class="intel__title-accent">décisions stratégiques</span>
            </h2>
            <p class="intel__lead">
              KryzOx Technologies conçoit et déploie des écosystèmes data end-to-end —
              des pipelines d'ingestion aux tableaux de bord décisionnels — pour faire
              de chaque donnée un levier de compétitivité réel.
            </p>

            <h3 class="intel__why-title">
              <i class="fas fa-chart-network" aria-hidden="true"></i>
              Ce que nous mettons en œuvre
            </h3>

            <ul class="intel__checklist">
              {[
                { icon: "fa-pipe-section",   label: "Pipelines de données (ETL/ELT) robustes et scalables" },
                { icon: "fa-chart-bar",      label: "Business Intelligence & reporting temps réel" },
                { icon: "fa-eye",            label: "Visualisation avancée (Tableau, Power BI, Metabase)" },
                { icon: "fa-brain",          label: "Intelligence Artificielle & Machine Learning appliqués" },
                { icon: "fa-magnifying-glass-chart", label: "Analytique prédictive et prescriptive" },
                { icon: "fa-warehouse",      label: "Data Warehouse & Data Lakehouse modernes" },
                { icon: "fa-shield-check",   label: "Gouvernance et qualité des données (Data Quality)" },
                { icon: "fa-gear",           label: "DataOps & automatisation des flux de données" },
                { icon: "fa-map-location",   label: "Géo-analytique et données spatiales" },
                { icon: "fa-users-gear",     label: "Self-service analytics pour vos équipes métiers" },
              ].map((item) => (
                <li class="intel__check-item">
                  <span class="intel__check-icon">
                    <i class={`fas ${item.icon}`} aria-hidden="true"></i>
                  </span>
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>

            <div class="intel__ctas">
              <a href="#contact" class="intel__btn intel__btn--primary">
                <i class="fas fa-envelope" aria-hidden="true"></i>
                Parler à un expert
              </a>
              <a href="#services" class="intel__btn intel__btn--ghost">
                Voir tous nos services
              </a>
            </div>

          </div>

          {/* Visuel DROITE */}
          <div class="intel__visual">
            <div class="intel__visual-badge">Data &amp; IA</div>
            <img
              src="/static/intel-visual.jpg"
              alt="Intelligence des données — KryzOx Technologies"
              class="intel__img"
            />
            {/* Métriques flottantes */}
            <div class="intel__metric intel__metric--top">
              <span class="intel__metric-value">+340%</span>
              <span class="intel__metric-label">ROI moyen constaté</span>
            </div>
            <div class="intel__metric intel__metric--bottom">
              <span class="intel__metric-value">Temps réel</span>
              <span class="intel__metric-label">Insights actionnables</span>
            </div>
          </div>

        </div>
      </section>

      {/* ===== SECTION STRATÉGIE DATA ===== */}
      <section id="strategie" class="strat">

        {/* Topbar */}
        <div class="strat__topbar">
          <div class="strat__topbar-line"></div>
          <span class="strat__topbar-label">Stratégie Data</span>
          <div class="strat__topbar-line"></div>
        </div>

        <div class="strat__inner">

          {/* Image GAUCHE */}
          <div class="strat__visual">
            <div class="strat__visual-badge">Advisory</div>
            <img
              src="/static/strat-visual.jpg"
              alt="Stratégie Data — KryzOx Technologies"
              class="strat__img"
            />
            {/* Métriques flottantes */}
            <div class="strat__metric strat__metric--top">
              <span class="strat__metric-value">+85%</span>
              <span class="strat__metric-label">Maturité data en 12 mois</span>
            </div>
            <div class="strat__metric strat__metric--bottom">
              <i class="fas fa-road strat__metric-ico" aria-hidden="true"></i>
              <span class="strat__metric-label">Feuille de route sur-mesure</span>
            </div>
          </div>

          {/* Contenu DROITE */}
          <div class="strat__content">

            <p class="strat__eyebrow">Notre expertise conseil</p>
            <h2 class="strat__title">
              Une feuille de route data{" "}
              <span class="strat__title-accent">claire, réaliste et actionnable</span>
            </h2>
            <p class="strat__lead">
              KryzOx Technologies vous accompagne dans la définition et l'exécution
              de votre stratégie data — de l'audit de maturité à l'operating model
              Digital Factory, en passant par la gouvernance et l'acculturation de vos équipes.
            </p>

            {/* Phases / processus */}
            <div class="strat__phases">
              <div class="strat__phase">
                <span class="strat__phase-num">01</span>
                <div class="strat__phase-body">
                  <h4 class="strat__phase-title">Audit de maturité data</h4>
                  <p class="strat__phase-text">
                    Évaluation 360° de votre patrimoine data, de vos usages, de votre organisation
                    et de vos outils existants. Identification des gaps et des quick wins.
                  </p>
                </div>
              </div>
              <div class="strat__phase">
                <span class="strat__phase-num">02</span>
                <div class="strat__phase-body">
                  <h4 class="strat__phase-title">Vision & feuille de route</h4>
                  <p class="strat__phase-text">
                    Co-construction d'une vision data alignée sur vos enjeux business.
                    Priorisation des chantiers, jalons et indicateurs de succès.
                  </p>
                </div>
              </div>
              <div class="strat__phase">
                <span class="strat__phase-num">03</span>
                <div class="strat__phase-body">
                  <h4 class="strat__phase-title">Gouvernance & organisation</h4>
                  <p class="strat__phase-text">
                    Mise en place du Data Office, des rôles (CDO, Data Stewards, Engineers),
                    des politiques de qualité et de sécurité des données.
                  </p>
                </div>
              </div>
              <div class="strat__phase">
                <span class="strat__phase-num">04</span>
                <div class="strat__phase-body">
                  <h4 class="strat__phase-title">Operating model Digital Factory</h4>
                  <p class="strat__phase-text">
                    Déploiement d'un modèle opérationnel agile pour produire, valoriser et
                    itérer en continu sur vos actifs data au rythme du business.
                  </p>
                </div>
              </div>
              <div class="strat__phase">
                <span class="strat__phase-num">05</span>
                <div class="strat__phase-body">
                  <h4 class="strat__phase-title">Acculturation & change management</h4>
                  <p class="strat__phase-text">
                    Programme d'accompagnement au changement pour ancrer la culture data
                    à tous les niveaux de l'organisation — du COMEX aux équipes terrain.
                  </p>
                </div>
              </div>
            </div>

            <div class="strat__ctas">
              <a href="#contact" class="strat__btn strat__btn--primary">
                <i class="fas fa-calendar-check" aria-hidden="true"></i>
                Demander un audit gratuit
              </a>
              <a href="#services" class="strat__btn strat__btn--ghost">
                Tous nos services
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* ===== SECTION POURQUOI NOUS + MÉTHODOLOGIE ===== */}
      <section id="pourquoi" class="why">

        {/* Topbar */}
        <div class="why__topbar">
          <div class="why__topbar-line"></div>
          <span class="why__topbar-label">Pourquoi KryzOx</span>
          <div class="why__topbar-line"></div>
        </div>

        <div class="why__inner">

          {/* ── En-tête centré ── */}
          <div class="why__header">
            <span class="why__eyebrow">Notre différence</span>
            <h2 class="why__title">
              Pourquoi choisir{" "}
              <span class="why__title-accent">KryzOx Technologies</span> ?
            </h2>
            <p class="why__subtitle">
              Nous combinons expertise technique mondiale et connaissance profonde des réalités
              africaines pour vous livrer des solutions data véritablement adaptées à votre contexte.
            </p>
          </div>

          {/* ── Grille arguments ── */}
          <div class="why__grid">
            {[
              {
                icon: "fa-earth-africa",
                title: "Ancrés en Afrique",
                text: "Une équipe locale qui comprend vos contraintes réglementaires, infrastructurelles et culturelles. Pas de solutions copiées-collées — des approches co-construites.",
              },
              {
                icon: "fa-certificate",
                title: "Expertise certifiée",
                text: "Partenaires et distributeurs officiels de PostgreSQL Enterprise. Nos experts cumulent plus de 15 ans d'expérience sur les environnements de données critiques.",
              },
              {
                icon: "fa-arrows-spin",
                title: "Approche bout-en-bout",
                text: "De la stratégie à l'exploitation : nous couvrons l'intégralité de la chaîne de valeur data sans sous-traitance, pour une cohérence et une qualité sans faille.",
              },
              {
                icon: "fa-shield-halved",
                title: "Souveraineté & sécurité",
                text: "Nous plaçons la souveraineté de vos données au cœur de chaque projet. Conformité aux standards internationaux et aux réglementations africaines en vigueur.",
              },
              {
                icon: "fa-rocket",
                title: "Time-to-value rapide",
                text: "Notre méthodologie agile et notre arsenal de solutions éprouvées permettent de livrer de la valeur en quelques semaines, pas en plusieurs années.",
              },
              {
                icon: "fa-users",
                title: "Transfert de compétences",
                text: "Nous ne créons pas de dépendance. Chaque mission inclut un volet formation pour autonomiser vos équipes et pérenniser les acquis dans la durée.",
              },
            ].map((item) => (
              <div class="why__card">
                <div class="why__card-icon">
                  <i class={`fas ${item.icon}`} aria-hidden="true"></i>
                </div>
                <h3 class="why__card-title">{item.title}</h3>
                <p class="why__card-text">{item.text}</p>
              </div>
            ))}
          </div>

          {/* ── Méthodologie ── */}
          <div class="why__method">
            <div class="why__method-header">
              <span class="why__method-eyebrow">Notre processus</span>
              <h2 class="why__method-title">Une méthodologie éprouvée en 5 étapes</h2>
              <p class="why__method-sub">
                Un cadre structuré, transparent et itératif — du premier échange
                jusqu'au transfert de compétences final.
              </p>
            </div>

            <div class="why__steps">
              {[
                {
                  num: "01",
                  icon: "fa-magnifying-glass",
                  title: "Découverte & Cadrage",
                  text: "Ateliers de découverte pour comprendre vos enjeux métiers, votre écosystème technique et vos objectifs prioritaires. Livrable : brief de mission validé.",
                },
                {
                  num: "02",
                  icon: "fa-diagram-project",
                  title: "Diagnostic & Architecture",
                  text: "Audit de l'existant, mapping des flux de données, identification des gaps. Conception de l'architecture cible et du plan de migration.",
                },
                {
                  num: "03",
                  icon: "fa-code",
                  title: "Développement Agile",
                  text: "Sprints courts de 2 semaines, livraisons incrémentales et démontrables. Implication continue de vos équipes pour garantir l'adoption.",
                },
                {
                  num: "04",
                  icon: "fa-vials",
                  title: "Tests & Validation",
                  text: "Recette fonctionnelle, tests de charge, validation sécurité et conformité. Aucune mise en production sans votre validation explicite.",
                },
                {
                  num: "05",
                  icon: "fa-graduation-cap",
                  title: "Déploiement & Transfert",
                  text: "Mise en production accompagnée, formation des équipes, documentation complète et support post-livraison. Votre autonomie, notre succès.",
                },
              ].map((step, i) => (
                <div class="why__step">
                  <div class="why__step-head">
                    <span class="why__step-num">{step.num}</span>
                    <div class="why__step-icon">
                      <i class={`fas ${step.icon}`} aria-hidden="true"></i>
                    </div>
                    {i < 4 && <div class="why__step-connector" aria-hidden="true"></div>}
                  </div>
                  <div class="why__step-body">
                    <h4 class="why__step-title">{step.title}</h4>
                    <p class="why__step-text">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── CTA global ── */}
          <div class="why__cta-wrap">
            <a href="#contact" class="why__cta-btn">
              <i class="fas fa-calendar-check" aria-hidden="true"></i>
              Démarrer un projet avec nous
            </a>
          </div>

        </div>
      </section>

      {/* ===== SECTION CONTACT ===== */}
      <section id="contact" class="contact">

        <div class="contact__topbar">
          <div class="contact__topbar-line"></div>
          <span class="contact__topbar-label">Contact</span>
          <div class="contact__topbar-line"></div>
        </div>

        <div class="contact__inner">

          {/* Infos gauche */}
          <div class="contact__info">
            <span class="contact__eyebrow">Parlons de votre projet</span>
            <h2 class="contact__title">
              Prêt à transformer<br/>
              <span class="contact__title-accent">votre data en valeur ?</span>
            </h2>
            <p class="contact__lead">
              Que vous ayez un projet précis ou simplement envie d'explorer les possibilités,
              notre équipe est là pour vous répondre sous 24h.
            </p>

            <ul class="contact__details">
              <li class="contact__detail-item">
                <span class="contact__detail-icon">
                  <i class="fas fa-envelope" aria-hidden="true"></i>
                </span>
                <div>
                  <span class="contact__detail-label">Email</span>
                  <a href="mailto:contact@kryzotec.com" class="contact__detail-value">
                    contact@kryzotec.com
                  </a>
                </div>
              </li>
              <li class="contact__detail-item">
                <span class="contact__detail-icon">
                  <i class="fas fa-earth-africa" aria-hidden="true"></i>
                </span>
                <div>
                  <span class="contact__detail-label">Zone d'intervention</span>
                  <span class="contact__detail-value">Afrique & Moyen-Orient</span>
                </div>
              </li>
              <li class="contact__detail-item">
                <span class="contact__detail-icon">
                  <i class="fas fa-clock" aria-hidden="true"></i>
                </span>
                <div>
                  <span class="contact__detail-label">Réponse garantie</span>
                  <span class="contact__detail-value">Sous 24 heures ouvrées</span>
                </div>
              </li>
            </ul>

            {/* Réseaux sociaux */}
            <div class="contact__socials">
              <a href="#" class="contact__social" aria-label="LinkedIn KryzOx">
                <i class="fab fa-linkedin-in" aria-hidden="true"></i>
              </a>
              <a href="#" class="contact__social" aria-label="Twitter KryzOx">
                <i class="fab fa-x-twitter" aria-hidden="true"></i>
              </a>
              <a href="#" class="contact__social" aria-label="YouTube KryzOx">
                <i class="fab fa-youtube" aria-hidden="true"></i>
              </a>
            </div>
          </div>

          {/* Formulaire droite */}
          <div class="contact__form-wrap">
            <form
              id="contactForm"
              class="contact__form"
              novalidate
            >
              <div class="contact__form-row">
                <div class="contact__field">
                  <label class="contact__label" for="cf-name">Nom complet *</label>
                  <input
                    type="text"
                    id="cf-name"
                    name="name"
                    class="contact__input"
                    placeholder="Jean Dupont"
                    required
                  />
                </div>
                <div class="contact__field">
                  <label class="contact__label" for="cf-email">Email professionnel *</label>
                  <input
                    type="email"
                    id="cf-email"
                    name="email"
                    class="contact__input"
                    placeholder="jean@entreprise.com"
                    required
                  />
                </div>
              </div>

              <div class="contact__form-row">
                <div class="contact__field">
                  <label class="contact__label" for="cf-company">Entreprise</label>
                  <input
                    type="text"
                    id="cf-company"
                    name="company"
                    class="contact__input"
                    placeholder="Votre entreprise"
                  />
                </div>
                <div class="contact__field">
                  <label class="contact__label" for="cf-service">Service concerné</label>
                  <select id="cf-service" name="service" class="contact__select">
                    <option value="">Choisir un service…</option>
                    <option value="bdd">Bases de données</option>
                    <option value="intelligence">Intelligence des données</option>
                    <option value="strategie">Stratégie data</option>
                    <option value="postgresql">PostgreSQL Enterprise</option>
                    <option value="formation">Formation</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
              </div>

              <div class="contact__field contact__field--full">
                <label class="contact__label" for="cf-message">Votre message *</label>
                <textarea
                  id="cf-message"
                  name="message"
                  class="contact__textarea"
                  rows={5}
                  placeholder="Décrivez votre projet, vos enjeux ou votre besoin…"
                  required
                ></textarea>
              </div>

              <button type="submit" class="contact__submit" id="contactSubmit">
                <span class="contact__submit-text">
                  <i class="fas fa-paper-plane" aria-hidden="true"></i>
                  Envoyer le message
                </span>
                <span class="contact__submit-loading" aria-hidden="true">
                  <i class="fas fa-spinner fa-spin"></i>
                  Envoi en cours…
                </span>
              </button>

              <p class="contact__legal">
                En soumettant ce formulaire, vous acceptez que vos données soient utilisées
                pour vous recontacter dans le cadre de votre demande.
              </p>

              {/* Message de succès / erreur */}
              <div id="contactSuccess" class="contact__feedback contact__feedback--success" aria-live="polite">
                <i class="fas fa-circle-check" aria-hidden="true"></i>
                Votre message a bien été envoyé ! Nous vous répondrons sous 24h.
              </div>
              <div id="contactError" class="contact__feedback contact__feedback--error" aria-live="polite">
                <i class="fas fa-circle-exclamation" aria-hidden="true"></i>
                Une erreur est survenue. Veuillez réessayer ou nous écrire directement.
              </div>
            </form>
          </div>

        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer class="footer" role="contentinfo">
        <div class="footer__inner">

          {/* Colonne marque */}
          <div class="footer__brand">
            <a href="#accueil" class="footer__logo" aria-label="KryzOx Technologies">
              <img src="/static/logo-white.png" alt="KryzOx Technologies" class="footer__logo-img" />
            </a>
            <p class="footer__tagline">
              La Digital Factory africaine qui transforme vos données en moteur de croissance.
            </p>
            <div class="footer__socials">
              <a href="#" class="footer__social" aria-label="LinkedIn">
                <i class="fab fa-linkedin-in" aria-hidden="true"></i>
              </a>
              <a href="#" class="footer__social" aria-label="Twitter / X">
                <i class="fab fa-x-twitter" aria-hidden="true"></i>
              </a>
              <a href="#" class="footer__social" aria-label="YouTube">
                <i class="fab fa-youtube" aria-hidden="true"></i>
              </a>
            </div>
          </div>

          {/* Colonne Services */}
          <div class="footer__col">
            <h4 class="footer__col-title">Services</h4>
            <ul class="footer__links">
              <li><a href="#services" class="footer__link">Bases de données</a></li>
              <li><a href="#intelligence" class="footer__link">Intelligence des données</a></li>
              <li><a href="#strategie" class="footer__link">Stratégie data</a></li>
              <li><a href="#postgresql" class="footer__link">PostgreSQL Enterprise</a></li>
              <li><a href="#services" class="footer__link">Formation</a></li>
            </ul>
          </div>

          {/* Colonne Entreprise */}
          <div class="footer__col">
            <h4 class="footer__col-title">Entreprise</h4>
            <ul class="footer__links">
              <li><a href="#apropos" class="footer__link">À propos de nous</a></li>
              <li><a href="#valeurs" class="footer__link">Nos valeurs</a></li>
              <li><a href="#pourquoi" class="footer__link">Pourquoi nous choisir</a></li>
              <li><a href="#news" class="footer__link">Actualités</a></li>
              <li><a href="#blog" class="footer__link">Blog</a></li>
            </ul>
          </div>

          {/* Colonne Contact */}
          <div class="footer__col">
            <h4 class="footer__col-title">Contact</h4>
            <ul class="footer__links">
              <li>
                <a href="mailto:contact@kryzotec.com" class="footer__link footer__link--icon">
                  <i class="fas fa-envelope" aria-hidden="true"></i>
                  contact@kryzotec.com
                </a>
              </li>
              <li>
                <span class="footer__link footer__link--icon">
                  <i class="fas fa-earth-africa" aria-hidden="true"></i>
                  Afrique &amp; Moyen-Orient
                </span>
              </li>
            </ul>
            <a href="#contact" class="footer__cta">
              Nous contacter
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </a>
          </div>

        </div>

        {/* Barre de copyright */}
        <div class="footer__bottom">
          <div class="footer__bottom-inner">
            <p class="footer__copyright">
              © {new Date().getFullYear()} KryzOx Technologies. Tous droits réservés.
            </p>
            <div class="footer__legal-links">
              <a href="#" class="footer__legal-link">Mentions légales</a>
              <a href="#" class="footer__legal-link">Politique de confidentialité</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Scripts */}
      <script src="/static/main.js"></script>
      <script src="/static/contact.js"></script>
    </>,
  );
});

export default app;
