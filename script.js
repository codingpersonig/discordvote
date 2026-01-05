function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

if (localStorage.getItem('voted') === null) {
    document.addEventListener('DOMContentLoaded', function() {
        const container = document.querySelector('.container');
        const dropdownSelected = document.querySelector('.dropdown-selected');
        const dropdownOptions = document.querySelector('.dropdown-options');
        const options = document.querySelectorAll('.dropdown-option');
        const submitButton = document.querySelector('.submit-button');
        
        // Toggle dropdown
        dropdownSelected.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdownOptions.classList.toggle('show');
            container.classList.toggle('container-active');
            submitButton.classList.toggle('submit-button-active');
        });
        
        // Select option
        options.forEach(option => {
            option.addEventListener('click', function(e) {
                e.stopPropagation();
                const value = this.getAttribute('data-value');
                const text = this.querySelector('span') ? this.querySelector('span').textContent : this.textContent;
                
                dropdownSelected.textContent = text;
                dropdownSelected.setAttribute('data-value', value);
                dropdownOptions.classList.remove('show');
                container.classList.remove('container-active');
                submitButton.classList.remove('submit-button-active');
                
                // Disable button if "Choose an option" is selected
                if (text.toLowerCase() === 'Choose an option') {
                    submitButton.disabled = true;
                } else {
                    submitButton.disabled = false;
                }
            });
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.custom-dropdown')) {
                dropdownOptions.classList.remove('show');
            }
        });

        // submit button
        submitButton.addEventListener('click', async function() {
            if (this.disabled) {
                alert('select a valid option');
                return;
            }
            this.textContent = 'Submitted!';
            localStorage.setItem('voted', 'true');
            sendVote(dropdownSelected.getAttribute('data-value'));
            await sleep(500);
            location.reload();
        });

        // Monitor dropdown state to adjust container and button styles
        setInterval(() => {
            if (!dropdownOptions.classList.contains('show')) {
                container.classList.remove('container-active');
                submitButton.classList.remove('submit-button-active');
            }
        }, 100);
    });
} else {
    window.location.href = 'discord://';
}

async function sendVote(vote) {
    const webhookURL = "https://discord.com/api/webhooks/1336486578633310238/kQtAQx3uDBrJhtXZdOPoDteLuHY6-riL_5kbH2tu72qdIDX_obI2VKCE1C8AVPlRNeBU";
    const content = `Someone voted for: <@${vote}>`;
    const request = new XMLHttpRequest();
    request.open("POST", webhookURL);
    request.setRequestHeader('Content-type', 'application/json');
    const params = {
        content: content
    };
    request.send(JSON.stringify(params));
}