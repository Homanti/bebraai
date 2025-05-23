import { routes } from "./routes.tsx";
import { useRoutes } from "react-router-dom";

function App() {
  return useRoutes(routes);
}

export default App