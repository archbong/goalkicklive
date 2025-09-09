'use client';

import { useState } from 'react';
import { useFeedback } from '@/hooks/useFeedback';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/layout-components/Container';

export default function FeedbackPage() {
  const { feedbacks, submitFeedback } = useFeedback();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitFeedback({ name, email, message });
    setName('');
    setEmail('');
    setMessage('');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <Container className="py-12">
      <h1 className="text-3xl font-bold mb-6">Feedback</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
        <input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
        <textarea
          placeholder="Your Feedback"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
        <Button type="submit">Submit Feedback</Button>
        {success && <p className="text-green-600 mt-2">Thank you for your feedback!</p>}
      </form>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Previous Feedbacks</h2>
        <div className="space-y-4">
          {feedbacks.map((fb) => (
            <div key={fb.id} className="border rounded p-4 bg-gray-50">
              <p className="text-gray-700">{fb.message}</p>
              <p className="text-sm text-gray-500 mt-2">
                {fb.name} • {new Date(fb.date).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
