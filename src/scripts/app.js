import gsap from "gsap";
import PageTransition from "./module/page-transition";
import barba from "@barba/core";

class App {
  constructor() {
    this.pageTransition = new PageTransition();

    barba.init({
      debug: true,
      transitions: [
        {
          name: "default-transition",
          leave: (data) => {
            const destinationPath =
              data.next.url.path === "/"
                ? "home"
                : data.next.url.path.split("/").filter(Boolean).pop();

            this.pageTransition.title.textContent = destinationPath;

            const tl = gsap.timeline({
              defaults: {
                duration: 1.25,
                ease: "power2.inOut",
              },
            });

            gsap.set(this.pageTransition.wrapper, {
              pointerEvents: "auto",
            });

            gsap.set(this.pageTransition.title, {
              "--y": "100%",
            });

            tl.to(this.pageTransition.mesh.material.uniforms.uProgress, {
              value: -0.15,
            });

            tl.to(
              this.pageTransition.title,
              {
                "--y": "0%",
                duration: 0.75,
                ease: "power2.inOut",
              },
              "<+0.5",
            );

            return new Promise((resolve) => {
              tl.call(() => {
                resolve();
              });
            });
          },
          after: () => {
            const tl = gsap.timeline({
              defaults: {
                duration: 1.25,
                ease: "power2.inOut",
              },
            });

            tl.to(this.pageTransition.title, {
              "--y": "-100%",
              duration: 0.75,
              ease: "power2.inOut",
            });

            tl.to(
              this.pageTransition.mesh.material.uniforms.uProgress,
              {
                value: 2.1,
              },
              "<",
            );

            return new Promise((resolve) => {
              tl.call(() => {
                gsap.set(this.pageTransition.wrapper, {
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
  new App();
});
