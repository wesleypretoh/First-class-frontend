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
}

export type BaseDictionary = {
  languageNames: Record<Locale, string>
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
  }
  settings: SettingsDictionary
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
    defaultPlan: string
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
