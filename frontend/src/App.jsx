import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CourseForm from './components/CourseForm';
import ModuleDetails from './components/ModuleDetails';
import CoursePreview from './components/CoursePreview';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CourseForm />} />
        <Route path="/module-details/:courseId" element={<ModuleDetails />} />
        <Route path="/preview/:courseId" element={<CoursePreview />} />
      </Routes>
    </Router>
  );
}

export default App;