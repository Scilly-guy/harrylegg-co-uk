const prefersReducedMotion = window.matchMedia(`(prefers-reduced-motion: reduce)`) === true || window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;

let themeSelectors;
let currentBreakdownDisplay='none';
const container = document.querySelector('.fireworks');
const fireworks = new Fireworks.default(container);
const swup=new Swup({
    plugins: [new SwupScrollPlugin({     
        doScrollingRightAway:true,   
        animateScroll:{
            betweenPages:false
        },
        scrollFriction:0,
        scrollAcceleration:1
    })]
});

const preloadResumeBackground=new Image();
preloadResumeBackground.src='assets/wood.png';

placeEventListeners();

swup.on('contentReplaced',()=>{
    if(swup.cache.swup.currentPageUrl === '/index.html' || swup.cache.swup.currentPageUrl === '/'){
        console.log(`main.js noticed contentReplaced with ${swup.cache.swup.currentPageUrl}`);
        placeEventListeners();
        retrieveTheme();
        currentBreakdownDisplay='none';
    }
});

function placeEventListeners(){
    if(swup.cache.swup.currentPageUrl==='/' || swup.cache.swup.currentPageUrl==='/index.html'){
        $('#name')?.val('');
        $('#email')?.val('');
        $('#message')?.val('');
        const myEmail = document.getElementById("myemail")?.textContent;
        const copyemail = document.getElementById("copyemail");
        copyemail.addEventListener("click", () => {
            navigator.clipboard.writeText(myEmail);
            document.getElementById("tick").setAttributeNS(null, "class", "");
            achieve('email');
        });
        const sendEmailButton = document.getElementById("contactsubmit");
        sendEmailButton.addEventListener("click", (event) => {
            event.preventDefault();
            $("body").css('cursor','wait');
            var formData = {
                'name': $('#name').val(),
                'email': $('#email').val(),
                'message': $('#message').val()
            };
            $.ajax({
                type:'POST',
                method:'POST',
                url: 'mail.php',
                data: formData,
                dataType: 'json',
                encode: true,
                success: (res) => {                        
                    console.log(res);
                    if (res.status == 200) {
                        displaySuccessfulEmail();
                        achieve('email');
                    }
                    else {
                        console.log(res.message);
                    }
                    $("body").css('cursor','auto');
                }
            });
        });//end send email
        document.getElementById('decreaseWaveCount').addEventListener('click',(event)=>{
            const waves=document.querySelector('.resizewaves');
            let waveCount=parseInt(getComputedStyle(waves).getPropertyValue('--wave-count'));
            waves.style.setProperty('--wave-count',--waveCount);
            document.getElementById('waveCount').textContent=waveCount.toString();
        });
        document.getElementById('increaseWaveCount').addEventListener('click',(event)=>{
            const waves=document.querySelector('.resizewaves');
            let waveCount=parseInt(getComputedStyle(waves).getPropertyValue('--wave-count'));
            waves.style.setProperty('--wave-count',++waveCount);
            document.getElementById('waveCount').textContent=waveCount.toString();
        });
        document.querySelectorAll('.close').forEach(closeButton=>{
            closeButton.addEventListener('click',(event)=>{
                event.target.parentNode.parentNode.style.setProperty("display",'none');
            });
        });
        document.querySelectorAll('.card').forEach(card=>{
            card.addEventListener('click',(event)=>{
                const clone=event.currentTarget.cloneNode(true);
                event.currentTarget.style.visibility='hidden';
                
                const breakdownButtons=clone.querySelectorAll('.breakdownButton');
                breakdownButtons.forEach(button=>{
                    button.addEventListener('click',breakDownHandler);
                });
                clone.addEventListener('click',(cloneEvent)=>{
                    const target=cloneEvent.currentTarget;
                    const returnToTop=target.dataset.originaltop;
                    const returnToLeft=target.dataset.originalleft;
                    const returnToWidth=target.dataset.originalwidth;
                    let {top:fromTop,left:fromLeft,width:fromWidth}=getComputedStyle(target);
                    fromTop=parseInt(fromTop.slice(0,-2));
                    fromLeft=parseInt(fromLeft.slice(0,-2));
                    fromWidth=parseInt(fromWidth.slice(0,-2));                    
                    let thisTop=fromTop;
                    let thisLeft=fromLeft;
                    let thisWidth=fromWidth;
                    const originalElem=document.getElementById(target.id.slice(0,-5));
                    target.style.width=`${returnToWidth}px`;
                    if(prefersReducedMotion){
                        originalElem.style.visibility='';
                        target.parentNode.removeChild(target);
                    }
                    else{
                        const interval=setInterval(slideBack,5);
                        function slideBack(){
                            if(Math.abs(thisTop-returnToTop)>3){
                                thisTop-=(fromTop-returnToTop)/40;
                                target.style.setProperty('top',`${thisTop}px`);
                            }
                            if(Math.abs(thisLeft-returnToLeft)>3){
                                thisLeft-=(fromLeft-returnToLeft)/40;
                                target.style.setProperty('left',`${thisLeft}px`);
                            }
                            if(Math.abs(thisTop-returnToTop)<=3 
                            && Math.abs(thisLeft-returnToLeft)<=3){
                                clearInterval(interval);
                                originalElem.style.visibility='';
                                setTimeout(()=>{target.parentNode.removeChild(target);},50);
                            }
                        }
                    }
                });
                clone.id=event.currentTarget.id+'clone';
                event.currentTarget.parentNode.appendChild(clone);
                const {x:originalX,y:originalY}=event.currentTarget.getBoundingClientRect();
                let {width:originalWidth}=getComputedStyle(event.currentTarget);
                originalWidth=parseInt(originalWidth.slice(0,-2));
                clone.style.position='absolute';
                const positionedRelativeTo=ancestorWithRelativePositioning(event.currentTarget);
                const {x:relativeX,y:relativeY}=positionedRelativeTo.getBoundingClientRect();
                const originalTop=originalY-relativeY;
                const originalLeft=originalX-relativeX;
                clone.style.setProperty('top',`${originalTop}px`);//calc( + 2 * var(--nav-height))
                clone.style.width='min(100dvw, 900px)';
                clone.style.setProperty('left',`${originalLeft}px`);
                clone.style.setProperty('z-index','4');
                clone.classList.add('width-transition');
                clone.setAttribute('data-originaltop',Math.floor(originalTop));
                clone.setAttribute('data-originalleft',Math.floor(originalLeft));
                clone.setAttribute('data-originalwidth',Math.floor(originalWidth));

                clone.querySelectorAll('p').forEach(paragraph=>{
                    paragraph.style.fontSize='var(--prefered-font-size)';
                });

                const navHeight=getComputedStyle(document.querySelector('.floatingNav')).height.slice(0,-2);
                const targetTop=-relativeY+2*parseInt(navHeight);
                const targetWidth=Math.min(window.innerWidth,900);
                const targetLeft=(window.innerWidth-targetWidth)/2;
                let currentTop=originalTop;
                let currentLeft=originalLeft;
                if(prefersReducedMotion){                    
                    clone.style.setProperty('top',`${targetTop}px`);
                    clone.style.setProperty('left',``);
                }
                else{
                    const interval=setInterval(slide,5);
                    function slide(){
                        if(Math.abs(currentTop-targetTop)>3){
                            currentTop-=(originalTop-targetTop)/40;
                            clone.style.setProperty('top',`${currentTop}px`);
                        }
                        if(Math.abs(currentLeft-targetLeft)>3){
                            currentLeft-=(originalLeft-targetLeft)/40;
                            clone.style.setProperty('left',`${currentLeft}px`);
                        }
                        if(Math.abs(currentTop-targetTop)<=3 && Math.abs(currentLeft-targetLeft)<=3){
                            clearInterval(interval);
                            clone.style.setProperty('left',``);
                        }
                    }
                }
            });
        });
        document.querySelectorAll('.minimise').forEach(minimise=>{
            minimise.addEventListener('click',(event)=>{
                if(event.target.parentNode.parentNode.style.height==='var(--nav-height)')
                {
                    event.target.parentNode.parentNode.style.height='unset';
                }
                else{
                    event.target.parentNode.parentNode.style.height='var(--nav-height)'
                }
            });
        });
        const breakdownButtons=document.querySelectorAll('.breakdownButton');
        breakdownButtons.forEach(button=>{
            button.addEventListener('click',breakDownHandler);
        });
        let os='windows';
        if(navigator.appVersion.indexOf('Mac')!=-1){
            os='mac'
        }
        else if(navigator.appVersion.indexOf('X11')!=-1){
            os='unix'
        }
        else if(navigator.appVersion.indexOf('Linux')!=-1){
            os='unix'
        }
        document.querySelectorAll('.breakdown').forEach(breakdown=>{
            breakdown.classList.add(os);
        });
    }

    window.matchMedia('(prefers-color-scheme:dark)').addEventListener('change',(event)=>{
        event.matches ? setTheme("dark") : setTheme("light");
    });

    themeSelectors=document.querySelectorAll('[name="theme"]');
    themeSelectors.forEach((themeOption)=>{
        themeOption.addEventListener('click',()=>{
            storeTheme(themeOption.id);
            setTheme(themeOption.id);
        });
    });

    retrieveTheme();
}






    






