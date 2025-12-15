import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { FeatureCard, FeatureCardProps } from "./FeatureCard";

interface FeatureGridProps {
  title?: string;
  description?: string;
  features: Array<{
    title: string;
    description: string;
    icon?: ReactNode;
    iconText?: string;
    iconColor?: FeatureCardProps["iconColor"];
  }>;
  columns?: 1 | 2 | 3 | 4;
  variant?: FeatureCardProps["variant"];
  size?: FeatureCardProps["size"];
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  gridClassName?: string;
  showDivider?: boolean;
  alignment?: "left" | "center";
  background?: "light" | "white" | "gradient";
}

export function FeatureGrid({
  title,
  description,
  features,
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
}: FeatureGridProps) {
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
    <section
      className={cn("w-full py-12", backgroundClasses[background], className)}
    >
      <div className="container mx-auto px-4">
        {(title || description) && (
          <div className={cn("mb-12 max-w-3xl", alignmentClasses[alignment])}>
            {title && (
              <h2
                className={cn(
                  "text-3xl font-bold text-gray-900 mb-4",
                  titleClassName,
                )}
              >
                {title}
              </h2>
            )}
            {description && (
              <p className={cn("text-gray-600 text-lg", descriptionClassName)}>
                {description}
              </p>
            )}
            {showDivider && (
              <div
                className={cn(
                  "h-1 w-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mt-6",
                  alignment === "center" ? "mx-auto" : "",
                )}
              />
            )}
          </div>
        )}

        <div
          className={cn(
            "grid gap-6 md:gap-8",
            gridColumns[columns],
            gridClassName,
          )}
        >
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              iconText={feature.iconText}
              iconColor={feature.iconColor}
              variant={variant}
              size={size}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
