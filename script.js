var container = null;
var next = null;
var prev = null;

var swipper_instance = null;
var calendar = null;
var backdrop = null;
document.oncontextmenu = function (event) {
    return false
}

window.addEventListener('keydown', (event) => {
    if((event.ctrlKey && event.shiftKey && event.key.toLowerCase() == "i") || event.key.toLowerCase() == "f12"){
        event.preventDefault();
    }
});

window.addEventListener('load', () => {
    // swipper_instance = new Swipper("prueba", "account");
    swipper_instance = new newSwipper("swipper", "account");
    calendar = new Calendar("calendar");
    backdrop = new BeautifyBackDrop("account_switch", {
        background: "#fff",
        classActivate: "active",
        borderRadius: "50px",
        padding: 0
    });
});

window.addEventListener('click', (event) => {
    const element = event.target;

    const ripple_buttons = document.getElementsByClassName('ripple');

    Array.from(ripple_buttons).forEach((ripple_button) => {
        if (ripple_button.contains(element)) {

            const rippleContainer = document.createElement('div');
            const rippleEffect = document.createElement('span');

            rippleContainer.classList.add('ripple-container');
            rippleEffect.classList.add('ripple-effect');

            const offset = ripple_button.getBoundingClientRect();

            rippleEffect.style.top = (event.clientY - offset.top) + "px";
            rippleEffect.style.left = (event.clientX - offset.left) + "px";

            rippleContainer.classList.add('ripple-effect-animation');

            rippleContainer.appendChild(rippleEffect);
            ripple_button.appendChild(rippleContainer);

            setTimeout(() => {
                rippleContainer.removeChild(rippleEffect);
                ripple_button.removeChild(rippleContainer);
            }, 400);
        }
    });

    var container_menu = this.document.getElementsByClassName("toggle_container");
    var target = event.target;
    Array.from(container_menu).forEach(element => {
        if (!element.contains(target)) {
            let input = element.getElementsByClassName("toggle_input_menu")[0];
            input ? input.checked = false : false;
        }
    })


});


class Years{
    
    minimo = 0;
    maximo = 0;
    container_years = null;
    years = [];
    translate = 0;
    dimensions = {
        x: 5,
        y: 5
    };
    length_matrix = 0;

    func = null;
    inst = null;

    createElement = null;

    instanceFather = null;

    siguiente = null;
    anterior = null;

    current_year = 0;

    timer_scroll = null;

    constructor(instanceFather){
        this.instanceFather = instanceFather;
        this.length_matrix = this.dimensions.x * this.dimensions.y;


    }

    init(first = false){
        if(first){
            this.first();
        }else{
            this.enter();
        }
    }

    first(){
        const date =  new Date();
        const year_now = date.getFullYear();
        const cant = this.dimensions.x * this.dimensions.y;
        const position = Math.ceil(cant / 2);
        const start = year_now - position + 1;

        this.current_year = year_now;
        this.instanceFather.current_year_object.year = year_now;
    
        this.createMatrix(start);
    }

    enter(){
        if(this.siguiente){
            const minimo = this.siguiente.minimo - this.length_matrix;
            this.createMatrix(minimo);
            this.container_years.style.transform = "translateY(-100%)";
        }else if(this.anterior){
            const minimo = this.anterior.maximo + 1;
            this.createMatrix(minimo);
            this.container_years.style.transform = "translateY(100%)";
        }
    }

    constructorContainer(){
        this.container_years = this.create_element('div', "years_container");
    }

    constructorYearRow(){
        return this.create_element('div', 'year_row');
    }

    constructorYear(year_num){
        const year = this.create_element('div', 'year_span');
        year.innerHTML = year_num;
        const year_box = this.create_element('div', 'year', [{attr: "data-year", val: year_num}]);

        if(this.instanceFather.current_year_object.year == year_num){
            year_box.classList.add('active');
            this.instanceFather.current_year_object.year_element = year_box;
        }

        if(this.current_year == year_num){
            year_box.classList.add('current');
        }

        year_box.appendChild(year);
        return year_box;
    }

    event_years(element){
        element.addEventListener('click', (event) => {
            this.instanceFather.current_year_object.year_element.classList.remove('active');
            element.classList.add("active");
            this.instanceFather.current_year_object = {
                year_element: element,
                year: element.dataset.year
            };
            this.change_date_to_instence(this.instanceFather.current_year_object.year);
        });
    }

    change_date_to_instence(year = 0){

            if(year != 0){
                let newMonth = new Date(year, this.instanceFather.monthCalendar, 1);

                this.instanceFather.monthCalendar = newMonth.getMonth();

                this.instanceFather.yearCalendar = newMonth.getFullYear();
                this.instanceFather.current_month_name = this.instanceFather.monthsNames[this.instanceFather.monthCalendar];
                this.instanceFather.load_Calendar();
                if (Object.entries(this.instanceFather.date_selected_end).length !== 0) {
                    this.instanceFather.range_dates();
                }
            }
    }

    event_parent(){
        console.log("Evento asignado", this.container_years);
        this.container_years.addEventListener('wheel', (event) => {
            this.instanceFather.not_scroll = true;
            console.log("Se hizo scroll", event);
        });
    }

    createMatrix(init){
        this.minimo = init;

        this.constructorContainer();

        for(let i = 0; i < this.dimensions.x; i++){
            this.years[i] = [];
            const year_row = this.constructorYearRow();
            for(let j = 0; j < this.dimensions.y; j++){

                const year_container = this.constructorYear(init);
                year_row.appendChild(year_container);

                this.event_years(year_container);

                this.years[i][j] = year_container;
                this.maximo = init;
                init++;
            }
            this.container_years.appendChild(year_row);
        }

        this.instanceFather.calendar_body_years.appendChild(this.container_years);
    }

    next(){
        this.instanceFather.next();
    }

    previous(){
        this.instanceFather.previous();
    }

    create_element(nodeName, className, attributes = []){
        return Calendar.prototype.create_element(nodeName, className, attributes);
    }
}

class YearsList{
    current_years = null;
    current_year_object = {
        year: 0,
        year_element: null
    };
    year_selected = 0;
    inicio = null;
    fin = null;
    length = 0;

    not_scroll = false;

    transition = false;

    constructor(){
    }

    init_year_list(){
        const first = new Years(this);
        this.inicio = first;
        this.fin = this.inicio;
        this.current_years = first;
        this.length++;

        this.current_years.init(true);

        this.prepend();
        this.append();


        this.eventScrollWindow();
        this.event_container_years_wheel();
        this.event_container_years_touch();
        this.current_years.siguiente.container_years.style.transform = `translateY(100%)`;
        this.current_years.anterior.container_years.style.transform = `translateY(-100%)`;
    }

    eventScrollWindow(){
        document.addEventListener('wheel', (event) => {
            if(this.not_scroll){
                event.preventDefault();
                this.not_scroll = false;
            }
        }, {passive: false});

        document.addEventListener('scroll', (event) => {
            if(this.not_scroll){
                event.preventDefault();
                console.log("Se debe cancelar");
            }
        }, {passive: false});
    }

    event_container_years_wheel(){
        this.calendar_body_years.addEventListener('wheel', (event) => {
            this.not_scroll = true;
            if(!this.transition){
                const up = event.deltaY < 0 ? true : false;
                if(up){
                    this.previous();
                }else{
                    this.next();
                }
            }
        });
    }

    event_container_years_touch(){
        this.calendar_body_years.addEventListener('touchstart', (event)=>{
            this.not_scroll = true;
            event.preventDefault();

            const touches = event.touches[0];
            const Y_start = touches.clientY;
            
            // ! LIMITES PARA DESPLAZAR AL TERMINAR DE DESLIZAR
            const aux_limit = this.getPosition(this.current_years.container_years).height;
            const limit = Math.ceil(aux_limit / 2);
            const negative_limit = limit * -1;

            // ! LIMITE DE DESPLAZAMIENTO AL MOMENTO DE DESLIZAR
            const positive_limit_move = Math.ceil((aux_limit / 3) * 2);
            const negative_limit_move = positive_limit_move * -1;

            let new_move = 0;
            let is_next = false;

            let move_years = (event_window) => {
                const touches_window = event_window.touches[0];
                const move_Y = touches_window.clientY;
                new_move = move_Y - Y_start;

                if(new_move > negative_limit_move && new_move < positive_limit_move){

                    this.current_years.container_years.style.transform = `translateY(${new_move}px)`;
                    this.current_years.container_years.style.transition = `all ease 0.0s`;
                    if(new_move > 0){
                        this.current_years.anterior.container_years.style.transform = `translateY(calc(-100% + ${new_move}px))`;
                        this.current_years.anterior.container_years.style.transition = `all ease 0.0s`;
                    }else{
                        is_next = true;
                        this.current_years.siguiente.container_years.style.transform = `translateY(calc(100% + (${new_move}px)))`;
                        this.current_years.siguiente.container_years.style.transition = `all ease 0.0s`;
                    }
                }
            }

            document.addEventListener('touchmove', move_years);

            document.ontouchend = (event_touch_end) => {
                this.not_scroll = false;
                document.removeEventListener('touchmove', move_years);
                document.ontouchend = null;

                if(new_move > limit){
                    this.previous();
                }else if(new_move < negative_limit){
                    this.next();
                }else{
                    this.resetPosition();
                }
            }

        });
    }

    append(){
        let newNode = new Years(this);

        this.fin.siguiente = newNode;
        newNode.anterior = this.fin;
        this.fin = newNode;

        newNode.init();

        this.length++;
    }
    prepend(){
        let newNode = new Years(this);

        newNode.siguiente = this.inicio;
        this.inicio.anterior = newNode;
        this.inicio = newNode;

        newNode.init();

        this.length++;
    }

    next(){
        if(this.current_years.siguiente){
            this.current_years = this.current_years.siguiente;
            if(!this.current_years.siguiente){
                this.append();
            }

            this.current_years.container_years.style.transform = `translateY(0%)`;
            this.current_years.container_years.style.transition = `all ease 0.3s`;
            this.current_years.anterior.container_years.style.transform = `translateY(-100%)`;
            this.current_years.anterior.container_years.style.transition = `all ease 0.3s`;
            this.delay();
        }
    }

