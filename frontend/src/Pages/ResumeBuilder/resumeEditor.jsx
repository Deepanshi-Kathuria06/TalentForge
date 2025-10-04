// ResumeBuilder.jsx
import React, { useState, useRef } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { 
  FaUser, FaGraduationCap, FaBriefcase, FaBolt, FaFolderOpen, 
  FaFilePdf, FaPaintBrush, FaPlus, FaSave 
} from 'react-icons/fa';

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
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  
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
    { id: 'professional', name: 'Professional' },
    { id: 'modern', name: 'Modern' },
    { id: 'creative', name: 'Creative' },
    { id: 'minimalist', name: 'Minimalist' }
  ];

  // Tab options
  const tabs = [
    { id: 'personal', name: 'Personal', icon: <FaUser /> },
    { id: 'education', name: 'Education', icon: <FaGraduationCap /> },
    { id: 'experience', name: 'Experience', icon: <FaBriefcase /> },
    { id: 'skills', name: 'Skills', icon: <FaBolt /> },
    { id: 'projects', name: 'Projects', icon: <FaFolderOpen /> }
  ];

  return (
    <div className="resume-builder-container">
      <header className="resume-header">
        <div className="logo-section">
          <h1 className="logo">ResumeBuilder</h1>
          <span className="logo-subtitle">Professional Resume Builder</span>
        </div>
        <div className="header-controls">
          <button 
            className={`template-toggle ${showTemplateSelector ? 'active' : ''}`}
            onClick={() => setShowTemplateSelector(!showTemplateSelector)}
          >
            <FaPaintBrush className="icon" />
            Templates
          </button>
          <button className="export-button" onClick={exportToPDF}>
            <FaFilePdf className="icon" />
            Export PDF
          </button>
        </div>
      </header>
      
      {showTemplateSelector && (
        <div className="template-selector">
          <div className="template-header">
            <h2>Choose a Template</h2>
            <button 
              className="close-button"
              onClick={() => setShowTemplateSelector(false)}
            >
              ×
            </button>
          </div>
          <div className="template-options">
            {templates.map(template => (
              <div 
                key={template.id}
                className={`template-option ${selectedTemplate === template.id ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedTemplate(template.id);
                  setShowTemplateSelector(false);
                }}
              >
                <div className="template-preview">
                  <div className="template-sample">
                    <div className="sample-header"></div>
                    <div className="sample-content">
                      <div className="sample-line short"></div>
                      <div className="sample-line medium"></div>
                      <div className="sample-line long"></div>
                    </div>
                  </div>
                </div>
                <span className="template-name">{template.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="content">
        <div className="sidebar-container">
          <div className="tab-navigation">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-text">{tab.name}</span>
              </button>
            ))}
          </div>
          
          <form className="sidebar" onSubmit={handleSubmit(onSubmit)}>
            <div className="tab-content-wrapper">
              {activeTab === 'personal' && (
                <div className="tab-content active">
                  <div className="section-header">
                    <h2 className="section-title">
                      <FaUser className="icon" />
                      Personal Information
                    </h2>
                  </div>
                  
                  <div className="form-section">
                    <div className="input-group">
                      <label>Full Name *</label>
                      <input
                        type="text"
                        placeholder="Enter your full name"
                        {...register("personalInfo.name")}
                        className="form-input"
                      />
                    </div>
                    
                    <div className="input-row">
                      <div className="input-group">
                        <label>Email *</label>
                        <input
                          type="email"
                          placeholder="your.email@example.com"
                          {...register("personalInfo.email")}
                          className="form-input"
                        />
                      </div>
                      <div className="input-group">
                        <label>Phone</label>
                        <input
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          {...register("personalInfo.phone")}
                          className="form-input"
                        />
                      </div>
                    </div>
                    
                    <div className="input-group">
                      <label>Location</label>
                      <input
                        type="text"
                        placeholder="City, Country"
                        {...register("personalInfo.location")}
                        className="form-input"
                      />
                    </div>
                    
                    <div className="input-group">
                      <label>Professional Summary</label>
                      <textarea
                        placeholder="Briefly describe your professional background, skills, and career objectives..."
                        {...register("personalInfo.summary")}
                        className="form-textarea"
                        rows={5}
                      />
                      <div className="char-count">0/500 characters</div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'education' && (
                <div className="tab-content active">
                  <div className="section-header">
                    <h2 className="section-title">
                      <FaGraduationCap className="icon" />
                      Education
                    </h2>
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
                      <FaPlus className="icon" />
                      Add Education
                    </button>
                  </div>
                  
                  {educationFields.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon"><FaGraduationCap /></div>
                      <h3>No Education Added</h3>
                      <p>Add your educational background to showcase your qualifications.</p>
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
                        className="add-button primary"
                      >
                        Add First Education
                      </button>
                    </div>
                  ) : (
                    educationFields.map((item, index) => (
                      <div key={item.id} className="form-section collapsible">
                        <div className="section-header collapsible-header">
                          <h3 className="item-title">
                            {watch(`education.${index}.institution`) || `Education #${index + 1}`}
                          </h3>
                          <div className="item-actions">
                            <button 
                              type="button" 
                              className="action-button move"
                              title="Move"
                            >
                              ⋮⋮
                            </button>
                            <button 
                              type="button" 
                              onClick={() => removeEducation(index)} 
                              className="action-button delete"
                              title="Delete"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                        
                        <div className="collapsible-content">
                          <div className="input-group">
                            <label>Institution *</label>
                            <input
                              type="text"
                              placeholder="University Name"
                              {...register(`education.${index}.institution`)}
                              className="form-input"
                            />
                          </div>
                          
                          <div className="input-row">
                            <div className="input-group">
                              <label>Degree *</label>
                              <input
                                type="text"
                                placeholder="Bachelor of Science"
                                {...register(`education.${index}.degree`)}
                                className="form-input"
                              />
                            </div>
                            <div className="input-group">
                              <label>Field of Study</label>
                              <input
                                type="text"
                                placeholder="Computer Science"
                                {...register(`education.${index}.field`)}
                                className="form-input"
                              />
                            </div>
                          </div>
                          
                          <div className="input-row">
                            <div className="input-group">
                              <label>Start Date</label>
                              <input
                                type="month"
                                {...register(`education.${index}.startDate`)}
                                className="form-input"
                              />
                            </div>
                            <div className="input-group">
                              <label>End Date</label>
                              <input
                                type="month"
                                {...register(`education.${index}.endDate`)}
                                className="form-input"
                              />
                            </div>
                          </div>
                          
                          <div className="input-group">
                            <label>Description</label>
                            <textarea
                              placeholder="Relevant coursework, achievements, or honors..."
                              {...register(`education.${index}.description`)}
                              className="form-textarea"
                              rows={3}
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
              
              {activeTab === 'experience' && (
                <div className="tab-content active">
                  <div className="section-header">
                    <h2 className="section-title">
                      <FaBriefcase className="icon" />
                      Work Experience
                    </h2>
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
                      <FaPlus className="icon" />
                      Add Experience
                    </button>
                  </div>
                  
                  {experienceFields.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon"><FaBriefcase /></div>
                      <h3>No Experience Added</h3>
                      <p>Add your work experience to showcase your professional background.</p>
                      <button 
                        type="button" 
                        onClick={() => appendExperience({ 
                          company: '', 
                          position: '', 
                          startDate: '', 
                          endDate: '', 
                          description: '' 
                        })} 
                        className="add-button primary"
                      >
                        Add First Experience
                      </button>
                    </div>
                  ) : (
                    experienceFields.map((item, index) => (
                      <div key={item.id} className="form-section collapsible">
                        <div className="section-header collapsible-header">
                          <h3 className="item-title">
                            {watch(`experience.${index}.company`) || `Experience #${index + 1}`}
                          </h3>
                          <div className="item-actions">
                            <button 
                              type="button" 
                              className="action-button move"
                              title="Move"
                            >
                              ⋮⋮
                            </button>
                            <button 
                              type="button" 
                              onClick={() => removeExperience(index)} 
                              className="action-button delete"
                              title="Delete"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                        
                        <div className="collapsible-content">
                          <div className="input-group">
                            <label>Company *</label>
                            <input
                              type="text"
                              placeholder="Company Name"
                              {...register(`experience.${index}.company`)}
                              className="form-input"
                            />
                          </div>
                          
                          <div className="input-group">
                            <label>Position *</label>
                            <input
                              type="text"
                              placeholder="Job Title"
                              {...register(`experience.${index}.position`)}
                              className="form-input"
                            />
                          </div>
                          
                          <div className="input-row">
                            <div className="input-group">
                              <label>Start Date</label>
                              <input
                                type="month"
                                {...register(`experience.${index}.startDate`)}
                                className="form-input"
                              />
                            </div>
                            <div className="input-group">
                              <label>End Date</label>
                              <input
                                type="month"
                                placeholder="Present"
                                {...register(`experience.${index}.endDate`)}
                                className="form-input"
                              />
                            </div>
                          </div>
                          
                          <div className="input-group">
                            <label>Description</label>
                            <textarea
                              placeholder="Describe your responsibilities, achievements, and key contributions..."
                              {...register(`experience.${index}.description`)}
                              className="form-textarea"
                              rows={4}
                            />
                            <div className="char-count">0/1000 characters</div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
              
              {activeTab === 'skills' && (
                <div className="tab-content active">
                  <div className="section-header">
                    <h2 className="section-title">
                      <FaBolt className="icon" />
                      Skills
                    </h2>
                    <button 
                      type="button" 
                      onClick={() => appendSkill({ name: '', level: 'intermediate' })} 
                      className="add-button"
                    >
                      <FaPlus className="icon" />
                      Add Skill
                    </button>
                  </div>
                  
                  {skillFields.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon"><FaBolt /></div>
                      <h3>No Skills Added</h3>
                      <p>Add your technical and professional skills.</p>
                      <button 
                        type="button" 
                        onClick={() => appendSkill({ name: '', level: 'intermediate' })} 
                        className="add-button primary"
                      >
                        Add First Skill
                      </button>
                    </div>
                  ) : (
                    <div className="skills-container">
                      {skillFields.map((item, index) => (
                        <div key={item.id} className="skill-item">
                          <div className="skill-inputs">
                            <input
                              type="text"
                              placeholder="Skill name (e.g., JavaScript, Project Management)"
                              {...register(`skills.${index}.name`)}
                              className="form-input"
                            />
                            <select
                              {...register(`skills.${index}.level`)}
                              className="skill-level"
                            >
                              <option value="beginner">Beginner</option>
                              <option value="intermediate">Intermediate</option>
                              <option value="advanced">Advanced</option>
                              <option value="expert">Expert</option>
                            </select>
                            <button 
                              type="button" 
                              onClick={() => removeSkill(index)} 
                              className="skill-remove"
                              title="Remove skill"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'projects' && (
                <div className="tab-content active">
                  <div className="section-header">
                    <h2 className="section-title">
                      <FaFolderOpen className="icon" />
                      Projects
                    </h2>
                    <button 
                      type="button" 
                      onClick={() => appendProject({ 
                        name: '', 
                        technologies: '', 
                        description: '' 
                      })} 
                      className="add-button"
                    >
                      <FaPlus className="icon" />
                      Add Project
                    </button>
                  </div>
                  
                  {projectFields.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon"><FaFolderOpen /></div>
                      <h3>No Projects Added</h3>
                      <p>Add your personal or professional projects.</p>
                      <button 
                        type="button" 
                        onClick={() => appendProject({ 
                          name: '', 
                          technologies: '', 
                          description: '' 
                        })} 
                        className="add-button primary"
                      >
                        Add First Project
                      </button>
                    </div>
                  ) : (
                    projectFields.map((item, index) => (
                      <div key={item.id} className="form-section collapsible">
                        <div className="section-header collapsible-header">
                          <h3 className="item-title">
                            {watch(`projects.${index}.name`) || `Project #${index + 1}`}
                          </h3>
                          <div className="item-actions">
                            <button 
                              type="button" 
                              className="action-button move"
                              title="Move"
                            >
                              ⋮⋮
                            </button>
                            <button 
                              type="button" 
                              onClick={() => removeProject(index)} 
                              className="action-button delete"
                              title="Delete"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                        
                        <div className="collapsible-content">
                          <div className="input-group">
                            <label>Project Name *</label>
                            <input
                              type="text"
                              placeholder="Project Title"
                              {...register(`projects.${index}.name`)}
                              className="form-input"
                            />
                          </div>
                          
                          <div className="input-group">
                            <label>Technologies Used</label>
                            <input
                              type="text"
                              placeholder="React, Node.js, MongoDB, etc."
                              {...register(`projects.${index}.technologies`)}
                              className="form-input"
                            />
                          </div>
                          
                          <div className="input-group">
                            <label>Project Description</label>
                            <textarea
                              placeholder="Describe the project, your role, and key achievements..."
                              {...register(`projects.${index}.description`)}
                              className="form-textarea"
                              rows={4}
                            />
                            <div className="char-count">0/800 characters</div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
            
            <div className="sidebar-footer">
              <button type="submit" className="save-button">
                <FaSave className="icon" />
                Save Resume
              </button>
              <div className="auto-save">
                <span className="auto-save-indicator">●</span>
                Auto-saved
              </div>
            </div>
          </form>
        </div>

        <div className="preview">
          <div className="preview-header">
            <h3>Live Preview</h3>
            <div className="preview-controls">
              <button className="preview-zoom">−</button>
              <span className="preview-scale">100%</span>
              <button className="preview-zoom">+</button>
            </div>
          </div>
          <div className="preview-content">
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
                  <h2 className="section-title-resume">Professional Summary</h2>
                  <p className="summary-text">{formData.personalInfo.summary}</p>
                </div>
              )}
              
              {formData.education && formData.education.length > 0 && (
                <div className="resume-section">
                  <h2 className="section-title-resume">Education</h2>
                  {formData.education.map((edu, index) => (
                    <div key={index} className="experience-item">
                      <div className="experience-header">
                        <div>
                          <h3>{edu.institution}</h3>
                          <p className="degree">{edu.degree} {edu.field && `in ${edu.field}`}</p>
                        </div>
                        <span className="date-range">
                          {edu.startDate} {edu.startDate && edu.endDate ? ' - ' : ''} {edu.endDate}
                        </span>
                      </div>
                      {edu.description && <p className="description">{edu.description}</p>}
                    </div>
                  ))}
                </div>
              )}
              
              {formData.experience && formData.experience.length > 0 && (
                <div className="resume-section">
                  <h2 className="section-title-resume">Work Experience</h2>
                  {formData.experience.map((exp, index) => (
                    <div key={index} className="experience-item">
                      <div className="experience-header">
                        <div>
                          <h3>{exp.company}</h3>
                          <p className="position">{exp.position}</p>
                        </div>
                        <span className="date-range">
                          {exp.startDate} {exp.startDate && exp.endDate ? ' - ' : ''} {exp.endDate}
                        </span>
                      </div>
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
                      <span key={index} className="skill-tag">
                        {skill.name}
                        {skill.level && <span className="skill-level-badge">{skill.level}</span>}
                      </span>
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
    </div>
  );
};

export default ResumeBuilder;