import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en/en.js";
import es from "./es/es.js";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
    },
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, 
    },
  });

export default i18n;