    previous(){
        if(this.current_years.anterior){
            this.current_years = this.current_years.anterior;
            if(!this.current_years.anterior){
                this.prepend();
            }
            this.current_years.container_years.style.transform = `translateY(0%)`;
            this.current_years.container_years.style.transition = `all ease 0.3s`;
            this.current_years.siguiente.container_years.style.transform = `translateY(100%)`;
            this.current_years.siguiente.container_years.style.transition = `all ease 0.3s`;
            this.delay();
        }
    }

    delay(){
        this.transition = true;
        setTimeout(()=>{
            this.transition = false;
        },400);
    }

    resetPosition(){
        this.current_years.anterior.container_years.style.transform = `translateY(-100%)`;
        this.current_years.anterior.container_years.style.transition = `all ease 0.3s`;
        this.current_years.container_years.style.transform = `translateY(0%)`;
        this.current_years.container_years.style.transition = `all ease 0.3s`;
        this.current_years.siguiente.container_years.style.transform = `translateY(100%)`;
        this.current_years.siguiente.container_years.style.transition = `all ease 0.3s`;
    }
}

class Swipper {
    container = null;
    next = null;
    prev = null;
    swipper = null;
    child_selected = null;
    spacing_different = 0;
    children_class = "";
    limit = 0;

    translate = 0;

    canTranslate = true;

    constructor(id = "", children_class = "") {
        if (id != "") {
            this.container = document.getElementById(id + "_swipper_container");
            this.prev = document.getElementById(id + "_swipper_prev");
            this.next = document.getElementById(id + "_swipper_next");
            this.children_class = children_class;
            this.children = this.container.getElementsByClassName(this.children_class);
            // console.log(this.children);
            this.init();
        }
    }

    init() {
        try {
            this.swipper = this.container.getElementsByClassName("swipper_container")[0];
            this.children = this.swipper.getElementsByClassName(this.children_class);
            this.add_events_to_controls();
            // this.add_events_to_children();
            this.drag_and_drop();
        } catch (error) {
            console.error("Error: No se encontró ningún elemento hijo swipper", error);
        }
    }

    add_events_to_controls() {

        const {
            margin
        } = this.getMargin();
        const {
            limit
        } = this.getLimitTranslate();

        const real_limit = limit - margin;
        this.limit = real_limit;

        this.prev.onclick = () => {
            // const {
            //     real_width,
            //     margin
            // } = this.getMargin();
            // const translate = this.getTranslateX();
            // const {
            //     limit,
            //     width_container,
            //     width_swipper
            // } = this.getLimitTranslate();

            // const real_limit = limit - margin;

            // this.limit = real_limit;

            // if (width_container < width_swipper) {
            //     const aux_translate = translate - real_width;
            //     console.log(limit, real_limit);
            //     const new_translate = (aux_translate * -1) > real_limit ? (real_limit * -1) : aux_translate;
            //     // this.swipper.style.setProperty("--translate", (new_translate) + "px");
            //     this.swipper.style.transform = `translateX(${new_translate}px)`;
            //     this.swipper.style.transition = "all ease 0.3s";

            //     this.translate = new_translate;
            // }

            Array.from(this.children).forEach((child) => {
                const bound = this.getBound(child);
                const container = this.getBound(this.container);

                const difference = bound.left - container.left;
                // console.log(swipperBound);
                // console.log(bound);

                // console.log(child, bound.left, swipperBound.left);
                // console.log(bound.left - swipperBound.left);

                if(difference > 0){

                }
            });

        }

        this.next.onclick = () => {
            // const bound_container = this.getBound(this.container);
            // const bound_swipper = this.getBound(this.swipper);
            const {
                real_width,
                margin
            } = this.getMargin();
            const translate = this.getTranslateX();
            const {
                limit,
                width_container,
                width_swipper
            } = this.getLimitTranslate();

            const real_limit = limit - margin;
            this.limit = real_limit;

            if (width_container < width_swipper) {
                const aux_translate = translate + real_width;
                var new_translate = aux_translate > 0 ? 0 : aux_translate;
                if (translate == (real_limit * -1)) {
                    console.log("No ptas entra");
                    new_translate = new_translate + margin;
                }
                console.log(translate, real_limit, new_translate, aux_translate);
                this.swipper.style.transform = `translateX(${new_translate}px)`;
                this.swipper.style.transition = "all ease 0.3s";

                this.translate = new_translate;
            }
        }
    }

    getBound(element) {
        const bound = element.getBoundingClientRect();
        return bound;
    }

    getMargin() {
        const child = this.children[0];
        if (child) {
            const style = child.currentStyle || window.getComputedStyle(child);
            const marginLeft = parseInt(style.marginLeft);
            const marginRight = parseInt(style.marginRight);
            const width = parseInt(style.width);
            const margin = marginLeft + marginRight;
            const real_width = margin + width;
            return {
                real_width,
                margin,
                marginLeft,
                marginRight
            };
        }
        return {
            real_width: 0,
            margin: 0,
            marginLeft : 0,
            marginRigh: 0
        };
    }

    getTranslateX() {
        const style = this.swipper.currentStyle || window.getComputedStyle(this.swipper);
        const matrix = new WebKitCSSMatrix(style.transform);
        return matrix.m41;
    }

    getLimitTranslate() {
        const style_container = this.container.currentStyle || window.getComputedStyle(this.container);
        const width_container = parseInt(style_container.width);

        const style_swipper = this.swipper.currentStyle || window.getComputedStyle(this.swipper);
        const width_swipper = parseInt(style_swipper.width);

        const limit = width_swipper - width_container;
        return {
            limit,
            width_container,
            width_swipper
        }

    }

    getLimit(){
        const style_container = this.container.currentStyle || window.getComputedStyle(this.container);
        const width_container = parseInt(style_container.width);

        const style_swipper = this.swipper.currentStyle || window.getComputedStyle(this.swipper);
        const width_swipper = parseInt(style_swipper.width);

        const limit = width_swipper - width_container;

        const margin_child = this.getMarginChild();

        return {
            limit,
            width_container,
            width_swipper
        }
    }

    getMarginChild(){

    }

    getTranslateVariable() {
        const style_swipper = this.swipper.currentStyle || window.getComputedStyle(this.swipper);
        const translate = parseInt(style_swipper.getPropertyValue("--translate") || 0);
        return translate;
    }

    add_events_to_children() {
        Array.from(this.children).forEach((element) => {
            this.event_to_child(element);
        });
    }

    remove_events_to_children(){
        Array.from(this.children).forEach((element)=>{
            this.remove_event_to_child(element);
        });
    } 

    event_to_child(element){
        element.onclick = (event) => {
            event.stopPropagation();
            const bound_child = this.getBound(element);
            const bound_container = this.getBound(this.container);
            const diference = bound_child.left - bound_container.left;
            var translate = 0;
            if (diference > 0) {
                translate = this.getTranslateX() - diference;
            } else {
                translate = this.getTranslateX() + Math.abs(diference);
            }
            if (Math.abs(translate) > this.limit) {
                translate = this.limit * -1;
            }
            this.swipper.style.setProperty("--translate", translate + "px");
        }
    }

    remove_event_to_child(element){
        element.onclick = null;
    }

    remove_active_class() {
        Array.from(this.children).forEach((element) => {
            element.classList.remove("active");
        })
    }

    drag_and_drop() {
        this.swipper.addEventListener('mousedown', (event) => {
            const start_mouse_X = event.clientX;
            event.preventDefault();
            this.swipper.style.transition = "all ease 0.0s";
            let movement = this.translate;

            let onMouseMove = (event_window) => {
                const x_move = event_window.clientX;
                if (x_move > start_mouse_X) {
                    movement = x_move - start_mouse_X;
                } else {
                    movement = (start_mouse_X - x_move) * -1;
                }
        
                let new_movement = this.translate + movement;
        
                if (new_movement < (this.limit * -1)) {
                    new_movement = this.limit * -1;
                    this.translate = this.limit * -1;
                    movement = 0;
                } else if (new_movement > 0) {
                    new_movement = movement = 0;
                    this.translate = 0;
                }
        
        
                this.swipper.style.transform = `translateX(${new_movement}px)`;
            };

            document.addEventListener('mousemove', onMouseMove);
            document.onmouseup = () => {
                this.translate = this.translate + movement;
                document.removeEventListener('mousemove', onMouseMove);
                document.onmouseup = null;
            }
        });

        this.swipper.addEventListener('touchstart', (event) => {
            const touched = event.touches[0];
            const start_mouse_X = touched.clientX;
            event.preventDefault();
            this.swipper.style.transition = "all ease 0.0s";
            let movement = this.translate;

            let onMouseMove = (event_window) => {
                const touched_move = event_window.touches[0];
                const x_move = touched_move.clientX;
                if (x_move > start_mouse_X) {
                    movement = x_move - start_mouse_X;
                } else {
                    movement = (start_mouse_X - x_move) * -1;
                }
        
                let new_movement = this.translate + movement;
        
                if (new_movement < (this.limit * -1)) {
                    new_movement = this.limit * -1;
                    this.translate = this.limit * -1;
                    movement = 0;
                } else if (new_movement > 0) {
                    new_movement = movement = 0;
                    this.translate = 0;
                }
        
        
                this.swipper.style.transform = `translateX(${new_movement}px)`;
            };

            document.addEventListener('touchmove', onMouseMove);
            document.ontouchend = () => {
                this.translate = this.translate + movement;
                document.removeEventListener('touchmove', onMouseMove);
                document.ontouchend = null;
            }
        });
    }

    
}

class newSwipper{

    swipper = null;
    swipper_envold = null;
    swipper_container = null;
    next = null;
    prev = null;
    dimensionControls = "20px";
    children = [];
    children_selected_class = "";
    childre_clicked_class = "click-touch";
    width_child = null;
    limit = 0;
    translate = 0;

    clicked = 0;

    formatMethod = null;

    cloneChildAux = null;


    constructor(){
        const enter_arguments = arguments;
        if(this.evaluate(enter_arguments)){
            this.init();
        }
    }

