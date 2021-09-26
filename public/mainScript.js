window.onload = function() {
    getCurrentUser()
    const editButton = document.querySelector('#editButton')
    editButton.onclick = editProfile
    const deleteButton = document.querySelector('#deleteButton')
    deleteButton.onclick = deleteProfile
    const logoutButton = document.querySelector('#logoutButton')
    logoutButton.onclick = logout
    const addPuntButton = document.querySelector('#addPuntButton')
    addPuntButton.onclick = addPunt
}

function generateProfile(user) {
    userProfile = document.getElementById("user-profile")
    userProfile.innerHTML = user.firstName + " " + user.lastName + "<small>@" + user.username + "</small>" 
    + "<small>" + user.organization + "</small>" + "<small>Joined " + user.joinDate + "</small>"
    document.getElementById("e1-text").value = user.firstName
    document.getElementById("e2-text").value = user.lastName
    document.getElementById("e3-text").value = user.username
    document.getElementById("e4-text").value = user.password
    document.getElementById("e5-text").value = user.password
    document.getElementById("e6-text").value = user.organization
}

const editProfile = function(e) {
    e.preventDefault()

    const firstName = document.getElementById("e1-text")
    const lastName = document.getElementById("e2-text")
    const username = document.getElementById("e3-text")
    const organization = document.getElementById("e6-text")
    const password = document.getElementById("e4-text")
    const passwordConfirm = document.getElementById("e5-text")

    if (checkField(firstName)) { return }
    if (checkField(lastName)) { return }
    if (checkField(username)) { return }
    if (checkField(organization)) { return }
    if (checkEditPassword(password, passwordConfirm)) {
        return
    }

    json = { "firstName": firstName.value, "lastName": lastName.value, "username": username.value, 
    "organization": organization.value, "password": password.value}
    console.log(json)
    console.log(lastName.value)

    fetch ('update', {
        method:'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(json)
    })
    .then(function(response) {
        console.log(response.body)
        getCurrentUser()
    })
}

const deleteProfile = function(e) {
    e.preventDefault()

    fetch ('delete', {
        method:'POST'
    })
    .then(function(response) {
        window.location.href = response.url
        console.log(response.body)
    })
}

const addPunt = function(e) {
    e.preventDefault()

    const punt = checkPuntFields()
    if (!punt) {
        return
    }
 
    fetch ('addPunt', {
        method:'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(punt)
    })
    .then(function(response) {
        console.log(response.body)
    })
}

const logout = function(e) {
    e.preventDefault()
    
    fetch ('logout', {
        method:'POST'
    })
    .then(function(response) {
        window.location.href = response.url
        console.log(response.body)
    })
}

function checkEditPassword(pass1, pass2) {
    if (pass1.value === "" && pass2.value === "") {
        return true
    }
    else if (pass1.value != pass2.value) {
        differentPasswords(pass1, pass2)
        return true
    }
    else if (pass1.value < 8) {
        shortPassword(pass1.value, pass2.value)
        return true
    }
    return false
}

function differentPasswords(pass1, pass2) {
    pass1.style.borderColor = "red"
    pass2.style.borderColor = "red"
    console.log("passwords must match")
}

function shortPassword(pass1, pass2) {
    pass1.style.borderColor = "red"
    pass2.style.borderColor = "red"
    console.log("password must be at least 8 characters")
}

function checkPuntFields() {
    let date = document.getElementById("p1-text")
    let setting = document.getElementById("p2-text")
    let yards = document.getElementById("p3-text")
    let hangtime = document.getElementById("p4-text")
    let returnYards = document.getElementById("p5-text")
    let snapToKick = document.getElementById("p6-text")
    let fairCatch = document.getElementById("p7-text")
    let touchback = document.getElementById("p8-text")
    let inside20 = document.getElementById("p9-text")
    let inside10 = document.getElementById("p10-text")
    let errorText = document.getElementById("puntError")

    date.style.borderColor = "transparent"
    setting.style.borderColor = "transparent"
    yards.style.borderColor = "transparent"
    hangtime.style.borderColor = "transparent"
    returnYards.style.borderColor = "transparent"
    snapToKick.style.borderColor = "transparent"
    fairCatch.style.borderColor = "transparent"
    touchback.style.borderColor = "transparent"
    inside20.style.borderColor = "transparent"
    inside10.style.borderColor = "transparent"
    errorText.innerText = ""
    

    if (inside20.checked === false && inside10.checked === true) {
        inside20.checked = true
        return true
    }
    if (fairCatch.checked === true && returnYards.value != "") {
        returnYards.style.borderColor = "red"
        inside20.style.borderColor = "red"
        errorText.innerText = "Cannot have return yards on a fair catch"
        return true
    }
    if ((inside20.checked === true || inside10.checked === true) && touchback.checked === true) {
        touchback.style.borderColor = "red"
        inside20.style.borderColor = "red"
        inside10.style.borderColor = "red"
        errorText.innerText = "Cannot have a touchback and inside 10/20"
        return true
    }
    if (date.value === "") {
        date.style.borderColor = "red"
        errorText.innerText = "Date required"
        return true
    }
    isNumber(yards)
    isNumber(hangtime)
    isNumber(returnYards)
    isNumber(snapToKick)
    fairCatch = trueToYes(fairCatch)
    touchback = trueToYes(touchback)
    inside20 = trueToYes(inside20)
    inside10 = trueToYes(inside10)

    return { "date": date.value, "setting": setting.value, "yards": yards.value, "hangtime": hangtime.value, 
    "returnYards": returnYards.value, "snapToKick": snapToKick.value, "fairCatch": fairCatch, 
    "touchback": touchback, "inside20": inside20, "inside10": inside10}
}

function isNumber(field) {
    if (parseFloat(field.value) || field.value === "") {
        return false
    }
    else {
        field.style.borderColor = "red"
        document.getElementById("puntError").innerText = "Must be a number"
        return true 
    }
}

function trueToYes(checkbox) {
    if(checkbox.checked === true) {
        return "Yes"
    }
    else {
        return "No"
    }
}