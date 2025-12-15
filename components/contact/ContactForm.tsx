import { useState, FormEvent } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Send, CheckCircle, Loader2 } from "lucide-react";

interface ContactFormProps {
  title?: string;
  description?: string;
  nameLabel: string;
  emailLabel: string;
  messageLabel: string;
  submitLabel: string;
  successMessage: string;
  loadingLabel?: string;
  variant?: "default" | "outline" | "gradient" | "card";
  size?: "sm" | "md" | "lg";
  className?: string;
  onSubmit?: (data: {
    name: string;
    email: string;
    message: string;
  }) => Promise<void> | void;
  showLabels?: boolean;
  showSuccessToast?: boolean;
  autoFocus?: boolean;
}

export function ContactForm({
  title,
  description,
  nameLabel,
  emailLabel,
  messageLabel,
  submitLabel,
  successMessage,
  loadingLabel = "Sending...",
  variant = "default",
  size = "md",
  className,
  onSubmit,
  showLabels = false,
  showSuccessToast = true,
  autoFocus = false,
}: ContactFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});

  const variantClasses = {
    default: "bg-white shadow-md",
    outline: "bg-transparent border-2 border-gray-200",
    gradient: "bg-gradient-to-br from-white to-gray-50 shadow-lg",
    card: "bg-white rounded-xl shadow-lg",
  };

  const sizeClasses = {
    sm: "p-4 space-y-4",
    md: "p-6 space-y-6",
    lg: "p-8 space-y-8",
  };

  const inputSizeClasses = {
    sm: "p-2 text-sm",
    md: "p-3",
    lg: "p-4 text-lg",
  };

  const buttonSizeClasses = {
    sm: "py-2 text-sm",
    md: "py-3",
    lg: "py-4 text-lg",
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!message.trim()) {
      newErrors.message = "Message is required";
    } else if (message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (onSubmit) {
        await onSubmit({ name, email, message });
      } else {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      setIsSubmitted(true);
      setName("");
      setEmail("");
      setMessage("");
      setErrors({});

      if (showSuccessToast) {
        setTimeout(() => setIsSubmitted(false), 4000);
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setErrors({
        email: "Failed to send message. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = cn(
    "w-full border rounded-md transition-all duration-300",
    "focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent",
    "hover:border-green-500",
    inputSizeClasses[size],
    "disabled:opacity-50 disabled:cursor-not-allowed"
  );

  const errorInputClass = cn(inputClass, "border-red-300 focus:ring-red-500");

  return (
    <div className={cn("w-full", className)}>
      {(title || description) && (
        <div className="mb-6 text-center">
          {title && (
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
          )}
          {description && (
            <p className="text-gray-600">{description}</p>
          )}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className={cn(
          "rounded-xl",
          variantClasses[variant],
          sizeClasses[size],
          "relative"
        )}
        noValidate
      >
        {/* Success Toast */}
        {showSuccessToast && isSubmitted && (
          <div
            className={cn(
              "absolute top-0 left-1/2 -translate-x-1/2 transform transition-all duration-500",
              "opacity-100 translate-y-0",
              "bg-green-100 text-green-800 rounded-md px-6 py-3 shadow-md text-center",
              "flex items-center gap-2 z-10"
            )}
          >
            <CheckCircle className="w-5 h-5" />
            {successMessage}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            {showLabels && (
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                {nameLabel}
              </label>
            )}
            <input
              id="name"
              type="text"
              placeholder={showLabels ? "" : nameLabel}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={errors.name ? errorInputClass : inputClass}
              disabled={isSubmitting}
              autoFocus={autoFocus}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            {showLabels && (
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {emailLabel}
              </label>
            )}
            <input
              id="email"
              type="email"
              placeholder={showLabels ? "" : emailLabel}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? errorInputClass : inputClass}
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          {showLabels && (
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              {messageLabel}
            </label>
          )}
          <textarea
            id="message"
            placeholder={showLabels ? "" : messageLabel}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            className={cn(
              errors.message ? errorInputClass : inputClass,
              "resize-none"
            )}
            disabled={isSubmitting}
          />
          {errors.message && (
            <p className="text-red-500 text-sm">{errors.message}</p>
          )}
        </div>

        <Button
          type="submit"
          variant="default"
          size={size === "sm" ? "sm" : size === "lg" ? "lg" : "default"}
          className={cn(
            "w-full transform transition-all duration-300",
            "hover:scale-105 hover:shadow-lg",
            buttonSizeClasses[size],
            isSubmitting && "opacity-75 cursor-not-allowed"
          )}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              {loadingLabel}
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              {submitLabel}
            </>
          )}
        </Button>

        {/* Character counter for message */}
        <div className="text-right text-sm text-gray-500">
          {message.length}/2000 characters
        </div>
      </form>
    </div>
  );
}