    evaluate(arg){
        const length = arg.length;

        let first, second;

        if(length == 0){
            throw new Error("Se esperaba 1/2 argumentos. Se obtuvieron 0 argumentos");
        }
        if(length > 1){
            second = arg[1];
        }
        first = arg[0];

        if(typeof first === "string"){
            this.swipper_container = document.getElementById(first);
            if(!this.swipper_container){
                throw new Error("No se encotró ningún elemento con el id", first);
            }
        }else if(!this.isHTMLElement(first)){
           throw new Error("Elemento no válido");
        }

        if(typeof second === "string"){
            const children = this.swipper_container.getElementsByClassName(second);
            // console.log(children);
            if(children.length == 0){
                throw new Error("No se encontraron elementos con la clase", second);
            }

            this.validate_children(children);
        }else if(!second instanceof HTMLCollection){
            throw new Error("Elemento no válido", arg[1]);
         }

        if(length >= 3){
            this.options(arg[2]);
        }

        return true;
    }


    validate_children(children){
        Array.from(children).forEach((child) => {
            const parent = child.parentElement;
            if(this.swipper_container == parent){
                this.children.push(child);
            }
        });

        if(this.children.length == 0){
            throw new Error("La disposición de los elementos hijos no es la adecuada. Por favor, asegurese de que los elementos con la clase", second, "sean hijos directos del elemento con el id", first);
        }
    }

    options(options){
        if(!typeof options.toLowerCase() == "object"){
            console.warn("El tipo de dato", typeof options, "no esta admitido como opciones.");
        }
        this.children_selected_class = options.classActive ?? '';
    }

    init(){
        this.constructorContainer();
        this.swipper_envold = this.constructorSwipperContainer()
        this.swipper = this.constructorSwipper();
        this.next = this.constructorNextControl();
        this.prev = this.constructorPrevControl();

        this.print();
        this.events();
    }

    constructorContainer(){
        this.swipper_container.innerHTML = '';
        const width = this.getCssProperty(this.swipper_container,"width");
        // this.swipper_container.style.width = width == "0px" ? "100%" : width;
        this.swipper_container.style.width = "100%";
        this.swipper_container.style.maxWidth = "100%";
        // this.swipper_container.style.overflow = "hidden";
        const position = this.getCssProperty(this.swipper_container, "position").toLowerCase();
        this.swipper_container.style.position = position == 'static' ? 'relative' : position;
    }

    constructorSwipperContainer(){
        const swipper = document.createElement("div");
        swipper.className = "swipper_container";
        return swipper;
    }

    constructorSwipper(){
        const swipper = document.createElement("div");
        swipper.className = "swipper_container_children";
        return swipper;
    }

    constructorNextControl(){
        const next = document.createElement("div");
        next.className = "next";

        const icon = document.createElement("img");
        icon.setAttribute("src", "./resouces/next.svg");
        icon.style.width = icon.style.height = this.dimensionControls;
        next.appendChild(icon);
        return next;
    }

    constructorPrevControl(){
        const prev = document.createElement("div");
        prev.className = "prev";
        const icon = document.createElement("img");
        icon.setAttribute("src", "./resouces/prev.svg");
        icon.style.width = icon.style.height = this.dimensionControls;
        prev.appendChild(icon);
        return prev;
    }

    print(){
        this.swipper_container.appendChild(this.swipper_envold);
        this.swipper_envold.appendChild(this.swipper);
        this.swipper_container.appendChild(this.prev);
        this.swipper_container.appendChild(this.next);
        
        
        this.printChild();
    }

    printChild(){
        this.children.forEach( child => {
            this.swipper.appendChild(child);
            this.inyect_data_to_children_to_child(child);
        });

        this.child_selected = this.children[0];
    }

    inyect_data_to_children_to_child(child){

        
        const data = child.dataset.value ?? ''

        const children_to_child = child.getElementsByClassName("click-touch");

        Array.from(children_to_child).forEach(child => {
            child.dataset.value = data;
        });
    }

    events(){
        this.eventNextControl();
        this.swipperControl();
        this.childControl();
    }

    eventNextControl(){
        this.next.addEventListener('click', (event) => {
            this.translateNexOrPrev(true);
        });

        this.prev.addEventListener('click', (event) => {
            this.translateNexOrPrev();
        });
    }

    translateNexOrPrev(goRight = 0){

        this.limit = this.getLimit().limit;
        if(goRight == 0){
            this.activatePrevElement();
        }else if(goRight == 1){
            this.activateNextElement(); 
        }else{
            this.activateWithClick();
        }

        let newTranslate = 0;

        const positionChild = this.getPosition(this.child_selected);
        const positionSwipper = this.getPosition(this.swipper_container);

        // * RIGHT POSITION
        const childRight = positionChild.left + positionChild.width;
        const swipperRight = positionSwipper.left + positionSwipper.width;
        const right = childRight - swipperRight;
        if(right > 0){
            newTranslate = this.translate + right;
            this.translate = newTranslate > this.limit ? this.limit : newTranslate;
            this.translateSlowSwipper();
        }
        
        // * LEFT POSITION
        const childLeft = positionChild.left;
        const swipperLeft = positionSwipper.left;
        const left = childLeft - swipperLeft;
        if(left < 0){
            newTranslate = this.translate + left;
            this.translate = newTranslate < 0 ? 0 : newTranslate;
            this.translateSlowSwipper();
        }
    }

    getLimit(){
        const style_container = this.swipper_container.currentStyle || window.getComputedStyle(this.swipper_container);
        const width_container = parseInt(style_container.width);

        const style_swipper = this.swipper.currentStyle || window.getComputedStyle(this.swipper);
        const width_swipper = parseInt(style_swipper.width);

        const limit = width_swipper - width_container;
        return {
            limit,
            width_container,
            width_swipper
        }
    }

    getTranslateX() {
        const style = this.swipper.currentStyle || window.getComputedStyle(this.swipper);
        const matrix = new WebKitCSSMatrix(style.transform);
        return matrix.m41;
    }

    getPosition(element){
        const bound = element.getBoundingClientRect();
        return {
            left: bound.left,
            width: bound.width
        };
    }

    getcloserRight(positionParent){
        let flag = false;
        let childReturn = null;
        let diference = 0;
        this.children.forEach((child) => {
            const positionX = this.getPosition(child).left;
            let auxDiff = positionX - positionParent;
            child.classList.remove(this.children_selected_class || "active");
            if(auxDiff > 0 && !flag){
                flag = true;
                childReturn = child;
                diference = auxDiff;
                child.classList.add(this.children_selected_class || "active");
            }
        });

        if(!flag){
            childReturn = this.children[0];
        }

        return { diference, childReturn };
    }

    activateNextElement(){
        const limit = this.children.length - 1;
        let flag = 0;
        const className = this.children_selected_class || "active";
        this.children.forEach((child, index) => {
            if(child.classList.contains(className) && index < limit && flag == 0){
                flag = 1;
                child.classList.remove(className);
            }else if(flag == 1){
                child.classList.add(className);
                this.child_selected = child;
                flag = 2;
            }
        });
    }

    activatePrevElement(){
        let length = this.children.length - 1;
        let flag = 0;
        const className = this.children_selected_class || "active";
        for(let i = length; i >= 0; i--){
            const child = this.children[i]
            if(child.classList.contains(className) && i > 0 && flag == 0){
                flag = 1;
                child.classList.remove(className);
            }else if(flag == 1){
                child.classList.add(className);
                flag = 2;
                this.child_selected = child;
            }
        }
    }

    activateWithClick(){
        const className = this.children_selected_class || "active";
        this.children.forEach((child) => {
            child.classList.remove(className);
        });

        this.child_selected.classList.add(className);
    }

    translateSlowSwipper(){
        this.swipper.style.transition = `all ease 0.3s`;
        this.translateSwipper();
    }

    translateSwipper(){
        this.swipper.style.transform = `translateX(${this.translate * -1}px)`;
    }

    translateForceSwipper(){
        this.swipper.style.transition = `all ease 0.0s`;
        this.translateSwipper();
    }

    swipperControl(){

        this.swipper.addEventListener('mousedown', (event) => {
            event.preventDefault();
            this.clicked = 0;
            
            console.info("Arrastrar");
            
            this.limit = this.getLimit().limit;

            const start_mouse_X = event.clientX;
            let last_movement = this.translate;
            // this.swipper.style.transition = "all ease 0.0s";

            let onMouseMove = (event_window) => {
                if(this.limit > 0){
                    this.clicked++;
                    console.log("Se movió");
                    const x_move = event_window.clientX;
                    let move = start_mouse_X - x_move;
                    const new_movement = last_movement + move;
                    if(new_movement < 0){
                        this.translate = 0;
                    }else if(new_movement > this.limit){
                        this.translate = this.limit;
                    }else{
                        this.translate = last_movement  + move;
                    }
                    
                    this.translateForceSwipper();
                }

            }

            document.addEventListener('mousemove', onMouseMove);
            document.onmouseup = () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.onmouseup = null;
            }
        });

