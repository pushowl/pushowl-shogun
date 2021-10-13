import { useEffect, useState } from 'react'
import { useCartState } from 'frontend-checkout'
import { useCustomerState } from 'frontend-customer'
import { StorePlatformDomain, Pushowl } from './types'

export const usePushowl = (subdomain: string) => {
    const cart = useCartState()
    const [hasLoaded, setHasLoaded] = useState(false)
    const [canSync, setCanSync] = useState(false)
    const { id: customerId } = useCustomerState()
    const cartId = cart.id

    const cartItems = cart.items

    // Injecting pushowl script to the store
    useEffect(() => {
        if (document.querySelector('[data-script="pushowl"]')) {
            setHasLoaded(true)
            return
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
                        script.addEventListener('load', () => {
                            setHasLoaded(true)
                            setCanSync(true)
                        })

                        return script
                    },
                }

                window.pushowl = pushowl
            }

            window.pushowl.init()
        }

        injectScript(subdomain)
    }, [subdomain, setCanSync])

    // Syncing customer id
    useEffect(() => {
        if (customerId !== null && canSync) {
            const decodedCustomerId = parseInt(atob(`${customerId}`).split('/').pop() || '', 10)
            window.pushowl.trigger('setCustomerId', decodedCustomerId)
        }
    }, [customerId, canSync])

    // sync cart when its items change
    useEffect(() => {
        if (cartId !== null && canSync) {
            const items = cartItems.map((item) => ({
                variantId: atob(item.variant.id).split('/').pop(),
                productId: atob(item.id).split('/').pop().split('?checkout=')[0],
                quantity: item.quantity,
            }))

            window.pushowl.trigger('syncCart', {
                items,
                checkoutToken: atob(cartId).split('/').pop().split('?key=')[0],
            })
        }
    }, [canSync, cartId, cartItems])

    return {
        hasLoaded,
    }
}
