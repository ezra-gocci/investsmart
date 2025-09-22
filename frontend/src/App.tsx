import { useState, useEffect } from 'react';
import { LanguageProvider } from './translations/LanguageContext.tsx';
import TopBar from './components/Layout/TopBar.tsx';
import MainContent from './components/Layout/MainContent.tsx';
import TextContent from './components/Layout/TextContent.tsx';
import ManageContent from './components/Layout/ManageContent.tsx';

function App() {
  // Initialize login state from localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const savedLoginState = localStorage.getItem('isLoggedIn');
    return savedLoginState === 'true';
  });
  const [activeSection, setActiveSection] = useState('header');

  // Save login state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn.toString());
  }, [isLoggedIn]);

  const handleAuthClick = () => {
    setIsLoggedIn(!isLoggedIn);
    // Set activeSection to 'header' when logging in to show the header at the top
    setActiveSection('header');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'text':
        return <TextContent />;
      case 'manage':
        return <ManageContent />;
      case 'calculate':
      case 'recommend':
      case 'explain':
      default:
        return <MainContent activeSection={activeSection} isLoggedIn={isLoggedIn} />;
    }
  };

  return (
    <LanguageProvider>
      <div className="flex min-h-screen w-full flex-col bg-gray-50 dark:bg-gray-900">
        <TopBar 
          isLoggedIn={isLoggedIn}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          onAuthClick={handleAuthClick}
        />
        {renderContent()}
      </div>
    </LanguageProvider>
  );
}

export default App;