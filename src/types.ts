export type StorePlatformDomain = string

export type CustomPromptConfig = {
    title: string
    description?: string
    yesButton?: { label: string }
    noButton?: { label: string }
    logo?: string
    position?: { default: string; mobile: string }
    overlay?: { enabled: boolean }
}