        this.swipper.addEventListener('touchstart', (event) => {
            event.preventDefault();
            event.stopPropagation();
            this.clicked = 0;

            this.limit = this.getLimit().limit;

            const touched = event.touches[0];
            const start_mouse_X = touched.clientX;
            let last_movement = this.translate;

            // this.swipper.style.transition = "all ease 0.0s";

            let onMouseMove = (event_window) => {
                this.clicked++;
                const touched_move = event_window.touches[0];
                const x_move = touched_move.clientX;
                let move = start_mouse_X - x_move;

                const new_movement = last_movement + move;

                if(new_movement < 0){
                    this.translate = 0;
                }else if(new_movement > this.limit){
                    this.translate = this.limit;
                }else{
                    this.translate = last_movement + move;
                }

                this.translateForceSwipper();
            };

            document.addEventListener('touchmove', onMouseMove);
            document.ontouchend = (event) => {
                document.removeEventListener('touchmove', onMouseMove);
                document.ontouchend = null;
            }
        });
    }

    childControl(){
        this.children.forEach(child => {

            child.ontouchend = (event) => {
                this.clickEvent(child, event);
            };

            child.onclick = (event) => {
                this.clickEvent(child, event);
            };
        });
    }

    clickEvent = (child, event) => {
        if(this.clicked < 5){
            this.clicked = 0;
            if(this.child_selected != child){
                this.child_selected = child;
                this.translateNexOrPrev(2);
                event.preventDefault();
            }else{
                if(event.type == "touchend"){
                    this.click_to_child_element(child, event.target);
                }
            }
        }
        this.clicked = 0;
    }

    click_to_child_element(parent, element){
        const children = parent.getElementsByClassName(this.childre_clicked_class);
        Array.from(children).forEach(child => {
            if(child.contains(element)){
                child.click();
            }
        });
    }

    remove(className = ""){

        const length = this.children.length;
        this.cloneChildAux = length == 1 ? this.children[0].cloneNode(true) : null;
        for(let i = 0; i < length; i++){

            const child = this.children[i];

            if(child.classList.contains(className) || child.dataset.value == className){
                child.ontouchend = child.onclick = null;

                child.classList.add("desapearing");

                setTimeout(()=>{
                    if(child == this.child_selected){
                        if(i != length - 1){
                            this.child_selected = this.children[i + 1];
                            this.translateNexOrPrev(2);
                        }
                    } 
                    this.swipper.removeChild(child);
    
                    this.children.splice(i,1);
                },600);

                break;
            }
        }
    }

    /**
     * 
     * 
     * Esto es una función
     * 
     * Al pasarle una funcion, ésta devolverá un elemento clonado de los elementos hijos;
     * 
     * y el callback deberá devolver el mismo elemento u otro elemento html
     * 
     * para agregar al swipper.
     * 
     * También puedes pasar un objeto, este será usado en el método personalizado que hayas
     * 
     * definido previamente para imprimir distintos elementos al swipper.
     * 
     * 
     * El objeto deberá contener el identificador único para cada elemento
     * 
     * @typedef {(object: HTMLElement) => HTMLElement} Callback
     * 
     * @param {Callback | {identifier: string, data: any}} callback Funcion u objeto
     * @param {string} [identifier] 
     * 
     * @example
     *  newSwipper.clone((element) => {
     *      element.innerHTML = "<span>Hello World!</span>";
     *      return element;
     * })
     * 
     *  newSwipper.clone({
     *      data: any,
     *      name: any
     * })
     * 
     */
    clone(callback, identifier = ""){
        if(this.children.length == 0){
            console.info("No existen elementos para clonar.")
            return;
        }

        let cloneNode = this.children[0].cloneNode(true);
        const type = (typeof callback).toLowerCase();
        
        if(type != "function" && type != "object"){
            console.error("El callback debe ser de tipo 'function | object',", typeof callback, "dado");
            return;
        }

        if(type == "object" && !callback.data){
            console.error("Formato de objecto icorrecto.");
            return;
        }

        if((type == "object" && !callback.identifier) || type == "function"){
            identifier = identifier == "" ? this.make_id(10) : identifier;
        }

        let new_child = null;
        try{
            new_child = callback(cloneNode) || this.formatMethod(cloneNode);
        }catch(error){
            console.error(error);
            return;
        }

        if(new_child == null){
            console.error("El callback debe retornar un valor.");
            return;
        }

        if(!this.isHTMLElement(new_child)){
            console.error("El callback debe devolver un elemento html.");
            return;
        }

        new_child.dataset.value = identifier;

        this.add_new_child(new_child);
    }

    add_new_child(child){
        console.log(child);

        child.ontouchend = (event) => {
            this.clickEvent(child, event);
        };

        child.onclick = (event) => {
            this.clickEvent(child, event);
        };

        this.swipper.appendChild(child);
        this.children.push(child);

        this.inyect_data_to_children_to_child(child);
    }

    reload(){

    }

    clean(){
        if(this.children.length != 0){

            this.cloneChildAux = length == 1 ? this.children[0].cloneNode(true) : null;

            Array.from(this.children).forEach((child, i) => {
                const delay = (0.1 * i);
                child.style.setProperty("--delay", delay + "s");
                child.classList.add("destroy");

                console.log(delay * 1000);

                setTimeout(()=>{
                    this.swipper.removeChild(child);
                }, (delay * 1000 + 1000));
            });

            this.children = [];
        }
    }

    reload_with_new_data(){
        const length_args = arguments.length;

        if(length_args == 0){
            console.log("Se esperaba 1 | 2 argumento(s). Se obtuvieron 0");
        }

        const first = arguments[0];

        if(!(typeof first).toLowerCase() == "number" && !(typeof first).toLowerCase() == "object" && !(typeof first).toLowerCase() == "function"){
            console.error("Se esperaba como argumento un número, una función o un objeto iterable. Se obtuvo", typeof first);
            return;
        }

        if(!(typeof first).toLowerCase() == "number" && first < 1){
            console.error("La cantidad de iteraciones no debe ser un número negativo.");
            return;
        }
        if(!(typeof first).toLowerCase() == "object" && first.length == 0){
            console.error("El objeto debe contener más de 0 elementos");
            return;
        }

        let second = null;
        if(length_args == 2){
            second = arguments[1];
        }

        let third = null;
        if(length_args == 3){
            third = arguments[2];
        }

        if(third && !(typeof third).toLowerCase() != "string"){
            console.log("Se esperaba un string como argumento. Se obtuvo", typeof third);
            return;
        }

        if(second && (!(typeof second).toLowerCase() == "function" && !(typeof second).toLowerCase() == "string")){
            console.error("Se esperaba una función como argumento. Se obtuvo", typeof second);
            return;
        }

        if(second && !(typeof first).toLowerCase() == "number"){
            console.log("Se esperaba un número como argumento. Se obtuvo", typeof first);
            return;
        }


        if(second){
            for(let i = 0; i < first; i++){
                const element = this.cloneChildAux.cloneNode(true);
                let new_child = (typeof second) == "function" ? second(element) : this.formatMethod(element);

                if(new_child == null){
                    console.error("La función debe retornar un valor.");
                    break;
                }
        
                if(!this.isHTMLElement(new_child)){
                    console.error("La función debe devolver un elemento html.");
                    break;
                }

                const identifier = (typeof second) == "string" ? second : third ? third : this.make_id(10);
                new_child.dataset.value = identifier;
                
    
                this.add_new_child(new_child);
            }
        }


    }

    evaluate_first_argument(arg){
    }

    getCssProperty(element, property = null){
        const style = getComputedStyle(element);
        if(property){
            return style[property];
        }
        return style;
    }

    isHTMLElement(o) {
        return (
            typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
            o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName === "string"
        );
    }

    make_id(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    }
}

class Calendar extends YearsList {

    // El selector principal que será construído por JS
    container_select = null;

    // El disparador para ocultar / mostrar contenido
    label_container = null;
    toggle = null;
    input_toggle = null;


    // El contenedor del calendario y el calendario en sí
    calendar_container = null;
    calendar = null;

    // Divididor
    divider = null;

    // Encabezado del calendario
    header_calendar = null;
    header_title = null;
    header_button_next = null;
    header_button_prev = null;

    // Cuerpo del calendario
    calendar_body = null;

    // * NUEVO
    calendar_body_days = null;
    calendar_body_months = null;
    calendar_body_years = null;

    row_day_names = null;

    id = "";

    days = {
        col: 7,
        row: 6
    };

    // Primera fila del grid que contiene los nombres de la semana
    days_name = {};

    // Contiene una matriz con todos los días mostrados en el calendario
    days_matrix = [];

    // Calendar variables
    monthAux = null;
    monthCalentar = 0;
    yearCalendar = 0;

    // Fecha exacta del dío actual
    current_month_name = "";
    current_day_month = 0;
    current_day = 0;
    current_year = 0;
    current_month = 0;

    date_selected = {};
    date_selected_end = {};

    month_selected = {};

