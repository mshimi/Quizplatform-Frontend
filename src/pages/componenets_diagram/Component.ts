export interface FunctionItem {
    text: string; // Beschreibung der Funktion, z.B. "Registrierung (UI + API)"
    weight: number | string; // Das "Gewicht" oder die Komplexität der Funktion (z.B. Story Points)
}


export interface Component {
    name: string; // Der Name der Komponente, z.B. "Authentifizierung"
    color: string; // Eine Farbe für die Karte oder Darstellung, z.B. "#ADD8E6" (Hellblau)
    functions: FunctionItem[]; // Eine Liste von Funktionen, die diese Komponente enthält
}