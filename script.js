// Get elements from the page
const startBtn = document.getElementById('start-story');
const promptInput = document.getElementById('user-prompt');
const storyContainer = document.querySelector('.story-container');
const storyText = document.getElementById('story-text');
const choicesDiv = document.getElementById('choices');

// Array to store the choices the user has made
let choiceHistory = [];

// Backend URL (your Node.js server)
const SERVER_URL = 'http://localhost:3000/story';

// When the user clicks "Start Adventure"
startBtn.addEventListener('click', async () => {
  const prompt = promptInput.value.trim();
  if (!prompt) {
    alert("Please enter a prompt to start the adventure!");
    return;
  }
  choiceHistory = [];
  storyContainer.style.display = 'block';
  await generateStory(prompt);
});

// Function to generate story from backend
async function generateStory(prompt) {
  try {
    const response = await fetch(SERVER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, choiceHistory })
    });

    const data = await response.json();
    displayStory(data.story);
  } catch (err) {
    console.error("Error generating story:", err);
    storyText.innerText = "Failed to generate story. Check your server.";
    choicesDiv.innerHTML = '';
  }
}

// Function to display story and choices
function displayStory(story) {
  storyText.innerText = story;
  choicesDiv.innerHTML = '';

  // Parse lines that look like numbered choices: 1. Go left
  const lines = story.split('\n').filter(line => /^[1-9]\./.test(line));

  lines.forEach(line => {
    const btn = document.createElement('button');
    btn.innerText = line;
    btn.onclick = () => {
      choiceHistory.push(line);
      generateStory(promptInput.value.trim());
    };
    choicesDiv.appendChild(btn);
  });
}
