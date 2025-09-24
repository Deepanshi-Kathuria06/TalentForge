import React, { useState, useEffect } from "react";
import "../ResumeBuilder/saveddesign.css";
import { useNavigate } from "react-router-dom";  


import ModernResume from "../Templates/ModernResume";
import ClassicResume from "../Templates/ClassicResume";

const SavedDesigns = () => {
  const navigate = useNavigate(); 

  const [activeTab, setActiveTab] = useState("templates");
  
  const [savedDesigns, setSavedDesigns] = useState([
    { 
      id: 102, 
      name: "Job Application", 
      lastEdited: "1 week ago",
      template: "classic",
      tags: ["Corporate", "Formal"]
    },
  ]);

  const [templates] = useState([
    { 
      id: 1, 
      name: "Modern Resume", 
      category: "Popular",
      component: <ModernResume previewMode={true} />
    },
    { 
      id: 2, 
      name: "Classic Resume", 
      category: "Professional",
      component: <ClassicResume previewMode={true} />
    },
  ]);

  const [categories] = useState(["All", "Professional", "Popular"]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [filteredTemplates, setFilteredTemplates] = useState(templates);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  useEffect(() => {
    if (activeCategory === "All") {
      setFilteredTemplates(templates);
    } else {
      setFilteredTemplates(templates.filter(tpl => tpl.category === activeCategory));
    }
  }, [activeCategory, templates]);

  const filteredAndSortedDesigns = savedDesigns
    .filter(design => 
      design.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      design.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === "recent") {
        return b.id - a.id;
      } else if (sortBy === "oldest") {
        return a.id - b.id;
      } else if (sortBy === "a-z") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

  const mostRecentDesign = filteredAndSortedDesigns.length > 0 ? filteredAndSortedDesigns[0] : null;

  const createGlitterParticles = () => {
    const particles = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        id: i,
        size: Math.random() * 8 + 2,
        left: Math.random() * 100,
        animationDelay: Math.random() * 5,
        animationDuration: Math.random() * 3 + 3
      });
    }
    return particles;
  };

  const [glitterParticles] = useState(createGlitterParticles());

  const handleDeleteDesign = (id) => {
    setSavedDesigns(savedDesigns.filter(design => design.id !== id));
  };

  return (
    <div className="saved-designs-container">
      {/* Hero Section */}
      <section className="saved-designs-hero">
        <div className="saved-designs-hero-content">
          <h1>Design Resumes That Get Noticed</h1>
          <p>Create, edit, and manage professional resumes that stand out from the crowd</p>
          <button 
            className="saved-designs-btn-hero-primary"
            onClick={() => navigate("../ResumeBuilder/resumeEditor")}
          >
            Create New Resume
          </button>
        </div>
        
        <div className="saved-designs-glitter-overlay">
          {glitterParticles.map(particle => (
            <div 
              key={particle.id}
              className="saved-designs-glitter-particle"
              style={{
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                left: `${particle.left}%`,
                animationDelay: `${particle.animationDelay}s`,
                animationDuration: `${particle.animationDuration}s`
              }}
            ></div>
          ))}
        </div>

        <div className="saved-designs-hero-shape saved-designs-hero-shape-1"></div>
        <div className="saved-designs-hero-shape saved-designs-hero-shape-2"></div>
        <div className="saved-designs-hero-shape saved-designs-hero-shape-3"></div>
      </section>

      {/* Tabs */}
      <div className="saved-designs-tabs-container">
        <div className="saved-designs-tabs">
          <button 
            className={`saved-designs-tab ${activeTab === 'templates' ? 'saved-designs-tab-active' : ''}`}
            onClick={() => setActiveTab('templates')}
          >
            <i className="fas fa-bookmark"></i> Explore Templates
          </button>
          <button 
            className={`saved-designs-tab ${activeTab === 'saved' ? 'saved-designs-tab-active' : ''}`}
            onClick={() => setActiveTab('saved')}
          >
            <i className="fas fa-save"></i> My Saved Designs
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="saved-designs-main-content">
        {activeTab === 'saved' ? (
          /* Saved Designs Tab */
          <section className="saved-designs-section">
            <div className="saved-designs-section-header">
              <h2>Your Saved Designs</h2>
              <div className="saved-designs-controls">
                <div className="saved-designs-search-bar">
                  <i className="fas fa-search"></i>
                  <input 
                    type="text" 
                    placeholder="Search saved designs..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <select 
                  className="saved-designs-sort-dropdown"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="recent">Sort by: Recent</option>
                  <option value="oldest">Sort by: Oldest</option>
                  <option value="a-z">Sort by: A-Z</option>
                </select>
              </div>
            </div>
            
            {filteredAndSortedDesigns.length > 0 ? (
              <>
                {mostRecentDesign && (
                  <div className="saved-designs-highlighted-design">
                    <div className="saved-designs-highlighted-badge">
                      <i className="fas fa-thumbtack"></i> Continue where you left off
                    </div>
                    <div className="saved-designs-design-card saved-designs-highlighted">
                      <div className="saved-designs-card-image">
                        <div className={`saved-designs-template-preview ${mostRecentDesign.template}-resume`}>
                          {mostRecentDesign.template === "modern" && <ModernResume previewMode={true} />}
                          {mostRecentDesign.template === "classic" && <ClassicResume previewMode={true} />}
                        </div>
                        <div className="saved-designs-card-overlay">
                          <button className="saved-designs-btn-card-primary">
                            <i className="fas fa-edit"></i> Edit
                          </button>
                          <button className="saved-designs-btn-card-secondary">
                            <i className="fas fa-eye"></i> Preview
                          </button>
                          <button 
                            className="saved-designs-btn-card-danger"
                            onClick={() => handleDeleteDesign(mostRecentDesign.id)}
                          >
                            <i className="fas fa-trash"></i> Delete
                          </button>
                        </div>
                      </div>
                      <div className="saved-designs-card-info">
                        <h4>{mostRecentDesign.name}</h4>
                        <p className="saved-designs-last-edited">Last edited: {mostRecentDesign.lastEdited}</p>
                        <div className="saved-designs-tags">
                          {mostRecentDesign.tags.map((tag, index) => (
                            <span key={index} className="saved-designs-tag">{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="saved-designs-grid">
                  {filteredAndSortedDesigns.slice(1).map(design => (
                    <div key={design.id} className="saved-designs-design-card">
                      <div className="saved-designs-card-image">
                        <div className={`saved-designs-template-preview ${design.template}-resume`}>
                          {design.template === "modern" && <ModernResume previewMode={true} />}
                          {design.template === "classic" && <ClassicResume previewMode={true} />}
                        </div>
                        <div className="saved-designs-card-overlay">
                          <button className="saved-designs-btn-card-primary">
                            <i className="fas fa-edit"></i> Edit
                          </button>
                          <button className="saved-designs-btn-card-secondary">
                            <i className="fas fa-eye"></i> Preview
                          </button>
                          <button 
                            className="saved-designs-btn-card-danger"
                            onClick={() => handleDeleteDesign(design.id)}
                          >
                            <i className="fas fa-trash"></i> Delete
                          </button>
                        </div>
                      </div>
                      <div className="saved-designs-card-info">
                        <h4>{design.name}</h4>
                        <p className="saved-designs-last-edited">Last edited: {design.lastEdited}</p>
                        <div className="saved-designs-tags">
                          {design.tags.map((tag, index) => (
                            <span key={index} className="saved-designs-tag">{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="saved-designs-empty-state">
                <div className="saved-designs-empty-icon">
                  <i className="fas fa-file-alt"></i>
                </div>
                <h3>No saved designs yet</h3>
                <p>Create your first resume to get started</p>
                <button className="saved-designs-btn-primary" onClick={() => navigate("../ResumeBuilder/resumeEditor")}>
                  Create Resume
                </button>
              </div>
            )}
          </section>
        ) : (
          <section className="saved-designs-templates-section">
            <div className="saved-designs-section-header">
              <h2>Explore Templates</h2>
              <div className="saved-designs-category-filter">
                {categories.map(category => (
                  <button
                    key={category}
                    className={`saved-designs-filter-btn ${activeCategory === category ? 'saved-designs-filter-btn-active' : ''}`}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="saved-designs-templates-grid">
              {filteredTemplates.map(template => (
                <div key={template.id} className="saved-designs-template-card">
                  <div className="saved-designs-template-preview">
                    {template.component}
                  </div>
                  <div className="saved-designs-template-info">
                    <h4>{template.name}</h4>
                    <span className="saved-designs-template-category">{template.category}</span>
                    <button className="saved-designs-btn-use-template">Use This Template</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default SavedDesigns;
