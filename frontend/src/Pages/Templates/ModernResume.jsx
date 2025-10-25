// ModernResume.jsx
import React from "react";
import "../Templates/template.css";

export const ModernResume = ({ data = {}, previewMode = false, onFieldEdit, EditableField }) => {
  const {
    personalInfo = {},
    education = [],
    experience = [],
    skills = [],
    projects = []
  } = data;

  return (
    <div className={`resume-template modern ${previewMode ? 'preview' : 'editor'}`}>
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
        HackerRank | GitHub | LinkedIn
      </p>

      {/* Professional Summary */}
      {personalInfo.summary && (
        <section>
          <h2>Professional Summary</h2>
          <p>
            {EditableField ? (
              <EditableField 
                fieldPath="personalInfo.summary"
                defaultValue={personalInfo.summary}
                multiline={true}
                placeholder="Briefly describe your professional background..."
                className="summary-editable"
              />
            ) : (
              personalInfo.summary
            )}
          </p>
        </section>
      )}

      {/* Education Section */}
      {education.length > 0 && (
        <section>
          <h2>Education</h2>
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
                    {" | "}
                    <EditableField 
                      fieldPath={`education.${index}.location`}
                      defaultValue={edu.location}
                      placeholder="New Delhi, India"
                    />
                  </>
                ) : (
                  <>
                    <strong>{edu.institution || "XYZ University"}</strong> – {edu.degree || "BTech Computer Science"} {edu.field && `in ${edu.field}`} {edu.gpa && `(GPA: ${edu.gpa})`} <br />
                    {edu.startDate || "June 2015"} – {edu.endDate || "July 2019"} | {edu.location || "New Delhi, India"}
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
          <h2>Experience</h2>
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
                {" – "}
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
          <h2>Skills</h2>
          <ul>
            {skills.map((skill, index) => (
              <li key={index}>
                <strong>
                  {EditableField ? (
                    <EditableField 
                      fieldPath={`skills.${index}.name`}
                      defaultValue={skill.name}
                      placeholder="Programming Languages"
                    />
                  ) : (
                    skill.name || "Programming Languages"
                  )}
                </strong>
                {": "}
                {EditableField ? (
                  <EditableField 
                    fieldPath={`skills.${index}.level`}
                    defaultValue={skill.level}
                    placeholder="C/C++, Java, HTML/CSS, JavaScript, Python, SQL"
                  />
                ) : (
                  skill.level || "C/C++, Java, HTML/CSS, JavaScript, Python, SQL"
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Projects Section */}
      {projects.length > 0 && (
        <section>
          <h2>Projects / Open Source</h2>
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
              {project.description && (
                <br />
              )}
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

      {/* Default content when no data */}
      {!personalInfo.name && !education.length && !experience.length && !skills.length && !projects.length && (
        <>
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
        </>
      )}
    </div>
  );
};

export default ModernResume;