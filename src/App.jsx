import { Route, Switch, Redirect, Router } from "wouter";
import { FinanceProvider, useFinance } from "./context/FinanceContext";
import Welcome from "./pages/Welcome";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Accounts from "./pages/Accounts";
import Budgets from "./pages/Budgets";
import Goals from "./pages/Goals";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

function Routes() {
  const { preferences } = useFinance();

  return (
    <Router base="/Expense-Tracker-App/">
      <Switch>
        <Route path="/">
          <>
            {preferences.onboardingComplete ? (
              <Redirect to="/dashboard" />
            ) : (
              <Welcome />
            )}
          </>
        </Route>

        <Route path="/dashboard">
          <Dashboard />
        </Route>

        <Route path="/transactions">
          <Transactions />
        </Route>

        <Route path="/accounts">
          <Accounts />
        </Route>

        <Route path="/budgets">
          <Budgets />
        </Route>

        <Route path="/goals">
          <Goals />
        </Route>

        <Route path="/reports">
          <Reports />
        </Route>

        <Route path="/settings">
          <Settings />
        </Route>

        <Route>
          <Redirect to={preferences.onboardingComplete ? "/dashboard" : "/"} />
        </Route>
      </Switch>
    </Router>
  );
}

export default function App() {
  return (
    <FinanceProvider>
      <Routes />
    </FinanceProvider>
  );
}
