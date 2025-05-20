import React from 'react'
import SplashPage from '../SplashPage';
import UserGuideSection from '../UserGuideSection';
import Contact from '../Contact/Contact';

const MainPage = () => {
  return (
    <div
      className="main-page">
      <SplashPage />
      <UserGuideSection />
      <Contact/>
    </div>
  );
}

export default MainPage