
document.addEventListener("DOMContentLoaded",ready);

function ready() {

    var startContainer = document.querySelector('.start-container'),
        start = document.querySelector(".JS-start"),
        name = document.querySelector(".JS-input-name");

    start.onclick = function(){
        if(name.value == '') {
            name.style.border = "1px solid red";
            message({
                text: "Введите пожалуйста имя!",
                type: "message-alert",
                positionG : "right"
            });
            return;
        }
        loaded(startContainer);

        var xhr = new XMLHttpRequest();
        xhr.open("GET","questions.json",true);
        xhr.send();

        xhr.onreadystatechange = function(){
            if(this.readyState != 4) return;

            if(this.status != 200) {
                alert( 'ошибка: ' + (this.status ? this.statusText : 'запрос не удался') );
                return;
            }

            var json = this.responseText;
            json = JSON.parse(json);
            startPdd(json,name.value);
        };
    };
}

function loaded(el){
    el.innerHTML = "";
    var img = document.createElement(('img'));
    img.src = "img/loading.gif";
    el.appendChild(img);
}

function startPdd(json,name){
    var b = document.body;
    b.innerHTML = "";
    var timer = new Timer({min:7,el:b,text:"Осталось: "});

    var pddTest = new Pdd({
        json:json,
        timer:timer,
        name:name,
        where:b
    });

    timer.putObjFunc(pddTest,pddTest.timeOut);

    pddTest.startTest();
}

(function(){
    /**
     *  Отображает сообщение
     * @param params параметры:
     * text текст сообщения
     * type тип сообщения
     * time длительность отображения
     * positionG позиция по горизонтали
     * positionV позиция по вертикали
     */
    function message(params) {
        var textMessage = params.text || '',
            type = params.type || 'message-default',
            time = params.time || 5000,
            positionG = params.positionG || 'left',
            positionV = params.positionV || 'top',
            container = document.createElement("div");

            if(textMessage != '') {
                container.innerHTML = textMessage;
                container.classList.add("JS-message");
                container.classList.add(type);
                if(positionG == 'left') {
                    container.style.left = "10px";
                } else {
                    container.style.right = "10px";
                }
                if(positionV == 'top') {
                    container.style.top = "10px";
                } else {
                    container.style.bottom = "10px";
                }
            }

            document.body.insertBefore(container,document.body.firstChild);

            setTimeout(function(){
                if(document.body.firstChild == container) {
                    document.body.removeChild(container);
                }
            },time);

    };

    window.message = message;
})();