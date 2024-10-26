const achievements = {
    scroller: false,
    gamer: false,
    programmer: false,
    email: false,
    resume: false,
    recruiter() { return (this.email && this.resume) },
    networker: false,
    collector() { return (this.scroller && this.gamer && this.programmer && this.recruiter() && this.networker) },
    curious: false,
    mystery:false
}

retrieveAchievements(achievements);
achievementCounts();

swup.on('contentReplaced',()=>{
    if(swup.cache.swup.currentPageUrl === '/index.html' || swup.cache.swup.currentPageUrl === '/'){        
        console.log(`achievements.js noticed contentReplaced with ${swup.cache.swup.currentPageUrl}`); 
        retrieveAchievements(achievements);
        achievementCounts();
    }
});


document.getElementById('linkedinlink')?.addEventListener('pointerdown', (event) => {
    achieve('networker');
});

document.getElementById('githublink')?.addEventListener('pointerdown', (event) => {
    achieve('programmer');
});

document.getElementById('myemail')?.addEventListener('click', (event) => {
    achieve('email');
});

document.getElementById('games')?.addEventListener('pointerdown', (event) => {
    achieve('gamer');
});

document.querySelectorAll('.gamer').forEach(link=>link.addEventListener('pointerdown', (event) => {
    achieve('gamer');
}));

window.addEventListener('scroll', (event) => {
    achieve('scroller');
});

function achievementCounts(){
    console.log("Counting how many achievements others got...");
    const before=new Date().getTime();
    $.ajax({
        url:"achieve.php",
        success:(data)=>{
            Object.keys(data).forEach(achievement=>{
                let pluralPerson="people";
                if(data[achievement]==1){
                    pluralPerson="person";
                }
                $('#'+achievement).attr('title',`Achieved by ${data[achievement]} ${pluralPerson}`);
            });
            console.log(`It took ${new Date().getTime()-before}ms to count them.`)
        }
    });
}


function achieve(achievement) {
    const oldVal=achievements[achievement];
    const oldCollector=achievements.collector();
    const oldRecruiter=achievements.recruiter();
    achievements[achievement] = true;
    if(!oldVal){
        storeAchievement(achievement);
    }
    if (!oldRecruiter && achievements.recruiter()) {                
        newAchievementSuccess('recruiter');
        $('#recruiter').removeClass('uncollected');

    }
    if (!oldCollector && achievements.collector()) {
        newAchievementSuccess('collector');
        $('#collector').removeClass('uncollected');
    }
    if(!oldVal && (achievement!='email' && achievement!='resume')){                
        newAchievementSuccess(achievement);
        $('#' + achievement).removeClass('uncollected');
    }
    
}

const notification=document.getElementById('notification');
const note=document.getElementById('note');
let celebration;
const currentlyCelebrating=[];
function newAchievementSuccess(achievement){
    $.ajax({
        url:"achieve.php",
        data:{[achievement]:true},
        method:'POST',
        success:(data)=>{
            Object.keys(data).forEach(achievement=>{
                let pluralPerson="people";
                if(data[achievement]==1){
                    pluralPerson="person";
                }
                $('#'+achievement).attr('title',`Achieved by ${data[achievement]} ${pluralPerson}`);
            });
        }
    });

    currentlyCelebrating.push(achievement.toUpperCase());
    setTimeout(()=>{
        currentlyCelebrating.shift();
    },3333);
    currentlyCelebratingText=currentlyCelebrating.join(', ');
    const indexOfLastComma=currentlyCelebratingText.lastIndexOf(',');
    if(indexOfLastComma>0){
        currentlyCelebratingText=currentlyCelebratingText.substring(0,indexOfLastComma).concat(' &',currentlyCelebratingText.substring(indexOfLastComma+1));
    }
    note.textContent=`You have achieved ${currentlyCelebratingText}`;
    notification.style.left='50px';
    switch(Math.floor(Math.random()*3)){
        case 0:{
    party.confetti(container);
            break;
        }
        case 1:{
    party.sparkles(container);
            break;
        }
        case 2:{
    fireworks.start();
            break;
        }
    }
    clearTimeout(celebration);
    celebration=setTimeout(()=>{
        notification.style.left='';
        fireworks.stop();
    },3333);
}

function storeAchievement(achievement){
    localStorage.setItem(achievement,'true');
}

function retrieveAchievements(achievements){
    console.log("Retrieving your stored achievements");
    Object.keys(achievements).forEach(achievement=>{
        if(typeof achievements[achievement]==='boolean'){ 
            achievements[achievement]=Boolean(localStorage.getItem([achievement]));
            if(achievements[achievement]){            
                $(`#${[achievement]}`).removeClass('uncollected');
            }
        }
    });
    if(achievements.recruiter()){        
        $('#recruiter').removeClass('uncollected');
    }
    if(achievements.collector()){
        $('#collector').removeClass('uncollected');
    }
}

let newEmployee = {
    firstName: "Harry",
    surname: "Legg",
    onboard() {achieve("mystery");}
}

/*!
devtools-detect
https://github.com/sindresorhus/devtools-detect
By Sindre Sorhus
MIT License
*/

const devtools = {
    isOpen: false,
    orientation: undefined,
};

const threshold = 170;

const emitEvent = (isOpen, orientation) => {
    globalThis.dispatchEvent(new globalThis.CustomEvent('devtoolschange', {
        detail: {
            isOpen,
            orientation,
        },
    }));
};

const main = ({ emitEvents = true } = {}) => {
    const widthThreshold = globalThis.outerWidth - globalThis.innerWidth > threshold;
    const heightThreshold = globalThis.outerHeight - globalThis.innerHeight > threshold;
    const orientation = widthThreshold ? 'vertical' : 'horizontal';

    if (
        !(heightThreshold && widthThreshold)
        && ((globalThis.Firebug && globalThis.Firebug.chrome && globalThis.Firebug.chrome.isInitialized) || widthThreshold || heightThreshold)
    ) {
        if ((!devtools.isOpen || devtools.orientation !== orientation) && emitEvents) {
            emitEvent(true, orientation);
        }

        devtools.isOpen = true;

        achieve('curious');
        devtools.orientation = orientation;
    } else {
        if (devtools.isOpen && emitEvents) {
            emitEvent(false, undefined);
        }

        devtools.isOpen = false;
        devtools.orientation = undefined;
    }
};

main({ emitEvents: false });
setInterval(main, 2000);