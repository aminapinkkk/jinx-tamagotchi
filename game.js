const $=s=>document.querySelector(s);
const defaults={hunger:70,mood:70,energy:70,streak:0,outfit:"classic"};
let state=JSON.parse(localStorage.getItem("jinxTamagotchi")||"null")||defaults;
let totalSeconds=25*60, remaining=totalSeconds, running=false, interval=null, focusMode=true;

function save(){localStorage.setItem("jinxTamagotchi",JSON.stringify(state))}
function clamp(n){return Math.max(0,Math.min(100,Math.round(n)))}
function render(){
  $("#hunger").textContent=state.hunger; $("#mood").textContent=state.mood; $("#energy").textContent=state.energy;
  $("#hungerBar").style.width=state.hunger+"%"; $("#moodBar").style.width=state.mood+"%"; $("#energyBar").style.width=state.energy+"%";
  $("#streak").textContent=state.streak;
  $("#character").className="character "+state.outfit;
  document.querySelectorAll(".outfit").forEach(b=>b.classList.toggle("active",b.dataset.outfit===state.outfit));
  const m=Math.floor(remaining/60),s=remaining%60;
  $("#timer").textContent=String(m).padStart(2,"0")+":"+String(s).padStart(2,"0");
  $("#mode").textContent=focusMode?"Фокус":"Отдых";
}
function say(t){$("#speech").textContent=t}
function mutate(a,b,c,msg){state.hunger=clamp(state.hunger+a);state.mood=clamp(state.mood+b);state.energy=clamp(state.energy+c);save();render();say(msg)}

$("#feed").onclick=()=>mutate(18,5,-3,"М-м! Вот это еда!");
$("#play").onclick=()=>mutate(-4,16,-10,"Ха! Ещё раз!");
$("#rest").onclick=()=>mutate(0,6,20,"Zzz... не шумите.");

document.querySelectorAll(".outfit").forEach(b=>b.onclick=()=>{state.outfit=b.dataset.outfit;save();render();say("Неплохо выгляжу, да?")});
document.querySelectorAll(".preset").forEach(b=>b.onclick=()=>{
 if(running)return;
 totalSeconds=Number(b.dataset.min)*60;remaining=totalSeconds;
 document.querySelectorAll(".preset").forEach(x=>x.classList.remove("active"));b.classList.add("active");render();
});
$("#start").onclick=()=>{
 if(running){clearInterval(interval);running=false;$("#start").textContent="▶ Продолжить";return}
 running=true;$("#start").textContent="Ⅱ Пауза";say(focusMode?"Не отвлекайся. Я тоже буду работать.":"Перерыв. Отдыхай!");
 interval=setInterval(()=>{
   remaining--;render();
   if(remaining<=0){clearInterval(interval);running=false;
     if(focusMode){state.streak++;state.mood=clamp(state.mood+15);state.energy=clamp(state.energy-5);save();say("Готово! Ты справился. 💜");focusMode=false;remaining=5*60}
     else{say("Перерыв закончился. Ещё один заход?");focusMode=true;remaining=25*60}
     $("#start").textContent="▶ Начать";render();
   }
 },1000)
};
$("#reset").onclick=()=>{clearInterval(interval);running=false;focusMode=true;remaining=totalSeconds;$("#start").textContent="▶ Начать";render();say("Ну что, работаем?")};

setInterval(()=>{if(!running){state.hunger=clamp(state.hunger-1);state.energy=clamp(state.energy-1);save();render()}},60000);
render();