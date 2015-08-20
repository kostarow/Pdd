
(function(){
    /**
     *
     * @param params параметры:
     * json вопросы
     * where блок куда вставляется тест
     * name имя тестируемого
     * timer время
     * @constructor
     */
    function Pdd(params) {
        var container = document.createElement("div");
        container.classList.add("JS-container");

        var timeDiv = document.createElement("div");
        timeDiv.classList.add("JS-time");

        var signalsDiv = document.createElement("div");
        signalsDiv.classList.add("JS-container-signals");

        var numberDiv = document.createElement("div");
        numberDiv.classList.add("JS-number");

        var imageDiv = document.createElement("div");
        imageDiv.classList.add("JS-image");

        var questionDiv = document.createElement("div");
        questionDiv.classList.add("JS-question");

        var variantsDiv = document.createElement("div");
        variantsDiv.classList.add("JS-variants");

        var commentDiv = document.createElement("div");
        commentDiv.classList.add("JS-comment");
        commentDiv.classList.add("hide");

        var nextButton = document.createElement("div");
        nextButton.classList.add("JS-next");
        nextButton.setAttribute("title","Следующий вопрос");
        nextButton.setAttribute("data-active","false");
        nextButton.innerHTML = ">";

        var lastMessageDiv = document.createElement("div");
        lastMessageDiv.classList.add("JS-last-Message");

        var nextButtonText = document.createElement("div");
        nextButtonText.classList.add("JS-next-message");
        nextButtonText.innerHTML = "Следующий вопрос";
        nextButton.appendChild(nextButtonText);

        var questions = params.json ? params.json : '',
            timer = params.timer || "",
            name = params.name || "",
            where = params.where || "";
        var currentQuestion = 0,
            signalsList,
            errors = [],
            rightVariants = [],
            notWork = false;

        if(!questions) {
            message({text:"Error:Вопросы не найдены!",positionG:"right",type:"message-error"});
            notWork = true;
        }

        this.startTest = function(){
            if(!notWork) {
                collectingHtml();
                where.appendChild(container);
                displayNextQuestions(currentQuestion);
            }
        }

        this.timeOut = function() {
            alert("К сожалению," + name + ",время вышло!");
            killTest();
        }

        function clickNext(){
            currentQuestion++;
            displayNextQuestions(currentQuestion);
            nextButton.setAttribute("data-active","false");
            nextButton.onclick = null;
        }

        function setTime() {
            timer.pastTimer(timeDiv);
            timer.start();
        }

        function collectingHtml() {
            container.appendChild(nextButton);
            setTime();
            container.appendChild(timeDiv);
            getSignals();
            container.appendChild(signalsDiv);
            container.appendChild(numberDiv);
            container.appendChild(imageDiv);
            container.appendChild(questionDiv);
            container.appendChild(variantsDiv);
            container.appendChild(commentDiv);
        }

        function getSignals() {
            for(var i = 0; i<questions.length; i++) {
                var signals = document.createElement("div");
                signals.classList.add("JS-signals");
                signalsDiv.appendChild(signals);
            }
            signalsList = signalsDiv.querySelectorAll(".JS-signals");
        }

        function displayNextQuestions(nextQuestions) {
                numberDiv.innerHTML = "Вопрос №" + (nextQuestions + 1);

                if(questions[nextQuestions].image != '') {
                    imageDiv.innerHTML = "<img src='"+ questions[nextQuestions].image + "' />";
                } else {
                    imageDiv.innerHTML = "<img src='img/blank.jpg' />";
                }

                questionDiv.innerHTML = questions[nextQuestions].question;

                setVariants(nextQuestions);

                if (!commentDiv.classList.contains('hide')) {
                    commentDiv.classList.add('hide');
                }
                commentDiv.innerHTML = questions[nextQuestions].comment;
        }

        function getRightVariants(){
            return rightVariants.length;
        }

        function getErrorVariants() {
            return questions.length - getRightVariants();
        }

        function getLastMessage(count) {
            switch (count) {
                case 20:
                case 19:
                case 18: return "Поздравляем " + name + "! Вы сдали экзамен по теории!<br>" +
                     "Правильных ответов:" + count + "<br>" +
                      "Ошибок:" + getErrorVariants();
                case 17:
                case 16:
                case 15:return "К сожалению, " + name + ", Вы не сдали экзамен по теории!<br>" +
                     "Правильных ответов:" + count + "<br>" +
                     "Ошибок:" + getErrorVariants() ;
            }

            return "Это полный провал, " + name + "! Вы уверены что хотите получить права?<br>"+
                "Правильных ответов:" + count + "<br>" +
                "Ошибок:" + getErrorVariants() ;
        }

        function killTest(){
            timer.stop();
            lastMessageDiv.innerHTML = getLastMessage(getRightVariants()) +
                "<br><a href='javascript:window.location.reload()'>Повторить</a>";
            container.innerHTML = "";
            container.appendChild(lastMessageDiv);
        }

        function setVariants(next){

            var variantsList = {
                variants : [],
                true:0,
                createNewVariants : function(i,textVariant){
                    var variant = document.createElement("div");
                    variant.classList.add("JS-variant");
                    variant.innerHTML = textVariant;
                    variant.i = i;
                    this.variants.push(variant);
                },
                setVariants : function(arr) {
                    for(var i = 0; i < arr.length; i++) {
                        this.createNewVariants(i,arr[i]);
                    }
                },
                setEvent : function() {
                    var self = this;
                    for(var i = 0; i < self.variants.length; i++) {
                        self.variants[i].onclick = function() {

                            setGroupAttribute(self.variants,"data-checked","blocked");
                            setGroupOnclick(self.variants,null);
                            if(this.i == self.true) {
                                this.setAttribute("data-checked","true");
                                signalsList[next].setAttribute("data-err","false");
                                rightVariants.push(next);
                            } else {
                                this.setAttribute("data-checked","error");
                                signalsList[next].setAttribute("data-err","true");
                                errors.push(next);
                                commentDiv.classList.remove('hide');
                            }
                            if(next != questions.length -1) {
                                nextButton.setAttribute("data-active","true");
                                nextButton.onclick = clickNext;
                            } else {
                                killTest();
                            }

                        }
                    };

                    function setGroupAttribute(collection,attr,value) {
                        for(var i = 0; i<collection.length; i++) {
                            collection[i].setAttribute(attr,value);
                        }
                    };

                    function setGroupOnclick(collection,func){
                        for (var i = 0; i < collection.length; i++) {
                            collection[i].onclick = func;
                        }
                    };
                },
                appendVariants : function(where) {
                    where.innerHTML = "";
                    for (var i = 0; i < this.variants.length; i++) {
                        where.appendChild(this.variants[i]);
                    }
                }
            };

            variantsList.setVariants(questions[next].variants);
            variantsList.true = questions[next].isTrue;
            variantsList.setEvent();
            variantsList.appendVariants(variantsDiv);

        }
    }

    window.Pdd = Pdd;
})();