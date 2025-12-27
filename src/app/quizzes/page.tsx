'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useProgress } from '@/lib/progress-context';
import { quizBank, modules, getModuleById } from '@/lib/content-loader';

export default function QuizzesPage() {
  const { recordQuizAttempt } = useProgress();
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [quizComplete, setQuizComplete] = useState(false);

  const moduleQuestions = selectedModule
    ? quizBank.filter(q => q.moduleId === selectedModule)
    : [];

  const currentQuestion = moduleQuestions[currentQuestionIndex];

  const startQuiz = (moduleId: string) => {
    setSelectedModule(moduleId);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswers([]);
    setQuizComplete(false);
  };

  const submitAnswer = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    setAnswers([...answers, isCorrect]);
    if (isCorrect) {
      setScore(score + 1);
    }
    setShowResult(true);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < moduleQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizComplete(true);
      const finalScore = score + (selectedAnswer === currentQuestion.correctAnswer ? 1 : 0);
      recordQuizAttempt({
        quizId: `quiz-${selectedModule}`,
        moduleId: selectedModule!,
        date: new Date().toISOString(),
        score: finalScore,
        totalQuestions: moduleQuestions.length,
        incorrectQuestions: [],
      });
    }
  };

  const resetQuiz = () => {
    setSelectedModule(null);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswers([]);
    setQuizComplete(false);
  };

  // Module selection view
  if (!selectedModule) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Quizzes</h1>
            <p className="text-[var(--foreground-muted)]">
              Test your knowledge with quizzes for each study module.
            </p>
          </div>

          <div className="grid gap-4">
            {modules.map(module => {
              const questionCount = quizBank.filter(q => q.moduleId === module.id).length;
              return (
                <div key={module.id} className="card p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-bold mb-1">{module.title}</h2>
                      <p className="text-sm text-[var(--foreground-muted)]">
                        {questionCount} questions
                      </p>
                    </div>
                    <button
                      onClick={() => startQuiz(module.id)}
                      className="btn-primary"
                      disabled={questionCount === 0}
                    >
                      {questionCount > 0 ? 'Start Quiz' : 'No Questions Yet'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Quiz complete view
  if (quizComplete) {
    const percentage = Math.round((score / moduleQuestions.length) * 100);
    const module = getModuleById(selectedModule);

    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="card p-8">
            <h1 className="text-3xl font-bold mb-4">Quiz Complete!</h1>
            <p className="text-xl mb-2">{module?.title}</p>

            <div className="my-8">
              <div className="text-6xl font-bold text-[var(--accent-sand)] mb-2">
                {percentage}%
              </div>
              <p className="text-[var(--foreground-muted)]">
                You got {score} out of {moduleQuestions.length} questions correct
              </p>
            </div>

            <div className="flex justify-center gap-4">
              <button onClick={() => startQuiz(selectedModule)} className="btn-secondary">
                Try Again
              </button>
              <button onClick={resetQuiz} className="btn-primary">
                Choose Another Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz question view
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <button onClick={resetQuiz} className="text-[var(--accent-sand)] hover:underline">
            ← Back to Quizzes
          </button>
          <span className="text-sm text-[var(--foreground-muted)]">
            Question {currentQuestionIndex + 1} of {moduleQuestions.length}
          </span>
        </div>

        {/* Progress bar */}
        <div className="progress-bar mb-8">
          <div
            className="progress-bar-fill"
            style={{ width: `${((currentQuestionIndex + 1) / moduleQuestions.length) * 100}%` }}
          />
        </div>

        <div className="card p-6">
          <div className="mb-2">
            <span className={`text-xs px-2 py-1 rounded ${
              currentQuestion.difficulty === 'easy' ? 'bg-green-500/20 text-green-500' :
              currentQuestion.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-500' :
              'bg-red-500/20 text-red-500'
            }`}>
              {currentQuestion.difficulty}
            </span>
          </div>

          <h2 className="text-xl font-bold mb-6">{currentQuestion.question}</h2>

          <div className="space-y-3 mb-6">
            {currentQuestion.options?.map((option, idx) => (
              <button
                key={idx}
                onClick={() => !showResult && setSelectedAnswer(idx)}
                disabled={showResult}
                className={`w-full text-left p-4 rounded-lg border transition-all ${
                  showResult
                    ? idx === currentQuestion.correctAnswer
                      ? 'border-green-500 bg-green-500/10'
                      : idx === selectedAnswer
                        ? 'border-red-500 bg-red-500/10'
                        : 'border-[var(--border)]'
                    : selectedAnswer === idx
                      ? 'border-[var(--accent-sand)] bg-[var(--accent-sand)]/10'
                      : 'border-[var(--border)] hover:border-[var(--accent-sand)]/50'
                }`}
              >
                <span className="font-mono mr-3">{String.fromCharCode(65 + idx)}.</span>
                {option}
              </button>
            ))}
          </div>

          {showResult && (
            <div className={`p-4 rounded-lg mb-6 ${
              selectedAnswer === currentQuestion.correctAnswer
                ? 'bg-green-500/10 border border-green-500/30'
                : 'bg-red-500/10 border border-red-500/30'
            }`}>
              <p className="font-bold mb-2">
                {selectedAnswer === currentQuestion.correctAnswer ? '✓ Correct!' : '✗ Incorrect'}
              </p>
              <p className="text-sm text-[var(--foreground-muted)]">
                {currentQuestion.explanation}
              </p>
            </div>
          )}

          <div className="flex justify-end">
            {!showResult ? (
              <button
                onClick={submitAnswer}
                disabled={selectedAnswer === null}
                className="btn-primary"
              >
                Submit Answer
              </button>
            ) : (
              <button onClick={nextQuestion} className="btn-primary">
                {currentQuestionIndex < moduleQuestions.length - 1 ? 'Next Question' : 'See Results'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
