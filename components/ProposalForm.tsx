import React, { useState, useCallback } from 'react';
import { ProposalData } from '../types';
import { generateProposal } from '../services/geminiService';
import ClipboardIcon from './icons/ClipboardIcon';

const ProposalForm: React.FC = () => {
  const [formData, setFormData] = useState<ProposalData>({
    goal: '',
    audience: 'Internal Management Team',
    deliverables: ['Project Plan Document', 'Working Prototype', 'Final Report'],
    budget: 5000,
    timeline: 6,
    timelineUnit: 'Weeks',
  });
  const [generatedProposal, setGeneratedProposal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleDeliverableChange = useCallback((index: number, value: string) => {
    const newDeliverables = [...formData.deliverables];
    newDeliverables[index] = value;
    setFormData(prev => ({ ...prev, deliverables: newDeliverables }));
  }, [formData.deliverables]);

  const addDeliverable = useCallback(() => {
    if (formData.deliverables.length < 5) {
      setFormData(prev => ({ ...prev, deliverables: [...prev.deliverables, ''] }));
    }
  }, [formData.deliverables.length]);
  
  const removeDeliverable = useCallback((index: number) => {
    if (formData.deliverables.length > 1) {
      const newDeliverables = formData.deliverables.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, deliverables: newDeliverables }));
    }
  }, [formData.deliverables]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setGeneratedProposal('');

    if (!formData.goal.trim()) {
        setError('Project Goal is a required field.');
        setIsLoading(false);
        return;
    }

    try {
      const proposal = await generateProposal(formData);
      setGeneratedProposal(proposal);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedProposal).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  return (
    <div className="bg-black/20 backdrop-blur-lg p-8 md:p-12 rounded-2xl shadow-2xl border border-white/10">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-300">Let's Build Your Proposal</h2>
        <p className="text-gray-400 mt-3">Fill in the details below, and let our AI craft a professional draft for you.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label htmlFor="goal" className="block text-sm font-medium text-gray-300 mb-2">Project Goal (CRITICAL INPUT)</label>
          <textarea
            id="goal"
            name="goal"
            rows={5}
            value={formData.goal}
            onChange={handleInputChange}
            placeholder="e.g., Develop a new e-commerce platform to increase online sales by 30% within the next fiscal year."
            className="w-full bg-white/5 border border-white/10 rounded-md p-3 text-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            required
          />
        </div>

        <div>
          <label htmlFor="audience" className="block text-sm font-medium text-gray-300 mb-2">Target Audience / Client</label>
          <input
            type="text"
            id="audience"
            name="audience"
            value={formData.audience}
            onChange={handleInputChange}
            className="w-full bg-white/5 border border-white/10 rounded-md p-3 text-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
          />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Key Deliverables</label>
            <div className="space-y-3">
                {formData.deliverables.map((d, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <input
                            type="text"
                            value={d}
                            onChange={(e) => handleDeliverableChange(i, e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-md p-3 text-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                        />
                        <button type="button" onClick={() => removeDeliverable(i)} className="p-2 bg-gray-700/50 hover:bg-red-500/50 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors" disabled={formData.deliverables.length <= 1}>
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" /></svg>
                        </button>
                    </div>
                ))}
            </div>
            {formData.deliverables.length < 5 && (
                <button type="button" onClick={addDeliverable} className="mt-3 text-sm text-yellow-400 hover:text-yellow-300 transition-colors">+ Add Deliverable</button>
            )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-300 mb-2">Estimated Budget ($)</label>
                <input
                    type="number"
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-md p-3 text-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                />
            </div>
            <div className="flex items-end gap-2">
                <div className="flex-grow">
                    <label htmlFor="timeline" className="block text-sm font-medium text-gray-300 mb-2">Estimated Timeline</label>
                    <input
                        type="number"
                        id="timeline"
                        name="timeline"
                        value={formData.timeline}
                        onChange={handleInputChange}
                        className="w-full bg-white/5 border border-white/10 rounded-md p-3 text-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                    />
                </div>
                <select name="timelineUnit" value={formData.timelineUnit} onChange={handleInputChange} className="h-[46px] bg-white/5 border border-white/10 rounded-md p-3 text-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition">
                    <option>Weeks</option>
                    <option>Months</option>
                </select>
            </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-gray-900 font-bold py-4 px-4 rounded-lg text-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-300/50 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center shadow-lg hover:shadow-yellow-400/20"
          >
            {isLoading ? (
                <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                </>
            ) : "Generate Proposal Draft"}
          </button>
        </div>
      </form>
      
      {error && <p className="mt-4 text-center text-red-400">{error}</p>}

      {(generatedProposal || isLoading) && (
        <div className="mt-10 pt-8 border-t border-white/10">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl md:text-2xl font-bold text-gray-100">Generated Proposal</h3>
                {generatedProposal && (
                    <button onClick={handleCopy} className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                      <ClipboardIcon className="w-5 h-5"/>
                      <span>{copySuccess ? 'Copied!' : 'Copy'}</span>
                    </button>
                )}
            </div>
            <div className="relative w-full h-96 bg-white/5 border border-white/10 rounded-md p-1">
                {isLoading && !generatedProposal && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-gray-400">Generating your proposal...</p>
                    </div>
                )}
                <textarea
                    readOnly
                    value={generatedProposal}
                    placeholder="AI-generated proposal will appear here..."
                    className="w-full h-full bg-transparent border-none rounded-md p-3 text-gray-200 resize-none focus:ring-0"
                />
            </div>
        </div>
      )}
    </div>
  );
};

export default ProposalForm;