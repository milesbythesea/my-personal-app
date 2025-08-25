exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    // Parse Twilio webhook data
    const body = new URLSearchParams(event.body);
    const from = body.get('From');
    const messageBody = body.get('Body');
    const mediaUrl = body.get('MediaUrl0'); // First media attachment
    const mediaContentType = body.get('MediaContentType0');

    // Verify sender (replace with your phone number)
    const authorizedSender = process.env.AUTHORIZED_PHONE_NUMBER;
    if (from !== authorizedSender) {
      console.log(`Unauthorized sender: ${from}`);
      return {
        statusCode: 200,
        body: '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
        headers: { 'Content-Type': 'text/xml' }
      };
    }

    // Create blog post object
    const post = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      content: messageBody || '',
      mediaUrl: mediaUrl || null,
      mediaType: mediaContentType || null,
      type: determinePostType(messageBody, mediaUrl, mediaContentType)
    };

    console.log('New blog post:', post);

    // Save post to GitHub
    await savePostToGitHub(post);

    // Respond to Twilio
    return {
      statusCode: 200,
      body: '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
      headers: { 'Content-Type': 'text/xml' }
    };

  } catch (error) {
    console.error('Error processing SMS:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
};

function determinePostType(text, mediaUrl, mediaType) {
  if (mediaUrl) {
    if (mediaType?.startsWith('image/')) return 'image';
    if (mediaType?.startsWith('video/')) return 'video';
    return 'media';
  }
  
  // Check if text contains URL
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  if (text && urlRegex.test(text)) return 'link';
  
  return 'text';
}

async function savePostToGitHub(post) {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const GITHUB_REPO = process.env.GITHUB_REPO; // e.g., "username/repo-name"
  const FILE_PATH = 'public/data/posts.json';
  
  if (!GITHUB_TOKEN || !GITHUB_REPO) {
    console.error('GitHub credentials not configured');
    return;
  }

  try {
    // 1. Get current file content
    const getResponse = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE_PATH}`, {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'SMS-Blog-Bot'
      }
    });

    if (!getResponse.ok) {
      throw new Error(`Failed to get file: ${getResponse.statusText}`);
    }

    const fileData = await getResponse.json();
    const currentContent = JSON.parse(Buffer.from(fileData.content, 'base64').toString());

    // 2. Add new post to the beginning of the array
    currentContent.posts.unshift(post);
    currentContent.lastUpdated = new Date().toISOString();

    // 3. Update the file on GitHub
    const updatedContent = Buffer.from(JSON.stringify(currentContent, null, 2)).toString('base64');
    
    const updateResponse = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE_PATH}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'SMS-Blog-Bot',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `Add new blog post: ${post.id}`,
        content: updatedContent,
        sha: fileData.sha,
        branch: 'dev' // or 'main' depending on your branch
      })
    });

    if (!updateResponse.ok) {
      throw new Error(`Failed to update file: ${updateResponse.statusText}`);
    }

    console.log('Successfully saved post to GitHub');
    
    // Optional: Trigger a Netlify build hook to redeploy
    const BUILD_HOOK = process.env.NETLIFY_BUILD_HOOK;
    if (BUILD_HOOK) {
      await fetch(BUILD_HOOK, { method: 'POST' });
      console.log('Triggered site rebuild');
    }

  } catch (error) {
    console.error('Error saving to GitHub:', error);
    throw error;
  }
}