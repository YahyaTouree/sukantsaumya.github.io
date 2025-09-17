# Interactive Developer Portfolio

This repository contains the source code for a modern, interactive, single-page developer portfolio website. It is designed to showcase projects, skills, and experience in a visually engaging way, incorporating several advanced front-end features.

## Features

- **Responsive Design**: Fully responsive layout that works on all devices, from mobile phones to desktop screens.
- **Custom Cursor**: A unique custom cursor with a trailing outline effect that enhances the user experience.
- **Scroll Animations**: Subtle fade-in animations on elements as they are scrolled into view, powered by the Intersection Observer API.
- **Scroll Progress Bar**: A progress bar at the top of the page indicates how far the user has scrolled.
- **Generative Hero Animation**: An interactive particle animation in the hero section that reacts to mouse movement.
- **AI-Powered Case Studies**: Project cards feature a "View AI Case Study" button that uses the Gemini API to generate a detailed case study and display it in a modal.
- **Mobile Navigation**: A clean, accessible mobile menu for easy navigation on smaller devices.

## Getting Started

To run this project locally, you do not need any complex setup or build process. Simply clone the repository and open the `index.html` file in your web browser.

```bash
# 1. Clone the repository
git clone https://github.com/sukantsaumya/sukantsaumya.github.io.git

# 2. Navigate to the project directory
cd sukantsaumya.github.io

# 3. Open index.html in your browser
# (You can do this by double-clicking the file in your file explorer or using a command)
# For example, on macOS:
open index.html
# On Windows:
start index.html
# On Linux:
xdg-open index.html
```

## File Structure

The project is organized into three main files:

- **`index.html`**: The main HTML file that defines the structure and content of the entire single-page application.
- **`style.css`**: The custom stylesheet that contains all non-Tailwind CSS rules. This includes styling for the custom cursor, timeline, animations, and other interactive components.
- **`app.js`**: The core JavaScript file that powers all the interactive features, including the mobile menu, animations, custom cursor, and the Gemini API integration.

## Technical Details

### Dependencies

This project relies on a few external libraries, all loaded via CDNs for simplicity:

- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
- **Google Fonts**: Used for the `Inter` and `Playfair Display` typefaces.
- **Feather Icons**: A collection of simply beautiful open source icons.

### Gemini API Integration

The "AI Case Study" feature is powered by the Google Gemini API. The `app.js` file contains the logic to construct a prompt from project data stored in `data-full-text` attributes in the HTML and sends it to the Gemini API.

**Important Security Note**: For this demonstration project, the Gemini API key is hardcoded directly in `app.js`. In a real-world, production application, this is a significant security risk. API keys should always be kept secret and managed through a secure backend proxy or serverless function that can add the key to requests away from the client-side.