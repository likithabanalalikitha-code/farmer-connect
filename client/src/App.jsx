import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { AIProvider } from './context/AIContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import FloatingAIAssistant from './components/ai/FloatingAIAssistant';
import { ToastContainer } from './components/common/Toast';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <AIProvider>
              <Router>
                <div className="flex flex-col min-h-screen">
                  {/* Sticky Responsive Header */}
                  <Navbar />

                  {/* Main Page Content */}
                  <main className="flex-1">
                    <AppRoutes />
                  </main>

                  {/* Branded Footer */}
                  <Footer />

                  {/* Floating AI Assistant Widget */}
                  <FloatingAIAssistant />

                  {/* Global Toast Alerts */}
                  <ToastContainer />
                </div>
              </Router>
            </AIProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
