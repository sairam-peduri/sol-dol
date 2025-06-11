import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="bg-indigo-100 h-full w-64 p-5 fixed left-0 top-0 shadow-lg">
      <h2 className="text-2xl font-bold text-indigo-800 mb-6">🌱 FarmSave</h2>
      <nav className="flex flex-col space-y-4">
        <Link to="/" className="hover:text-indigo-600">🏠 Dashboard</Link>
        <Link to="/deposit" className="hover:text-indigo-600">💰 Deposit</Link>
        <Link to="/withdraw" className="hover:text-indigo-600">🏧 Withdraw</Link>
        <Link to="/transactions" className="hover:text-indigo-600">📜 Transactions</Link>
        <Link to="/profile" className="hover:text-indigo-600">👤 Profile</Link>
      </nav>
    </div>
  );
}
