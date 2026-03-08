import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

class Scroll {
  constructor() {
    this.lenis = null;
  }

  init() {
    this.lenis = new Lenis({
      duration: 1.75,
      autoRaf: true,
      wrapper: document.querySelector(".content__wrapper"),
      content: document.querySelector(".content"),
    });

    this.lenis.on("scroll", ScrollTrigger.update);

    ScrollTrigger.defaults({
      scroller: document.querySelector(".content__wrapper"),
    });
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
    this.lenis.destroy();
    this.lenis = null;
  }
}

export default Scroll;
