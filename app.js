document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.diagnostic-btn');
    const statusText = document.getElementById('statusText');
    
    // Debug logging
    console.log('DOM loaded, checking webOS availability...');
    console.log('window.webOS:', window.webOS);
    console.log('window.PalmServiceBridge:', window.PalmServiceBridge);
    
    // Check multiple webOS API options
    const hasWebOSService = window.webOS && window.webOS.service;
    const hasPalmServiceBridge = window.PalmServiceBridge;
    
    if (hasWebOSService) {
        console.log('webOS service available');
        statusText.textContent = 'webOS service available - Ready';
    } else if (hasPalmServiceBridge) {
        console.log('PalmServiceBridge available');
        statusText.textContent = 'PalmServiceBridge available - Ready';
    } else {
        console.log('No webOS services available');
        statusText.textContent = 'No webOS services available';
    }

    function launchFactory(irKey) {
        const payload = {
            id: "com.webos.app.factorywin",
            params: {
                id: "executeFactory",
                irKey: irKey
            }
        };

        statusText.textContent = `Launching factory diagnostic: ${irKey}`;
        
        try {
            // Try webOS Luna service first
            if (window.webOS && window.webOS.service) {
                window.webOS.service.request('luna://com.webos.applicationManager', {
                    method: 'launch',
                    parameters: payload,
                    onSuccess: function(response) {
                        statusText.textContent = `Successfully launched ${irKey}`;
                        console.log('Factory diagnostic launched:', response);
                    },
                    onFailure: function(error) {
                        statusText.textContent = `Failed to launch ${irKey}: ${error.errorText || error.message}`;
                        console.error('Failed to launch factory diagnostic:', error);
                    }
                });
            } else if (window.PalmServiceBridge) {
                // Try PalmServiceBridge
                const request = new PalmServiceBridge();
                request.onservicecallback = function(response) {
                    if (response.returnValue) {
                        statusText.textContent = `Successfully launched ${irKey}`;
                        console.log('Factory diagnostic launched:', response);
                    } else {
                        statusText.textContent = `Failed to launch ${irKey}: ${response.errorText || response.errorCode}`;
                        console.error('Failed to launch factory diagnostic:', response);
                    }
                };
                request.call('luna://com.webos.applicationManager/launch', JSON.stringify(payload));
            } else {
                // Fallback for testing outside webOS environment
                console.log('Would launch factory diagnostic with payload:', payload);
                statusText.textContent = `Would launch ${irKey} (webOS not available)`;
            }
        } catch (error) {
            statusText.textContent = `Error: ${error.message}`;
            console.error('Error launching factory diagnostic:', error);
        }
    }

    // Add click event listeners to all diagnostic buttons
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const irKey = this.getAttribute('data-key');
            launchFactory(irKey);
        });
    });

    // Add keyboard navigation for webOS remote control
    document.addEventListener('keydown', function(event) {
        const focusedElement = document.activeElement;
        
        switch(event.keyCode) {
            case 13: // Enter/OK button
                if (focusedElement && focusedElement.classList.contains('diagnostic-btn')) {
                    focusedElement.click();
                }
                break;
            case 37: // Left arrow
                navigateButtons(-1);
                break;
            case 39: // Right arrow
                navigateButtons(1);
                break;
            case 38: // Up arrow
                navigateButtons(-3);
                break;
            case 40: // Down arrow
                navigateButtons(3);
                break;
        }
    });

    function navigateButtons(direction) {
        const buttons = Array.from(document.querySelectorAll('.diagnostic-btn'));
        const currentIndex = buttons.indexOf(document.activeElement);
        let newIndex = currentIndex + direction;
        
        if (newIndex < 0) newIndex = buttons.length - 1;
        if (newIndex >= buttons.length) newIndex = 0;
        
        buttons[newIndex].focus();
    }

    // Focus the first button on load
    if (buttons.length > 0) {
        buttons[0].focus();
    }
});