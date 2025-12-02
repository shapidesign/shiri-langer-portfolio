# Project Text Configuration

This file (`projectTexts.ts`) contains all the text content for your portfolio project modals. You can easily update project information, contact details, and other text content without touching the main code.

## 📝 How to Edit Project Information

### Adding a New Project
1. Open `projectTexts.ts`
2. Add a new object to the `PROJECT_TEXTS` array
3. Follow this structure:

```typescript
{
  id: 7, // Unique ID number
  title: "Your Project Title",
  subtitle: "Project Category",
  year: 2024,
  tags: ["Tag1", "Tag2", "Tag3"], // Array of tags
  description: "Short description for grid view",
  client: "Client Name",
  fullDescription: "Detailed project description",
  challenges: "What challenges did you face?",
  solutions: "How did you solve them?",
  technologies: ["Tool1", "Tool2", "Tool3"], // Software/tools used
  results: "What were the outcomes?",
  testimonial: {
    text: "Client testimonial quote",
    author: "Client Name",
    role: "Client Title"
  },
  gallery: [
    "/assets/images/your-image1.png",
    "/assets/images/your-image2.png"
  ],
  links: {
    live: "https://your-website.com",
    github: "https://github.com/your-repo",
    behance: "https://behance.net/your-project"
  }
}
```

### Updating Existing Projects
1. Find the project in the `PROJECT_TEXTS` array
2. Edit any of the text fields
3. Save the file - changes will appear automatically

### Project Fields Explained

- **id**: Unique identifier (must be a number)
- **title**: Main project title
- **subtitle**: Category or type of project
- **year**: Project completion year
- **tags**: Array of relevant tags
- **description**: Short description shown in grid view
- **client**: Client or company name
- **fullDescription**: Detailed project description
- **challenges**: Problems or challenges faced
- **solutions**: How challenges were solved
- **technologies**: Tools, software, or technologies used
- **results**: Outcomes, metrics, or achievements
- **testimonial**: Optional client testimonial
- **gallery**: Array of image paths for project gallery
- **links**: Optional links to live sites, GitHub, etc.

## 📧 Contact Information

Update contact details in the `CONTACT_INFO` object:

```typescript
export const CONTACT_INFO = {
  email: "your-email@gmail.com",
  linkedin: "https://www.linkedin.com/in/your-profile/",
  cvPath: "/Your-CV.pdf",
  cvFileName: "Your-CV.pdf"
};
```

## 🔧 General Text Content

Update button labels, form text, and other UI text in the `GENERAL_TEXTS` object:

```typescript
export const GENERAL_TEXTS = {
  modal: {
    closeButton: "Close",
    viewProject: "View Project",
    // ... other modal text
  },
  contact: {
    title: "Get In Touch",
    intro: "Your contact intro text",
    // ... other contact text
  }
};
```

## 🖼️ Adding Images

1. Place your images in `/public/assets/images/`
2. Reference them in the gallery array like: `/assets/images/your-image.png`
3. Make sure image paths start with `/assets/images/`

## 💡 Tips

- **Keep descriptions concise** but informative
- **Use consistent formatting** for years, tags, and links
- **Test image paths** to ensure they work correctly
- **Update the README** when adding new fields
- **Backup your changes** before major updates

## 🔄 Making Changes Live

After editing `projectTexts.ts`:
1. Save the file
2. The changes will automatically appear in your portfolio
3. No need to restart the development server

## 📁 File Structure

```
src/
├── config/
│   ├── projectTexts.ts  ← Edit this file
│   └── README.md        ← This guide
└── public/
    └── assets/
        └── images/      ← Add your images here
```

## 🆘 Need Help?

If you need to add new fields or modify the structure:
1. Update the `ProjectText` interface
2. Update the component that uses this data
3. Update this README

Remember: This file is your central hub for all portfolio text content. Keep it organized and up-to-date!
