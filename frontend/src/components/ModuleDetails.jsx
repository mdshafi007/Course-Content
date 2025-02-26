import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { Search, Plus, X } from 'lucide-react';
import jsPDF from 'jspdf';

function ModuleDetails() {
  const { courseId: urlCourseId } = useParams();
  const navigate = useNavigate();
  const [courseIdInput, setCourseIdInput] = useState(urlCourseId || '');
  const [courseData, setCourseData] = useState(null);
  const [modules, setModules] = useState([
    {
      number: 1,
      units: [
        { name: '', selectedTextbook: '', pageFrom: 1, pageTo: 1, contents: '' },
        { name: '', selectedTextbook: '', pageFrom: 1, pageTo: 1, contents: '' }
      ],
      practices: [''],
      duration: 0
    },
    {
      number: 2,
      units: [
        { name: '', selectedTextbook: '', pageFrom: 1, pageTo: 1, contents: '' },
        { name: '', selectedTextbook: '', pageFrom: 1, pageTo: 1, contents: '' },
        { name: '', selectedTextbook: '', pageFrom: 1, pageTo: 1, contents: '' }
      ],
      practices: [''],
      duration: 0
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (urlCourseId) {
      fetchCourseData(urlCourseId);
    }
  }, [urlCourseId]);

  const fetchCourseData = async (id) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/courses/${id}`);
      if (response.data.success) {
        setCourseData(response.data.course);
        
        // If modules exist in the response, use them
        if (response.data.course.modules && response.data.course.modules.length > 0) {
          // Ensure each module has a practices array
          const updatedModules = response.data.course.modules.map(module => ({
            ...module,
            practices: module.practices || ['']
          }));
          setModules(updatedModules);
        }
        
        toast.success('Course details loaded successfully');
      } else {
        toast.error('Course not found');
      }
    } catch (error) {
      console.error('Error fetching course:', error);
      toast.error('Error fetching course details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (courseIdInput) {
      navigate(`/module-details/${courseIdInput}`);
      fetchCourseData(courseIdInput);
    } else {
      toast.error('Please enter a Course ID');
    }
  };

  const handleUnitChange = (moduleIndex, unitIndex, field, value) => {
    const newModules = [...modules];
    newModules[moduleIndex].units[unitIndex][field] = value;
    setModules(newModules);
  };

  const handleModuleDurationChange = (moduleIndex, value) => {
    const newModules = [...modules];
    newModules[moduleIndex].duration = value;
    setModules(newModules);
  };

  const handlePracticeChange = (moduleIndex, practiceIndex, value) => {
    const newModules = [...modules];
    newModules[moduleIndex].practices[practiceIndex] = value;
    setModules(newModules);
  };

  const addNewPractice = (moduleIndex) => {
    const newModules = [...modules];
    newModules[moduleIndex].practices.push('');
    setModules(newModules);
  };

  const removePractice = (moduleIndex, practiceIndex) => {
    const newModules = [...modules];
    if (newModules[moduleIndex].practices.length > 1) {
      newModules[moduleIndex].practices = newModules[moduleIndex].practices.filter(
        (_, index) => index !== practiceIndex
      );
      setModules(newModules);
    }
  };

  const handleSave = async () => {
    try {
      // First, get the current course data to combine with modules
      const currentCourse = courseData;
      
      if (!currentCourse) {
        toast.error('No course data available to save');
        return;
      }
      
      // Combine course data with modules
      const updatedCourse = {
        ...currentCourse,
        modules: modules
      };
      
      const response = await axios.put(`http://localhost:5000/api/courses/${currentCourse.courseId}`, updatedCourse);
      
      if (response.data.success) {
        toast.success('Course and module details saved successfully');
      } else {
        toast.error('Error saving details');
      }
    } catch (error) {
      console.error('Error saving data:', error);
      toast.error('Error saving details: ' + error.message);
    }
  };

  const handlePreview = () => {
    if (courseData) {
      navigate(`/preview/${courseData.courseId}`);
    } else {
      toast.error('No course data available to preview');
    }
  };

  const generatePDF = () => {
    if (!courseData) {
      toast.error('No course data available');
      return;
    }
  
    try {
      const doc = new jsPDF({
        unit: 'mm',
        format: 'a4',
        margins: { top: 20, right: 20, bottom: 20, left: 20 }
      });
  
      // Helper functions
      const safeText = (text) => text?.toString() || '';
      
      let currentY = 20;
      const leftMargin = 20;
      const pageWidth = 190;
  
      // Title - Centered, Bold
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      const titleText = `${safeText(courseData.courseId)} ${safeText(courseData.courseName)}`;
      const titleWidth = doc.getTextWidth(titleText);
      const titleX = (doc.internal.pageSize.getWidth() - titleWidth) / 2;
      doc.text(titleText, titleX, currentY);
      currentY += 15;
  
      // Hours Per Week - Right aligned
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      const hoursText = "Hours Per Week :";
      const hoursWidth = doc.getTextWidth(hoursText);
      doc.text(hoursText, doc.internal.pageSize.getWidth() - hoursWidth - 20, currentY);
      currentY += 6;
  
      // L T P SL C table - Right aligned with specific spacing
      const tableWidth = 50;
      const tableX = doc.internal.pageSize.getWidth() - tableWidth - 20;
      
      // Get values from courseData
      const values = [
        safeText(courseData.lectureHours || '3'),
        safeText(courseData.tutorialHours || '0'),
        safeText(courseData.practicalHours || '2'),
        safeText(courseData.selfLearningHours || '3'),
        safeText(courseData.credits || '4')
      ];
      
      // Column headers
      const headers = ['L', 'T', 'P', 'SL', 'C'];
      
      // Draw table with headers and values
      // First row - headers
      let xPos = tableX;
      doc.setFont("helvetica", "bold");
      headers.forEach((header, index) => {
        // Draw cell border
        doc.rect(xPos, currentY - 4, 10, 7);
        // Center text in cell
        doc.text(header, xPos + 5 - doc.getTextWidth(header)/2, currentY);
        xPos += 10;
      });
      currentY += 7;
      
      // Second row - values
      xPos = tableX;
      doc.setFont("helvetica", "normal");
      values.forEach((value, index) => {
        // Draw cell border
        doc.rect(xPos, currentY - 4, 10, 7);
        // Center text in cell
        doc.text(value, xPos + 5 - doc.getTextWidth(value)/2, currentY);
        xPos += 10;
      });
      currentY += 15;
  
      // Prerequisites - Bold heading with normal text
      doc.setFont("helvetica", "bold");
      doc.text("PREREQUISITE KNOWLEDGE:", leftMargin, currentY);
      doc.setFont("helvetica", "normal");
      doc.text(safeText(courseData.prerequisites), leftMargin + doc.getTextWidth("PREREQUISITE KNOWLEDGE: "), currentY);
      currentY += 10;
  
      // Course Description
      doc.setFont("helvetica", "bold");
      doc.text("COURSE DESCRIPTION & OBJECTIVES:", leftMargin, currentY);
      currentY += 10;
      doc.setFont("helvetica", "normal");
      const descriptionLines = doc.splitTextToSize(courseData.courseDescription, pageWidth - 20);
      doc.text(descriptionLines, leftMargin, currentY);
      currentY += (descriptionLines.length * 5) + 15;
  
      // Modules
      modules.forEach((module, moduleIndex) => {
        // Add page break if needed
        if (currentY > 250) {
          doc.addPage();
          currentY = 20;
        }
  
        // Module header - Centered
        doc.setFont("helvetica", "bold");
        const moduleTitle = `MODULE-${module.number}`;
        const moduleTitleWidth = doc.getTextWidth(moduleTitle);
        const moduleTitleX = (doc.internal.pageSize.getWidth() - moduleTitleWidth) / 2;
        doc.text(moduleTitle, moduleTitleX, currentY);
        
        // Module hours calculation - Right aligned on same line as module title
        const moduleHours = `${courseData.lectureHours}L+${courseData.tutorialHours}T+${courseData.practicalHours}P+${courseData.selfLearningHours}SL = ${module.duration} hours`;
        const moduleHoursWidth = doc.getTextWidth(moduleHours);
        doc.setFont("helvetica", "normal");
        doc.text(moduleHours, doc.internal.pageSize.getWidth() - moduleHoursWidth - 20, currentY);
        
        currentY += 12;
  
        // Units
        module.units.forEach((unit, unitIndex) => {
          if (currentY > 250) {
            doc.addPage();
            currentY = 20;
          }
  
          // Unit header
          doc.setFont("helvetica", "bold");
          doc.text(`UNIT-${unitIndex + 1}: ${unit.name}`, leftMargin, currentY);
          currentY += 8;
  
          // Unit content
          doc.setFont("helvetica", "normal");
          const contentLines = doc.splitTextToSize(unit.contents || "", pageWidth - 20);
          doc.text(contentLines, leftMargin, currentY);
          currentY += (contentLines.length * 5) + 10;
        });
  
        // Practices section if exists
        if (module.practices && module.practices.length > 0 && module.practices[0] !== '') {
          doc.setFont("helvetica", "bold");
          doc.text("PRACTICES:", leftMargin, currentY);
          currentY += 8;
          
          doc.setFont("helvetica", "normal");
          module.practices.forEach(practice => {
            if (practice.trim() !== '') {
              const practiceLines = doc.splitTextToSize(`• ${practice}`, pageWidth - 25);
              doc.text(practiceLines, leftMargin, currentY);
              currentY += (practiceLines.length * 5) + 4;
            }
          });
          
          currentY += 8;
        }
      });
  
      // Course Outcomes section
      if (currentY > 230) {
        doc.addPage();
        currentY = 20;
      }
  
      doc.setFont("helvetica", "bold");
      doc.text("COURSE OUTCOMES:", leftMargin, currentY);
      currentY += 8;
      doc.setFont("helvetica", "normal");
      doc.text("Upon successful completion of this course, students will be able to:", leftMargin, currentY);
      currentY += 10;
  
      // Course Outcomes table
      if (courseData.courseOutcomes && courseData.courseOutcomes.length > 0) {
        // Draw table headers
        const tableHeaders = ["CO No.", "Course Outcomes", "Bloom's\nLevel", "Mapping\nwith POs"];
        const columnWidths = [20, 100, 30, 30];
        
        // Draw table headers
        let tableX = leftMargin;
        
        // Draw table borders for headers
        doc.rect(tableX, currentY - 4, columnWidths[0], 12);
        doc.rect(tableX + columnWidths[0], currentY - 4, columnWidths[1], 12);
        doc.rect(tableX + columnWidths[0] + columnWidths[1], currentY - 4, columnWidths[2], 12);
        doc.rect(tableX + columnWidths[0] + columnWidths[1] + columnWidths[2], currentY - 4, columnWidths[3], 12);
        
        // Draw header text
        let headerX = leftMargin + 5;
        doc.setFont("helvetica", "bold");
        doc.text(tableHeaders[0], headerX, currentY);
        headerX += columnWidths[0];
        doc.text(tableHeaders[1], headerX, currentY);
        headerX += columnWidths[1];
        
        // Special handling for multiline headers
        const bloomsLines = doc.splitTextToSize(tableHeaders[2], columnWidths[2] - 5);
        doc.text(bloomsLines, headerX, currentY);
        headerX += columnWidths[2];
        
        const mappingLines = doc.splitTextToSize(tableHeaders[3], columnWidths[3] - 5);
        doc.text(mappingLines, headerX, currentY);
        
        currentY += 12;
        
        // Draw outcomes
        courseData.courseOutcomes.forEach((outcome, index) => {
          if (currentY > 250) {
            doc.addPage();
            currentY = 20;
          }
          
          // Calculate height needed for this row
          const outcomeLines = doc.splitTextToSize(outcome.outcome, columnWidths[1] - 5);
          const rowHeight = Math.max(outcomeLines.length * 5, 8) + 4;
          
          // Draw row borders
          let rowX = leftMargin;
          doc.rect(rowX, currentY - 4, columnWidths[0], rowHeight);
          doc.rect(rowX + columnWidths[0], currentY - 4, columnWidths[1], rowHeight);
          doc.rect(rowX + columnWidths[0] + columnWidths[1], currentY - 4, columnWidths[2], rowHeight);
          doc.rect(rowX + columnWidths[0] + columnWidths[1] + columnWidths[2], currentY - 4, columnWidths[3], rowHeight);
          
          // Draw cell content
          doc.setFont("helvetica", "normal");
          
          // CO Number
          doc.text((index + 1).toString(), rowX + 5, currentY);
          rowX += columnWidths[0];
          
          // Outcome text
          doc.text(outcomeLines, rowX + 5, currentY);
          rowX += columnWidths[1];
          
          // Bloom's Level
          doc.text(outcome.bloomLevel, rowX + 5, currentY);
          rowX += columnWidths[2];
          
          // PO Mapping
          if (outcome.mapping) {
            doc.text(outcome.mapping, rowX + 5, currentY);
          }
          
          currentY += rowHeight;
        });
      }
  
      // Textbooks section
      if (currentY > 230) {
        doc.addPage();
        currentY = 20;
      }
  
      doc.setFont("helvetica", "bold");
      doc.text("TEXT BOOK:", leftMargin, currentY);
      currentY += 8;
  
      doc.setFont("helvetica", "normal");
      if (courseData.textbooks && courseData.textbooks.length > 0) {
        courseData.textbooks.forEach((book, index) => {
          const bookLines = doc.splitTextToSize(`${index + 1}. ${book}`, pageWidth - 20);
          doc.text(bookLines, leftMargin, currentY);
          currentY += (bookLines.length * 5) + 4;
        });
      }
      currentY += 4;
  
      // Reference Books section
      if (currentY > 230) {
        doc.addPage();
        currentY = 20;
      }
  
      doc.setFont("helvetica", "bold");
      doc.text("REFERENCE BOOKS:", leftMargin, currentY);
      currentY += 8;
  
      doc.setFont("helvetica", "normal");
      if (courseData.referenceBooks && courseData.referenceBooks.length > 0) {
        courseData.referenceBooks.forEach((book, index) => {
          const bookLines = doc.splitTextToSize(`${index + 1}. ${book}`, pageWidth - 20);
          doc.text(bookLines, leftMargin, currentY);
          currentY += (bookLines.length * 5) + 4;
        });
      }
      
      // Skills section
      if (courseData.skills && courseData.skills.length > 0 && courseData.skills.some(skill => skill.trim() !== '')) {
        if (currentY > 230) {
          doc.addPage();
          currentY = 20;
        }
        
        currentY += 4;
        doc.setFont("helvetica", "bold");
        doc.text("SKILLS:", leftMargin, currentY);
        currentY += 8;
        
        doc.setFont("helvetica", "normal");
        courseData.skills.forEach((skill, index) => {
          if (skill.trim() !== '') {
            const skillLines = doc.splitTextToSize(`• ${skill}`, pageWidth - 25);
            doc.text(skillLines, leftMargin, currentY);
            currentY += (skillLines.length * 5) + 4;
          }
        });
      }
  
      doc.save(`${courseData.courseId}_syllabus.pdf`);
      toast.success('PDF generated successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Error generating PDF: ' + error.message);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Toaster />
      <div className="bg-white rounded-lg shadow-xl p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Module Details</h1>
          
          <form onSubmit={handleSearch} className="flex items-center space-x-2">
            <input
              type="text"
              value={courseIdInput}
              onChange={(e) => setCourseIdInput(e.target.value)}
              placeholder="Enter Course ID"
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <button
              type="submit"
              className="inline-flex items-center p-2 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Search className="h-5 w-5" />
            </button>
          </form>
        </div>
        
        {courseData ? (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">{courseData.courseName}</h2>
            <p className="text-sm text-gray-600 mb-1">Course ID: {courseData.courseId}</p>
            <p className="text-sm text-gray-600 mb-1">Year: {courseData.year}, Semester: {courseData.semester}</p>
            <p className="text-sm text-gray-600">Credits: {courseData.credits}</p>
          </div>
        ) : (
          <div className="mb-6 p-4 bg-gray-100 rounded-lg text-center">
            <p className="text-gray-500">Search for a course to load its details</p>
          </div>
        )}
        
        {courseData && modules.map((module, moduleIndex) => (
          <div key={moduleIndex} className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Module {module.number}</h2>
            {module.units.map((unit, unitIndex) => (
              <div key={unitIndex} className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium mb-3">Unit {unitIndex + 1}</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Unit Name</label>
                    <input 
                      type="text" 
                      value={unit.name} 
                      onChange={(e) => handleUnitChange(moduleIndex, unitIndex, 'name', e.target.value)} 
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Select Textbook</label>
                    <select 
                      value={unit.selectedTextbook} 
                      onChange={(e) => handleUnitChange(moduleIndex, unitIndex, 'selectedTextbook', e.target.value)} 
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" 
                      required
                    >
                      <option value="">Select a textbook</option>
                      {courseData && courseData.textbooks && courseData.textbooks.map((book, index) => (
                        <option key={index} value={book}>{book}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex space-x-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Page From</label>
                      <input 
                        type="number" 
                        min="1" 
                        value={unit.pageFrom} 
                        onChange={(e) => handleUnitChange(moduleIndex, unitIndex, 'pageFrom', parseInt(e.target.value))} 
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" 
                        required 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Page To</label>
                      <input 
                        type="number" 
                        min="1" 
                        value={unit.pageTo} 
                        onChange={(e) => handleUnitChange(moduleIndex, unitIndex, 'pageTo', parseInt(e.target.value))} 
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" 
                        required 
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Unit Contents</label>
                    <textarea 
                      value={unit.contents} 
                      onChange={(e) => handleUnitChange(moduleIndex, unitIndex, 'contents', e.target.value)} 
                      rows={4} 
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" 
                      required 
                    />
                  </div>
                </div>
              </div>
            ))}
            
            {/* Practices Section */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium mb-3">Practices</h3>
              <div className="space-y-3">
                {module.practices.map((practice, practiceIndex) => (
                  <div key={practiceIndex} className="flex items-center">
                    <span className="mr-2 text-gray-600">•</span>
                    <input
                      type="text"
                      value={practice}
                      onChange={(e) => handlePracticeChange(moduleIndex, practiceIndex, e.target.value)}
                      placeholder={`Practice ${practiceIndex + 1}`}
                      className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    {module.practices.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePractice(moduleIndex, practiceIndex)}
                        className="ml-2 text-gray-400 hover:text-red-500"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addNewPractice(moduleIndex)}
                  className="mt-3 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Practice
                </button>
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Module Duration (hours)</label>
              <input 
                type="number" 
                min="1" 
                value={module.duration} 
                onChange={(e) => handleModuleDurationChange(moduleIndex, parseInt(e.target.value))} 
                className="mt-1 block w-32 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" 
                required 
              />
            </div>
          </div>
        ))}
        
        <div className="flex justify-center space-x-4 mt-8">
          <button
            onClick={handleSave}
            disabled={!courseData}
            className={`inline-flex justify-center py-2 px-4 text-white rounded-md ${courseData ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-400 cursor-not-allowed'}`}
          >
            Save
          </button>
          <button
            onClick={handlePreview}
            disabled={!courseData}
            className={`inline-flex justify-center py-2 px-4 rounded-md ${courseData ? 'text-gray-700 bg-white hover:bg-gray-50' : 'text-gray-400 bg-gray-100 cursor-not-allowed'}`}
          >
            Preview
          </button>
          <button
            onClick={generatePDF}
            disabled={!courseData}
            className={`inline-flex justify-center py-2 px-4 text-white rounded-md ${courseData ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`}
          >
            Generate PDF
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModuleDetails;