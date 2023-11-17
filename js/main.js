// assign variables
const questionDisplay = document.querySelector("#question")
const currentPageNumber = document.querySelector("#current-number")
const totalPageNumber = document.querySelector("#total-number")
const ansA = document.querySelector("#ans-a")
const ansB = document.querySelector("#ans-b")
const ansC = document.querySelector("#ans-c")
const ansD = document.querySelector("#ans-d")
const allPosAns = document.querySelectorAll("[data-pos-ans]")
const completeDialog = document.querySelector("#complete-dialog")
const newGameBtn = document.querySelector("[data-new-game]")
const correctSound = document.querySelector("#correct-sound")
const wrongSound = document.querySelector("#wrong-sound")
const completedSound = document.querySelector("#completed-sound")
const danceSound = document.querySelector("#dance-sound")
const hintSound = document.querySelector("#hint-sound")
const volumeBtn = document.querySelector("#volume-btn")
const correctScore = document.querySelector("#correct-ans")
const wrongScore = document.querySelector("#wrong-ans")
const percentScore = document.querySelector("#score-per")
const hintBtn = document.querySelector("#hint-btn")
const hintCloseBtn = document.querySelector("#hint-close-btn")
const hintDisplay = document.querySelector("#hint-display")
const hintAns = document.querySelector("#hint-ans")
const hintCount = document.querySelector("#hint-count")

let counter = 0
let isCompleted = false
let currentPage = 1
let hasPicked = false
let musicPlaying = true
let correctAnsPicked = 0
let wrongAnsPicked = 0
let percentageOfScore
let hintNum = 5

hintCount.textContent = hintNum

// new game button
newGameBtn.addEventListener("click", e =>{
    e.target.parentElement.classList.add("vanish")
    e.target.parentElement.classList.remove("appear")
    window.location.reload()
    // fetchQuestion()
    // reset()
})

// volume button 
volumeBtn.addEventListener("click", musicToggle)
// hint btn
hintBtn.addEventListener("click", revealHint)
hintCloseBtn.addEventListener("click", closeHint)

// load question on load
window.addEventListener("DOMContentLoaded", ()=>{
    fetchQuestion()
})

chooseAnswer()
displayHintAns()

// disable hint button when reveal hint
function disableHintBtn() {
    if(hintDisplay.classList.contains("appear")) {
        hintBtn.classList.add("vanish")
        hintBtn.classList.remove("appear")
        danceSound.pause()
        hintSound.play()
    }else {
        danceSound.play()
        hintSound.pause()
        hintBtn.classList.add("appear")
        hintBtn.classList.remove("vanish")
    }
}
// reveal hint
function revealHint() {
    hintDisplay.classList.remove("vanish")
    hintDisplay.classList.add("appear")
    
    disableHintBtn()
    hintNum--
    hintCount.textContent = hintNum
    if(hintNum === 0) {
        hintBtn.disabled = true
    }else {
        hintBtn.disabled = false
    }
}
function closeHint() {
    hintDisplay.classList.remove("appear")
    hintDisplay.classList.add("vanish")
    disableHintBtn()
}
// music toggle func
function musicToggle() {
    if (musicPlaying) {
        danceSound.pause()
        musicPlaying = false
        volumeBtn.innerHTML = `
        <h5 style="font-size: 1rem;">Off</h5>
        <i class="fas fa-volume-mute"></i>`
    } else {
        danceSound.play()
        musicPlaying = true
        volumeBtn.innerHTML = `
        <h5 style="font-size: 1rem;">On</h5>
        <i class="fas fa-volume-up"></i>`
    }
}
// reset function
function reset() {
    counter = 0
    isCompleted = false
    // newGameBtn.disabled = false
}
// hint display correct ans
function displayHintAns() {
    fetch("/questions.json").then( res =>{
        if(!res.ok) {
            throw Error("ERROR! There was an error opening URL.")
        }
        return res.json()
    }).then(data => {
        if(!isCompleted) {
            let hintCorrectAns =  data.quizzes[counter].correct_ans.toUpperCase()
            hintAns.textContent = hintCorrectAns
        }
        // fetchQuestion()
    }).catch(err =>{
        console.log(err)
    })
} 
// next question
function nextQuest() {
    displayHintAns()
    if(hasPicked) {
        fetchQuestion()
        counter++
        resetPickedQuest()
        hasPicked = false
        currentPage++
    }
}

