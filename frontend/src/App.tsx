import AppRouter from "./routes/AppRouter";
import ErrorBoundary from "./components/ErrorBoundary";
import SessionExpiredModal from "./components/ui/SessionExpiredModal";

function App() {
  return (
    <ErrorBoundary>
      <AppRouter />
      <SessionExpiredModal />
    </ErrorBoundary>
  );
}

export default App;