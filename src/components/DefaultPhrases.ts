type Language =
  | "english"
  | "spanish"
  | "french"
  | "arabic"
  | "italian"
  | "chinese"
  | "korean"
  | "german"
  | "dutch"
  | "turkish"
  | "hindi"
  | "portuguese"
  | "japanese";

export const DefaultPhrases: Record<Language, string> = {
  english: "Click the button to generate a new phrase",
  spanish: "Haz clic en el botón para generar una nueva frase",
  french: "Cliquez sur le bouton pour générer une nouvelle phrase",
  arabic: "Anqar 'ala alzarr li'inja' jumlat jadidah",
  italian: "Fai clic sul pulsante per generare una nuova frase",
  chinese: "Dian ji an niu sheng cheng xin duan yu",
  korean: "Sae munguleul saengseongharyeomyeon button-eul klikhaeseyo",
  german: "Klicken Sie auf die Schaltfläche, um einen neuen Satz zu generieren",
  dutch: "Klik op de knop om een nieuwe zin te genereren",
  turkish: "Yeni bir cumle olusturmak icin dugmeye tiklayin",
  hindi: "Ek naya vakya utpann karne ke liye button par klik karein",
  portuguese: "Clique no botão para gerar uma nova frase",
  japanese:
    "Atarashii furezu o seisei suru ni wa botan o kurikku shite kudasai",
};
