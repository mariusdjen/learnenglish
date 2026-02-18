export interface EverydayPhrase {
  fr: string;
  en: string;
}

export interface PhraseCategory {
  id: string;
  label: string;
  phrases: EverydayPhrase[];
}

export const EVERYDAY_PHRASES: PhraseCategory[] = [
  {
    id: "greetings",
    label: "Salutations",
    phrases: [
      { fr: "Bonjour / Salut", en: "Hello / Hi" },
      { fr: "Comment ca va ?", en: "How are you?" },
      { fr: "Ca va bien, merci", en: "I'm fine, thank you" },
      { fr: "Enchante(e)", en: "Nice to meet you" },
      { fr: "A bientot", en: "See you soon" },
      { fr: "Bonne journee", en: "Have a good day" },
      { fr: "Bonne soiree", en: "Have a good evening" },
      { fr: "Bonne nuit", en: "Good night" },
      { fr: "Quoi de neuf ?", en: "What's up?" },
      { fr: "Ca fait longtemps !", en: "Long time no see!" },
    ],
  },
  {
    id: "restaurant",
    label: "Restaurant",
    phrases: [
      { fr: "Une table pour deux, s'il vous plait", en: "A table for two, please" },
      { fr: "Je voudrais...", en: "I would like..." },
      { fr: "L'addition, s'il vous plait", en: "The check, please" },
      { fr: "C'est delicieux", en: "It's delicious" },
      { fr: "Je suis allergique a...", en: "I'm allergic to..." },
      { fr: "Pouvez-vous recommander quelque chose ?", en: "Can you recommend something?" },
      { fr: "Un verre d'eau, s'il vous plait", en: "A glass of water, please" },
      { fr: "A emporter", en: "To go / Takeaway" },
    ],
  },
  {
    id: "transport",
    label: "Transport",
    phrases: [
      { fr: "Ou est la station de metro ?", en: "Where is the subway station?" },
      { fr: "Un aller simple", en: "A one-way ticket" },
      { fr: "Un aller-retour", en: "A round-trip ticket" },
      { fr: "C'est combien ?", en: "How much is it?" },
      { fr: "A quelle heure part le train ?", en: "What time does the train leave?" },
      { fr: "Je suis perdu(e)", en: "I'm lost" },
      { fr: "Pouvez-vous m'indiquer le chemin ?", en: "Can you show me the way?" },
      { fr: "C'est loin d'ici ?", en: "Is it far from here?" },
    ],
  },
  {
    id: "work",
    label: "Travail",
    phrases: [
      { fr: "Je travaille dans...", en: "I work in..." },
      { fr: "Quelle est votre profession ?", en: "What do you do for a living?" },
      { fr: "J'ai une reunion", en: "I have a meeting" },
      { fr: "Pouvez-vous repeter ?", en: "Can you repeat that?" },
      { fr: "Je ne comprends pas", en: "I don't understand" },
      { fr: "Je suis en retard", en: "I'm running late" },
      { fr: "Bonne idee", en: "Good idea" },
      { fr: "Je suis d'accord", en: "I agree" },
      { fr: "On fait une pause ?", en: "Shall we take a break?" },
      { fr: "Je vous envoie un email", en: "I'll send you an email" },
    ],
  },
  {
    id: "shopping",
    label: "Shopping",
    phrases: [
      { fr: "Combien ca coute ?", en: "How much does it cost?" },
      { fr: "Vous acceptez la carte ?", en: "Do you accept cards?" },
      { fr: "Je cherche...", en: "I'm looking for..." },
      { fr: "Avez-vous une taille plus grande ?", en: "Do you have a bigger size?" },
      { fr: "Je peux essayer ?", en: "Can I try it on?" },
      { fr: "C'est trop cher", en: "It's too expensive" },
      { fr: "Je vais le prendre", en: "I'll take it" },
    ],
  },
  {
    id: "daily",
    label: "Vie quotidienne",
    phrases: [
      { fr: "J'ai faim", en: "I'm hungry" },
      { fr: "J'ai soif", en: "I'm thirsty" },
      { fr: "Je suis fatigue(e)", en: "I'm tired" },
      { fr: "Il fait beau aujourd'hui", en: "The weather is nice today" },
      { fr: "Quelle heure est-il ?", en: "What time is it?" },
      { fr: "Je rentre a la maison", en: "I'm going home" },
      { fr: "Tu es libre ce soir ?", en: "Are you free tonight?" },
      { fr: "Ca ne fait rien", en: "It doesn't matter" },
      { fr: "Je m'en fiche", en: "I don't care" },
      { fr: "J'ai hate !", en: "I can't wait!" },
    ],
  },
];
