import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface StatItemProps {
  value: string | number;
  label: string;
  description?: string;
  icon?: ReactNode;
  iconPosition?: "top" | "left" | "right";
  variant?: "default" | "gradient" | "outline" | "minimal";
  size?: "sm" | "md" | "lg";
  className?: string;
  valueClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  iconClassName?: string;
  animation?: "none" | "count" | "fade" | "slide";
  duration?: number;
}

function StatItem({
  value,
  label,
  description,
  icon,
  iconPosition = "top",
  variant = "default",
  size = "md",
  className,
  valueClassName,
  labelClassName,
  descriptionClassName,
  iconClassName,
  animation = "none",
  duration = 1000,
}: StatItemProps) {
  const variantClasses = {
    default: "bg-white shadow-md hover:shadow-lg",
    gradient: "bg-gradient-to-br from-white to-gray-50 shadow-lg hover:shadow-xl",
    outline: "bg-transparent border-2 border-gray-200 hover:border-green-300",
    minimal: "bg-transparent",
  };

  const sizeClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const iconSizeClasses = {
    sm: "w-8 h-8 text-lg",
    md: "w-12 h-12 text-xl",
    lg: "w-16 h-16 text-2xl",
  };

  const valueSizeClasses = {
    sm: "text-2xl md:text-3xl",
    md: "text-3xl md:text-4xl",
    lg: "text-4xl md:text-5xl",
  };

  const labelSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const descriptionSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const layoutClasses = {
    top: "flex flex-col items-center text-center",
    left: "flex items-center text-left gap-4",
    right: "flex items-center text-left gap-4 flex-row-reverse",
  };

  return (
    <div
      className={cn(
        "rounded-xl transition-all duration-300 hover:-translate-y-1",
        variantClasses[variant],
        sizeClasses[size],
        layoutClasses[iconPosition],
        className
      )}
    >
      {icon && iconPosition === "top" && (
        <div
          className={cn(
            "text-green-600 mb-4 rounded-full bg-green-50 p-3",
            iconSizeClasses[size],
            iconClassName
          )}
        >
          {icon}
        </div>
      )}

      {icon && (iconPosition === "left" || iconPosition === "right") && (
        <div
          className={cn(
            "text-green-600 rounded-full bg-green-50 p-3 flex-shrink-0",
            iconSizeClasses[size],
            iconClassName
          )}
        >
          {icon}
        </div>
      )}

      <div className={cn(iconPosition === "left" || iconPosition === "right" ? "flex-1" : "")}>
        <div
          className={cn(
            "font-bold text-gray-900 mb-1",
            valueSizeClasses[size],
            valueClassName
          )}
          data-animation={animation}
          data-duration={duration}
        >
          {value}
        </div>
        <div className={cn("font-semibold text-gray-700", labelSizeClasses[size], labelClassName)}>
          {label}
        </div>
        {description && (
          <div
            className={cn(
              "text-gray-500 mt-2",
              descriptionSizeClasses[size],
              descriptionClassName
            )}
          >
            {description}
          </div>
        )}
      </div>
    </div>
  );
}

interface StatsSectionProps {
  title?: string;
  description?: string;
  stats: Array<{
    value: string | number;
    label: string;
    description?: string;
    icon?: ReactNode;
    iconPosition?: "top" | "left" | "right";
  }>;
  columns?: 2 | 3 | 4;
  variant?: StatItemProps["variant"];
  size?: StatItemProps["size"];
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  gridClassName?: string;
  showDivider?: boolean;
  alignment?: "left" | "center";
  background?: "light" | "white" | "gradient";
  iconPosition?: StatItemProps["iconPosition"];
  animation?: StatItemProps["animation"];
  duration?: StatItemProps["duration"];
}

export function StatsSection({
  title,
  description,
  stats,
  columns = 4,
  variant = "default",
  size = "md",
  className,
  titleClassName,
  descriptionClassName,
  gridClassName,
  showDivider = false,
  alignment = "center",
  background = "light",
  iconPosition = "top",
  animation = "none",
  duration = 1000,
}: StatsSectionProps) {
  const gridColumns = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-4",
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
            "grid gap-6 md:gap-8",
            gridColumns[columns],
            gridClassName
          )}
        >
          {stats.map((stat, index) => (
            <StatItem
              key={index}
              value={stat.value}
              label={stat.label}
              description={stat.description}
              icon={stat.icon}
              iconPosition={stat.iconPosition || iconPosition}
              variant={variant}
              size={size}
              animation={animation}
              duration={duration}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
