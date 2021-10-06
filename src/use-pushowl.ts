import { useEffect } from 'react'
import { useCartState } from 'frontend-checkout'
import { useCustomerState } from 'frontend-customer'
import { StorePlatformDomain, Pushowl } from './types'

export const usePushowl = (subdomain: string) => {
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

        injectScript(subdomain)
    }, [subdomain])

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

    const showWidget = (payload: any) => {
        return window.pushowl.trigger('showWidget', payload)
    }

    return {
        showWidget,
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
