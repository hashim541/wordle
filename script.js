var currWordLength=5;
var eachLevel=document.querySelectorAll('.try');
lengthOfWord(currWordLength);

function lengthOfWord(currWordLength){
   document.querySelectorAll('.try').forEach(i =>{
    for(k=1;k<=currWordLength;k++){
        appendChildBox(i);
    }
   })
}
function appendChildBox(i){
    const div=document.createElement('div');
    div.innerText=''
    div.classList.add('box');
    div.setAttribute('style','width:'+(100/currWordLength)+'%;');
    i.appendChild(div);
}
document.querySelector('.settings').addEventListener('click',function(){
    document.querySelector('.setting-cont').classList.add('visible')
})
document.querySelector('.wrong').addEventListener('click',function(){
    document.querySelector('.setting-cont').classList.remove('visible');
})
var word=[];
var apiWord='shark';
var array=[]
var ii=0;
var tryss=0;
document.querySelectorAll('.len-btn').forEach(btns=>{
    btns.addEventListener('click',function(){
        $('.len-btn').removeClass('selected-len')
        console.log(this);
        this.classList.add('selected-len')
        gameRestart(this.value);
    })
    
})



const valid=/^[\a-\z]+$/

document.querySelector('body').addEventListener('keyup',function(e){
    main(e.key);
})

function checkWord(user,api,tryss){
    var level=document.querySelector('.try'+(tryss+1))
    var dummy=intoObject(api);
    if(user == api){
        for(i=0;i<currWordLength;i++){
            level.children[i].classList.add('bgcolor-green')
        }
    }else{
        for(i=0;i<currWordLength;i++){
            if(user[i] in dummy && user[i]== api[i] && dummy[user[i]] >0){
                dummy[user[i]]--;
                level.children[i].classList.add('bgcolor-green')
            }
            
        }

        for(j=0;j<currWordLength;j++){
            if(user[j] in dummy && user[j]!= api[j] && dummy[user[j]] >0){
                dummy[user[j]]--;
                level.children[j].classList.add('bgcolor-yellow')
            }
        }

        for(k=0;k<currWordLength;k++){
            if(user[k] in dummy && dummy[user[k]]>0){

            }else{
                level.children[k].classList.add('bgcolor-grey')
            }
        }
        
    }
}

function intoObject(api){
    var a=api.split('');
    var res=new Object();
    a.forEach(i=>{
        if(i in res){
            res[i]++;
        }else{
            res[i]=1;
        }
    })
    console.log(res)
    return res;
}


function main(v){
    var currLetter=v;
    
    if(valid.test(currLetter) && word.length <= currWordLength-1){
        word.push(currLetter.toUpperCase())
        eachLevel[tryss].children[ii].textContent=word[ii]
        ii++;
    }

    if(currLetter == 'Backspace' &&(word.length >0 && word.length <= currWordLength)){
        ii--;
        word.pop()
        eachLevel[tryss].children[ii].textContent='';
        
    }
    if(currLetter == 'Enter' && word.length==currWordLength){
        array.push(word.join(''))
        console.log(array[tryss])
        checkWord(array[tryss],apiWord.toUpperCase(),tryss);
        word=[];
        tryss++;
        ii=0;   
    }
    if(tryss>5){
        transitions()
    }
}

function gameRestart(val){
    document.querySelector('.setting-cont').classList.remove('visible');
    eachLevel.forEach(i=>{
        i.innerHTML='';
    })
    
    $('.box').text='';
    currWordLength=val;
    lengthOfWord(currWordLength)
    word=[];
    ii=0;
    tryss=0;
}
function transitions(){
    setTimeout(function(){
        document.querySelector('.api-word').innerText=apiWord.toUpperCase();
        document.querySelector('.gameOver').classList.add('vis');
    },1000)
    clearTimeout();
    setTimeout(function(){
        gameRestart(currWordLength);
        document.querySelector('.gameOver').classList.remove('vis');
    },5000)
    clearTimeout();
}