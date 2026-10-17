import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PortfolioImage } from "./PortfolioImage";

describe("portfolio image rendering", () => {
  it("renders a cropped brochure photograph without incompatible fill and width props", () => {
    const markup = renderToStaticMarkup(createElement(PortfolioImage, {
      image: { image_url: "/brochure/maestro-medical-centre.jpg", alt_text: "Reception", caption: "", is_cover: true, display_order: 0,
        crop: { left: .049, top: .608, width: .416, height: .359, aspect: 1446 / 1915 } },
      sizes: "44vw",
    }));
    expect(markup).toContain('alt="Reception"');
    expect(markup).toContain('height="1000"');
    expect(markup).not.toContain('data-nimg="fill"');
  });
});
