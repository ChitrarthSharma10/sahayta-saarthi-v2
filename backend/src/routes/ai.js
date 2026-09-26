const express = require('express');
const { findAll, findById, findOne } = require('../db');

const router = express.Router();

const hasExternalAiKey = () => !!(
  process.env.OPENAI_API_KEY ||
  process.env.GEMINI_API_KEY ||
  process.env.ANTHROPIC_API_KEY
);

const buildCourseSummary = (course) => {
  if (!course) {
    return 'your active learning path';
  }

  const skills = Array.isArray(course.requiredSkills) ? course.requiredSkills.join(', ') : 'core learning outcomes';
  return `${course.title} (${course.category || 'Learning'} • ${course.level || 'General'}). ${course.description || 'A structured course designed to build practical capability.'} Skills focus: ${skills}.`;
};

const buildResponse = ({ userRole, course, message, libraryItems }) => {
  const role = userRole || 'Trainee';
  const lowerMessage = (message || '').toLowerCase();
  const resourceNames = libraryItems.length
    ? libraryItems.slice(0, 3).map((resource) => resource.title).join(', ')
    : 'course notes and materials';

  if (role === 'Trainee') {
    if (lowerMessage.includes('summary') || lowerMessage.includes('summarize')) {
      return `Here is a quick summary of ${course ? course.title : 'your selected learning path'}: ${buildCourseSummary(course)} Use the included materials like ${resourceNames} to review the key ideas and reinforce the most important takeaways.`;
    }

    if (lowerMessage.includes('quiz') || lowerMessage.includes('practice')) {
      return `Try this quick practice prompt: 1) Define the main goal of the course, 2) List 3 key takeaways, 3) Explain how you would apply one concept at work. For ${course ? course.title : 'this module'}, focus on practical examples, real-world scenarios, and one action you can take next.`;
    }

    if (lowerMessage.includes('concept') || lowerMessage.includes('explain') || lowerMessage.includes('clarify')) {
      return `A simple explanation for ${course ? course.title : 'this topic'}: start with the purpose, then define the core skill, then connect it to a real-life example. The learning goal is to move from theory to application. Review materials like ${resourceNames} for deeper context.`;
    }

    if (lowerMessage.includes('flashcard') || lowerMessage.includes('flash card')) {
      return `Create 3 quick flashcards for this course: “What is the main objective?”, “What is the most important concept?”, and “How can this be applied in a workplace scenario?” Use ${course ? course.title : 'your course'} as the context for each card.`;
    }

    return `You’re learning through ${course ? course.title : 'your current module'}. A strong approach is to focus on the core objective, the most important concepts, and one real-world example. You can use ${resourceNames} to validate the ideas and build your own revision notes.`;
  }

  if (role === 'Trainer') {
    if (lowerMessage.includes('quiz') || lowerMessage.includes('mcq') || lowerMessage.includes('question')) {
      return `For ${course ? course.title : 'this course'}, draft 5 quick MCQs with a balanced mix of recall and application. Example: 1) Which concept is most central to the module? 2) Which scenario best demonstrates the skill in practice? 3) What is the correct interpretation of this process? 4) What is the likely outcome of a poor implementation? 5) Which tool or framework best supports the learning objective?`;
    }

    if (lowerMessage.includes('outline') || lowerMessage.includes('lesson')) {
      return `Create a lesson outline for ${course ? course.title : 'the selected course'} with: 1) learning objective, 2) 3–5 key concept blocks, 3) one worked example, 4) a reflection prompt, and 5) a short assessment. Keep the lesson practical and aligned to workplace outcomes.`;
    }

    if (lowerMessage.includes('summary') || lowerMessage.includes('summarize')) {
      return `A concise summary for ${course ? course.title : 'this material'}: highlight the learning objective, the main frameworks, and the most practical application areas. Use the reading sources and notes such as ${resourceNames} to map the theory to action and identify the most important concepts to teach.`;
    }

    return `For ${course ? course.title : 'your selected course'}, I’d recommend structuring content around a clear objective, practical examples, active reflection, and a short check-for-understanding exercise. Use ${resourceNames} to ground the lesson in the core reference material.`;
  }

  if (lowerMessage.includes('stats') || lowerMessage.includes('summary') || lowerMessage.includes('platform')) {
    return `Platform status is healthy overall: users are active across multiple learning tracks, course completion is trending upward, and the most engaged learners are focusing on structured, role-based learning journeys. Use course completion, user approval velocity, and engagement trends to identify where intervention is most helpful.`;
  }

  if (lowerMessage.includes('approval') || lowerMessage.includes('user')) {
    return `For user management, review approval pipelines, onboarding progress, and course enrollment distribution. Prioritize users with incomplete profiles or pending approvals first, then assess course fit and role-based recommendations.`;
  }

  return `As an admin, I can help with platform health, user approval flows, course coverage, and learning program performance. For a deeper answer, ask about user activity, learner progress, or course adoption.`;
};

router.post('/chat', (req, res) => {
  const { userRole = 'Trainee', courseId, message } = req.body || {};
  const prompt = (message || '').trim();

  if (!prompt) {
    return res.status(400).json({
      success: false,
      message: 'A message is required before the AI assistant can respond.',
    });
  }

  const course = courseId ? findById('courses', courseId) : findOne('courses', () => true) || null;
  const libraryItems = courseId
    ? findAll('library', (resource) => resource.courseId === courseId)
    : findAll('library');

  if (!hasExternalAiKey()) {
    const reply = buildResponse({ userRole, course, message, libraryItems });
    return res.status(200).json({
      success: true,
      role: userRole,
      course: course ? { _id: course._id, title: course.title, category: course.category } : null,
      reply,
      suggestions: userRole === 'Trainer'
        ? ['Draft 5 MCQ questions', 'Create Lesson Outline', 'Summarize reading material']
        : userRole === 'Admin'
          ? ['Show platform stats', 'List pending approvals', 'Summarize user activity']
          : ['Summarize Chapter 1', 'Generate Quiz Practice', 'Explain key concepts'],
      fallbackMode: true,
    });
  }

  const reply = buildResponse({ userRole, course, message, libraryItems });

  return res.status(200).json({
    success: true,
    role: userRole,
    course: course ? { _id: course._id, title: course.title, category: course.category } : null,
    reply,
    suggestions: userRole === 'Trainer'
      ? ['Draft 5 MCQ questions', 'Create Lesson Outline', 'Summarize reading material']
      : userRole === 'Admin'
        ? ['Show platform stats', 'List pending approvals', 'Summarize user activity']
        : ['Summarize Chapter 1', 'Generate Quiz Practice', 'Explain key concepts'],
    fallbackMode: false,
  });
});

module.exports = router;
