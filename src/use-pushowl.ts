import { useEffect } from 'react'
import { useCartState } from 'frontend-checkout'
import { StorePlatformDomain, CustomPromptConfig } from './types'

declare global {
    interface Window {
        pushowl: {
            trigger: Function
            init: () => void
        }
    }
}

export const usePushowl = ({ storePlatformDomain }: { storePlatformDomain: StorePlatformDomain }) => {
    const cart = useCartState()
    const isProductPage = /\/products/.exec(window.location.href)

    const cartItems = cart.items

    // Injecting pushowl script to the store
    useEffect(() => {
        if (document.querySelector('[data-script="pushowl"]')) {
            return
        }

        injectScript(storePlatformDomain)
    }, [storePlatformDomain])

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
        window.pushowl.trigger('getCurrentPermission').then((permission: any) => {
            if (permission !== 'default') return
            window.pushowl.trigger('showWidget', { type: 'browserPrompt' })
        })
    }

    const showCustomPrompt = (config: CustomPromptConfig) => {
        window.pushowl.trigger('getCurrentPermission').then((permission: any) => {
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

    const showProdutFlyoutWidget = (product: any) => {
        const variant = product.variant

        if (product.isAvailableForSale) {
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

const injectScript = (subdomain: StorePlatformDomain) => {
    window.pushowl = window.pushowl || {
        queue: [],
        trigger: (taskName: string, taskData: Object) =>
            new Promise((resolve, reject) => {
                // @ts-ignore
                this.queue.push({
                    taskName,
                    taskData,
                    promise: { resolve, reject },
                })
            }),
        init: () => {
            if (!subdomain) {
                return
            }

            // @ts-ignore
            this.subdomain = subdomain
            var s = document.createElement('script')
            s.type = 'text/javascript'
            s.async = true
            s.src = `https://cdn.pushowl.com/sdks/pushowl-sdk.js?subdomain=${subdomain}&environment=production&shop=${subdomain}.myshopify.com`

            var x = document.getElementsByTagName('script')[0]
            if (x && x.parentNode) {
                x.parentNode.insertBefore(s, x)
            }
        },
    }
    window.pushowl.init()
}
