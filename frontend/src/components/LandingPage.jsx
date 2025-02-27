import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, BookOpen, FileText, Plus } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

function LandingPage() {
  const navigate = useNavigate();

  const handleCreateCourse = () => {
    navigate('/create-course');
  };

  const handleModuleDetails = () => {
    navigate('/module-details');
  };
  
  const handlePreviewCourses = () => {
    navigate('/courses-list');
  };

  return (
    <div className="min-vh-100 bg-white">
      <Toaster />
      
      {/* Header with university branding */}
      <header className="bg-primary">
        <div className="container-fluid px-4 py-2">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <img 
                src="/university-logo.jpg" 
                alt="University Logo" 
                style={{ height: '45px' }}
                className="me-3"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <h1 className="text-white mb-0 fs-4 fw-semibold font-title">Course Management System</h1>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <div className="container my-5">
        <div className="text-center mb-5">
          <h2 className="fw-bold font-title fs-1">Course Content Management Portal</h2>
        </div>

        <div className="row g-4 justify-content-center">
          {/* Create New Course Card */}
          <div className="col-md-4">
            <div className="card vignan-card">
              <div className="card-body text-center">
                <div className="icon-container">
                  <Book strokeWidth={1.5} />
                </div>
                <h3 className="card-title font-title">Create New Course</h3>
                <p className="card-text font-body">
                  Design a new course with comprehensive details including learning outcomes, textbooks, and skill development.
                </p>
                <button
                  onClick={handleCreateCourse}
                  className="btn vignan-btn font-btn"
                >
                  <Plus className="me-2" style={{ width: '1rem', height: '1rem' }} />
                  Create Course
                </button>
              </div>
            </div>
          </div>

          {/* Add Module Details Card */}
          <div className="col-md-4">
            <div className="card vignan-card">
              <div className="card-body text-center">
                <div className="icon-container">
                  <FileText strokeWidth={1.5} />
                </div>
                <h3 className="card-title font-title">Add Module Details</h3>
                <p className="card-text font-body">
                  Structure your course into modules with specific unit contents, reference materials, and practical activities.
                </p>
                <button
                  onClick={handleModuleDetails}
                  className="btn vignan-btn font-btn"
                >
                  Add Modules
                </button>
              </div>
            </div>
          </div>

          {/* Preview Courses Card */}
          <div className="col-md-4">
            <div className="card vignan-card">
              <div className="card-body text-center">
                <div className="icon-container">
                  <BookOpen strokeWidth={1.5} />
                </div>
                <h3 className="card-title font-title">View Courses</h3>
                <p className="card-text font-body">
                  Access and review existing courses, generate syllabi, and ensure curriculum alignment with program objectives.
                </p>
                <button
                  onClick={handlePreviewCourses}
                  className="btn vignan-btn font-btn"
                >
                  Browse Courses
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        /* Vignan's color scheme based on the logo */
        :root {
          --vignan-red: #FF0000;
          --vignan-blue: #4169e1;
          --vignan-light-blue: #e6ecff;
          --vignan-purple: #8A7EB5;
        }
        
        /* Typography */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }
        
        .font-title {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          letter-spacing: -0.01em;
        }
        
        .font-body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          font-size: 0.95rem;
          font-weight: 400;
          line-height: 1.6;
        }
        
        .font-btn {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          letter-spacing: 0.02em;
        }
        
        .vignan-card {
          border: none;
          border-radius: 10px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.07);
          transition: all 0.3s ease;
          overflow: hidden;
          height: 100%;
          background: #ffffff;
        }
        
        .vignan-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }
        
        .vignan-card .card-body {
          padding: 2.25rem 1.75rem;
        }
        
        .icon-container {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.75rem;
          width: 75px;
          height: 75px;
          background-color: var(--vignan-light-blue);
          border-radius: 50%;
          color: var(--vignan-blue);
        }
        
        .icon-container svg {
          width: 34px;
          height: 34px;
        }
        
        .vignan-card .card-title {
          font-size: 1.35rem;
          font-weight: 600;
          margin-bottom: 1.15rem;
          color: #262626;
        }
        
        .vignan-card .card-text {
          color: #505050;
          margin-bottom: 2rem;
        }
        
        .vignan-btn {
          background-color: var(--vignan-red);
          border: none;
          border-radius: 8px;
          color: white;
          padding: 0.6rem 1.75rem;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(255, 0, 0, 0.2);
        }
        
        .vignan-btn:hover {
          background-color: #e60000;
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(255, 0, 0, 0.25);
        }
        
        /* Make the primary color match Vignan's blue */
        .bg-primary {
          background-color: var(--vignan-blue) !important;
        }
      `}</style>
    </div>
  );
}

export default LandingPage;