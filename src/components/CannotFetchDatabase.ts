type Language =
  | "english"
  | "spanish"
  | "french"
  | "arab"
  | "italian"
  | "chinese"
  | "korean"
  | "german"
  | "dutch"
  | "turkish"
  | "hindi"
  | "portuguese"
  | "japanese";

export const CannotFetchDatabase: Record<Language, string> = {
  english: "Unable to connect to the database. Please try again later.",
  spanish:
    "No se pudo conectar con la base de datos. Por favor, intentelo mas tarde.",
  french:
    "Impossible de se connecter a la base de donnees. Veuillez reessayer plus tard.",
  arab: "Lam natamakan min al'ittisal biqaeidat albayanat. Yarja alttahawul lhiqan.",
  italian: "Impossibile connettersi al database. Riprova piu tardi.",
  chinese: "Wufa lianjie dao shujuku. Qing shaohou zai shi.",
  korean:
    "Deiteobeiseue yeongyeolhal su eobsseubnida. Najung-e dasi sidosihae juseyo.",
  german:
    "Verbindung zur Datenbank fehlgeschlagen. Bitte versuchen Sie es spaeter noch einmal.",
  dutch:
    "Kan geen verbinding maken met de database. Probeer het later opnieuw.",
  turkish: "Veritabanina baglanilamadi. Lutfen daha sonra tekrar deneyin.",
  hindi:
    "Databes se connect nahin ho paya. Kripya baad mein punah prayas karen.",
  portuguese:
    "Nao foi possivel conectar ao banco de dados. Por favor, tente novamente mais tarde.",
  japanese:
    "Detabesu ni setsuzoku dekimasen deshita. Ato de mou ichido otameshiku.",
};
