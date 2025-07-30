
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { RouteSuggestion } from '../types';
import SpinnerIcon from './icons/SpinnerIcon';

interface RouteSuggestionsProps {
  routes: RouteSuggestion[];
  isLoading: boolean;
  selectedRouteIndex: number | null;
  onSelectRoute: (index: number) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

const RouteSuggestions: React.FC<RouteSuggestionsProps> = ({ routes, isLoading, selectedRouteIndex, onSelectRoute }) => {
  if (isLoading) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-700 min-h-[200px] flex flex-col justify-center items-center">
        <SpinnerIcon />
        <p className="mt-4 text-lg text-cyan-300 animate-pulse">最適ルートを探索中...</p>
        <p className="text-sm text-gray-400">AIが交通状況を分析しています</p>
      </div>
    );
  }

  if (routes.length === 0) {
    return (
        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-700 min-h-[200px] flex flex-col justify-center items-center text-center">
            <h3 className="text-xl font-bold text-gray-300">ルート提案</h3>
            <p className="mt-2 text-gray-400">申請情報を入力し、「最適ルートを申請」ボタンを押してください。</p>
        </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-700">
      <h3 className="text-2xl font-bold mb-4 text-cyan-300">AIルート提案</h3>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-3"
      >
        {routes.map((route, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            onClick={() => onSelectRoute(index)}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
              selectedRouteIndex === index
                ? 'bg-cyan-500/20 border-cyan-400 scale-105 shadow-cyan-500/20 shadow-lg'
                : 'bg-gray-700/50 border-gray-600 hover:bg-gray-700 hover:border-gray-500'
            }`}
          >
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-lg text-white">{route.routeName}</h4>
              <div className="text-right">
                <p className="text-xl font-bold text-cyan-300">{route.estimatedTime}分</p>
                <p className="text-xs text-gray-400">推定所要時間</p>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-300">{route.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default RouteSuggestions;
