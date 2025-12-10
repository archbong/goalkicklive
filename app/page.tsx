// app/page.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Goalkick Live - Stream Live Football Matches",
  description:
    "Download our mobile app to stream live football matches from top leagues around the world. Never miss a moment of the action.",
};

export default function RootPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="text-center p-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            ⚽ Goalkick Live
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Stream live football matches on your mobile device
          </p>
        </div>
        <div className="animate-pulse">
          <p className="text-lg text-gray-400">
            Redirecting to the main application...
          </p>
        </div>
      </div>
    </div>
  );
}
