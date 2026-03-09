import gsap from "gsap";

class RevealImage {
  constructor() {
    this.elements = [];
    this.tweens = [];
  }

  init() {
    const images = document.querySelectorAll("[data-reveal-image]");
    images.forEach((element) => {
      const duration =
        parseFloat(element.getAttribute("data-reveal-image-duration")) || 0.6;

      const triggerByScroll = element.hasAttribute(
        "data-reveal-image-trigger-by-scroll",
      );

      this.elements.push({
        el: element,
        duration,
        isTriggerByScroll: triggerByScroll,
      });
    });
  }

  animationIn() {
    this.elements.forEach(({ el, duration, isTriggerByScroll }) => {
      let tween;
      const overlay = el.querySelector(".overlay__reveal__image");

      if (isTriggerByScroll) {
        tween = gsap.timeline({
          defaults: {
            duration,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: el,
              start: `top 95%`,
              toggleActions: "play none none none",
              once: true,
              invalidateOnRefresh: true,
            },
          },
        });

        tween.fromTo(
          el,
          {
            opacity: 0,
          },
          {
            opacity: 1,
          },
        );

        tween.to(overlay, {
          opacity: 0,
        });
      } else {
        tween = gsap.timeline({
          defaults: {
            duration,
            ease: "power2.inOut",
          },
        });

        tween.to(el, {
          opacity: 1,
        });

        tween.to(overlay, {
          opacity: 0,
        });
      }

      this.tweens.push(tween);
    });
  }

  destroy() {
    this.tweens.forEach((tween) => {
      tween.kill();
      if (tween.isTriggerByScroll) tween.scrollTrigger?.kill();
    });
    this.tweens = [];
    this.elements = [];
  }
}

export default RevealImage;
