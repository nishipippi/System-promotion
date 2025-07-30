
import React from 'react';
import { motion } from 'framer-motion';

const Header = (): React.ReactNode => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
        <span className="bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
          特殊車両通行許可
        </span>
        申請システム
      </h1>
      <p className="mt-3 text-lg text-gray-400 max-w-2xl mx-auto">
        AIが交通状況をリアルタイムで予測し、あなたのビジネスに最適なルートを提案します。
      </p>
    </motion.header>
  );
};

export default Header;
