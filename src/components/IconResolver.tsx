import {
  ShoppingCartIcon,
  HomeIcon,
  BoltIcon,
  BookOpenIcon,
  HeartIcon,
  FilmIcon,
  TruckIcon,
  BriefcaseIcon,
  ArrowTrendingUpIcon,
  GiftIcon,
  CreditCardIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  WifiIcon,
  CubeIcon
} from '@heroicons/react/24/outline';

export function CategoryIcon({ category, className }: { category: string, className?: string }) {
  switch (category) {
    case 'Salary': return <CurrencyDollarIcon className={className || "w-5 h-5"} />;
    case 'Freelance': return <BriefcaseIcon className={className || "w-5 h-5"} />;
    case 'Investment': return <ArrowTrendingUpIcon className={className || "w-5 h-5"} />;
    case 'Food & Dining': return <ShoppingCartIcon className={className || "w-5 h-5"} />;
    case 'Shopping': return <CreditCardIcon className={className || "w-5 h-5"} />;
    case 'Transportation': return <TruckIcon className={className || "w-5 h-5"} />;
    case 'Entertainment': return <FilmIcon className={className || "w-5 h-5"} />;
    case 'Healthcare': return <HeartIcon className={className || "w-5 h-5"} />;
    case 'Education': return <BookOpenIcon className={className || "w-5 h-5"} />;
    case 'Utilities': return <BoltIcon className={className || "w-5 h-5"} />;
    case 'Rent': return <HomeIcon className={className || "w-5 h-5"} />;
    case 'Travel': return <BuildingOfficeIcon className={className || "w-5 h-5"} />;
    case 'Subscriptions': return <WifiIcon className={className || "w-5 h-5"} />;
    case 'Gifts': return <GiftIcon className={className || "w-5 h-5"} />;
    default: return <CubeIcon className={className || "w-5 h-5"} />;
  }
}
