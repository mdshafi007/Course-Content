
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/courseDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Unit Schema
const unitSchema = new mongoose.Schema({
    name: { type: String, required: true },
    selectedTextbook: { type: String, required: true },
    pageFrom: { type: Number, required: true, min: 1 },
    pageTo: { type: Number, required: true, min: 1 },
    contents: { type: String, required: true }
});

// Module Schema
const moduleSchema = new mongoose.Schema({
    number: { type: Number, required: true },
    units: [unitSchema],
    duration: { type: Number, required: true, min: 1 }
});

// Course Schema
const courseSchema = new mongoose.Schema({
    courseId: { type: String, required: true, unique: true },
    year: { type: String, required: true },
    semester: { type: String, required: true },
    courseName: { type: String, required: true },
    courseCategory: { type: String, required: true },
    courseType: { type: String, required: true },
    lectureHours: { type: Number, required: true, min: 0 },
    tutorialHours: { type: Number, required: true, min: 0 },
    practicalHours: { type: Number, required: true, min: 0 },
    selfLearningHours: { type: Number, required: true, min: 0 },
    courseDescription: { type: String, required: true },
    prerequisites: { type: String, required: true },
    courseOutcomes: [{
        outcome: { type: String, required: true },
        bloomLevel: { type: String, required: true, enum: ['apply', 'analyze', 'evaluate'] }
    }],
    textbooks: {
        type: [String],
        required: true,
        validate: [array => array.length > 0, 'At least one textbook is required']
    },
    referenceBooks: {
        type: [String],
        required: true,
        validate: [array => array.length > 0, 'At least one reference book is required']
    },
    credits: { type: Number, required: true },
    modules: [moduleSchema]
});

const Course = mongoose.model('Course', courseSchema);

// Routes

// Create a new course
app.post('/api/courses', async (req, res) => {
    try {
        const course = new Course(req.body);
        await course.save();
        res.status(201).json({ success: true, courseId: course.courseId, message: 'Course saved successfully' });
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// Get a course by ID
app.get('/api/courses/:courseId', async (req, res) => {
    try {
        const course = await Course.findOne({ courseId: req.params.courseId });
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }
        res.json({ success: true, course });
    } catch (error) {
        console.error('Error fetching course:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// Update a course
app.put('/api/courses/:courseId', async (req, res) => {
    try {
        const updatedCourse = await Course.findOneAndUpdate(
            { courseId: req.params.courseId },
            req.body,
            { new: true }
        );

        if (!updatedCourse) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        res.json({ success: true, course: updatedCourse });
    } catch (error) {
        console.error('Error updating course:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// Update only modules of a course
app.put('/api/courses/:courseId/modules', async (req, res) => {
    try {
        const updatedCourse = await Course.findOneAndUpdate(
            { courseId: req.params.courseId },
            { modules: req.body.modules },
            { new: true }
        );

        if (!updatedCourse) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        res.json({ success: true, course: updatedCourse });
    } catch (error) {
        console.error('Error updating modules:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// Server Listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
