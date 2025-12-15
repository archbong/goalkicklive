import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface TimelineItemProps {
  year: string;
  title: string;
  description: string;
  icon?: ReactNode;
  iconText?: string;
  variant?: "default" | "gradient" | "minimal";
  size?: "sm" | "md" | "lg";
  className?: string;
  yearClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  iconClassName?: string;
  alignment?: "left" | "right";
  isFirst?: boolean;
  isLast?: boolean;
}

function TimelineItem({
  year,
  title,
  description,
  icon,
  iconText,
  variant = "default",
  size = "md",
  className,
  yearClassName,
  titleClassName,
  descriptionClassName,
  iconClassName,
  alignment = "left",
  isFirst = false,
  isLast = false,
}: TimelineItemProps) {
  const variantClasses = {
    default: "bg-white shadow-md hover:shadow-lg",
    gradient: "bg-gradient-to-br from-white to-gray-50 shadow-lg hover:shadow-xl",
    minimal: "bg-transparent",
  };

  const sizeClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const iconSizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-12 h-12 text-base",
    lg: "w-16 h-16 text-lg",
  };

  const yearSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  const titleSizeClasses = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl",
  };

  const descriptionSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const alignmentClasses = {
    left: "text-left",
    right: "text-right",
  };

  const getIconContent = () => {
    if (icon) return icon;
    if (iconText) return <span className="font-bold">{iconText}</span>;
    return <div className="w-3 h-3 rounded-full bg-green-500" />;
  };

  return (
    <div className={cn("relative", className)}>
      {/* Timeline line */}
      <div
        className={cn(
          "absolute top-0 bottom-0 w-0.5 bg-gradient-to-b",
          alignment === "left" ? "left-6" : "right-6",
          isFirst ? "top-1/2" : "",
          isLast ? "bottom-1/2" : ""
        )}
      />

      {/* Timeline dot */}
      <div
        className={cn(
          "absolute top-6 z-10 flex items-center justify-center rounded-full border-4 border-white",
          alignment === "left" ? "left-6 -translate-x-1/2" : "right-6 translate-x-1/2",
          iconSizeClasses[size]
        )}
        style={{
          background: "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
        }}
      >
        <div className={cn("text-white", iconClassName)}>
          {getIconContent()}
        </div>
      </div>

      {/* Content */}
      <div
        className={cn(
          "relative rounded-xl transition-all duration-300 hover:-translate-y-1",
          variantClasses[variant],
          sizeClasses[size],
          alignmentClasses[alignment],
          alignment === "left" ? "ml-12" : "mr-12"
        )}
      >
        <div
          className={cn(
            "font-bold text-green-600 mb-2",
            yearSizeClasses[size],
            yearClassName
          )}
        >
          {year}
        </div>
        <h3
          className={cn(
            "font-semibold text-gray-900 mb-3",
            titleSizeClasses[size],
            titleClassName
          )}
        >
          {title}
        </h3>
        <p
          className={cn(
            "text-gray-600 leading-relaxed",
            descriptionSizeClasses[size],
            descriptionClassName
          )}
        >
          {description}
        </p>
      </div>
    </div>
  );
}

interface TimelineSectionProps {
  title?: string;
  description?: string;
  items: Array<{
    year: string;
    title: string;
    description: string;
    icon?: ReactNode;
    iconText?: string;
  }>;
  variant?: TimelineItemProps["variant"];
  size?: TimelineItemProps["size"];
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  showDivider?: boolean;
  alignment?: "left" | "right" | "alternate";
  background?: "light" | "white" | "gradient";
  maxWidth?: "sm" | "md" | "lg" | "full";
}

export function TimelineSection({
  title,
  description,
  items,
  variant = "default",
  size = "md",
  className,
  titleClassName,
  descriptionClassName,
  showDivider = false,
  alignment = "alternate",
  background = "light",
  maxWidth = "lg",
}: TimelineSectionProps) {
  const alignmentClasses = {
    left: "items-start",
    right: "items-end",
    alternate: "",
  };

  const backgroundClasses = {
    light: "bg-gray-50",
    white: "bg-white",
    gradient: "bg-gradient-to-b from-gray-50 to-white",
  };

  const maxWidthClasses = {
    sm: "max-w-2xl",
    md: "max-w-3xl",
    lg: "max-w-4xl",
    full: "max-w-full",
  };

  const getItemAlignment = (index: number): "left" | "right" => {
    if (alignment === "left") return "left";
    if (alignment === "right") return "right";
    return index % 2 === 0 ? "left" : "right";
  };

  return (
    <section className={cn("w-full py-12", backgroundClasses[background], className)}>
      <div className="container mx-auto px-4">
        {(title || description) && (
          <div className="mb-12 max-w-3xl mx-auto text-center">
            {title && (
              <h2
                className={cn(
                  "text-3xl font-bold text-gray-900 mb-4",
                  titleClassName
                )}
              >
                {title}
              </h2>
            )}
            {description && (
              <p
                className={cn(
                  "text-gray-600 text-lg",
                  descriptionClassName
                )}
              >
                {description}
              </p>
            )}
            {showDivider && (
              <div className="h-1 w-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mt-6 mx-auto" />
            )}
          </div>
        )}

        <div className={cn("mx-auto", maxWidthClasses[maxWidth])}>
          <div className={cn("flex flex-col gap-8", alignmentClasses[alignment])}>
            {items.map((item, index) => (
              <TimelineItem
                key={index}
                year={item.year}
                title={item.title}
                description={item.description}
                icon={item.icon}
                iconText={item.iconText}
                variant={variant}
                size={size}
                alignment={getItemAlignment(index)}
                isFirst={index === 0}
                isLast={index === items.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
