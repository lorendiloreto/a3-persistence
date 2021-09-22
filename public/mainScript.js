window.onload = function() {
    getCurrentUser()
    const editButton = document.querySelector('#editButton')
    editButton.onclick = editProfile
    const deleteButton = document.querySelector('#deleteButton')
    deleteButton.onclick = deleteProfile
}

function generateProfile(user) {
    userProfile = document.getElementById("user-profile")
    userProfile.innerHTML = user.firstName + " " + user.lastName + "<small>@" + user.username + "</small>" 
    + "<small>" + user.organization + "</small>" + "<small>Joined " + user.joinDate + "</small>"
    document.getElementById("e1-text").value = user.firstName
    document.getElementById("e2-text").value = user.lastName
    document.getElementById("e3-text").value = user.username
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
    "organization": organization.value}
    console.log(json)
    console.log(lastName.value)

    fetch ('update', {
        method:'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(json)
    })
    .then(function(response) {
        console.log(response.body)
    })
}

const deleteProfile = function(e) {
    e.preventDefault()

    fetch ('delete', {
        method:'POST'
    })
    .then(function(response) {
        console.log(response.body)
    })
}

function checkEditPassword(pass1, pass2) {
    if (pass1.value === "" && pass2.value === "") {
        return false
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