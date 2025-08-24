export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Mindex",
  description: "Convert web pages, documents, and videos into beautiful mind maps with AI assistance.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Maps",
      href: "/maps",
    },
    {
      label: "Import",
      href: "/import",
    },
    {
      label: "Settings",
      href: "/settings",
    },
  ],
  navMenuItems: [
    {
      label: "My Maps",
      href: "/maps",
    },
    {
      label: "Import Content",
      href: "/import",
    },
    {
      label: "Settings",
      href: "/settings",
    },
    {
      label: "Help & Feedback",
      href: "/help-feedback",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ],
  links: {
    github: "https://github.com/your-username/mindex",
    twitter: "https://twitter.com/mindex_ai",
    docs: "https://docs.mindex.app",
    discord: "https://discord.gg/mindex",
    sponsor: "https://github.com/sponsors/mindex",
  },
};
