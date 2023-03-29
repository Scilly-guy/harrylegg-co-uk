positionBottomSheet();
addResumeEventListeners();

swup.on('contentReplaced',()=>{
    if(swup.cache.swup.currentPageUrl==='/resume.html'){  
        console.log(`contentReplaced with ${swup.cache.swup.currentPageUrl}`);        
        achieve('resume');
        addResumeEventListeners();
        clocks=[...document.querySelectorAll(".clock")];
        updateClocks();
        placeEventListeners();
    }
});

function addResumeEventListeners(){
    document.getElementById("phone")?.addEventListener("pointerdown", (e) => {
        mousePos.x = e.pageX;
        mousePos.y = e.pageY;
        mouseDown = true;
        selected=phone;
        selected.rotate=true;
        selected.signal=true;
    });
    window.addEventListener('resize',positionBottomSheet);

    document.getElementById('linktoachievements').setAttribute('href','index.html#achievements');
}

function positionBottomSheet(){
    const a4Sheets=document.querySelectorAll('.a4');
    if(a4Sheets.length>0){
        let {height:heightSheet1}=getComputedStyle(a4Sheets[0]);
        a4Sheets[a4Sheets.length-1].style.setProperty('--page-height',`calc(${heightSheet1} + 9rem)`);
    }
}