    monthsNames = ["Enero", "Febrero", "Marzo", "April", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    months_short = ["Ene", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dic"];

    daysNames = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"];
    days_short = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];

    timer_sostain_click= null;
    sostain_click = false;
    sostain_click_time_out = 1000;

    timer_menu_options = null;
    menu_option_selected = null;
    menu_options = null;
    option_button = null;
    is_targeted_date = false;

    positions = {
        day: {
            pos: 0,
            length: 2
        },
        month: {
            pos: 1,
            length: 2
        },
        year: {
            pos: 2,
            length: 4
        },
        separator: "-"
    };

    min_date = null;
    max_date = null;
    event = null;

    customInput = null;

    constructor(id) {
        super();
        if (typeof id != "string" && !this.isHTMLElement(id)) {
            return new Error('Error: El argumento debe ser de tipo string u objeto html')
        }

        if (typeof id === 'string') {
            this.container_select = document.getElementById(id);
        }

        if (!this.isHTMLElement(this.container_select)) {
            return new Error('Error: No se encontró ningún elemento html');
        }

        const children = this.container_select.children;

        if(children){
            this.evaluate_input(children[0]);
        }

        this.init();
    }

    isHTMLElement(o) {
        return (
            typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
            o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName === "string"
        );
    }

    evaluate_input(input){
        if(!this.isHTMLElement(input)){
            return;
        }

        if(input.nodeName.toLowerCase() != "input"){
            return;
        }

        if(input.getAttribute("type").toLowerCase() != "text"){
            console.warn("El input debe ser de tipo texto.");
            return;
        }

        this.customInput = input;
    }

    init() {
        this.evaluate_entries();
        this.id = this.make_id(5);
        this.label_container = this.constructor_toggle();
        this.input_toggle = this.constructor_toggle_input();

        this.divider = this.create_element('div', "divider");

        this.calendar_container = this.constructor_calendar_container();
        this.header_calendar = this.constructor_calendar_header();

        // ? DIAS DEL CALENDARIO
        this.calendar_body = this.constructor_calendar_body();
        // ? MESES DEL CALENDARIO
        this.calendar_body_days = this.constructor_calendar_days();

        this.row_day_names = this.constructor_calendar_days_name(this.calendar_body_days);
        this.days_matrix = this.constructor_days(this.calendar_body_days);

        this.menu_options = this.constructor_menu_options();


        this.calendar_body_months = this.constructor_calendar_months();
        this.calendar_months = this.constructor_months(this.calendar_body_months);


        this.calendar_body_years = this.constructor_calendar_years();

        this.container_select.innerHTML = "";
        this.container_select.classList.add("toggle_container");
        if(this.customInput){
            this.container_select.appendChild(this.customInput);
        }


        this.init_calendar();
        
        this.container_select.appendChild(this.label_container);
        this.container_select.appendChild(this.input_toggle);
        this.container_select.appendChild(this.calendar_container);

        this.calendar.appendChild(this.header_calendar);
        this.calendar.appendChild(this.divider);
        this.calendar.appendChild(this.calendar_body);

        this.calendar_body.appendChild(this.calendar_body_days);
        this.calendar_body.appendChild(this.calendar_body_months);
        this.calendar_body.appendChild(this.calendar_body_years);


        this.asignate_new_height_to_calendar(this.calendar_body_days);

        this.event_month_button();

        this.event_menu();

        this.init_year_list();

        this.event_year_button();

        // this.event_months();
        // ! DEPRECADO
        // this.event_controls();

    }

    evaluate_entries(){
        let dataset = this.container_select.dataset;

        let min_max = [false, false];

        if(dataset.min){
            min_max[0] = this.evaluate_min_max(dataset.min);
        }
        if(dataset.max){
            min_max[1] = this.evaluate_min_max(dataset.max, true);
        }
        if(dataset.format){
            this.evaluate_format(dataset.format);
        }
        if(dataset.eventName){
            this.event = dataset.eventName;
        }
        if(!min_max.includes(false) && this.min_date > this.max_date){
            console.error("La fecha mínima no debe ser mayor a la fecha máxima. Lo arreglaría yo, pero no voy a andar arreglando tus kgdas >:v.");
            this.min_date = this.max_date = null;
        }
    }

    evaluate_format(format){
        const bad_format = () => {
            console.error('El formato es incorrecto.');
            this.positions = {
                day: {
                    pos: 0,
                    length: 2
                },
                month: {
                    pos: 1,
                    length: 2
                },
                year: {
                    pos: 2,
                    length: 4
                },
                separator: "-"
            };
            return;
        }

        let aux = format.split("-");
        this.positions.separator = "-";
        if(aux.length != 3){
            aux = format.split("/");
            this.positions.separator = "/";
        }

        const array_format = aux; 

        if(array_format.length != 3){
            return bad_format();
        }

        if(
            array_format[0].length == 0 ||
            array_format[1].length == 0 ||
            array_format[2].length == 0
        ){
            return bad_format();
        }

        let flags = [false, false, false];

        array_format.forEach((data, index) => {
            if((data[0] == 'm' || data[0] == "M" && data.length > 1 && data.length < 5) && !flags[0]){
                this.positions.month.pos = index;
                this.positions.month.length = data.length;
                flags[0] = true;
            }
            if(data[0] == 'd' || data[0] == "D" && !flags[1] && data.length > 1 && data.length < 5){
                this.positions.day.pos = index;
                this.positions.day.length = data.length;
                flags[1] = true;
            }
            if(data[0] == 'y' || data[0] == "Y" && !flags[2] && (data.length == 2 || data.length == 4)){
                this.positions.year.pos = index;
                this.positions.year.length = data.length;
                flags[2] = true;
            }
        });
        if(flags.includes(false)){
            bad_format();
        }
        
    }

    evaluate_min_max(data, max = false){
        const bad_format = () => {
            console.error('El formato es incorrecto.');
            this.positions = {
                day: {
                    pos: 0,
                    length: 2
                },
                month: {
                    pos: 1,
                    length: 2
                },
                year: {
                    pos: 2,
                    length: 4
                },
                separator: "-"
            };
            return false;
        }

        let aux = data.split("-");
        if(aux.length != 3){
            aux = data.split("/");
        }

        const array_format = aux; 

        if(array_format.length != 3){
            return bad_format();
        }

        if(
            array_format[0].length == 0 ||
            array_format[1].length == 0 ||
            array_format[2].length == 0
        ){
            return bad_format();
        }

        if(array_format[2].length == 4 && array_format[0].length == 2){
            let aux = array_format[0];
            array_format[0] = array_format[2];
            array_format[2] = aux;
        }

        const format = {
            year: array_format[0],
            dayMonth: array_format[2],
            month: array_format[1]
        }
        const limit = this.get_time_to_container_day(format, true);
        if(!isNaN(limit)){
            if(max){
                this.max_date = limit;
            }else{
                this.min_date = limit;
            }
            return true;
        }else{
            return bad_format();
        }


    }

    constructor_toggle() {
        const label_container = this.create_element("label", "toggle_menu", [{
            attr: "for",
            val: this.id
        }]);
        const icon_calendar = this.create_element("img", "icon_calendar", [{
            attr: "src",
            val: "./resouces/calendar_icon.svg"
        }]);
        const label = this.create_element("span", "label");
        const icon_arrow = this.create_element("img", "arrow_open", [{
            attr: "src",
            val: "./resouces/arrow_menu_black.svg"
        }]);

        // * NUEVO
        const aux_container = this.create_element('div', 'container_label');

        // label_container.appendChild(icon_calendar);
        // label_container.appendChild(label);
        // label_container.appendChild(icon_arrow);

        aux_container.appendChild(icon_calendar);
        aux_container.appendChild(label);
        label_container.appendChild(aux_container);
        label_container.appendChild(icon_arrow);

        this.toggle = label;
        return label_container;
    }

    constructor_toggle_input() {
        const input = this.create_element("input", "toggle_menu_input", [{
            attr: "id",
            val: this.id
        }, {
            attr: "type",
            val: "checkbox"
        }, {
            attr: "checked",
            val: "true"
        }]);
        input.classList.add("toggle_input_menu");
        return input; 
    }

    constructor_calendar_container() {
        const calendar_container = this.create_element("div", "calendar_container");
        const calendar = this.create_element("div", "calendar");
        calendar_container.appendChild(calendar);
        this.calendar = calendar;
        return calendar_container;
    }

    constructor_calendar_header() {
        const header_calendar = this.create_element("div", "calendar_head");
        const header_title = this.create_element("div", "head_left");
        const attr_icons = [{
            attr: "src",
            val: "./resouces/arrow_menu_withe.svg"
        }];

        // ! Deprecado
        // * Botones del calendario
        const header_buttons_container = this.create_element("div", "head_right");
        const header_button_next = this.create_element("button", "ripple");
        const button_next_icon = this.create_element("img", "icon_next", attr_icons);
        const header_button_prev = this.create_element("button", "ripple");
        const button_prev_icon = this.create_element("img", "icon_next", attr_icons);

        // * NUEVO HEAD RIGHT
        const month_name = this.create_element('div', 'month_name');

        

        // * Injección al DOM
        header_calendar.appendChild(header_title);
        header_calendar.appendChild(header_buttons_container);

        // ! Deprecado
        // header_buttons_container.appendChild(header_button_prev);
        // header_button_prev.appendChild(button_prev_icon);
        // header_buttons_container.appendChild(header_button_next);
        // header_button_next.appendChild(button_next_icon);

        header_buttons_container.appendChild(month_name);

        this.header_title = header_title;
        this.header_title_month = month_name;
        this.header_button_next = header_button_next;
        this.header_button_prev = header_button_prev;

        return header_calendar;
    }

    constructor_calendar_body() {
        const calendar_body = this.create_element("div", "calendar_body");
        return calendar_body;
    }

    constructor_calendar_days() {
        const calendar_body_days = this.create_element("div", "calendar_body_days show");
        return calendar_body_days;
    }

    constructor_calendar_months() {
        const calendar_body_months = this.create_element("div", "calendar_body_months");
        return calendar_body_months;
    }

    constructor_calendar_years() {
        const calendar_body_years = this.create_element("div", "calendar_body_years");
        return calendar_body_years;
    }

    constructor_calendar_days_name(container) {
        // Se crea la fila de los nombres de los días
        const row_day_names = this.create_element("div", "row_calendar row_head");
        this.days_name.row = row_day_names;
        this.days_name.col = [];
        const days = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];
        for (var i = 0; i < this.days.col; i++) {
            var day_name = {};
            day_name.name = days[i];

            var day_name_container = this.create_element("div", "day_name");
            var span_name = this.create_element("span", "day_name_span");
            day_name_container.appendChild(span_name);
            this.days_name.row.appendChild(day_name_container);
            span_name.innerHTML = day_name.name;
            day_name.label = span_name;

            this.days_name.col.push(day_name);

        }

        container.appendChild(row_day_names);
        return row_day_names;
    }

    constructor_days(days_container) {
        var days = [];

        // Inicio de todo
        // this.monthAux = new Date(this.yearCalendar, this.monthCalendar, 1);
        // let firstWeek = this.monthAux.getDay();
        // firstWeek--;
        // if (firstWeek == -1) {
        // firstWeek = 6;
        // }

        // let diasPrimerMes = this.monthAux.getDate();
        // let firstColumn = diasPrimerMes - firstWeek;
        // let start = this.monthAux.setDate(firstColumn);

        // let auxDayMonth = new Date();
        // auxDayMonth.setTime(start);

        for (var i = 0; i < this.days.row; i++) {
            var row_days = {};
            var row = this.create_element("div", "row_calendar row_days");
            row_days.row_container = row;
            row_days.day = [];
            for (var j = 0; j < this.days.col; j++) {
                var col = {};
                var day_container = this.create_element("div", "col_day");
                var label = this.create_element("span", "day_label");

                col.container = day_container;
                col.label = label;

                day_container.appendChild(label);
                row_days.row_container.appendChild(day_container);

                row_days.day.push(col);
                this.event_days(day_container);
            }
            days.push(row_days);
            days_container.appendChild(row_days.row_container);
        }

        // console.log(this.days_matrix);
        return days;
        // this.days_matrix = days;
    }

    constructor_menu_options(){
        const menu_container = this.create_element('div', 'menu_container');
        const option = this.create_element('div', 'option');
        option.innerHTML = "Marcar";
        menu_container.appendChild(option);
        menu_container.classList.add("ripple");

        return menu_container;
    }

    constructor_months(months_container){
        let month_number = 0;
        let today = new Date();
        let current_month = today.getMonth();
        for(let i = 0; i < 4; i++){
            const row_month = this.create_element("div", "row_month");
            months_container.appendChild(row_month);
            for(let j = 0; j < 3; j++){
                
                const month = this.create_element('div', "month ripple", [
                    {
                        attr: "data-month",
                        val: month_number+ ""
                    }
                ]);
                month.innerHTML = this.monthsNames[month_number];
                row_month.appendChild(month);
                if(current_month == month_number){
                    this.month_selected.element = month;
                    this.month_selected.month = month_number;
                    month.classList.add('select');
                }
                month_number++;
                this.event_months(month);
            }
        }
    }

