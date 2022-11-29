class ScrollBehaviour {

    mouseXonDown = null;
    mouseX = 0;
    prevMouseX = 0;
    containerVelocity = 0;
    mouseVelocity = 0;


    isMouseDown = false;
    containerMass = 20;
    mouseMass = 50;

    container = null;
    containerParent = null;
    children = null;
    containerPosition = 0;

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

            this.container.style.transition = "all ease 0s";
            if (isOutBound && !isBiggerThanParent) {
                const k = 0.01;
                const restLength = this.containerPosition > 0 ? 0 : boundRight;
                const currentLength = this.containerPosition;
                const dragForce = 1 * k * (restLength - currentLength);
                this.containerVelocity += dragForce;
                const nextPosition = this.containerPosition + this.containerVelocity;
                if (this.containerPosition < boundRight && nextPosition > boundRight) {
                    this.containerVelocity = 0;
                    this.containerPosition = boundRight;
                } else if (this.containerPosition > 0 && nextPosition < 0) {
                    this.containerVelocity = 0;
                    this.containerPosition = 0;
                }
            }else if(isBiggerThanParent && this.containerPosition != 0){
                this.container.style.transition = "all ease 0.3s";
                this.containerPosition = 0;
                this.containerVelocity = 0;
            }
        }
        this.containerPosition = this.containerPosition + this.containerVelocity + (isOutBound ? this.mouseVelocity / 2 : this.mouseVelocity);
        this.containerPosition = this.containerPosition < 5 && this.containerPosition > -5 ? 0 : this.containerPosition;
        this.container.style.transform = `translate(${this.containerPosition}px)`;
    }

    loop() {
        this.calculateMouseMomentum();
        this.updateContainer();
        window.requestAnimationFrame(() => {
            this.loop();
        });
    }
}

// class Carrousel extends ScrollBehaviour{

//     container_div = null;
//     slider = null;

//     velocidad = null;
//     masa = null;
//     momento = null;
//     fuerza = null;
//     distancia = null;
//     time = null;
    

//     constructor(){
//         super();
//         this.container_div = document.getElementById('container');
//         this.slider = document.getElementById('slider');
        
//         // this.velocidad = document.getElementById('velocidad');
//         // this.masa = document.getElementById('masa');
//         // this.momento = document.getElementById('momento');
//         // this.fuerza = document.getElementById('momento');
//         // this.distancia = document.getElementById('distancia');

//         this.init();
//     }

//     init(){
//         this.container = this.slider;
//         this.containerParent = this.container_div;
//         this.dragEvent();
//         this.touchEvent();
//     }

//     dragEvent(){
//         this.slider.addEventListener('mousedown', (event)=>{
//             this.isMouseDown = true;
//             // this.time = new Date().getTime();
//         });
//         document.addEventListener('mouseup', (event) => {
//             this.isMouseDown = false;
//         });
//         document.addEventListener('mousemove', (event) => {
//             this.mouseX = event.pageX;
//             // this.calculate();
//         }, false);
//     }

//     // calculate(){
//     //     if(this.isMouseDown){
//     //         let tiempo_actual = new Date().getTime();
//     //         let distancia = this.mouseX - this.prevMouseX;
//     //         let tiempo = tiempo_actual - this.time;
//     //         let velocidad = distancia / tiempo;
//     //         this.time = tiempo_actual;
//     //         this.velocidad.innerHTML = velocidad;
//     //     }
//     // }

//     touchEvent(){
//         this.slider.addEventListener('touchstart', (event)=>{
//             this.isMouseDown = true;
//             this.mouseX = event.touches[0].pageX;
//             this.prevMouseX = this.mouseX;
//         });
//         document.addEventListener('touchend', (event) => {
//             this.isMouseDown = false;
//         });
//         document.addEventListener('touchmove', (event) => {
//             this.mouseX = event.touches[0].pageX;
//             // console.log(event);
//         }, false);
//     }
// }
// window.addEventListener('load', ()=>{
//     var a  = new Carrousel();
//     a.loop();
// });