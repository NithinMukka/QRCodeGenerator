import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const App = () => {
  const [preValue, setPreValue] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isQrVisible, setIsQrVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

  const getQRCodeUrl = (qvalue) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const url = `https://api.qrserver.com/v1/create-qr-code/?size=170x170&data=${qvalue}`;
        if (!url || !qvalue) reject('Invalid QR content');
        else resolve(url);
      }, 1000);
    });
  };

  const handleGenButtonClick = () => {
    const qvalue = inputRef.current.value.trim();
    if (!qvalue || preValue === qvalue) return;
    setPreValue(qvalue);
    setIsLoading(true);

    getQRCodeUrl(qvalue)
      .then((url) => {
        setImageUrl(url);
        setIsQrVisible(false);
        setTimeout(() => {
          setIsQrVisible(true);
          setIsLoading(false);
        }, 300);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  };

  const handleKeyDown = () => {
    if (!inputRef.current.value.trim()) {
      setIsQrVisible(false);
      setPreValue('');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-cyan-500 via-sky-500 to-indigo-500 p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm flex flex-col gap-5"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-1">QR Code Generator</h1>
          <p className="text-center text-gray-500 text-sm">Paste your URL or text below</p>
        </div>

        <input
          ref={inputRef}
          onKeyDown={handleKeyDown}
          type="text"
          placeholder="Enter text or URL..."
          className="w-full h-12 px-4 border border-gray-300 rounded-lg shadow-sm outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
        />

        <button
          onClick={handleGenButtonClick}
          disabled={isLoading}
          className={`w-full h-12 rounded-lg text-white font-semibold transition-all duration-300 transform ${
            isLoading ? 'bg-blue-400 cursor-wait' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
          }`}
        >
          {isLoading ? 'Generating...' : 'Generate QR Code'}
        </button>

        <AnimatePresence>
          {isQrVisible && (
            <motion.div
              key="qr"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="flex justify-center items-center p-4 bg-slate-100 rounded-xl shadow-inner mt-2"
            >
              <img
                src={imageUrl}
                alt="QR Code"
                className="max-h-[170px] max-w-[170px] object-contain"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default App;
