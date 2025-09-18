import type { BaseDictionary } from "@/lib/i18n/get-dictionary";

const dictionary: BaseDictionary = {
  languageNames: {
    en: "English",
    th: "ไทย",
  },
  appName: "First-Class",
  pageTitles: {
    home: "Home",
    login: "Login",
    signup: "Signup",
    dashboard: "Dashboard",
    settings: "Settings",
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
    adminConsole: {
      title: "Admin Console",
      items: [
        { title: "Overview", path: "dashboard/admin" },
        { title: "Users Management", path: "dashboard/admin/users" },
      ],
    },
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
  admin: {
    breadcrumb: {
      home: "Home",
      dashboard: "Dashboard",
      admin: "Admin Console",
      users: "Users",
    },
    pageTitle: "Admin console",
    pageDescription:
      "High-level controls for user roles, permissions, and operational tasks.",
    sections: {
      overview:
        "Use this space to coordinate administrator-only workflows and review key metrics before broadcasting changes.",
      management:
        "Extend this page with cards, tables, or integrations required to manage your organization at scale.",
    },
    quickLinkLabel: "Admin Console",
    usersPage: {
      title: "Users management",
      description:
        "Review account details, adjust roles, and audit activity across your workspace.",
      searchPlaceholder: "Search by name or email...",
      roleFilterLabel: "Role",
      roleFilterAll: "All roles",
      table: {
        columns: {
          name: "Name",
          email: "Email",
          role: "Role",
          createdAt: "Joined",
        },
        empty: "No users match your filters.",
        noName: "Unnamed",
        previous: "Previous",
        next: "Next",
        actions: "Actions",
      },
      actions: {
        label: "Actions",
        changeRole: "Change role",
        delete: "Delete user",
      },
      roleDialog: {
        title: "Update role",
        description:
          "Select a new role for this user. Changes take effect immediately.",
        selectLabel: "Role",
        submit: "Save changes",
        cancel: "Cancel",
        success: "Role updated successfully.",
        error: "Unable to update the role right now.",
      },
      deleteDialog: {
        title: "Delete user",
        description:
          "This action permanently removes the account and cannot be undone.",
        confirm: "Delete user",
        cancel: "Cancel",
        success: "User deleted successfully.",
        error: "Unable to delete the user right now.",
      },
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
  },
  userRoles: {
    ADMIN: "Admin",
    STAFF: "Operation",
    USER: "Member",
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
