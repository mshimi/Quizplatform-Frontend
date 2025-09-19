

 const entitiesData: Entity[] = [
    {
        "id": 1,
        "name": "User",
        "description": "Die zentrale Entität, die einen Benutzer mit Anmeldeinformationen, Profil und Rollen repräsentiert.",
        "attributes": [
            { "name": "id", "type": "UUID", "is_primary_key": true },
            { "name": "profile", "type": "Profile (Embedded)" },
            { "name": "email", "type": "String" },
            { "name": "password", "type": "String" },
            { "name": "role", "type": "Role (Enum)" }
        ],
        "relationships": [
            { "entityId": 2, "type": "Many-to-Many", "description": "follows" },
            { "entityId": 5, "type": "One-to-Many", "description": "has" },
            { "entityId": 7, "type": "One-to-Many", "description": "hosts" },
            { "entityId": 10, "type": "One-to-Many", "description": "is participant" },
            { "entityId": 12, "type": "One-to-Many", "description": "requests" },
            { "entityId": 14, "type": "One-to-Many", "description": "votes on" }
        ]
    },
    {
        "id": 2,
        "name": "Module",
        "description": "Repräsentiert ein Lernmodul, dem Fragen zugeordnet sind und dem Benutzer folgen können.",
        "attributes": [
            { "name": "id", "type": "UUID", "is_primary_key": true },
            { "name": "title", "type": "String" },
            { "name": "description", "type": "String" }
        ],
        "relationships": [
            { "entityId": 1, "type": "Many-to-Many", "description": "followed by" },
            { "entityId": 3, "type": "One-to-Many", "description": "contains" }
        ]
    },
    {
        "id": 3,
        "name": "ChoiceQuestion",
        "description": "Stellt eine einzelne Multiple-Choice-Frage dar, die einem Modul zugeordnet ist.",
        "attributes": [
            { "name": "id", "type": "UUID", "is_primary_key": true },
            { "name": "questionText", "type": "String" },
            { "name": "active", "type": "Boolean" },
            { "name": "module_id", "type": "UUID", "is_foreign_key": true, "references_entity_id": 2 }
        ],
        "relationships": [
            { "entityId": 2, "type": "Many-to-One", "description": "belongs to" },
            { "entityId": 4, "type": "One-to-Many", "description": "has" },
            { "entityId": 12, "type": "One-to-Many", "description": "is targeted by" }
        ]
    },
    {
        "id": 4,
        "name": "Answer",
        "description": "Repräsentiert eine einzelne Antwortmöglichkeit für eine ChoiceQuestion.",
        "attributes": [
            { "name": "id", "type": "UUID", "is_primary_key": true },
            { "name": "text", "type": "String" },
            { "name": "isCorrect", "type": "Boolean" },
            { "name": "question_id", "type": "UUID", "is_foreign_key": true, "references_entity_id": 3 }
        ],
        "relationships": [
            { "entityId": 3, "type": "Many-to-One", "description": "belongs to" }
        ]
    },
    {
        "id": 5,
        "name": "Quiz",
        "description": "Stellt einen einzelnen Quiz-Durchlauf eines Benutzers für ein bestimmtes Modul dar.",
        "attributes": [
            { "name": "id", "type": "UUID", "is_primary_key": true },
            { "name": "status", "type": "QuizStatus (Enum)" },
            { "name": "user_id", "type": "UUID", "is_foreign_key": true, "references_entity_id": 1 },
            { "name": "module_id", "type": "UUID", "is_foreign_key": true, "references_entity_id": 2 }
        ],
        "relationships": [
            { "entityId": 1, "type": "Many-to-One", "description": "belongs to" },
            { "entityId": 2, "type": "Many-to-One", "description": "for" },
            { "entityId": 6, "type": "One-to-Many", "description": "contains" }
        ]
    },
    {
        "id": 6,
        "name": "QuizItem",
        "description": "Repräsentiert eine einzelne Frage innerhalb eines Quiz-Durchlaufs.",
        "attributes": [
            { "name": "id", "type": "UUID", "is_primary_key": true },
            { "name": "isCorrect", "type": "Boolean" },
            { "name": "quiz_id", "type": "UUID", "is_foreign_key": true, "references_entity_id": 5 },
            { "name": "question_id", "type": "UUID", "is_foreign_key": true, "references_entity_id": 3 },
            { "name": "selected_answer_id", "type": "UUID", "is_foreign_key": true, "references_entity_id": 4 }
        ],
        "relationships": [
            { "entityId": 5, "type": "Many-to-One", "description": "part of" },
            { "entityId": 3, "type": "Many-to-One", "description": "is for" },
            { "entityId": 4, "type": "Many-to-One", "description": "user selected" }
        ]
    },
    {
        "id": 7,
        "name": "QuizLobby",
        "description": "Eine Wartehalle für ein Live-Quiz.",
        "attributes": [
            { "name": "id", "type": "UUID", "is_primary_key": true },
            { "name": "status", "type": "QuizLobbyStatus (Enum)"},
            { "name": "host_id", "type": "UUID", "is_foreign_key": true, "references_entity_id": 1 },
            { "name": "module_id", "type": "UUID", "is_foreign_key": true, "references_entity_id": 2 }
        ],
        "relationships": [
            { "entityId": 1, "type": "Many-to-One", "description": "hosted by" },
            { "entityId": 2, "type": "Many-to-One", "description": "for module" },
            { "entityId": 1, "type": "Many-to-Many", "description": "has participants" }
        ]
    },
    {
        "id": 8,
        "name": "LiveQuizSession",
        "description": "Eine aktive Live-Quiz-Sitzung.",
        "attributes": [
            { "name": "id", "type": "UUID", "is_primary_key": true },
            { "name": "lobbyId", "type": "UUID" },
            { "name": "status", "type": "SessionStatus (Enum)" },
            { "name": "module_id", "type": "UUID", "is_foreign_key": true, "references_entity_id": 2 }
        ],
        "relationships": [
            { "entityId": 2, "type": "Many-to-One", "description": "for module" },
            { "entityId": 9, "type": "One-to-Many", "description": "has" },
            { "entityId": 10, "type": "One-to-Many", "description": "has" }
        ]
    },
    {
        "id": 9,
        "name": "SessionQuestion",
        "description": "Eine Frage innerhalb einer LiveQuizSession.",
        "attributes": [
            { "name": "id", "type": "UUID", "is_primary_key": true },
            { "name": "session_id", "type": "UUID", "is_foreign_key": true, "references_entity_id": 8 },
            { "name": "question_id", "type": "UUID", "is_foreign_key": true, "references_entity_id": 3 }
        ],
        "relationships": [
            { "entityId": 8, "type": "Many-to-One", "description": "part of" },
            { "entityId": 3, "type": "Many-to-One", "description": "is for" }
        ]
    },
    {
        "id": 10,
        "name": "LiveQuizParticipant",
        "description": "Ein Teilnehmer an einer LiveQuizSession.",
        "attributes": [
            { "name": "id", "type": "UUID", "is_primary_key": true },
            { "name": "score", "type": "int" },
            { "name": "session_id", "type": "UUID", "is_foreign_key": true, "references_entity_id": 8 },
            { "name": "user_id", "type": "UUID", "is_foreign_key": true, "references_entity_id": 1 }
        ],
        "relationships": [
            { "entityId": 8, "type": "Many-to-One", "description": "in session" },
            { "entityId": 1, "type": "Many-to-One", "description": "is user" },
            { "entityId": 11, "type": "One-to-Many", "description": "has" }
        ]
    },
    {
        "id": 11,
        "name": "ParticipantAnswer",
        "description": "Die Antwort eines Teilnehmers in einer LiveQuizSession.",
        "attributes": [
            { "name": "id", "type": "UUID", "is_primary_key": true },
            { "name": "isCorrect", "type": "boolean" },
            { "name": "participant_id", "type": "UUID", "is_foreign_key": true, "references_entity_id": 10 },
            { "name": "answer_id", "type": "UUID", "is_foreign_key": true, "references_entity_id": 4 }
        ],
        "relationships": [
            { "entityId": 10, "type": "Many-to-One", "description": "by" },
            { "entityId": 4, "type": "Many-to-One", "description": "is for" }
        ]
    },
    {
        "id": 12,
        "name": "QuestionChangeRequest",
        "description": "Basisklasse für Verbesserungsvorschläge.",
        "attributes": [
            { "name": "id", "type": "UUID", "is_primary_key": true },
            { "name": "status", "type": "ChangeRequestStatus (Enum)" },
            { "name": "justification", "type": "String" },
            { "name": "question_id", "type": "UUID", "is_foreign_key": true, "references_entity_id": 3 },
            { "name": "requester_id", "type": "UUID", "is_foreign_key": true, "references_entity_id": 1 }
        ],
        "relationships": [
            { "entityId": 3, "type": "Many-to-One", "description": "targets" },
            { "entityId": 1, "type": "Many-to-One", "description": "requested by" },
            { "entityId": 14, "type": "One-to-Many", "description": "has" }
        ]
    },
    {
        "id": 13,
        "name": "ProposedAnswer",
        "description": "Eine vorgeschlagene Antwort im Rahmen eines ChangeRequests.",
        "attributes": [
            { "name": "id", "type": "UUID", "is_primary_key": true },
            { "name": "text", "type": "String" },
            { "name": "isCorrect", "type": "Boolean" },
            { "name": "change_request_id", "type": "UUID", "is_foreign_key": true, "references_entity_id": 12 }
        ],
        "relationships": [
            { "entityId": 12, "type": "Many-to-One", "description": "part of" }
        ]
    },
    {
        "id": 14,
        "name": "ChangeRequestVote",
        "description": "Die Stimme eines Benutzers für einen ChangeRequest.",
        "attributes": [
            { "name": "id", "type": "UUID", "is_primary_key": true },
            { "name": "voteType", "type": "VoteType (Enum)" },
            { "name": "change_request_id", "type": "UUID", "is_foreign_key": true, "references_entity_id": 12 },
            { "name": "voter_id", "type": "UUID", "is_foreign_key": true, "references_entity_id": 1 }
        ],
        "relationships": [
            { "entityId": 12, "type": "Many-to-One", "description": "for" },
            { "entityId": 1, "type": "Many-to-One", "description": "by" }
        ]
    }
];


export interface Position {
    x: number;
    y: number;
}

export interface Attribute {
    name: string;
    type: string;
    is_primary_key?: boolean;
    is_foreign_key?: boolean;
    references_entity_id?: number;
}

export interface Relationship {
    entityId: number;
    type: string;
    description: string;
}

export interface Entity {
    id: number;
    name: string;
    description: string;
    attributes: Attribute[];
    relationships: Relationship[];
}

export const getData = () =>{
    return entitiesData;
 }