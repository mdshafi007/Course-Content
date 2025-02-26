import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';

function CoursePreview() {
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/courses/${courseId}`);
        if (response.data.success) {
          setCourseData(response.data.course);
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

    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!courseData) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h1>
        <p className="mb-4">The requested course could not be found.</p>
        <Link to="/" className="text-indigo-600 hover:text-indigo-800">Return to Home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Toaster />
      <div className="bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{courseData.courseName}</h1>
        <p className="text-lg text-gray-600 mb-6">Course ID: {courseData.courseId}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h2 className="text-xl font-semibold mb-2">Basic Information</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="mb-1"><span className="font-medium">Year:</span> {courseData.year}</p>
              <p className="mb-1"><span className="font-medium">Semester:</span> {courseData.semester}</p>
              <p className="mb-1"><span className="font-medium">Category:</span> {courseData.courseCategory}</p>
              <p className="mb-1"><span className="font-medium">Type:</span> {courseData.courseType}</p>
              <p className="mb-1"><span className="font-medium">Credits:</span> {courseData.credits}</p>
              <p className="mb-1">
                <span className="font-medium">Hours:</span> L:{courseData.lectureHours}, 
                T:{courseData.tutorialHours}, P:{courseData.practicalHours}, 
                SL:{courseData.selfLearningHours}
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Course Description</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm">{courseData.courseDescription}</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Prerequisites</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm">{courseData.prerequisites || "None"}</p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Course Outcomes</h2>
          <div className="space-y-2">
            {courseData.courseOutcomes && courseData.courseOutcomes.map((outcome, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">Outcome {index + 1}:</p>
                <p className="text-sm">{outcome.outcome}</p>
                <p className="text-sm text-gray-600 mt-1">Bloom's Level: {outcome.bloomLevel}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h2 className="text-xl font-semibold mb-2">Textbooks</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <ol className="list-decimal pl-4 space-y-1">
                {courseData.textbooks && courseData.textbooks.map((book, index) => (
                  <li key={index} className="text-sm">{book}</li>
                ))}
              </ol>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Reference Books</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <ol className="list-decimal pl-4 space-y-1">
                {courseData.referenceBooks && courseData.referenceBooks.map((book, index) => (
                  <li key={index} className="text-sm">{book}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        {courseData.skills && courseData.skills.length > 0 && courseData.skills.some(skill => skill.trim() !== '') && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Skills</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <ul className="list-disc pl-4 space-y-1">
                {courseData.skills.map((skill, index) => (
                  skill.trim() !== '' && (
                    <li key={index} className="text-sm">{skill}</li>
                  )
                ))}
              </ul>
            </div>
          </div>
        )}

        {courseData.modules && courseData.modules.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Modules</h2>
            {courseData.modules.map((module, moduleIndex) => (
              <div key={moduleIndex} className="mb-6">
                <h3 className="text-lg font-medium mb-2">Module {module.number} 
                  <span className="text-sm font-normal text-gray-600 ml-2">
                    ({module.duration} hours)
                  </span>
                </h3>
                <div className="space-y-3">
                  {module.units.map((unit, unitIndex) => (
                    <div key={unitIndex} className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-1">Unit {unitIndex + 1}: {unit.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        Textbook: {unit.selectedTextbook} (Pages {unit.pageFrom}-{unit.pageTo})
                      </p>
                      <p className="text-sm">{unit.contents}</p>
                    </div>
                  ))}
                  
                  {/* Display Practices */}
                  {module.practices && module.practices.length > 0 && module.practices.some(p => p.trim() !== '') && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Practices:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {module.practices.map((practice, practiceIndex) => (
                          practice.trim() !== '' && (
                            <li key={practiceIndex} className="text-sm">{practice}</li>
                          )
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-8">
          <Link 
            to={`/module-details/${courseId}`}
            className="inline-flex justify-center py-2 px-4 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
          >
            Edit Course
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CoursePreview;