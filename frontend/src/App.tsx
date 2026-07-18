import AppRouter from "./routes/AppRouter";
import ErrorBoundary from "./components/layout/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <AppRouter />
    </ErrorBoundary>
  );
}

export default App;