// lib/getFeedback.ts
'use cache';

// 1️⃣ Define and export the type
export interface Feedback {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
}

// 2️⃣ Import your mock data
import { feedbacks } from './mockFeedback';

// 3️⃣ Export the fetch function
export async function getFeedback(): Promise<Feedback[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return feedbacks;
}
