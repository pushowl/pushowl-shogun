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

<!--
  (optional) Enter a general introduction or other background information.
-->

## Installation

`yarn add @frontend-sdk/pushowl`

`npm install @frontend-sdk/pushowl`

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
