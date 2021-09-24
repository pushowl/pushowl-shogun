import { useEffect } from 'react'
import { useCartState } from 'frontend-checkout'
import { useCustomerState } from 'frontend-customer'
import { StorePlatformDomain, CustomPromptConfig, NotificationPermission, Product, Pushowl } from './types'

export const usePushowl = ({ storePlatformDomain = null }: { storePlatformDomain: StorePlatformDomain | null }) => {
    const cart = useCartState()
    const { id: customerId } = useCustomerState()

    // we do use window.location.href to check it is in the product page
    const isProductPage = /\/products/.exec(window.location.href)

    const cartItems = cart.items

    // Injecting pushowl script to the store
    useEffect(() => {
        if (document.querySelector('[data-script="pushowl"]')) {
            return
        }

        injectScript(storePlatformDomain)
    }, [storePlatformDomain])

    // Syncing customer id
    useEffect(() => {
        window.pushowl.trigger('setCustomerId', customerId)
    }, [customerId])

    // sync product when in product page
    useEffect(() => {
        window.pushowl.trigger('syncProductView', { productId: 89789578956 })
    }, [isProductPage])

    // sync cart when its items change
    useEffect(() => {
        window.pushowl.trigger('syncCart', {
            checkoutToken: '',
            items: cartItems,
        })
    }, [cartItems])

    const showBrowserPrompt = () => {
        window.pushowl.trigger('getCurrentPermission').then((permission: NotificationPermission) => {
            if (permission !== 'default') return
            window.pushowl.trigger('showWidget', { type: 'browserPrompt' })
        })
    }

    const showCustomPrompt = (config: CustomPromptConfig) => {
        window.pushowl.trigger('getCurrentPermission').then((permission: NotificationPermission) => {
            if (permission !== 'default') return
            window.pushowl.trigger('showWidget', {
                type: 'customPrompt',
                yesButton: { label: 'Subscribe' },
                noButton: { label: 'Later' },
                position: { default: 'top-left', mobile: 'bottom' },
                overlay: { enabled: false },
                ...config,
            })
        })
    }

    const showProdutFlyoutWidget = (product: Product) => {
        const variant = product.variant

        if (product.available) {
            window.pushowl.trigger('showWidget', {
                type: 'priceDrop',
                product: {
                    id: product.id,
                    title: product.title,
                },
                variant: {
                    id: variant.id,
                    title: variant.title,
                    price: variant.price,
                },
            })
        } else {
            window.pushowl.trigger('showWidget', {
                type: 'backInStock',
                product: {
                    id: product.id,
                    title: product.title,
                },
                variant: {
                    id: variant.id,
                    title: variant.title,
                    price: variant.price,
                },
            })
        }
    }

    return {
        showBrowserPrompt,
        showCustomPrompt,
        showProdutFlyoutWidget,
    }
}

const injectScript = (subdomain: StorePlatformDomain | null) => {
    if (!window.pushowl) {
        const pushowl: Pushowl = {
            queue: [],
            subdomain,
            trigger: (
                taskName: string,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                taskData: any,
            ) => {
                return new Promise((resolve, reject) => {
                    window.pushowl.queue.push({
                        taskName,
                        taskData,
                        promise: { resolve, reject },
                    })
                })
            },
            init: () => {
                if (subdomain === null) {
                    return
                }

                const script = document.createElement('script')
                script.type = 'text/javascript'
                script.async = true
                script.src = `https://cdn.pushowl.com/sdks/pushowl-sdk.js?subdomain=${subdomain}&environment=production&shop=${subdomain}.myshopify.com`
                document.body.append(script)
                return script
            },
        }

        window.pushowl = pushowl
    }

    window.pushowl.init()
}
