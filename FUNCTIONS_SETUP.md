# Firebase Functions Setup for OpenRouter

## Why Use Firebase Functions?

**Security**: API keys should NEVER be exposed in frontend code. Anyone can view them in browser dev tools or network requests, leading to:
- Stolen API keys
- Unauthorized usage and unexpected costs
- No way to enforce rate limiting

## Setup Instructions

### 1. Install Dependencies

```bash
cd functions
npm install
```

### 2. Set OpenRouter API Key

```bash
# Set the API key in Firebase Functions config
firebase functions:config:set openrouter.api_key="your_openrouter_api_key_here"
```

### 3. Build Functions

```bash
cd functions
npm run build
```

### 4. Deploy Functions

```bash
# From project root
firebase deploy --only functions
```

**Note**: You mentioned you'll deploy manually, so run this when ready.

### 5. Test Locally (Optional)

```bash
# Start emulators
firebase emulators:start --only functions

# In another terminal, test the function
curl -X POST http://localhost:5001/YOUR_PROJECT_ID/us-central1/openrouterChat \
  -H "Content-Type: application/json" \
  -d '{"data": {"messages": [{"role": "user", "content": "Hello"}]}}'
```

## How It Works

1. Frontend calls Firebase Functions (no API key exposed)
2. Functions verify user authentication
3. Functions call OpenRouter API with secure API key
4. Functions return response to frontend

## Security Benefits

✅ API key stored securely in Firebase Functions config  
✅ Only authenticated users can use AI features  
✅ Rate limiting can be added at function level  
✅ Usage can be tracked and monitored  
✅ No API key exposure in client code
