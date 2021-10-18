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
            const decodedCustomerId = atob(`${customerId}`).split('/').pop()
            if (decodedCustomerId !== undefined) {
                window.pushowl.trigger('setCustomerId', parseInt(decodedCustomerId))
            }
        }
    }, [customerId, canSync])

    // sync cart when its items change
    useEffect(() => {
        if (cartId !== null && canSync) {
            const items = cartItems.map((item) => {
                const productWithCheckout = atob(item.id).split('/').pop()

                let productId = null

                if (productWithCheckout !== undefined && productWithCheckout.length > 0) {
                    productId = parseInt(productWithCheckout.split('?checkout=')[0], 10)
                }

                // eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                const variantIdStr = atob(item.variant.id).split('/').pop()
                let variantId = null

                if (variantIdStr !== undefined) {
                    variantId = parseInt(variantIdStr, 10)
                }

                return {
                    variantId,
                    productId,
                    quantity: item.quantity,
                }
            })

            let checkoutToken = null
            const checkoutTokenWithKey = atob(cartId).split('/').pop()

            if (checkoutTokenWithKey !== undefined) {
                checkoutToken = checkoutTokenWithKey.split('?key=')[0]
            }

            window.pushowl.trigger('syncCart', {
                items,
                checkoutToken,
            })
        }
    }, [canSync, cartId, cartItems])

    return {
        hasLoaded,
    }
}
