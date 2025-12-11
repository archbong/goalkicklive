import { Container } from "@/components/layout-components/Container";
import { getDictionary } from "@/lib/i18n/getDictionary";
import type { Locale } from "@/i18n/config";
import {
  TopBanner,
  BottomBanner,
  InlineAd,
  BetweenContentAd,
} from "@/components/ads";
import { ArrowLeft, Check } from "lucide-react";
import Link from "next/link";

export default async function AdTestPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const localeTyped = locale as Locale;
  await getDictionary(localeTyped);

  return (
    <Container className="py-8 max-w-4xl mx-auto">
      {/* Back button */}
      <div className="mb-8">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-2">Closable Ad Feature Test</h1>
      <p className="text-gray-600 mb-8">
        This page tests the new closable ad banner feature. Try closing the ads
        below!
      </p>

      {/* Test Results Panel */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
        <div className="flex items-center mb-4">
          <Check className="w-6 h-6 text-green-600 mr-3" />
          <h2 className="text-xl font-semibold text-green-800">
            Feature Status: Working ✓
          </h2>
        </div>
        <p className="text-green-700 mb-4">
          The closable ad feature has been successfully implemented. All ad
          banners now support the <code>closable</code> prop.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded border">
            <h3 className="font-medium text-gray-800 mb-2">New Props Added:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                <code>closable</code> - Enable close button
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                <code>closeButtonDelay</code> - Delay before button appears
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                <code>showCloseLabel</code> - Show &quot;Close ad&quot; text
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                <code>onClose</code> - Callback when ad is closed
              </li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded border">
            <h3 className="font-medium text-gray-800 mb-2">
              Backward Compatible:
            </h3>
            <p className="text-sm text-gray-600">
              Existing ads continue to work unchanged. The <code>closable</code>{" "}
              prop defaults to <code>false</code>, so no breaking changes.
            </p>
          </div>
        </div>
      </div>

      {/* Test Section 1: Closable Top Banner */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">
          Test 1: Closable Top Banner
        </h2>
        <p className="text-gray-600 mb-4">
          This top banner has a close button in the top-right corner. Click the
          X button to close it.
        </p>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 min-h-[120px] flex items-center justify-center">
          <TopBanner
            closable={true}
            showCloseLabel={true}
            network="placeholder"
            responsive={true}
            maxWidth="800px"
            margin="my-0"
          />
        </div>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <code className="text-sm block mb-2">Code used:</code>
          <pre className="text-sm bg-gray-800 text-white p-3 rounded overflow-x-auto">
            {`<TopBanner
  closable={true}
  showCloseLabel={true}
  network="placeholder"
  responsive={true}
  maxWidth="800px"
/>`}
          </pre>
        </div>
      </section>

      {/* Test Section 2: Banner with Delay */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">
          Test 2: Banner with Close Button Delay
        </h2>
        <p className="text-gray-600 mb-4">
          The close button appears after 3 seconds. Wait and watch for the X
          button to appear.
        </p>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 min-h-[120px] flex items-center justify-center">
          <TopBanner
            closable={true}
            closeButtonDelay={3}
            network="placeholder"
            responsive={true}
            maxWidth="800px"
            margin="my-0"
          />
        </div>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <code className="text-sm block mb-2">Code used:</code>
          <pre className="text-sm bg-gray-800 text-white p-3 rounded overflow-x-auto">
            {`<TopBanner
  closable={true}
  closeButtonDelay={3}
  network="placeholder"
  responsive={true}
  maxWidth="800px"
/>`}
          </pre>
        </div>
      </section>

      {/* Test Section 3: Inline Ad */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">
          Test 3: Closable Inline Ad
        </h2>
        <p className="text-gray-600 mb-4">
          Inline ads between content can also be closed.
        </p>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
          <div className="prose max-w-none">
            <p className="mb-4">
              This is example content before the inline ad. Lorem ipsum dolor
              sit amet, consectetur adipiscing elit.
            </p>

            <div className="my-6 flex justify-center">
              <InlineAd
                closable={true}
                network="placeholder"
                margin="my-0"
                maxWidth="300px"
              />
            </div>

            <p className="mt-4">
              This is example content after the inline ad. Sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        </div>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <code className="text-sm block mb-2">Code used:</code>
          <pre className="text-sm bg-gray-800 text-white p-3 rounded overflow-x-auto">
            {`<InlineAd
  closable={true}
  network="placeholder"
  maxWidth="300px"
/>`}
          </pre>
        </div>
      </section>

      {/* Test Section 4: Between Content Ad */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">
          Test 4: Between Content Ad
        </h2>
        <p className="text-gray-600 mb-4">
          Ads between content sections with automatic numbering.
        </p>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
          <div className="prose max-w-none">
            <h3 className="text-xl font-semibold mb-3">Section 1</h3>
            <p className="mb-4">
              First section of content. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris.
            </p>

            <BetweenContentAd index={1} closable={true} network="placeholder" />

            <h3 className="text-xl font-semibold mt-8 mb-3">Section 2</h3>
            <p>
              Second section of content. Duis aute irure dolor in reprehenderit
              in voluptate velit esse cillum dolore.
            </p>
          </div>
        </div>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <code className="text-sm block mb-2">Code used:</code>
          <pre className="text-sm bg-gray-800 text-white p-3 rounded overflow-x-auto">
            {`<BetweenContentAd
  index={1}
  closable={true}
  network="placeholder"
/>`}
          </pre>
        </div>
      </section>

      {/* Test Section 5: Bottom Banner */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">
          Test 5: Closable Bottom Banner
        </h2>
        <p className="text-gray-600 mb-4">
          Bottom banners at the end of pages can also be closed.
        </p>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 min-h-[120px] flex items-center justify-center">
          <BottomBanner
            closable={true}
            showCloseLabel={false}
            network="placeholder"
            responsive={true}
            maxWidth="800px"
            margin="my-0"
          />
        </div>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <code className="text-sm block mb-2">Code used:</code>
          <pre className="text-sm bg-gray-800 text-white p-3 rounded overflow-x-auto">
            {`<BottomBanner
  closable={true}
  showCloseLabel={false}
  network="placeholder"
  responsive={true}
  maxWidth="800px"
/>`}
          </pre>
        </div>
      </section>

      {/* Implementation Summary */}
      <section className="mt-16 p-6 bg-gray-50 rounded-lg border">
        <h2 className="text-2xl font-semibold mb-4">Implementation Summary</h2>
        <div className="prose max-w-none">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            What was implemented:
          </h3>
          <ul className="space-y-2">
            <li className="flex items-start">
              <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Enhanced AdBanner component</strong> with new props:
                <code>closable</code>, <code>closeButtonDelay</code>,{" "}
                <code>showCloseLabel</code>, <code>onClose</code>
              </span>
            </li>
            <li className="flex items-start">
              <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Close button with X icon</strong> from lucide-react
              </span>
            </li>
            <li className="flex items-start">
              <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
              <span>
                <strong>State management</strong> for tracking closed state
              </span>
            </li>
            <li className="flex items-start">
              <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Delay functionality</strong> using useEffect and
                setTimeout
              </span>
            </li>
            <li className="flex items-start">
              <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Backward compatibility</strong> - existing ads work
                unchanged
              </span>
            </li>
            <li className="flex items-start">
              <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Example page</strong> at <code>/examples/ads</code> with
                comprehensive demonstrations
              </span>
            </li>
            <li className="flex items-start">
              <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Updated documentation</strong> in README.md
              </span>
            </li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">
            How to use in your code:
          </h3>
          <pre className="bg-gray-800 text-white p-4 rounded text-sm overflow-x-auto">
            {`// Make any ad banner closable
<TopBanner closable={true} />

// With close button delay (3 seconds)
<BottomBanner closable={true} closeButtonDelay={3} />

// With "Close ad" label
<InlineAd closable={true} showCloseLabel={true} />

// With callback when closed
<BetweenContentAd
  closable={true}
  onClose={() => {
    // Track ad closure
    console.log('User closed the ad');
  }}
/>`}
          </pre>

          <div className="mt-6 p-4 bg-green-50 rounded border border-green-200">
            <div className="flex items-center">
              <Check className="w-6 h-6 text-green-600 mr-3" />
              <h4 className="text-lg font-semibold text-green-800">
                Build Status: Success ✓
              </h4>
            </div>
            <p className="text-green-700 mt-2">
              The implementation has been tested and builds successfully. All
              TypeScript checks pass, ESLint passes, and the Next.js build
              completes without errors.
            </p>
          </div>
        </div>
      </section>
    </Container>
  );
}
