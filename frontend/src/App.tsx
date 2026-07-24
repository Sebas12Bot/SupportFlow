import { BrowserRouter } from "react-router-dom";
import AppRouter from "./routes/AppRouter";
import ErrorBoundary from "./components/ErrorBoundary";
import SessionExpiredModal from "./components/ui/SessionExpiredModal";

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AppRouter />
        <SessionExpiredModal />
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;