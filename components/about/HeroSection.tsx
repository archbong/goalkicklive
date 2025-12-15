import { cn } from "@/lib/utils";

interface HeroSectionProps {
  title: string;
  description: string;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  children?: React.ReactNode;
  background?: "light" | "gradient" | "pattern";
  alignment?: "left" | "center" | "right";
  size?: "sm" | "md" | "lg";
}

export function HeroSection({
  title,
  description,
  className,
  titleClassName,
  descriptionClassName,
  children,
  background = "light",
  alignment = "center",
  size = "lg",
}: HeroSectionProps) {
  const backgroundClasses = {
    light: "bg-gray-50",
    gradient: "bg-gradient-to-r from-green-50 to-blue-50",
    pattern: "bg-gradient-to-r from-green-50 to-blue-50 bg-[url('/pattern.svg')] bg-repeat opacity-90",
  };

  const alignmentClasses = {
    left: "text-left",
    center: "text-center mx-auto",
    right: "text-right ml-auto",
  };

  const sizeClasses = {
    sm: "py-8",
    md: "py-12",
    lg: "py-16",
  };

  const titleSizeClasses = {
    sm: "text-2xl md:text-3xl",
    md: "text-3xl md:text-4xl",
    lg: "text-4xl md:text-5xl",
  };

  return (
    <section className={cn("w-full", backgroundClasses[background], sizeClasses[size], className)}>
      <div className="container mx-auto px-4">
        <div className={cn("max-w-4xl", alignmentClasses[alignment])}>
          <h1 className={cn(
            "font-extrabold text-gray-900 mb-4",
            titleSizeClasses[size],
            titleClassName
          )}>
            {title}
          </h1>
          <p className={cn(
            "text-gray-600 text-lg leading-relaxed mb-6",
            descriptionClassName
          )}>
            {description}
          </p>
          {children && (
            <div className="mt-8">
              {children}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
