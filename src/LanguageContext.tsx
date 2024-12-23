import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import i18n from "i18next"; // Importa i18n

interface LanguageContextType {
  selectedLanguage: string;
  setSelectedLanguage: Dispatch<SetStateAction<string>>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    i18n.language.length === 2 ? i18n.language : i18n.language.slice(0, 2) || "en" 
  );

  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      const normalizedLanguage = lng.length === 2 ? lng : lng.split("-")[0]; 
      setSelectedLanguage(normalizedLanguage);
    };

    i18n.on("languageChanged", handleLanguageChange);
    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, []);

  return (
    <LanguageContext.Provider value={{ selectedLanguage, setSelectedLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
