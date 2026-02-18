export interface TechWord {
  en: string;
  fr: string;
  context?: string;
}

export interface TechCategory {
  id: string;
  label: string;
  words: TechWord[];
}

export interface TechPhrase {
  fr: string;
  en: string;
}

export interface TechPhraseCategory {
  id: string;
  label: string;
  phrases: TechPhrase[];
}

export const TECH_WORDS: TechCategory[] = [
  {
    id: "dev",
    label: "Developpement",
    words: [
      { en: "codebase", fr: "base de code", context: "Our codebase is well-structured" },
      { en: "framework", fr: "framework / cadre de travail", context: "We built it using a modern framework" },
      { en: "to deploy", fr: "deployer", context: "We deploy updates every week" },
      { en: "backend", fr: "cote serveur", context: "The backend handles all the data processing" },
      { en: "frontend", fr: "cote client / interface", context: "The frontend is built with React" },
      { en: "database", fr: "base de donnees", context: "All user data is stored in the database" },
      { en: "API", fr: "interface de programmation", context: "We expose a REST API for integrations" },
      { en: "bug", fr: "bug / erreur", context: "We fixed a critical bug in production" },
      { en: "feature", fr: "fonctionnalite", context: "We're shipping a new feature next week" },
      { en: "to scale", fr: "passer a l'echelle", context: "Our architecture can scale to millions of users" },
      { en: "to ship", fr: "livrer / mettre en prod", context: "We ship fast and iterate" },
      { en: "to iterate", fr: "iterer / ameliorer", context: "We iterate based on user feedback" },
      { en: "milestone", fr: "jalon / etape cle", context: "We hit a major milestone this quarter" },
      { en: "sprint", fr: "sprint / cycle de dev", context: "Each sprint lasts two weeks" },
      { en: "open source", fr: "code ouvert", context: "We use several open source libraries" },
    ],
  },
  {
    id: "pitch",
    label: "Pitch & Investisseurs",
    words: [
      { en: "pitch", fr: "presentation / pitch", context: "I'm preparing a pitch for investors" },
      { en: "fundraising", fr: "levee de fonds", context: "We're currently fundraising" },
      { en: "seed round", fr: "tour d'amorcage", context: "We closed our seed round last month" },
      { en: "valuation", fr: "valorisation", context: "Our valuation is 2 million" },
      { en: "equity", fr: "capital / parts", context: "Investors get 15% equity" },
      { en: "traction", fr: "traction / adoption", context: "We have strong traction with 10K users" },
      { en: "revenue", fr: "chiffre d'affaires / revenus", context: "Our monthly revenue is growing 20%" },
      { en: "burn rate", fr: "taux de depenses", context: "Our burn rate is low" },
      { en: "runway", fr: "tresorerie restante", context: "We have 18 months of runway" },
      { en: "scalable", fr: "scalable / extensible", context: "Our business model is scalable" },
      { en: "market fit", fr: "adequation au marche", context: "We've achieved product-market fit" },
      { en: "ROI", fr: "retour sur investissement", context: "The ROI for our clients is clear" },
      { en: "stakeholder", fr: "partie prenante", context: "We keep all stakeholders informed" },
      { en: "competitive advantage", fr: "avantage concurrentiel", context: "Our AI gives us a competitive advantage" },
      { en: "pain point", fr: "probleme / point de douleur", context: "We solve a real pain point for businesses" },
    ],
  },
  {
    id: "product",
    label: "Produit & UX",
    words: [
      { en: "user experience (UX)", fr: "experience utilisateur", context: "We focus heavily on user experience" },
      { en: "user interface (UI)", fr: "interface utilisateur", context: "The UI is clean and intuitive" },
      { en: "onboarding", fr: "parcours d'accueil", context: "Our onboarding converts 80% of new users" },
      { en: "wireframe", fr: "maquette fil de fer", context: "I'll show you the wireframes first" },
      { en: "prototype", fr: "prototype", context: "We built a working prototype in 2 weeks" },
      { en: "MVP", fr: "produit minimum viable", context: "We launched with an MVP to test the market" },
      { en: "roadmap", fr: "feuille de route", context: "Here's our product roadmap for the next year" },
      { en: "feedback", fr: "retours / avis", context: "User feedback has been very positive" },
      { en: "use case", fr: "cas d'usage", context: "There are several use cases for our product" },
      { en: "workflow", fr: "flux de travail", context: "We simplify the entire workflow" },
      { en: "dashboard", fr: "tableau de bord", context: "The dashboard shows real-time analytics" },
      { en: "conversion rate", fr: "taux de conversion", context: "We improved the conversion rate by 30%" },
    ],
  },
  {
    id: "marketing",
    label: "Marketing & Growth",
    words: [
      { en: "growth", fr: "croissance", context: "We've seen 300% growth this year" },
      { en: "lead", fr: "prospect / lead", context: "We generate 500 leads per month" },
      { en: "target audience", fr: "public cible", context: "Our target audience is small businesses" },
      { en: "brand awareness", fr: "notoriete de marque", context: "We're building brand awareness" },
      { en: "churn rate", fr: "taux d'attrition", context: "Our churn rate is below 5%" },
      { en: "retention", fr: "retention / fidelisation", context: "User retention is our top priority" },
      { en: "acquisition cost", fr: "cout d'acquisition", context: "Our customer acquisition cost is $12" },
      { en: "engagement", fr: "engagement", context: "Daily engagement is very high" },
      { en: "to monetize", fr: "monetiser", context: "We monetize through subscriptions" },
      { en: "freemium", fr: "freemium / gratuit + premium", context: "We use a freemium business model" },
      { en: "landing page", fr: "page d'atterrissage", context: "The landing page converts really well" },
      { en: "call to action", fr: "appel a l'action", context: "Every page has a clear call to action" },
      { en: "KPI", fr: "indicateur cle", context: "Our main KPI is monthly active users" },
      { en: "content strategy", fr: "strategie de contenu", context: "We invested in a strong content strategy" },
    ],
  },
  {
    id: "business",
    label: "Business & Gestion",
    words: [
      { en: "business model", fr: "modele economique", context: "Our business model is SaaS-based" },
      { en: "partnership", fr: "partenariat", context: "We signed a partnership with a major company" },
      { en: "to outsource", fr: "externaliser", context: "We outsource some design work" },
      { en: "subscription", fr: "abonnement", context: "Users pay a monthly subscription" },
      { en: "pricing", fr: "tarification", context: "Our pricing is competitive" },
      { en: "overhead", fr: "frais generaux", context: "We keep overhead costs low" },
      { en: "profit margin", fr: "marge beneficiaire", context: "Our profit margin is healthy" },
      { en: "to bootstrap", fr: "autofinancer", context: "We bootstrapped the company for two years" },
      { en: "milestone", fr: "jalon / etape", context: "We reached a key milestone: 10K paying customers" },
      { en: "due diligence", fr: "audit prealable", context: "Investors are doing due diligence" },
      { en: "term sheet", fr: "lettre d'intention", context: "We received a term sheet from two VCs" },
      { en: "cap table", fr: "table de capitalisation", context: "Our cap table is clean" },
    ],
  },
];

