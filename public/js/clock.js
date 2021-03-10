const clockContainer = document.querySelector('.js-clock');
const clockTitle = document.querySelector('h1');

function getTime(){
    const date = new Date();
    const hour = date.getHours();
    const min = date.getMinutes();
    const sec = date.getSeconds();

    clockTitle.textContent = `${hour<10? `0${hour}`:hour}:${min<10? `0${min}`:min}:${sec<10? `0${sec}`:sec}`;
}

getTime();

setInterval(getTime,1000);