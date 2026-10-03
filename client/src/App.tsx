import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Careers from "./pages/Careers";
import NlpTransformers from "./pages/NlpTransformers";
import EnterpriseSaasErp from "./pages/EnterpriseSaasErp";
import MedicalAiSystems from "./pages/MedicalAiSystems";
import BackendEngineering from "./pages/BackendEngineering";
import ModelDeployment from "./pages/ModelDeployment";
import AiConsulting from "./pages/AiConsulting";
import ProjectDetail from "./pages/ProjectDetail";
import ArticleDetail from "./pages/ArticleDetail";
import Certifications from "./pages/Certifications";
import Admin from "./pages/Admin";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/careers"} component={Careers} />
      <Route path={"/nlp-transformers"} component={NlpTransformers} />
      <Route path={"/enterprise-saas-erp"} component={EnterpriseSaasErp} />
      <Route path={"/medical-ai-systems"} component={MedicalAiSystems} />
      <Route path={"/backend-engineering"} component={BackendEngineering} />
      <Route path={"/model-deployment"} component={ModelDeployment} />
      <Route path={"/ai-consulting"} component={AiConsulting} />
      <Route path={"/admin"} component={Admin} />
      <Route path={"/projects/:slug"} component={ProjectDetail} />
      <Route path={"/articles/:slug"} component={ArticleDetail} />
      <Route path={"/certifications"} component={Certifications} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
