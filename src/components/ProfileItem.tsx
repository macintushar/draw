import { Loader2, LucideIcon } from "lucide-react";
import { DropdownMenuItem } from "./ui/dropdown-menu";

export default function ProfileItem({
  Icon,
  text,
  onClick,
  isLoading,
}: {
  Icon: LucideIcon;
  text: string;
  onClick?: () => void;
  isLoading?: boolean;
}) {
  return (
    <DropdownMenuItem onClick={onClick}>
      <Icon className="mr-2 h-4 w-4" />
      <span>{text}</span>
      {isLoading && <Loader2 className="ml-4 h-4 w-4 animate-spin" />}
    </DropdownMenuItem>
  );
}