    init_calendar() {
        let today = new Date();
        let month = today.getMonth()
        let year = today.getFullYear()
        let day = today.getDay();
        let dayMonth = today.getDate();
        this.monthCalendar = this.current_month = month;
        this.yearCalendar = this.current_year = year;
        this.current_month_name = this.monthsNames[month];
        this.current_day = day;
        this.current_day_month = dayMonth;

        this.date_selected.dayMonth = dayMonth;
        this.date_selected.day = day;
        this.date_selected.month = month + 1;
        this.date_selected.year = year;

        this.load_Calendar();
        this.print_current_date_label();
    }

    load_Calendar() {
        // Inicio de todo
        this.monthAux = new Date(this.yearCalendar, this.monthCalendar, 1);
        let firstWeek = this.monthAux.getDay();
        firstWeek--;
        if (firstWeek == -1) {
            firstWeek = 6;
        }

        let diasPrimerMes = this.monthAux.getDate();
        let firstColumn = diasPrimerMes - firstWeek;
        let start = this.monthAux.setDate(firstColumn);

        let auxDayMonth = new Date();
        auxDayMonth.setTime(start);

        let prev_month = false;
        for (var i = 0; i < this.days.row; i++) {
            for (var j = 0; j < this.days.col; j++) {
                let currentDayMonth = auxDayMonth.getDate();
                let currentMonth = auxDayMonth.getMonth();
                let currentYear = auxDayMonth.getFullYear();
                let currentDay = auxDayMonth.getDay() == 0 ? 7 : auxDayMonth.getDay();
                let auxDay = {};

                // Se guarda el día que se evalúa
                auxDay.dayMonth = currentDayMonth;

                // Se el día es domingo
                auxDay.lastDay = j == 7 ? true : false;

                // Si el día está fuera del mes actual
                // auxDay.daysOut = currentMonth != this.monthCalendar ? true : false;

                const auxDateLimits = {
                    dayMonth: auxDayMonth.getDate(),
                    month: auxDayMonth.getMonth(),
                    year: auxDayMonth.getFullYear()
                };

                const date_to_miliseconds = this.get_time_to_container_day(auxDateLimits, true);
                if(currentMonth != this.monthCalendar){
                    auxDay.daysOut = true;
                }

                if(this.min_date && date_to_miliseconds < this.min_date){
                    auxDay.daysOut = true;
                }
                if(this.max_date && date_to_miliseconds > this.max_date){
                    auxDay.daysOut = true;
                }

                // Si el día actual es igual al día evaluado
                if (currentMonth == this.current_month && currentYear == this.current_year && currentDayMonth == this.current_day_month) {
                    auxDay.today = true;
                }

                if (this.date_selected.dayMonth == currentDayMonth && this.date_selected.year == currentYear && (this.date_selected.month - 1) == currentMonth) {
                    auxDay.daySelected = true;
                }

                // Se incrementa en uno el día actual
                currentDayMonth = currentDayMonth + 1;
                auxDayMonth.setDate(currentDayMonth);

                // Se guarda la fecha en variable
                auxDay.month = this.monthCalendar + 1;
                auxDay.year = this.yearCalendar;
                auxDay.day = currentDay;

                this.days_matrix[i].day[j].date_object = auxDay;
                this.days_matrix[i].day[j].today = auxDay.today;

                if (auxDay.daysOut) {
                    this.days_matrix[i].day[j].container.className = "col_day notMonth";
                } else {
                    this.days_matrix[i].day[j].container.className = "col_day";
                }

                if (auxDay.today) {
                    this.days_matrix[i].day[j].container.classList.add("current");
                }

                if (auxDay.daySelected || (auxDay.today && auxDay.daySelected)) {
                    this.days_matrix[i].day[j].container.classList.add("active");
                }

                if (!prev_month && currentMonth != this.monthCalendar) {
                    auxDay.month--;
                } else {
                    prev_month = true;
                }

                if (prev_month && currentMonth != this.monthCalendar) {
                    auxDay.month++;
                }


                // * Se guardan los datos de la fecha actual
                this.days_matrix[i].day[j].container.dataset.day = auxDay.day;
                this.days_matrix[i].day[j].container.dataset.dayMonth = auxDay.dayMonth;
                this.days_matrix[i].day[j].container.dataset.month = auxDay.month;
                this.days_matrix[i].day[j].container.dataset.year = auxDay.year;
                this.days_matrix[i].day[j].container.dataset.daysOut = auxDay.daysOut ? 'inactive' : 'active';
                if (auxDay.today && auxDay.daySelected) {
                    this.date_selected.container = this.days_matrix[i].day[j].container;
                }

                // * Se guarda la posición en la matriz;
                this.days_matrix[i].day[j].container.dataset.positionX = i;
                this.days_matrix[i].day[j].container.dataset.positionY = j;

                this.days_matrix[i].day[j].label.innerHTML = auxDay.dayMonth;
            }
        }

        this.print_current_date_calendar_head();
    }

    print_current_date_calendar_head() {
        // ! Deprecado
        // this.header_title.innerHTML = this.current_month_name + " " + this.yearCalendar;
        this.header_title.innerHTML = this.yearCalendar;
        this.header_title_month.innerHTML = this.current_month_name;
    }

    print_current_date_label() {
        const dayAux = this.date_selected.dayMonth < 10 ? '0' + this.date_selected.dayMonth : this.date_selected.dayMonth;
        this.toggle.innerHTML = this.months_short[this.date_selected.month - 1] + " " + dayAux + ", " + this.date_selected.year;
    }

    event_controls() {
        this.header_button_next.addEventListener('click', (event) => {
            let newMonth = new Date();
            let timeUnix = this.monthAux.getTime();
            timeUnix = timeUnix + (45 * 24 * 60 * 60 * 1000);
            newMonth.setTime(timeUnix);
            this.monthCalendar = newMonth.getMonth();
            this.yearCalendar = newMonth.getFullYear();
            this.current_month_name = this.monthsNames[this.monthCalendar];
            this.load_Calendar();
            if (Object.entries(this.date_selected_end).length !== 0) {
                this.range_dates();
            }
        });

        this.header_button_prev.addEventListener('click', (event) => {
            let newMonth = new Date();
            this.monthAux--;
            newMonth.setTime(this.monthAux);
            this.monthCalendar = newMonth.getMonth();
            this.yearCalendar = newMonth.getFullYear();
            this.current_month_name = this.monthsNames[this.monthCalendar];
            this.load_Calendar();
            if (Object.entries(this.date_selected_end).length !== 0) {
                this.range_dates();
            }
        });
    }

    event_month_button(){
        this.header_title_month.addEventListener('click', (event) => {
            if(this.calendar_body_months.classList.contains('show')){
                this.calendar_body_days.classList.add('show');
                this.calendar_body_months.classList.remove('show');
                this.calendar_body_years.classList.remove('show');

                this.asignate_new_height_to_calendar(this.calendar_body_days);
            }else{
                this.calendar_body_days.classList.remove('show');
                this.calendar_body_months.classList.add('show');
                this.calendar_body_years.classList.remove('show');

                this.asignate_new_height_to_calendar(this.calendar_body_months);
            }
        });
    }

    event_year_button(){
        this.header_title.addEventListener('click', (event) => {
            if(this.calendar_body_years.classList.contains('show')){
                this.calendar_body_days.classList.add('show');
                this.calendar_body_months.classList.remove('show');
                this.calendar_body_years.classList.remove('show');

                this.asignate_new_height_to_calendar(this.calendar_body_days);
            }else{
                this.calendar_body_days.classList.remove('show');
                this.calendar_body_months.classList.remove('show');
                this.calendar_body_years.classList.add('show');

                this.asignate_new_height_to_calendar(this.calendar_body_years);
            }
        });
    }

    event_months(element_month){
        element_month.addEventListener('click', event => {
            const translateMonth = element_month.dataset.month - this.month_selected.month;

            if(translateMonth != 0){
                let newMonth = new Date(this.yearCalendar, this.monthCalendar + translateMonth, 1);this.monthCalendar = newMonth.getMonth();
                this.yearCalendar = newMonth.getFullYear();
                this.current_month_name = this.monthsNames[this.monthCalendar];
                this.load_Calendar();
                if (Object.entries(this.date_selected_end).length !== 0) {
                    this.range_dates();
                }

                
                this.month_selected.element.classList.remove('select');
                this.month_selected.element = element_month;
                this.month_selected.month = element_month.dataset.month;
                element_month.classList.add('select');
            }
        });
    }

