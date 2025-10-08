// ResumeBuilder.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useLocation } from "react-router-dom";
import { 
  FaUser, FaGraduationCap, FaBriefcase, FaBolt, FaFolderOpen, 
  FaFilePdf, FaPaintBrush, FaPlus, FaSave 
} from 'react-icons/fa';
import html2pdf from "html2pdf.js";

// Import template components
import ModernResume from "../Templates/ModernResume";
import ClassicResume from "../Templates/ClassicResume";

import "../ResumeBuilder/Resume.css";

const ResumeBuilder = () => {
  const location = useLocation();
  
  // Get template from navigation state or default to 'professional'
  const [selectedTemplate, setSelectedTemplate] = useState(
    location.state?.templateType || 'professional'
  );
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [previewScale, setPreviewScale] = useState(1);
  
  const { register, control, handleSubmit, watch, setValue } = useForm({
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
  
  // Show template info when component mounts
  useEffect(() => {
    if (location.state?.templateName) {
      console.log(`Using template: ${location.state.templateName}`);
    }
  }, [location.state]);
  
  const exportToPDF = () => {
    const element = resumeRef.current;
    if (!element) return;
    
    // Store original transform for restoration
    const originalTransform = element.style.transform;
    const originalWidth = element.style.width;
    const originalHeight = element.style.height;
    
    // Reset transform for PDF generation
    element.style.transform = 'none';
    element.style.width = 'auto';
    element.style.height = 'auto';
    
    html2pdf()
      .set({
        margin: 0.5,
        filename: "resume.pdf",
        html2canvas: { 
          scale: 2,
          useCORS: true,
          logging: false
        },
        jsPDF: { 
          unit: "in", 
          format: "letter", 
          orientation: "portrait" 
        }
      })
      .from(element)
      .save()
      .then(() => {
        // Restore original transform after PDF generation
        element.style.transform = originalTransform;
        element.style.width = originalWidth;
        element.style.height = originalHeight;
      });
  };
  
  const zoomIn = () => {
    setPreviewScale(prev => Math.min(prev + 0.1, 2)); // Max zoom 200%
  };

  const zoomOut = () => {
    setPreviewScale(prev => Math.max(prev - 0.1, 0.5)); // Min zoom 50%
  };

  const resetZoom = () => {
    setPreviewScale(1);
  };

  const onSubmit = (data) => {
    console.log('Resume data:', data);
    console.log('Template:', selectedTemplate);
    // Save logic here
  };

  // Handle direct editing from preview
  const handleContentEdit = (fieldPath, newValue) => {
    setValue(fieldPath, newValue);
  };

  // Clean Editable Field Component (No Pen Icon)
  const EditableField = ({ 
    fieldPath, 
    defaultValue, 
    className = "", 
    tag: Tag = "span",
    placeholder = "Click to edit...",
    multiline = false
  }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(defaultValue || "");
    const inputRef = useRef(null);

    useEffect(() => {
      setValue(defaultValue || "");
    }, [defaultValue]);

    const handleClick = (e) => {
      e.stopPropagation();
      setIsEditing(true);
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          if (multiline) {
            inputRef.current.setSelectionRange(value.length, value.length);
          }
        }
      }, 0);
    };

    const handleSave = () => {
      if (value !== defaultValue) {
        handleContentEdit(fieldPath, value);
      }
      setIsEditing(false);
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && !multiline) {
        e.preventDefault();
        handleSave();
      } else if (e.key === 'Escape') {
        setValue(defaultValue || "");
        setIsEditing(false);
      }
    };

    const handleBlur = () => {
      handleSave();
    };

    if (isEditing) {
      if (multiline) {
        return (
          <textarea
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className={`editable-field ${className} editing`}
            placeholder={placeholder}
            rows={3}
          />
        );
      }
      
      return (
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={`editable-field ${className} editing`}
          placeholder={placeholder}
        />
      );
    }

    return (
      <Tag 
        className={`editable-field ${className} ${!defaultValue ? 'empty' : ''}`}
        onClick={handleClick}
        title="Click to edit"
      >
        {defaultValue || placeholder}
      </Tag>
    );
  };

  // Template options
  const templates = [
    { id: 'modern', name: 'Modern' },
    { id: 'classic', name: 'Classic' },
  ];

  // Tab options
  const tabs = [
    { id: 'personal', name: 'Personal', icon: <FaUser /> },
    { id: 'education', name: 'Education', icon: <FaGraduationCap /> },
    { id: 'experience', name: 'Experience', icon: <FaBriefcase /> },
    { id: 'skills', name: 'Skills', icon: <FaBolt /> },
    { id: 'projects', name: 'Projects', icon: <FaFolderOpen /> }
  ];

  // Template renderer with zoom functionality
  const renderTemplate = () => {
    const templateProps = {
      data: formData,
      previewMode: false,
      onFieldEdit: handleContentEdit,
      EditableField: EditableField
    };

    switch (selectedTemplate) {
      case 'modern':
        return <ModernResume {...templateProps} />;
      case 'classic':
        return <ClassicResume {...templateProps} />;
      default:
        return (
          <div className={`resume template-${selectedTemplate} editable-resume`}>
            <div className="resume-header">
              <h1 className="resume-name">
                <EditableField 
                  fieldPath="personalInfo.name"
                  defaultValue={formData.personalInfo?.name}
                  tag="h1"
                  placeholder="Your Name"
                  className="resume-name-editable"
                />
              </h1>
              <div className="contact-info">
                <EditableField 
                  fieldPath="personalInfo.email"
                  defaultValue={formData.personalInfo?.email}
                  placeholder="your.email@example.com"
                />
                {formData.personalInfo?.email && formData.personalInfo?.phone && " | "}
                <EditableField 
                  fieldPath="personalInfo.phone"
                  defaultValue={formData.personalInfo?.phone}
                  placeholder="+1 (555) 123-4567"
                />
                {(formData.personalInfo?.email || formData.personalInfo?.phone) && formData.personalInfo?.location && " | "}
                <EditableField 
                  fieldPath="personalInfo.location"
                  defaultValue={formData.personalInfo?.location}
                  placeholder="City, Country"
                />
              </div>
            </div>
            
            {formData.personalInfo?.summary && (
              <div className="resume-section">
                <h2 className="section-title-resume">Professional Summary</h2>
                <p className="summary-text">
                  <EditableField 
                    fieldPath="personalInfo.summary"
                    defaultValue={formData.personalInfo?.summary}
                    multiline={true}
                    placeholder="Briefly describe your professional background..."
                    className="summary-editable"
                  />
                </p>
              </div>
            )}
            
            {formData.education && formData.education.length > 0 && (
              <div className="resume-section">
                <h2 className="section-title-resume">Education</h2>
                {formData.education.map((edu, index) => (
                  <div key={index} className="experience-item">
                    <div className="experience-header">
                      <div>
                        <h3>
                          <EditableField 
                            fieldPath={`education.${index}.institution`}
                            defaultValue={edu.institution}
                            placeholder="University Name"
                          />
                        </h3>
                        <p className="degree">
                          <EditableField 
                            fieldPath={`education.${index}.degree`}
                            defaultValue={edu.degree}
                            placeholder="Degree"
                          />
                          {edu.field && " in "}
                          {edu.field && (
                            <EditableField 
                              fieldPath={`education.${index}.field`}
                              defaultValue={edu.field}
                              placeholder="Field of Study"
                            />
                          )}
                        </p>
                      </div>
                      <span className="date-range">
                        <EditableField 
                          fieldPath={`education.${index}.startDate`}
                          defaultValue={edu.startDate}
                          placeholder="Start Date"
                        />
                        {edu.startDate && edu.endDate ? ' - ' : ''}
                        <EditableField 
                          fieldPath={`education.${index}.endDate`}
                          defaultValue={edu.endDate}
                          placeholder="End Date"
                        />
                      </span>
                    </div>
                    {edu.description && (
                      <p className="description">
                        <EditableField 
                          fieldPath={`education.${index}.description`}
                          defaultValue={edu.description}
                          multiline={true}
                          placeholder="Description..."
                        />
                      </p>
                    )}
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
                        <h3>
                          <EditableField 
                            fieldPath={`experience.${index}.company`}
                            defaultValue={exp.company}
                            placeholder="Company Name"
                          />
                        </h3>
                        <p className="position">
                          <EditableField 
                            fieldPath={`experience.${index}.position`}
                            defaultValue={exp.position}
                            placeholder="Job Title"
                          />
                        </p>
                      </div>
                      <span className="date-range">
                        <EditableField 
                          fieldPath={`experience.${index}.startDate`}
                          defaultValue={exp.startDate}
                          placeholder="Start Date"
                        />
                        {exp.startDate && exp.endDate ? ' - ' : ''}
                        <EditableField 
                          fieldPath={`experience.${index}.endDate`}
                          defaultValue={exp.endDate}
                          placeholder="End Date"
                        />
                      </span>
                    </div>
                    {exp.description && (
                      <p className="description">
                        <EditableField 
                          fieldPath={`experience.${index}.description`}
                          defaultValue={exp.description}
                          multiline={true}
                          placeholder="Describe your responsibilities..."
                        />
                      </p>
                    )}
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
                      <EditableField 
                        fieldPath={`skills.${index}.name`}
                        defaultValue={skill.name}
                        placeholder="Skill name"
                      />
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
                    <h3>
                      <EditableField 
                        fieldPath={`projects.${index}.name`}
                        defaultValue={project.name}
                        placeholder="Project Name"
                      />
                    </h3>
                    {project.technologies && (
                      <p className="technologies">
                        Technologies: <EditableField 
                          fieldPath={`projects.${index}.technologies`}
                          defaultValue={project.technologies}
                          placeholder="Technologies used"
                        />
                      </p>
                    )}
                    {project.description && (
                      <p className="description">
                        <EditableField 
                          fieldPath={`projects.${index}.description`}
                          defaultValue={project.description}
                          multiline={true}
                          placeholder="Project description..."
                        />
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="resume-builder-container">
      <header className="resume-header">
        <div className="logo-section">
          <h1 className="logo">ResumeBuilder</h1>
          <span className="logo-subtitle">
            {location.state?.templateName ? `Editing: ${location.state.templateName}` : 'Professional Resume Builder'}
          </span>
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
      
      <div className="content1">
        <div className="sidebar-container1">
          <div className="tab-navigation1">
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
          
          <form className="sidebar1" onSubmit={handleSubmit(onSubmit)}>
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
            <h3>Live Preview - {selectedTemplate.charAt(0).toUpperCase() + selectedTemplate.slice(1)} Template</h3>
            <div className="preview-controls">
              <button className="preview-zoom" onClick={zoomOut} title="Zoom Out">
                −
              </button>
              <span 
                className="preview-scale" 
                onClick={resetZoom}
                title="Click to reset to 100%"
                style={{cursor: 'pointer'}}
              >
                {Math.round(previewScale * 100)}%
              </span>
              <button className="preview-zoom" onClick={zoomIn} title="Zoom In">
                +
              </button>
            </div>
          </div>
          <div className="preview-content">
            <div 
              ref={resumeRef}
              style={{
                transform: `scale(${previewScale})`,
                transformOrigin: 'top center',
                transition: 'transform 0.2s ease',
                width: 'fit-content',
                margin: '0 auto'
              }}
            >
              {renderTemplate()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;