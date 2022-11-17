import React, { useEffect, useState } from 'react';
import i18n from "i18next";
import { useTranslation, initReactI18next, Trans } from "react-i18next";
import { translationsEn, translationsBn } from "../components/navbar/language";
import i18next from 'i18next';


export const globalContext= React.createContext(null)

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: { translation: translationsEn },
      bn: { translation: translationsBn },
    },
    lng: "en",
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });


const GlobalContext = (props) => {
 const { t } = useTranslation();
  const [count, setCount] = useState(0);

  const onChange = (event) => {
    i18n.changeLanguage(event.target.value);
    setCount((previousCount) => previousCount + 1);
  };

 
    return (
        <div>
            <globalContext.Provider value={{t,onChange}}>
                    
                    {props.children}
                 
            </globalContext.Provider>
        </div>
    );
};

export default GlobalContext;