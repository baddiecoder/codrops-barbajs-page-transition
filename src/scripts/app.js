import gsap from "gsap";
import barba from "@barba/core";
import Scroll from "./lib/scroll";
import WebGLPageTransition from "./components/webgl-page-transition";
import DrawSVGPlugin from "gsap/DrawSVGPlugin";
import Header from "./components/header";
import { select } from "./utils";
import MotionText from "./components/motion-text";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import RevealImage from "./components/reveal-image";

class App {
  constructor() {
    this.scroll = new Scroll();
    this.scroll.init();

    this.revealImages = new RevealImage();
    this.revealImages.init();
    this.revealImages.animationIn();

    this.motionTexts = new MotionText();
    this.motionTexts.init();
    this.motionTexts.animationIn();

    this.barbaWrapper = select("[data-barba='wrapper']");

    this.header = new Header();

    this.webglPageTransition = new WebGLPageTransition();

    barba.init({
      debug: true,
      transitions: [
        {
          name: "default-transition",
          before: () => {
            this.barbaWrapper.classList.add("is__transitioning");
            this.scroll.stop();
          },
          leave: () => {
            const tl = gsap.timeline({
              defaults: {
                duration: 1.5,
                ease: "power1.in",
              },
              onComplete: () => tl.kill(),
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
                this.motionTexts.destroy();
                this.revealImages.destroy();
                this.scroll.destroy();
                resolve();
              }),
            );
          },
          after: (data) => {
            const nextPath = data.next.url.path;

            this.scroll.init();
            this.scroll.scrollTop();

            this.motionTexts.init();
            this.revealImages.init();

            if (typeof data.trigger === "string") {
              this.header.setRouteTransition(`/${nextPath.split("/")[1]}`);
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
              onComplete: () => tl.kill(),
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
                gsap.set(".transition__svg__wrapper", {
                  autoAlpha: 0,
                  pointerEvents: "none",
                });

                gsap.set(".svg__transition svg path", {
                  drawSVG: "0% 0%",
                  strokeWidth: 200,
                });

                this.motionTexts.animationIn();
                this.revealImages.animationIn();

                this.barbaWrapper.classList.remove("is__transitioning");

                resolve();
              }),
            );
          },
        },
        {
          name: "example-2-transition",
          from: {
            namespace: ["home__example__2", "fauna__example__2"],
          },
          to: {
            namespace: ["home__example__2", "fauna__example__2"],
          },
          before: () => {
            this.barbaWrapper.classList.add("is__transitioning");
            this.scroll.stop();
          },
          leave: () => {
            const tl = gsap.timeline({
              defaults: {
                duration: 1,
                ease: "power1.in",
              },
              onComplete: () => tl.kill(),
            });

            gsap.set("#webgl", {
              pointerEvents: "auto",
              autoAlpha: 1,
              visibility: "visible",
            });

            tl.to(this.webglPageTransition.material.uniforms.uProgress, {
              value: -0.15,
            });

            return new Promise((resolve) => {
              tl.call(() => {
                this.motionTexts.destroy();
                this.revealImages.destroy();
                this.scroll.destroy();
                resolve();
              });
            });
          },
          beforeEnter: async () => {
            await new Promise((resolev) => setTimeout(resolev, 1250));
          },
          after: (data) => {
            const nextPath = data.next.url.path;

            if (typeof data.trigger === "string") {
              this.header.setRouteTransition(`/${nextPath.split("/")[1]}`);
            } else {
              if (
                data.trigger.classList.contains("navigation__example__link")
              ) {
                this.header.setRouteTransition(nextPath);
              }
            }

            const tl = gsap.timeline({
              defaults: {
                duration: 1,
                ease: "power1.in",
              },
              onComplete: () => {
                this.scroll.init();
                this.scroll.scrollTop();

                this.motionTexts.init();
                this.motionTexts.animationIn();

                this.revealImages.init();
                this.revealImages.animationIn();

                gsap.set("#webgl", {
                  pointerEvents: "none",
                  autoAlpha: 0,
                  visibility: "hidden",
                });

                tl.kill();
              },
            });

            tl.to(this.webglPageTransition.material.uniforms.uProgress, {
              value: 1.5,
            });

            return new Promise((resolve) => {
              tl.call(() => {
                this.barbaWrapper.classList.remove("is__transitioning");
                resolve();
              });
            });
          },
        },
        {
          name: "example-3-transition",
          from: {
            namespace: ["home__example__3", "fauna__example__3"],
          },
          to: {
            namespace: ["home__example__3", "fauna__example__3"],
          },
          before: (data) => {
            this.scroll.stop();

            this.barbaWrapper.classList.add("is__transitioning");

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
          leave: () => {
            this.motionTexts.destroy();
            this.revealImages.destroy();
          },
          enter: (data) => {
            const nextPath = data.next.url.path;
            const contentCurrent =
              data.current.container.querySelector(".content__wrapper");

            if (typeof data.trigger === "string") {
              this.header.setRouteTransition(`/${nextPath.split("/")[1]}`);
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
              onComplete: () => tl.kill(),
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

            this.motionTexts.init();
            this.motionTexts.animationIn();

            this.revealImages.init();
            this.revealImages.animationIn();

            this.barbaWrapper.classList.remove("is__transitioning");

            gsap.set(data.next.container, {
              clearProps: "all",
            });
          },
          sync: true,
        },
      ],
    });

    this.render();
  }

  render() {
    this.webglPageTransition.render();
    requestAnimationFrame(this.render.bind(this));
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

  gsap.registerPlugin(DrawSVGPlugin, SplitText, ScrollTrigger);

  new App();
});
