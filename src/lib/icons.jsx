import {
  Banknote, Car, Coffee, CircleHelp, GraduationCap, HeartPulse, House,
  Receipt, ShoppingBag, Utensils, WalletCards, BriefcaseBusiness
} from "lucide-react";

export const ICONS = {
  Banknote, Car, Coffee, CircleHelp, GraduationCap, HeartPulse, House,
  Receipt, ShoppingBag, Utensils, WalletCards, BriefcaseBusiness
};

export function CategoryIcon({ name = "CircleHelp", size = 16, ...props }) {
  const Icon = ICONS[name] || CircleHelp;
  return <Icon size={size} {...props} />;
}
