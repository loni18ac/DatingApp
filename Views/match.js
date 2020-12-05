/*
if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

function ready() {
    var removeMatchButtons = document.getElementsByClassName('btn-danger')
    for (var i = 0; i < removeMatchButtons.length; i++) {
        var button = removeMatchButtons[i]
        button.addEventListener('click', removeMatch)
    }

    var likeButtons = document.getElementsByClassName('like-user-button')
    for (var i = 0; i < likeButtons.length; i++) {
        var button = likeButtons[i]
        button.addEventListener('click', likeUserClicked)

    }
    var dislikeButtons = document.getElementsByClassName('dislike-user-button')
    for (var i = 0; i < dislikeButtons.length; i++) {
        var button = dislikeButtons[i]
        button.addEventListener('click', dislikeUser)
    }
}


function removeMatch(event) {
    var buttonClicked = event.target
    buttonClicked.parentElement.parentElement.remove() 
}

function dislikeUser(event) {
    var buttonClicked = event.target
    buttonClicked.parentElement.remove()
}


function likeUserClicked(event) {
    var button = event.target
    var potentialPartner = button.parentElement.parentElement
    var title = potentialPartner.getElementsByClassName('like-user-title')[0].innerText
    var imageSrc = potentialPartner.getElementsByClassName('like-user-image')[0].src
    likeUser(title, imageSrc)
    alert('MATCH! Denne bruger har også liket dig!')
    matchTotal()
}

function likeUser(title, imageSrc) {
    var matchRow = document.createElement('div')
    matchRow.classList.add('match-row')
    var matchUsers = document.getElementsByClassName('match-users')[0]
    var matchUserNames = matchUsers.getElementsByClassName('like-user-title')
    for (var i = 0; i < matchUserNames.length; i++) {
        if (matchUserNames[i].innerText == title) {
            alert('This item is already added to the cart')
            return
        }
    }
    var matchRowContents = `
        <div class="match-user match-column">
            <img class="match-user-image" src="${imageSrc}" width="100" height="100">
            <span class="match-user-title">${title}</span>
            <button class="btn btn-danger" type="button">REMOVE</button>
        </div>`
    matchRow.innerHTML = matchRowContents
    matchUsers.append(matchRow)
    matchRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeMatch)
}

function matchTotal() {
    var matchUsersContainer = document.getElementsByClassName('match-users')[0]
    var matchRows = matchUsersContainer.getElementsByClassName('match-row')
    var total = 0
    for (var i = 0; i < matchRows.length; i++) {
        var matchRow = matchRows[i]
        total = matchRows.length
    } if (total > 0) {
    document.getElementsByClassName('match-total-title')[0].innerText = 'You have ' + total + ' match(es). Wow, you rock!'
}
}*/
/*
function dislikeUser() {
            document.getElementById("dislike").style.display = "none"; 

    }*/