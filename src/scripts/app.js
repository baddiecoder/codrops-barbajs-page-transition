import gsap from "gsap";
import barba from "@barba/core";
import WebGLPageTransition from "./components/webgl-page-transition";
import { select } from "./utils";
import MotionText from "./components/motion-text";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";

class App {
  constructor() {
    this.motionTexts = new MotionText();
    this.motionTexts.init();
    this.motionTexts.animationIn();

    this.transitionOverlay = select(".transition__overlay");

    this.titleDestination = select(".transition__overlay .title__destination");

    this.splitTitleDestination = null;

    this.getPercentageHalfHeightTextDestination();

    this.barbaWrapper = select("[data-barba='wrapper']");

    this.webglPageTransition = new WebGLPageTransition();

    barba.init({
      transitions: [
        {
          name: "default-transition",
          before: (data) => {
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
          enter: (data) => {
            const contentCurrent =
              data.current.container.querySelector(".content__wrapper");

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
                this.motionTexts.destroy();
                resolve();
              });
            });
          },
          after: (data) => {
            this.motionTexts.init();
            this.motionTexts.animationIn();

            this.barbaWrapper.classList.remove("is__transitioning");

            gsap.set(data.next.container, {
              clearProps: "all",
            });
          },
          sync: true,
        },
        {
          name: "example-2-transition",
          to: {
            namespace: ["about"],
          },
          before: () => {
            this.barbaWrapper.classList.add("is__transitioning");
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
                resolve();
              });
            });
          },
          beforeEnter: async () => {
            await new Promise((resolev) => setTimeout(resolev, 1250)); // Optional
          },
          after: () => {
            const tl = gsap.timeline({
              defaults: {
                duration: 1,
                ease: "power1.in",
              },
              onComplete: () => {
                this.motionTexts.init();
                this.motionTexts.animationIn();

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
          to: {
            namespace: ["team"],
          },
          before: (data) => {
            this.barbaWrapper.classList.add("is__transitioning");

            this.transitionOverlay.classList.add("team__transition");

            const nextDestination = data.next.url.path
              .split("/")
              .filter(Boolean)
              .pop();

            this.titleDestination.innerHTML = `we're going to ${nextDestination}`;

            if (this.splitTitleDestination) this.splitTitleDestination.revert();

            this.splitTitleDestination = new SplitText(this.titleDestination, {
              type: "words",
              mask: "words",
              wordsClass: "words",
            });

            gsap.set(this.transitionOverlay, {
              "--clip": `polygon(0% ${50 - this.percentageHalfHeightTextDestination}%, 0% ${50 - this.percentageHalfHeightTextDestination}%, 0% ${50 + this.percentageHalfHeightTextDestination}%, 0% ${50 + this.percentageHalfHeightTextDestination}%)`,
            });
          },
          leave: () => {
            const tl = gsap.timeline({
              defaults: {
                duration: 1,
                ease: "expo.inOut",
              },
              onComplete: () => tl.kill(),
            });

            gsap.set(this.transitionOverlay, {
              pointerEvents: "auto",
              autoAlpha: 1,
              visibility: "visible",
            });

            tl.to(this.transitionOverlay, {
              "--clip": `polygon(0 ${50 - this.percentageHalfHeightTextDestination}%, 100% ${50 - this.percentageHalfHeightTextDestination}%, 100% ${50 + this.percentageHalfHeightTextDestination}%, 0 ${50 + this.percentageHalfHeightTextDestination}%)`,
            });

            tl.to(this.transitionOverlay, {
              "--clip": "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            });

            return new Promise((resolve) => {
              tl.call(() => {
                this.motionTexts.destroy();
                resolve();
              });
            });
          },
          after: () => {
            const tl = gsap.timeline({
              defaults: {
                duration: 1,
                ease: "hop",
              },
              onComplete: () => {
                this.motionTexts.init();
                this.motionTexts.animationIn();

                if (this.splitTitleDestination) {
                  this.splitTitleDestination.revert();
                  this.splitTitleDestination = null;
                }

                gsap.set(this.transitionOverlay, {
                  pointerEvents: "none",
                  autoAlpha: 0,
                  visibility: "hidden",
                });

                tl.kill();
              },
            });

            tl.to(this.splitTitleDestination.words, {
              yPercent: -120,
              duration: 0.5,
              stagger: {
                amount: 0.25,
              },
              ease: "elastic.in(1, 1)",
            });

            tl.to(
              this.transitionOverlay,
              {
                "--clip": "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
              },
              "<+0.25",
            );

            return new Promise((resolve) => {
              tl.call(() => {
                this.barbaWrapper.classList.remove("is__transitioning");
                this.transitionOverlay.classList.remove("team__transition");
                resolve();
              });
            });
          },
        },
        {
          name: "example-4-transition",
          to: {
            namespace: ["contact"],
          },
          before: (data) => {
            this.barbaWrapper.classList.add("is__transitioning");

            data.next.container.classList.add("contact__transition");
            gsap.set(data.next.container, {
              position: "fixed",
              inset: 0,
              clipPath: "polygon(15% 75%, 85% 75%, 85% 75%, 15% 75%)",
              zIndex: 3,
              height: "100vh",
              overflow: "hidden",
              "--clip": "inset(0 0 0% 0)",
            });
          },
          enter: (data) => {
            const tl = gsap.timeline({
              defaults: {
                duration: 1.25,
                ease: "hop",
              },
              onComplete: () => tl.kill(),
            });

            tl.to(data.next.container, {
              clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
            });

            tl.to(
              data.next.container,
              {
                "--clip": "inset(0 0 100% 0)",
              },
              "<+=0.485",
            );

            return new Promise((resolve) => {
              tl.call(() => {
                this.motionTexts.destroy();
                resolve();
              });
            });
          },
          after: (data) => {
            this.motionTexts.init();
            this.motionTexts.animationIn();

            this.barbaWrapper.classList.remove("is__transitioning");

            data.next.container.classList.remove("contact__transition");
            gsap.set(data.next.container, {
              clearProps: "all",
            });
          },
          sync: true,
        },
      ],
    });

    this.render();
    
    this.addEventListeners();
  }

  getPercentageHalfHeightTextDestination() {
    const titleDestinationBound = this.titleDestination.getBoundingClientRect();
    const halfHeightTitleDestination = titleDestinationBound.height / 2;
    const halfHeightViewport = window.innerHeight / 2;
    this.percentageHalfHeightTextDestination =
      (halfHeightTitleDestination / halfHeightViewport) * 50;
  }

  onResize() {
    this.getPercentageHalfHeightTextDestination();
  }

  addEventListeners() {
    window.addEventListener("resize", this.onResize.bind(this));
  }

  render() {
    this.webglPageTransition.render();
    requestAnimationFrame(this.render.bind(this));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(SplitText, CustomEase);

  CustomEase.create("hop", "0.56, 0, 0.35, 0.98");

  new App();
});
