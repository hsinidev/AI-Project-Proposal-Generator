
import React from 'react';
import Layout from './components/Layout';
import ProposalForm from './components/ProposalForm';

const App: React.FC = () => {
  return (
    <Layout>
      <div className="w-full max-w-4xl mx-auto p-4 md:p-8">
        <ProposalForm />
      </div>
    </Layout>
  );
};

export default App;
