import "./App.css";
import { AuthorizationContextProvider } from "./authorization-context";
import PageContent from "./features/page-content"

function App() {
  return (
    <AuthorizationContextProvider>
      <PageContent />
    </AuthorizationContextProvider>
  );
}

export default App;
