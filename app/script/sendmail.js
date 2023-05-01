function submitEmail(event) {
    console.log("submitting email");
    event.preventDefault();

    const email = document.getElementById("email").value;
    const subject = document.getElementById("subject").value;
    const body = document.getElementById("message").value;
    
    const data = {
        destinationAddress: email,
        subjectLine: subject,
        emailBody: body
    };

    fetch('/user/sendmail', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (response.ok) {
            console.log("Email sent successfully");
        } else {
            console.log('Error:', response.status);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}