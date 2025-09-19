import React from 'react';
import type {Relationship as RelationshipType, Entity} from './data.ts';

interface RelationshipProps {
    rel: RelationshipType;
    allEntities: Entity[];
    sourceEntityName: string;
}

const Relationship: React.FC<RelationshipProps> = ({ rel, allEntities, sourceEntityName }) => {
    const targetEntity = allEntities.find(e => e.id === rel.entityId);
    if (!targetEntity) return null;

    const getSymbol = (type: string) => {
        switch(type) {
            case "One-to-Many": return `[1] --- [n]`;
            case "Many-to-One": return `[n] --- [1]`;
            case "Many-to-Many": return `[n] --- [n]`;
            default: return `---`;
        }
    }

    return (
        <div className="flex justify-between items-center text-xs px-3 py-1.5 border-t border-slate-200">
            <span className="font-medium text-slate-700">{sourceEntityName}</span>
            <span className="text-cyan-600 font-mono font-bold">{getSymbol(rel.type)}</span>
            <span className="font-medium text-slate-700">{targetEntity.name}</span>
        </div>
    );
}

export default Relationship;