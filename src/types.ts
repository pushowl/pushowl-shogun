export type StorePlatformDomain = string

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
