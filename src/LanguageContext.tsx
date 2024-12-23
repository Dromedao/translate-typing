import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction, useEffect } from 'react';
import i18n from 'i18next'; // Importa i18n

interface LanguageContextType {
  selectedLanguage: string;
  setSelectedLanguage: Dispatch<SetStateAction<string>>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>(i18n.language || 'en'); // Inicializa con el idioma detectado por i18n

  useEffect(() => {
    // Actualiza el selectedLanguage si cambia el idioma de i18next
    const handleLanguageChange = (lng: string) => {
      setSelectedLanguage(lng);
    };

    // Añadir un listener a cambios de idioma
    i18n.on('languageChanged', handleLanguageChange);

    // Limpia el listener cuando el componente se desmonte
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
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
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
