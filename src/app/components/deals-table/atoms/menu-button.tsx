/** @format */

interface MenuButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  destructive?: boolean;
}

const MenuButton: React.FC<MenuButtonProps> = ({
  onClick,
  children,
  disabled = false,
  destructive = false,
}) => (
  <button
    className={`w-full text-left px-4 py-2 text-sm transition-colors focus:outline-none flex items-center gap-2 
        ${
          destructive
            ? "text-destructive hover:bg-destructive/10 focus:bg-destructive/10"
            : "text-foreground hover:bg-muted focus:bg-muted"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    onClick={onClick}
    disabled={disabled}
    role="menuitem"
  >
    {children}
  </button>
);

export default MenuButton;
