# PushOwl

PushOwl integration for Shogun Frontend.

<table>
  <tbody>
    <tr>
      <td>⚠️</td>
      <td>This package runs on Shogun Frontend and is in customer Beta. It might not currently support all ecommerce platforms or cover all use cases.</td>
    </tr>
  </tbody>
</table>

[PushOwl →](https://pushowl.com/)

## Overview

This package allows you to send push notification for shogun store with shopify backend

## Installation

`yarn add @pushowl/shogun-frontend-sdk`

`npm install @pushowl/shogun-frontend-sdk`

## Initialzing the hook

```tsx
import { usePushowl } from "@pushowl/shogun-frontend-sdk";

const App = () => {
  // Initialize pushowl
  const { hasLoaded } = usePushowl("your-shopify-subdomain");
};
```

#### Abandoned Cart Recovery automation (Optional, if enabled)

Abandoned Cart, if available on your PushOwl plan, works out of the box through this module for most parts. There is just configuration change required on PushOwl Side. Abandoned Cart push notifications open the cart page of your store. For stores with custom frontends, it becomes difficult to figure out the cart URL automatically. Hence, you need to explicitly enter your cart URL from PushOwl dashboard.

If you have implemented a custom cart page in your store, use that page's URL as cart URL. Otherwise, you can use the following URL as your cart page: `https://<website_domain>?showCart=true`

Here is how to update your cart URL in PushOwl dashboard:

1. Login to PushOwl dashboard -> https://dashboard.pushowl.com/shopify-login
2. Go to Abandoned Cart settings though Automations > Abandoned Carts or directly visit https://dashboard.pushowl.com/automation/abandoned-cart-recovery
3. Edit each of the active notification you see and change all instances of cart URLs in them to your actual cart URL (as discussed above).
   ![changing cart urls](/assets/cart-url-change.png)
4. Save and you are done!

### Browse Abandonment (Optional, if enabled)

[Browse abandonment](https://docs.pushowl.com/en/articles/3821822-browse-abandonment)

Your product URLs defined in the Shopify admin should still work (as it is or with redirection). This is because on clicking Browse Abandonment notifications, users are taken to the product URL defined in the Shopify admin.

ℹ️ **IMPORTANT INFORMATION**: In case you are still using your default Shopify store frontend for checkout purposes, you need to check the store URL registered on PushOwl. The store URL is what these automations use to build a product URL to send in the push notifications. You can check your registered store URL by visiting - [dashboard.pushowl.com/settings](https://dashboard.pushowl.com/settings). Like so:

![store url](/assets/store-url.png)

If the store URL you see above is not the right store URL where products are available, then the automation settings need to be adjusted for that. Currently, this can only be adjusted through us. So if this is the case, please let us know on [support@pushowl.com](support@pushowl.com) and we'll adjust the URLs.

You need to enable `externalId` and `storefrontId` for product and variants in your `ProductBox` section and then call the following effect in your code

```js
React.useEffect(() => {
  if (hasLoaded && product) {
    window.pushowl.trigger("syncProductView", { productId: product.id });
  }
}, [product]);
```

### Price Drop, Back in Stock automations (Optional, if enabled)

In your `ProductBox` section you can call the following effect

```js
React.useEffect(() => {
  if (product && hasLoaded) {
    async function showProductWidget() {
      // converting variant id from base64 to number
      const variantId = parseInt(
        atob(product.variants[0].storefrontId).split("/").pop(),
        10
      );
      const availableForSale = await isProductAvailableForSale({
        id: variantId,
        type: "ProductVariant",
      });

      if (availableForSale) {
        window.pushowl.trigger("showWidget", {
          type: "priceDrop",
          product: {
            id: product.id,
            title: product.name,
          },
          variant: {
            id: variantId,
            title: product.variants[0].name,
            price: product.variants[0].price,
          },
        });
      } else {
        window.pushowl.trigger("showWidget", {
          type: "backInStock",
          product: {
            id: product.id,
            title: product.name,
          },
          variant: {
            id: variantId,
            title: product.variants[0].name,
            price: product.variants[0].price,
          },
        });
      }
    }

    showProductWidget();
  }
}, []);
```

## API

- There is a global object available called `pushowl` which can be accessed through `window.pushowl`.
- The API works by triggering appropriate **"actions"**. An action can be triggered like so: `window.pushowl.trigger(<action_name>, <options>)`. Eg. An action named "X" can be triggered through `window.pushowl.trigger("X")`

Available API actions:

### `showWidget`

**Options available**

- `type`: Type of widget to show. `browserPrompt`|`customPrompt`|`backInStock`|`priceDrop`

For `customPrompt`, following extra options are available:

- `title`: Title for the prompt
- `description`: Description for the prompt
- `yesButton`: "yes" button refers to the positive/allow button in the prompt. This is an object with `label` property.
- `noButton`: "no" button refers to the negative/deny button in the prompt. This is an object with `label` property.
- `logo` _(optional)_: URL of the image to show as logo. Defaults to a bell if nothing is passed.
- `position` _(optional)_: Needs to be specified for desktop and mobile separately like so `position: {default: 'top-left', mobile: 'top'}`. Available options for desktop(default): `top-left`, `top-center`, `top-right`, `bottom-left`, `bottom-center`, `bottom-right`. Available options for mobile: `top`, `bottom`. Default is `{ default: 'top-center', mobile: 'top' }`
- `overlay` _(optional)_: Controls the overlay that shows with the native permission prompt. Only accepts one property for now: `enabled: true|false`. Eg. `overlay: { enabled: false }`
- `theme` _(optional)_: Allows changing various colors in the prompt. Currently supported properties are: `theme: { yesButtonBgColor: '#f00', yesButtonColor: '#fff' }`

For `priceDrop` and `backInStock`

- `product`: Product to which user subscribed price drop / back in stock notification. `product` requires the following keys
  - `id`: It of the product as number
  - `title`: Title of the product
- `variant`: Selected variant of the above product which user subscribed to. `variant` requires the following keys
  - `id`: It of the variant as number
  - `title`: Title of the variant
  - `price`: Price of the current variant as float

### `syncCart`

Cart syncing is auto-enabled in this module. This API gets called automatically whenever the cart is updated.

## Recipes

### To show a native browser prompt

```javascript
window.pushowl.trigger("getCurrentPermission").then((permission) => {
  if (permission === "default") {
    window.pushowl
      .trigger("showWidget", {
        type: "browserPrompt",
      })
      .then((res) => {
        // Do anything you want to after showing prompt
      });
  }
});
```

Note, always check the current permission value before showing the prompt. `default` value means user has neither allowed nor denied.

### To show a Custom Prompt

```javascript
window.pushowl.trigger("getCurrentPermission").then((permission) => {
  if (permission === "default") {
    window.pushowl
      .trigger("showWidget", {
        type: "customPrompt",
        title: "Lets get you offers!",
        description: "Subscribe to get amazing offers",
        yesButton: { label: "Subscribe" },
        noButton: { label: "Later" },
        logo: "image url here",
        position: { default: "top-left", mobile: "bottom" },
        overlay: { enabled: false },
      })
      .then((res) => {
        // Do anything you want to after showing prompt
      });
  }
});
```
