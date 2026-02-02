const startBtn = document.getElementById('start-story');
const promptInput = document.getElementById('user-prompt');
const storyContainer = document.querySelector('.story-container');
const storyText = document.getElementById('story-text');
const choicesDiv = document.getElementById('choices');

let choiceHistory = [];

// Replace this with your Replit or Node.js server URL
const SERVER_URL = 'https://ai-story-backend.username.repl.co/story';

startBtn.addEventListener('click', async () => {
  const prompt = promptInput.value;
  choiceHistory = [];
  storyContainer.style.display = 'block';
  await generateStory(prompt);
});

async function generateStory(prompt) {
  const response = await fetch(SERVER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, choiceHistory })
  });
  const data = await response.json();
  displayStory(data.story);
}

function displayStory(story) {
  storyText.innerText = story;
  choicesDiv.innerHTML = '';

  const lines = story.split('\n').filter(l => /^[1-9]\./.test(l));
  lines.forEach(line => {
    const btn = document.createElement('button');
    btn.innerText = line;
    btn.onclick = () => {
      choiceHistory.push(line);
      generateStory(promptInput.value);
    };
    choicesDiv.appendChild(btn);
  });
}