function storeTheme(theme){
    localStorage.setItem("theme",theme);
}
function retrieveTheme(){
    const activeTheme = localStorage.getItem("theme");
    
    if(activeTheme === null){
        window.matchMedia('(prefers-color-scheme:dark)').matches ? setTheme("dark") : setTheme("light");
    }
    else{
        setTheme(activeTheme);    
    }        
}
function setTheme(theme){
    document.documentElement.className=theme;
    console.log(`Setting theme to ${theme}`);
    themeSelectors.forEach(themeOption=>{
        if(themeOption.id===theme){
            themeOption.checked=true;
        }
    });
}

function displaySuccessfulEmail() {
    $('#name').val('');
    $('#email').val('');
    $('#message').val('');
    const text = 'Your email was sent successfully.';
    const chars = text.split('');
    let i = 0;
    const intervalId = setInterval(function () {
        $('#message').val(text.substring(0,i));
        i++;            
    }, 50);
    const clearThatInterval=setTimeout(function(){clearInterval(intervalId);},(chars.length+1)*55+250);
}

function convertRemToPixels(rem) {    
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

function breakDownHandler(event){
    event.stopPropagation();
    const breakdownElements=document.querySelectorAll('.breakdown');
    let oldDisplay=currentBreakdownDisplay;
    if(currentBreakdownDisplay==='none'){
        currentBreakdownDisplay='flex';
    }
    else{
        currentBreakdownDisplay='none';
    }
    breakdownElements.forEach(breakdownElement=>{
        breakdownElement.style.setProperty('display',currentBreakdownDisplay);
    });
}
