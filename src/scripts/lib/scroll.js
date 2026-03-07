import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

class Scroll {
  constructor() {
    this.lenis = null;
  }

  init() {
    this.lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      direction: "vertical",
      lerp: 0.1,
      wrapper: document.querySelector(".content__wrapper"),
      content: document.querySelector(".content"),
    });

    this.lenis.on("scroll", ScrollTrigger.update);

    this.rafCallback = (time) => {
      this.lenis?.raf(time * 1000);
    };
    gsap.ticker.add(this.rafCallback);
    gsap.ticker.lagSmoothing(0);
  }

  stop() {
    this.lenis?.stop();
  }

  start() {
    this.lenis?.start();
  }

  scrollTop() {
    if (this.lenis) {
      this.lenis.scrollTo(0, { immediate: true });
    }
  }

  destroy() {
    if (!this.lenis) return;

    if (this.rafCallback) {
      gsap.ticker.remove(this.rafCallback);
    }

    this.lenis.destroy();
    this.lenis = null;
  }
}

export default Scroll;