    event_days(element) {
        element.addEventListener('contextmenu', (event) => {
            // console.log(event);            
            this.open_options_menu(element);
        });

        element.addEventListener('click', (event) => {

            if (element.dataset.daysOut == 'active') {
                if (!event.shiftKey && !this.is_targeted_date) {
                    this.remove_menu_options();
                    if (this.date_selected.container) {
                        this.date_selected.container.classList.remove('active');
                    }
                    if (Object.entries(this.date_selected_end).length !== 0) {
                        this.range_dates(true);
                    }
                    this.date_selected.day = element.dataset.day;
                    this.date_selected.dayMonth = element.dataset.dayMonth;
                    this.date_selected.month = element.dataset.month;
                    this.date_selected.year = element.dataset.year;
                    this.date_selected.container = element;
                    element.classList.add('active');
                    this.print_current_date_label();
                } else {
                    this.date_selected_end.day = element.dataset.day;
                    this.date_selected_end.dayMonth = element.dataset.dayMonth;
                    this.date_selected_end.year = element.dataset.year;
                    this.date_selected_end.month = element.dataset.month;
                    this.date_selected_end.container = element;
                    this.range_dates();
                }

                this.eventEmmiter()
            }

            if(this.menu_option_selected){
                this.menu_option_selected.classList.remove('tarjet');
            }
            this.is_targeted_date = false;
            // console.log("Se activa");
        });

        element.addEventListener('touchend', (event) => {

            clearTimeout(this.timer_sostain_click);

            event.stopPropagation();
            // ! OBTIENE EL ELEMENTO EN EL QUE SE DEJO DE PRESIONAR
            let flag = true;
            const quit = event.changedTouches[0];
            let event_target = document.elementFromPoint(quit.clientX, quit.clientY);
            const element_parent_target = event_target.parentElement;
            if (event_target && event_target.nodeName.toLowerCase() == "span" && event_target.classList.contains('day_label')) {
                let aux = event_target.parentElement;
                aux ? event_target = aux : flag = false;
            }else if(element_parent_target && element_parent_target.classList.contains("col_day") && event_target.nodeName.toLowerCase() == "div"){
                event_target = element_parent_target;
            }
            if (!event_target) {
                this.sostain_click = false;
                return;
            }
            if (!event_target.nodeName) {
                this.sostain_click = false;
                return;
            }
            if (!event_target.nodeName.toLowerCase() == "div") {
                this.sostain_click = false;
                return;
            }
            if (!event_target.classList.contains('col_day')) {
                this.sostain_click = false;
                return;
            }
            if (!flag) {
                this.sostain_click = false;
                return
            }

            if (event_target == element){
                if (this.sostain_click){
                    this.open_options_menu(element);
                // }else {
                //     console.log("no lo sostuviste");
                }
                this.sostain_click = false;
            }else{
                return;
            }
            // if (event_target.dataset.daysOut != "inactive") {
            //     this.date_selected.day = element.dataset.day;
            //     this.date_selected.dayMonth = element.dataset.dayMonth;
            //     this.date_selected.month = element.dataset.month;
            //     this.date_selected.year = element.dataset.year;
            //     this.date_selected.container = element;

            //     this.date_selected_end.day = event_target.dataset.day;
            //     this.date_selected_end.dayMonth = event_target.dataset.dayMonth;
            //     this.date_selected_end.year = event_target.dataset.year;
            //     this.date_selected_end.month = element.dataset.month;
            //     this.date_selected_end.container = event_target;
            //     this.range_dates();
            //     this.print_current_date_label();
            // }
        });

        element.addEventListener('touchstart', (event) => {
            this.remove_menu_options();
            this.timer_sostain_click = setTimeout(()=>{
                this.sostain_click = true;
            }, this.sostain_click_time_out);
        })
    }

    open_options_menu(element){
        clearTimeout(this.timer_menu_options);
        if(!this.calendar_body_days.contains(this.menu_options)){
            this.calendar_body_days.appendChild(this.menu_options);
        }

        const bound = this.getPosition(element);
        const bound_parent = this.getPosition(this.calendar_body_days);
        const coo_X = (bound.left - bound_parent.left) + (bound.width / 2);
        const coo_Y = (bound.top - bound_parent.top);
        
        this.menu_options.style.top = coo_Y + "px";
        this.menu_options.style.left = coo_X + "px";
        this.menu_options.style.width = bound.width + "px";
        this.menu_options.style.height = bound.height + "px";
        this.menu_options.style.setProperty("--width", bound.width + "px");
        this.menu_options.classList.add('show');
        this.menu_options.classList.remove('hidden');

        // if(this.menu_option_selected){
        //     this.menu_option_selected.classList.remove('tarjet');
        // }

        this.menu_option_selected = element;

        this.timer_menu_options = setTimeout(()=>{
            this.remove_menu_options();
        }, 5000);
    }

    event_menu(){
        this.menu_options.addEventListener('click', (event) => {
            if(this.menu_option_selected){
                
            
                if (this.date_selected.container) {
                    this.date_selected.container.classList.remove('active');
                    this.date_selected.container.classList.remove('tarjet');
                }
                this.is_targeted_date = true;
                const element = this.menu_option_selected;
                this.date_selected.day = element.dataset.day;
                this.date_selected.dayMonth = element.dataset.dayMonth;
                this.date_selected.month = element.dataset.month;
                this.date_selected.year = element.dataset.year;
                this.date_selected.container = element;
                if (Object.entries(this.date_selected_end).length !== 0) {
                    this.range_dates(true);
                }
                element.classList.add('active');
                element.classList.add('tarjet');
                this.print_current_date_label();
            }

            this.remove_menu_options();
        })
    }

    range_dates(clean = false) {
        let date_init = this.get_time_to_container_day(this.date_selected, true);
        let date_end = 0;
        let range_month = 0;
        if (!clean) {
            date_end = this.get_time_to_container_day(this.date_selected_end, true);
            if (date_init > date_end) {
                let aux = date_init;
                date_init = date_end;
                date_end = aux;
            }
            range_month = this.date_selected_end.month;
        } else {
            this.date_selected_end = {};
        }



        let activate_range = (i, j, clean = false) => {
            this.days_matrix[i].day[j].container.classList.remove('active');
            if (!clean) {
                let timeAux = this.get_time_to_container_day(this.days_matrix[i].day[j].container, false);
                const dayOut = this.days_matrix[i].day[j].container.dataset.daysOut;
                const month = this.days_matrix[i].day[j].container.dataset.month; 
                if (timeAux >= date_init && timeAux <= date_end) {
                    this.days_matrix[i].day[j].container.classList.add('active');
                }
            }
        }

        for (let i = 0; i < this.days.row; i++) {
            for (let j = 0; j < this.days.col; j++) {
                activate_range(i, j, clean);
            }
        }
    }

    remove_menu_options(){
        clearTimeout(this.timer_menu_options);
        this.menu_options.classList.remove('show');
        this.menu_options.classList.add('hidden');
        // this.calendar_body_days.removeChild(this.menu_options);
    }

    get_time_to_container_day(element, is_object = false) {
        let month = 0;
        let year = 0;
        let day = 0;
        let time = 0;

        if (!is_object) {
            month = element.dataset.month;
            year = element.dataset.year;
            day = element.dataset.dayMonth;
            time = new Date(year, month - 1, day).getTime();
        } else {
            month = element.month;
            year = element.year;
            day = element.dayMonth;
            time = new Date(year, month - 1, day).getTime();
        }
        return time
    }

    asignate_new_height_to_calendar(element){
        const new_height = this.calculate_new_height(element);
        this.calendar_body.style.height = new_height + "px";
    }

    calculate_new_height(element){
        
        // const header_height = parseInt(this.getCssProperty(this.header_calendar, 'height'));
        const element_height = parseInt(this.getCssProperty(element, 'height'));
        return element_height;
    }

    height_header(){
        const style = this.header_calendar.currentStyle || window.getComputedStyle(this.header_calendar);
        const height = parseInt(style.height);
        return isNaN(height) ? 0 : height;
    }

    getCssProperty(element, property = null){
        const style = element.currentStyle ||  getComputedStyle(element);
        if(property){
            return style[property];
        }
        return style;
    }

    getPosition(element){
        const bound = element.getBoundingClientRect();
        return {
            left: bound.left,
            width: bound.width,
            top: bound.top,
            height: bound.height
        };
    }

    setProperty(element, property, value){
        element.style.setProperty(property, value);
    }

    create_element(nodeName, className, attribute = []) {
        var element = document.createElement(nodeName);
        element.className = className;
        attribute.forEach((attribute) => {
            if (attribute.attr && attribute.val) {
                element.setAttribute(attribute.attr, attribute.val);
            }
        });

        return element;
    }

    generate_matrix() {
        for (i = 0; i < this.days.row; i++) {
            var row = {
                row: null,
                cols: []
            };
            this.days_matrix.push(row);
        }
        // for (var i = 0; i < this.days.row; i++) {
        //     this.days_matrix[i] = new Array(this.days.col);
        // }
    }

    make_id(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    }

    eventEmmiter(){

        let date_emmiter = [];

        const day_init = this.date_selected.dayMonth;
        const month_init = this.date_selected.month;
        const year_init = this.date_selected.year;
        const date_init = this.eventEmmiterFormat(day_init, month_init, year_init);
        date_emmiter.push(date_init);
        if(Object.entries(this.date_selected_end).length != 0){
            const day_end = this.date_selected_end.dayMonth;
            const month_end = this.date_selected_end.month;
            const year_end = this.date_selected_end.year;
            const date_end = this.eventEmmiterFormat(day_end, month_end, year_end);
            date_emmiter.push(date_end);
        }
        this.event ? this.dispatchEvent(date_emmiter) : false;
        this.customInput ? this.emmiterToInput(date_emmiter) : false;
    }

    eventEmmiterFormat(day, month, year){
        let date = [null,null,null];
        let monthAux;
        date[this.positions.day.pos] = day < 10 ? "0" + day : day;

        if(this.positions.month.length == 3){
            monthAux = this.months_short[month - 1];
            date[this.positions.month.pos] = monthAux;
        }else if(this.positions.month.length == 4){
            monthAux = this.monthsNames[month - 1];
            date[this.positions.month.pos] = monthAux;
        }else{
            date[this.positions.month.pos] = month;
        }

        date[this.positions.year.pos] = year;

        const dateString = date[0] + this.positions.separator + date[1] + this.positions.separator + date[2];

        return dateString;
    }

    dispatchEvent(data){
        let date_emmiter = {};
        if(data.length == 2){
            date_emmiter.init = data[0];
            date_emmiter.end = data[1];
        }else{
            date_emmiter.date = data[0];
        }
        if(this.event){
            window.dispatchEvent(new CustomEvent(this.event,
                {
                    detail: date_emmiter
                })
            );
        }
    }

    emmiterToInput(date){
        let aux = date[0];
        aux += date[1] ? " - " + date[1] : "";
        this.customInput.value = aux;
        this.customInput.dispatchEvent(new Event('input'));
    }
}

class BeautifyBackDrop {
    // Elemento backdrop
    backdrop = null;
    init = false;
    htmlCollection = null;
    parentNode = null;
    backdropProperties = {
        typeOfUnitySpace: "px",
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop: 5,
        paddingBottom: 5,
        background: "red",
        borderRadius: "10px",
        transitionDuration: 300,
        transitionTimingFunction: "ease",
        event: "click",
        classActivate: "active"
    };

    paddingleft = this.backdropProperties.paddingLeft;
    paddingTop = this.backdropProperties.paddingTop;

    allowElementsFather = [
        "div",
        "nav",
        "header",
        "sidebar",
        "footer",
        "ul",
        "tr",
        "td",
        "thead",
        "table",
        "tbody"
    ];



    allowElementsChildren = [

    ];

    arg_one = false;
    arg_two = false;

