import { AfterViewInit, Directive, HostListener, Input } from "@angular/core";
import { AnimationController, Animation } from "@ionic/angular";

@Directive({
  selector: "[appAnimatedFab]",
})
export class AnimatedFabDirective implements AfterViewInit {
  @Input("appAnimatedFab") className!: string;
  fab!: Element;

  constructor(private animationCtrl: AnimationController) {}

  shrinkAnimation!: Animation;
  expanded = true;

  ngAfterViewInit() {
    this.fab = document.getElementsByClassName(this.className)[0];
    if (!this.fab) {
      return;
    }
    // this.fab = this.fab.el;

    this.setupAnimation();
  }

  setupAnimation() {
    const textSpan = this.fab.querySelector<Element>("span");

    const shrink = this.animationCtrl
      .create("shrink")
      .addElement(this.fab)
      .duration(400)
      .fromTo("width", "140px", "56px");

    const fade = this.animationCtrl
      .create("fade")
      .duration(400)
      .fromTo("opacity", 1, 0)
      .fromTo("width", "70px", "0px");
    if (textSpan != null) {
      fade.addElement(textSpan);
    }

    this.shrinkAnimation = this.animationCtrl
      .create("shrink-animation")
      .duration(400)
      .easing("ease-out")
      .addAnimation([shrink, fade]);
  }

  @HostListener("ionScroll", ["$event"]) onContentScroll($event: any) {
    if ($event.detail.deltaY > 0 && this.expanded) {
      // Scrolling down
      this.expanded = false;
      this.shrinkFab();
    } else if ($event.detail.deltaY < 0 && !this.expanded) {
      // Scrolling up
      this.expanded = true;
      this.expandFab();
    }
  }

  expandFab() {
    if (this.shrinkAnimation) {
      this.shrinkAnimation.direction("reverse").play();
    }
  }

  shrinkFab() {
    if (this.shrinkAnimation) {
      this.shrinkAnimation.direction("alternate").play();
    }
  }
}
