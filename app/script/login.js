function submitForm(event) {
    event.preventDefault();
    const name = document.getElementById('usernameInput').value;
    const pass = document.getElementById('passwordInput').value;
    const data = { 
            username : name,
            password : pass
        };

    fetch('/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/html',
        },
        body: JSON.stringify(data)
    })
    .catch(error => {
        console.error('Error:', error);
    });
}