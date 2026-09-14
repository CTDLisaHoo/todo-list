# Todo List

A responsive Todo List application built with React and Vite. The application helps users manage their tasks by allowing them to add, edit, complete, delete, filter, search, and sort todo items. It also includes user authentication, protected routes, client-side validation, todo statistics, and responsive styling for desktop, tablet, and mobile devices.

## 🚀 Live Demo

[View Live Application](https://todo-list-todo-list4.vercel.app)

## ✨ Features

- Add new todo items
- Edit existing todo items
- Mark todos as completed
- Delete todo items
- Search todo items
- Filter todos by status
- Sort todos using different options
- View todo statistics on the profile page
- User authentication and login
- Protected routes for authenticated users
- Client-side form validation
- Maximum 100-character todo title limit
- Styled loading, error, and empty states
- Responsive design for desktop, tablet, and mobile
- Touch-friendly controls and interactions

## 🛠️ Technologies Used

- **Frontend:** React 19
- **Routing:** React Router
- **Programming Language:** JavaScript
- **Styling:** CSS Modules
- **Build Tool:** Vite
- **Code Quality:** ESLint
- **Version Control:** Git and GitHub

## 📸 Screenshots

### Desktop Views

![About desktop view](./screenshots/desktop-about.png)
![Login desktop view](./screenshots/desktop-login.png)
![Not Found page desktop view](./screenshots/desktop-not-found-page.png)
![Profile desktop view](./screenshots/desktop-profile.png)
![Todos desktop view](./screenshots/desktop-todos.png)

### Mobile Views

![About mobile view](./screenshots/mobile-about.png)
![Login mobile view](./screenshots/mobile-login.png)
![Not Found page mobile view](./screenshots/mobile-not-found-page.png)
![Profile mobile view](./screenshots/mobile-profile.png)
![Todos mobile view](./screenshots/mobile-todos.png)


## 🏗️ Getting Started

### Prerequisites

Make sure you have the following installed:
- npm
- Git

### Installation

1. Clone the repository:

   git clone https://github.com/CTDLisaHoo/todo-list.git
   
2. Navigate to the project directory:

    `cd todo-list`
   
3. Install the project dependencies:

   `npm install`
   
### Running the Development Server

Start the development server by running:

- `npm run dev` — Starts the Vite development server.


Then open the local URL displayed in the terminal (typically `http://localhost:5173`) in your web browser.

## 📜 Available Scripts
The following npm scripts are available in the project:
- npm run dev — Starts the Vite development server for local development.
- npm run build — Creates an optimized production build.
- npm run preview — Serves the production build locally for preview.
- npm run lint — Runs ESLint to check the codebase for potential issues.

## 🎨 Design Decisions
I chose **CSS Modules** for styling because they keep styles scoped to individual components and pages. This helps prevent class-name conflicts and makes the application easier to maintain as it grows.

I organized the styling into separate **.module.css** files for shared components, Todo components, and pages. I also use global CSS variables in index.css for common colors, borders, border radii, and shadows to keep the visual design consistent throughout the application.

The application uses a simple and consistent color scheme to distinguish primary actions, successful actions, errors, and secondary actions. Consistent spacing, typography, borders, and shadows are used to create a clean and professional interface.

I designed the application to be responsive across desktop, tablet, and mobile screen sizes using CSS media queries. Buttons, checkboxes, and other interactive controls use touch-friendly sizing, and visible focus styles are provided to support keyboard navigation.

The application also includes loading, error, and empty states to give users clear feedback when data is being loaded, when an operation fails, or when there are no todos to display.

Accessibility was considered throughout the interface by using semantic HTML, labels for form controls, accessible error messages, keyboard focus indicators, and appropriate ARIA attributes where needed.

## 🔮 Future Improvements
- Todo due dates and reminders
- Categories or tags for organizing todos
- Automated unit and integration tests
- Improved authentication and account management
- Todo priority levels
- Notifications and reminder settings

## 📄 License
This project is licensed under the **MIT License**.

The MIT License permits users to use, copy, modify, merge, publish, distribute, sublicense, and sell copies of the software, subject to the conditions of the license. The software is provided without warranty, as described in the MIT License.

## 📬 Contact
GitHub: https://github.com/CTDLisaHoo
