import { cn } from "@/lib/utils";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg";
}

export function IconButton({ className, size = "md", ...props }: IconButtonProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  }[size];

  return (
    <button
      className={cn(
        "flex items-center justify-center rounded-full hover:bg-gray-200 transition",
        sizeClasses,
        className
      )}
      {...props}
    />
  );
}
