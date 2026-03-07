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
                duration: 1.25,
                ease: "power2.inOut",
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
                duration: 1.25,
                ease: "power2.inOut",
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
          name: "example-2-transition",
          from: {
            namespace: ["home__example__2", "about__example__2"],
          },
          to: {
            namespace: ["home__example__2", "about__example__2"],
          },
          before: () => {
            this.scroll.stop();
          },
          leave: () => {
            const tl = gsap.timeline({
              defaults: {
                duration: 1.5,
                ease: "power1.in",
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
                duration: 1.5,
                ease: "power1.inOut",
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
        {
          name: "example-3-transition",
          from: {
            namespace: ["home__example__3", "about__example__3"],
          },
          to: {
            namespace: ["home__example__3", "about__example__3"],
          },
          before: (data) => {
            this.scroll.stop();

            gsap.set(data.next.container, {
              position: "fixed",
              inset: 0,
              scale: 0.656,
              clipPath: "inset(100% 0 0 0)",
              zIndex: 3,
              willChange: "auto",
            });

            gsap.set(data.current.container, {
              zIndex: 2,
              willChange: "auto",
            });
          },
          enter: (data) => {
            const nextPath = data.next.url.path;
            const contentCurrent =
              data.current.container.querySelector(".content__wrapper");

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
                duration: 1.25,
                ease: "power3.inOut",
              },
            });

            tl.to(data.current.container, {
              scale: 0.656,
              ease: "expo.inOut",
            });

            tl.to(data.current.container, {
              opacity: 0.45,
            });

            tl.to(
              contentCurrent,
              {
                yPercent: -10,
              },
              "<",
            );

            tl.to(
              data.next.container,
              {
                clipPath: "inset(0% 0 0 0)",
              },
              "<",
            );

            tl.to(data.next.container, {
              scale: 1,
              ease: "expo.inOut",
            });

            return new Promise((resolve) => {
              tl.call(() => {
                this.scroll.destroy();
                resolve();
              });
            });
          },
          after: (data) => {
            this.scroll.init();
            this.scroll.scrollTop();

            gsap.set(data.next.container, {
              clearProps: "all",
            });
          },
          sync: true,
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
