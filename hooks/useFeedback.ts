// hooks/useFeedback.ts
'use client';

import { useState, useEffect } from 'react';
import { getFeedback, Feedback } from '@/lib/getFeedback';

export function useFeedback() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  useEffect(() => {
    getFeedback().then((data) => setFeedbacks(data));
  }, []);

  const submitFeedback = (feedback: Omit<Feedback, 'id' | 'date'>) => {
    const newFeedback: Feedback = {
      ...feedback,
      id: (feedbacks.length + 1).toString(),
      date: new Date().toISOString(),
    };
    setFeedbacks([newFeedback, ...feedbacks]);
    return newFeedback;
  };

  return { feedbacks, submitFeedback };
}
