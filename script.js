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
document.querySelector('.dark-btn').addEventListener('click',function(){
    document.body.classList.toggle('dark-mode')
    document.querySelector('.dark-btn').classList.toggle('posi')
})

$('.len-btn').click(function(){
    currWordLength=this.value;
    apiWord=words(currWordLength);
    $('.len-btn').removeClass('selected-len');
    removeKeyBoardColor();
    this.classList.add('selected-len');
    
    $('.try').html('')
    lengthOfWord(currWordLength)
    document.querySelector('.setting-cont').classList.remove('visible');
    userWord=[];
    
    
    array=[];
    trys=0;
    i=0;
})

const valid=/^[\a-\z]+$/;
var userWord=[];
var apiWord=words(currWordLength);
var array=[];
var trys=0;
var i=0;
var wordFound=false;


const boxes=document.querySelectorAll('.try')
if(trys > 5){
    gameOver();
}
document.querySelector('body').addEventListener('keyup',function(e){
    currLetter=e.key;
    main(currLetter);
})
$('.key').click(function(){
    currLetter=this.value;
    
    main(currLetter.toString())
})

async function main(currLetter){
    if(valid.test(currLetter) && userWord.length <= currWordLength-1 ){
        userWord.push(currLetter.toUpperCase())
        boxes[trys].children[i].textContent=currLetter.toUpperCase();
        boxes[trys].children[i].classList.add('trans')
        setTimeout(()=>{
            boxes[trys].children[i].classList.remove('trans')
        },1)
        
        i++;
    }
    if(currLetter == 'Backspace' && (userWord.length <= currWordLength && userWord.length>0)){
        i--;
        userWord.pop();
        boxes[trys].children[i].textContent='';
    }

    
    if(currLetter == 'Enter' && userWord.length == currWordLength ){
        
        var bool = await apiUserWord(userWord.join(''))
        setTimeout(function(){
            if(bool == true){
                array.push(userWord.join(''))
                checkWord(array[trys],apiWord,trys);
                userWord=[];
                trys++;
                if(trys > 5){
                    gameOver();
                }
                i=0;
            }else{
                document.querySelector('.word').classList.add('vis')
                setTimeout(function(){
                    document.querySelector('.word').classList.remove('vis') 
                },900)
            }
        },250)
        
    }
    
    
}

    async function apiUserWord(word) {
        try {
            const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
            if(response.status === 200){return true;} 
        } catch (err) {
            return false;
    }
    }


function checkWord(user,apiWord,trys){
    var dummyWord=[];
    var dummynum=[];
    for(var kk=0;kk<apiWord.length;kk++){
        if(dummyWord.includes(apiWord[kk])){
            dummynum[dummyWord.indexOf(apiWord[kk])]+=1;
        }else{
            dummyWord.push(apiWord[kk]);
            dummynum.push(1)
        }
    }
    var eachTry=$('.try'+(trys+1));
    if(user == apiWord){
        eachTry.children().addClass('bgcolor-green')
        setTimeout(function(){
            gameOver();
        },1000)
        clearTimeout();
    }else{
        for(var ii=0;ii<userWord.length;ii++){
            if(user[ii]==apiWord[ii] && dummyWord.includes(user[ii]) && dummynum[dummyWord.indexOf(user[ii])]>0){
                eachTry.children(`:nth-child(${ii+1})`).addClass('bgcolor-green');
                dummynum[dummyWord.indexOf(user[ii])]-=1;
                keyBoardColor(user[ii],'bgcolor-green')
            }
        }

        for(var ij=0;ij<userWord.length;ij++){
            if(user[ij]!=apiWord[ij] && dummyWord.includes(user[ij]) && dummynum[dummyWord.indexOf(user[ij])]>0){
                eachTry.children(`:nth-child(${ij+1})`).addClass('bgcolor-yellow');
                dummynum[dummyWord.indexOf(user[ij])]-=1;
                keyBoardColor(user[ij],'bgcolor-yellow')
            }
        }
        for(var ik=0;ik<userWord.length;ik++){
            if(dummyWord.includes(user[ik]) && dummynum[dummyWord.indexOf(user[ik])]>0){
                
            }else{
                eachTry.children(`:nth-child(${ik+1})`).addClass('bgcolor-grey');
                keyBoardColor(user[ik],'bgcolor-grey')
            }
        }
    }
}

function keyBoardColor(user,addStyle){
    document.querySelectorAll('.key').forEach(i=>{
        if(i.value.toUpperCase() == user){
            i.classList.add(addStyle)
        }
    })
}
function removeKeyBoardColor(){
    $('.key').removeClass('bgcolor-green')
    $('.key').removeClass('bgcolor-yellow')
    $('.key').removeClass('bgcolor-grey')
}

function gameOver(){
    $('.api-word')[0].textContent=apiWord;
    $('.gameOver').addClass('vis')
}

$('.play').click(function(){
    removeKeyBoardColor();
    $('.gameOver').removeClass('vis');
    $('.try').html('')
    lengthOfWord(currWordLength)
    userWord=[];
    apiWord=words(currWordLength);
    
    array=[];
    trys=0;
    i=0;
})

function words(length){
randomWord(length)


async function randomWord(length){
    setTimeout(()=>{
        $('.guess-word').addClass('vis')
    },500)
    clearTimeout();
    var res = await fetch(`https://random-word-api.herokuapp.com/word?length=${length}`)
    var word = await res.json()
    
    if(await checkWordInApi(word)){
        
        apiWord= word[0].toUpperCase();
        setTimeout(()=>{
            $('.guess-word').removeClass('vis')
        },500)
        
        console.log(apiWord)
    }else{
        return randomWord(length);
    }
}

async function checkWordInApi(word) {
    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        return response.status === 200; 
    } catch (err) {
        return false;
}
}
}
