import InvestmentCalculator from './InvestmentCalculator';
import { LanguageProvider } from './contexts/LanguageContext';

function App() {
  return (
    <LanguageProvider>
      <InvestmentCalculator />
    </LanguageProvider>
  );
}

export default App;
