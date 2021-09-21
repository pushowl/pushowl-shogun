<!--
  Template guidance: Please follow this template's general format, but feel free to add sections as needed, or remove sections that are irrelevant for this integration. Any images need to be stored in a third party source (e.g. an S3 bucket or Loom), not in this package, so they can be served on both GitHub and npm.
-->

# Name of integration

<!-- ^ Replace with name of integration. E.g. BigCommerce Reviews -->

… integration for Shogun Frontend.

<!-- ^ One line description for package for npm -->

<!-- Enter a 1-2 sentence description of what the third-party application or this integration is for. (e.g. Enable users to submit product reviews to your BigCommerce store.) -->

<table>
  <tbody>
    <tr>
      <td>⚠️</td>
      <td>This package runs on Shogun Frontend and is in customer Beta. It might not currently support all ecommerce platforms or cover all use cases.</td>
    </tr>
  </tbody>
</table>

<!-- ^ required notice -->

[Official website →](https://<enter-url-here>)

<!-- ^ e.g. [BigCommerce website →](https://www.bigcommerce.com/) -->

## Overview

<!--
  (optional) Enter a general introduction or other background information.
-->

## Installation

`yarn add @frontend-sdk/<enter-package-name>`

`npm install @frontend-sdk/<enter-package-name>`

## Functionality 1

<!-- ^ Replace with the name of one piece of functionality of this integration. E.g. Submit a new review -->

### Usage

<!--
  Enter step by step description of how to set up and use this functionality.

  E.g.
  Call `useBigCommerceReviews()` with a, b, c ....
  Create your own product review form, and in its submission handler call `submitReview()` with x, y, z ....
-->

#### Example

<!--
  Enter basic example code that will work as-is if the user copies and pastes it into their own implementation.

e.g.
```jsx
import { useBigCommerceReviews } from '@frontend-sdk/bigcommerce-reviews'

const SubmitReviewPage = () => {
  const { submissionStatus, submitReview } = useBigCommerceReviews(<enter site ID here>)
  const handleChange = (event) => {...}
  const handleSubmit = (event) => {...}

  return (
    <div>
      <form onSubmit={handleSubmit}/>
      <div>
        Submission status: {submissionStatus}
      </div>
    </div>
  )
}
```
 -->

#### How to find required values

<!-- ^ Rename with whatever the user needs to find to make this piece of functionality work. E.g. site ID -->

<!-- Enter brief concrete instructions on where to find required values. Include precise links and examples of the data they're looking for.

E.g.
You can find your site ID in Shogun Frontend. Log into https://frontend.getshogun.com/ and locate your site ID in the resulting URL. In this example, `https://frontend.getshogun.com/a1b2c3a1b2c3-a1b2c3a1b2c3-a1b2c3a1b2c3/pages` the site ID is `a1b2c3a1b2c3-a1b2c3a1b2c3-a1b2c3a1b2c3`.
-->

### Other information 1

<!-- ^ Rename/remove as appropriate. E.g. Validation performed by third-party integration. Link to third-party documentation. Limitations. Recommendations. -->
<!-- (optional) Enter information -->

### Other information 2

<!-- ^ Rename/remove as appropriate. E.g. Validation performed by third-party integration. Link to third-party documentation. Limitations. Recommendations. -->
<!-- (optional) Enter information -->

## Functionality 2

<!-- ^ Replace with the name of one piece of functionality of this integration. E.g. Show reviews. -->

<!-- ... See Functionality 1 template above -->

## Development

### Setting up .env

<!-- ^ Remove if this package doesn't require any .env variables -->

Create a new file `/.env` in the repo root with the following content:

```dotenv
SITE_ID= // Insert Shogun Frontend site ID here
STORE_DOMAIN= // Insert store domain here. E.g. myfancywidgets.com
```
