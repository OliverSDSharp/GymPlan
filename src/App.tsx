import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/layout/Layout';
import { CommandPalette } from './components/common/CommandPalette';
import { WorkoutsPage } from './pages/WorkoutsPage';
import { LibraryPage } from './pages/LibraryPage';
import { NutritionPage } from './pages/NutritionPage';
import { MilestonesPage } from './pages/MilestonesPage';
import { SettingsPage } from './pages/SettingsPage';
import { HistoryPage } from './pages/HistoryPage';

export function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <CommandPalette />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/workouts" replace />} />
            <Route path="/workouts" element={<WorkoutsPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/nutrition" element={<NutritionPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/milestones" element={<MilestonesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </AppProvider>
    </ThemeProvider>
  );
}
