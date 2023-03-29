const now = new Date();
let time = `${('0' + now.getHours()).slice(-2)}:${('0' + now.getMinutes()).slice(-2)}`;
let clocks=document.querySelectorAll(".clock");
updateClocks();
setInterval(() => {
    const now = new Date();
    time = `${('0'+now.getHours()).slice(-2)}:${('0'+now.getMinutes()).slice(-2)}`;
    updateClocks();
}, 60000);

function updateClocks(){
    clocks.forEach(clock=>{
        clock.textContent=time;
    });
}