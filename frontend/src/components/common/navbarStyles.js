/**
 * Reusable Tailwind class strings for navbar and store-wide UI consistency
 */

export const navbarContainer = 'fixed top-0 w-full z-50 bg-[#fcf9f8]/80 dark:bg-[#1c1b1b]/80 backdrop-blur-md';

export const navLinkBase = "font-['Manrope'] tracking-tight transition-colors";

export const navLinkDefault = `text-[#56423d] dark:text-[#dcc1ba] hover:text-[#994127] ${navLinkBase}`;

export const navLinkActive = `text-[#994127] font-semibold border-b-2 border-[#994127] pb-1 ${navLinkBase}`;

export const cartBadge = 'absolute -top-1 -right-1 bg-primary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full';

export const logoText = 'text-2xl font-bold tracking-tighter text-[#1c1b1b] dark:text-[#fcf9f8]';

export const iconButton = 'hover:opacity-80 transition-opacity duration-300';
