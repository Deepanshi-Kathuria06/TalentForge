// ResumeBuilder.jsx
import React, { useState, useRef } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';

import "../ResumeBuilder/Resume.css"

const ResumeBuilder = () => {
  const { register, control, handleSubmit, watch } = useForm({
    defaultValues: {
      personalInfo: {
        name: '',
        email: '',
        phone: '',
        location: '',
        summary: ''
      },
      education: [],
      experience: [],
      skills: [],
      projects: []
    }
  });
  
  // State for selected template
  const [selectedTemplate, setSelectedTemplate] = useState('professional');
  const [showTemplateSelector, setShowTemplateSelector] = useState(true);
  
  const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({
    control,
    name: "education"
  });
  
  const { fields: experienceFields, append: appendExperience, remove: removeExperience } = useFieldArray({
    control,
    name: "experience"
  });
  
  const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({
    control,
    name: "skills"
  });
  
  const { fields: projectFields, append: appendProject, remove: removeProject } = useFieldArray({
    control,
    name: "projects"
  });
  
  const resumeRef = useRef();
  const formData = watch();
  
  const exportToPDF = () => {
    window.print();
  };
  
  const onSubmit = (data) => {
    console.log(data);
  };

  // Template options
  const templates = [
    { id: 'professional', name: 'Professional', color: '#004030' },
    { id: 'modern', name: 'Modern', color: '#2563EB' },
    { id: 'creative', name: 'Creative', color: '#7C3AED' },
    { id: 'minimalist', name: 'Minimalist', color: '#DC2626' }
  ];

  return (
    <div className="resume-builder-container">
      <header className="resume-header">
        <h1 className="logo">ResumeBuilder</h1>
        <div className="header-controls">
          <button 
            className="template-toggle"
            onClick={() => setShowTemplateSelector(!showTemplateSelector)}
          >
            {showTemplateSelector ? 'Hide Templates' : 'Change Template'}
          </button>
          <button className="export-button" onClick={exportToPDF}>
            Export PDF
          </button>
        </div>
      </header>
      
      {showTemplateSelector && (
        <div className="template-selector">
          <h2>Choose a Template</h2>
          <div className="template-options">
            {templates.map(template => (
              <div 
                key={template.id}
                className={`template-option ${selectedTemplate === template.id ? 'selected' : ''}`}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <div 
                  className="template-preview" 
                  style={{ backgroundColor: template.color }}
                >
                  {template.name}
                </div>
                <span>{template.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="content">
        <form className="sidebar" onSubmit={handleSubmit(onSubmit)}>
          <h2>Personal Information</h2>
          <div className="form-section">
            <input
              type="text"
              placeholder="Full Name"
              {...register("personalInfo.name")}
              className="form-input"
            />
            <input
              type="email"
              placeholder="Email"
              {...register("personalInfo.email")}
              className="form-input"
            />
            <input
              type="tel"
              placeholder="Phone"
              {...register("personalInfo.phone")}
              className="form-input"
            />
            <input
              type="text"
              placeholder="Location"
              {...register("personalInfo.location")}
              className="form-input"
            />
            <div className="summary-textarea">
              <label>Professional Summary</label>
              <textarea
                placeholder="Enter your professional summary..."
                {...register("personalInfo.summary")}
                className="form-textarea"
                rows={4}
              />
            </div>
          </div>

          <div className="section-header">
            <h2>Education</h2>
            <button 
              type="button" 
              onClick={() => appendEducation({ 
                institution: '', 
                degree: '', 
                field: '', 
                startDate: '', 
                endDate: '', 
                description: '' 
              })} 
              className="add-button"
            >
              + Add
            </button>
          </div>
          
          {educationFields.map((item, index) => (
            <div key={item.id} className="form-section">
              <div className="section-title">
                <h3>Education #{index + 1}</h3>
                <button type="button" onClick={() => removeEducation(index)} className="remove-button">
                  Remove
                </button>
              </div>
              <input
                type="text"
                placeholder="Institution"
                {...register(`education.${index}.institution`)}
                className="form-input"
              />
              <input
                type="text"
                placeholder="Degree"
                {...register(`education.${index}.degree`)}
                className="form-input"
              />
              <input
                type="text"
                placeholder="Field of Study"
                {...register(`education.${index}.field`)}
                className="form-input"
              />
              <div className="date-row">
                <input
                  type="text"
                  placeholder="Start Date (e.g. Jan 2020)"
                  {...register(`education.${index}.startDate`)}
                  className="form-input"
                />
                <input
                  type="text"
                  placeholder="End Date (e.g. Dec 2023)"
                  {...register(`education.${index}.endDate`)}
                  className="form-input"
                />
              </div>
              <textarea
                placeholder="Description"
                {...register(`education.${index}.description`)}
                className="form-textarea"
                rows={2}
              />
            </div>
          ))}

          <div className="section-header">
            <h2>Work Experience</h2>
            <button 
              type="button" 
              onClick={() => appendExperience({ 
                company: '', 
                position: '', 
                startDate: '', 
                endDate: '', 
                description: '' 
              })} 
              className="add-button"
            >
              + Add
            </button>
          </div>
          
          {experienceFields.map((item, index) => (
            <div key={item.id} className="form-section">
              <div className="section-title">
                <h3>Experience #{index + 1}</h3>
                <button type="button" onClick={() => removeExperience(index)} className="remove-button">
                  Remove
                </button>
              </div>
              <input
                type="text"
                placeholder="Company"
                {...register(`experience.${index}.company`)}
                className="form-input"
              />
              <input
                type="text"
                placeholder="Position"
                {...register(`experience.${index}.position`)}
                className="form-input"
              />
              <div className="date-row">
                <input
                  type="text"
                  placeholder="Start Date (e.g. Jan 2022)"
                  {...register(`experience.${index}.startDate`)}
                  className="form-input"
                />
                <input
                  type="text"
                  placeholder="End Date (e.g. Present)"
                  {...register(`experience.${index}.endDate`)}
                  className="form-input"
                />
              </div>
              <textarea
                placeholder="Description of responsibilities and achievements"
                {...register(`experience.${index}.description`)}
                className="form-textarea"
                rows={3}
              />
            </div>
          ))}

          <div className="section-header">
            <h2>Skills</h2>
            <button 
              type="button" 
              onClick={() => appendSkill({ name: '' })} 
              className="add-button"
            >
              + Add
            </button>
          </div>
          
          {skillFields.map((item, index) => (
            <div key={item.id} className="form-section">
              <div className="skill-row">
                <input
                  type="text"
                  placeholder="Skill (e.g. JavaScript, Python, React)"
                  {...register(`skills.${index}.name`)}
                  className="form-input"
                />
                <button type="button" onClick={() => removeSkill(index)} className="remove-button">
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="section-header">
            <h2>Projects</h2>
            <button 
              type="button" 
              onClick={() => appendProject({ 
                name: '', 
                technologies: '', 
                description: '' 
              })} 
              className="add-button"
            >
              + Add
            </button>
          </div>
          
          {projectFields.map((item, index) => (
            <div key={item.id} className="form-section">
              <div className="section-title">
                <h3>Project #{index + 1}</h3>
                <button type="button" onClick={() => removeProject(index)} className="remove-button">
                  Remove
                </button>
              </div>
              <input
                type="text"
                placeholder="Project Name"
                {...register(`projects.${index}.name`)}
                className="form-input"
              />
              <input
                type="text"
                placeholder="Technologies Used"
                {...register(`projects.${index}.technologies`)}
                className="form-input"
              />
              <textarea
                placeholder="Project Description"
                {...register(`projects.${index}.description`)}
                className="form-textarea"
                rows={2}
              />
            </div>
          ))}
          
          <button type="submit" className="save-button">Save Resume</button>
        </form>

        <div className="preview">
          <div ref={resumeRef} className={`resume template-${selectedTemplate}`}>
            <div className="resume-header">
              <h1 className="resume-name">{formData.personalInfo?.name || "Your Name"}</h1>
              <div className="contact-info">
                {formData.personalInfo?.email && <span>{formData.personalInfo.email}</span>}
                {formData.personalInfo?.phone && <span>{formData.personalInfo.phone}</span>}
                {formData.personalInfo?.location && <span>{formData.personalInfo.location}</span>}
              </div>
            </div>
            
            {formData.personalInfo?.summary && (
              <div className="resume-section">
                <h2 className="section-title-resume">Summary</h2>
                <p className="summary-text">{formData.personalInfo.summary}</p>
              </div>
            )}
            
            {formData.education && formData.education.length > 0 && (
              <div className="resume-section">
                <h2 className="section-title-resume">Education</h2>
                {formData.education.map((edu, index) => (
                  <div key={index} className="experience-item">
                    <div className="experience-header">
                      <h3>{edu.institution}</h3>
                      <span className="date-range">
                        {edu.startDate} {edu.startDate && edu.endDate ? ' - ' : ''} {edu.endDate}
                      </span>
                    </div>
                    <p className="degree">{edu.degree} {edu.field && `in ${edu.field}`}</p>
                    {edu.description && <p className="description">{edu.description}</p>}
                  </div>
                ))}
              </div>
            )}
            
            {formData.experience && formData.experience.length > 0 && (
              <div className="resume-section">
                <h2 className="section-title-resume">Experience</h2>
                {formData.experience.map((exp, index) => (
                  <div key={index} className="experience-item">
                    <div className="experience-header">
                      <h3>{exp.company}</h3>
                      <span className="date-range">
                        {exp.startDate} {exp.startDate && exp.endDate ? ' - ' : ''} {exp.endDate}
                      </span>
                    </div>
                    <p className="position">{exp.position}</p>
                    {exp.description && <p className="description">{exp.description}</p>}
                  </div>
                ))}
              </div>
            )}
            
            {formData.skills && formData.skills.length > 0 && (
              <div className="resume-section">
                <h2 className="section-title-resume">Skills</h2>
                <div className="skills-list">
                  {formData.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">{skill.name}</span>
                  ))}
                </div>
              </div>
            )}
            
            {formData.projects && formData.projects.length > 0 && (
              <div className="resume-section">
                <h2 className="section-title-resume">Projects</h2>
                {formData.projects.map((project, index) => (
                  <div key={index} className="experience-item">
                    <h3>{project.name}</h3>
                    {project.technologies && (
                      <p className="technologies">Technologies: {project.technologies}</p>
                    )}
                    {project.description && <p className="description">{project.description}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;