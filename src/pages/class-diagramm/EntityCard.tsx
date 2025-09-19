import React, { useRef, useCallback } from 'react';
import type {Entity, Position} from './data.ts';
import Attribute from './Attribute.tsx';
import Relationship from './Relationship.tsx';

interface EntityCardProps {
    entity: Entity;
    position: Position;
    onDrag: (id: number, pos: Position) => void;
    onFocus: (id: number) => void;
    isDraggable: boolean;
    isFocused: boolean;
    allEntities: Entity[];
}

const EntityCard: React.FC<EntityCardProps> = ({ entity, position, onDrag, onFocus, isDraggable, isFocused, allEntities }) => {
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDraggable) return;
        e.preventDefault();
        const startX = e.clientX - position.x;
        const startY = e.clientY - position.y;
        const handleMouseMove = (moveEvent: MouseEvent) => {
            onDrag(entity.id, { x: moveEvent.clientX - startX, y: moveEvent.clientY - startY });
        };
        const handleMouseUp = () => document.removeEventListener('mousemove', handleMouseMove);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp, { once: true });
    }, [isDraggable, position.x, position.y, onDrag, entity.id]);

    return (
        <div
            ref={cardRef}
            id={`entity-${entity.id}`}
            className="absolute bg-white rounded-lg shadow-xl border border-slate-300 w-64 select-none transition-all duration-500"
            style={{ left: `${position.x}px`, top: `${position.y}px` }}
        >
            <div
                className={`bg-slate-700 text-white font-bold text-center py-2 rounded-t-lg flex justify-between items-center px-3 ${isDraggable ? 'cursor-move' : 'cursor-default'}`}
                onMouseDown={handleMouseDown}
            >
                <span>{entity.name}</span>
                <button
                    onClick={() => onFocus(entity.id)}
                    className="text-xl text-slate-300 hover:text-white transition-colors duration-200"
                    title="Beziehungen anzeigen"
                >
                    🔗
                </button>
            </div>
            <div>{entity.attributes.map(attr => <Attribute key={`${entity.id}-${attr.name}`} {...attr} />)}</div>
            {isFocused && (
                <>
                    <div className="bg-slate-200 text-slate-600 font-bold text-xs text-center py-1">
                        Beziehungen
                    </div>
                    <div>
                        {entity.relationships.map((rel, index) => (
                            <Relationship key={index} rel={rel} allEntities={allEntities} sourceEntityName={entity.name} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default EntityCard;

