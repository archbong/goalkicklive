import { cn } from "@/lib/utils";
import Image from "next/image";
import { ReactNode } from "react";

export interface TeamMemberProps {
  name: string;
  role: string;
  bio: string;
  imageUrl?: string;
  initials?: string;
  socialLinks?: Array<{
    platform: string;
    url: string;
    icon: ReactNode;
  }>;
  variant?: "default" | "compact" | "detailed";
  size?: "sm" | "md" | "lg";
  className?: string;
  imageClassName?: string;
  nameClassName?: string;
  roleClassName?: string;
  bioClassName?: string;
  showSocialLinks?: boolean;
  alignment?: "left" | "center";
}

export function TeamMember({
  name,
  role,
  bio,
  imageUrl,
  initials,
  socialLinks = [],
  variant = "default",
  size = "md",
  className,
  imageClassName,
  nameClassName,
  roleClassName,
  bioClassName,
  showSocialLinks = true,
  alignment = "center",
}: TeamMemberProps) {
  const variantClasses = {
    default: "bg-white rounded-xl shadow-md hover:shadow-xl p-6",
    compact: "bg-transparent p-4",
    detailed: "bg-white rounded-xl shadow-lg hover:shadow-2xl p-8",
  };

  const sizeClasses = {
    sm: "space-y-3",
    md: "space-y-4",
    lg: "space-y-6",
  };

  const imageSizeClasses = {
    sm: "w-16 h-16",
    md: "w-20 h-20",
    lg: "w-24 h-24",
  };

  const nameSizeClasses = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl",
  };

  const roleSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const bioSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const alignmentClasses = {
    left: "text-left items-start",
    center: "text-center items-center",
  };

  const getInitials = () => {
    if (initials) return initials;
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getGradientColor = (name: string) => {
    const colors = [
      "from-green-500 to-blue-500",
      "from-blue-500 to-purple-500",
      "from-orange-500 to-red-500",
      "from-purple-500 to-pink-500",
      "from-teal-500 to-green-500",
    ];

    const hash = name
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  return (
    <div
      className={cn(
        "flex flex-col transition-all duration-300 hover:-translate-y-1",
        variantClasses[variant],
        sizeClasses[size],
        alignmentClasses[alignment],
        className,
      )}
    >
      {/* Image/Initials */}
      <div className={cn("relative", alignmentClasses[alignment])}>
        {imageUrl ? (
          <div
            className={cn(
              "rounded-full overflow-hidden",
              imageSizeClasses[size],
              imageClassName,
            )}
          >
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ) : (
          <div
            className={cn(
              "rounded-full flex items-center justify-center text-white font-bold",
              `bg-gradient-to-r ${getGradientColor(name)}`,
              imageSizeClasses[size],
              imageClassName,
            )}
          >
            {getInitials()}
          </div>
        )}
      </div>

      {/* Name and Role */}
      <div className={cn("flex flex-col", alignmentClasses[alignment])}>
        <h3
          className={cn(
            "font-semibold text-gray-900",
            nameSizeClasses[size],
            nameClassName,
          )}
        >
          {name}
        </h3>
        <p
          className={cn(
            "font-medium text-green-600",
            roleSizeClasses[size],
            roleClassName,
          )}
        >
          {role}
        </p>
      </div>

      {/* Bio */}
      <p
        className={cn(
          "text-gray-600 leading-relaxed",
          bioSizeClasses[size],
          bioClassName,
        )}
      >
        {bio}
      </p>

      {/* Social Links */}
      {showSocialLinks && socialLinks.length > 0 && (
        <div
          className={cn(
            "flex gap-3 pt-2",
            alignment === "center" ? "justify-center" : "justify-start",
          )}
        >
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-green-600 transition-colors duration-200"
              aria-label={`${name}'s ${link.platform} profile`}
            >
              {link.icon}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
