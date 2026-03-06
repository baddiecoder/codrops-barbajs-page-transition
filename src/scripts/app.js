import gsap from "gsap";
import barba from "@barba/core";
import Scroll from "./lib/scroll";
import WebGLPageTransition from "./module/webgl-page-transition";
import DrawSVGPlugin from "gsap/DrawSVGPlugin";
import Header from "./module/header";

class App {
  constructor() {
    this.scroll = new Scroll();
    this.scroll.init();

    this.animationConfig = {
      duration: 1.5,
      ease: "power1.inOut",
    };

    this.header = new Header();

    this.webglPageTransition = new WebGLPageTransition();

    barba.init({
      debug: true,
      transitions: [
        {
          name: "default-transition",
          before: () => {
            this.scroll.stop();
          },
          leave: () => {
            const tl = gsap.timeline({
              defaults: {
                ...this.animationConfig,
              },
            });

            gsap.set(this.webglPageTransition.wrapper, {
              pointerEvents: "auto",
              autoAlpha: 1,
            });

            tl.to(this.webglPageTransition.mesh.material.uniforms.uProgress, {
              value: -0.15,
            });

            return new Promise((resolve) => {
              tl.call(() => {
                this.scroll.destroy();
                resolve();
              });
            });
          },
          after: (data) => {
            const nextPath = data.next.url.path;

            this.scroll.init();
            this.scroll.scrollTop();

            if (typeof data.trigger === "string") {
              this.header.setRouteTransition(nextPath);
            } else {
              if (
                data.trigger.classList.contains("navigation__example__link")
              ) {
                this.header.setRouteTransition(nextPath);
              }
            }

            const tl = gsap.timeline({
              defaults: {
                ...this.animationConfig,
              },
            });

            tl.to(this.webglPageTransition.mesh.material.uniforms.uProgress, {
              value: 2.1,
            });

            return new Promise((resolve) => {
              tl.call(() => {
                gsap.set(this.webglPageTransition.wrapper, {
                  pointerEvents: "none",
                  autoAlpha: 0,
                });
                resolve();
              });
            });
          },
        },
        {
          name: "svg-transition",
          from: {
            namespace: ["home__svg", "about__svg"],
          },
          to: {
            namespace: ["home__svg", "about__svg"],
          },
          before: () => {
            this.scroll.stop();
          },
          leave: () => {
            const tl = gsap.timeline({
              defaults: {
                ...this.animationConfig,
              },
            });

            gsap.set(".transition__svg__wrapper", {
              autoAlpha: 1,
              pointerEvents: "all",
            });

            gsap.set(".svg__transition svg path", {
              drawSVG: "0% 0%",
              strokeWidth: 200,
            });

            tl.to(".svg__transition svg path", {
              drawSVG: "0% 100%",
            });

            tl.to(
              ".svg__transition svg path",
              {
                strokeWidth: 900,
              },
              "<+=0.25",
            );

            return new Promise((resolve) =>
              tl.call(() => {
                this.scroll.destroy();
                resolve();
              }),
            );
          },
          after: (data) => {
            this.scroll.init();
            this.scroll.scrollTop();

            if (typeof data.trigger === "string") {
              this.header.setRouteTransition(nextPath);
            } else {
              if (
                data.trigger.classList.contains("navigation__example__link")
              ) {
                this.header.setRouteTransition(nextPath);
              }
            }

            const tl = gsap.timeline({
              defaults: {
                ...this.animationConfig,
              },
            });

            tl.to(".svg__transition svg path", {
              strokeWidth: 200,
            });

            tl.to(
              ".svg__transition svg path",
              {
                drawSVG: "100% 100%",
              },
              "<+=0.45",
            );

            return new Promise((resolve) =>
              tl.call(() => {
                resolve();
                gsap.set(".transition__svg__wrapper", {
                  autoAlpha: 0,
                  pointerEvents: "none",
                });

                gsap.set(".svg__transition svg path", {
                  drawSVG: "0% 0%",
                  strokeWidth: 200,
                });
              }),
            );
          },
        },
      ],
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  window.scrollTo({
    top: 0,
    behavior: "instant",
  });

  gsap.registerPlugin(DrawSVGPlugin);

  new App();
});
