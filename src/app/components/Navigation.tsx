import React from "react";

export default function Nav() {
    
    return(
<header className="fixed w-full bg-white/80 backdrop-blur-md shadow-sm z-50">
<nav className="container mx-auto px-6 py-4">
  <div className="flex justify-between items-center">
    <a href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Tylz.AI</a>
    <div className="hidden md:flex items-center space-x-8">
      <a href="/" className="text-gray-700 hover:text-blue-600 transition-colors">Home</a>
      <a href="/pricing" className="text-gray-700 hover:text-blue-600 transition-colors">Pricing</a>
      <a href="/account" className="text-gray-700 hover:text-blue-600 transition-colors">Login</a>
      <a href="/account" className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg">
        Sign Up Free
      </a>
    </div>
  </div>
</nav>
</header>
)
}
