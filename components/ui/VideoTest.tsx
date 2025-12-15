// components/ui/VideoTest.tsx
"use client";

import { useState } from "react";
import VideoPlayer from "./VideoPlayer";

export default function VideoTest() {
  const [testCase, setTestCase] = useState<string>("youtube");
  const [customEmbed, setCustomEmbed] = useState<string>("");
  const [showVideo, setShowVideo] = useState<boolean>(false);

  const testCases = {
    youtube: `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`,
    vimeo: `<iframe src="https://player.vimeo.com/video/148751763?autoplay=1&title=0&byline=0&portrait=0" width="100%" height="100%" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`,
    scorebat_example: `<iframe src="https://www.scorebat.com/embed/v/123456/?token=test&utm_source=api&utm_medium=video&utm_campaign=free-feed" width="100%" height="100%" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`,
    direct_video: `<video width="100%" height="100%" controls autoplay muted><source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4"></video>`,
  };

  const handleTest = () => {
    setShowVideo(true);
  };

  const handleReset = () => {
    setShowVideo(false);
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg border">
      <h2 className="text-2xl font-bold mb-4">Video Player Debug Test</h2>
      <p className="text-gray-600 mb-6">
        Test different video embed types to debug playback issues.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Test Case
            </label>
            <div className="space-y-2">
              {Object.entries(testCases).map(([key, value]) => (
                <div key={key} className="flex items-center">
                  <input
                    type="radio"
                    id={key}
                    name="testCase"
                    value={key}
                    checked={testCase === key}
                    onChange={(e) => setTestCase(e.target.value)}
                    className="h-4 w-4 text-blue-600"
                  />
                  <label htmlFor={key} className="ml-2 text-sm text-gray-700">
                    {key.charAt(0).toUpperCase() + key.slice(1)} Embed
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Embed HTML
            </label>
            <textarea
              value={customEmbed}
              onChange={(e) => setCustomEmbed(e.target.value)}
              placeholder="Paste your embed HTML here..."
              className="w-full h-32 p-3 border border-gray-300 rounded-md text-sm font-mono"
            />
            <p className="text-xs text-gray-500 mt-1">
              Use this to test specific embed code from Scorebat or other providers
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleTest}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Test Video
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Reset
            </button>
          </div>

          <div className="bg-gray-100 p-4 rounded-md">
            <h3 className="font-medium text-gray-700 mb-2">Selected Embed:</h3>
            <pre className="text-xs bg-gray-800 text-gray-100 p-3 rounded overflow-x-auto">
              {customEmbed || testCases[testCase as keyof typeof testCases]}
            </pre>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-gray-700">Video Preview:</h3>
          <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
            {showVideo ? (
              <VideoPlayer
                embedHtml={customEmbed || testCases[testCase as keyof typeof testCases]}
                onError={() => console.error("Video failed to load")}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                Click "Test Video" to load the selected embed
              </div>
            )}
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <h4 className="font-medium text-yellow-800 mb-2">Debug Info:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Check browser console for loading messages</li>
              <li>• Look for CORS errors or network failures</li>
              <li>• Verify iframe dimensions are correct</li>
              <li>• Check for ad-blocker interference</li>
              <li>• Test with different embed providers</li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h4 className="font-medium text-blue-800 mb-2">Common Issues:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>
                • <strong>Cross-origin errors:</strong> Normal for embedded content
              </li>
              <li>
                • <strong>Token expiration:</strong> Scorebat tokens may expire
              </li>
              <li>
                • <strong>Browser restrictions:</strong> Some browsers block autoplay
              </li>
              <li>
                • <strong>Ad blockers:</strong> May block video iframes
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="font-medium text-gray-700 mb-3">Test Results:</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded border">
            <h4 className="font-medium text-gray-800 mb-2">YouTube</h4>
            <p className="text-sm text-gray-600">
              Should work reliably. If not, check browser console for CSP errors.
            </p>
          </div>
          <div className="bg-white p-4 rounded border">
            <h4 className="font-medium text-gray-800 mb-2">Vimeo</h4>
            <p className="text-sm text-gray-600">
              Should work. May require user interaction for autoplay.
            </p>
          </div>
          <div className="bg-white p-4 rounded border">
            <h4 className="font-medium text-gray-800 mb-2">Scorebat</h4>
            <p className="text-sm text-gray-600">
              May fail if token is expired or API key is invalid.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
