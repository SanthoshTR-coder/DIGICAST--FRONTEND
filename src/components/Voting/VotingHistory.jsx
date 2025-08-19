import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, ArrowRightCircle } from "lucide-react";

const electionTimeline = [
  {
    year: "Ancient Greece (5th century BC)",
    title: "Birth of Democracy",
    description:
      "The concept of democracy began in Athens, where citizens voted directly on laws and policies.",
  },
  {
    year: "13th Century",
    title: "Rise of Parliaments",
    description:
      "England's Parliament began gaining influence, creating a representative form of government.",
  },
  {
    year: "1789",
    title: "French Revolution & Universal Ideas",
    description:
      "Calls for universal male suffrage spread, reshaping the idea of citizen participation.",
  },
  {
    year: "1920",
    title: "Women's Suffrage (USA)",
    description:
      "The 19th Amendment granted women the right to vote in the United States.",
  },
  {
    year: "21st Century",
    title: "Digital Voting",
    description:
      "Countries started experimenting with secure electronic and blockchain-based voting systems.",
  },
];

const VotingHistory = () => {
  const [selected, setSelected] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-indigo-900 text-white p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 drop-shadow-lg">
          📜 History of Elections
        </h1>
        <p className="text-gray-300 mt-3 text-lg flex justify-center items-center gap-2">
          <History className="h-5 w-5 text-yellow-400 animate-pulse" />
          Discover how democracy evolved through time
        </p>
      </motion.div>

      {/* Timeline */}
      <div className="relative max-w-4xl mx-auto">
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full border-l-4 border-purple-600 rounded-full"></div>

        {electionTimeline.map((event, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className={`mb-12 flex justify-${index % 2 === 0 ? "start" : "end"} w-full`}
          >
            <div
              onClick={() => setSelected(selected === index ? null : index)}
              className="relative bg-gray-800 p-6 rounded-2xl shadow-2xl w-80 cursor-pointer hover:scale-105 hover:shadow-pink-500/30 transition-transform duration-300"
            >
              <h2 className="text-2xl font-bold mb-2 text-purple-300">{event.year}</h2>
              <p className="text-lg font-semibold">{event.title}</p>
              <ArrowRightCircle className="absolute top-4 right-4 text-pink-400" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Expanded Information */}
      <AnimatePresence>
        {selected !== null && (
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center p-6"
          >
            <motion.div
              className="bg-gray-900 max-w-xl p-8 rounded-2xl shadow-2xl border border-purple-600"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <h2 className="text-3xl font-extrabold text-pink-400 mb-4">
                {electionTimeline[selected].year} – {electionTimeline[selected].title}
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                {electionTimeline[selected].description}
              </p>
              <button
                onClick={() => setSelected(null)}
                className="mt-6 px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VotingHistory;
