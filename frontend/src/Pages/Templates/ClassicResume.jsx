// ClassicResume.jsx
import React from "react";
import "../Templates/template.css"

export const ClassicResume = ({ data = {}, previewMode = false, onFieldEdit, EditableField }) => {
  const {
    personalInfo = {},
    education = [],
    experience = [],
    skills = [],
    projects = []
  } = data;

  return (
    <div className={`resume-template classic ${previewMode ? 'preview' : 'editor'}`}>
      {/* Personal Info Section */}
      <h1>
        {EditableField ? (
          <EditableField 
            fieldPath="personalInfo.name"
            defaultValue={personalInfo.name}
            tag="h1"
            placeholder="First Last"
            className="resume-name-editable"
          />
        ) : (
          personalInfo.name || "First Last"
        )}
      </h1>
      
      <p className="contact">
        {EditableField ? (
          <>
            <EditableField 
              fieldPath="personalInfo.email"
              defaultValue={personalInfo.email}
              placeholder="xyz@email.com"
            />
            {" | "}
            <EditableField 
              fieldPath="personalInfo.phone"
              defaultValue={personalInfo.phone}
              placeholder="1234567890"
            />
            {" | "}
            <EditableField 
              fieldPath="personalInfo.location"
              defaultValue={personalInfo.location}
              placeholder="123 XYZ Street, Bangalore, IN"
            />
          </>
        ) : (
          `${personalInfo.email || "xyz@email.com"} | ${personalInfo.phone || "1234567890"} | ${personalInfo.location || "123 XYZ Street, Bangalore, IN"}`
        )}
        <br />
        HackerRank | GitHub | LinkedIn | Twitter | Portfolio
      </p>

      {/* Education Section */}
      {education.length > 0 && (
        <section>
          <h3>Education</h3>
          {education.map((edu, index) => (
            <div key={index} className="education-item">
              <p>
                {EditableField ? (
                  <>
                    <strong>
                      <EditableField 
                        fieldPath={`education.${index}.institution`}
                        defaultValue={edu.institution}
                        placeholder="XYZ University"
                      />
                    </strong>
                    {" – "}
                    <EditableField 
                      fieldPath={`education.${index}.degree`}
                      defaultValue={edu.degree}
                      placeholder="BTech Computer Science"
                    />
                    {edu.field && " in "}
                    {edu.field && (
                      <EditableField 
                        fieldPath={`education.${index}.field`}
                        defaultValue={edu.field}
                        placeholder="Field of Study"
                      />
                    )}
                    {edu.gpa && " (GPA: "}
                    {edu.gpa && (
                      <EditableField 
                        fieldPath={`education.${index}.gpa`}
                        defaultValue={edu.gpa}
                        placeholder="9.1"
                      />
                    )}
                    {edu.gpa && ")"}
                    <br />
                    <EditableField 
                      fieldPath={`education.${index}.location`}
                      defaultValue={edu.location}
                      placeholder="New Delhi, India"
                    />
                    {" | "}
                    <EditableField 
                      fieldPath={`education.${index}.startDate`}
                      defaultValue={edu.startDate}
                      placeholder="June 2015"
                    />
                    {" – "}
                    <EditableField 
                      fieldPath={`education.${index}.endDate`}
                      defaultValue={edu.endDate}
                      placeholder="July 2019"
                    />
                  </>
                ) : (
                  <>
                    <strong>{edu.institution || "XYZ University"}</strong> – {edu.degree || "BTech Computer Science"} {edu.field && `in ${edu.field}`} {edu.gpa && `(GPA: ${edu.gpa})`} <br />
                    {edu.location || "New Delhi, India"} | {edu.startDate || "June 2015"} – {edu.endDate || "July 2019"}
                  </>
                )}
              </p>
              {edu.description && (
                <p>
                  {EditableField ? (
                    <EditableField 
                      fieldPath={`education.${index}.description`}
                      defaultValue={edu.description}
                      multiline={true}
                      placeholder="Relevant coursework, achievements..."
                    />
                  ) : (
                    edu.description
                  )}
                </p>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Experience Section */}
      {experience.length > 0 && (
        <section>
          <h3>Experience</h3>
          {experience.map((exp, index) => (
            <div key={index} className="experience-item">
              <p>
                <strong>
                  {EditableField ? (
                    <EditableField 
                      fieldPath={`experience.${index}.company`}
                      defaultValue={exp.company}
                      placeholder="HackerRank"
                    />
                  ) : (
                    exp.company || "HackerRank"
                  )}
                </strong>
                {" | "}
                {EditableField ? (
                  <EditableField 
                    fieldPath={`experience.${index}.position`}
                    defaultValue={exp.position}
                    placeholder="Software Engineer 2"
                  />
                ) : (
                  exp.position || "Software Engineer 2"
                )}
                <br />
                {EditableField ? (
                  <EditableField 
                    fieldPath={`experience.${index}.location`}
                    defaultValue={exp.location}
                    placeholder="Bengaluru, IN"
                  />
                ) : (
                  exp.location || "Bengaluru, IN"
                )}
                {" | "}
                {EditableField ? (
                  <EditableField 
                    fieldPath={`experience.${index}.startDate`}
                    defaultValue={exp.startDate}
                    placeholder="Jan 21"
                  />
                ) : (
                  exp.startDate || "Jan 21"
                )}
                {" – "}
                {EditableField ? (
                  <EditableField 
                    fieldPath={`experience.${index}.endDate`}
                    defaultValue={exp.endDate}
                    placeholder="Present"
                  />
                ) : (
                  exp.endDate || "Present"
                )}
              </p>
              {exp.description && (
                <ul>
                  {exp.description.split('\n').map((item, i) => (
                    <li key={i}>
                      {EditableField ? (
                        <EditableField 
                          fieldPath={`experience.${index}.description`}
                          defaultValue={exp.description}
                          multiline={true}
                          placeholder="Write a one- or two-paragraph explanation..."
                        />
                      ) : (
                        item
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Skills Section */}
      {skills.length > 0 && (
        <section>
          <h3>Skills</h3>
          <p>
            {EditableField ? (
              <>
                <strong>
                  <EditableField 
                    fieldPath="skills.0.name"
                    defaultValue={skills[0]?.name}
                    placeholder="Programming Languages"
                  />
                </strong>
                {": "}
                <EditableField 
                  fieldPath="skills.0.level"
                  defaultValue={skills[0]?.level}
                  placeholder="C/C++, Java, HTML/CSS, JavaScript, Python, SQL"
                />
                <br />
                <strong>
                  <EditableField 
                    fieldPath="skills.1.name"
                    defaultValue={skills[1]?.name}
                    placeholder="Libraries/Frameworks"
                  />
                </strong>
                {": "}
                <EditableField 
                  fieldPath="skills.1.level"
                  defaultValue={skills[1]?.level}
                  placeholder="ReactJs, VueJs, Redux, ExpressJs"
                />
                <br />
                <strong>
                  <EditableField 
                    fieldPath="skills.2.name"
                    defaultValue={skills[2]?.name}
                    placeholder="Tools/Platforms"
                  />
                </strong>
                {": "}
                <EditableField 
                  fieldPath="skills.2.level"
                  defaultValue={skills[2]?.level}
                  placeholder="Git/GitHub, VSCode, GitHub Actions, Docker"
                />
                <br />
                <strong>
                  <EditableField 
                    fieldPath="skills.3.name"
                    defaultValue={skills[3]?.name}
                    placeholder="Databases"
                  />
                </strong>
                {": "}
                <EditableField 
                  fieldPath="skills.3.level"
                  defaultValue={skills[3]?.level}
                  placeholder="MongoDB, PostgreSQL"
                />
              </>
            ) : (
              <>
                <strong>Programming Languages:</strong> {skills[0]?.level || "C/C++, Java, HTML/CSS, JavaScript, Python, SQL"} <br />
                <strong>Libraries/Frameworks:</strong> {skills[1]?.level || "ReactJs, VueJs, Redux, ExpressJs"} <br />
                <strong>Tools/Platforms:</strong> {skills[2]?.level || "Git/GitHub, VSCode, GitHub Actions, Docker"} <br />
                <strong>Databases:</strong> {skills[3]?.level || "MongoDB, PostgreSQL"}
              </>
            )}
          </p>
        </section>
      )}

      {/* Projects Section */}
      {projects.length > 0 && (
        <section>
          <h3>Projects / Open Source</h3>
          {projects.map((project, index) => (
            <p key={index}>
              <strong>
                {EditableField ? (
                  <EditableField 
                    fieldPath={`projects.${index}.name`}
                    defaultValue={project.name}
                    placeholder="Project 1"
                  />
                ) : (
                  project.name || "Project 1"
                )}
              </strong>
              {" | Link – "}
              {EditableField ? (
                <EditableField 
                  fieldPath={`projects.${index}.technologies`}
                  defaultValue={project.technologies}
                  placeholder="JavaScript, HTML, CSS"
                />
              ) : (
                project.technologies || "JavaScript, HTML, CSS"
              )}
              <br />
              {project.description && (
                EditableField ? (
                  <EditableField 
                    fieldPath={`projects.${index}.description`}
                    defaultValue={project.description}
                    multiline={true}
                    placeholder="Write a one- or two-paragraph explanation..."
                  />
                ) : (
                  project.description
                )
              )}
            </p>
          ))}
        </section>
      )}

      {/* Honors & Awards Section */}
      <section>
        <h3>Honors & Awards</h3>
        <p>
          {EditableField ? (
            <EditableField 
              fieldPath="personalInfo.awards"
              defaultValue={personalInfo.awards}
              placeholder="Distinction, honor, or award — just the title."
              multiline={true}
            />
          ) : (
            personalInfo.awards || "Distinction, honor, or award — just the title."
          )}
        </p>
      </section>

      {/* Default content when no data */}
      {!personalInfo.name && !education.length && !experience.length && !skills.length && !projects.length && (
        <>
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
        </>
      )}
    </div>
  );
};

export default ClassicResume;