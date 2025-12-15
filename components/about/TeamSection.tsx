import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { TeamMember, TeamMemberProps } from "./TeamMember";

interface TeamSectionProps {
  title?: string;
  description?: string;
  members: Array<{
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
  }>;
  columns?: 1 | 2 | 3 | 4;
  variant?: TeamMemberProps["variant"];
  size?: TeamMemberProps["size"];
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  gridClassName?: string;
  showDivider?: boolean;
  alignment?: "left" | "center";
  background?: "light" | "white" | "gradient";
  showSocialLinks?: boolean;
  memberClassName?: string;
}

export function TeamSection({
  title,
  description,
  members,
  columns = 3,
  variant = "default",
  size = "md",
  className,
  titleClassName,
  descriptionClassName,
  gridClassName,
  showDivider = false,
  alignment = "center",
  background = "light",
  showSocialLinks = true,
  memberClassName,
}: TeamSectionProps) {
  const gridColumns = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  };

  const alignmentClasses = {
    left: "text-left",
    center: "text-center",
  };

  const backgroundClasses = {
    light: "bg-gray-50",
    white: "bg-white",
    gradient: "bg-gradient-to-b from-gray-50 to-white",
  };

  return (
    <section className={cn("w-full py-12", backgroundClasses[background], className)}>
      <div className="container mx-auto px-4">
        {(title || description) && (
          <div className={cn("mb-12 max-w-3xl", alignmentClasses[alignment])}>
            {title && (
              <h2 className={cn(
                "text-3xl font-bold text-gray-900 mb-4",
                titleClassName
              )}>
                {title}
              </h2>
            )}
            {description && (
              <p className={cn(
                "text-gray-600 text-lg",
                descriptionClassName
              )}>
                {description}
              </p>
            )}
            {showDivider && (
              <div className={cn(
                "h-1 w-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mt-6",
                alignment === "center" ? "mx-auto" : ""
              )} />
            )}
          </div>
        )}

        <div className={cn(
          "grid gap-6 md:gap-8",
          gridColumns[columns],
          gridClassName
        )}>
          {members.map((member, index) => (
            <TeamMember
              key={index}
              name={member.name}
              role={member.role}
              bio={member.bio}
              imageUrl={member.imageUrl}
              initials={member.initials}
              socialLinks={member.socialLinks}
              variant={variant}
              size={size}
              alignment={alignment}
              showSocialLinks={showSocialLinks}
              className={memberClassName}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
