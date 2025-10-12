import React, { useState, useRef, useEffect } from "react";
import "../../../assets/styles/Project.css"

function Projects() {
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: "E-Commerce Platform",
      description: "A full-stack e-commerce platform built with React, Node.js, and MongoDB. Features include user authentication, product management, shopping cart, payment integration, and admin dashboard.",
      techStack: ["React", "Node.js", "MongoDB", "Express", "Stripe", "JWT"],
      liveLink: "https://ecommerce-demo.vercel.app",
      githubLink: "https://github.com/user/ecommerce-platform",
      coverImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop",
      status: "completed",
      dateCreated: "2024-01-15",
      featured: true
    },
    {
      id: 2,
      title: "Task Management App",
      description: "A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features. Built with modern web technologies.",
      techStack: ["Vue.js", "Socket.io", "PostgreSQL", "Redis", "Docker"],
      liveLink: "https://taskmanager-demo.vercel.app",
      githubLink: "https://github.com/user/task-manager",
      coverImage: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop",
      status: "in-progress",
      dateCreated: "2024-02-01",
      featured: false
    },
    {
      id: 3,
      title: "Weather Dashboard",
      description: "A responsive weather dashboard that displays current weather conditions, forecasts, and interactive maps. Includes location-based weather alerts and historical data visualization.",
      techStack: ["React", "TypeScript", "Chart.js", "OpenWeather API", "Tailwind CSS"],
      liveLink: "https://weather-dashboard.vercel.app",
      githubLink: "https://github.com/user/weather-dashboard",
      coverImage: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800&h=400&fit=crop",
      status: "completed",
      dateCreated: "2023-12-10",
      featured: true
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    techStack: "",
    liveLink: "",
    githubLink: "",
    coverImage: "",
    status: "in-progress"
  });

  // Animation effects
  useEffect(() => {
    const cards = document.querySelectorAll('.project-card');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0)';
            }, index * 100);
          }
        });
      },
      { threshold: 0.1 }
    );

    cards.forEach(card => observer.observe(card));
    return () => observer.disconnect();
  }, [projects]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          coverImage: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProject = {
      id: editingProject ? editingProject.id : Date.now(),
      ...formData,
      techStack: formData.techStack.split(',').map(tech => tech.trim()).filter(tech => tech),
      dateCreated: editingProject ? editingProject.dateCreated : new Date().toISOString().split('T')[0],
      featured: false
    };

    if (editingProject) {
      setProjects(prev => prev.map(project => 
        project.id === editingProject.id ? newProject : project
      ));
    } else {
      setProjects(prev => [newProject, ...prev]);
    }

    setFormData({
      title: "",
      description: "",
      techStack: "",
      liveLink: "",
      githubLink: "",
      coverImage: "",
      status: "in-progress"
    });
    setShowCreateForm(false);
    setEditingProject(null);
  };

  const handleEdit = (project) => {
    setFormData({
      title: project.title,
      description: project.description,
      techStack: project.techStack.join(', '),
      liveLink: project.liveLink,
      githubLink: project.githubLink,
      coverImage: project.coverImage,
      status: project.status
    });
    setEditingProject(project);
    setShowCreateForm(true);
  };

  const handleDelete = (projectId) => {
    setProjects(prev => prev.filter(project => project.id !== projectId));
  };

  const toggleFeatured = (projectId) => {
    setProjects(prev => prev.map(project => 
      project.id === projectId ? { ...project, featured: !project.featured } : project
    ));
  };

  const filteredProjects = projects
    .filter(project => {
      if (filter === "all") return true;
      if (filter === "featured") return project.featured;
      return project.status === filter;
    })
    .filter(project => 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.techStack.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.dateCreated) - new Date(a.dateCreated);
      if (sortBy === "oldest") return new Date(a.dateCreated) - new Date(b.dateCreated);
      if (sortBy === "title") return a.title.localeCompare(b.title);
      return 0;
    });

  const ProjectCard = ({ project }) => (
    <div className="project-card" key={project.id} style={{ animationDelay: `${projects.indexOf(project) * 0.1}s` }}>
      <div className="project-cover">
        <img src={project.coverImage} alt={project.title} />
        <div className="project-overlay">
          <div className="project-actions">
            <button 
              className="action-btn edit-btn"
              onClick={() => handleEdit(project)}
              title="Edit Project"
            >
              <i className="fas fa-edit"></i>
            </button>
            <button 
              className="action-btn delete-btn"
              onClick={() => handleDelete(project.id)}
              title="Delete Project"
            >
              <i className="fas fa-trash"></i>
            </button>
            <button 
              className={`action-btn star-btn ${project.featured ? 'featured' : ''}`}
              onClick={() => toggleFeatured(project.id)}
              title={project.featured ? "Remove from Featured" : "Add to Featured"}
            >
              <i className="fas fa-star"></i>
            </button>
          </div>
        </div>
        <div className="project-status">
          <span className={`status-badge ${project.status}`}>
            {project.status === 'completed' ? 'Completed' : 'In Progress'}
          </span>
          {project.featured && <span className="featured-badge">Featured</span>}
        </div>
      </div>
      
      <div className="project-content">
        <h3 className="project-title">{project.title}</h3>
        <p className="project-description">{project.description}</p>
        
        <div className="tech-stack">
          {project.techStack.map((tech, index) => (
            <span key={index} className="tech-tag">{tech}</span>
          ))}
        </div>
        
        <div className="project-links">
          <a 
            href={project.liveLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="link-btn live-link"
          >
            <i className="fas fa-external-link-alt"></i>
            Live Demo
          </a>
          <a 
            href={project.githubLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="link-btn github-link"
          >
            <i className="fab fa-github"></i>
            GitHub
          </a>
        </div>
        
        <div className="project-meta">
          <span className="project-date">
            <i className="fas fa-calendar"></i>
            {new Date(project.dateCreated).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="projects-page">
      <div className="projects-header">
        <div className="header-content">
          <h1 className="page-title">
            <i className="fas fa-laptop-code"></i>
            My Projects
          </h1>
          <p className="page-subtitle">
            Showcase your work and demonstrate your skills to potential employers
          </p>
        </div>
        <button 
          className="create-project-btn"
          onClick={() => setShowCreateForm(true)}
        >
          <i className="fas fa-plus"></i>
          Add New Project
        </button>
      </div>

      <div className="projects-controls">
        <div className="search-section">
          <div className="search-bar">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search projects, technologies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="filter-section">
          <div className="filter-group">
            <label>Filter:</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All Projects</option>
              <option value="featured">Featured</option>
              <option value="completed">Completed</option>
              <option value="in-progress">In Progress</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Sort by:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title A-Z</option>
            </select>
          </div>
        </div>
      </div>

      <div className="projects-grid">
        {filteredProjects.map(project => (
          <ProjectCard project={project} />
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="empty-state">
          <i className="fas fa-folder-open"></i>
          <h3>No projects found</h3>
          <p>Try adjusting your search or create a new project to get started.</p>
          <button 
            className="create-first-btn"
            onClick={() => setShowCreateForm(true)}
          >
            Create Your First Project
          </button>
        </div>
      )}

      {showCreateForm && (
        <div className="modal-overlay" onClick={() => setShowCreateForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProject ? 'Edit Project' : 'Create New Project'}</h2>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowCreateForm(false);
                  setEditingProject(null);
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="project-form">
              <div className="form-group">
                <label htmlFor="title">Project Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter project title"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your project, its features, and what you learned"
                  rows="4"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="techStack">Tech Stack</label>
                <input
                  type="text"
                  id="techStack"
                  name="techStack"
                  value={formData.techStack}
                  onChange={handleInputChange}
                  placeholder="React, Node.js, MongoDB (comma separated)"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="liveLink">Live Demo URL</label>
                  <input
                    type="url"
                    id="liveLink"
                    name="liveLink"
                    value={formData.liveLink}
                    onChange={handleInputChange}
                    placeholder="https://your-project.vercel.app"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="githubLink">GitHub Repository</label>
                  <input
                    type="url"
                    id="githubLink"
                    name="githubLink"
                    value={formData.githubLink}
                    onChange={handleInputChange}
                    placeholder="https://github.com/username/repo"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="status">Project Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="coverImage">Cover Image</label>
                <div className="image-upload-section">
                  <input
                    type="file"
                    id="coverImage"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                  <button
                    type="button"
                    className="upload-btn"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <i className="fas fa-upload"></i>
                    Choose Cover Image
                  </button>
                  {formData.coverImage && (
                    <div className="image-preview">
                      <img src={formData.coverImage} alt="Preview" />
                      <button
                        type="button"
                        className="remove-image"
                        onClick={() => setFormData(prev => ({ ...prev, coverImage: "" }))}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingProject(null);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {editingProject ? 'Update Project' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Projects; 
