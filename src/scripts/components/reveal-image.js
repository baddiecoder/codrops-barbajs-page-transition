import gsap from "gsap";

class RevealImage {
  elements = [];
  tweens = [];

  constructor() {}

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
    this.elements.forEach(({ el, duration, isTriggerByScroll }, idx) => {
      let tween;
      const overlay = el.querySelector(".overlay__reveal__image");

      if (isTriggerByScroll) {
        const tl = gsap.timeline({
          defaults: {
            duration,
            ease: "power2.inOut",
          },
          scrollTrigger: {
            trigger: el,
            start: `top 95%`,
            toggleActions: "play none none none",
            once: true,
            invalidateOnRefresh: true,
          },
        });

        tl.fromTo(
          el,
          {
            opacity: 0,
          },
          {
            opacity: 1,
            onStart: () => {
              console.log("on start ", idx);
            },
          },
        );

        tl.to(overlay, {
          opacity: 0,
        }, "<+0.5");

        tween = tl;
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
        }, "<+0.5");
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