// reset picked question
function resetPickedQuest() {
    allPosAns.forEach(ans => {
            ans.classList.remove("correct")
            ans.classList.remove("wrong")
        }
    )
}
// choose answer func
function chooseAnswer() {
    fetch("/questions.json").then( res =>{
        if(!res.ok) {
            throw Error("ERROR! There was an error opening URL.")
        }
        return res.json()
    }).then(data => {
        // checking for correct answers
        allPosAns.forEach(ans => {
            ans.addEventListener("click", () => {
                if(!hasPicked) {
                    let currentQuest = data.quizzes[counter]
                    var correctAns = currentQuest.correct_ans.toUpperCase()
                    const currentAns = ans.querySelector("[data-this-ans]").textContent.toUpperCase()

                    hasPicked = true

                    if(currentAns === correctAns) {
                        ans.classList.add("correct")
                        ans.classList.remove("wrong")
                        correctAnsPicked++
                        correctSound.play()
                    }
                     else {
                        ans.classList.remove("correct")
                        ans.classList.add("wrong")
                        wrongSound.play()
                        wrongAnsPicked++
                                       
                        setTimeout(() => {
                            const theCurentOpt = ans.querySelector("[data-this-ans]")
                            const theCurentOptParent = ans.querySelector("[data-this-ans]").parentElement.parentElement
                            const allSiblins = Array.from(theCurentOptParent.children).filter(sibling => sibling.textContent !== theCurentOpt.textContent)
    
                            allSiblins.forEach(sibling =>{
                                const thisIsCorrect = sibling.querySelector("[data-this-ans]")
    
                                if (thisIsCorrect.textContent === correctAns) {
                                    const correctAnsParentNode = thisIsCorrect.parentNode
    
                                    correctAnsParentNode.classList.add("correct")
                                    correctAnsParentNode.classList.remove("wrong")
                                }
                            })
                        }, 500);
                       
                    }
                    
                    setTimeout(() => {
                        nextQuest()
                    }, 2500);
                }
            })
        })
    })
    

} 
// get siblings
function getSiblings(element, parent) {
    const children = [...parent.children]
    return children.filter(child => child !== element)
}
// fetch data func
function fetchQuestion() {
    fetch("/questions.json").then( res =>{
        if(!res.ok) {
            throw Error("ERROR! There was an error opening URL.")
        }
        return res.json()
    }).then(data => {
        const quizzes = data.quizzes
        let currentQuest = quizzes[counter]
        
        if(counter > quizzes.length - 1) {
            counter = 0
            currentPage = 1
            isCompleted = true

            // when game is completed
            if(isCompleted) {
                completeDialog.classList.remove("vanish")
                completeDialog.classList.add("appear")
                completedSound.play()
                danceSound.pause()
                correctScore.textContent = correctAnsPicked
                wrongScore.textContent = wrongAnsPicked
                let totalNumberOfQuestions = Number(totalPageNumber.textContent) 
                percentageOfScore = Math.floor((correctAnsPicked / totalNumberOfQuestions) * 100)
                percentScore.textContent = percentageOfScore + "%"
            }
            else {
                completeDialog.classList.remove("appear")
                completeDialog.classList.add("vanish")
            }
            return
        }
        // progress tracking
        totalPageNumber.textContent = quizzes.length
        currentPageNumber.textContent = currentPage
        // questions displaying
        questionDisplay.textContent = currentQuest.question

        // all possible answers
        ansA.textContent = currentQuest.ans_a
        ansB.textContent = currentQuest.ans_b
        ansC.textContent = currentQuest.ans_c
        ansD.textContent = currentQuest.ans_d
        
    }).catch(err =>{
        alert("Error! There was an error getting the data you need.", err)
    })
}

