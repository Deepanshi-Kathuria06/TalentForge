import React from "react";
import "../Templates/template.css"; // Shared CSS
export const ModernResume = () => {
  return (
    <div className="resume-template modern">
      <h1>First Last</h1>
      <p className="contact">
        xyz@email.com | 1234567890 | 123 XYZ Street, Bangalore, IN <br />
        HackerRank | GitHub | LinkedIn
      </p>

      <section>
        <h2>Education</h2>
        <p>
          <strong>XYZ University</strong> – BTech Computer Science (GPA: 9.1) <br />
          June 2015 – July 2019 | New Delhi, India
        </p>
        <p>
          <strong>XYZ School</strong> – Higher Secondary Physics, Chemistry & Maths (GPA: 8.8) <br />
          March 2013 – May 2015 | New Delhi, India
        </p>
      </section>

      <section>
        <h2>Experience</h2>
        <p>
          <strong>HackerRank | Software Engineer 2</strong> – Bengaluru, IN | Jan 21 – Present
        </p>
        <ul>
          <li>Write a one- or two-paragraph explanation...</li>
          <li>Avoid delving deep into background or past projects.</li>
        </ul>

        <p>
          <strong>Amazon | SDE 1</strong> – Bangalore, IN | March 2020 – Dec 2020
        </p>
        <ul>
          <li>Write a one- or two-paragraph explanation...</li>
        </ul>

        <p>
          <strong>Microsoft | Software Engineer</strong> – Delhi, IN | Aug 2019 – Feb 2020
        </p>
        <ul>
          <li>Write a one- or two-paragraph explanation...</li>
        </ul>
      </section>

      <section>
        <h2>Skills</h2>
        <ul>
          <li><strong>Programming Languages:</strong> C/C++, Java, HTML/CSS, JavaScript, Python, SQL</li>
          <li><strong>Libraries/Frameworks:</strong> ReactJs, VueJs, Redux, ExpressJs</li>
          <li><strong>Tools/Platforms:</strong> Git/GitHub, VSCode, GitHub Actions, Docker</li>
          <li><strong>Databases:</strong> MongoDB, PostgreSQL</li>
        </ul>
      </section>

      <section>
        <h2>Projects / Open Source</h2>
        <p>
          <strong>Project 1 | Link</strong> – JavaScript, HTML, CSS
        </p>
        <p>
          <strong>Project 2 | Link</strong> – ReactJs, ExpressJs, NodeJs, MongoDB
        </p>
        <p>
          <strong>Project 3 | Link</strong> – Java, Distributed Systems, Computer Networks, MongoDB
        </p>
      </section>
    </div>
  );
};
export default ModernResume;