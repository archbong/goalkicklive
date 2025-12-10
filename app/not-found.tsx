import Link from "next/link";
import { Container } from "@/components/layout-components/Container";
import { Button } from "@/components/ui/Button";
import { Home, Search, AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <Container className="min-h-screen flex flex-col items-center justify-center py-12">
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-6">
          <AlertCircle className="w-10 h-10 text-red-600" />
        </div>

        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">
          Page Not Found
        </h2>

        <p className="text-xl text-gray-600 mb-8">
          The page you are looking for doesn&apos;t exist or has been moved.
          Please check the URL or navigate back to the homepage.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link href="/">
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Home className="w-5 h-5 mr-2" />
              Back to Homepage
            </Button>
          </Link>

          <Link href="/en/downloads">
            <Button
              size="lg"
              variant="secondary"
              className="border-gray-300 hover:bg-gray-50"
            >
              <Search className="w-5 h-5 mr-2" />
              Browse Downloads
            </Button>
          </Link>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Looking for something specific?
          </h3>
          <p className="text-gray-600 mb-4">Try these popular pages:</p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
            <li>
              <Link
                href="/en/downloads"
                className="text-green-600 hover:text-green-700 hover:underline flex items-center"
              >
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Downloads & Apps
              </Link>
            </li>
            <li>
              <Link
                href="/en/about"
                className="text-green-600 hover:text-green-700 hover:underline flex items-center"
              >
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="/en/contact"
                className="text-green-600 hover:text-green-700 hover:underline flex items-center"
              >
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Contact Support
              </Link>
            </li>
            <li>
              <Link
                href="/en/privacy-policy"
                className="text-green-600 hover:text-green-700 hover:underline flex items-center"
              >
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            If you believe this is an error, please{" "}
            <Link
              href="/en/contact"
              className="text-green-600 hover:text-green-700 font-medium"
            >
              contact our support team
            </Link>
            .
          </p>
        </div>
      </div>
    </Container>
  );
}
