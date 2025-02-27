import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, ArrowLeft, SortAsc, SortDesc, Filter } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

function CoursesList() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
  const [filterYear, setFilterYear] = useState('');
  const [filterSemester, setFilterSemester] = useState('');
  const [availableYears, setAvailableYears] = useState([]);
  const [availableSemesters, setAvailableSemesters] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/courses');
        if (response.data.success) {
          const coursesData = response.data.courses;
          setCourses(coursesData);
          setFilteredCourses(coursesData);
          
          // Extract unique years and semesters for filters
          const years = [...new Set(coursesData.map(course => course.year))];
          const semesters = [...new Set(coursesData.map(course => course.semester))];
          
          setAvailableYears(years);
          setAvailableSemesters(semesters);
        } else {
          toast.error('Error fetching courses');
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        toast.error('Error connecting to server');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Handle filtering and sorting
  useEffect(() => {
    let result = [...courses];
    
    // Apply year filter
    if (filterYear) {
      result = result.filter(course => course.year === filterYear);
    }
    
    // Apply semester filter
    if (filterSemester) {
      result = result.filter(course => course.semester === filterSemester);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      const comparison = a.courseId.localeCompare(b.courseId);
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    setFilteredCourses(result);
  }, [courses, filterYear, filterSemester, sortOrder]);

  const handleSortToggle = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleYearFilter = (year) => {
    setFilterYear(filterYear === year ? '' : year);
  };

  const handleSemesterFilter = (semester) => {
    setFilterSemester(filterSemester === semester ? '' : semester);
  };

  const clearFilters = () => {
    setFilterYear('');
    setFilterSemester('');
  };

  return (
    <div className="min-vh-100 bg-light">
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
              <h1 className="text-white mb-0 fs-5 fw-semibold">Course Management System</h1>
            </div>
          </div>
        </div>
      </header>
      
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Link to="/" className="btn-back">
            <ArrowLeft size={16} className="me-2" />
            Back to Home
          </Link>
          <h2 className="page-title mb-0">Available Courses</h2>
          <div style={{ width: '110px' }}></div> {/* For balance */}
        </div>

        {/* Filters and Sort Controls */}
        {!isLoading && courses.length > 0 && (
          <div className="filter-controls mb-4">
            <div className="row align-items-center">
              <div className="col-md-3">
                <div className="filter-group">
                  <label className="filter-label">
                    <Filter size={14} className="me-1" />
                    Filter by Year
                  </label>
                  <div className="filter-options">
                    {availableYears.map(year => (
                      <button 
                        key={year} 
                        className={`filter-btn ${filterYear === year ? 'active' : ''}`}
                        onClick={() => handleYearFilter(year)}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="col-md-3">
                <div className="filter-group">
                  <label className="filter-label">
                    <Filter size={14} className="me-1" />
                    Filter by Semester
                  </label>
                  <div className="filter-options">
                    {availableSemesters.map(semester => (
                      <button 
                        key={semester} 
                        className={`filter-btn ${filterSemester === semester ? 'active' : ''}`}
                        onClick={() => handleSemesterFilter(semester)}
                      >
                        {semester}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="col-md-3">
                <button className="sort-btn" onClick={handleSortToggle}>
                  {sortOrder === 'asc' ? (
                    <><SortAsc size={14} className="me-1" /> Sort Ascending</>
                  ) : (
                    <><SortDesc size={14} className="me-1" /> Sort Descending</>
                  )}
                </button>
              </div>
              
              <div className="col-md-3 text-end">
                {(filterYear || filterSemester) && (
                  <button className="clear-btn" onClick={clearFilters}>
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner"></div>
            <p className="mt-3 text-secondary">Loading courses...</p>
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="row g-4">
            {filteredCourses.map((course) => (
              <div key={course.courseId} className="col-md-6 col-lg-4">
                <div className="course-card">
                  <div className="p-4">
                    <h3 className="course-name">{course.courseName}</h3>
                    <div className="course-id">{course.courseId}</div>
                    <div className="mt-3 mb-3">
                      <span className="tag tag-year">{course.year}</span>
                      <span className="tag tag-semester">{course.semester} Semester</span>
                      <span className="tag tag-category">{course.courseCategory}</span>
                    </div>
                    <Link to={`/preview/${course.courseId}`} className="btn-view">
                      <span>View Details</span>
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-5">
            {courses.length > 0 ? (
              <>
                <p className="text-secondary mb-3">No courses match your filters.</p>
                <button className="btn-create" onClick={clearFilters}>
                  Clear Filters
                </button>
              </>
            ) : (
              <>
                <p className="text-secondary mb-3">No courses available.</p>
                <Link to="/create-course" className="btn-create">
                  Create your first course
                </Link>
              </>
            )}
          </div>
        )}
      </div>
      
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        
        /* Variables */
        :root {
          --primary-color: #4169e1;
          --accent-color: #FF0000;
          --text-dark: #333333;
          --text-medium: #555555;
          --text-light: #777777;
          --border-color: #e6e6e6;
          --shadow-color: rgba(0, 0, 0, 0.04);
          --hover-shadow: rgba(0, 0, 0, 0.08);
        }
        
        /* Global styles */
        body {
          font-family: 'Inter', sans-serif;
          color: var(--text-dark);
          background-color: #f8f9fa;
        }
        
        .bg-primary {
          background-color: var(--primary-color) !important;
        }
        
        /* Page title */
        .page-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--text-dark);
        }
        
        /* Back button */
        .btn-back {
          display: inline-flex;
          align-items: center;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--primary-color);
          text-decoration: none;
          padding: 0.5rem 0.8rem;
          border-radius: 4px;
          transition: all 0.2s;
        }
        
        .btn-back:hover {
          background-color: rgba(65, 105, 225, 0.1);
          transform: translateX(-2px);
        }
        
        /* Filter controls */
        .filter-controls {
          background-color: white;
          border-radius: 8px;
          padding: 1rem;
          box-shadow: 0 2px 8px var(--shadow-color);
        }
        
        .filter-group {
          margin-bottom: 0.5rem;
        }
        
        .filter-label {
          display: flex;
          align-items: center;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-medium);
          margin-bottom: 0.5rem;
        }
        
        .filter-options {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        
        .filter-btn {
          background-color: #f8f9fa;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          padding: 0.35rem 0.7rem;
          font-size: 0.8rem;
          color: var(--text-medium);
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .filter-btn:hover {
          background-color: #f0f0f0;
        }
        
        .filter-btn.active {
          background-color: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
        }
        
        .sort-btn, .clear-btn {
          background-color: white;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          padding: 0.5rem 1rem;
          font-size: 0.85rem;
          display: inline-flex;
          align-items: center;
          color: var(--text-medium);
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .sort-btn:hover {
          background-color: #f0f0f0;
        }
        
        .clear-btn {
          color: var(--accent-color);
          border-color: var(--accent-color);
          background-color: white;
        }
        
        .clear-btn:hover {
          background-color: #fff0f0;
        }
        
        /* Course card */
        .course-card {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 12px var(--shadow-color);
          transition: all 0.25s ease;
          height: 100%;
        }
        
        .course-card:hover {
          box-shadow: 0 6px 20px var(--hover-shadow);
          transform: translateY(-3px);
        }
        
        .course-name {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-dark);
          margin-bottom: 0.5rem;
          line-height: 1.4;
        }
        
        .course-id {
          font-size: 0.85rem;
          color: var(--text-light);
          margin-bottom: 0.5rem;
        }
        
        /* Tags */
        .tag {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 500;
          padding: 0.25rem 0.6rem;
          border-radius: 4px;
          margin-right: 0.5rem;
          margin-bottom: 0.5rem;
        }
        
        .tag-year {
          background-color: #EBF2FF;
          color: var(--primary-color);
        }
        
        .tag-semester {
          background-color: #F0F0F0;
          color: #606060;
        }
        
        .tag-category {
          background-color: #FFF0F0;
          color: var(--accent-color);
        }
        
        /* View button */
        .btn-view {
          display: inline-flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 0.6rem 1rem;
          background-color: var(--accent-color);
          color: white;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 500;
          font-size: 0.9rem;
          transition: all 0.2s;
          margin-top: 0.5rem;
        }
        
        .btn-view:hover {
          background-color: #e60000;
          transform: translateX(2px);
        }
        
        /* Create button */
        .btn-create {
          display: inline-block;
          padding: 0.6rem 1.5rem;
          background-color: var(--accent-color);
          color: white;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 500;
          font-size: 0.9rem;
          transition: all 0.2s;
        }
        
        .btn-create:hover {
          background-color: #e60000;
        }
        
        /* Spinner */
        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(65, 105, 225, 0.2);
          border-radius: 50%;
          border-top-color: var(--primary-color);
          animation: spin 1s ease-in-out infinite;
          margin: 0 auto;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .filter-controls .row > div {
            margin-bottom: 1rem;
          }
        }
      `}</style>
    </div>
  );
}

export default CoursesList;