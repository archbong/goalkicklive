'use client';

import Link from "next/link";
import { Container } from "@/components/layout-components/Container";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import SettingItem from "@/components/ui/SettingItem";
import ToggleSwitch from "@/components/ui/ToggleSwitch";

export default function SettingsPage() {
  const [enableTracking, setEnableTracking] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <Container className="py-12 max-w-4xl space-y-12">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Settings</h1>

      {/* General Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">General</h2>
        <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-200">
          <SettingItem
            title="Dark Mode"
            description="Enable dark mode throughout the app."
          >
            <ToggleSwitch
              enabled={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
          </SettingItem>
          <SettingItem
            title="Analytics & Tracking"
            description="Allow the app to collect usage data to improve your experience."
          >
            <ToggleSwitch
              enabled={enableTracking}
              onChange={() => setEnableTracking(!enableTracking)}
            />
          </SettingItem>
        </div>
      </div>

      {/* Legal Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Legal</h2>
        <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-200">
          <SettingItem title="Privacy & Terms">
            <div className="flex flex-col gap-3">
              <Link
                href="/privacy-policy"
                className="text-green-600 hover:text-green-700 font-medium transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms-conditions"
                className="text-green-600 hover:text-green-700 font-medium transition-colors"
              >
                Terms & Conditions
              </Link>
            </div>
          </SettingItem>
        </div>
      </div>

      {/* Feedback Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Feedback</h2>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <SettingItem
            title="Send Feedback"
            description="Send us your suggestions or report issues to improve the app."
          >
            <Button
              variant="default"
              className="hover:scale-105 transition-transform w-full sm:w-auto"
            >
              <Link href="/feedback">Send Feedback</Link>
            </Button>
          </SettingItem>
        </div>
      </div>
    </Container>
  );
}
