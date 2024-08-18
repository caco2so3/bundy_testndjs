function submitExpression() {
    const expression = document.getElementById('expression').value;

    fetch('/evaluate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ expression })
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                document.getElementById('history').innerHTML = data.history.map(item => `<div>${item}</div>`).join('');
            }
        })
        .catch(error => console.error('Error:', error));
}
document.getElementById('expression').addEventListener('keydown', function (event)
{
    if (event.key == 'Enter'){
        submitExpression();
    }
})
