import React from 'react';
import type {Attribute as AttributeType} from './data.ts';

const Attribute: React.FC<AttributeType> = ({ name, type, is_primary_key, is_foreign_key }) => (
    <div className="flex justify-between items-center text-xs px-3 py-1.5 border-t border-slate-200">
        <div className="flex items-center gap-2">
            {is_primary_key && <span className="text-yellow-500" title="Primary Key">🔑</span>}
            {is_foreign_key && <span className="text-blue-500" title="Foreign Key">🔗</span>}
            <span className="font-medium text-slate-700">{name}</span>
        </div>
        <span className="text-slate-500">{type}</span>
    </div>
);

export default Attribute;
