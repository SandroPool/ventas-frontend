import React from "react";
import AppRoutes from "./router/AppRoutes";
import { Toaster } from 'react-hot-toast';

const App: React.FC = (): React.JSX.Element => {
  return (
    <div className="min-h-screen dark:bg-dark-base transition-colors">
      <Toaster position="bottom-right" />
      <AppRoutes />
    </div>
  );
}

export default App;
