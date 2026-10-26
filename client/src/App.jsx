import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { CreateMystery } from "./pages/CreateMystery";
import { InvestigationRoom } from "./pages/InvestigationRoom";
import { Results } from "./pages/Results";

export function App() {
  return (
    <Router>
      <div className="bg-background text-noir-text min-h-screen flex flex-col antialiased">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreateMystery />} />
            <Route path="/cases/:id" element={<InvestigationRoom />} />
            <Route path="/cases/:id/result" element={<Results />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
