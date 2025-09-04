import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CreateQuizData, Question } from '../types';

const CreateQuiz: React.FC = () => {
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState<CreateQuizData>({
    title: '',
    description: '',
    category: '',
    timeLimit: undefined,
    questions: []
  });
  
  const [currentQuestion, setCurrentQuestion] = useState<Omit<Question, 'id'>>({
    text: '',
    type: 'multiple-choice',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: ''
  });

  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    'General Knowledge',
    'Science',
    'History',
    'Sports',
    'Movies',
    'Music',
    'Technology',
    'Geography',
    'Literature',
    'Art'
  ];

  const handleQuizDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setQuizData(prev => ({
      ...prev,
      [name]: name === 'timeLimit' ? (value ? parseInt(value) : undefined) : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentQuestion(prev => ({
      ...prev,
      [name]: name === 'correctAnswer' ? parseInt(value) : value
    }));
  };

  const handleOptionChange = (index: number, value: string) => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? value : opt)
    }));
  };

  const validateQuestion = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!currentQuestion.text.trim()) {
      newErrors.questionText = 'Question text is required';
    }
    
    const filledOptions = currentQuestion.options.filter(opt => opt.trim());
    if (filledOptions.length < 2) {
      newErrors.options = 'At least 2 options are required';
    }
    
    if (currentQuestion.correctAnswer >= filledOptions.length) {
      newErrors.correctAnswer = 'Please select a valid correct answer';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addQuestion = () => {
    if (!validateQuestion()) return;
    
    const filteredOptions = currentQuestion.options.filter(opt => opt.trim());
    const newQuestion = {
      ...currentQuestion,
      options: filteredOptions
    };
    
    setQuizData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
    
    setCurrentQuestion({
      text: '',
      type: 'multiple-choice',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: ''
    });
    
    setIsAddingQuestion(false);
  };

  const removeQuestion = (index: number) => {
    setQuizData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const validateQuiz = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!quizData.title.trim()) {
      newErrors.title = 'Quiz title is required';
    }
    
    if (!quizData.description.trim()) {
      newErrors.description = 'Quiz description is required';
    }
    
    if (!quizData.category) {
      newErrors.category = 'Please select a category';
    }
    
    if (quizData.questions.length < 1) {
      newErrors.questions = 'At least 1 question is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateQuiz()) return;
    
    try {
      // TODO: Implement actual quiz creation API call
      console.log('Creating quiz:', quizData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      navigate('/', { 
        state: { message: 'Quiz created successfully!' }
      });
    } catch (error) {
      console.error('Failed to create quiz:', error);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Create New Quiz</h1>
          <p className="text-white/80">Build an engaging quiz for your audience</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Quiz Basic Information */}
          <div className="card">
            <h2 className="text-2xl font-semibold text-white mb-6">Quiz Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-white mb-2">
                  Quiz Title *
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  className="input-field"
                  placeholder="Enter quiz title"
                  value={quizData.title}
                  onChange={handleQuizDataChange}
                />
                {errors.title && <p className="mt-1 text-sm text-red-300">{errors.title}</p>}
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-white mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  className="input-field"
                  value={quizData.category}
                  onChange={handleQuizDataChange}
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && <p className="mt-1 text-sm text-red-300">{errors.category}</p>}
              </div>
            </div>

            <div className="mt-6">
              <label htmlFor="description" className="block text-sm font-medium text-white mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={3}
                className="input-field resize-none"
                placeholder="Describe your quiz..."
                value={quizData.description}
                onChange={handleQuizDataChange}
              />
              {errors.description && <p className="mt-1 text-sm text-red-300">{errors.description}</p>}
            </div>

            <div className="mt-6">
              <label htmlFor="timeLimit" className="block text-sm font-medium text-white mb-2">
                Time Limit (seconds, optional)
              </label>
              <input
                id="timeLimit"
                name="timeLimit"
                type="number"
                min="60"
                max="3600"
                className="input-field"
                placeholder="e.g., 300 for 5 minutes"
                value={quizData.timeLimit || ''}
                onChange={handleQuizDataChange}
              />
            </div>
          </div>

          {/* Questions Section */}
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-white">Questions ({quizData.questions.length})</h2>
              <button
                type="button"
                onClick={() => setIsAddingQuestion(true)}
                className="btn-primary"
              >
                Add Question
              </button>
            </div>

            {errors.questions && <p className="mb-4 text-sm text-red-300">{errors.questions}</p>}

            {/* Existing Questions */}
            <div className="space-y-4 mb-6">
              {quizData.questions.map((question, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-white font-medium">Question {index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeQuestion(index)}
                      className="text-red-300 hover:text-red-200 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  <p className="text-white/80 mb-2">{question.text}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {question.options.map((option, optIndex) => (
                      <div
                        key={optIndex}
                        className={`text-sm px-3 py-2 rounded ${
                          optIndex === question.correctAnswer
                            ? 'bg-green-500/20 text-green-200 border border-green-400/30'
                            : 'bg-white/5 text-white/70'
                        }`}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Add Question Form */}
            {isAddingQuestion && (
              <div className="bg-white/5 rounded-lg p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-4">Add New Question</h3>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="questionText" className="block text-sm font-medium text-white mb-2">
                      Question Text *
                    </label>
                    <textarea
                      id="questionText"
                      name="text"
                      rows={2}
                      className="input-field resize-none"
                      placeholder="Enter your question..."
                      value={currentQuestion.text}
                      onChange={handleQuestionChange}
                    />
                    {errors.questionText && <p className="mt-1 text-sm text-red-300">{errors.questionText}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Answer Options *
                    </label>
                    <div className="space-y-3">
                      {currentQuestion.options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <input
                            type="radio"
                            name="correctAnswer"
                            value={index}
                            checked={currentQuestion.correctAnswer === index}
                            onChange={handleQuestionChange}
                            className="text-purple-600 bg-white/10 border-white/30 focus:ring-purple-500"
                          />
                          <input
                            type="text"
                            placeholder={`Option ${index + 1}`}
                            className="input-field flex-1"
                            value={option}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                    {errors.options && <p className="mt-1 text-sm text-red-300">{errors.options}</p>}
                    {errors.correctAnswer && <p className="mt-1 text-sm text-red-300">{errors.correctAnswer}</p>}
                  </div>

                  <div>
                    <label htmlFor="explanation" className="block text-sm font-medium text-white mb-2">
                      Explanation (optional)
                    </label>
                    <textarea
                      id="explanation"
                      name="explanation"
                      rows={2}
                      className="input-field resize-none"
                      placeholder="Explain the correct answer..."
                      value={currentQuestion.explanation}
                      onChange={handleQuestionChange}
                    />
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={addQuestion}
                      className="btn-primary"
                    >
                      Add Question
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingQuestion(false)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={quizData.questions.length === 0}
              className="btn-primary text-lg px-12 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Quiz
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateQuiz;