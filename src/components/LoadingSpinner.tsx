import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "secondary" | "accent" | "light" | "dark";
  type?: "spinner" | "dots" | "pulse";
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  color = "primary",
  type = "spinner",
}) => {
  // Size classes
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  // Color classes
  const colorClasses = {
    primary: "text-primary dark:text-primary-dark",
    secondary: "text-secondary dark:text-secondary-dark",
    accent: "text-accent dark:text-accent-dark",
    light: "text-light dark:text-white",
    dark: "text-dark dark:text-light",
  };

  // Render spinner type
  if (type === "spinner") {
    return (
      <div
        className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="w-full h-full"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    );
  }

  // Render dots type
  if (type === "dots") {
    return (
      <div className="flex space-x-1 justify-center items-center">
        <div
          className={`${sizeClasses[size]
            .split(" ")[0]
            .replace("w-", "w-2 ")} ${
            colorClasses[color]
          } rounded-full animate-bounce`}
          style={{ animationDelay: "0ms" }}
        ></div>
        <div
          className={`${sizeClasses[size]
            .split(" ")[0]
            .replace("w-", "w-2 ")} ${
            colorClasses[color]
          } rounded-full animate-bounce`}
          style={{ animationDelay: "150ms" }}
        ></div>
        <div
          className={`${sizeClasses[size]
            .split(" ")[0]
            .replace("w-", "w-2 ")} ${
            colorClasses[color]
          } rounded-full animate-bounce`}
          style={{ animationDelay: "300ms" }}
        ></div>
      </div>
    );
  }

  // Render pulse type
  return (
    <div
      className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-pulse flex items-center justify-center`}
    >
      <div className="w-3/4 h-3/4 rounded-full bg-current opacity-75"></div>
    </div>
  );
};

export default LoadingSpinner;
