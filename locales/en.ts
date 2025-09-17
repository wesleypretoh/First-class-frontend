import type { BaseDictionary } from "@/lib/i18n/get-dictionary";

const dictionary: BaseDictionary = {
  languageNames: {
    en: "English",
    th: "ไทย",
  },
  navigation: {
    platformLabel: "Platform",
    workspace: {
      title: "Workspace",
      items: [
        { title: "Overview", path: "dashboard" },
        { title: "Projects", path: "dashboard/projects" },
        { title: "Tasks", path: "dashboard/tasks" },
        { title: "Team", path: "dashboard/team" },
      ],
    },
    insights: {
      title: "Insights",
      items: [
        { title: "Reports", path: "dashboard/reports" },
        { title: "Analytics", path: "dashboard/analytics" },
        { title: "Revenue", path: "dashboard/revenue" },
      ],
    },
    management: {
      title: "Management",
      items: [
        { title: "Settings", path: "dashboard/settings" },
        { title: "Billing", path: "dashboard/billing" },
        { title: "Notifications", path: "dashboard/notifications" },
        { title: "Integrations", path: "dashboard/integrations" },
      ],
    },
    quickLinksLabel: "Quick Links",
    quickLinks: [
      { name: "Documentation", url: "https://nextjs.org/docs" },
      { name: "Help Center", url: "https://nextjs.org/learn" },
      { name: "Pricing", url: "https://nextjs.org/pricing" },
      { name: "Partners", url: "https://nextjs.org/partners" },
      { name: "Release Notes", url: "https://nextjs.org/blog" },
    ],
  },
  settings: {
    breadcrumb: {
      home: "Home",
      dashboard: "Dashboard",
      settings: "Settings",
    },
    pageTitle: "Theme preferences",
    pageDescription:
      "Pick your preferred appearance and accent palette. Changes take effect immediately.",
    appearance: {
      title: "Appearance mode",
      description:
        "Switch between system, light, or dark mode across the dashboard.",
    },
    colorTheme: {
      title: "Color theme",
      description: "Choose the accent palette that best fits your brand.",
    },
    language: {
      title: "Language",
      description: "Preview how the dashboard could look in English or Thai.",
    },
  },
  dashboard: {
    breadcrumb: {
      home: "Home",
      dashboard: "Dashboard",
    },
  },
  navProjects: {
    moreLabel: "More",
    viewProject: "View Project",
    shareProject: "Share Project",
    deleteProject: "Delete Project",
  },
  navUser: {
    upgrade: "Upgrade to Pro",
    settings: "Settings",
    notifications: "Notifications",
    billing: "Billing",
    logout: "Log out",
  },
  teamSwitcher: {
    heading: "Teams",
    addTeam: "Add team",
    defaultTeamName: "Team",
    defaultPlan: "Starter",
  },
  auth: {
    login: {
      title: "Login to your account",
      description: "Enter your email below to access the dashboard.",
      emailLabel: "Email",
      passwordLabel: "Password",
      forgotPassword: "Forgot your password?",
      submit: "Sign in",
      google: "Continue with Google",
      ctaPrompt: "Don't have an account?",
      ctaAction: "Sign up",
      error: "Unable to sign in. Please try again.",
    },
    register: {
      title: "Create an account",
      description: "Complete the form below to create your account.",
      nameLabel: "Name",
      emailLabel: "Email",
      passwordLabel: "Password",
      submit: "Sign up",
      ctaPrompt: "Already registered?",
      ctaAction: "Sign in",
    },
  },
};

export default dictionary;
