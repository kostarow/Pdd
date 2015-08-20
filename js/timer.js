(function(){
    /**
     *
     * @param params параметры:
     * min - кол-во минут
     * el - елемент куда вставить таймер
     * displayNone - убрать после завершения работы таймера
     * text - текст перед таймером
     * @constructor
     */
	function Timer(params) {
	var el = params.el || document.body,
        min = params.min || 1,
        displayNone = params.displayNone || false,
        text = params.text || '',
		self = this,
		timerContainer = document.createElement('div'),
		hours = document.createElement('span'),
		colon = document.createElement('span'),
		minutes = document.createElement('span'),
		sec = document.createElement('span'),
		timerId,
		colonInterval,
		hoursQuantity = (Math.round(min/60) > 0) ? Math.round(min/60) : 0,
		minutesQuantity = min - hoursQuantity * 60,
		secQuantity = 0,
        isPastTimer = false,
        ObjList = [];

		colon.textContent = ":";
		colon.classList.add("colon");
		colon.setAttribute("data-transparent","false");
		var colon2 = colon.cloneNode(true);

		this.start = function(){

			if(!isPastTimer) {
                this.pastTimer();
            }
			insertTime();
			timerId = setInterval(setTime,1000); 
			colonInterval = setInterval(colonEdit,500);
		}

        this.pastTimer = function(where) {
            if(where != '') {
                add(where);
            } else {
                add(el);
            }
            isPastTimer = true;
        }

		this.stop = function() {
			clearInterval(timerId);
			clearInterval(colonInterval);
		}

		this.continueTimer = function() {
			timerId = setInterval(setTime,1000); 
		}

        this.putObjFunc = function(obj,func){
            var o = {
                obj:obj,
                func:func
            };
            ObjList.push(o);
        }

		function setTime() {

			if(!timeOut()) {
				editTime();
				insertTime();
			} else {

				self.stop();
				displayNoneCheck(displayNone);
                dopAction();
			}
		}

        function dopAction() {
            for (var i = 0; i < ObjList.length; i++) {
                var obj = ObjList[i];
                obj.func.call(obj.obj);
            }
        }

		function colonEdit() {
			var colon = timerContainer.querySelectorAll('.colon');
			for(var i = 0; i < colon.length; i++) {
				if(colon[i].hasAttribute("data-transparent")) {
					if(colon[i].getAttribute("data-transparent") == "true") {
					    colon[i].setAttribute("data-transparent",false);
					} else {
						colon[i].setAttribute("data-transparent",true);
					}
				}
			}
		}

		function insertTime() {
			hours.innerHTML = addZero(hoursQuantity);
			minutes.innerHTML = addZero(minutesQuantity);
			sec.innerHTML = addZero(secQuantity);
		}

		function displayNoneCheck(displayNone){
			if(displayNone) {
				el.removeChild(timerContainer);
			}
		}

		function editTime() {
			if(secQuantity != 0) {
				secQuantity-=1;
			} else {
				if(minutesQuantity !=0) {
					minutesQuantity -=1;
					secQuantity = 59;
				} else {
					if(hoursQuantity != 0) {
						hoursQuantity-=1;
						minutesQuantity = 59;
						secQuantity = 59;
					}
				}
			}
		}

		function timeToSeconds() {
			return hoursQuantity * 3600 + minutesQuantity * 60 +secQuantity;
		}

		function setHtml() {
            if(text != '') timerContainer.insertAdjacentText('afterBegin',text);
			timerContainer.appendChild(hours);
			timerContainer.appendChild(colon);
			timerContainer.appendChild(minutes);
			timerContainer.appendChild(colon2);
			timerContainer.appendChild(sec);
		}

		function timeOut() {
			if (secQuantity == 0 && minutesQuantity == 0 && hoursQuantity == 00) return true;
			return false;
		}

		function add(el) {
			setHtml();
			el.insertBefore(timerContainer,null);
		}

		function addZero(number) {
			return (number < 10) ? '0'+number : number;
		}
}
window.Timer = Timer;
})();


