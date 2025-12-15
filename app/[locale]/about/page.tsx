import { getDictionary } from "@/lib/i18n/getDictionary";
import type { Locale } from "@/i18n/config";
import { TopBanner, BetweenContentAd, BottomBanner } from "@/components/ads";
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
  Globe as GlobeIcon,
  Smartphone as MobileIcon,
  Shield as SecurityIcon,
  Download as DownloadIcon,
  BarChart,
  Video,
  Calendar,
  MessageSquare,
} from "lucide-react";

export default async function About({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const localeTyped = locale as Locale;
  const dict = await getDictionary(locale as Locale);

  // Company statistics
  const stats = [
    {
      value: "500K+",
      label: "Active Users",
      description: "Football fans streaming matches daily",
      icon: <Users className="w-6 h-6" />,
    },
    {
      value: "50+",
      label: "Leagues Covered",
      description: "From Premier League to local championships",
      icon: <Trophy className="w-6 h-6" />,
    },
    {
      value: "99.9%",
      label: "Uptime",
      description: "Reliable streaming with minimal interruptions",
      icon: <CheckCircle className="w-6 h-6" />,
    },
    {
      value: "24/7",
      label: "Support",
      description: "Round-the-clock customer assistance",
      icon: <Clock className="w-6 h-6" />,
    },
  ];

  // Company timeline
  const timeline = [
    {
      year: "2018",
      title: "Foundation",
      description:
        "Goalkick Live was founded with a vision to revolutionize football streaming on mobile devices.",
      icon: <Target className="w-4 h-4" />,
    },
    {
      year: "2019",
      title: "First App Launch",
      description:
        "Released our first mobile app with support for 10 major football leagues.",
      icon: <Smartphone className="w-4 h-4" />,
    },
    {
      year: "2020",
      title: "Global Expansion",
      description:
        "Expanded coverage to 30+ leagues and introduced multi-language support.",
      icon: <Globe className="w-4 h-4" />,
    },
    {
      year: "2021",
      title: "HD Streaming",
      description: "Introduced HD streaming and real-time match statistics.",
      icon: <PlayCircle className="w-4 h-4" />,
    },
    {
      year: "2022",
      title: "Award Recognition",
      description:
        "Received 'Best Sports App' award at the Mobile Excellence Awards.",
      icon: <Award className="w-4 h-4" />,
    },
    {
      year: "2023",
      title: "500K Users Milestone",
      description: "Reached half a million active users across 150+ countries.",
      icon: <TrendingUp className="w-4 h-4" />,
    },
  ];

  // Company values
  const values = [
    {
      title: "Passion for Football",
      description:
        "We live and breathe football. Our team consists of passionate fans who understand what viewers want.",
      icon: <Heart className="w-6 h-6" />,
      iconColor: "orange" as const,
    },
    {
      title: "Innovation",
      description:
        "Constantly pushing boundaries in streaming technology to deliver the best mobile experience.",
      icon: <Zap className="w-6 h-6" />,
      iconColor: "orange" as const,
    },
    {
      title: "Accessibility",
      description:
        "Making football accessible to everyone, everywhere, regardless of device or location.",
      icon: <GlobeIcon className="w-6 h-6" />,
      iconColor: "blue" as const,
    },
    {
      title: "Quality",
      description:
        "Never compromising on streaming quality, reliability, or user experience.",
      icon: <Star className="w-6 h-6" />,
      iconColor: "purple" as const,
    },
    {
      title: "Community",
      description:
        "Building a global community of football fans who share their passion and experiences.",
      icon: <Users className="w-6 h-6" />,
      iconColor: "teal" as const,
    },
    {
      title: "Integrity",
      description:
        "Operating with transparency, honesty, and respect for our users and partners.",
      icon: <Shield className="w-6 h-6" />,
      iconColor: "green" as const,
    },
  ];

  // Enhanced features
  const enhancedFeatures = [
    {
      title: dict.features.liveStreaming.title,
      description: dict.features.liveStreaming.description,
      icon: <Video className="w-6 h-6" />,
      iconColor: "green" as const,
    },
    {
      title: dict.features.mobileOptimized.title,
      description: dict.features.mobileOptimized.description,
      icon: <MobileIcon className="w-6 h-6" />,
      iconColor: "blue" as const,
    },
    {
      title: dict.features.realTimeUpdates.title,
      description: dict.features.realTimeUpdates.description,
      icon: <BarChart className="w-6 h-6" />,
      iconColor: "orange" as const,
    },
    {
      title: dict.features.globalCoverage.title,
      description: dict.features.globalCoverage.description,
      icon: <GlobeIcon className="w-6 h-6" />,
      iconColor: "purple" as const,
    },
    {
      title: dict.features.secureReliable.title,
      description: dict.features.secureReliable.description,
      icon: <SecurityIcon className="w-6 h-6" />,
      iconColor: "orange" as const,
    },
    {
      title: dict.features.freeDownload.title,
      description: dict.features.freeDownload.description,
      icon: <DownloadIcon className="w-6 h-6" />,
      iconColor: "teal" as const,
    },
    {
      title: "Match Calendar",
      description:
        "Plan your viewing with our comprehensive match schedule and reminders.",
      icon: <Calendar className="w-6 h-6" />,
      iconColor: "blue" as const,
    },
    {
      title: "Fan Community",
      description:
        "Connect with other fans, share predictions, and discuss matches in real-time.",
      icon: <MessageSquare className="w-6 h-6" />,
      iconColor: "purple" as const,
    },
  ];

  // Team members
  const teamMembers = [
    {
      name: "Chris Val Obum",
      role: "Founder & CEO",
      bio: "Former sports technology executive with 15+ years in digital media. Passionate about making football accessible to everyone.",
      initials: "CVO",
      socialLinks: [
        {
          platform: "LinkedIn",
          url: "https://linkedin.com",
          icon: <span className="text-lg">in</span>,
        },
        {
          platform: "Twitter",
          url: "https://twitter.com",
          icon: <span className="text-lg">𝕏</span>,
        },
      ],
    },
    {
      name: "Habibi Johnson",
      role: "Chief Technology Officer",
      bio: "Expert in streaming infrastructure and mobile platform development. Previously led engineering at major streaming services.",
      initials: "HJ",
      socialLinks: [
        {
          platform: "LinkedIn",
          url: "https://linkedin.com",
          icon: <span className="text-lg">in</span>,
        },
        {
          platform: "GitHub",
          url: "https://github.com",
          icon: <span className="text-lg">gh</span>,
        },
      ],
    },
    {
      name: "Alex Morgan",
      role: "Head of Product",
      bio: "Product leader with extensive experience in sports and entertainment apps. Focused on creating intuitive user experiences.",
      initials: "AM",
      socialLinks: [
        {
          platform: "LinkedIn",
          url: "https://linkedin.com",
          icon: <span className="text-lg">in</span>,
        },
        {
          platform: "Twitter",
          url: "https://twitter.com",
          icon: <span className="text-lg">𝕏</span>,
        },
      ],
    },
    {
      name: "Sarah Chen",
      role: "Head of Content",
      bio: "Former sports journalist with deep connections across football leagues. Ensures comprehensive match coverage.",
      initials: "SC",
      socialLinks: [
        {
          platform: "LinkedIn",
          url: "https://linkedin.com",
          icon: <span className="text-lg">in</span>,
        },
      ],
    },
    {
      name: "Marcus Rodriguez",
      role: "Engineering Director",
      bio: "Specializes in scalable streaming architecture and real-time data systems. Leads our technical innovation.",
      initials: "MR",
      socialLinks: [
        {
          platform: "LinkedIn",
          url: "https://linkedin.com",
          icon: <span className="text-lg">in</span>,
        },
        {
          platform: "GitHub",
          url: "https://github.com",
          icon: <span className="text-lg">gh</span>,
        },
      ],
    },
    {
      name: "Fatima Al-Mansoori",
      role: "Head of Global Partnerships",
      bio: "Builds relationships with football leagues and broadcasters worldwide. Expands our content library.",
      initials: "FA",
      socialLinks: [
        {
          platform: "LinkedIn",
          url: "https://linkedin.com",
          icon: <span className="text-lg">in</span>,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Top Banner Ad */}
      <TopBanner
        show={true}
        network="placeholder"
        responsive={true}
        maxWidth="1200px"
        margin="my-4"
      />

      {/* Hero Section */}
      <HeroSection
        title={dict.aboutPage.title}
        description={dict.aboutPage.description}
        background="gradient"
        size="lg"
        alignment="center"
      />

      {/* Mission & Vision */}
      <div className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div className="space-y-6 p-8 bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl shadow-lg">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                <Target className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">
                {dict.aboutPage.mission.title}
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                {dict.aboutPage.mission.description}
              </p>
            </div>
            <div className="space-y-6 p-8 bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl shadow-lg">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                <Globe className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">
                {dict.aboutPage.vision.title}
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                {dict.aboutPage.vision.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <StatsSection
        title="Our Impact in Numbers"
        description="The numbers that tell our story of growth and commitment to football fans worldwide."
        stats={stats}
        columns={4}
        variant="gradient"
        size="md"
        background="light"
        alignment="center"
        showDivider={true}
        animation="fade"
      />

      {/* Ad between sections */}
      <BetweenContentAd
        index={1}
        show={true}
        network="placeholder"
        responsive={true}
        maxWidth="800px"
      />

      {/* Enhanced Features Section */}
      <FeatureGrid
        title={dict.aboutPage.whatWeOffer.title}
        description={dict.aboutPage.whatWeOffer.description}
        features={enhancedFeatures}
        columns={4}
        variant="gradient"
        size="md"
        background="white"
        alignment="center"
        showDivider={true}
      />

      {/* Company Timeline */}
      <TimelineSection
        title="Our Journey"
        description="From a simple idea to a global platform connecting football fans worldwide."
        items={timeline}
        variant="gradient"
        size="md"
        background="light"
        alignment="alternate"
        maxWidth="lg"
        showDivider={true}
      />

      {/* Company Values */}
      <ValuesSection
        title="Our Core Values"
        description="The principles that guide everything we do at Goalkick Live."
        values={values}
        columns={3}
        variant="gradient"
        size="md"
        background="white"
        alignment="center"
        showDivider={true}
        maxWidth="lg"
      />

      {/* Ad between sections */}
      <BetweenContentAd
        index={2}
        show={true}
        network="placeholder"
        responsive={true}
        maxWidth="800px"
      />

      {/* Team Section */}
      <TeamSection
        title={dict.aboutPage.ourLeadership.title}
        description={dict.aboutPage.ourLeadership.description}
        members={teamMembers}
        columns={3}
        variant="default"
        size="md"
        background="light"
        alignment="center"
        showDivider={true}
        showSocialLinks={true}
      />

      {/* Final CTA Section */}
      <CTASection
        title={dict.aboutPage.readyToStream}
        description={dict.downloadCta.description}
        primaryButton={{
          text: dict.aboutPage.downloadApp,
          href: `/${locale}/downloads`,
          variant: "default",
          size: "lg",
          icon: <Download className="w-5 h-5" />,
          iconPosition: "left",
        }}
        secondaryButton={{
          text: dict.aboutPage.contactUs,
          href: `/${locale}/contact`,
          variant: "secondary",
          size: "lg",
          icon: <MessageSquare className="w-5 h-5" />,
          iconPosition: "left",
        }}
        variant="gradient"
        size="lg"
        alignment="center"
        background="gradient"
        showDivider={true}
      >
        <div className="mt-8 text-sm text-gray-500">
          <p>{dict.downloadCta.availability}</p>
        </div>
      </CTASection>

      {/* Bottom Banner Ad */}
      <BottomBanner
        show={true}
        network="placeholder"
        responsive={true}
        maxWidth="1200px"
        margin="my-8"
      />
    </div>
  );
}
