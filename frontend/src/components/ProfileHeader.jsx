import Logo from "./Logo";

export default function ProfileHeader() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between max-w-7xl mx-auto p-4 gap-4 md:px-8">
        <div className="flex items-center gap-4">
          <Logo />
          <div className="h-8 w-px bg-gray-300 hidden sm:block"></div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Profile Settings</h1>
        </div>
      </div>
    </header>
  );
}
