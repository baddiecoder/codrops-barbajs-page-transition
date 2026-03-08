import { selectAll } from "../utils";

class Header {
  setRouteTransition(example) {
    const links = selectAll(".nav__link");
    links.forEach((link) => {
      const baseRoute = link.dataset.route;
      link.href =
        example === "/" || example === "/fauna"
          ? baseRoute
          : `${example}${baseRoute}`;
      link.dataset.transitionExample =
        example === "/" || example === "/fauna"
          ? "example__1"
          : example.replace("/", "");
    });
  }
}

export default Header;
