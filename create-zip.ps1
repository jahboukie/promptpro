# Create a .gitignore file first
$gitignoreContent = @"
# Node modules
node_modules/

# Build files
dist/
build/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Editor directories and files
.idea
.vscode
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Zip files
*.zip
"@

Set-Content -Path ".gitignore" -Value $gitignoreContent

# Create a README.md file
$readmeContent = @"
# PromptPro

PromptPro is a pre-cursor tool for content marketers to draft effective prompts that will be fed into AI writing tools like Jasper AI and Copy AI.

## Features

- **Content Marketing-Specific Templates**: Specialized templates for different content types (blog posts, social media, email, etc.)
- **Customizable Placeholders**: Easily customize templates with your specific content
- **Preview Functionality**: Preview your customized template before applying it
- **Best Practices**: Each template includes best practices for effective prompts
- **Compatible Tools**: Templates indicate which AI writing tools they work best with

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Start the development server with `npm run dev`

## License

MIT
"@

Set-Content -Path "README.md" -Value $readmeContent

# Create the ZIP file
Compress-Archive -Path * -DestinationPath "promptpro-for-github.zip" -Force

Write-Host "ZIP file created: promptpro-for-github.zip"
Write-Host "You can now manually upload this file to GitHub."
