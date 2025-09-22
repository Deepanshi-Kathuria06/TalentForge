import { useState } from "react";

const Settings = () => {
  const [activeCategory, setActiveCategory] = useState("account");

  const menu = [
    { key: "account", label: "Account preferences", icon: "👤" },
    { key: "security", label: "Sign in & security", icon: "🔒" },
    { key: "visibility", label: "Visibility", icon: "👁️" },
    { key: "privacy", label: "Data privacy", icon: "🛡️" },
    { key: "ads", label: "Advertising data", icon: "💳" },
    { key: "notifications", label: "Notifications", icon: "🔔" },
  ];

  // Category content
  const renderContent = () => {
    switch (activeCategory) {
      case "account":
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Account Preferences</h2>
            <div className="space-y-4">
              <div className="bg-white shadow rounded-md p-4">
                <h3 className="font-medium">Profile Information</h3>
                <p className="text-gray-600">Name, location, and industry</p>
              </div>
              <div className="bg-white shadow rounded-md p-4">
                <h3 className="font-medium">Display</h3>
                <p className="text-gray-600">Dark mode</p>
              </div>
              <div className="bg-white shadow rounded-md p-4">
                <h3 className="font-medium">General Preferences</h3>
                <ul className="text-gray-600">
                  <li>Language</li>
                  <li>Content language</li>
                  <li>Autoplay videos</li>
                  <li>Sound effects</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case "security":
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Sign in & Security</h2>
            <div className="space-y-4">
              <div className="bg-white shadow rounded-md p-4">
                <h3 className="font-medium">Password</h3>
                <p className="text-gray-600">Change or update your password</p>
              </div>
              <div className="bg-white shadow rounded-md p-4">
                <h3 className="font-medium">Two-step verification</h3>
                <p className="text-gray-600">Add an extra layer of security</p>
              </div>
            </div>
          </div>
        );

      case "visibility":
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Visibility</h2>
            <div className="space-y-4">
              <div className="bg-white shadow rounded-md p-4">
                <h3 className="font-medium">Profile Viewing</h3>
                <p className="text-gray-600">Choose who can see your profile</p>
              </div>
              <div className="bg-white shadow rounded-md p-4">
                <h3 className="font-medium">Connections</h3>
                <p className="text-gray-600">Manage who can view your connections</p>
              </div>
            </div>
          </div>
        );

      case "privacy":
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Data Privacy</h2>
            <div className="space-y-4">
              <div className="bg-white shadow rounded-md p-4">
                <h3 className="font-medium">Download your data</h3>
                <p className="text-gray-600">Request a copy of your account data</p>
              </div>
              <div className="bg-white shadow rounded-md p-4">
                <h3 className="font-medium">Ad Preferences</h3>
                <p className="text-gray-600">Control how ads are shown to you</p>
              </div>
            </div>
          </div>
        );

      case "ads":
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Advertising Data</h2>
            <div className="space-y-4">
              <div className="bg-white shadow rounded-md p-4">
                <h3 className="font-medium">Ad interests</h3>
                <p className="text-gray-600">See and manage your ad interests</p>
              </div>
              <div className="bg-white shadow rounded-md p-4">
                <h3 className="font-medium">Third-party data</h3>
                <p className="text-gray-600">Manage data shared with advertisers</p>
              </div>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Notifications</h2>
            <div className="space-y-4">
              <div className="bg-white shadow rounded-md p-4">
                <h3 className="font-medium">Email Notifications</h3>
                <p className="text-gray-600">Manage what updates you get via email</p>
              </div>
              <div className="bg-white shadow rounded-md p-4">
                <h3 className="font-medium">Push Notifications</h3>
                <p className="text-gray-600">Control mobile and web push alerts</p>
              </div>
            </div>
          </div>
        );

      default:
        return <p>Select a setting from the sidebar</p>;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r p-4">
        <h2 className="text-xl font-semibold mb-4">Settings</h2>
        <ul className="space-y-2">
          {menu.map((item) => (
            <li
              key={item.key}
              className={`flex items-center space-x-2 cursor-pointer px-3 py-2 rounded-md ${
                activeCategory === item.key
                  ? "bg-green-100 text-green-700"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => setActiveCategory(item.key)}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Right content */}
      <div className="flex-1 p-6">{renderContent()}</div>
    </div>
  );
};

export default Settings;
