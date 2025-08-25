// Quick test script to verify GitHub token
// Run with: node test-github-auth.js

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || 'your-token-here';
const GITHUB_REPO = 'milesbythesea/my-personal-app';

async function testGitHubAuth() {
  console.log('Testing GitHub authentication...');
  
  try {
    const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/public/data/posts.json?ref=dev`, {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'SMS-Blog-Bot'
      }
    });

    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    
    if (response.ok) {
      console.log('✅ SUCCESS: GitHub authentication works!');
      const data = await response.json();
      console.log('File found:', data.name);
    } else {
      console.log('❌ FAILED: GitHub authentication failed');
      const error = await response.text();
      console.log('Error:', error);
    }
  } catch (error) {
    console.log('❌ ERROR:', error.message);
  }
}

testGitHubAuth();