# TechFest 2026 (Web Tech Lab-1)

A modern, responsive website for TechFest 2026—a three-day hackathon, design sprint, and showcase weekend at Mar Baselios College.

## Overview

TechFest is campus's biggest tech event, bringing together students to build, debug, and showcase their innovative projects. This website serves as the central hub for event information, registration, schedules, and community engagement.

**Event Details:**
- **Dates:** November 12–14, 2026
- **Location:** Mar Baselios College
- **Theme:** Innovation • Creativity • Celebration

## Features

- 🏠 **Home** - Hero landing page with event overview and quick access to key sections
- 📅 **Events** - Detailed schedule and description of competitions, workshops, and sessions
- 📝 **Register** - Registration form for participants
- 🖼️ **Gallery** - Showcase of past event moments and highlights
- 📧 **Contact** - Get in touch with the organizing team
- ⚡ **Smooth Loading** - Custom loader animation for enhanced UX
- 📱 **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- ♿ **Accessible** - Built with accessibility best practices (ARIA labels, semantic HTML)

## Project Structure

```
Tech_Fest/
├── index.html              # Home page
├── events.html             # Events and schedule
├── register.html           # Registration page
├── gallery.html            # Photo gallery
├── contact.html            # Contact information
├── css/
│   ├── style.css           # Main stylesheet
│   ├── events.css          # Events page styles
│   ├── register.css        # Registration page styles
│   ├── gallery.css         # Gallery page styles
│   └── contact.css         # Contact page styles
├── image/                  # Image assets
├── media/                  # Media files (videos, etc.)
└── README.md               # This file
```

## Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No build tools or server setup required

### Local Development

1. **Clone or download** the project files
2. **Open** `index.html` in your web browser
3. Navigate through the pages using the top navigation bar

For local development with a live server:
```bash
# Using Python (Python 3)
python -m http.server 8000

# Using Node.js with http-server
npx http-server

# Using VS Code Live Server extension
# Right-click index.html → Open with Live Server
```

Then visit `http://localhost:8000` (or your server's port) in your browser.

## Technologies Used

- **HTML5** - Semantic markup and structure
- **CSS3** - Responsive styling with modern layouts
- **Vanilla JavaScript** - Interactive features and animations
- **SVG** - Scalable vector graphics for icons and animations

## Features Highlights

### Dynamic Navigation
- Responsive navbar with active state indicators
- Smooth navigation between pages
- Mobile-friendly menu structure

### Custom Loader
- Branded TechFest 2026 loading animation
- Progress percentage display
- Enhanced visual appeal during page loads

### Hero Section
- Compelling headline and event description
- Quick action buttons (Register & View Schedule)
- Event statistics display

### Form & Registration
- User-friendly registration interface
- Clean form layout
- Easy submission process

## Navigation Menu

- **Home** - Main landing page with event overview
- **Events** - Browse all hackathon competitions, workshops, and sessions
- **Register** - Sign up for TechFest 2026
- **Gallery** - View highlights from previous events
- **Contact** - Reach out to organizers

## Customization

### Colors & Branding
Edit the CSS files in the `css/` directory to customize:
- Color schemes
- Typography
- Spacing and layouts
- Button styles

### Content
Update HTML files directly to modify:
- Event description and dates
- Registration requirements
- Event schedules
- Contact information

### Assets
Add your own images and media files to:
- `image/` - Static images (logos, backgrounds, event photos)
- `media/` - Video files and other media

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Deployment

This is a static website with no backend dependencies. You can deploy it on:
- **GitHub Pages** - Free hosting for static sites
- **Netlify** - Drag & drop deployment
- **Vercel** - Fast static hosting
- **Traditional hosting** - Any web server (Apache, Nginx, etc.)

## Accessibility

This project includes:
- Semantic HTML elements
- ARIA labels for screen readers
- Proper heading hierarchy
- Keyboard navigation support
- Sufficient color contrast

## Future Enhancements

- Live event schedule updates
- Real-time registration status
- Live streaming integration
- Social media feeds
- Blog or news section
- Team showcases
- Sponsor highlights

## Contributing

To contribute improvements:
1. Update the relevant HTML/CSS files
2. Test across different browsers and devices
3. Ensure accessibility standards are maintained
4. Commit with clear messages

## License

This project is created for TechFest 2026 at Mar Baselios College.

## Contact

For questions about TechFest 2026, visit the Contact page or reach out through the website's contact form.

---

**Last Updated:** 2026-07-27  
**Version:** 1.0
