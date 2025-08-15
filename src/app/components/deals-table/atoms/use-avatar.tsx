/**
 * User Avatar Atom
 * Displays user avatar with fallback initials
 *
 * @format
 */

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  name: string;
  initials: string;
  avatar?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-10 w-10",
};

export function UserAvatar({
  name,
  initials,
  avatar,
  size = "sm",
  className,
}: UserAvatarProps) {
  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      <AvatarImage src={avatar || "/placeholder.svg"} alt={name} />
      <AvatarFallback className="text-xs font-medium bg-primary/10 text-primary">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
