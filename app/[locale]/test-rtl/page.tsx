// goalkicklive/app/[locale]/test-rtl/page.tsx
import useRTL from "@/hooks/useRTL";
import { locales, isRTL, getTextDirection } from "@/i18n/config";

export default function RTLTestPage() {
  const { isRTL: currentIsRTL, direction, locale } = useRTL();

  return (
    <div className="min-h-screen bg-gray-50 py-16" dir={direction}>
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            RTL Layout Test
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">
                Current Locale Info
              </h2>
              <div className="space-y-2">
                <p><strong>Locale:</strong> {locale}</p>
                <p><strong>Is RTL:</strong> {currentIsRTL ? "Yes" : "No"}</p>
                <p><strong>Direction:</strong> {direction}</p>
                <p><strong>Text Alignment:</strong> {currentIsRTL ? "Right" : "Left"}</p>
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-green-900 mb-4">
                All Supported Locales
              </h2>
              <div className="space-y-2">
                {locales.map((loc) => (
                  <p key={loc}>
                    <strong>{loc}:</strong> {isRTL(loc) ? "RTL" : "LTR"} ({getTextDirection(loc)})
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gray-100 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Layout Test
            </h2>
            <div className="flex space-x-4 mb-4">
              <button className="bg-blue-500 text-white px-4 py-2 rounded">
                Button 1
              </button>
              <button className="bg-green-500 text-white px-4 py-2 rounded">
                Button 2
              </button>
              <button className="bg-red-500 text-white px-4 py-2 rounded">
                Button 3
              </button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Left side</span>
              <span className="text-sm text-gray-600">Center</span>
              <span className="text-sm text-gray-600">Right side</span>
            </div>
          </div>

          <div className="bg-yellow-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-yellow-900 mb-4">
              Text Direction Test
            </h2>
            <div className="space-y-4">
              <p className="text-lg">
                This text should flow {currentIsRTL ? "right-to-left" : "left-to-right"}.
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
              <div className="bg-white p-4 rounded border">
                <p className={currentIsRTL ? "text-right" : "text-left"}>
                  This paragraph is explicitly aligned to the {currentIsRTL ? "right" : "left"}.
                </p>
                <p className="text-center">
                  This paragraph is centered.
                </p>
                <p className={currentIsRTL ? "text-left" : "text-right"}>
                  This paragraph is explicitly aligned to the {currentIsRTL ? "left" : "right"}.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-purple-50 rounded-lg">
            <h2 className="text-xl font-semibold text-purple-900 mb-4">
              Navigation Test
            </h2>
            <div className="flex space-x-4">
              <a href="/highlights" className="text-blue-600 hover:underline">
                Go to Highlights
              </a>
              <a href="/" className="text-blue-600 hover:underline">
                Go Home
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
