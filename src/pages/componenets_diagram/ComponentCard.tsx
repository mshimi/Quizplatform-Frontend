// ComponentCard.tsx

import React from 'react';
import type { Component } from './Component';

interface ComponentCardProps {
    component: Component;
    onWeightChange: (componentName: string, functionIndex: number, newWeight: number | string) => void;
}

const ComponentCard: React.FC<ComponentCardProps> = ({ component, onWeightChange }) => {
    // Berechne das Gesamtgewicht, wobei leere Strings ignoriert werden
    const totalWeight = component.functions.reduce((sum, func) => {
        const weightValue = Number(func.weight);
        return !isNaN(weightValue) ? sum + weightValue : sum;
    }, 0);

    const bgColorClass = `bg-${component.color}`;
    const textColorClass = `text-${component.color}`;
    const borderColorClass = `border-${component.color}`;

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, functionIndex: number) => {
        const value = event.target.value;
        const newWeight = value === '' ? '' : Number(value);
        onWeightChange(component.name, functionIndex, newWeight);
    };

    return (
        <div
            className={`
                border-2 rounded-lg m-4 max-w-sm shadow-lg bg-white overflow-hidden
                ${borderColorClass}
                flex flex-col
            `}
        >
            {/* Card Header */}
            <div className={`p-4 ${bgColorClass} text-white`}>
                <h3 className="text-xl font-semibold">{component.name}</h3>
            </div>

            {/* Card Body */}
            <div className="p-4 flex-grow">
                <h4 className={`text-lg font-medium mb-2 ${textColorClass}`}>Funktionen:</h4>
                <div className={`grid grid-cols-6 gap-2 items-center font-semibold mb-2 pb-1 border-b ${borderColorClass}`}>
                    <div className="col-span-5">Beschreibung</div>
                    <div className="col-span-1 text-right">Gewicht</div>
                </div>
                {component.functions.map((func, index) => (
                    <div key={index} className="grid grid-cols-6 gap-2 items-center py-1">
                        <div className="col-span-5 break-words">
                            <span className={textColorClass}>{func.text}</span>
                        </div>
                        <div className="col-span-1">
                            <input
                                type="number"
                                value={func.weight}
                                onChange={(e) => handleInputChange(e, index)}
                                className="w-full p-1 text-right border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Card Footer */}
            <div className={`p-4 ${bgColorClass} text-white text-right`}>
                <p className="font-bold text-lg">
                    Gesamtgewicht: {totalWeight}
                </p>
            </div>
        </div>
    );
};

export default ComponentCard;