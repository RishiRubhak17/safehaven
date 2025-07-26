// SafeHaven Web App - JavaScript Implementation

// DOM Elements
const contactsForm = document.getElementById('contacts-form');
const bestFriendInput = document.getElementById('best-friend');
const parentGuardianInput = document.getElementById('parent-guardian');
const trustedContactInput = document.getElementById('trusted-contact');
const safeAddressInput = document.getElementById('safe-address');
const contactsSaved = document.getElementById('contacts-saved');
const sosBtn = document.getElementById('sos-btn');
const fakeCallBtn = document.getElementById('fake-call-btn');
const shakeSosBtn = document.getElementById('shake-sos-btn');
const sosStatus = document.getElementById('sos-status');
const dangerZoneSection = document.getElementById('danger-zone-section');
const dangerZoneMessage = document.getElementById('danger-zone-message');
const checkLocationBtn = document.getElementById('check-location-btn');
const locationInfo = document.getElementById('location-info');
const chatMessages = document.getElementById('chat-messages');
const userMessageInput = document.getElementById('user-message');
const sendMessageBtn = document.getElementById('send-message');
const fakeCallPopup = document.getElementById('fake-call-popup');
const answerCallBtn = document.getElementById('answer-call');
const declineCallBtn = document.getElementById('decline-call');
const ringtone = document.getElementById('ringtone');

// Emotional Support Chatbot Replies
const emotionalReplies = {
    "i feel scared": "I'm here with you. You're not alone. Remember to breathe deeply and focus on your surroundings.",
    "i'm alone": "I'm staying with you virtually. Help is just one click away if you need it. You're stronger than you think.",
    "what do i do": "First, try to stay calm. If you're in immediate danger, press the SOS button. Otherwise, move to a safe, public place if possible.",
    "help": "I'm here to support you. The SOS button will alert your trusted contacts with your location. Would you like me to guide you through using it?",
    "i'm not safe": "Your safety is the priority. Please press the SOS button immediately to alert your contacts with your location.",
    "i need help": "Help is available. Press the SOS button to notify your emergency contacts. You can also use the fake call feature to deter potential threats.",
    "i feel unsafe": "Trust your instincts. If you feel unsafe, move to a well-lit, public area and consider pressing the SOS button to notify your contacts.",
    "someone is following me": "Stay calm and head toward a crowded area or business. If possible, call local authorities while moving. Press SOS to alert your contacts with your location."
};

// Mock high crime areas (in a real app, this would come from an API)
const highCrimeAreas = [
    "Downtown",
    "Central District",
    "East Side",
    "Industrial Zone",
    "Railroad Area"
];

// Load saved contacts from localStorage
function loadContacts() {
    const contacts = JSON.parse(localStorage.getItem('safeHavenContacts')) || {};
    bestFriendInput.value = contacts.bestFriend || '';
    parentGuardianInput.value = contacts.parentGuardian || '';
    trustedContactInput.value = contacts.trustedContact || '';
    safeAddressInput.value = contacts.safeAddress || '';
}

// Save contacts to localStorage
contactsForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const contacts = {
        bestFriend: bestFriendInput.value,
        parentGuardian: parentGuardianInput.value,
        trustedContact: trustedContactInput.value,
        safeAddress: safeAddressInput.value
    };
    
    // Basic phone number validation
    if (!contacts.bestFriend.match(/^\+?[0-9]{10,15}$/) || 
        !contacts.parentGuardian.match(/^\+?[0-9]{10,15}$/) || 
        !contacts.trustedContact.match(/^\+?[0-9]{10,15}$/)) {
        alert('Please enter valid phone numbers for all contacts');
        return;
    }
    
    localStorage.setItem('safeHavenContacts', JSON.stringify(contacts));
    contactsSaved.classList.remove('hidden');
    
    setTimeout(() => {
        contactsSaved.classList.add('hidden');
    }, 3000);
});

// SOS Alert Functionality
sosBtn.addEventListener('click', sendSOSAlert);

// Fake Call Functionality
fakeCallBtn.addEventListener('click', startFakeCall);

// Shake for SOS simulation (double 's' key press)
let lastKeyPressTime = 0;
document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 's') {
        const now = Date.now();
        if (now - lastKeyPressTime < 500) { // 500ms between presses
            sendSOSAlert();
        }
        lastKeyPressTime = now;
    }
});

// Check Location Button
checkLocationBtn.addEventListener('click', checkUserLocation);

// Chatbot Functionality
sendMessageBtn.addEventListener('click', sendChatMessage);
userMessageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendChatMessage();
    }
});

// Fake Call Answer/Decline Buttons
answerCallBtn.addEventListener('click', answerFakeCall);
declineCallBtn.addEventListener('click', endFakeCall);

// Initialize the app
loadContacts();

// SOS Alert Function
async function sendSOSAlert() {
    sosStatus.textContent = "Getting your location...";
    sosStatus.className = "alert-info";
    sosStatus.classList.remove('hidden');
    
    try {
        // Get current location
        const position = await getCurrentPosition();
        const { latitude, longitude } = position.coords;
        const timestamp = new Date().toLocaleString();
        
        // Create Google Maps link
        const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
        
        // Create emergency message
        const message = `🚨 EMERGENCY ALERT from SafeHaven 🚨
User needs assistance!
Time: ${timestamp}
Location: ${mapsLink}`;
        
        // Get saved contacts
        const contacts = JSON.parse(localStorage.getItem('safeHavenContacts')) || {};
        
        // Send alerts (simulated - in a real app, you'd use Twilio/EmailJS API)
        sosStatus.innerHTML = "";
        
        if (contacts.bestFriend) {
            sendAlert(contacts.bestFriend, message);
        }
        
        if (contacts.parentGuardian) {
            sendAlert(contacts.parentGuardian, message);
        }
        
        if (contacts.trustedContact) {
            sendAlert(contacts.trustedContact, message);
        }
        
        // Start silent recording (simulated)
        startSilentRecording();
        
        // Check if in danger zone
        checkDangerZone(position);
        
    } catch (error) {
        console.error("Error getting location:", error);
        sosStatus.textContent = "Error getting location. Please try again.";
        sosStatus.className = "alert-error";
    }
}

