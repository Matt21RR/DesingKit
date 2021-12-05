cCs = document.getElementsByClassName("cOBA")[0].childNodes;
followGhost = false;
document.addEventListener("mousemove",function(mouse){
    if(followGhost == true){
        moveGhost(mouse);
    }
});

cCs.forEach(cC => {
    if(cC.nodeName == "DIV" && cC.className == "btn btn-primary p-1"){
        cC.addEventListener('mousedown',function(mouse){
            createGhost(cC);
            
        });
    }
});

function createGhost(com){
    var ghostCom = document.createElement("div");
        ghostCom.className = "btn btn-primary p-1 draggable";
        ghostCom.textContent = com.textContent;
    document.body.insertAdjacentElement("beforeend",ghostCom);
    followGhost = true;
    window.ghostEventRemover = function(mouse){
        removeGhost(mouse);
        //Identify where the mouse is released
        target = mouse.target;
        //When the mouse is released, create the element in the chalkboard
        createComponent(com,target);
        saveContent();
    }
    document.addEventListener('mouseup',window.ghostEventRemover);
}
function moveGhost(mouse){
    ghost = document.getElementsByClassName("draggable")[0];
    ghost.style.top = (mouse.y)+"px";
    ghost.style.left = (mouse.x)+"px";
}
function removeGhost(mouse){
    ghost = document.getElementsByClassName("draggable")[0];
    ghost.remove();
    followGhost = false;
    document.removeEventListener('mouseup',window.ghostEventRemover);
}

function createComponent(com,target){
    comName = com.textContent.toLowerCase();
    switch (comName) {
        case 'div':
            comType = 'div';
            break;
        case 'input':
            comType = 'input';
            break;
        case 'span':
            comType = 'span';
            break;
        case 'br':
            comType = 'br';
            break;
        case 'hr':
            comType = 'hr';
            break;
        case 'b':
            comType = 'b';
            break; 
        case 'label':
            comType = 'label';
            break; 
    }
    var component = document.createElement(comType);
        if(comType == 'div'){
            component.className = "defaultDiv";
        }
    target.insertAdjacentElement("beforeend",component);
    updateChalkboardComponents();
}
//? Chalkboard edition
    //*For classnames of element
    elementClassNames = document.getElementsByClassName("elementClassNames")[0];
    elementClassNames.addEventListener('input',function(){
        window.element.className = elementClassNames.value;
        saveContent();
    });
    //*For element text
    elementTexts = document.getElementsByName('elementText')[0];
    elementTexts.addEventListener('input',function(){
        window.element.innerHTML = elementTexts.value;
        saveContent();
    });
        //*Activate when a element is selected
        var itemSelection = function(mouse){
            if(window.element != undefined){
                window.element.className = window.element.className.replace(" selected","");
            }
            window.element = mouse.target;
            window.element.className = window.element.className+" selected";
            elementClassNames.value = window.element.className;
            elementTexts.value = window.element.innerHTML;
        }
    //*Delete item from chalckboard
    deleteButton = document.getElementsByClassName("btn btn-danger p-1")[0];
    deleteButton.addEventListener("mousedown",function(){
        updateChalkboardComponents(1);
    });
    function deleteItemSelected(){
        window.element.remove();
    }
    //*Update the chalkboard components listeners
    function updateChalkboardComponents(erase=0){
        //remove event listeners
        if(window.chalckComps != undefined){
            window.chalckComps.forEach(chalkComp =>{
                chalkComp.removeEventListener('mousedown',itemSelection);
            });
        }
        if(erase == 1){
            deleteItemSelected();
        }
        window.element = undefined;
        elementClassNames.value = "";
        elementTexts.value = "";

        window.chalckComps = document.getElementsByClassName("mMB")[0].childNodes;
        
        //Add event listeners
        window.chalckComps.forEach(chalkComp =>{
            chalkComp.addEventListener('mousedown',itemSelection);
        });
        
    }
//? Default style property switcher
    defStyle = document.styleSheets[0].cssRules[15].style;

    var defColorV=true;
    var defWidthV=true;
    var defHeightV=true;
    var defRadioV=false;

    defColor = document.getElementsByName("defColor")[0];
    defColor.addEventListener('input',function(){
        if(defColorV){
            defColorV = false;
            defStyle.border = "";
        }else{
            defColorV = true
            defStyle.border = "2px solid black";
        }
    });
    defWidth = document.getElementsByName("defWidth")[0];
    defWidth.addEventListener('input',function(){
        if(defWidthV){
            defWidthV = false;
            defStyle.width = "";
        }else{
            defWidthV = true
            defStyle.width = "95%";
        }
    });
    defHeight= document.getElementsByName("defHeight")[0];
    defHeight.addEventListener('input',function(){
        if(defHeightV){
            defHeightV = false;
            defStyle.height = "";
        }else{
            defHeightV = true
            defStyle.height = "95%";
        }
    });

    defStyleRadio = document.styleSheets[0].cssRules[16].style;
    defRadio = document.getElementsByName("defRadio")[0];
    defRadio.addEventListener('input',function(){
        if(defRadioV){
            defRadioV = false;
            defStyleRadio.display = "none";
        }else{
            defRadioV = true;
            defStyleRadio.display = "initial";
        }
    });
//? Stylesheet creator / editor
    styleSheetCore = document.getElementsByTagName("style")[0];

    stylesheetEditor = document.getElementsByClassName('stylesheetEditor')[0];
    stylesheetEditor.addEventListener('input',function(){
        styleSheetCore.textContent = stylesheetEditor.value;
        saveContent();
    });
    //*Show/hide stylesheet editor (By default it´s open)
    styleSheetBox = document.getElementsByClassName("cOBC")[0].style;
    window.styleSShow = true; 
    document.body.addEventListener("keydown",function(e){
        if(e.ctrlKey && e.altKey && e.key == "<"){
            if(!window.styleSShow){
                styleSheetBox.display = "";
                window.styleSShow = true;
            }else{
                styleSheetBox.display = "none";
                window.styleSShow = false;
            }
        }
    })
// ? Save values
    function saveContent(){
        window.HTML = encodeURI((document.getElementsByClassName("mMB")[0].innerHTML).replaceAll(" selected",""));
        window.sSC = encodeURI(stylesheetEditor.value);

        var req = new XMLHttpRequest();
        req.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 200){
                console.log(this.response);
            }
        }
        req.open("GET","./php/fileManager.php?mode=save&stylesheet="+window.sSC+"&HTML="+window.HTML,true);
        req.send();
    }
    function loadContent(){
        var req = new XMLHttpRequest();
        req.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 200){
                res = JSON.parse(this.response);
                stylesheetEditor.value = res[0];
                styleSheetCore.textContent = res[0];
                document.getElementsByClassName("mMB")[0].innerHTML = res[1];
                updateChalkboardComponents();
            }
        }
        req.open("GET","./php/fileManager.php?mode=load",true);
        req.send();
    }
    loadContent();
    