export const TECH_PHRASES: TechPhraseCategory[] = [
  {
    id: "pitch_phrases",
    label: "Presenter son projet",
    phrases: [
      { fr: "Nous avons cree une solution qui...", en: "We've built a solution that..." },
      { fr: "Notre produit resout le probleme de...", en: "Our product solves the problem of..." },
      { fr: "Ce qui nous differencie c'est...", en: "What sets us apart is..." },
      { fr: "Notre marche cible represente...", en: "Our target market represents..." },
      { fr: "Nous avons deja X utilisateurs actifs", en: "We already have X active users" },
      { fr: "Notre taux de croissance est de X% par mois", en: "Our growth rate is X% per month" },
      { fr: "Nous cherchons a lever X euros", en: "We're looking to raise X euros" },
      { fr: "Nous prevoyons d'atteindre la rentabilite en...", en: "We expect to reach profitability by..." },
      { fr: "Laissez-moi vous montrer une demo", en: "Let me show you a demo" },
      { fr: "Avez-vous des questions ?", en: "Do you have any questions?" },
    ],
  },
  {
    id: "project_phrases",
    label: "Parler de son projet",
    phrases: [
      { fr: "J'ai developpe une application qui...", en: "I've developed an app that..." },
      { fr: "L'application est disponible sur iOS et Android", en: "The app is available on iOS and Android" },
      { fr: "On utilise l'intelligence artificielle pour...", en: "We use artificial intelligence to..." },
      { fr: "Le projet est en phase beta", en: "The project is in beta" },
      { fr: "On a lance la V1 le mois dernier", en: "We launched V1 last month" },
      { fr: "Les retours utilisateurs sont tres positifs", en: "User feedback has been very positive" },
      { fr: "On travaille sur la prochaine version", en: "We're working on the next version" },
      { fr: "Notre stack technique inclut...", en: "Our tech stack includes..." },
    ],
  },
  {
    id: "meeting_phrases",
    label: "Reunions & Calls",
    phrases: [
      { fr: "Je vais partager mon ecran", en: "I'm going to share my screen" },
      { fr: "Est-ce que tout le monde m'entend ?", en: "Can everyone hear me?" },
      { fr: "Je reviens vers vous la semaine prochaine", en: "I'll get back to you next week" },
      { fr: "On est dans les temps pour le lancement", en: "We're on track for launch" },
      { fr: "Il y a un blocage sur...", en: "There's a blocker on..." },
      { fr: "Je te fais un recapitulatif par email", en: "I'll send you a recap by email" },
      { fr: "Qui prend le lead sur ce sujet ?", en: "Who's taking the lead on this?" },
      { fr: "On a besoin de plus de temps pour...", en: "We need more time to..." },
    ],
  },
];
