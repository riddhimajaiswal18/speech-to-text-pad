let startBtn=document.querySelector('.start')
let stopBtn=document.querySelector('.stop')
let clearBtn=document.querySelector('.clear')
let saveBtn=document.querySelector('.save')
let statusBar = document.querySelector('.status-bar');
let textFinal = document.querySelector('.text .final');
let textInterim = document.querySelector('.text .interim');
let notesDrawer=document.querySelector('.notes-drawer')


 const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

 if (!SpeechRecognition) {
   alert("Speech Recognition not supported in this browser"); 
}
 const recognition = new SpeechRecognition();
 recognition.continuous = true;  
 recognition.interimResults = true;
 recognition.lang = "en-IN";


startBtn.addEventListener('click',function(){
  recognition.start();
   console.log("Listening...")
   statusBar.innerText="Listening..."

})


stopBtn.addEventListener('click',function(){
  recognition.stop();
  console.log("Stopped.");
  statusBar.innerText="Stopped."
  stopAnalyser();
})


clearBtn.addEventListener('click',function(){
  recognition.stop();
  textFinal.textContent = ''
  textInterim.textContent = ''
  console.log('clr');
  statusBar.textContent = 'Cleared current transcription.'
})


saveBtn.addEventListener('click',function(){
  console.log("trying to save");
  
   let saveContent=textFinal.textContent;
   setNotes(saveContent) //
    //render notes to add to ui
    addNotesToUI()
   statusBar.textContent="Saved Successfully!"
   textFinal.textContent=''
   textInterim.textContent='' 
})



function getNotes() {
  const text = localStorage.getItem('savedNotes')
    if(text)
        return JSON.parse(text)
    else
        return []
}


function setNotes(notes) {
  let savedNotes=getNotes()
  let objNotes={
    id: 'note-' + Date.now(),
    text: notes,             
    created: Date.now()        
  }
  savedNotes.push(objNotes) //
  localStorage.setItem('savedNotes', JSON.stringify(savedNotes))
}

 
function addNotesToUI() {
  const notes = getNotes();
  const list = document.querySelector('.noteslist');
  list.innerHTML = ""

  notes.forEach(note => {
    const card = document.createElement('div');
    card.className = 'note';
    card.dataset.id = note.id; 

    const noteText = document.createElement('div');
    noteText.className = 'note-text';
    noteText.innerHTML = `
  <div style="font-size:0.8rem; color:#aaa; margin-bottom:6px">
    ${new Date(note.created).toLocaleString()}
  </div>
  <div>${note.text}</div>
`;

    const actions = document.createElement('div');
    actions.className = 'note-actions';

    card.appendChild(noteText);
    card.appendChild(actions);

    list.appendChild(card);
  });
}

 recognition.onresult = (event) => {
  let interim = ''
  for (let i = event.resultIndex; i < event.results.length; i++) {
    let transcript = event.results[i][0].transcript
    if (event.results[i].isFinal) {
      textFinal.textContent = (textFinal.textContent + ' ' + transcript).trim()
    } else {
      interim += transcript
    }
  }
  textInterim.textContent = interim
}

addNotesToUI();

//left add notes to UI n check local storage