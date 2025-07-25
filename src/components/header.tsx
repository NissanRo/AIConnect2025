'use client';

import type { FC } from 'react';

interface HeaderProps {
  onLogoClick: () => void;
}

const Header: FC<HeaderProps> = ({ onLogoClick }) => {
  return (
    <header className="text-center my-12">
      <h1
        id="logo"
        className="text-4xl md:text-6xl font-black bg-[linear-gradient(to_right,#3b82f6,#f97316,#10b981,#ec4899)] bg-clip-text text-transparent cursor-pointer"
        onClick={onLogoClick}
        title="Hint: Click 5 times for admin login"
      >
        AI Connect
      </h1>
      <p className="mt-4 text-xl md:text-2xl font-light text-muted-foreground">
        AI &amp; Automation Intern Projects – 2025
      </p>
    </header>
  );
};

export default Header;
