import { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { X, Check, AlertCircle, Lightbulb } from 'lucide-react';
import { Button } from '../UI/Button';
import { useGame } from '../../context/GameContext';
import { validateAnswer, getHintMessage } from '../../utils/validation';

export function InputModal({ isOpen, onClose, element, type }) {
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [shake, setShake] = useState(false);
  const inputRef = useRef(null);

  const { submitNodeAnswer, submitEdgeAnswer, score, getHintLevel, useHint: recordHint } = useGame();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e?.preventDefault();

    if (!input.trim()) return;

    const correctAnswer = element.answer;
    const result = validateAnswer(input, correctAnswer);

    if (result.isCorrect) {
      // Correct answer
      setFeedback({ type: 'success', message: 'Correct!' });

      // Submit answer
      if (type === 'node') {
        submitNodeAnswer(element.id, correctAnswer);
      } else {
        submitEdgeAnswer(element.id, correctAnswer);
      }

      // Close modal after short delay
      setTimeout(() => {
        onClose();
        setInput('');
        setFeedback(null);
        setAttempts(0);
      }, 1000);
    } else {
      // Incorrect answer
      setFeedback({
        type: 'error',
        message: getHintMessage(attempts),
      });
      score.addMistake();
      setAttempts(a => a + 1);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleHint = () => {
    // Open hint modal or show inline hint
    const hintLevel = getHintLevel(element.id);
    if (hintLevel < 3) {
      recordHint(element.id);
      const currentHint = element.hints[hintLevel];
      setFeedback({
        type: 'hint',
        message: `Hint: ${currentHint}`,
      });
    }
  };

  const handleClose = () => {
    onClose();
    setInput('');
    setFeedback(null);
    setAttempts(0);
  };

  if (!element) return null;

  const hintLevel = getHintLevel(element.id);
  const canShowHint = hintLevel < 3;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <div
            className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md ${
              shake ? 'shake' : ''
            }`}
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Content */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Fill in the {type === 'node' ? 'Word' : 'Relationship'}
              </h2>

              {type === 'node' ? (
                <p className="text-gray-600">
                  What word belongs here? Think about the connections to other words.
                </p>
              ) : (
                <p className="text-gray-600">
                  What is the relationship between these words?
                </p>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Answer
                  </label>
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                    placeholder="Type your answer..."
                  />
                </div>

                {/* Feedback */}
                {feedback && (
                  <div
                    className={`flex items-start gap-2 p-3 rounded-lg ${
                      feedback.type === 'success'
                        ? 'bg-green-100 text-green-800'
                        : feedback.type === 'error'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {feedback.type === 'success' ? (
                      <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    ) : feedback.type === 'error' ? (
                      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Lightbulb className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    )}
                    <p className="text-sm font-medium">{feedback.message}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <Button type="submit" variant="primary" className="flex-1">
                    Submit
                  </Button>
                  {canShowHint && (
                    <Button type="button" variant="secondary" onClick={handleHint}>
                      <Lightbulb className="w-5 h-5" />
                    </Button>
                  )}
                </div>
              </form>

              {/* Hint info */}
              {hintLevel > 0 && (
                <p className="text-sm text-gray-500 text-center">
                  Hints used: {hintLevel}/3 (-{hintLevel * 10} points)
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
