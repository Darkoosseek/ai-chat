
https://ai-chat-iceq.vercel.app

# 🚀 Ultimate AI Terminal - Local Setup Guide

A powerful, free AI terminal with chat, vision, and image generation capabilities.

## ✨ Features

- 🆓 **100% FREE** - No API costs for basic usage
- 💬 **Smart Chat** - Powered by Google Gemini
- 👁️ **Image Analysis** - Upload and analyze images with AI
- 🎨 **Image Generation** - Create AI art with multiple services
- 📁 **File Analysis** - Upload and analyze code/text files
- 🔗 **GitHub Integration** - Analyze repositories directly
- 🎯 **Code Highlighting** - Beautiful syntax highlighting
- 🔊 **Sound Effects** - Terminal-style audio feedback
- 📊 **System Monitor** - Real-time system stats
- 💾 **Export Chat** - Save conversations as Markdown/Text

## 🛠️ Local Installation

### Prerequisites

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/)

### Step 1: Clone the Repository

\`\`\`bash
git clone <your-repo-url>
cd ultimate-ai-terminal
\`\`\`

### Step 2: Install Dependencies

\`\`\`bash
npm install
\`\`\`

### Step 3: Start Development Server

\`\`\`bash
npm run dev
\`\`\`

### Step 4: Open in Browser

Open your browser and go to:
\`\`\`
http://localhost:3000
\`\`\`

## 🔑 API Key Setup

### Get FREE Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key (starts with "AIza...")
5. Paste it in the app's configuration

### Why Gemini?

- ✅ **Completely FREE** forever
- ✅ **No credit card** required
- ✅ **15 requests/minute** (perfect for chat)
- ✅ **Built-in vision** for image analysis
- ✅ **Smart conversations** and coding help

## 🎨 Image Generation Services

The app uses multiple free services:

1. **Hugging Face** - High-quality Stable Diffusion
2. **Pollinations AI** - Fast and reliable
3. **Picsum** - Fallback for testing

## 📁 Project Structure

\`\`\`
ultimate-ai-terminal/
├── app/
│   ├── api/                 # API routes
│   │   ├── chat/           # Gemini chat API
│   │   ├── generate-image/ # Image generation
│   │   ├── analyze-image/  # Image analysis
│   │   └── github/         # GitHub integration
│   ├── components/         # React components
│   │   ├── terminal-chat-message.tsx
│   │   ├── image-generator.tsx
│   │   ├── file-upload.tsx
│   │   └── ...
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Main page
├── components/ui/         # shadcn/ui components
├── lib/                  # Utilities
├── public/              # Static assets
├── package.json
└── README.md
\`\`\`

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Deploy automatically

### Option 2: Netlify

1. Build the project: `npm run build`
2. Upload the `out` folder to Netlify
3. Configure as a static site

### Option 3: Docker

\`\`\`bash
# Build Docker image
docker build -t ai-terminal .

# Run container
docker run -p 3000:3000 ai-terminal
\`\`\`

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file:

\`\`\`env
# Optional: Set default API keys
NEXT_PUBLIC_DEFAULT_GEMINI_KEY=your_key_here
\`\`\`

### Customization

- **Colors**: Edit `tailwind.config.js`
- **Sounds**: Modify `components/typing-sound.tsx`
- **Models**: Update `api/chat/route.ts`

## 🐛 Troubleshooting

### Common Issues

1. **"Module not found"**
   \`\`\`bash
   rm -rf node_modules package-lock.json
   npm install
   \`\`\`

2. **"Port 3000 already in use"**
   \`\`\`bash
   npm run dev -- --port 3001
   \`\`\`

3. **API key not working**
   - Check if key starts with "AIza"
   - Verify Google AI Studio access
   - Try regenerating the key

### Image Generation Issues

If images don't generate:
1. Check browser console for errors
2. Try different prompts
3. Services may have temporary outages

### Image Analysis Issues

If image analysis fails:
1. Verify Gemini API key is correct
2. Check image file size (< 10MB)
3. Ensure image format is supported (JPG, PNG, GIF, WEBP)

## 📱 Browser Compatibility

- ✅ **Chrome** (Recommended)
- ✅ **Firefox**
- ✅ **Safari**
- ✅ **Edge**

### Required Features

- **JavaScript** enabled
- **Local Storage** for settings
- **Fetch API** for requests
- **File API** for uploads

## 🔒 Security & Privacy

- 🔐 **API keys stored locally** - Never sent to our servers
- 🛡️ **No data collection** - Everything runs in your browser
- 🔒 **HTTPS required** for production
- 🚫 **No tracking** or analytics

## 🆘 Support

### Getting Help

1. **Check the console** - Press F12 and look for errors
2. **Clear browser cache** - Hard refresh with Ctrl+F5
3. **Update dependencies** - Run `npm update`
4. **Check GitHub issues** - Look for similar problems

### Reporting Bugs

When reporting issues, include:
- Browser and version
- Error messages from console
- Steps to reproduce
- Screenshots if helpful

## 🎯 Performance Tips

### Optimize for Speed

1. **Use Chrome** for best performance
2. **Close unused tabs** to free memory
3. **Clear chat history** if it gets long
4. **Disable sound effects** if needed

### Reduce API Usage

1. **Use shorter prompts** when possible
2. **Batch similar questions** together
3. **Use image analysis sparingly**
4. **Clear context** with new conversations

## 🔄 Updates

### Staying Updated

\`\`\`bash
# Pull latest changes
git pull origin main

# Update dependencies
npm update

# Restart development server
npm run dev
\`\`\`

### Version History

- **v1.0** - Initial release with basic chat
- **v2.0** - Added image generation and analysis
- **v3.0** - Enhanced UI and multiple services
- **v4.0** - Added voice input and model switching

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Credits

- **Google Gemini** - AI chat and vision
- **Hugging Face** - Image generation models
- **Pollinations AI** - Free image generation
- **shadcn/ui** - Beautiful UI components
- **Tailwind CSS** - Styling framework
- **Next.js** - React framework

---

**Enjoy your FREE AI Terminal! 🚀✨**
