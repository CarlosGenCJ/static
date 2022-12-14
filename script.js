var container = null;
var next = null;
var prev = null;
var isMobile = false;

var swipper_instance = null;
var calendar = null;
var backdrop = null;
document.oncontextmenu = function (event) {
    return false
}

window.addEventListener('keydown', (event) => {
    if ((event.ctrlKey && event.shiftKey && event.key.toLowerCase() == "i") || event.key.toLowerCase() == "f12") {
        event.preventDefault();
    }
});

window.addEventListener('load', () => {
    if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
        isMobile = true;
    }
    swipper_instance = new Swipper("swipper");
    calendar = new Calendar("calendar");
    calendar2 = new Calendar("calendar2");

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

window.addEventListener('mousemove', event => {
    if (!isMobile) {
        const sunshineElements = document.querySelectorAll(".shane_effect");
        const target = event.toElement;
        sunshineElements.forEach(sun => {
            if (sun.contains(target)) {
                const bound = sun.getBoundingClientRect();
                const x = event.clientX - bound.left;
                const y = event.clientY - bound.top;
                sun.style.setProperty("--x", x + "px");
                sun.style.setProperty("--y", y + "px");

            }
        });
    }
});


class Years {

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

    constructor(instanceFather) {
        this.instanceFather = instanceFather;
        this.length_matrix = this.dimensions.x * this.dimensions.y;


    }

    init(first = false) {
        if (first) {
            this.first();
        } else {
            this.enter();
        }
    }

    first() {
        const date = new Date();
        const year_now = date.getFullYear();
        const cant = this.dimensions.x * this.dimensions.y;
        const position = Math.ceil(cant / 2);
        const start = year_now - position + 1;

        this.current_year = year_now;
        this.instanceFather.current_year_object.year = year_now;

        this.createMatrix(start);
    }

    enter() {
        if (this.siguiente) {
            const minimo = this.siguiente.minimo - this.length_matrix;
            this.createMatrix(minimo);
            this.container_years.style.transform = "translateY(-100%)";
        } else if (this.anterior) {
            const minimo = this.anterior.maximo + 1;
            this.createMatrix(minimo);
            this.container_years.style.transform = "translateY(100%)";
        }
    }

    constructorContainer() {
        this.container_years = this.create_element('div', "years_container");
    }

    constructorYearRow() {
        return this.create_element('div', 'year_row');
    }

    constructorYear(year_num) {
        const year = this.create_element('div', 'year_span');
        year.innerHTML = year_num;
        const year_box = this.create_element('div', 'year', [{
            attr: "data-year",
            val: year_num
        }]);

        if (this.instanceFather.current_year_object.year == year_num) {
            year_box.classList.add('active');
            this.instanceFather.current_year_object.year_element = year_box;
        }

        if (this.current_year == year_num) {
            year_box.classList.add('current');
        }

        year_box.appendChild(year);
        return year_box;
    }

    event_years(element) {
        element.addEventListener('click', (event) => {
            this.instanceFather.current_year_object.year_element.classList.remove('active');
            element.classList.add("active");
            this.instanceFather.current_year_object = {
                year_element: element,
                year: element.dataset.year
            };
            this.change_date_to_instence(this.instanceFather.current_year_object.year);
            this.instanceFather.header_title_month.click()
        });
    }

    change_date_to_instence(year = 0) {

        if (year != 0) {
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

    event_parent() {
        console.log("Evento asignado", this.container_years);
        this.container_years.addEventListener('wheel', (event) => {
            this.instanceFather.not_scroll = true;
            console.log("Se hizo scroll", event);
        });
    }

    createMatrix(init) {
        this.minimo = init;

        this.constructorContainer();

        for (let i = 0; i < this.dimensions.x; i++) {
            this.years[i] = [];
            const year_row = this.constructorYearRow();
            for (let j = 0; j < this.dimensions.y; j++) {

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

    next() {
        this.instanceFather.next();
    }

    previous() {
        this.instanceFather.previous();
    }

    create_element(nodeName, className, attributes = []) {
        return Calendar.prototype.create_element(nodeName, className, attributes);
    }
}

class YearsList {
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

    constructor() {}

    resetYears(){
        this.year_selected = 0;
        this.inicio = null;
        this.fin = null;
        this.not_scroll = false;
        this.transition = false;
        this.current_years = null;
        this.current_year_object = {
            year: 0,
            year_element: 0
        };
        this.length = 0;
        this.init_year_list();
    }

    init_year_list() {
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

    eventScrollWindow() {
        document.addEventListener('wheel', (event) => {
            if (this.not_scroll) {
                event.preventDefault();
                // event.stopImmediatePropagation();
                // event.stopPropagation();
                this.not_scroll = false;
            }
        }, {
            passive: false
        });

        document.addEventListener('scroll', (event) => {
            if (this.not_scroll) {
                event.preventDefault();
                // event.stopImmediatePropagation();
                // event.stopPropagation();
                console.log("Se debe cancelar");
            }
        }, {
            passive: false
        });
    }

    event_container_years_wheel() {
        this.calendar_body_years.addEventListener('wheel', (event) => {
            this.not_scroll = true;
            if (!this.transition) {
                const up = event.deltaY < 0 ? true : false;
                if (up) {
                    this.previous();
                } else {
                    this.next();
                }
            }
        });
    }

    event_container_years_touch() {
        this.calendar_body_years.addEventListener('touchstart', (event) => {
            this.not_scroll = true;

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

                event_window.preventDefault();
                const touches_window = event_window.touches[0];
                const move_Y = touches_window.clientY;
                new_move = move_Y - Y_start;

                if (new_move > negative_limit_move && new_move < positive_limit_move) {

                    this.current_years.container_years.style.transform = `translateY(${new_move}px)`;
                    this.current_years.container_years.style.transition = `all ease 0.0s`;
                    if (new_move > 0) {
                        this.current_years.anterior.container_years.style.transform = `translateY(calc(-100% + ${new_move}px))`;
                        this.current_years.anterior.container_years.style.transition = `all ease 0.0s`;
                    } else {
                        is_next = true;
                        this.current_years.siguiente.container_years.style.transform = `translateY(calc(100% + (${new_move}px)))`;
                        this.current_years.siguiente.container_years.style.transition = `all ease 0.0s`;
                    }
                }
            }

            document.addEventListener('touchmove', move_years, {
                passive: false
            });

            document.ontouchend = (event_touch_end) => {
                this.not_scroll = false;
                document.removeEventListener('touchmove', move_years);
                document.ontouchend = null;

                if (new_move > limit) {
                    this.previous();
                } else if (new_move < negative_limit) {
                    this.next();
                } else {
                    this.resetPosition();
                }
            }

        });
    }

    append() {
        let newNode = new Years(this);

        this.fin.siguiente = newNode;
        newNode.anterior = this.fin;
        this.fin = newNode;

        newNode.init();

        this.length++;
    }
    prepend() {
        let newNode = new Years(this);

        newNode.siguiente = this.inicio;
        this.inicio.anterior = newNode;
        this.inicio = newNode;

        newNode.init();

        this.length++;
    }

    next() {
        if (this.current_years.siguiente) {
            this.current_years = this.current_years.siguiente;
            if (!this.current_years.siguiente) {
                this.append();
            }

            this.current_years.container_years.style.transform = `translateY(0%)`;
            this.current_years.container_years.style.transition = `all ease 0.3s`;
            this.current_years.anterior.container_years.style.transform = `translateY(-100%)`;
            this.current_years.anterior.container_years.style.transition = `all ease 0.3s`;
            this.delay();
        }
    }

    previous() {
        if (this.current_years.anterior) {
            this.current_years = this.current_years.anterior;
            if (!this.current_years.anterior) {
                this.prepend();
            }
            this.current_years.container_years.style.transform = `translateY(0%)`;
            this.current_years.container_years.style.transition = `all ease 0.3s`;
            this.current_years.siguiente.container_years.style.transform = `translateY(100%)`;
            this.current_years.siguiente.container_years.style.transition = `all ease 0.3s`;
            this.delay();
        }
    }

    delay() {
        this.transition = true;
        setTimeout(() => {
            this.transition = false;
        }, 400);
    }

    resetPosition() {
        this.current_years.anterior.container_years.style.transform = `translateY(-100%)`;
        this.current_years.anterior.container_years.style.transition = `all ease 0.3s`;
        this.current_years.container_years.style.transform = `translateY(0%)`;
        this.current_years.container_years.style.transition = `all ease 0.3s`;
        this.current_years.siguiente.container_years.style.transform = `translateY(100%)`;
        this.current_years.siguiente.container_years.style.transition = `all ease 0.3s`;
    }
}

class Calendar extends YearsList {

    // El selector principal que ser?? constru??do por JS
    container_select = null;

    // El disparador para ocultar / mostrar contenido
    label_container = null;
    toggle = null;
    input_toggle = null;


    // El contenedor del calendario y el calendario en s??
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

    // Contiene una matriz con todos los d??as mostrados en el calendario
    days_matrix = [];

    // Calendar variables
    monthAux = null;
    monthCalentar = 0;
    yearCalendar = 0;

    // Fecha exacta del d??o actual
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

    timer_sostain_click = null;
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

    placeholder = null;
    placeholderVisible = false;

    constructor(id) {
        super();
        if (typeof id != "string" && !this.isHTMLElement(id)) {
            return new Error('Error: El argumento debe ser de tipo string u objeto html')
        }

        if (typeof id === 'string') {
            this.container_select = document.getElementById(id);
        }

        if (!this.isHTMLElement(this.container_select)) {
            return new Error('Error: No se encontr?? ning??n elemento html');
        }

        const children = this.container_select.children;

        if (children) {
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

    evaluate_input(input) {
        if (!this.isHTMLElement(input)) {
            return;
        }

        if (input.nodeName.toLowerCase() != "input") {
            return;
        }

        if (input.getAttribute("type").toLowerCase() != "text") {
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
        if (this.customInput) {
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

    evaluate_entries() {

        this.placeholder = this.container_select.dataset.placeholder || null;
        if(this.placeholder){
            this.placeholderVisible = true;
        }

        let dataset = this.container_select.dataset;

        let min_max = [false, false];

        if (dataset.min) {
            min_max[0] = this.evaluate_min_max(dataset.min);
        }
        if (dataset.max) {
            min_max[1] = this.evaluate_min_max(dataset.max, true);
        }
        if (dataset.format) {
            this.evaluate_format(dataset.format);
        }
        if (dataset.eventName) {
            this.event = dataset.eventName;
        }
        if (!min_max.includes(false) && this.min_date > this.max_date) {
            console.error("La fecha m??nima no debe ser mayor a la fecha m??xima. Lo arreglar??a yo, pero no voy a andar arreglando tus kgdas >:v.");
            this.min_date = this.max_date = null;
        }
    }

    evaluate_format(format) {
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
        if (aux.length != 3) {
            aux = format.split("/");
            this.positions.separator = "/";
        }

        const array_format = aux;

        if (array_format.length != 3) {
            return bad_format();
        }

        if (
            array_format[0].length == 0 ||
            array_format[1].length == 0 ||
            array_format[2].length == 0
        ) {
            return bad_format();
        }

        let flags = [false, false, false];

        array_format.forEach((data, index) => {
            if ((data[0] == 'm' || data[0] == "M" && data.length > 1 && data.length < 5) && !flags[0]) {
                this.positions.month.pos = index;
                this.positions.month.length = data.length;
                flags[0] = true;
            }
            if (data[0] == 'd' || data[0] == "D" && !flags[1] && data.length > 1 && data.length < 5) {
                this.positions.day.pos = index;
                this.positions.day.length = data.length;
                flags[1] = true;
            }
            if (data[0] == 'y' || data[0] == "Y" && !flags[2] && (data.length == 2 || data.length == 4)) {
                this.positions.year.pos = index;
                this.positions.year.length = data.length;
                flags[2] = true;
            }
        });
        if (flags.includes(false)) {
            bad_format();
        }

    }

    evaluate_min_max(data, max = false) {
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
        if (aux.length != 3) {
            aux = data.split("/");
        }

        const array_format = aux;

        if (array_format.length != 3) {
            return bad_format();
        }

        if (
            array_format[0].length == 0 ||
            array_format[1].length == 0 ||
            array_format[2].length == 0
        ) {
            return bad_format();
        }

        if (array_format[2].length == 4 && array_format[0].length == 2) {
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
        if (!isNaN(limit)) {
            if (max) {
                this.max_date = limit;
            } else {
                this.min_date = limit;
            }
            return true;
        } else {
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

        label_container.classList.add('ripple');
        label_container.classList.add('ripple-white');

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



        // * Injecci??n al DOM
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
        // Se crea la fila de los nombres de los d??as
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

    constructor_menu_options() {
        const menu_container = this.create_element('div', 'menu_container');
        const option = this.create_element('div', 'option');
        option.innerHTML = "Marcar";
        menu_container.appendChild(option);
        menu_container.classList.add("ripple");

        return menu_container;
    }

    constructor_months(months_container) {
        let month_number = 0;
        let today = new Date();
        let current_month = today.getMonth();
        for (let i = 0; i < 4; i++) {
            const row_month = this.create_element("div", "row_month");
            months_container.appendChild(row_month);
            for (let j = 0; j < 3; j++) {

                const month = this.create_element('div', "month ripple", [{
                    attr: "data-month",
                    val: month_number + ""
                }]);
                month.innerHTML = this.monthsNames[month_number];
                row_month.appendChild(month);
                if (current_month == month_number) {
                    this.month_selected.element = month;
                    this.month_selected.month = month_number;
                    month.classList.add('select');
                }
                month_number++;
                this.event_months(month);
            }
        }
    }

    init_calendar(reset = false) {
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

        if(reset){
            this.date_selected_end = {};
            this.placeholder || (typeof this.placeholder).toLowerCase() == 'string' ? this.placeholderVisible = true : false;
            this.showDaysPanel();
            this.input_toggle.checked = false;

            this.in

            this.calendar_body_months.innerHTML = '';
            this.calendar_months = this.constructor_months(this.calendar_body_months);

            this.calendar_body_years.innerHTML = '';
            this.resetYears();

            if (this.customInput) {
                this.customInput.value = '';
            }

        }

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

                // Se guarda el d??a que se eval??a
                auxDay.dayMonth = currentDayMonth;

                // Se el d??a es domingo
                auxDay.lastDay = j == 7 ? true : false;

                // Si el d??a est?? fuera del mes actual
                // auxDay.daysOut = currentMonth != this.monthCalendar ? true : false;

                const auxDateLimits = {
                    dayMonth: auxDayMonth.getDate(),
                    month: auxDayMonth.getMonth(),
                    year: auxDayMonth.getFullYear()
                };

                const date_to_miliseconds = this.get_time_to_container_day(auxDateLimits, true);
                if (currentMonth != this.monthCalendar) {
                    auxDay.daysOut = true;
                }

                if (this.min_date && date_to_miliseconds < this.min_date) {
                    auxDay.daysOut = true;
                }
                if (this.max_date && date_to_miliseconds > this.max_date) {
                    auxDay.daysOut = true;
                }

                // Si el d??a actual es igual al d??a evaluado
                if (currentMonth == this.current_month && currentYear == this.current_year && currentDayMonth == this.current_day_month) {
                    auxDay.today = true;
                }

                if (this.date_selected.dayMonth == currentDayMonth && this.date_selected.year == currentYear && (this.date_selected.month - 1) == currentMonth) {
                    auxDay.daySelected = true;
                }

                // Se incrementa en uno el d??a actual
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

                // * Se guarda la posici??n en la matriz;
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
        // if (!this.placeholder || (typeof this.placeholder).toLowerCase() != 'string') {
        if (!this.placeholderVisible) {

            const dayAux = this.date_selected.dayMonth < 10 ? '0' + this.date_selected.dayMonth : this.date_selected.dayMonth;
            if (this.isMobile()) {
                const monthAux = this.date_selected.month < 10 ? '0' + this.date_selected.month : this.date_selected.month;
                this.toggle.innerHTML = dayAux + "/" + monthAux + "/" + this.date_selected.year;
            } else {
                this.toggle.innerHTML = this.months_short[this.date_selected.month - 1] + " " + dayAux + ", " + this.date_selected.year;
            }
        } else {
            this.toggle.innerHTML = this.placeholder;
            this.placeholderVisible = false;
        }
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

    event_month_button() {
        this.header_title_month.addEventListener('click', (event) => {
            if (this.calendar_body_months.classList.contains('show')) {
                this.calendar_body_days.classList.add('show');
                this.calendar_body_months.classList.remove('show');
                this.calendar_body_years.classList.remove('show');

                this.asignate_new_height_to_calendar(this.calendar_body_days);
            } else {
                this.calendar_body_days.classList.remove('show');
                this.calendar_body_months.classList.add('show');
                this.calendar_body_years.classList.remove('show');

                this.asignate_new_height_to_calendar(this.calendar_body_months);
            }
        });
    }

    event_year_button() {
        this.header_title.addEventListener('click', (event) => {
            if (this.calendar_body_years.classList.contains('show')) {
                this.calendar_body_days.classList.add('show');
                this.calendar_body_months.classList.remove('show');
                this.calendar_body_years.classList.remove('show');

                this.asignate_new_height_to_calendar(this.calendar_body_days);
            } else {
                this.calendar_body_days.classList.remove('show');
                this.calendar_body_months.classList.remove('show');
                this.calendar_body_years.classList.add('show');

                this.asignate_new_height_to_calendar(this.calendar_body_years);
            }
        });
    }

    showDaysPanel(){
        this.calendar_body_days.classList.add('show');
        this.calendar_body_months.classList.remove('show');
        this.calendar_body_years.classList.remove('show');
        this.asignate_new_height_to_calendar(this.calendar_body_days);
    }

    event_months(element_month) {
        element_month.addEventListener('click', event => {
            const translateMonth = element_month.dataset.month - this.month_selected.month;

            if (translateMonth != 0) {
                let newMonth = new Date(this.yearCalendar, this.monthCalendar + translateMonth, 1);
                this.monthCalendar = newMonth.getMonth();
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
            this.header_title_month.click();
        });
    }

    event_days(element) {
        element.addEventListener('contextmenu', (event) => {
            if (element.dataset.daysOut && element.dataset.daysOut == 'active') {
                this.open_options_menu(element);
            }
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

            if (this.menu_option_selected) {
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
            } else if (element_parent_target && element_parent_target.classList.contains("col_day") && event_target.nodeName.toLowerCase() == "div") {
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

            if (event_target == element) {
                if (this.sostain_click) {
                    this.open_options_menu(element);
                    // }else {
                    //     console.log("no lo sostuviste");
                }
                this.sostain_click = false;
            } else {
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
            this.timer_sostain_click = setTimeout(() => {
                this.sostain_click = true;
            }, this.sostain_click_time_out);
        })
    }

    open_options_menu(element) {
        clearTimeout(this.timer_menu_options);
        if (!this.calendar_body_days.contains(this.menu_options)) {
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

        this.timer_menu_options = setTimeout(() => {
            this.remove_menu_options();
        }, 5000);
    }

    event_menu() {
        this.menu_options.addEventListener('click', (event) => {
            if (this.menu_option_selected) {


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

    remove_menu_options() {
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

    asignate_new_height_to_calendar(element) {
        const new_height = this.calculate_new_height(element);
        this.calendar_body.style.height = new_height + "px";
    }

    calculate_new_height(element) {

        // const header_height = parseInt(this.getCssProperty(this.header_calendar, 'height'));
        const element_height = parseInt(this.getCssProperty(element, 'height'));
        return element_height;
    }

    height_header() {
        const style = this.header_calendar.currentStyle || window.getComputedStyle(this.header_calendar);
        const height = parseInt(style.height);
        return isNaN(height) ? 0 : height;
    }

    getCssProperty(element, property = null) {
        const style = element.currentStyle || getComputedStyle(element);
        if (property) {
            return style[property];
        }
        return style;
    }

    getPosition(element) {
        const bound = element.getBoundingClientRect();
        return {
            left: bound.left,
            width: bound.width,
            top: bound.top,
            height: bound.height
        };
    }

    setProperty(element, property, value) {
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

    eventEmmiter() {

        let date_emmiter = [];

        const day_init = this.date_selected.dayMonth;
        const month_init = this.date_selected.month;
        const year_init = this.date_selected.year;
        const date_init = this.eventEmmiterFormat(day_init, month_init, year_init);
        date_emmiter.push(date_init);
        if (Object.entries(this.date_selected_end).length != 0) {
            const day_end = this.date_selected_end.dayMonth;
            const month_end = this.date_selected_end.month;
            const year_end = this.date_selected_end.year;
            const date_end = this.eventEmmiterFormat(day_end, month_end, year_end);
            date_emmiter.push(date_end);
        }
        this.event ? this.dispatchEvent(date_emmiter) : false;
        this.customInput ? this.emmiterToInput(date_emmiter) : false;
    }

    eventEmmiterFormat(day, month, year) {
        let date = [null, null, null];
        let monthAux;
        date[this.positions.day.pos] = day < 10 ? "0" + day : day;

        if (this.positions.month.length == 3) {
            monthAux = this.months_short[month - 1];
            date[this.positions.month.pos] = monthAux;
        } else if (this.positions.month.length == 4) {
            monthAux = this.monthsNames[month - 1];
            date[this.positions.month.pos] = monthAux;
        } else {
            date[this.positions.month.pos] = month;
        }

        date[this.positions.year.pos] = year;

        const dateString = date[0] + this.positions.separator + date[1] + this.positions.separator + date[2];

        return dateString;
    }

    dispatchEvent(data) {
        let date_emmiter = {};
        if (data.length == 2) {
            date_emmiter.init = data[0];
            date_emmiter.end = data[1];
        } else {
            date_emmiter.init = data[0];
        }
        if (this.event) {
            window.dispatchEvent(new CustomEvent(this.event, {
                detail: date_emmiter
            }));
        }
    }

    emmiterToInput(date) {
        let aux = date[0];
        aux += date[1] ? " - " + date[1] : "";
        this.customInput.value = aux;
        this.customInput.dispatchEvent(new Event('input'));
    }

    isMobile() {
        if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
            return true;
        }
        return false;
    }

    reset(){
        this.init_calendar(true);
    }
}

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

class Swipper extends ScrollBehaviour {
    swipperContainer = null;
    swipperContent = null;
    children = [];
    childrenCloner = [];

    classChildActivable = 'active';

    // ! Atributos de nodos
    swipperIdentifier = "swipper-identifier";
    swipperChildAttribute = "[swipper-child]";
    swipperAttribute = "[swipper]";
    swipperAttributeCloner = 'swipper-cloner';
    swipperNoActivable = 'swipper-no-activable';

    // ? Clases para elementos
    swipperClassDestroy = 'destroy';

    // * Variables de dimensiones
    limit = 0;
    canMove = true;

    translate = 0;
    transition = 0.3;

    resizeObserver = null;

    widthContainer = 0;

    // Variables auxiliares
    timer = null;
    clicks = 0;
    startX = -1;
    limitMovementToClick = 5;

    isTouched = false;


    constructor(id, swipperContent) {

        super();

        const isHTMLElement = this.isHTMLElement(id);

        if ((typeof id).toLowerCase() != 'string' && !isHTMLElement) {
            throw new Error('Se esperaba un string o un elemento HTML; se obtuvo un ', typeof id);
        }

        if (id == "") {
            throw new Error("Fallo al ejecutar. Se requiere al menos un caracter.");
        }

        if (!isHTMLElement) {
            this.swipperContainer = document.getElementById(id);
        } else {
            this.swipperContainer = id;
        }

        if (!this.swipperContainer) {
            throw new Error("No se encontr?? ning??n elemento.");
        }

        this.evaluateSwipperContent(swipperContent);

        this.evaluateChildren();

        this.init();
        
    }

    evaluateSwipperContent(swipperContent) {

        const type = (typeof swipperContent).toLowerCase();
        const isHTML = this.isHTMLElement(swipperContent);
        let swipper = null;
        if (type == 'string') {
            const swipperList = this.swipperContainer.getElementsByClassName(type);
            swipper = swipperList.length != 0 ? swipperList[0] : null;
        } else if (isHTML) {
            swipper = swipperContent;
        } else if (type != 'undefined') {
            throw new Error("Se esperaba un string o HTMLElement, se obtuvo ", type);
        } else {
            swipper = this.swipperContainer.querySelector(this.swipperAttribute);
        }

        if (type == 'string' && !swipper) {
            throw new Error("No se encontr?? ning??n elemento con la clase ", type);
        } else if (type == 'undefined' && !swipper) {
            throw new Error("Ning??n elemento coinside con el atributo [swipper].");
        }


        const parent = swipper.parentElement;
        if (parent != this.swipperContainer) {
            throw new Error("El Swipper Element no es padre directo de Swipper Container");
        }

        this.swipperContent = swipper;

    }

    evaluateChildren() {
        let children = this.swipperContent.querySelectorAll(this.swipperChildAttribute);
        if (children.length != 0) {
            children.forEach(child => {
                const parent = child.parentElement;
                if (parent != this.swipperContent) {
                    throw new Error("No se puede asignar a un elemento el tipo Swipper-Child si no es hijo directo de Swipper Content.");
                }
            });

            // this.children = children;
        } else {
            children = Array.from(this.swipperContent.children);
        }

        this.inject_data_to_children(children);
    }

    inject_data_to_children(children) {
        children.forEach(child => {
            let identifier = child.getAttribute(this.swipperIdentifier);
            if (!identifier) {
                identifier = this.make_id(6);
                child.setAttribute(this.swipperIdentifier, identifier);
            }
            child.swipperIdentifier = identifier;
            const childObject = {
                element: child,
                identifier
            };
            this.children.push(childObject);

            let cloner = child.getAttribute(this.swipperAttributeCloner);
            let childClone = child.cloneNode(true);
            childClone.swipperAttributeCloner = cloner;
            if (cloner) {
                const childObjectCloner = {
                    element: childClone,
                    identifier: cloner
                };
                this.childrenCloner.push(childObjectCloner);
            }
        });
    }

    init() {
        this.swipperContainer.style.overflow = "hidden";
        this.swipperContent.style.position = "relative";
        this.swipperContent.style.overflow = "auto";

        if('ontouchstart' in window || navigator.maxTouchPoints){
            this.isTouched = true;
          }

        this.setDataToScrollBehaviourClass();

        this.events();

        this.loop();
    }

    setDataToScrollBehaviourClass(){
        this.container = this.swipperContent;
        this.containerParent = this.swipperContainer;
        this.isMouseDown = false;
    }

    events() {
        // ? Eventos del swipper
        // if(!this.isTouched){
            this.dragEvent();
        // }else{
            this.touchEvents();
        // }
        // this.resizeEvent();

        this.activableEvent();

    }

    dragEvent() {

        this.swipperContent.addEventListener('mousedown', (event)=>{
            this.isMouseDown = true;
            this.clicks = 0;
            this.prevMouseX = this.mouseX;
            !this.isAnimationRunning ? this.loop() : false;
            this.isAnimationRunning = true;
        });

        document.addEventListener('mouseup', (event) => {
            this.isMouseDown = false;
        });

        document.addEventListener('mousemove', (event) => {
            this.mouseX = event.pageX;
            if (this.clicks < this.limitMovementToClick) {
                this.clicks++;
            }
        }, false);

        // this.swipperContent.addEventListener('mousedown', (event) => {

        //     this.limit = this.getLimit();
        //     this.clicks = 0;

        //     const startX = event.clientX;

        //     let last_movement = this.translate;

        //     let movingEvent = (windowEvent) => {
        //         this.movingEventControl(windowEvent, startX, last_movement);
        //     }
        //     document.addEventListener('mousemove', movingEvent);

        //     document.onmouseup = () => {
        //         document.removeEventListener('mousemove', movingEvent);
        //         this.startX = -1;
        //         document.onmouseup = null;
        //     }
        // });
    }

    touchEvents() {

        this.swipperContainer.addEventListener('touchstart', (event) => {
            this.isMouseDown = true;
            this.clicks = 0;
            const touches = event.touches;
            this.mouseX = touches[0].pageX;
            this.prevMouseX = this.mouseX;
            !this.isAnimationRunning ? this.loop() : false;
            this.isAnimationRunning = true;
        });

        document.addEventListener('touchend', () => {
            this.isMouseDown = false;
        });

        document.addEventListener('touchmove', (event) => {
            const touches = event.touches;
            this.mouseX = touches[0].pageX;
            if (this.clicks < this.limitMovementToClick) {
                this.clicks++;
            }
        }, false)

        // this.swipperContainer.addEventListener('touchstart', (event) => {
        //     this.limit = this.getLimit();
        //     this.clicks = 0;

        //     const touches = event.touches;
        //     const startX = touches[0].clientX;
        //     let last_movement = this.translate;

        //     let touchmove = (eventTouch) => {
        //         this.movingEventControl(eventTouch, startX, last_movement);
        //     }

        //     document.addEventListener('touchmove', touchmove);

        //     document.ontouchend = () => {
        //         this.startX = -1;
        //         this.clicks = 0;
        //         document.removeEventListener('touchmove', touchmove);

        //         document.ontouchend = null;
        //     }
        // });
    }

    movingEventControl(event, startX, last_movement) {
        if (!this.canMove) {
            return;
        }

        if (this.clicks < this.limitMovementToClick) {
            this.clicks++;
        } else if (this.startX == -1) {
            this.startX = event.clientX || event.touches[0].clientX;
        }

        const x_move = event.clientX || event.touches[0].clientX;
        let move = startX - x_move;
        const new_movement = last_movement + move;
        this.translateMovement(new_movement);
    }

    resizeEvent() {
        this.resizeObserver = new ResizeObserver(this.detectWidthChanges);
        this.resizeObserver.observe(this.swipperContainer);
    }

    detectWidthChanges = (entries) => {
        if (entries.length > 0) {
            const entry = entries[0];
            const contentRect = entry.contentRect;
            if (this.widthContainer != contentRect.width) {
                this.widthContainer = contentRect.width;
                this.reCalcWhenResizeContainer();
            }
        }
    }

    reCalcWhenResizeContainer() {
        this.limit = this.getLimit();
        if (this.translate > this.limit && this.limit > 0) {
            this.translate = this.limit;
            // this.containerPosition = this.limit;
            // this.translateElement();
        } else if (this.translate != 0 && this.limit < 0) {
            this.translate = 0;
            // this.containerPosition = 0;
            // this.translateElement();
        }
        this.container.style.transform = `translate(${this.containerPosition}px)`;
    }

    translateMovement(newMovement = 0, ease = false) {
        if (newMovement < 0) {
            this.translate = 0;
        } else if (newMovement > this.limit) {
            this.translate = this.limit;
        } else {
            this.translate = newMovement;
        }

        this.translateElement(ease);
    }

    translateElement(ease = false) {
        if (ease) {
            this.swipperContent.style.transition = 'left ease ' + this.transtition + "s";
        } else {
            this.swipperContent.style.transition = 'left ease ' + 0 + "s";
        }
        this.swipperContent.style.left = (this.translate * -1) + "px";
        // throw new Error("prueba");
    }

    activableEvent() {
        this.children.forEach(child => {
            this.addEventToChild(child.element);
        });
    }

    addEventToChild(child) {
        child.addEventListener('click', (event) => {
            let flag = this.clickToChildren(event, child);
            if(!flag){
                // event.preventDefault();
                event.stopImmediatePropagation();
                // event.stopIn
            }

        });
    }

    removeEventToChild(child) {
        child.removeEventListener('click', this.clickToChildren);
    }

    clickToChildren(event, child) {
        if (this.clicks >= this.limitMovementToClick) {
            this.clicks = 0;
            // event.preventDefault();
            return false;
        // }else if(child.classList.contains(this.classChildActivable)){
        //     // event.preventDefault();
        //     return false;
        }


        const bound = this.getBound(child);
        const parentBound = this.getBound(this.swipperContainer);
        const diferenceRight = bound.right - parentBound.right;
        const diferenceLeft = parentBound.left - bound.left;
        if (diferenceRight > 0) {
            this.translate += diferenceRight;
            this.transtition = 0.3;
            this.translateMovement(this.translate, true);
        } else if (diferenceLeft > 0) {
            this.translate -= diferenceLeft;
            this.transtition = 0.3;
            this.translateMovement(this.translate, true);
        }

        const activable = !child.hasAttribute(this.swipperNoActivable);

        if (activable) {
            this.activableChild(child);
        }

        return true;
    }

    activableChild(child) {
        this.removeClassActivable();
        child.classList.add(this.classChildActivable);
        child.classList.add('shane_effect');
    }

    removeClassActivable() {
        this.children.forEach(child => {
            child.element.classList.remove(this.classChildActivable);
            child.element.classList.remove('shane_effect');
        });
    }

    getLimit() {
        const widthContainer = parseInt(this.getCssProperty(this.swipperContainer, 'width'));
        const widthContent = parseInt(this.getCssProperty(this.swipperContent, 'width'));
        if (widthContainer > widthContent) {
            this.canMove = false;
        } else {
            this.canMove = true;
        }
        this.widthContainer = widthContainer;
        return widthContent - widthContainer;
    }

    isHTMLElement(o) {
        return (
            typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
            o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName === "string"
        );
    }

    getBound(element) {
        let bound = null;
        bound = element.getBoundingClientRect();
        // bound.toRight = bound.left + bound.width;

        return bound;
    }

    getCssProperty(element, property = null) {
        const style = element.currentStyle || getComputedStyle(element);
        if (property) {
            return style[property];
        }
        return style;
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


    /**
     * Elimina un elemento del swipper
     * @type {Fucntion}
     * 
     * @param {string} identifier - Identificador del elemento a borrar
     */
    remove(identifier = '') {
        const type = this.getType(identifier);
        if (type == 'undefined') {
            throw new Error('Se esperaba un argumento, se obtuvo 0 argumentos.');
        }
        if (type != 'string') {
            throw new Error('Se esperaba un argumento de tipo string,', type, "dado.");
        }
        var invalid = /\s/;
        if (invalid.test(identifier)) {
            throw new Error('El identificador no debe tener espacios vac??os.');
        }

        this.removeElement(identifier);
    }

    removeElement(identificador) {
        const element = this.getChildByIdentifier(identificador);
        if (element.status == 0) {
            throw new Error('Elemento no encontrado. Identificador:', identificador);
        }
        this.children.splice(element.index, 1);
        this.swipperContent.removeChild(element.child.element);
        this.removeEventToChild(element.child.element);
    }

    /**
     * Se pasa como parametro el identificador del elemento de referencia para insertar antes de ??ste.
     * En caso de requerir una copia de un elemento existente para asignarle nuevos valores, deber?? 
     * ingresar el identificador del elemento a clonar. Su atributo es swipper-cloner. Si no se requiere, puede pasar un false como argumento.
     * 
     * Por ultimo, una funci??n callback que recibir?? el elemento clonado para su formateo.
     * ??ste callback deber?? retornar el elemento ya formateado para as?? agregarlo al swipper.
     * @param {string} identificador - Identificador del elemento de referencia
     * @param {string | boolean} clonerIdentifier - un string en caso de requerir un elemento a clonar
     * @param {Fucntion } callback - Callback que recibir?? el elemento clonado, si as?? lo decidi??. Deber?? retornar un elemento HTLM
     */
    addBefore(callback, identificador = false, clonerIdentifier = false) {
        if(this.getType(identificador) != 'string'){
            throw new Error('Se esperaba un string, se obtuvo ' + this.getType(identificador));
        }
        const newData = this.addAfterOrBefore(identificador, clonerIdentifier, callback);
        const lengthChildren = this.children.length;
        if (lengthChildren == 0) {
            this.children.push(newData.newObject);
        } else if (newData.index == 0) {
            this.children.unshift(newData.newObject);
        } else {
            this.children.splice(newData.index - 1, 0, newData.newObject);
        }

        newData.htmlElement.before(newData.newObject.element);
        this.addEventToChild(newData.newObject.element);
    }

    /**
     * Se pasa como parametro el identificador del elemento de referencia para insertar despu??s de ??ste.
     * En caso de requerir una copia de un elemento existente para asignarle nuevos valores, deber?? 
     * ingresar el identificador del elemento a clonar. Su atributo es swipper-cloner. Si no se requiere, puede pasar un false como argumento.
     * 
     * Por ultimo, una funci??n callback que recibir?? el elemento clonado para su formateo.
     * ??ste callback deber?? retornar el elemento ya formateado para as?? agregarlo al swipper.
     * @param {string} identificador - Identificador del elemento de referencia
     * @param {string | boolean} clonerIdentifier - un string en caso de requerir un elemento a clonar
     * @param {Fucntion } callback - Callback que recibir?? el elemento clonado, si as?? lo decidi??. Deber?? retornar un elemento HTLM
     */
    addAfter(callback, identificador = '', clonerIdentifier = false) {
        if(this.getType(identificador) != 'string'){
            throw new Error('Se esperaba un string, se obtuvo ' + this.getType(identificador));
        }
        const newData = this.addAfterOrBefore(callback, identificador, clonerIdentifier);
        const lengthChildren = this.children.length;

        if (lengthChildren == 0) {
            this.children.push(newData.newObject);
            //     this.children.unshift(newData.newObject);
        } else {
            this.children.splice(newData.index, 0, newData.newObject);
        }

        newData.htmlElement.after(newData.newObject.element);
        this.addEventToChild(newData.newObject.element);

    }

    addAfterOrBefore(callback, identificador = false, clonerIdentifier = false) {
        const type = this.getType(identificador);
        if (type == 'undefined') {
            throw new Error('Se esperaban dos argumentos, se obtuvo 0');
        }
        // if (type != 'string') {
        //     throw new Error('Se esperaba un string, se obtuvo ', type);
        // }

        // const element = this.getChildByIdentifier(identificador);
        // if (element.status == 0) {
        //     throw new Error('Elemento con el identificador ', identificador, 'no encontrado.');
        // }

        if(type == 'string'){
            const element = this.getChildByIdentifier(identificador);
            if (element.status == 0) {
                throw new Error('Elemento con el identificador ' + identificador + ' no encontrado.');
            }
        }else if(type == 'boolean' && identificador == true){
            
        }



        // ! ******************************************************************************************************

        const typeCloner = this.getType(clonerIdentifier);
        if (typeCloner != 'boolean' && typeCloner != 'string') {
            throw new Error('Se esperaba un string o un boolean(false), se obtuvo', typeCloner);
        }

        let argumentToCallback = null;

        if (typeCloner == 'string') {
            const clone = this.getChildByIdentifier(clonerIdentifier, true);
            if (clone.status == 0) {
                throw new Error('El Swipper Cloner element no ha sido encontrado.');
            }
            argumentToCallback = clone.child.element.cloneNode(true);
        }

        const typeCallback = this.getType(callback);
        if (typeCallback != 'function') {
            throw new Error('Se esperaba una funci??n como argumento, ', typeCallback, ' dado.');
        }
        const returnedCallback = callback(argumentToCallback);
        let newElement = null;

        // if (!this.isHTMLElement(returnedCallback)) {
        //     throw new Error('Se debe retornar un elemento HTML, ', this.getType(newElement), ' retornado.');
        // }


        if(this.isHTMLElement(returnedCallback)){
            newElement = returnedCallback.cloneNode(true);
            this.addEventToChild(newElement);
        }else if((typeof returnedCallback).toLowerCase() == 'object'){
            if(returnedCallback.element && this.isHTMLElement(returnedCallback.element)){
                newElement = returnedCallback.element.cloneNode(true);
                this.addEventToChild(newElement);
            }else{
                throw new Error('Se esperaba un retorno de tipo HTMLElement o un objeto con key: element. Se obtuvo '+ typeof returnedCallback);
            }

            if(returnedCallback.function && (typeof returnedCallback.function).toLowerCase() == 'function'){
                newElement.addEventListener('click', returnedCallback.function);
            }

        }else{
            throw new Error('Se esperaba un retorno de tipo HTMLElement o un objeto con key: element. Se obtuvo '+ typeof returnedCallback);
        }











        // ! ********************************

        let identifierNewElement = newElement.swipperIdentifier || newElement.getAttribute(this.swipperIdentifier);

        if (!identifierNewElement) {
            identifierNewElement = this.addIdentifier(newElement);
        }


        this.addEventToChild(newElement);

        const newElementObject = {
            element: newElement,
            identifier: identifierNewElement
        }

        return {
            newObject: newElementObject,
            htmlElement: element.child.element,
            index: element.index
        };

        // element.child.element.before(newElement);

    }

    /**
     * 
     * @param {HTMLElement} element - Elemento HTML al que se le asignar?? un identificador
     * @param {string=} identificador - Identificado a ser asignado
     * @returns {string} Retorna el identificador asignado al elemento
     */
    addIdentifier(element, identificador) {
        if (!this.isHTMLElement(element)) {
            throw new Error('Se esperaba un elemento HTML como argumento,', this.getType(element), ' dado');
        }
        const type = this.getType(identificador);
        if (type != 'string' && type != 'undefined') {
            throw new Error('Se esperaba un string como argumento,', type, ' dado.');
        }
        const tester = /\s/;
        if (tester.test(identificador)) {
            throw new Error('El parametro identificador no sebe contener espacios vac??os.');
        }

        let identifier = '';

        if (type == 'undefined') {
            identifier = this.make_id(6);
        } else {
            identifier = identificador;
        }
        element.setAttribute(this.swipperIdentifier, identifier);
        element.swipperIdentifier = identifier;

        return identifier;
    }

    removeIdentifier(element){
        if(this.isHTMLElement(element)){
            element.removeAttribute(this.swipperIdentifier);
        }
    }

    getChildByIdentifier(identificador, isCloner = false) {
        let status = {
            status: 0,
            child: null,
            index: -1
        };
        (isCloner ? this.childrenCloner : this.children).forEach((child, index) => {
            const identifierChild = !isCloner ? (child.element.swipperIdentifier || child.element.getAttribute(this.swipperIdentifier)) : (child.element.swipperAttributeCloner || child.element.getAttribute(this.swipperAttributeCloner));
            if (identificador == identifierChild) {
                status.status = 1;
                status.child = child;
                status.index = index;
            }
        });
        return status;

    }

    removeAll() {
        return new Promise((resolve) => {

            this.children.forEach((child, index) => {
                child.element.classList.add(this.swipperClassDestroy);
                child.element.style.setProperty('--delay', (0.1 * index) + 's');
                this.removeEventToChild(child.element);
            });

            setTimeout(() => {
                this.swipperContent.innerHTML = '';
                this.children = [];
                resolve(true);
            }, (100 * this.children.length) + 300);
        });
    }

    /**
     * Reconstruye el swipper eliminando todos los elementos y agregando m??s a su elecci??n.
     * 
     * El callback recibir?? el index de cada elemento, y si fue requerido, la lista de elementos posibles para clonar. 
     * Usted deber?? encargarse de iterar el arreglo de objetos a clonar y seleccionar el que dese??.
     * 
     * @param {Function} callback - Funcion que procesar?? el elemento a agregar al swipper
     * @param {integer} iterations - Iteriaciones que se har??n a cada 
     * @param {boolean} clone_required 
     */
    async rebuild(callback, iterations, clone_required = false) {
        await this.removeAll();
        if (isNaN(iterations)) {
            throw new Error('Se esperaba un argumento de tipo integer. Se obtuvo ' + typeof iterations);
        }

        if (iterations < 1) {
            throw new Error('Se esperaba un n??mero superior a 0. ' + iterations + ' dado');
        }

        if (this.getType(callback) != 'function') {
            throw new Error('Se esperaba un argumento de tipo function. Se obtuvo ' + typeof callback);
        }

        if (this.getType(clone_required) != 'boolean') {
            throw new Error('Se esperaba un argumento de tipo boolean. Se obtuvo ' + typeof clone_required);
        }

        for (let i = 0; i < iterations; i++) {
            let cloneCollection = undefined;
            if (clone_required) {
                cloneCollection = this.childrenCloner;
            }
            const returnedCallback = callback(i, cloneCollection);

            let newElement = null;

            if(this.isHTMLElement(returnedCallback)){
                newElement = returnedCallback.cloneNode(true);
                this.addEventToChild(newElement);
            }else if((typeof returnedCallback).toLowerCase() == 'object'){
                if(returnedCallback.element && this.isHTMLElement(returnedCallback.element)){
                    newElement = returnedCallback.element.cloneNode(true);
                    this.addEventToChild(newElement);
                }else{
                    throw new Error('Se esperaba un retorno de tipo HTMLElement o un objeto con key: element. Se obtuvo '+ typeof returnedCallback);
                }

                if(returnedCallback.function && (typeof returnedCallback.function).toLowerCase() == 'function'){
                    newElement.addEventListener('click', returnedCallback.function);
                }

            }else{
                throw new Error('Se esperaba un retorno de tipo HTMLElement o un objeto con key: element. Se obtuvo '+ typeof returnedCallback);
            }
        
            let identifierNewElement = newElement.swipperIdentifier || newElement.getAttribute(this.swipperIdentifier);
            if (!identifierNewElement) {
                identifierNewElement = this.addIdentifier(newElement);
            }

            const newObjectChildElement = {
                element: newElement,
                identifier: identifierNewElement
            };
            this.swipperContent.appendChild(newElement);
            this.children.push(newObjectChildElement);
        }
    }

    getType(variable) {
        return (typeof variable).toLowerCase();
    }

    isMobile() {
        if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
            return true;
        }
        return false;
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

    // El primer argumento se eval??a
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
        // Si se pas?? una lista de elementos
        else if (argument instanceof HTMLCollection) {
            // Se di?? una colecci??n de objetos HTML para agregar el efecto
            if (argument.length != 0) {
                this.getParentElement(argument);
            } else {
                this.warningsManagement(3);
            }
        }
        // Si se pas?? el contenedor padre
        else if (argument instanceof HTMLElement) {
            // Se obtuvo el elemento padre para iterar a sus hijos
            this.parentNode = argument;
            this.getHTMLCollectionfromParent();
        }
        // Dato no v??lido
        else {
            this.errorsManagement(4);
        }
    }

    // Se eval??an las opciones
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

            if (typeof argument.classActivate.toLowerCase() == "string" && argument.classActivate != "") {
                this.backdropProperties.classActivate = argument.classActivate;
            }
        } else {
            this.errorsManagement(4);
        }
    }

    // Se obtiene la lista de elementos a los que se agregar?? el efecto
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

    // Se obtiene el elemento contenedor en base a la colecci??n de objetos HTML
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

        this.events(); // Se a??aden los eventos antes de constru??rse
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
            if (!flag) {
                this.cleanClassActive();
                item.classList.add(this.backdropProperties.classActivate);
                flag = true;
            }
            item.style.zIndex = "5"; // Evita que el efecto est?? por encima del item
            item.style.position = "relative"; // Debe tener un "position" diferente a "static"

            item.addEventListener(this.backdropProperties.event, (event) => {
                this.cleanClassActive();
                item.classList.add(this.backdropProperties.classActivate);
                // Cada acci??n del evento se activar?? el efecto
                this.calculate(item);
            });
        }
    }

    cleanClassActive() {
        for (let item of this.htmlCollection) {
            item.classList.remove(this.backdropProperties.classActivate);
        }
    }

    // Calcula la posici??n del backdrop
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


    // Obtiene el posicionamiento en la ventana y tama??o del elemento
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
            console.warn("No se ha provisto ning??n elemento ")
        }
    }

    // Se aplica el movimiento al backdrop
    moveElement(data) {
        this.backdrop.style.left = (data.left - this.paddingleft) + "px"; // Se aplica la diferencia de espacio para el padding
        this.backdrop.style.top = (data.top - this.paddingTop) + "px";
        this.backdrop.style.width = (data.width + this.backdropProperties.paddingLeft + this.backdropProperties.paddingRight) + "px"; // El padding X que tendr?? el backdrop
        this.backdrop.style.height = (data.height + this.backdropProperties.paddingTop + this.backdropProperties.paddingBottom) + "px"; // El padding Y que tendr?? el backdrop
    }

    // Manejo de errores
    errorsManagement(e) {
        switch (e) {
            case 1:
                console.error("Error: Se supera el n??mero de argumentos.");
                break;
            case 2:
                console.error("Error: No se provey?? ning??n elemento v??lido.");
                break;
            case 3:
                console.error("Error: No se encontr?? ning??n elemento con ese id o clase.");
                break;
            case 4:
                console.error("Error: Argumento no v??lido. Por favor, provee una coleccion de objetos HTML, un elemento HTML, el nombre de una clase o nombre de un id.");
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
                console.warn("Aviso: El elemento obtenido no contiene ning??n elemento hijo.");
                break;
            case 2:
                console.warn("Aviso: El elemento padre no est?? permitido, por favor use 'addNewAllowedElement method' para agregar nuevos nombres de nodos.");
                break;
            case 3:
                console.warn("Aviso: Se provi?? una colecci??n de objetos vac??a.");
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