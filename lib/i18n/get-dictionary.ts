import "server-only"

import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type Locale } from "./config"

const dictionaries: Record<Locale, () => Promise<BaseDictionary>> = {
  en: () => import("@/locales/en").then((module) => module.default),
  th: () => import("@/locales/th").then((module) => module.default),
}

export type SettingsDictionary = {
  breadcrumb: {
    home: string
    dashboard: string
    settings: string
  }
  pageTitle: string
  pageDescription: string
  appearance: {
    title: string
    description: string
  }
  colorTheme: {
    title: string
    description: string
  }
  language: {
    title: string
    description: string
  }
  notifications: {
    themeUpdated: string
    themeUpdateError: string
    colorThemeUpdated: string
    colorThemeUpdateError: string
    languageUpdated: string
    languageUpdateError: string
  }
}

export type BaseDictionary = {
  languageNames: Record<Locale, string>
  appName: string
  pageTitles: {
    home: string
    login: string
    signup: string
    dashboard: string
    settings: string
  }
  navigation: {
    platformLabel: string
    workspace: {
      title: string
      items: {
        title: string
        path: string
      }[]
    }
    insights: {
      title: string
      items: {
        title: string
        path: string
      }[]
    }
    management: {
      title: string
      items: {
        title: string
        path: string
      }[]
    }
    quickLinksLabel: string
    quickLinks: {
      name: string
      url: string
    }[]
    adminConsole: {
      title: string
      items: {
        title: string
        path: string
      }[]
    }
  }
  settings: SettingsDictionary
  admin: {
    breadcrumb: {
      home: string
      dashboard: string
      admin: string
      users: string
    }
    pageTitle: string
    pageDescription: string
    sections: {
      overview: string
      management: string
    }
    quickLinkLabel: string
    usersPage: {
      title: string
      description: string
      searchPlaceholder: string
      roleFilterLabel: string
      roleFilterAll: string
      table: {
        columns: {
          name: string
          email: string
          role: string
          lastLogin: string
          createdAt: string
        }
        empty: string
        noName: string
        neverLoggedIn: string
        previous: string
        next: string
        actions: string
      }
      actions: {
        label: string
        deviceInfo: string
        changeRole: string
        delete: string
      }
      roleDialog: {
        title: string
        description: string
        selectLabel: string
        submit: string
        cancel: string
        success: string
        error: string
      }
      deviceDialog: {
        title: string
        description: string
        empty: string
        close: string
        notAvailable: string
        fields: {
          lastLoginAt: string
          deviceType: string
          os: string
          browser: string
          ip: string
          country: string
          region: string
          city: string
          userAgent: string
        }
      }
      deleteDialog: {
        title: string
        description: string
        confirm: string
        cancel: string
        success: string
        error: string
      }
    }
  }
  dashboard: {
    breadcrumb: {
      home: string
      dashboard: string
    }
  }
  navProjects: {
    moreLabel: string
    viewProject: string
    shareProject: string
    deleteProject: string
  }
  navUser: {
    upgrade: string
    settings: string
    notifications: string
    billing: string
    logout: string
  }
  teamSwitcher: {
    heading: string
    addTeam: string
    defaultTeamName: string
  }
  userRoles: {
    ADMIN: string
    STAFF: string
    USER: string
  }
  auth: {
    login: {
      title: string
      description: string
      emailLabel: string
      passwordLabel: string
      forgotPassword: string
      submit: string
      google: string
      ctaPrompt: string
      ctaAction: string
      error: string
    }
    register: {
      title: string
      description: string
      nameLabel: string
      emailLabel: string
      passwordLabel: string
      submit: string
      ctaPrompt: string
      ctaAction: string
    }
  }
}

export type Dictionary = BaseDictionary & {
  locale: Locale
}

export async function getDictionary(locale: string | undefined | null): Promise<Dictionary> {
  const normalized = SUPPORTED_LOCALES.includes((locale ?? "") as Locale)
    ? (locale as Locale)
    : DEFAULT_LOCALE

  const dictionary = await dictionaries[normalized]()
  return {
    ...dictionary,
    locale: normalized,
  }
}
