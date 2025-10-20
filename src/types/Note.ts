export interface Page {
  id: string | number; // can be number or string, flexible for both
  title: string;
  content: string;
}

export interface Note {
  id: string | number;
  title: string;
  pages: Page[];
}