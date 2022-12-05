class ScrollBehaviour {
    mouseXonDown = null;
    mouseX = 0;
    prevMouseX = 0;
    containerVelocity = 0;
    mouseVelocity = 0;


    isMouseDown = false;
    containerMass = 10;
    mouseMass = 20;

    container = null;
    containerParent = null;
    children = null;
    containerPosition = 0;

    isAnimationRunning = false;

    constructor() {}


    calculateMouseMomentum() {
        const boundRight = -this.container.offsetWidth + this.containerParent.offsetWidth - 1;
        if (this.isMouseDown && boundRight < 0) {
            if (this.mouseXonDown == null) {
                this.mouseXonDown = this.mouseX;
                this.containerVelocity = 0;
            }
            this.mouseVelocity = this.mouseX - this.prevMouseX;
        } else {
            if (this.mouseXonDown != null) {
                this.containerVelocity = 2 * this.mouseMass / (this.mouseMass + this.containerMass) * this.mouseVelocity + (this.containerMass - this.mouseMass) / (this.mouseMass + this.containerMass) * this.containerVelocity;
                const maxVelocity = 30;
                if (this.containerVelocity > maxVelocity) {
                    this.containerVelocity = maxVelocity;
                } else if (this.containerVelocity < -maxVelocity) {
                    this.containerVelocity = -maxVelocity;
                }
                this.mouseXonDown = null;
                this.mouseVelocity = 0;
            }

        }
        this.prevMouseX = this.mouseX;
    }

    updateContainer() {
        const boundRight = -this.container.offsetWidth + this.containerParent.offsetWidth - 1;
        const isOutBound = this.containerPosition > 0 || this.containerPosition < boundRight;
        const isBiggerThanParent = (boundRight >= 0);

        this.container.style.transition = "all ease 0s";
        if (!this.isMouseDown) {
            const mu = 0.04;
            const g = 5;
            const flictionForce = this.containerMass * g * mu;
            const flictionA = flictionForce / this.containerMass;
            if (this.containerVelocity > 0) {
                this.containerVelocity -= flictionA;
                if (this.containerVelocity < 0) {
                    this.containerVelocity = 0;
                }
            } else if (this.containerVelocity < 0) {
                this.containerVelocity += flictionA;
                if (this.containerVelocity > 0) {
                    this.containerVelocity = 0;
                }
            }

            if (isOutBound && !isBiggerThanParent) {
                this.containerVelocity = 0;
                this.container.style.transition = "all ease 0.3s";
                if (this.containerPosition > 0) {
                    this.containerPosition = 0;
                } else if (this.containerPosition < boundRight) {
                    this.containerPosition = boundRight;
                }
                // const k = 0.01;
                // const restLength = this.containerPosition > 0 ? 0 : boundRight;
                // const currentLength = this.containerPosition;
                // const dragForce = 1 * k * (restLength - currentLength);
                // this.containerVelocity += dragForce;
                // const nextPosition = this.containerPosition + this.containerVelocity;
                // if (this.containerPosition < boundRight && nextPosition > boundRight) {
                //     this.containerVelocity = 0;
                //     this.containerPosition = boundRight;
                // } else if (this.containerPosition > 0 && nextPosition < 0) {
                //     this.containerVelocity = 0;
                //     this.containerPosition = 0;
                // }
            } else if (isBiggerThanParent && this.containerPosition != 0) {
                this.container.style.transition = "all ease 0.3s";
                this.containerPosition = 0;
                this.containerVelocity = 0;
            }
        }
        this.containerPosition = this.containerPosition + this.containerVelocity + (isOutBound ? this.mouseVelocity / 2 : this.mouseVelocity);
        this.containerPosition = this.containerPosition < 5 && this.containerPosition > -5 ? 0 : this.containerPosition;

        this.container.style.transform = `translate(${this.containerPosition}px)`;

        if(this.containerVelocity == 0 && !this.isMouseDown){
            this.isAnimationRunning = false;
        }
    }

    loop() {
        this.calculateMouseMomentum();
        this.updateContainer();
        window.requestAnimationFrame(() => {
            if (this.isAnimationRunning) {
                this.loop();
            }
        });

    }
}