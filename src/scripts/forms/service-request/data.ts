import {
  Globe,
  Palette,
  Settings,
  ShoppingCart,
  TrendingUp,
  Wrench
} from "@lucide/astro";

const SERVICES = [
  {
    label: "Website Design & Development",
    value: "website-design-development",
    description: "Custom websites built for performance and conversions.",
    icon: Globe,
  },
  {
    label: "SEO & Analytics",
    value: "seo-analytics",
    description: "Get found online and track your success.",
    icon: TrendingUp,
  },
  {
    label: "Brand & Logo Design",
    value: "brand-logo-design",
    description: "Create a memorable brand identiy.",
    icon: Palette,
  },
  {
    label: "E-Commerce Solutions",
    value: "ecommerce-solutions",
    description: "Sell your products online with secure, user-friendly stores.",
    icon: ShoppingCart,
  },
  {
    label: "Business Systems Setup",
    value: "business-systems-setup",
    description:
      "CRM, project management, accounting, and workflow automation.",
    icon: Settings,
  },
  {
    label: "Website Updates & Add-Ons",
    value: "website-updates-add-ons",
    description: "Ongoing updates, additional pages or new features.",
    icon: Wrench,
  },
];

const SERVICE_ADDONS = [
  {
    'website-design-development': [
      { id: 'managed-hosting', name: 'Managed Hosting', description: '' }
    ]
  }
]