function submitForm(event) {
    console.log("submitting form");
    event.preventDefault();
    
    const name = document.getElementById('usernameInput').value;
    const pass = document.getElementById('passwordInput').value;
    
    const data = { 
        username: name,
        password: pass
    };

    fetch('/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            window.location.href = '/user/home';
        } else {
            console.error('Error:', response.status);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}