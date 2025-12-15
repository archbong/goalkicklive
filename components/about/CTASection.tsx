import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { ReactNode } from "react";

interface CTASectionProps {
  title: string;
  description?: string;
  primaryButton?: {
    text: string;
    href: string;
    onClick?: () => void;
    variant?: "default" | "secondary" | "ghost";
    size?: "default" | "sm" | "lg";
    icon?: ReactNode;
    iconPosition?: "left" | "right";
  };
  secondaryButton?: {
    text: string;
    href: string;
    onClick?: () => void;
    variant?: "default" | "secondary" | "ghost";
    size?: "default" | "sm" | "lg";
    icon?: ReactNode;
    iconPosition?: "left" | "right";
  };
  buttons?: Array<{
    text: string;
    href: string;
    onClick?: () => void;
    variant?: "default" | "secondary" | "ghost";
    size?: "default" | "sm" | "lg";
    icon?: ReactNode;
    iconPosition?: "left" | "right";
  }>;
  variant?: "default" | "gradient" | "outline" | "card";
  size?: "sm" | "md" | "lg";
  alignment?: "left" | "center" | "right";
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  buttonsClassName?: string;
  background?: "light" | "white" | "gradient" | "pattern";
  showDivider?: boolean;
  children?: ReactNode;
}

export function CTASection({
  title,
  description,
  primaryButton,
  secondaryButton,
  buttons,
  variant = "default",
  size = "md",
  alignment = "center",
  className,
  titleClassName,
  descriptionClassName,
  buttonsClassName,
  background = "light",
  showDivider = false,
  children,
}: CTASectionProps) {
  const variantClasses = {
    default: "rounded-xl",
    gradient: "rounded-xl bg-gradient-to-r from-green-50 to-blue-50",
    outline: "rounded-xl border-2 border-green-200",
    card: "rounded-xl shadow-lg",
  };

  const sizeClasses = {
    sm: "py-8 px-6",
    md: "py-12 px-8",
    lg: "py-16 px-10",
  };

  const alignmentClasses = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  };

  const titleSizeClasses = {
    sm: "text-xl md:text-2xl",
    md: "text-2xl md:text-3xl",
    lg: "text-3xl md:text-4xl",
  };

  const descriptionSizeClasses = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl",
  };

  const backgroundClasses = {
    light: "bg-gray-50",
    white: "bg-white",
    gradient: "bg-gradient-to-r from-green-50 to-blue-50",
    pattern:
      "bg-gradient-to-r from-green-50 to-blue-50 bg-[url('/pattern.svg')] bg-repeat opacity-90",
  };

  const renderButton = (
    button: {
      text: string;
      href: string;
      onClick?: () => void;
      variant?: "default" | "secondary" | "ghost";
      size?: "default" | "sm" | "lg";
      icon?: ReactNode;
      iconPosition?: "left" | "right";
    },
    key?: string,
  ) => {
    const buttonContent = (
      <>
        {button.icon && button.iconPosition !== "right" && (
          <span className="mr-2">{button.icon}</span>
        )}
        {button.text}
        {button.icon && button.iconPosition === "right" && (
          <span className="ml-2">{button.icon}</span>
        )}
      </>
    );

    if (button.onClick) {
      return (
        <Button
          key={key}
          variant={button.variant || "default"}
          size={button.size || "default"}
          onClick={button.onClick}
          className="min-w-[140px]"
        >
          {buttonContent}
        </Button>
      );
    }

    return (
      <a
        key={key}
        href={button.href}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] min-w-[140px]",
          button.variant === "secondary"
            ? "bg-gray-200 text-gray-900 hover:bg-gray-300 focus-visible:ring-gray-400 shadow-sm hover:shadow-md h-10 px-4 py-2"
            : button.variant === "ghost"
              ? "bg-transparent hover:bg-gray-100 text-gray-900 focus-visible:ring-gray-300 h-10 px-4 py-2"
              : "bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-500 shadow-sm hover:shadow-md h-10 px-4 py-2",
        )}
      >
        {buttonContent}
      </a>
    );
  };

  return (
    <section className={cn("w-full", backgroundClasses[background], className)}>
      <div className="container mx-auto px-4">
        <div
          className={cn(
            "flex flex-col",
            variantClasses[variant],
            sizeClasses[size],
            alignmentClasses[alignment],
            "mx-auto max-w-4xl",
          )}
        >
          <h2
            className={cn(
              "font-bold text-gray-900 mb-4",
              titleSizeClasses[size],
              titleClassName,
            )}
          >
            {title}
          </h2>

          {description && (
            <p
              className={cn(
                "text-gray-600 mb-8 leading-relaxed",
                descriptionSizeClasses[size],
                descriptionClassName,
              )}
            >
              {description}
            </p>
          )}

          {showDivider && (
            <div
              className={cn(
                "h-1 w-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mb-8",
                alignment === "center"
                  ? "mx-auto"
                  : alignment === "right"
                    ? "ml-auto"
                    : "",
              )}
            />
          )}

          {(primaryButton || secondaryButton || buttons) && (
            <div
              className={cn(
                "flex flex-col sm:flex-row gap-4",
                alignment === "center"
                  ? "justify-center"
                  : alignment === "right"
                    ? "justify-end"
                    : "justify-start",
                buttonsClassName,
              )}
            >
              {buttons ? (
                buttons.map((button, index) =>
                  renderButton(button, `button-${index}`),
                )
              ) : (
                <>
                  {primaryButton && renderButton(primaryButton, "primary")}
                  {secondaryButton &&
                    renderButton(secondaryButton, "secondary")}
                </>
              )}
            </div>
          )}

          {children && <div className="mt-8">{children}</div>}
        </div>
      </div>
    </section>
  );
}
