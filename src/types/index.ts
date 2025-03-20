
export interface Character {
  name: string;
  title: string;
  persona: string;
  greeting: string;
  scenario: string;
  exampleDialogues: string[];
  avatarUrl?: string;
}

export type WizardStep = 
  | 'description'
  | 'details'
  | 'avatar'
  | 'preview';

export interface CharacterDescription {
  text: string;
  url?: string;
}

export interface GenerateCharacterResponse {
  name: string;
  title: string;
  persona: string;
  greeting: string;
  scenario: string;
  exampleDialogues: string[];
}

export interface ApiErrorResponse {
  error: string;
  message: string;
}