// Get current position with timeout
function getCurrentPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        });
    });
}

// Simulate sending an alert (replace with actual Twilio/EmailJS API calls)
function sendAlert(phoneNumber, message) {
    // In a real implementation, you would use:
    // Twilio API for WhatsApp/SMS or EmailJS for email notifications
    
    console.log(`📡 Alert sent to ${phoneNumber}: ${message}`);
    
    // For demo purposes, we'll just show in the UI
    const alertDiv = document.createElement('div');
    alertDiv.textContent = `Alert sent to: ${phoneNumber}`;
    sosStatus.appendChild(alertDiv);
    
    // Simulate API delay
    setTimeout(() => {
        const statusDiv = document.createElement('div');
        statusDiv.textContent = `✓ Delivered to ${phoneNumber}`;
        sosStatus.appendChild(statusDiv);
    }, 1000);
}

// Start Fake Call
function startFakeCall() {
    fakeCallPopup.classList.remove('hidden');
    ringtone.play();
    
    // Auto-end call after 30 seconds if not answered
    setTimeout(() => {
        if (!fakeCallPopup.classList.contains('hidden')) {
            endFakeCall();
        }
    }, 30000);
}

// Answer Fake Call
function answerFakeCall() {
    ringtone.pause();
    ringtone.currentTime = 0;
    
    const callBody = document.querySelector('.call-body');
    callBody.innerHTML = `
        <div class="caller-info">
            <i class="fas fa-user-shield"></i>
            <p>Emergency Response</p>
        </div>
        <div class="call-message">
            <p>This is your emergency response system. Your location has been recorded. Help is on the way.</p>
        </div>
    `;
    
    // End call after 10 seconds
    setTimeout(endFakeCall, 10000);
}

// End Fake Call
function endFakeCall() {
    fakeCallPopup.classList.add('hidden');
    ringtone.pause();
    ringtone.currentTime = 0;
}

// Silent Recording (simulated)
function startSilentRecording() {
    console.log("Silent recording started (simulated)");
    // In a real implementation, you would use:
    // navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    // But this requires user permission and can't be done silently
}

// Check Danger Zone
function checkDangerZone(position) {
    // In a real app, this would use a geofencing API or database
    // For demo, we'll use the mock highCrimeAreas and reverse geocoding
    
    // Simulate reverse geocoding to get area name
    setTimeout(() => {
        const areaName = highCrimeAreas[Math.floor(Math.random() * highCrimeAreas.length)];
        
        dangerZoneMessage.textContent = `You're in ${areaName}, which is a high-crime zone. Stay alert and consider moving to a safer location.`;
        dangerZoneSection.classList.remove('hidden');
    }, 1500);
}

// Check User Location against Safe Address
async function checkUserLocation() {
    locationInfo.textContent = "Getting your location...";
    
    try {
        const position = await getCurrentPosition();
        const { latitude, longitude } = position.coords;
        const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
        
        locationInfo.innerHTML = `
            <p>Your current location: <a href="${mapsLink}" target="_blank">View on Map</a></p>
        `;
        
        // Check against safe address (simulated)
        const contacts = JSON.parse(localStorage.getItem('safeHavenContacts')) || {};
        if (contacts.safeAddress) {
            // In a real app, you'd compare coordinates with geocoded safe address
            const isSafe = Math.random() > 0.3; // 70% chance of being safe for demo
            
            if (isSafe) {
                locationInfo.innerHTML += `<p>✓ You're within your safe zone</p>`;
            } else {
                locationInfo.innerHTML += `<p>⚠ You're outside your safe zone. Consider returning to your safe location.</p>`;
                
                // If very far from safe location, send alert
                if (Math.random() > 0.7) { // 30% chance for demo
                    sendSOSAlert();
                }
            }
        }
    } catch (error) {
        console.error("Error getting location:", error);
        locationInfo.textContent = "Error getting location. Please try again.";
    }
}

// Chatbot Functions
function sendChatMessage() {
    const message = userMessageInput.value.trim();
    if (!message) return;
    
    // Add user message to chat
    addMessageToChat(message, 'user-message');
    userMessageInput.value = '';
    
    // Get bot reply
    const reply = getBotReply(message);
    
    // Add slight delay for more natural conversation
    setTimeout(() => {
        addMessageToChat(reply, 'bot-message');
    }, 800);
}

function addMessageToChat(message, className) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message', className);
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getBotReply(userMsg) {
    const msg = userMsg.toLowerCase().trim();
    
    // Check for exact matches first
    for (const [key, value] of Object.entries(emotionalReplies)) {
        if (msg.includes(key)) {
            return value;
        }
    }
    
    // Default reply for unrelated messages
    return "I'm an emotional support AI here to help you feel safe. Please talk to me if you need support or press the SOS button if you're in danger.";
}

// Service Worker Registration for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').then(registration => {
            console.log('ServiceWorker registration successful');
        }).catch(err => {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}