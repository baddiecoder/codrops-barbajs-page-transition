import { selectAll } from "../utils";

class Header {
  setRouteTransition(example) {
    const links = selectAll(".nav__link");
    links.forEach((link) => {
      const baseRoute = link.dataset.route;
      link.href =
        example === "/" || example === "/about"
          ? baseRoute
          : `${example}${baseRoute}`;
      link.dataset.transitionExample =
        example === "/" || example === "/about"
          ? "webgl"
          : example.replace("/", "");
    });
  }
}

export default Header;
