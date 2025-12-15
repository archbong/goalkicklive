import { getDictionary } from "@/lib/i18n/getDictionary";
import type { Locale } from "@/i18n/config";
import {
  HeroSection,
  FeatureGrid,
  TeamSection,
  CTASection,
  StatsSection,
  TimelineSection,
  ValuesSection,
} from "@/components/about";
import {
  Smartphone,
  PlayCircle,
  Shield,
  Globe,
  Download,
  Star,
  Users,
  Target,
  Trophy,
  Heart,
  Zap,
  Clock,
  TrendingUp,
  Award,
  CheckCircle,
  BarChart,
  Video,
  Calendar,
  MessageSquare,
  Home,
  Settings,
  Bell,
  ExternalLink,
} from "lucide-react";

export default async function ComponentsDemo({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const localeTyped = locale as Locale;
  const dict = await getDictionary(locale as Locale);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Reusable Components Demo
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          This page showcases the reusable components created for the about
          page. These components can be used throughout the application.
        </p>

        {/* HeroSection Demo */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">HeroSection</h2>
          <div className="space-y-8">
            <HeroSection
              title="Default Hero Section"
              description="This is a default hero section with light background and center alignment."
              background="light"
              size="md"
              alignment="center"
            />
            <HeroSection
              title="Gradient Hero Section"
              description="This hero section uses a gradient background and left alignment."
              background="gradient"
              size="lg"
              alignment="left"
            />
            <HeroSection
              title="Small Hero Section"
              description="A compact hero section for smaller spaces."
              background="light"
              size="sm"
              alignment="center"
            />
          </div>
        </section>

        {/* FeatureGrid Demo */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">FeatureGrid</h2>
          <div className="space-y-8">
            <FeatureGrid
              title="3-Column Feature Grid"
              description="Display features in a responsive 3-column grid"
              features={[
                {
                  title: "Live Streaming",
                  description: "Watch matches in real-time",
                  icon: <Video className="w-6 h-6" />,
                  iconColor: "green" as const,
                },
                {
                  title: "Mobile Optimized",
                  description: "Designed for mobile devices",
                  icon: <Smartphone className="w-6 h-6" />,
                  iconColor: "blue" as const,
                },
                {
                  title: "Global Coverage",
                  description: "Access matches worldwide",
                  icon: <Globe className="w-6 h-6" />,
                  iconColor: "purple" as const,
                },
              ]}
              columns={3}
              variant="default"
              size="md"
              background="white"
              alignment="center"
              showDivider={true}
            />

            <FeatureGrid
              title="4-Column Feature Grid"
              description="More features in a compact 4-column layout"
              features={[
                {
                  title: "Real-time Updates",
                  description: "Instant match statistics",
                  icon: <BarChart className="w-6 h-6" />,
                  iconColor: "orange" as const,
                },
                {
                  title: "Secure & Reliable",
                  description: "99.9% uptime guarantee",
                  icon: <Shield className="w-6 h-6" />,
                  iconColor: "green" as const,
                },
                {
                  title: "Free Download",
                  description: "No hidden fees",
                  icon: <Download className="w-6 h-6" />,
                  iconColor: "teal" as const,
                },
                {
                  title: "Match Calendar",
                  description: "Plan your viewing",
                  icon: <Calendar className="w-6 h-6" />,
                  iconColor: "blue" as const,
                },
              ]}
              columns={4}
              variant="gradient"
              size="sm"
              background="light"
              alignment="center"
              showDivider={false}
            />
          </div>
        </section>

        {/* StatsSection Demo */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            StatsSection
          </h2>
          <div className="space-y-8">
            <StatsSection
              title="Company Statistics"
              description="Showcase important metrics with visual appeal"
              stats={[
                {
                  value: "500K+",
                  label: "Active Users",
                  description: "Growing daily",
                  icon: <Users className="w-6 h-6" />,
                },
                {
                  value: "99.9%",
                  label: "Uptime",
                  description: "Reliable service",
                  icon: <CheckCircle className="w-6 h-6" />,
                },
                {
                  value: "50+",
                  label: "Leagues",
                  description: "Global coverage",
                  icon: <Trophy className="w-6 h-6" />,
                },
                {
                  value: "24/7",
                  label: "Support",
                  description: "Always available",
                  icon: <Clock className="w-6 h-6" />,
                },
              ]}
              columns={4}
              variant="gradient"
              size="md"
              background="white"
              alignment="center"
              showDivider={true}
            />
          </div>
        </section>

        {/* ValuesSection Demo */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            ValuesSection
          </h2>
          <div className="space-y-8">
            <ValuesSection
              title="Our Core Values"
              description="Principles that guide our work"
              values={[
                {
                  title: "Innovation",
                  description: "Always pushing boundaries",
                  icon: <Zap className="w-6 h-6" />,
                  iconColor: "orange" as const,
                },
                {
                  title: "Quality",
                  description: "Never compromise on excellence",
                  icon: <Star className="w-6 h-6" />,
                  iconColor: "purple" as const,
                },
                {
                  title: "Community",
                  description: "Building together",
                  icon: <Users className="w-6 h-6" />,
                  iconColor: "teal" as const,
                },
              ]}
              columns={3}
              variant="default"
              size="md"
              background="light"
              alignment="center"
              showDivider={true}
            />
          </div>
        </section>

        {/* TeamSection Demo */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">TeamSection</h2>
          <div className="space-y-8">
            <TeamSection
              title="Our Team"
              description="Meet the people behind the platform"
              members={[
                {
                  name: "Alex Johnson",
                  role: "Product Manager",
                  bio: "Passionate about user experience",
                  initials: "AJ",
                },
                {
                  name: "Maria Garcia",
                  role: "Lead Designer",
                  bio: "Creates beautiful interfaces",
                  initials: "MG",
                },
                {
                  name: "David Chen",
                  role: "Senior Engineer",
                  bio: "Builds scalable systems",
                  initials: "DC",
                },
              ]}
              columns={3}
              variant="default"
              size="md"
              background="white"
              alignment="center"
              showDivider={true}
            />
          </div>
        </section>

        {/* CTASection Demo */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">CTASection</h2>
          <div className="space-y-8">
            <CTASection
              title="Ready to Get Started?"
              description="Join thousands of satisfied users today"
              primaryButton={{
                text: "Download Now",
                href: `/${locale}/downloads`,
                variant: "default",
                size: "lg",
                icon: <Download className="w-5 h-5" />,
                iconPosition: "left",
              }}
              secondaryButton={{
                text: "Learn More",
                href: `/${locale}/about`,
                variant: "secondary",
                size: "lg",
                icon: <ExternalLink className="w-5 h-5" />,
                iconPosition: "left",
              }}
              variant="gradient"
              size="lg"
              alignment="center"
              background="gradient"
              showDivider={true}
            />

            <CTASection
              title="Simple Call to Action"
              description="A minimal version with single button"
              primaryButton={{
                text: "Get Started",
                href: `/${locale}`,
                variant: "default",
                size: "default",
              }}
              variant="default"
              size="md"
              alignment="center"
              background="white"
              showDivider={false}
            />
          </div>
        </section>

        {/* TimelineSection Demo */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            TimelineSection
          </h2>
          <div className="space-y-8">
            <TimelineSection
              title="Our Journey"
              description="Key milestones in our development"
              items={[
                {
                  year: "2020",
                  title: "Company Founded",
                  description:
                    "Started with a vision to revolutionize streaming",
                  icon: <Target className="w-4 h-4" />,
                },
                {
                  year: "2021",
                  title: "First Launch",
                  description: "Released our MVP to early adopters",
                  icon: <Smartphone className="w-4 h-4" />,
                },
                {
                  year: "2022",
                  title: "Major Update",
                  description:
                    "Introduced new features and improved performance",
                  icon: <Zap className="w-4 h-4" />,
                },
                {
                  year: "2023",
                  title: "User Milestone",
                  description: "Reached 100,000 active users",
                  icon: <TrendingUp className="w-4 h-4" />,
                },
              ]}
              variant="gradient"
              size="md"
              background="light"
              alignment="alternate"
              maxWidth="lg"
              showDivider={true}
            />
          </div>
        </section>

        {/* Usage Instructions */}
        <section className="mb-16 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            How to Use These Components
          </h2>
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Installation
              </h3>
              <p className="text-gray-600">
                All components are available in{" "}
                <code className="bg-gray-100 px-2 py-1 rounded">
                  @/components/about
                </code>
                . Import them as needed:
              </p>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                {`import {
  HeroSection,
  FeatureGrid,
  TeamSection,
  CTASection,
  StatsSection,
  TimelineSection,
  ValuesSection,
} from "@/components/about";`}
              </pre>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Customization
              </h3>
              <p className="text-gray-600">
                Each component accepts props for customization:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>
                  <strong>variant</strong>: Changes the visual style (default,
                  gradient, outline, etc.)
                </li>
                <li>
                  <strong>size</strong>: Controls padding and typography (sm,
                  md, lg)
                </li>
                <li>
                  <strong>alignment</strong>: Text alignment (left, center,
                  right)
                </li>
                <li>
                  <strong>background</strong>: Section background (light, white,
                  gradient)
                </li>
                <li>
                  <strong>columns</strong>: Responsive grid columns (1-4)
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Best Practices
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Use consistent variants throughout your page</li>
                <li>Maintain proper spacing between sections</li>
                <li>Ensure adequate contrast for accessibility</li>
                <li>Test responsive behavior on different screen sizes</li>
                <li>Use the demo page as a reference for implementation</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
