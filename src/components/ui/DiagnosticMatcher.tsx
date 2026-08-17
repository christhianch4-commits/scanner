'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Check, Zap } from 'lucide-react';
import { filterQuestions, scannersData } from '@/data/scannersData';
import { useShopStore } from '@/stores/useShopStore';
import { ProductCard } from './ProductCard';

export function DiagnosticMatcher() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [completed, setCompleted] = useState(false);
  const { completeQuiz, resetQuiz: resetStoreQuiz, recommendedScanners } = useShopStore();

  const handleAnswer = (value: string, scannerIds: string[]) => {
    const newAnswers = { ...answers, [filterQuestions[currentQuestion].id]: value };
    setAnswers(newAnswers);

    if (currentQuestion < filterQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate recommendations based on all answers
      const allScannerIds = Object.values(newAnswers).flatMap((answer, i) => {
        const question = filterQuestions[i];
        const option = question.options.find(o => o.value === answer);
        return option?.scanners || [];
      });

      // Get unique scanner IDs and limit to 3
      const uniqueIds = [...new Set(allScannerIds)].slice(0, 3);
      completeQuiz(uniqueIds);
      setCompleted(true);
    }
  };

  const resetQuizLocal = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setCompleted(false);
    resetStoreQuiz();
  };

  const currentQ = filterQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / filterQuestions.length) * 100;

  if (completed) {
    const recommended = scannersData.filter(s => recommendedScanners.includes(s.id));
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-hud-dark/80 backdrop-blur-xl border border-primary/30 rounded-2xl p-8 my-12"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Check className="w-10 h-10 text-background" />
          </motion.div>
          <h2 className="text-3xl font-bold text-white mb-2">Perfect Match Found!</h2>
          <p className="text-gray-400">Based on your needs, we recommend these scanners:</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {recommended.map((scanner, i) => (
            <motion.div
              key={scanner.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
            >
              <ProductCard scanner={scanner} />
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={resetQuizLocal}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
          >
            Start Over
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-hud-dark/80 backdrop-blur-xl border border-primary/30 rounded-2xl p-8 my-12 max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Question {currentQuestion + 1} of {filterQuestions.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-gradient-to-r from-primary to-secondary"
          />
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="space-y-6"
        >
          <h3 className="text-2xl font-bold text-white">{currentQ.question}</h3>
          
          <div className="grid gap-4">
            {currentQ.options.map((option) => (
              <motion.button
                key={option.value}
                whileHover={{ scale: 1.02, x: 10 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswer(option.value, option.scanners)}
                className="group flex items-center justify-between p-6 bg-background/50 border border-hud-border rounded-xl hover:border-primary/50 hover:bg-primary/10 transition-all text-left"
              >
                <span className="text-lg text-white group-hover:text-primary transition-colors">
                  {option.label}
                </span>
                <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-primary group-hover:translate-x-2 transition-all" />
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Dots */}
      <div className="flex justify-center gap-2 mt-8">
        {filterQuestions.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all ${
              i === currentQuestion ? 'w-8 bg-primary' : i < currentQuestion ? 'bg-secondary' : 'bg-white/20'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
