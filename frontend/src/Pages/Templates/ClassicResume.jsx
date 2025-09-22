import React from "react";
import "../Templates/classic.css"; // Shared CSS
export const ClassicResume = () => {
  return (
    <div className="resume-template classic">
      <h1>First Last</h1>
      <p className="contact">
        xyz@email.com | 1234567890 | 123 XYZ Street, Bangalore, IN <br />
        HackerRank | GitHub | LinkedIn | Twitter | Portfolio
      </p>

      <section>
        <h3>Education</h3>
        <p>
          <strong>XYZ University</strong> – BTech Computer Science (GPA: 9.1) <br />
          New Delhi, India | June 2015 – July 2019
        </p>
        <p>
          <strong>XYZ School</strong> – Higher Secondary Physics, Chemistry & Maths (GPA: 8.8) <br />
          New Delhi, India | March 2013 – May 2015
        </p>
      </section>

      <section>
        <h3>Experience</h3>
        <p>
          <strong>HackerRank | Software Engineer 2</strong> <br />
          Bengaluru, IN | Jan 21 – Present
        </p>
        <ul>
          <li>Write a one- or two-paragraph explanation of what the project aims to accomplish.</li>
          <li>Avoid delving deep into background or past projects.</li>
        </ul>

        <p>
          <strong>Amazon | SDE 1</strong> <br />
          Bangalore, IN | March 2020 – Dec 2020
        </p>
        <ul>
          <li>Write a one- or two-paragraph explanation...</li>
        </ul>

        <p>
          <strong>Microsoft | Software Engineer</strong> <br />
          Delhi, IN | Aug 2019 – Feb 2020
        </p>
        <ul>
          <li>Write a one- or two-paragraph explanation...</li>
        </ul>
      </section>

      <section>
        <h3>Skills</h3>
        <p>
          <strong>Programming Languages:</strong> C/C++, Java, HTML/CSS, JavaScript, Python, SQL <br />
          <strong>Libraries/Frameworks:</strong> ReactJs, VueJs, Redux, ExpressJs <br />
          <strong>Tools/Platforms:</strong> Git/GitHub, VSCode, GitHub Actions, Docker <br />
          <strong>Databases:</strong> MongoDB, PostgreSQL
        </p>
      </section>

      <section>
        <h3>Projects / Open Source</h3>
        <p>
          <strong>Project 1 | Link</strong> – JavaScript, HTML, CSS <br />
          Write a one- or two-paragraph explanation of what the project aims to accomplish.
        </p>
        <p>
          <strong>Project 2 | Link</strong> – ReactJs, ExpressJs, NodeJs, MongoDB <br />
          Write a one- or two-paragraph explanation...
        </p>
        <p>
          <strong>Project 3 | Link</strong> – Java, Distributed Systems, Computer Networks, MongoDB <br />
          Write a one- or two-paragraph explanation...
        </p>
      </section>

      <section>
        <h3>Honors & Awards</h3>
        <p>
          Distinction, honor, or award — just the title.
        </p>
      </section>
    </div>
  );
};
export default ClassicResume;