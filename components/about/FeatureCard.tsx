import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export interface FeatureCardProps {
  title: string;
  description: string;
  icon?: ReactNode;
  iconText?: string;
  iconColor?: "green" | "blue" | "orange" | "purple" | "red" | "teal";
  variant?: "default" | "outline" | "gradient";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  href?: string;
}

export function FeatureCard({
  title,
  description,
  icon,
  iconText,
  iconColor = "green",
  variant = "default",
  size = "md",
  className,
  onClick,
  href,
}: FeatureCardProps) {
  const iconColorClasses = {
    green: "bg-green-100 text-green-600",
    blue: "bg-blue-100 text-blue-600",
    orange: "bg-orange-100 text-orange-600",
    purple: "bg-purple-100 text-purple-600",
    red: "bg-red-100 text-red-600",
    teal: "bg-teal-100 text-teal-600",
  };

  const variantClasses = {
    default: "bg-white shadow-md hover:shadow-xl",
    outline: "bg-transparent border-2 border-gray-200 hover:border-green-300",
    gradient:
      "bg-gradient-to-br from-white to-gray-50 shadow-lg hover:shadow-2xl",
  };

  const sizeClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const iconSizeClasses = {
    sm: "w-10 h-10 text-lg",
    md: "w-12 h-12 text-xl",
    lg: "w-16 h-16 text-2xl",
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

  const content = (
    <div
      className={cn(
        "rounded-xl transition-all duration-300 hover:-translate-y-1",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      onClick={onClick}
    >
      <div className="flex flex-col items-start">
        {(icon || iconText) && (
          <div
            className={cn(
              "rounded-full flex items-center justify-center mb-4",
              iconColorClasses[iconColor],
              iconSizeClasses[size],
            )}
          >
            {icon ? icon : <span className="font-bold">{iconText}</span>}
          </div>
        )}
        <h3
          className={cn(
            "font-semibold text-gray-900 mb-2",
            titleSizeClasses[size],
          )}
        >
          {title}
        </h3>
        <p className={cn("text-gray-600", descriptionSizeClasses[size])}>
          {description}
        </p>
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block no-underline">
        {content}
      </a>
    );
  }

  return content;
}
