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

export type NotificationPermission = 'default' | 'granted' | 'denied'

export type Variant = {
    id: number
    title: string
    price: number
}

export type Product = {
    id: number
    title: string
    available: boolean
    variant: Variant
}

export type Pushowl = {
    queue: Array<{
        taskName: string
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        taskData: any
        promise: { resolve: Function; reject: Function }
    }>
    subdomain: string | null
    trigger: Function
    init: () => void
}

declare global {
    interface Window {
        pushowl: Pushowl
    }
}
