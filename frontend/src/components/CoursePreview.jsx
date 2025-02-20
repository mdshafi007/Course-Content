// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';

// function CourseCoursePreview() {
//   const { courseId } = useParams();
//   const [courseData, setCourseData] = useState(null);
//   const [hoveredUnit, setHoveredUnit] = useState(null);

//   useEffect(() => {
//     const fetchCourseData = async () => {
//       try {
//         const response = await axios.get(`http://localhost:5000/api/courses/${courseId}`);
//         if (response.data.success) {
//           setCourseData(response.data.course);
//         }
//       } catch (error) {
//         console.error('Error fetching course:', error);
//       }
//     };

//     fetchCourseData();
//   }, [courseId]);

//   if (!courseData) {
//     return <div className="flex justify-center items-center h-screen">Loading...</div>;
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <div className="bg-white rounded-lg shadow-xl p-8">
//         <h1 className="text-3xl font-bold text-gray-900 mb-8">Course CoursePreview</h1>

//         <section className="mb-8">
//           <h2 className="text-2xl font-semibold text-gray-800 mb-4">Basic Information</h2>
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <p className="text-sm font-medium text-gray-500">Course ID</p>
//               <p className="mt-1">{courseData.courseId}</p>
//             </div>
//             <div>
//               <p className="text-sm font-medium text-gray-500">Course Name</p>
//               <p className="mt-1">{courseData.courseName}</p>
//             </div>
//             <div>
//               <p className="text-sm font-medium text-gray-500">Year</p>
//               <p className="mt-1">{courseData.year}</p>
//             </div>
//             <div>
//               <p className="text-sm font-medium text-gray-500">Semester</p>
//               <p className="mt-1">{courseData.semester}</p>
//             </div>
//           </div>
//         </section>

//         <section className="mb-8">
//           <h2 className="text-2xl font-semibold text-gray-800 mb-4">Modules</h2>
//           {courseData.modules?.map((module, moduleIndex) => (
//             <div key={moduleIndex} className="mb-6">
//               <h3 className="text-xl font-medium text-gray-800 mb-3">
//                 Module {module.number} (Duration: {module.duration} weeks)
//               </h3>
//               <div className="space-y-4">
//                 {module.units.map((unit, unitIndex) => (
//                   <div
//                     key={unitIndex}
//                     className="p-4 bg-gray-50 rounded-lg"
//                     onMouseEnter={() => setHoveredUnit(`${moduleIndex}-${unitIndex}`)}
//                     onMouseLeave={() => setHoveredUnit(null)}
//                   >
//                     <div className="relative">
//                       <h4 className="text-lg font-medium text-gray-700">
//                         Unit {unitIndex + 1}: {unit.name}
//                       </h4>
//                       {hoveredUnit === `${moduleIndex}-${unitIndex}` && (
//                         <div className="absolute top-0 -translate-y-full left-0 bg-black text-white p-2 rounded text-sm">
//                           Pages {unit.pageFrom}-{unit.pageTo} from "{unit.selectedTextbook}"
//                         </div>
//                       )}
//                     </div>
//                     <p className="mt-2">{unit.contents}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </section>
//       </div>
//     </div>
//   );
// }

// export default CourseCoursePreview;
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

        {courseData.modules && courseData.modules.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Modules</h2>
            {courseData.modules.map((module, moduleIndex) => (
              <div key={moduleIndex} className="mb-6">
                <h3 className="text-lg font-medium mb-2">Module {module.number} 
                  <span className="text-sm font-normal text-gray-600 ml-2">
                    ({module.duration} weeks)
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