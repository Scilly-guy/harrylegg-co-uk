let mouseDown = false;
const mousePos = {};
const grabPoint = {};
let selected;
let left;
placeDragableEventListeners();

swup.on('contentReplaced',()=>{
    if(swup.cache.swup.currentPageUrl === '/index.html' || swup.cache.swup.currentPageUrl === '/'){
        placeDragableEventListeners();
    }
});

function placeDragableEventListeners(){
    const moveables = document.querySelectorAll(".title-bar");
    moveables.forEach(moveable=>{
        moveable.addEventListener("pointerdown", startDrag);
        //moveable.addEventListener("dragstart", startDrag);
    });

    document.addEventListener("pointermove", handleDrag);
    document.addEventListener("pointerup", endDrag);
    //document.addEventListener("touchmove", handleDrag);
    //document.addEventListener("touchend", endDrag);
}
function ancestorWithRelativePositioning(elem){
    if(elem.parentNode.tagName==='BODY' || getComputedStyle(elem.parentNode).position==='relative'){
        return elem.parentNode;
    }
    else{
        return ancestorWithRelativePositioning(elem.parentNode);
    }
}
function startDrag(e){
    mousePos.x = e.pageX;
    mousePos.y = e.pageY;
    mouseDown = true;
    grabPoint.x=mousePos.x-(window.scrollX+e.currentTarget.getBoundingClientRect().x);
    grabPoint.y=mousePos.y-(window.scrollY+e.currentTarget.getBoundingClientRect().y);
    left = window.getComputedStyle(e.currentTarget).left;
    left=left.slice(0,-2);
    
    const positionedRelativeTo = ancestorWithRelativePositioning(e.currentTarget);
    let relativePosition=0;
    if(positionedRelativeTo.tagName!='BODY'){
        let relativeY=positionedRelativeTo.getBoundingClientRect().y;
        let paddingTop=getComputedStyle(positionedRelativeTo).paddingTop;
        relativePosition=window.scrollY+relativeY+paddingTop;
    }
    selected=e.currentTarget.parentNode;
    selected.style.setProperty('position','absolute');
    selected.style.setProperty('top',`${mousePos.y-grabPoint.y-relativePosition}px`);
    selected.style.setProperty('left',`${mousePos.x-grabPoint.x}px`);
    selected.style.setProperty('z-index','8');
    selected.rotate=false;
}

function handleDrag(e){
    if (!mouseDown) {
        return;
    }
    const dX = e.pageX - mousePos.x;
    const dY = e.pageY - mousePos.y;
    mousePos.x = e.pageX;
    mousePos.y = e.pageY;
    let top;
    ({ top, left } = window.getComputedStyle(selected));
    top = top.slice(0, -2);
    top = parseInt(top) + dY;
    left = left.slice(0, -2);
    left = parseInt(left) + dX;
    selected.style.top = `${top}px`;
    selected.style.left = `${left}px`;
    if(selected.rotate){        
        angle = left / window.innerWidth * 36 - 18;
        selected.style.rotate = `${angle}deg`;
    }
    if(selected.signal){        
        document.getElementById('signalfull').setAttributeNS(null,'fill','black');
        document.getElementById('signalhigh').setAttributeNS(null,'fill','black');
        document.getElementById('signallow').setAttributeNS(null,'fill','black');
        document.getElementById('signalverylow').setAttributeNS(null,'fill','black');
        if(left<window.innerWidth*0.1){
            document.getElementById('signalfull').setAttributeNS(null,'fill','none');
            document.getElementById('signalhigh').setAttributeNS(null,'fill','none');
            document.getElementById('signallow').setAttributeNS(null,'fill','none');
            document.getElementById('signalverylow').setAttributeNS(null,'fill','none');
        }
        else if(left<window.innerWidth*0.25){
            document.getElementById('signalfull').setAttributeNS(null,'fill','none');
            document.getElementById('signalhigh').setAttributeNS(null,'fill','none');
            document.getElementById('signallow').setAttributeNS(null,'fill','none');
        }
        else if(left<window.innerWidth*0.5){
            document.getElementById('signalfull').setAttributeNS(null,'fill','none');
            document.getElementById('signalhigh').setAttributeNS(null,'fill','none');
        }
        else if(left<window.innerWidth*0.75){
            document.getElementById('signalfull').setAttributeNS(null,'fill','none');
        }

        let {height:sheetsHeight}=getComputedStyle(document.querySelector('.wrapper')); 
        sheetsHeight=parseFloat(sheetsHeight.slice(0,-2));
        const target=sheetsHeight/2;
        const normalisedTop=Math.abs(top-target)/target;      
        document.getElementById('wififull').setAttributeNS(null,'fill','black');
        document.getElementById('wifihigh').setAttributeNS(null,'fill','black');
        document.getElementById('wifilow').setAttributeNS(null,'fill','black');
        document.getElementById('wifiverylow').setAttributeNS(null,'fill','black');
        if(normalisedTop>0.75){
            document.getElementById('wififull').setAttributeNS(null,'fill','none');
            document.getElementById('wifihigh').setAttributeNS(null,'fill','none');
            document.getElementById('wifilow').setAttributeNS(null,'fill','none');
            document.getElementById('wifiverylow').setAttributeNS(null,'fill','none');
        }
        else if(normalisedTop>0.5){
            document.getElementById('wififull').setAttributeNS(null,'fill','none');
            document.getElementById('wifihigh').setAttributeNS(null,'fill','none');
            document.getElementById('wifilow').setAttributeNS(null,'fill','none');
        }
        else if(normalisedTop>0.25){
            document.getElementById('wififull').setAttributeNS(null,'fill','none');
            document.getElementById('wifihigh').setAttributeNS(null,'fill','none');
        }
        else if(normalisedTop>0.1){
            document.getElementById('wififull').setAttributeNS(null,'fill','none');
        }
    }
}

function endDrag(){
    mouseDown = false;
}
