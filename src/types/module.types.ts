// types/module.types.ts

// Represents a module in a list view, matching ModuleListItemDto
export interface ModuleListItem {
    id: string; // UUID is a string in TypeScript
    title: string;
    description: string;
    numberOfQuestions: number;
    likeCount: number; // Corresponds to follower count
    isFollowed: boolean;
}

// Represents the full details of a single module, matching ModuleDetailDto
// We'll build this out more when creating the module detail page.
export interface ModuleDetail extends ModuleListItem {
    // questions: Page<ChoiceQuestion>; // Example for later
}


