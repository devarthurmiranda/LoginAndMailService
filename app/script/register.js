function registerUser(event){
    console.log("Registering user");
    event.preventDefault();

    const name = document.getElementById("registerUsername").value;
    const pass = document.getElementById("registerPassword").value;
    const pass2 = document.getElementById("confirmPassword").value;

    if (pass != pass2) {
        console.log("Passwords do not match");
        return;
    }

    const data = {
        username: name,
        password: pass
    };

    fetch('/user/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (response.ok) {
            console.log("User registered successfully");
        } else {
            console.error('Error:', response.status);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}