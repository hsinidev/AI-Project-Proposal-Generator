import React, { useState, useCallback } from 'react';
import Starfield from './Starfield';
import Modal from './Modal';
import SeoArticleModalContent from './SeoArticleModalContent';

interface LayoutProps {
  children: React.ReactNode;
}

const modalContents: { [key: string]: React.ReactNode } = {
  'Guide': (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-yellow-400">How to Use the AI Proposal Generator</h2>
      <p className="mb-4">Follow these simple steps to create a professional proposal draft in seconds:</p>
      <ol className="list-decimal list-inside space-y-3">
        <li>
          <strong>Fill in the Project Goal:</strong> This is the most important input. Be as detailed as possible about what you want to achieve. The more context you give the AI, the better the output will be.
        </li>
        <li>
          <strong>Complete the Other Fields:</strong> Define your target audience, list the key deliverables, and provide an estimated budget and timeline. These details help the AI tailor the proposal to your specific needs.
        </li>
        <li>
          <strong>Generate the Draft:</strong> Click the "Generate Proposal Draft" button. The AI will process your inputs and create a structured proposal. This may take a few moments.
        </li>
        <li>
          <strong>Review and Copy:</strong> The generated proposal will appear in the text area below the form. Read through it carefully. Remember, this is a draft! You should always review and customize the text to fit your unique voice and project requirements.
        </li>
         <li>
          <strong>Use Your Draft:</strong> Once you're happy, use the "Copy" button to save the proposal to your clipboard and paste it into your favorite editor for final touches.
        </li>
      </ol>
    </div>
  ),
  'About': (
    <div>
      <h2 className="text-2xl font-bold mb-4">About Us</h2>
      <p>This AI Project Proposal Generator is a tool designed to streamline the process of creating professional and structured project proposals. By leveraging the power of Google's Gemini AI, we help you translate your ideas into compelling documents quickly and efficiently.</p>
    </div>
  ),
  'Contact': (
    <div>
      <h2 className="text-2xl font-bold mb-4">Contact</h2>
      <p>For inquiries, please visit <a href="http://doodax.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">doodax.com</a> or email us at <a href="mailto:hsini.web@gmail.com" className="text-blue-400 hover:underline">hsini.web@gmail.com</a>.</p>
    </div>
  ),
  'Privacy Policy': (
    <div>
      <h2 className="text-2xl font-bold mb-4">Privacy Policy</h2>
      <p>We respect your privacy. No data entered into this tool is stored or used for any purpose other than generating the proposal in real-time. Your project details are confidential and are not monitored.</p>
    </div>
  ),
  'Terms of Service': (
     <div>
      <h2 className="text-2xl font-bold mb-4">Terms of Service</h2>
      <p>This service is provided "as is" without any warranties. By using this tool, you agree not to hold us liable for any issues arising from its use. The generated content is for drafting purposes and should be reviewed by a human before official use.</p>
    </div>
  ),
  'DMCA': (
    <div>
      <h2 className="text-2xl font-bold mb-4">DMCA</h2>
      <p>We respect intellectual property rights. If you believe any content infringes upon your copyright, please contact us at <a href="mailto:hsini.web@gmail.com" className="text-blue-400 hover:underline">hsini.web@gmail.com</a> with a valid DMCA notice.</p>
    </div>
  ),
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [isArticleExpanded, setIsArticleExpanded] = useState(false);

  const modalLinks = ['Guide', 'About', 'Contact', 'Privacy Policy', 'Terms of Service', 'DMCA'];

  const openModal = useCallback((modalKey: string) => {
    setActiveModal(modalKey);
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  return (
    <div className="relative min-h-screen bg-gray-900 text-white font-sans overflow-x-hidden">
      <Starfield />
      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="p-4 md:p-6 backdrop-blur-sm sticky top-0 z-20 border-b border-white/10">
          <nav className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl md:text-2xl font-bold tracking-wider text-gray-100">AI Proposal Generator</h1>
            <div className="flex flex-wrap justify-end gap-2 md:gap-4 text-sm md:text-base">
              {modalLinks.map(key => (
                 <button key={key} onClick={() => openModal(key)} className="hover:text-yellow-300 transition-colors duration-300">
                   {key}
                 </button>
              ))}
            </div>
          </nav>
        </header>

        <main className="flex-grow container mx-auto px-4 py-8 md:py-12 flex flex-col items-center">
          {children}

          {/* Expandable Article Section */}
          <div className="w-full max-w-4xl mx-auto mt-16 p-6 md:p-8 bg-black/20 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/10">
            <div className={`transition-all duration-700 ease-in-out overflow-hidden ${isArticleExpanded ? 'max-h-[5000px]' : 'max-h-24 relative'}`}>
              <SeoArticleModalContent />
              {!isArticleExpanded && (
                <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-slate-950/50 via-slate-950/50 to-transparent"></div>
              )}
            </div>
            <button 
              onClick={() => setIsArticleExpanded(!isArticleExpanded)}
              className="mt-4 text-yellow-400 hover:text-yellow-300 font-semibold transition-colors"
            >
              {isArticleExpanded ? 'Show Less' : 'Read More...'}
            </button>
          </div>
        </main>

        <footer className="w-full p-4 text-center backdrop-blur-sm mt-auto border-t border-white/10">
            <p className="text-gray-400 text-sm">
                <a href="https://github.com/hsinidev" target="_blank" rel="noopener noreferrer" className="font-bold" style={{color: '#FFD700'}}>
                    Powered by HSINI MOHAMED
                </a>
                {' | '}
                <a href="http://doodax.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-300 transition-colors">doodax.com</a>
                {' | '}
                <a href="mailto:hsini.web@gmail.com" className="hover:text-yellow-300 transition-colors">hsini.web@gmail.com</a>
            </p>
        </footer>
      </div>
      
      {activeModal && (
        <Modal isOpen={!!activeModal} onClose={closeModal}>
          {modalContents[activeModal]}
        </Modal>
      )}
    </div>
  );
};

export default Layout;