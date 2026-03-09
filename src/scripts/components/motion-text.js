import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { setClassSplitText } from "../utils";

class MotionText {
  constructor() {
    this.elements = [];
    this.splitText = [];
    this.splitTextTween = [];
  }

  init() {
    this.elements = document.querySelectorAll("[data-motion-text]");
    this.elements.forEach((element) => {
      const duration =
        parseFloat(element.getAttribute("data-motion-text-duration")) || 0.6;

      if (element.hasAttribute("data-motion-text-split")) {
        const splitType =
          element.getAttribute("data-motion-text-split") || "lines";

        const staggers =
          parseFloat(element.getAttribute("data-motion-text-stagger")) || 0.05;

        const triggerByScroll = element.hasAttribute(
          "data-motion-text-trigger-by-scroll",
        );

        const split = new SplitText(element, {
          type: splitType,
          mask: splitType,
          ...setClassSplitText(splitType),
        });

        gsap.set(split[splitType], {
          yPercent: 120,
        });

        gsap.set(element, {
          visibility: "visible",
          autoAlpha: 1,
        });

        this.splitText.push({
          el: element,
          split,
          duration,
          staggers,
          isTriggerByScroll: triggerByScroll,
          splitType,
        });
      }
    });
  }

  animationIn() {
    this.splitText.forEach(
      ({ el, split, duration, staggers, isTriggerByScroll, splitType }) => {
        let tween;
        if (isTriggerByScroll) {
          tween = gsap.to(split[splitType], {
            yPercent: 0,
            duration,
            stagger: staggers,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: el,
              start: `top 95%`,
              toggleActions: "play none none none",
              once: true,
              invalidateOnRefresh: true,
            },
          });
        } else {
          tween = gsap.to(split[splitType], {
            yPercent: 0,
            duration,
            stagger: staggers,
            ease: "power2.inOut",
          });
        }

        this.splitTextTween.push(tween);
      },
    );
  }

  destroy() {
    this.splitText.forEach(({ split }) => {
      split.revert();
    });

    this.splitTextTween.forEach((tween) => {
      tween.kill();
      if (tween.isTriggerByScroll) tween.scrollTrigger?.kill();
    });

    this.splitTextTween = [];
    this.elements = [];
    this.splitText = [];
  }
}

export default MotionText;
