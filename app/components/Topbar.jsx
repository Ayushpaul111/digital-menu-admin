import { Menu } from "lucide-react";

const TopBar = ({ title = "Welcome Back!", onMenuClick }) => {
  return (
    <header className="sticky top-0 z-20 bg-white shadow-sm border-b p-4 flex items-center justify-between md:justify-end">
      <button
        className="md:hidden text-gray-700 hover:text-gray-900 transition-colors"
        onClick={onMenuClick}
      >
        <Menu size={24} />
      </button>
      <h1 className="hidden md:block font-semibold text-gray-800 text-xl">
        {title}
      </h1>
    </header>
  );
};

export default TopBar;
