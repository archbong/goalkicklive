import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Mail, Phone, MapPin, Clock, Globe, MessageSquare, Users, Shield } from "lucide-react";

interface ContactInfoItem {
  icon: ReactNode;
  title: string;
  content: string | ReactNode;
  description?: string;
  href?: string;
  color?: "green" | "blue" | "orange" | "purple" | "teal";
}

interface ContactInfoProps {
  title?: string;
  description?: string;
  items: ContactInfoItem[];
  columns?: 1 | 2 | 3 | 4;
  variant?: "default" | "grid" | "list" | "card";
  size?: "sm" | "md" | "lg";
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  showDivider?: boolean;
  alignment?: "left" | "center";
  background?: "light" | "white" | "gradient";
  iconSize?: "sm" | "md" | "lg";
  showDescriptions?: boolean;
  interactive?: boolean;
}

export function ContactInfo({
  title,
  description,
  items,
  columns = 3,
  variant = "default",
  size = "md",
  className,
  titleClassName,
  descriptionClassName,
  showDivider = false,
  alignment = "center",
  background = "light",
  iconSize = "md",
  showDescriptions = true,
  interactive = true,
}: ContactInfoProps) {
  const variantClasses = {
    default: "space-y-6",
    grid: "grid gap-6",
    list: "space-y-4",
    card: "grid gap-6",
  };

  const sizeClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const iconSizeClasses = {
    sm: "w-8 h-8 p-2",
    md: "w-12 h-12 p-3",
    lg: "w-16 h-16 p-4",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const titleSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  const descriptionSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const gridColumns = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-4",
  };

  const alignmentClasses = {
    left: "text-left items-start",
    center: "text-center items-center",
  };

  const backgroundClasses = {
    light: "bg-gray-50",
    white: "bg-white",
    gradient: "bg-gradient-to-b from-gray-50 to-white",
  };

  const colorClasses = {
    green: "bg-green-100 text-green-600",
    blue: "bg-blue-100 text-blue-600",
    orange: "bg-orange-100 text-orange-600",
    purple: "bg-purple-100 text-purple-600",
    teal: "bg-teal-100 text-teal-600",
  };

  const renderItem = (item: ContactInfoItem, index: number) => {
    const content = (
      <div
        className={cn(
          "flex flex-col",
          alignmentClasses[alignment],
          variant === "card" && "bg-white rounded-xl shadow-md hover:shadow-lg p-6 transition-shadow duration-300",
          interactive && "hover:-translate-y-1 transition-transform duration-300"
        )}
      >
        <div
          className={cn(
            "rounded-full flex items-center justify-center mb-4",
            colorClasses[item.color || "green"],
            iconSizeClasses[iconSize]
          )}
        >
          {item.icon}
        </div>

        <h3 className={cn("font-semibold text-gray-900 mb-2", textSizeClasses[size])}>
          {item.title}
        </h3>

        <div className={cn("text-gray-600 mb-2", textSizeClasses[size])}>
          {typeof item.content === "string" ? (
            item.href ? (
              <a
                href={item.href}
                className="text-green-600 hover:text-green-700 hover:underline transition-colors"
              >
                {item.content}
              </a>
            ) : (
              item.content
            )
          ) : (
            item.content
          )}
        </div>

        {showDescriptions && item.description && (
          <p className={cn("text-gray-500", descriptionSizeClasses[size])}>
            {item.description}
          </p>
        )}
      </div>
    );

    if (variant === "card") {
      return <div key={index}>{content}</div>;
    }

    return content;
  };

  return (
    <section className={cn("w-full py-12", backgroundClasses[background], className)}>
      <div className="container mx-auto px-4">
        {(title || description) && (
          <div className={cn("mb-12 max-w-3xl", alignment === "center" ? "mx-auto text-center" : "text-left")}>
            {title && (
              <h2 className={cn("font-bold text-gray-900 mb-4", titleSizeClasses[size], titleClassName)}>
                {title}
              </h2>
            )}
            {description && (
              <p className={cn("text-gray-600", descriptionSizeClasses[size], descriptionClassName)}>
                {description}
              </p>
            )}
            {showDivider && (
              <div
                className={cn(
                  "h-1 w-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mt-6",
                  alignment === "center" ? "mx-auto" : ""
                )}
              />
            )}
          </div>
        )}

        <div
          className={cn(
            variantClasses[variant],
            variant === "grid" && gridColumns[columns],
            variant === "card" && gridColumns[columns]
          )}
        >
          {items.map((item, index) => renderItem(item, index))}
        </div>
      </div>
    </section>
  );
}

// Pre-configured contact info items for common use cases
export const contactInfoPresets = {
  basic: (locale: string): ContactInfoItem[] => [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      content: "contact@goalkicklive.com",
      description: "We'll respond within 24 hours",
      href: "mailto:contact@goalkicklive.com",
      color: "green",
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone",
      content: "+1 (555) 123-4567",
      description: "Mon-Fri, 9AM-6PM EST",
      href: "tel:+15551234567",
      color: "blue",
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Location",
      content: "San Francisco, CA",
      description: "Global remote team",
      color: "orange",
    },
  ],

  detailed: (locale: string): ContactInfoItem[] => [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "General Inquiries",
      content: "hello@goalkicklive.com",
      description: "For general questions and information",
      href: "mailto:hello@goalkicklive.com",
      color: "green",
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Support",
      content: "support@goalkicklive.com",
      description: "Technical issues and app support",
      href: "mailto:support@goalkicklive.com",
      color: "blue",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Partnerships",
      content: "partners@goalkicklive.com",
      description: "Business and partnership opportunities",
      href: "mailto:partners@goalkicklive.com",
      color: "purple",
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone Support",
      content: "+1 (555) 987-6543",
      description: "Available 24/7 for premium users",
      href: "tel:+15559876543",
      color: "orange",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Office Hours",
      content: "9:00 AM - 6:00 PM EST",
      description: "Monday to Friday",
      color: "teal",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global Support",
      content: "Available in 5 languages",
      description: "English, Spanish, French, Arabic, Hebrew",
      color: "blue",
    },
  ],

  social: (locale: string): ContactInfoItem[] => [
    {
      icon: <span className="text-lg font-bold">𝕏</span>,
      title: "Twitter",
      content: "@goalkicklive",
      description: "Latest updates and announcements",
      href: "https://twitter.com/goalkicklive",
      color: "blue",
    },
    {
      icon: <span className="text-lg font-bold">f</span>,
      title: "Facebook",
      content: "Goalkick Live",
      description: "Join our community",
      href: "https://facebook.com/goalkicklive",
      color: "blue",
    },
    {
      icon: <span className="text-lg font-bold">ig</span>,
      title: "Instagram",
      content: "@goalkicklive",
      description: "Behind the scenes and highlights",
      href: "https://instagram.com/goalkicklive",
      color: "purple",
    },
    {
      icon: <span className="text-lg font-bold">in</span>,
      title: "LinkedIn",
      content: "Goalkick Live",
      description: "Company updates and careers",
      href: "https://linkedin.com/company/goalkicklive",
      color: "blue",
    },
  ],
};
