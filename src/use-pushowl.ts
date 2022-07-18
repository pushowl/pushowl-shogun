import { useEffect, useState } from "react";
import { StorePlatformDomain, Pushowl } from "./types";

const isRecord = (value: unknown): value is Record<PropertyKey, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const getVariantIdFromItem = (item: any): string => {
  // eslint-disable-next-line no-prototype-builtins
  if (
    isRecord(item) &&
    isRecord(item.variant) &&
    item.variant.hasOwnProperty("id")
  ) {
    return `${item.variant.id}`;
  }

  // eslint-disable-next-line no-prototype-builtins
  if (isRecord(item) && item.hasOwnProperty("variant_id")) {
    return `${item.variant_id}`;
  }

  return "";
};

export const processCart = (taskInput: {
  cartId: string;
  cartItems: Array<any>;
}) => {
  const { cartItems, cartId } = taskInput;

  const items = cartItems.map((item) => {
    const productWithCheckout = atob(item.id).split("/").pop();

    let productId = null;

    if (productWithCheckout !== undefined && productWithCheckout.length > 0) {
      productId = parseInt(productWithCheckout.split("?checkout=")[0], 10);
    }

    const variantIdStr = atob(getVariantIdFromItem(item)).split("/").pop();
    let variantId = null;

    if (variantIdStr !== undefined) {
      variantId = parseInt(variantIdStr, 10);
    }

    return {
      variantId,
      productId,
      quantity: item.quantity,
    };
  });

  let checkoutToken = null;
  const checkoutTokenWithKey = atob(cartId).split("/").pop();

  if (checkoutTokenWithKey !== undefined) {
    checkoutToken = checkoutTokenWithKey.split("?key=")[0];
  }

  return {
    items,
    checkoutToken,
  };
};

export const processCustomerId = (taskInput: { customerId: string }) => {
  const { customerId } = taskInput;
  const decodedCustomerId = atob(`${customerId}`).split("/").pop();
  if (decodedCustomerId !== undefined) {
    return parseInt(decodedCustomerId);
  }
  return null;
};

export const usePushowl = (subdomain: string) => {
  const [hasLoaded, setHasLoaded] = useState(false);

  // Injecting pushowl script to the store
  useEffect(() => {
    if (document.querySelector('[data-script="pushowl"]')) {
      setHasLoaded(true);
      return;
    }

    const injectScript = (subdomain: StorePlatformDomain | null) => {
      if (!window.pushowl) {
        const pushowl: Pushowl = {
          queue: [],
          subdomain,
          trigger: (
            taskName: string,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            taskData: any
          ) => {
            return new Promise((resolve, reject) => {
              window.pushowl.queue.push({
                taskName,
                taskData,
                promise: { resolve, reject },
              });
            });
          },
          init: () => {
            if (subdomain === null) {
              return;
            }

            const script = document.createElement("script");
            script.type = "text/javascript";
            script.async = true;
            script.src = `https://cdn.pushowl.com/sdks/pushowl-sdk.js?subdomain=${subdomain}&environment=production&shop=${subdomain}.myshopify.com`;
            script.dataset.script = "pushowl";
            document.body.append(script);
            script.addEventListener("load", () => {
              setHasLoaded(true);
            });

            return script;
          },
        };

        window.pushowl = pushowl;
      }

      window.pushowl.init();
    };

    injectScript(subdomain);
  }, [subdomain, hasLoaded]);

  return {
    hasLoaded,
  };
};
