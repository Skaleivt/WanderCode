export interface Story {
  id: string;
  title: string;
  content: string;
  tag: "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
  createdAt: string;
  updatedAt: string;
 
}

export interface NewStory {
  title: string;
  content: string;
  tag: string;
}
 // переписати для типу сторі те що є це тільки для прикладу