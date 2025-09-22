import React from 'react';

interface TopBarSessionProps {
  isLoggedIn: boolean;
  onAuthClick: () => void;
  t: (key: string) => string;
}

const TopBarSession: React.FC<TopBarSessionProps> = ({ isLoggedIn, onAuthClick, t }) => {
  return (
    <>
      <button
        onClick={onAuthClick}
        className="flex h-10 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-green-500 px-6 text-sm font-bold text-gray-900"
      >
        {isLoggedIn ? (
          <>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="truncate">{t('nav.logout')}</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            <span className="truncate">{t('nav.login')}</span>
          </>
        )}
      </button>
      {isLoggedIn && (
        <div className="h-10 w-10">
          <img 
            alt="User avatar" 
            className="h-full w-full rounded-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdPu9rY0hwR6x9CATWUSew-bKuZ3RLO_pMWJc8VmTEMeNNLP94ysetVfX2B6V7_nrwd4DZWnqTguLl9GYXPUnofJrgdcGYewH-T_Ot5G_eM0dO6Y1SS-pRbaN1UJfk0OdnpHtJ1rNADdc1aEy_1BTEc0Lpki5q9Gn13FdQaXu6CKYpCgzfmCpJUBY-JDBT7x1MFfPzq_DTxeUTxQJJmjVMaOdsq6SEQ0iOMeHHnBrdNMe9UwmbxZBtA6X1b2rUwQCN-8Dm05wq8A"
          />
        </div>
      )}
    </>
  );
};

export default TopBarSession;