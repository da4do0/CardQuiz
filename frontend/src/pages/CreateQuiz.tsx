import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CreateQuizData } from '../types';
import { quizApi } from '../services/api';
import {useAuth} from '../hooks/useAuth';

const CreateQuiz: React.FC = () => {
  const navigate = useNavigate();
  const { userId } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [quizData, setQuizData] = useState<CreateQuizData>({
    userId: userId || 0,
    title: '',
    questions: []
  });
  
  const [currentQuestion, setCurrentQuestion] = useState({
    testo: '',
    text: '',
    type: 'multiple-choice' as const,
    options: ['', ''],
    risposta_1: '',
    risposta_2: '',
    risposta_3: '',
    risposta_4: '',
    risposta_corretta: '',
    correctAnswer: 0,
    explanation: '',
    quiz_id: 0
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

  // Step 1 handlers
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

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!quizData.title.trim()) {
      newErrors.title = 'Quiz title is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  // Step 2 handlers
  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentQuestion(prev => ({
      ...prev,
      [name]: name === 'correctAnswer' ? parseInt(value) : value,
      // Sync both text formats
      ...(name === 'text' && { testo: value }),
      ...(name === 'testo' && { text: value })
    }));
  };

  const handleOptionChange = (index: number, value: string) => {
    setCurrentQuestion(prev => {
      const newOptions = prev.options.map((opt, i) => i === index ? value : opt);
      return {
        ...prev,
        options: newOptions,
        // Sync with database format
        risposta_1: newOptions[0] || '',
        risposta_2: newOptions[1] || '',
        risposta_3: newOptions[2] || '',
        risposta_4: newOptions[3] || ''
      };
    });
  };

  const addOption = () => {
    if (currentQuestion.options.length < 4) {
      setCurrentQuestion(prev => {
        const newOptions = [...prev.options, ''];
        return {
          ...prev,
          options: newOptions,
          risposta_1: newOptions[0] || '',
          risposta_2: newOptions[1] || '',
          risposta_3: newOptions[2] || '',
          risposta_4: newOptions[3] || ''
        };
      });
    }
  };

  const removeOption = (index: number) => {
    if (currentQuestion.options.length > 2) {
      setCurrentQuestion(prev => {
        const newOptions = prev.options.filter((_, i) => i !== index);
        return {
          ...prev,
          options: newOptions,
          correctAnswer: prev.correctAnswer >= index && prev.correctAnswer > 0 ? prev.correctAnswer - 1 : prev.correctAnswer,
          risposta_1: newOptions[0] || '',
          risposta_2: newOptions[1] || '',
          risposta_3: newOptions[2] || '',
          risposta_4: newOptions[3] || ''
        };
      });
    }
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
    
    // Check if the selected correct answer has text
    if (!currentQuestion.options[currentQuestion.correctAnswer]?.trim()) {
      newErrors.correctAnswer = 'The selected correct answer cannot be empty';
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
    
    resetCurrentQuestion();
    setIsAddingQuestion(false);
  };

  const resetCurrentQuestion = () => {
    setCurrentQuestion({
      testo: '',
      text: '',
      type: 'multiple-choice' as const,
      options: ['', ''],
      risposta_1: '',
      risposta_2: '',
      risposta_3: '',
      risposta_4: '',
      risposta_corretta: '',
      correctAnswer: 0,
      explanation: '',
      quiz_id: 0
    });
    setErrors({});
  };

  const removeQuestion = (index: number) => {
    setQuizData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    if (quizData.questions.length === 0) {
      setErrors({ questions: 'At least 1 question is required' });
      return;
    }
    
    try {
      // TODO: Implement actual quiz creation API call
      console.log('Creating quiz:', quizData);
      
      const response = await quizApi.createQuiz(quizData);
      console.log('Quiz created successfully:', response);
      if (response.quiz_id) {
        navigate('/my-quizzes');
      }
      
    } catch (error) {
      console.error('Failed to create quiz:', error);
    }
  };

  // Step 1: Quiz Information
  if (currentStep === 1) {
    return (
      <div className='py-12 px-4'>
      <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-white hover:text-purple-200 transition-colors mb-6"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>
        </div>
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">1</div>
                <div className="w-16 h-1 bg-white/20"></div>
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white/60 font-bold">2</div>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Create New Quiz</h1>
            <p className="text-white/80">Step 1: Quiz Information</p>
          </div>

          <div className="card">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🎯</div>
              <h2 className="text-2xl font-bold text-white mb-2">Quiz Details</h2>
              <p className="text-white/70">Give your quiz a name and description that will attract players</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-white mb-2">
                  Quiz Title *
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  className="input-field text-lg"
                  placeholder="e.g., Ultimate Science Challenge"
                  value={quizData.title}
                  onChange={handleQuizDataChange}
                />
                {errors.title && <p className="mt-1 text-sm text-red-300">{errors.title}</p>}
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <button
                onClick={handleNextStep}
                className="btn-primary text-lg px-12 py-4"
              >
                Next: Add Questions →
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    );
  }

  // Step 2: Questions
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentStep(1)}
                className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold hover:bg-green-600 transition-colors"
              >
                ✓
              </button>
              <div className="w-16 h-1 bg-purple-500"></div>
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">2</div>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">{quizData.title}</h1>
          <p className="text-white/80">Step 2: Add Questions</p>
        </div>

        {/* Quiz Summary */}
        <div className="card mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">{quizData.title}</h3>
              <p className="text-white/70 text-sm">{quizData.questions.length} questions</p>
            </div>
            <button
              onClick={() => setCurrentStep(1)}
              className="btn-secondary text-sm"
            >
              Edit Info
            </button>
          </div>
        </div>

        {/* Questions Section */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-white flex items-center">
              <span className="mr-3">📝</span>
              Questions ({quizData.questions.length})
            </h2>
            {!isAddingQuestion && (
              <button
                onClick={() => setIsAddingQuestion(true)}
                className="btn-primary"
              >
                + Add Question
              </button>
            )}
          </div>

          {errors.questions && <p className="mb-4 text-sm text-red-300">{errors.questions}</p>}

          {/* Existing Questions */}
          <div className="space-y-4 mb-6">
            {quizData.questions.map((question, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-6 border border-white/10 group hover:bg-white/10 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-white font-semibold text-lg">Question {index + 1}</h3>
                  <button
                    onClick={() => removeQuestion(index)}
                    className="text-red-300 hover:text-red-200 text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    🗑️ Remove
                  </button>
                </div>
                <p className="text-white/90 mb-4 font-medium">{question.text || question.testo}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(question.options || [question.risposta_1, question.risposta_2, question.risposta_3, question.risposta_4].filter(Boolean)).map((option, optIndex) => (
                    <div
                      key={optIndex}
                      className={`text-sm px-4 py-3 rounded-lg flex items-center ${
                        optIndex === question.correctAnswer
                          ? 'bg-green-500/20 text-green-200 border border-green-400/30'
                          : 'bg-white/5 text-white/70 border border-white/10'
                      }`}
                    >
                      <span className="mr-3 font-bold">
                        {optIndex === question.correctAnswer ? '✓' : String.fromCharCode(65 + optIndex)}
                      </span>
                      {option}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Add Question Form */}
          {isAddingQuestion && (
            <div className="bg-white/5 rounded-lg p-6 border border-purple-400/30">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
                <span className="mr-3">➕</span>
                Add New Question
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="questionText" className="block text-sm font-medium text-white mb-2">
                    Question Text *
                  </label>
                  <textarea
                    id="questionText"
                    name="text"
                    rows={3}
                    className="input-field resize-none"
                    placeholder="Enter your question here..."
                    value={currentQuestion.text}
                    onChange={handleQuestionChange}
                  />
                  {errors.questionText && <p className="mt-1 text-sm text-red-300">{errors.questionText}</p>}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-sm font-medium text-white">
                      Answer Options * (2-4 options)
                    </label>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={addOption}
                        disabled={currentQuestion.options.length >= 4}
                        className="text-sm text-purple-300 hover:text-purple-200 disabled:text-gray-500 disabled:cursor-not-allowed"
                      >
                        + Add Option
                      </button>
                    </div>
                  </div>
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
                        <div className="flex-1 flex items-center space-x-2">
                          <span className="text-white/70 font-bold min-w-[20px]">
                            {String.fromCharCode(65 + index)}
                          </span>
                          <input
                            type="text"
                            placeholder={`Option ${index + 1}`}
                            className="input-field flex-1"
                            value={option}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                          />
                          {currentQuestion.options.length > 2 && (
                            <button
                              type="button"
                              onClick={() => removeOption(index)}
                              className="text-red-300 hover:text-red-200 p-1"
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  {errors.options && <p className="mt-1 text-sm text-red-300">{errors.options}</p>}
                  {errors.correctAnswer && <p className="mt-1 text-sm text-red-300">{errors.correctAnswer}</p>}
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={addQuestion}
                    className="btn-primary"
                  >
                    ✅ Add Question
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingQuestion(false);
                      resetCurrentQuestion();
                    }}
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
        <div className="flex justify-center mt-8 space-x-4">
          <button
            onClick={() => setCurrentStep(1)}
            className="btn-secondary text-lg px-8 py-4"
          >
            ← Back
          </button>
          <button
            onClick={handleSubmit}
            disabled={quizData.questions.length === 0}
            className="btn-primary text-lg px-12 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🚀 Create Quiz ({quizData.questions.length} questions)
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateQuiz;