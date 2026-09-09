//pages/AboutPage.jsx

function AboutPage() {
  return (
    <div className="aboutPage">
      <h1>About Todo List</h1>

      <p>
        <strong>Todo List</strong> is a React application built with Vite and React Router.<br /> 
        It allows users to create, search, sort, edit, and complete todo items.<br /> 
        The application also includes user authentication, protected routes, and a profile page 
        with todo statistics.
      </p>

      <section>
        <h2>Features</h2>
        <ul>
          <li>Add new todo items</li>
          <li>Search and filter todo items</li>
          <li>Sort todos by different options</li>
          <li>Mark todos as completed</li>
          <li>Edit and manage todo items</li>
          <li>View todo statistics on the profile page</li>
          <li>User authentication and login</li>
          <li>Protected routes for authenticated users</li>
        </ul>
      </section>

      <section>
        <h2>Technologies Used</h2>
        <ul>
          <li>React</li>
          <li>React Router</li>
          <li>Vite</li>
        </ul>
      </section>
    </div>
  );
}

export default AboutPage;
