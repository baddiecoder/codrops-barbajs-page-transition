import gsap from "gsap";
import barba from "@barba/core";
import Scroll from "./lib/scroll";
import WebGLPageTransition from "./module/webgl-page-transition";

class App {
  constructor() {
    this.scroll = new Scroll();
    this.scroll.init();

    this.webglPageTransition = new WebGLPageTransition();

    barba.init({
      debug: true,
      transitions: [
        {
          name: "default-transition",
          before: () => {
            this.scroll.stop();
          },
          leave: (data) => {
            const destinationPath =
              data.next.url.path === "/"
                ? "home"
                : data.next.url.path.split("/").filter(Boolean).pop();

            this.webglPageTransition.title.textContent = destinationPath;

            const tl = gsap.timeline({
              defaults: {
                duration: 1.25,
                ease: "power2.inOut",
              },
            });

            gsap.set(this.webglPageTransition.wrapper, {
              pointerEvents: "auto",
            });

            gsap.set(this.webglPageTransition.title, {
              "--y": "100%",
            });

            tl.to(this.webglPageTransition.mesh.material.uniforms.uProgress, {
              value: -0.15,
            });

            tl.to(
              this.webglPageTransition.title,
              {
                "--y": "0%",
                duration: 0.75,
                ease: "power2.inOut",
              },
              "<+0.5",
            );

            return new Promise((resolve) => {
              tl.call(() => {
                this.scroll.destroy();
                resolve();
              });
            });
          },
          after: () => {
            this.scroll.init();
            this.scroll.scrollTop();
            const tl = gsap.timeline({
              defaults: {
                duration: 1.25,
                ease: "power2.inOut",
              },
            });

            tl.to(this.webglPageTransition.title, {
              "--y": "-100%",
              duration: 0.75,
              ease: "power2.inOut",
            });

            tl.to(
              this.webglPageTransition.mesh.material.uniforms.uProgress,
              {
                value: 2.1,
              },
              "<",
            );

            return new Promise((resolve) => {
              tl.call(() => {
                gsap.set(this.webglPageTransition.wrapper, {
                  pointerEvents: "none",
                });
                resolve();
              });
            });
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

  new App();
});
