import { Container } from "@/components/layout-components/Container";
import { getDictionary } from "@/lib/i18n/getDictionary";
import type { Locale } from "@/i18n/config";
import {
  TopBanner,
  BottomBanner,
  InlineAd,
  StickyMobileAd,
  BetweenContentAd,
} from "@/components/ads";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function AdExamplesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  await getDictionary(locale);

  return (
    <Container className="py-8">
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

      <h1 className="text-3xl font-bold mb-2">Ad Banner Examples</h1>
      <p className="text-gray-600 mb-8">
        This page demonstrates the new closable ad banner feature. Users can now
        close ads they find annoying.
      </p>

      {/* Example 1: Closable Top Banner */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">
          1. Closable Top Banner (closable=true)
        </h2>
        <p className="text-gray-600 mb-4">
          This top banner can be closed by clicking the X button in the top
          right corner.
        </p>
        <div className="border rounded-lg p-6 bg-gray-50">
          <TopBanner
            closable={true}
            showCloseLabel={true}
            network="placeholder"
            responsive={true}
            maxWidth="1200px"
            margin="my-4"
          />
        </div>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <code className="text-sm">
            {`<TopBanner closable={true} showCloseLabel={true} />`}
          </code>
        </div>
      </section>

      {/* Example 2: Top Banner with Delay */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">
          2. Top Banner with Close Button Delay (closeButtonDelay=5)
        </h2>
        <p className="text-gray-600 mb-4">
          The close button appears after 5 seconds to ensure users see the ad
          first.
        </p>
        <div className="border rounded-lg p-6 bg-gray-50">
          <TopBanner
            closable={true}
            closeButtonDelay={5}
            network="placeholder"
            responsive={true}
            maxWidth="1200px"
            margin="my-4"
          />
        </div>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <code className="text-sm">
            {`<TopBanner closable={true} closeButtonDelay={5} />`}
          </code>
        </div>
      </section>

      {/* Example 3: Non-closable Banner (default behavior) */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">
          3. Non-closable Banner (default)
        </h2>
        <p className="text-gray-600 mb-4">
          This banner cannot be closed (closable=false by default).
        </p>
        <div className="border rounded-lg p-6 bg-gray-50">
          <TopBanner
            closable={false}
            network="placeholder"
            responsive={true}
            maxWidth="1200px"
            margin="my-4"
          />
        </div>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <code className="text-sm">{`<TopBanner closable={false} />`}</code>
        </div>
      </section>

      {/* Example 4: Closable Sticky Mobile Ad */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">
          4. Closable Sticky Mobile Ad
        </h2>
        <p className="text-gray-600 mb-4">
          Sticky mobile ads at the bottom of the screen can now be closed. Try
          resizing your browser to mobile size to see this.
        </p>
        <div className="border rounded-lg p-6 bg-gray-50">
          <StickyMobileAd
            closable={true}
            showCloseLabel={true}
            network="placeholder"
          />
        </div>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <code className="text-sm">
            {`<StickyMobileAd closable={true} showCloseLabel={true} />`}
          </code>
        </div>
      </section>

      {/* Example 5: Closable Inline Ad */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">5. Closable Inline Ad</h2>
        <p className="text-gray-600 mb-4">
          Inline ads between content can also be closed.
        </p>
        <div className="border rounded-lg p-6 bg-gray-50">
          <div className="prose max-w-none">
            <h3>Article Content</h3>
            <p>
              This is some example content before the ad. Lorem ipsum dolor sit
              amet, consectetur adipiscing elit.
            </p>

            <InlineAd
              closable={true}
              network="placeholder"
              margin="my-8"
              maxWidth="300px"
            />

            <p>
              This is some example content after the ad. Sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        </div>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <code className="text-sm">
            {`<InlineAd closable={true} maxWidth="300px" />`}
          </code>
        </div>
      </section>

      {/* Example 6: Between Content Ad with Close Callback */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">
          6. Between Content Ad with onClose Callback
        </h2>
        <p className="text-gray-600 mb-4">
          You can use the onClose callback to track when users close ads.
        </p>
        <div className="border rounded-lg p-6 bg-gray-50">
          <div className="prose max-w-none">
            <h3>Article Section 1</h3>
            <p>
              First section of content. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris.
            </p>

            <BetweenContentAd index={1} closable={true} network="placeholder" />

            <h3>Article Section 2</h3>
            <p>
              Second section of content. Duis aute irure dolor in reprehenderit
              in voluptate velit esse cillum dolore.
            </p>

            <BetweenContentAd index={2} closable={true} network="placeholder" />

            <h3>Article Section 3</h3>
            <p>
              Final section of content. Excepteur sint occaecat cupidatat non
              proident, sunt in culpa qui officia.
            </p>
          </div>
        </div>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <code className="text-sm">
            {`<BetweenContentAd\n  closable={true}\n  onClose={() => console.log(&quot;Ad was closed&quot;)}\n/>`}
          </code>
        </div>
      </section>

      {/* Example 7: Bottom Banner */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">
          7. Closable Bottom Banner
        </h2>
        <p className="text-gray-600 mb-4">
          Bottom banners can also be closed by users.
        </p>
        <div className="border rounded-lg p-6 bg-gray-50">
          <BottomBanner
            closable={true}
            showCloseLabel={false}
            network="placeholder"
            responsive={true}
            maxWidth="1200px"
            margin="my-4"
          />
        </div>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <code className="text-sm">
            {`<BottomBanner closable={true} showCloseLabel={false} />`}
          </code>
        </div>
      </section>

      {/* Usage Instructions */}
      <section className="mt-16 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Usage Instructions</h2>
        <div className="prose max-w-none">
          <h3>New Props Added to AdBanner:</h3>
          <ul>
            <li>
              <code>closable</code> (boolean): Whether the banner can be closed
              by the user (default: false)
            </li>
            <li>
              <code>onClose</code> (function): Callback function called when the
              banner is closed
            </li>
            <li>
              <code>closeButtonDelay</code> (number): Time in seconds before the
              close button appears (default: 0 = immediately)
            </li>
            <li>
              <code>showCloseLabel</code> (boolean): Whether to show a
              &quot;Close ad&quot; label next to the close button (default:
              false)
            </li>
          </ul>

          <h3>Basic Usage:</h3>
          <pre className="bg-gray-800 text-white p-4 rounded overflow-x-auto">
            {`// Make any ad banner closable
<TopBanner closable={true} />

// With close button delay (5 seconds)
<BottomBanner closable={true} closeButtonDelay={5} />

// With callback when closed
<InlineAd
  closable={true}
  onClose={() => {
    // Track ad closure
    analytics.track(&apos;ad_closed&apos;);
  }}
/>

// With "Close ad" label
<StickyMobileAd
  closable={true}
  showCloseLabel={true}
/>`}
          </pre>

          <h3>Backward Compatibility:</h3>
          <p>
            All existing ad banners will continue to work as before. The{" "}
            <code>closable</code> prop defaults to <code>false</code>, so
            existing code won&apos;t see any changes unless you explicitly
            enable the feature.
          </p>
        </div>
      </section>
    </Container>
  );
}
