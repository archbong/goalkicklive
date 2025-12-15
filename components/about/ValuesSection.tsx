import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ValueCardProps {
  title: string;
  description: string;
  icon?: ReactNode;
  iconText?: string;
  iconColor?: "green" | "blue" | "orange" | "purple" | "teal";
  variant?: "default" | "gradient" | "outline" | "minimal";
  size?: "sm" | "md" | "lg";
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  iconClassName?: string;
  alignment?: "left" | "center";
  showBorder?: boolean;
  borderColor?: "green" | "blue" | "gray";
}

function ValueCard({
  title,
  description,
  icon,
  iconText,
  iconColor = "green",
  variant = "default",
  size = "md",
  className,
  titleClassName,
  descriptionClassName,
  iconClassName,
  alignment = "center",
  showBorder = true,
  borderColor = "green",
}: ValueCardProps) {
  const variantClasses = {
    default: "bg-white shadow-md hover:shadow-lg",
    gradient:
      "bg-gradient-to-br from-white to-gray-50 shadow-lg hover:shadow-xl",
    outline: "bg-transparent border-2",
    minimal: "bg-transparent",
  };

  const sizeClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const iconSizeClasses = {
    sm: "w-10 h-10 text-base",
    md: "w-12 h-12 text-lg",
    lg: "w-16 h-16 text-xl",
  };

  const iconColorClasses = {
    green: "bg-green-100 text-green-600",
    blue: "bg-blue-100 text-blue-600",
    orange: "bg-orange-100 text-orange-600",
    purple: "bg-purple-100 text-purple-600",
    teal: "bg-teal-100 text-teal-600",
  };

  const borderColorClasses = {
    green: "border-green-200 hover:border-green-400",
    blue: "border-blue-200 hover:border-blue-400",
    gray: "border-gray-200 hover:border-gray-400",
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
    left: "text-left items-start",
    center: "text-center items-center",
  };

  const getIconContent = () => {
    if (icon) return icon;
    if (iconText) return <span className="font-bold">{iconText}</span>;
    return null;
  };

  return (
    <div
      className={cn(
        "rounded-xl transition-all duration-300 hover:-translate-y-1",
        variantClasses[variant],
        sizeClasses[size],
        alignmentClasses[alignment],
        variant === "outline" && showBorder && borderColorClasses[borderColor],
        className,
      )}
    >
      {getIconContent() && (
        <div
          className={cn(
            "rounded-full flex items-center justify-center mb-4",
            iconColorClasses[iconColor],
            iconSizeClasses[size],
            iconClassName,
          )}
        >
          {getIconContent()}
        </div>
      )}

      <h3
        className={cn(
          "font-semibold text-gray-900 mb-3",
          titleSizeClasses[size],
          titleClassName,
        )}
      >
        {title}
      </h3>
      <p
        className={cn(
          "text-gray-600 leading-relaxed",
          descriptionSizeClasses[size],
          descriptionClassName,
        )}
      >
        {description}
      </p>
    </div>
  );
}

interface ValuesSectionProps {
  title?: string;
  description?: string;
  values: Array<{
    title: string;
    description: string;
    icon?: ReactNode;
    iconText?: string;
    iconColor?: ValueCardProps["iconColor"];
  }>;
  columns?: 2 | 3 | 4;
  variant?: ValueCardProps["variant"];
  size?: ValueCardProps["size"];
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  gridClassName?: string;
  showDivider?: boolean;
  alignment?: ValueCardProps["alignment"];
  background?: "light" | "white" | "gradient" | "pattern";
  iconColor?: ValueCardProps["iconColor"];
  showBorder?: boolean;
  borderColor?: ValueCardProps["borderColor"];
  maxWidth?: "sm" | "md" | "lg" | "full";
}

export function ValuesSection({
  title,
  description,
  values,
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
  iconColor = "green",
  showBorder = true,
  borderColor = "green",
  maxWidth = "lg",
}: ValuesSectionProps) {
  const gridColumns = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-4",
  };

  const backgroundClasses = {
    light: "bg-gray-50",
    white: "bg-white",
    gradient: "bg-gradient-to-b from-gray-50 to-white",
    pattern:
      "bg-gradient-to-br from-gray-50 to-white bg-[url('/pattern.svg')] bg-repeat opacity-95",
  };

  const maxWidthClasses = {
    sm: "max-w-2xl",
    md: "max-w-3xl",
    lg: "max-w-4xl",
    full: "max-w-full",
  };

  return (
    <section
      className={cn("w-full py-12", backgroundClasses[background], className)}
    >
      <div className="container mx-auto px-4">
        <div className={cn("mx-auto", maxWidthClasses[maxWidth])}>
          {(title || description) && (
            <div
              className={cn(
                "mb-12",
                alignment === "center" ? "text-center" : "text-left",
              )}
            >
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
                <p
                  className={cn("text-gray-600 text-lg", descriptionClassName)}
                >
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
            {values.map((value, index) => (
              <ValueCard
                key={index}
                title={value.title}
                description={value.description}
                icon={value.icon}
                iconText={value.iconText}
                iconColor={value.iconColor || iconColor}
                variant={variant}
                size={size}
                alignment={alignment}
                showBorder={showBorder}
                borderColor={borderColor}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
