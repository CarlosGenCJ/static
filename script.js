var container = null;
var next = null;
var prev = null;

var swipper_instance = null;
var calendar = null;
document.oncontextmenu = function (event) {
    return false
}

window.addEventListener('keydown', (event) => {
    if((event.ctrlKey && event.shiftKey && event.key.toLowerCase() == "i") || event.key.toLowerCase() == "f12"){
        event.preventDefault();
    }
});

window.addEventListener('load', () => {
    // container = document.getElementById("prueba_swipper_container");
    // next = document.getElementById("next");
    // prev = document.getElementById("prev");
    swipper_instance = new Swipper("prueba", "account");
    calendar = new Calendar("calendar");
});

window.addEventListener('click', (event) => {
    const element = event.target;

    const ripple_buttons = document.getElementsByClassName('ripple');

    Array.from(ripple_buttons).forEach((ripple_button) => {
        if (ripple_button.contains(element)) {

            // const event = event.event;

            const rippleContainer = document.createElement('div');
            const rippleEffect = document.createElement('span');

            rippleContainer.classList.add('ripple-container');
            rippleEffect.classList.add('ripple-effect');

            const offset = element.getBoundingClientRect();

            rippleEffect.style.top = (event.pageY - offset.top) + "px";
            rippleEffect.style.left = (event.pageX - offset.left) + "px";

            rippleContainer.classList.add('ripple-effect-animation');

            rippleContainer.appendChild(rippleEffect);
            element.appendChild(rippleContainer);

            setTimeout(() => {
                rippleContainer.removeChild(rippleEffect);
                element.removeChild(rippleContainer);
            }, 400);
        }
    });


});


class Swipper {
    container = null;
    next = null;
    prev = null;
    swipper = null;
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
        });
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
    constructor(){
        const enter_arguments = arguments;
        // this.evaluate(enter_arguments)_;
    }
}

class Calendar {

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

    monthsNames = ["Enero", "Febrero", "Marzo", "April", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    months_short = ["Ene", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dic"];

    daysNames = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"];
    days_short = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];

    constructor(id) {
        if (typeof id != "string" && !this.isHTMLElement(id)) {
            return new Error('Error: El argumento debe ser de tipo string u objeto html')
        }

        if (typeof id === 'string') {
            this.container_select = document.getElementById(id);
        }

        if (!this.isHTMLElement(this.container_select)) {
            return new Error('Error: No se encontró ningún elemento html');
        }

        this.init();
    }

    isHTMLElement(o) {
        return (
            typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
            o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName === "string"
        );
    }

    init() {
        this.id = this.make_id(5);
        this.label_container = this.constructor_toggle();
        this.input_toggle = this.constructor_toggle_input();

        this.divider = this.create_element('div', "divider");

        // *
        this.calendar_container = this.constructor_calendar_container();
        // !
        this.calendar_body = this.constructor_calendar_body();

        this.header_calendar = this.constructor_calendar_header();

        this.row_day_names = this.constructor_calendar_days_name(this.calendar_body);

        this.days_matrix = this.constructor_days(this.calendar_body);

        this.container_select.innerHTML = "";
        this.container_select.appendChild(this.label_container);
        this.container_select.appendChild(this.input_toggle);
        this.container_select.appendChild(this.calendar_container);

        this.calendar.appendChild(this.header_calendar);
        this.calendar.appendChild(this.divider);
        this.calendar.appendChild(this.calendar_body);

        this.init_calendar();

        this.event_controls();

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

        label_container.appendChild(icon_calendar);
        label_container.appendChild(label);
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
        }]);
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
        const header_buttons_container = this.create_element("div", "head_right");
        const header_button_next = this.create_element("button", "ripple");
        const button_next_icon = this.create_element("img", "icon_next", attr_icons);
        const header_button_prev = this.create_element("button", "ripple");
        const button_prev_icon = this.create_element("img", "icon_next", attr_icons);

        // * Injección al DOM
        header_calendar.appendChild(header_title);
        header_calendar.appendChild(header_buttons_container);

        header_buttons_container.appendChild(header_button_prev);
        header_button_prev.appendChild(button_prev_icon);
        header_buttons_container.appendChild(header_button_next);
        header_button_next.appendChild(button_next_icon);

        this.header_title = header_title;
        this.header_button_next = header_button_next;
        this.header_button_prev = header_button_prev;

        return header_calendar;
    }

    constructor_calendar_body() {
        const calendar_body = this.create_element("div", "calendar_body");
        return calendar_body;
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
                auxDay.daysOut = currentMonth != this.monthCalendar ? true : false;

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
        this.header_title.innerHTML = this.current_month_name + " " + this.yearCalendar;
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

    event_days(element) {
        element.addEventListener('click', (event) => {
            if (element.dataset.daysOut == 'active') {
                if (!event.shiftKey) {
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
            }
        });

        element.addEventListener('touchend', (event) => {
            event.stopPropagation();
            let flag = true;
            const quit = event.changedTouches[0];
            let event_target = document.elementFromPoint(quit.clientX, quit.clientY);
            const element_parent_target = event_target.parentElement;
            if (event_target && event_target.nodeName.toLowerCase() == "span" && event_target.classList.contains('day_label')) {
                let aux = event_target.parentElement;
                aux ? event_target = aux : flag = false;
            }
            if (!event_target) {
                return false;
            }
            if (!event_target.nodeName) {
                return;
            }
            if (!event_target.nodeName.toLowerCase() == "div") {
                return;
            }
            if (!event_target.classList.contains('col_day')) {
                return;
            }
            if (!flag) {
                return
            }
            if (event_target.dataset.daysOut != "inactive") {
                this.date_selected.day = element.dataset.day;
                this.date_selected.dayMonth = element.dataset.dayMonth;
                this.date_selected.month = element.dataset.month;
                this.date_selected.year = element.dataset.year;
                this.date_selected.container = element;

                this.date_selected_end.day = event_target.dataset.day;
                this.date_selected_end.dayMonth = event_target.dataset.dayMonth;
                this.date_selected_end.year = event_target.dataset.year;
                this.date_selected_end.month = element.dataset.month;
                this.date_selected_end.container = event_target;
                this.range_dates();
                this.print_current_date_label();
            }
        });
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
}