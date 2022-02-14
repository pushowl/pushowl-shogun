import React from "react";
import faker from "faker";
import { render } from "@testing-library/react";
import { usePushowl } from "./use-pushowl";
import { StorePlatformDomain } from "./types";

interface Props {
  subdomain: StorePlatformDomain;
}

const Test: React.FC<Props> = ({ subdomain }) => {
  usePushowl(subdomain);
  return null;
};

describe("Testing usePushOwl", () => {
  const subdomain1 = faker.internet.domainWord();
  const subdomain2 = faker.internet.domainWord();

  it("renders script", () => {
    render(<Test subdomain={subdomain1} />);
    expect(
      document.querySelector(`script[data-script="pushowl"]`)
    ).toBeDefined();
  });

  it("renders only one script and uses the first storePlatformDomain key", () => {
    render(
      <>
        <Test subdomain={subdomain1} />
        <Test subdomain={subdomain2} />
      </>
    );

    expect(
      document.querySelectorAll(`script[data-script="pushowl"]`)
    ).toHaveLength(1);

    expect(
      document.querySelectorAll(`script[src*="${subdomain1}"]`)
    ).toHaveLength(1);
    expect(
      document.querySelectorAll(`script[src*="${subdomain2}"]`)
    ).toHaveLength(0);
  });
});
