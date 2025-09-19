import React, { useState, useMemo } from 'react';
import { getData } from './data';
import type {Entity, Position} from './data.ts';
import EntityCard from './EntityCard.tsx';

const getInitialPositions = (): Record<number, Position> => {
    const positions: Record<number, Position> = {};
    const columns = [ [1, 2, 3, 4], [5, 6, 7], [8, 9, 10, 11], [12, 13, 14] ];
    const colWidth = 320, rowHeight = 300, initialX = 50, initialY = 50;
    columns.forEach((col, colIndex) => {
        col.forEach((id, rowIndex) => {
            positions[id] = { x: initialX + colIndex * colWidth, y: initialY + rowIndex * rowHeight };
        });
    });
    return positions;
};

 const ClassDiagrammPage: React.FC = () => {
    const [entities] = useState<Entity[]>(getData());
    const [positions, setPositions] = useState<Record<number, Position>>(getInitialPositions());
    const [focusedEntityId, setFocusedEntityId] = useState<number | null>(null);

    const handleDrag = (id: number, newPos: Position) => {
        setPositions(prev => ({ ...prev, [id]: newPos }));
    };

    const handleFocus = (id: number) => {
        setFocusedEntityId(id);
    };

    const clearFocus = () => {
        setFocusedEntityId(null);
    };

    const focusedElements = useMemo(() => {
        if (focusedEntityId === null) return null;

        const focusedEntity = entities.find(e => e.id === focusedEntityId);
        if (!focusedEntity) return null;

        const relatedIds = new Set<number>();
        if (focusedEntity.relationships) {
            focusedEntity.relationships.forEach(r => relatedIds.add(r.entityId));
        }
        entities.forEach(e => {
            if (e.relationships && e.relationships.some(r => r.entityId === focusedEntityId)) {
                relatedIds.add(e.id);
            }
        });

        const relatedEntities = entities.filter(e => relatedIds.has(e.id));

        const focusedPositions: Record<number, Position> = {};
        const margin = 40;
        const leftX = 150;
        const rightX = 600;

        const mainCardHeight = focusedEntity.attributes.length * 30 + (focusedEntity.relationships?.length || 0) * 30 + 80;
        const totalRelatedHeight = relatedEntities.reduce((acc, curr) => acc + (curr.attributes.length * 30 + 50) + margin, 0) - margin;

        const mainY = Math.max(100, (totalRelatedHeight / 2) - (mainCardHeight / 2) + 50);
        focusedPositions[focusedEntity.id] = { x: leftX, y: mainY };

        let currentY = 50;
        relatedEntities.forEach(entity => {
            focusedPositions[entity.id] = { x: rightX, y: currentY };
            currentY += (entity.attributes.length * 30 + 50) + margin;
        });

        return {
            focusedEntity,
            relatedEntities,
            focusedPositions
        };
    }, [focusedEntityId, entities]);

    return (
        <div className="bg-slate-100 min-h-screen font-sans relative overflow-auto">
            <div className="p-8 relative" style={{width: '1800px', height: '1800px'}}>
                {focusedEntityId !== null && (
                    <div className="fixed top-4 right-4 z-20">
                        <button onClick={clearFocus} className="bg-slate-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:bg-slate-800 transition-colors">
                            Zurück zur Übersicht
                        </button>
                    </div>
                )}

                <h1 className="text-3xl font-bold text-slate-800 mb-2">Quiz System - Entity Relationship Diagram</h1>
                <p className="text-slate-600 mb-8">Ein interaktives Klassendiagramm der Datenbank-Entitäten.</p>

                {focusedEntityId === null ? (
                    <div className="relative z-10">
                        {entities.map(entity => (
                            <EntityCard
                                key={entity.id}
                                entity={entity}
                                position={positions[entity.id]}
                                onDrag={handleDrag}
                                onFocus={handleFocus}
                                isDraggable={true}
                                isFocused={false}
                                allEntities={entities}
                            />
                        ))}
                    </div>
                ) : (
                    focusedElements && (
                        <div className="relative z-10">
                            <EntityCard
                                key={focusedElements.focusedEntity.id}
                                entity={focusedElements.focusedEntity}
                                position={focusedElements.focusedPositions[focusedElements.focusedEntity.id]}
                                onDrag={() => {}}
                                onFocus={handleFocus}
                                isDraggable={false}
                                isFocused={true}
                                allEntities={entities}
                            />
                            {focusedElements.relatedEntities.map(entity => (
                                <EntityCard
                                    key={entity.id}
                                    entity={entity}
                                    position={focusedElements.focusedPositions[entity.id]}
                                    onDrag={() => {}}
                                    onFocus={handleFocus}
                                    isDraggable={false}
                                    isFocused={false}
                                    allEntities={entities}
                                />
                            ))}
                        </div>
                    )
                )}
            </div>
        </div>
    );
}

export default  ClassDiagrammPage;