    constructor() {
        // Obtiene los argumentos
        const count_arguments = arguments.length;
        // Solo se permiten dos argumentos
        if (count_arguments > 0 && count_arguments < 3) {
            switch (count_arguments) {
                case 1:
                    this.one_argument(arguments[0]);
                    break;
                case 2:
                    let aux = this.refactArguments(arguments);
                    this.two_argument(aux[1]);
                    this.one_argument(aux[0]);
                    break;
                case 3:
                    break;
            }
        } else if (count_arguments > 2) {
            this.errorsManagement(1);
        } else {
            this.errorsManagement(2);
        }

    }

    // Se verifica el orden de los argumentos
    refactArguments(args) {
        let aux;
        if ((
                (typeof args[1]).toLowerCase() == "string" ||
                args[1] instanceof HTMLCollection ||
                args[1] instanceof HTMLElement
            ) &&
            (
                args[0] instanceof Object
            )) {
            aux = args[0];
            args[0] = args[1];
            args[1] = aux;
        }

        return args;
    }

    // El primer argumento se evalúa
    one_argument(argument) {
        // Si el arbumento es un string
        if ((typeof argument).toLowerCase() == "string") {
            // Si el string trata de un id de un elemento
            var aux = document.getElementById(argument);
            if (aux != null && aux != undefined) {
                this.parentNode = aux;
                this.getHTMLCollectionfromParent();
            }
            // Si es una clase de una serie de elementos
            else {
                aux = document.getElementsByClassName(argument);
                aux.length != 0 ? this.getParentElement(aux) : this.errorsManagement(3);
            }
        }
        // Si se pasó una lista de elementos
        else if (argument instanceof HTMLCollection) {
            // Se dió una colección de objetos HTML para agregar el efecto
            if (argument.length != 0) {
                this.getParentElement(argument);
            } else {
                this.warningsManagement(3);
            }
        }
        // Si se pasó el contenedor padre
        else if (argument instanceof HTMLElement) {
            // Se obtuvo el elemento padre para iterar a sus hijos
            this.parentNode = argument;
            this.getHTMLCollectionfromParent();
        }
        // Dato no válido
        else {
            this.errorsManagement(4);
        }
    }

    // Se evalúan las opciones
    two_argument(argument) {
        // Se obtienen las propiedades css del backdrop
        if (argument instanceof Object) {

            if (argument.paddingX) {
                this.backdropProperties.paddingLeft = argument.paddingX
                this.backdropProperties.paddingRight = argument.paddingX
            }

            if (argument.paddingY) {
                this.backdropProperties.paddingTop = argument.paddingY
                this.backdropProperties.paddingBottom = argument.paddingY
            }

            if (argument.padding >= 0) {
                this.backdropProperties.paddingLeft = argument.padding
                this.backdropProperties.paddingRight = argument.padding
                this.backdropProperties.paddingTop = argument.padding
                this.backdropProperties.paddingBottom = argument.padding
            }

            if (argument.background) {
                this.backdropProperties.background = argument.background;
            }

            if (argument.transitionDuration) {
                this.backdropProperties.transitionDuration = argument.transitionDuration;
            }

            if (argument.borderRadius) {
                this.backdropProperties.borderRadius = argument.borderRadius;
            }

            if (argument.transitionTimingFunction) {
                this.backdropProperties.transitionTimingFunction = argument.transitionTimingFunction;
            }

            if (argument.typeOfUnitySpace) {
                this.backdropProperties.typeOfUnitySpace = argument.typeOfUnitySpace;
            }

            if (argument.event && (argument.event == "mouseover" || argument.event == "click")) {
                this.backdropProperties.event = argument.event;
            }

            if(typeof argument.classActivate.toLowerCase() == "string" && argument.classActivate != ""){
                this.backdropProperties.classActivate = argument.classActivate;
            }
        } else {
            this.errorsManagement(4);
        }
    }

    // Se obtiene la lista de elementos a los que se agregará el efecto
    getHTMLCollectionfromParent() {

        let name = (this.parentNode.nodeName).toLowerCase();

        // Solo se admiten ciertos elementos como padre
        if (this.allowElementsFather.includes(name)) {

            // Se obtienen los elementos hijos a agregarles el efecto
            this.htmlCollection = this.parentNode.children;
            if (this.htmlCollection.length == 0) {
                this.warningsManagement(1);
            } else {
                this.init = true;
                this.build();
            }
        } else {
            this.warningsManagement(2);
        }


    }

    // Se obtiene el elemento contenedor en base a la colección de objetos HTML
    getParentElement(collection) {
        this.htmlCollection = collection;
        const aux = this.htmlCollection[0].parentElement;
        // Si no hay un elemento padre
        if (aux != null && aux != undefined) {
            let name = (aux.nodeName).toLowerCase();

            // Solo se admiten ciertos elementos como padre
            if (this.allowElementsFather.includes(name)) {
                this.parentNode = aux;
                this.init = true;
                this.build();
            } else {
                this.warningsManagement(2);
            }
        }
    }

    // Se construye el elemento backdrop
    build() {

        this.events(); // Se añaden los eventos antes de construírse
        this.backdrop = document.createElement("div");
        this.backdrop.setAttribute("class", "backdrop");
        this.parentNode.appendChild(this.backdrop);
        this.backdrop.style.paddingTop = this.backdropProperties.paddingTop + this.backdropProperties.typeOfUnitySpace;
        this.backdrop.style.paddingLeft = this.backdropProperties.paddingLeft + this.backdropProperties.typeOfUnitySpace;
        this.backdrop.style.paddingRight = this.backdropProperties.paddingRight + this.backdropProperties.typeOfUnitySpace;
        this.backdrop.style.paddingBottom = this.backdropProperties.paddingBottom + this.backdropProperties.typeOfUnitySpace;

        this.backdrop.style.zIndex = "1";
        this.backdrop.style.background = this.backdropProperties.background;

        this.backdrop.style.borderRadius = this.backdropProperties.borderRadius;

        this.backdrop.style.transition = "all " + this.backdropProperties.transitionDuration + "ms " + this.backdropProperties.transitionTimingFunction;

        this.paddingleft = this.backdropProperties.paddingLeft;
        this.paddingTop = this.backdropProperties.paddingTop;

        this.backdrop.style.position = "absolute";

        // El elemento padre debe tener un "position" diferente a "static"
        this.parentNode.style.position = "relative";

        // El efecto se aplica al primer elemento por defecto
        this.calculate(this.htmlCollection[0]);


    }

    // Se agregan los eventos a los elementos
    events() {
        let flag = false;
        for (let item of this.htmlCollection) {
            if(!flag){
                this.cleanClassActive();
                item.classList.add(this.backdropProperties.classActivate);
                flag = true;
            }
            item.style.zIndex = "5"; // Evita que el efecto esté por encima del item
            item.style.position = "relative"; // Debe tener un "position" diferente a "static"
            
            item.addEventListener(this.backdropProperties.event, (event) => {
                this.cleanClassActive();
                item.classList.add(this.backdropProperties.classActivate);
                // Cada acción del evento se activará el efecto
                this.calculate(item);
            });
        }
    }

    cleanClassActive(){
        for(let item of this.htmlCollection){
            item.classList.remove(this.backdropProperties.classActivate);
        }
    }

    // Calcula la posición del backdrop
    calculate(element) {
        let boundElement = this.getPosition(element);
        let boundFather = this.getPosition(this.parentNode);
        let calc = {
            left: 0,
            right: 0,
            with: 0,
            height: 0
        };

        calc.left = boundElement.left - boundFather.left;
        calc.top = boundElement.top - boundFather.top;
        calc.width = boundElement.width;
        calc.height = boundElement.height;

        this.moveElement(calc);
    }


    // Obtiene el posicionamiento en la ventana y tamaño del elemento
    getPosition(element) {
        if (this.init) {
            const bound = element.getBoundingClientRect();
            return {
                left: bound.left,
                top: bound.top,
                width: bound.width,
                height: bound.height
            };
        } else {
            console.warn("No se ha provisto ningún elemento ")
        }
    }

    // Se aplica el movimiento al backdrop
    moveElement(data) {
        this.backdrop.style.left = (data.left - this.paddingleft) + "px"; // Se aplica la diferencia de espacio para el padding
        this.backdrop.style.top = (data.top - this.paddingTop) + "px";
        this.backdrop.style.width = (data.width + this.backdropProperties.paddingLeft + this.backdropProperties.paddingRight) + "px"; // El padding X que tendrá el backdrop
        this.backdrop.style.height = (data.height + this.backdropProperties.paddingTop + this.backdropProperties.paddingBottom) + "px"; // El padding Y que tendrá el backdrop
    }

    // Manejo de errores
    errorsManagement(e) {
        switch (e) {
            case 1:
                console.error("Error: Se supera el número de argumentos.");
                break;
            case 2:
                console.error("Error: No se proveyó ningún elemento válido.");
                break;
            case 3:
                console.error("Error: No se encontró ningún elemento con ese id o clase.");
                break;
            case 4:
                console.error("Error: Argumento no válido. Por favor, provee una coleccion de objetos HTML, un elemento HTML, el nombre de una clase o nombre de un id.");
                break;
            case 5:
                console.error("");
                break;
            case 6:
                console.error("");
                break;
            case 7:
                console.error("");
                break;
        }
    }

    // Manejo de Advertencias
    warningsManagement(w) {
        switch (w) {
            case 1:
                console.warn("Aviso: El elemento obtenido no contiene ningún elemento hijo.");
                break;
            case 2:
                console.warn("Aviso: El elemento padre no está permitido, por favor use 'addNewAllowedElement method' para agregar nuevos nombres de nodos.");
                break;
            case 3:
                console.warn("Aviso: Se provió una colección de objetos vacía.");
                break;
            case 4:
                console.warn("");
                break;
            case 5:
                console.warn("");
                break;
            case 6:
                console.warn("");
                break;
            case 7:
                console.warn("");
                break;
        }
    }

    refresh() {
        let backdrop = this.parentNode.getElementsByClassName("backdrop")[0];

        if (backdrop) {
            backdrop.remove();
        }
        this.backdrop = null;
        this.getHTMLCollectionfromParent();
    }

}


function prueba(callback){
    for(let i = 0; i < 10; i++){
        callback(i);
    }
}