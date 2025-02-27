import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CourseForm from './components/CourseForm';
import ModuleDetails from './components/ModuleDetails';
import CoursePreview from './components/CoursePreview';
import LandingPage from './components/LandingPage';
import CoursesList from './components/CoursesList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/create-course" element={<CourseForm />} />
        <Route path="/module-details" element={<ModuleDetails />} />
        <Route path="/module-details/:courseId" element={<ModuleDetails />} />
        <Route path="/preview/:courseId" element={<CoursePreview />} />
        <Route path="/courses-list" element={<CoursesList />} />
      </Routes>
    </Router>
  );
}

export default App;