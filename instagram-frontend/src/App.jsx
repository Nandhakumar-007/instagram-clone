import { AuthProvider } from "./Services/AuthContext";
import AppRoutes from "./Routes/AppRoutes";
function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;