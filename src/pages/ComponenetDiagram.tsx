// App.tsx

import React, { useState, useMemo } from 'react';
import ComponentCard from './componenets_diagram/ComponentCard';
import type { Component } from './componenets_diagram/Component.ts';

const initialComponents: Component[] = [
    {
        name: 'Projekt Konfiguration & Initialisierung',
        color: 'black',
        functions: [
            { text: 'Backend initialisieren (Spring Boot)', weight: 1 },
            { text: 'Frontend initialisieren (React)', weight: 1 },
            { text: 'Versionskontrolle einrichten (Git/GitHub)', weight: 1 },
            { text: 'Drittanbieter-Bibliotheken evaluieren & einbinden', weight: 1 }, // z.B. JWT, Testing-Libs
            { text: 'Entwicklungsumgebung einrichten (IDEs, JDK, Node.js)', weight: 1 },
        ],
    },
    {
        name: 'Authentifizierung & Benutzerverwaltung',
        color: 'black', // Tailwind-Farbe
        functions: [
            { text: 'Nutzer registrieren (F-01)', weight: 5 },
            { text: 'Nutzer anmelden (F-01)', weight: 5 },
            { text: 'Passwort vergessen/zurücksetzen', weight: 8 }, // Abgeleitet aus F-01 & Standardfunktionalität
            { text: 'Access Token erneuern', weight: 3 }, // Abgeleitet aus F-01 (Sicherheit)
            { text: 'Profil einsehen/bearbeiten', weight: 4 }, // Abgeleitet aus Nutzerverwaltung
        ],
    },
    {
        name: 'Modulverwaltung',
        color: 'black', // Eine neue Farbe für diese Komponente
        functions: [
            { text: 'Modul abonnieren/deabonnieren (F-02)', weight: 3 },
            { text: 'Verfügbare Module anzeigen/suchen', weight: 5 }, // Abgeleitet aus F-02
            { text: 'Lernfortschritt/Statistiken pro Modul anzeigen', weight: 8 }, // Abgeleitet aus F-08 (getMyStaticperModule)

        ],
    },
    {
        name: 'Fragenverwaltung & Qualitätssicherung',
        color: 'black', // Tailwind-Farbe
        functions: [
            { text: 'Neue Multiple-Choice-Frage erstellen (F-03)', weight: 6 },
            { text: 'Frage-Änderungsvorschlag einreichen (F-05)', weight: 4 },
            { text: 'Alle Änderungsvorschläge zu abonnierten Modulen sehen (F-07)', weight: 4 },
            { text: 'Änderungsvorschlag bewerten/abstimmen (F-07)', weight: 3 },
         //   { text: 'Frage auf Gültigkeit prüfen/freischalten (Admin/Moderator Funktion)', weight: '' }, // später prüfen
        ],
    },
    {
        name: 'Quizspiel & Fortschritt',
        color: 'black', // Tailwind-Farbe
        functions: [
            { text: 'Quiz alleine spielen (F-04)', weight: 9 },
            { text: 'Quiz gegen anderen Nutzer spielen (F-06)', weight: 10 },
            { text: 'Quiz-Auswertung erhalten (F-09)', weight: 6 },
            { text: 'Quiz-Historie einsehen (F-08)', weight: 7 },
        ],
    },
    {
        name: 'System & Infrastruktur',
        color: 'black',
        functions: [

        ],
    },
];

const ComponenetDiagramm: React.FC = () => {
    const [components, setComponents] = useState<Component[]>(initialComponents);

    /**
     * Handler für die Änderung des Gewichts.
     * Aktualisiert den Zustand der Komponenten.
     */
    const handleWeightChange = (componentName: string, functionIndex: number, newWeight: number | string) => {
        setComponents(prevComponents =>
            prevComponents.map(comp => {
                if (comp.name === componentName) {
                    const updatedFunctions = comp.functions.map((func, index) => {
                        if (index === functionIndex) {
                            return { ...func, weight: newWeight };
                        }
                        return func;
                    });
                    return { ...comp, functions: updatedFunctions };
                }
                return comp;
            })
        );
    };

    /**
     * Memoisiert die Gesamtsummen, die nur neu berechnet werden,
     * wenn sich der Zustand der Komponenten ändert.
     */
    const { totalFunctions, totalWeight } = useMemo(() => {
        let totalFuncs = 0;
        let totalW = 0;
        components.forEach(comp => {
            totalFuncs += comp.functions.length;
            comp.functions.forEach(func => {
                const weightValue = Number(func.weight);
                if (!isNaN(weightValue)) {
                    totalW += weightValue;
                }
            });
        });
        return { totalFunctions: totalFuncs, totalWeight: totalW };
    }, [components]);

    return (
        <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
            <h1 className="w-full text-center text-4xl font-bold mb-8 text-gray-800">Projekt Komponenten Übersicht</h1>

            {/* Globale Zusammenfassung */}
            <div className="w-full max-w-2xl bg-white shadow-xl rounded-lg p-6 mb-8 border-l-4 border-blue-500">
                <h2 className="text-2xl font-bold mb-4 text-blue-600">Zusammenfassung</h2>
                <div className="flex justify-between font-semibold text-lg text-gray-700">
                    <span>Anzahl aller Funktionen:</span>
                    <span className="font-bold text-blue-500">{totalFunctions}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg text-gray-700 mt-2">
                    <span>Gesamtgewicht aller Funktionen:</span>
                    <span className="font-bold text-blue-500">{totalWeight}</span>
                </div>
            </div>

            <div className="flex flex-wrap justify-center">
                {components.map((comp: Component, index: number) => (
                    <ComponentCard
                        key={index}
                        component={comp}
                        onWeightChange={handleWeightChange}
                    />
                ))}
            </div>
        </div>
    );
};

export default ComponenetDiagramm;