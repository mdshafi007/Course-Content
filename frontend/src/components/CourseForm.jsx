import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, Plus, X } from 'lucide-react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

function CourseForm() {
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState({
    courseId: '',
    year: '',
    semester: '',
    courseName: '',
    courseCategory: '',
    courseType: '',
    lectureHours: 0,
    tutorialHours: 0,
    practicalHours: 0,
    selfLearningHours: 0,
    courseDescription: '',
    prerequisites: '',
    courseOutcomes: [{ outcome: '', bloomLevel: '' }],
    textbooks: [''],
    referenceBooks: [''],
    skills: ['']
  });

  const calculateCredits = () => {
    const { lectureHours, tutorialHours, practicalHours } = courseData;
    return lectureHours * 1 + tutorialHours * 0.5 + practicalHours * 0.5;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData(prev => ({
      ...prev,
      [name]: name.includes('Hours') ? Number(value) : value
    }));
  };

  const handleOutcomeChange = (index, field, value) => {
    const newOutcomes = [...courseData.courseOutcomes];
    newOutcomes[index] = { ...newOutcomes[index], [field]: value };
    setCourseData(prev => ({
      ...prev,
      courseOutcomes: newOutcomes
    }));
  };

  const addNewOutcome = () => {
    setCourseData(prev => ({
      ...prev,
      courseOutcomes: [...prev.courseOutcomes, { outcome: '', bloomLevel: '' }]
    }));
  };

  const removeOutcome = (index) => {
    if (courseData.courseOutcomes.length > 1) {
      setCourseData(prev => ({
        ...prev,
        courseOutcomes: prev.courseOutcomes.filter((_, i) => i !== index)
      }));
    }
  };

  const handleTextbookChange = (index, value) => {
    const newTextbooks = [...courseData.textbooks];
    newTextbooks[index] = value;
    setCourseData(prev => ({
      ...prev,
      textbooks: newTextbooks
    }));
  };

  const addNewTextbook = () => {
    setCourseData(prev => ({
      ...prev,
      textbooks: [...prev.textbooks, '']
    }));
  };

  const removeTextbook = (index) => {
    if (courseData.textbooks.length > 1) {
      setCourseData(prev => ({
        ...prev,
        textbooks: prev.textbooks.filter((_, i) => i !== index)
      }));
    }
  };

  const handleReferenceBookChange = (index, value) => {
    const newReferenceBooks = [...courseData.referenceBooks];
    newReferenceBooks[index] = value;
    setCourseData(prev => ({
      ...prev,
      referenceBooks: newReferenceBooks
    }));
  };

  const addNewReferenceBook = () => {
    setCourseData(prev => ({
      ...prev,
      referenceBooks: [...prev.referenceBooks, '']
    }));
  };

  const removeReferenceBook = (index) => {
    if (courseData.referenceBooks.length > 1) {
      setCourseData(prev => ({
        ...prev,
        referenceBooks: prev.referenceBooks.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSkillChange = (index, value) => {
    const newSkills = [...courseData.skills];
    newSkills[index] = value;
    setCourseData(prev => ({
      ...prev,
      skills: newSkills
    }));
  };

  const addNewSkill = () => {
    setCourseData(prev => ({
      ...prev,
      skills: [...prev.skills, '']
    }));
  };

  const removeSkill = (index) => {
    if (courseData.skills.length > 1) {
      setCourseData(prev => ({
        ...prev,
        skills: prev.skills.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const totalCredits = calculateCredits();
      const response = await axios.post('http://localhost:5000/api/courses', {
        ...courseData,
        credits: totalCredits
      });

      if (response.data.success) {
        toast.success('Your details are saved to database', {
          duration: 3000,
          position: 'top-right',
          style: {
            background: '#10B981',
            color: '#fff',
          },
        });
        
        navigate(`/module-details/${response.data.courseId}`);
      } else {
        toast.error('Error saving course');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error saving course: ' + error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Toaster />
      <div className="bg-white rounded-lg shadow-xl p-8">
        <div className="flex items-center justify-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Course Content Page</h1>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Course ID</label>
              <input
                type="text"
                name="courseId"
                value={courseData.courseId}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Year</label>
              <select
                name="year"
                value={courseData.year}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              >
                <option value="">Select Year</option>
                <option value="1st">1st Year</option>
                <option value="2nd">2nd Year</option>
                <option value="3rd">3rd Year</option>
                <option value="4th">4th Year</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Semester</label>
              <select
                name="semester"
                value={courseData.semester}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              >
                <option value="">Select Semester</option>
                <option value="1st">1st Semester</option>
                <option value="2nd">2nd Semester</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Course Name</label>
              <input
                type="text"
                name="courseName"
                value={courseData.courseName}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Course Category</label>
              <select
                name="courseCategory"
                value={courseData.courseCategory}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              >
                <option value="">Select Category</option>
                <option value="Basic sciences">Basic sciences</option>
                <option value="Basic engineering">Basic engineering</option>
                <option value="Potential core">Potential core</option>
                <option value="Department elective">Department elective</option>
                <option value="Open elective">Open elective</option>
                <option value="Add on course">Add on course</option>
                <option value="Minor">Minor</option>
                <option value="honour">Honour</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Course Type</label>
              <select
                name="courseType"
                value={courseData.courseType}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              >
                <option value="">Select Type</option>
                <option value="Skill based">Skill based</option>
                <option value="Entrepreneur">Entrepreneur</option>
                <option value="employment">Employment</option>
              </select>
            </div>

            <div className="flex space-x-4 sm:col-span-2">
              <div className="w-20">
                <label className="block text-sm font-medium text-gray-700">L Hours</label>
                <input
                  type="number"
                  name="lectureHours"
                  value={courseData.lectureHours}
                  onChange={handleInputChange}
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>

              <div className="w-20">
                <label className="block text-sm font-medium text-gray-700">T Hours</label>
                <input
                  type="number"
                  name="tutorialHours"
                  value={courseData.tutorialHours}
                  onChange={handleInputChange}
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>

              <div className="w-20">
                <label className="block text-sm font-medium text-gray-700">P Hours</label>
                <input
                  type="number"
                  name="practicalHours"
                  value={courseData.practicalHours}
                  onChange={handleInputChange}
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>

              <div className="w-20">
                <label className="block text-sm font-medium text-gray-700">SL Hours</label>
                <input
                  type="number"
                  name="selfLearningHours"
                  value={courseData.selfLearningHours}
                  onChange={handleInputChange}
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>

              <div className="w-24">
                <label className="block text-sm font-medium text-gray-700">Credits</label>
                <input
                  type="text"
                  value={calculateCredits()}
                  className="mt-1 block w-full rounded-md bg-gray-50 border-gray-300 shadow-sm sm:text-sm"
                  readOnly
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Course Description</label>
              <textarea
                name="courseDescription"
                value={courseData.courseDescription}
                onChange={handleInputChange}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Prerequisites</label>
              <textarea
                name="prerequisites"
                value={courseData.prerequisites}
                onChange={handleInputChange}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Course Outcomes</label>
              {courseData.courseOutcomes.map((outcome, index) => (
                <div key={index} className="flex mb-2 space-x-2">
                  <div className="flex-grow flex items-center">
                    <span className="mr-2 text-gray-600">{index + 1}.</span>
                    <input
                      type="text"
                      value={outcome.outcome}
                      onChange={(e) => handleOutcomeChange(index, 'outcome', e.target.value)}
                      className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder={`Course Outcome ${index + 1}`}
                      required
                    />
                  </div>
                  <select
                    value={outcome.bloomLevel}
                    onChange={(e) => handleOutcomeChange(index, 'bloomLevel', e.target.value)}
                    className="w-32 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  >
                    <option value="">Bloom's Level</option>
                    <option value="apply">Apply</option>
                    <option value="analyze">Analyze</option>
                    <option value="evaluate">Evaluate</option>
                  </select>
                  {courseData.courseOutcomes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeOutcome(index)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addNewOutcome}
                className="mt-2 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Outcome
              </button>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Textbooks</label>
              {courseData.textbooks.map((book, index) => (
                <div key={index} className="flex mb-2">
                  <div className="flex-grow flex items-center">
                    <span className="mr-2 text-gray-600">{index + 1}.</span>
                    <input
                      type="text"
                      value={book}
                      onChange={(e) => handleTextbookChange(index, e.target.value)}
                      className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder={`Textbook ${index + 1}`}
                      required
                    />
                  </div>
                  {courseData.textbooks.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTextbook(index)}
                      className="ml-2 text-gray-400 hover:text-red-500"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addNewTextbook}
                className="mt-2 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Textbook
              </button>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Reference Books</label>
              {courseData.referenceBooks.map((book, index) => (
                <div key={index} className="flex mb-2">
                  <div className="flex-grow flex items-center">
                    <span className="mr-2 text-gray-600">{index + 1}.</span>
                    <input
                      type="text"
                      value={book}
                      onChange={(e) => handleReferenceBookChange(index, e.target.value)}
                      className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder={`Reference Book ${index + 1}`}
                      required
                    />
                  </div>
                  {courseData.referenceBooks.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeReferenceBook(index)}
                      className="ml-2 text-gray-400 hover:text-red-500"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addNewReferenceBook}
                className="mt-2 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Reference Book
              </button>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
              {courseData.skills.map((skill, index) => (
                <div key={index} className="flex mb-2">
                  <div className="flex-grow flex items-center">
                    <span className="mr-2 text-gray-600">•</span>
                    <input
                      type="text"
                      value={skill}
                      onChange={(e) => handleSkillChange(index, e.target.value)}
                      className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder={`Skill ${index + 1}`}
                    />
                  </div>
                  {courseData.skills.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSkill(index)}
                      className="ml-2 text-gray-400 hover:text-red-500"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addNewSkill}
                className="mt-2 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Skill
              </button>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save Details
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CourseForm;