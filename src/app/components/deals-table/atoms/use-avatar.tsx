/**
 * User Avatar Atom
 * Displays user avatar with fallback initials
 * Pure Tailwind CSS implementation without shadcn dependencies
 *
 * @format
 */

import { cn } from "@/lib/utils";

interface UserAvatarProps {
  name: string;
  initials: string;
  avatar?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-6 w-6 text-xs",
  md: "h-8 w-8 text-sm",
  lg: "h-10 w-10 text-base",
};

export function UserAvatar({
  name,
  initials,
  avatar,
  size = "sm",
  className,
}: UserAvatarProps) {
  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center rounded-full overflow-hidden",
        sizeClasses[size],
        className
      )}
    >
      {avatar ? (
        <img
          src={avatar || "/placeholder.svg"}
          alt={name}
          className="h-full w-full object-cover"
          onError={(e) => {
            // Fallback to initials if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
            const fallback = target.nextElementSibling as HTMLElement;
            if (fallback) fallback.style.display = "flex";
          }}
        />
      ) : null}
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center font-medium",
          "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
          avatar ? "hidden" : "flex"
        )}
        style={{ display: avatar ? "none" : "flex" }}
      >
        {initials}
      </div>
    </div>
  );
}
