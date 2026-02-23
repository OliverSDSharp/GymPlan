import { useState, useRef } from 'react';
import { Header } from '../components/layout/Header';
import { Button } from '../components/common/Button';
import { useTheme, type Theme } from '../context/ThemeContext';
import { useAppStore } from '../context/AppContext';
import { AI_PROVIDERS, type AIProvider } from '../types/ai';
import { testAIKey } from '../utils/ai-client';
import {
  Settings,
  Sun,
  Moon,
  Monitor,
  Download,
  Upload,
  Trash2,
  Eye,
  EyeOff,
  Key,
  Check,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Section wrapper
// ---------------------------------------------------------------------------

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-bold uppercase tracking-wide text-text-muted mb-2">
      {children}
    </h2>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-bg-secondary rounded-xl border border-border-primary p-4">
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Per-provider test state
// ---------------------------------------------------------------------------

type TestStatus = 'idle' | 'loading' | 'success' | 'error';

interface ProviderTestState {
  status: TestStatus;
  message: string;
}

const INITIAL_TEST_STATE: ProviderTestState = { status: 'idle', message: '' };

// ---------------------------------------------------------------------------
// Settings Page
// ---------------------------------------------------------------------------

export function SettingsPage() {
  // --- App store ---
  const aiKeys = useAppStore((s) => s.aiKeys);
  const activeAIProvider = useAppStore((s) => s.activeAIProvider);
  const setAIKey = useAppStore((s) => s.setAIKey);
  const setActiveAIProvider = useAppStore((s) => s.setActiveAIProvider);
  const userHeight = useAppStore((s) => s.userHeight);
  const setUserHeight = useAppStore((s) => s.setUserHeight);

  // --- Theme ---
  const { theme, setTheme } = useTheme();

  // --- Local state ---
  const [keyInputs, setKeyInputs] = useState<Record<AIProvider, string>>(
    () => ({ ...aiKeys }),
  );
  const [showKeys, setShowKeys] = useState<Record<AIProvider, boolean>>({
    anthropic: false,
    google: false,
    openai: false,
    xai: false,
  });
  const [testStates, setTestStates] = useState<
    Record<AIProvider, ProviderTestState>
  >({
    anthropic: { ...INITIAL_TEST_STATE },
    google: { ...INITIAL_TEST_STATE },
    openai: { ...INITIAL_TEST_STATE },
    xai: { ...INITIAL_TEST_STATE },
  });
  const [goalWeight, setGoalWeight] = useState(() => {
    try {
      const stored = localStorage.getItem('goal_weight');
      return stored ? Number(JSON.parse(stored)) : 80;
    } catch {
      return 80;
    }
  });
  const [confirmClear, setConfirmClear] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Handlers ---

  function handleHeightChange(value: string) {
    const num = Number(value);
    if (!isNaN(num) && num >= 0) {
      setUserHeight(num);
    }
  }

  function handleGoalWeightChange(value: string) {
    const num = Number(value);
    if (!isNaN(num) && num >= 0) {
      setGoalWeight(num);
      try {
        localStorage.setItem('goal_weight', JSON.stringify(num));
      } catch {}
    }
  }

  function handleKeyInputChange(provider: AIProvider, value: string) {
    setKeyInputs((prev) => ({ ...prev, [provider]: value }));
  }

  function handleKeySave(provider: AIProvider) {
    setAIKey(provider, keyInputs[provider].trim());
  }

  function toggleShowKey(provider: AIProvider) {
    setShowKeys((prev) => ({ ...prev, [provider]: !prev[provider] }));
  }

  async function handleTestKey(provider: AIProvider) {
    const key = keyInputs[provider].trim();
    if (!key) {
      setTestStates((prev) => ({
        ...prev,
        [provider]: { status: 'error' as const, message: 'Please enter an API key first.' },
      }));
      return;
    }

    setTestStates((prev) => ({
      ...prev,
      [provider]: { status: 'loading' as const, message: '' },
    }));

    const result = await testAIKey(provider, key);

    setTestStates((prev) => ({
      ...prev,
      [provider]: {
        status: result.ok ? ('success' as const) : ('error' as const),
        message: result.message,
      },
    }));

    // Persist the key if the test succeeded
    if (result.ok) {
      setAIKey(provider, key);
    }
  }

  function handleExport() {
    const data: Record<string, unknown> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        try {
          data[key] = JSON.parse(localStorage.getItem(key) ?? '');
        } catch {
          data[key] = localStorage.getItem(key);
        }
      }
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gymplan-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (typeof data !== 'object' || data === null) {
          alert('Invalid backup file format.');
          return;
        }
        for (const [key, value] of Object.entries(data)) {
          localStorage.setItem(
            key,
            typeof value === 'string' ? value : JSON.stringify(value),
          );
        }
        alert('Data imported successfully! Reloading...');
        window.location.reload();
      } catch {
        alert('Failed to parse backup file.');
      }
    };
    reader.readAsText(file);

    // Reset file input so the same file can be re-imported
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  function handleClearAll() {
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }
    localStorage.clear();
    window.location.reload();
  }

  // --- Theme buttons config ---
  const themeOptions: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: 'Light', icon: <Sun size={16} /> },
    { value: 'dark', label: 'Dark', icon: <Moon size={16} /> },
    { value: 'system', label: 'System', icon: <Monitor size={16} /> },
  ];

  return (
    <div className="pb-4">
      {/* Header */}
      <Header
        title="Settings"
        phaseColor="text-text-primary"
        rightAction={
          <div className="w-9 h-9 rounded-full bg-bg-tertiary flex items-center justify-center">
            <Settings size={18} className="text-text-secondary" />
          </div>
        }
      />

      <div className="px-4 space-y-4">
        {/* ----------------------------------------------------------------- */}
        {/* Profile Section                                                   */}
        {/* ----------------------------------------------------------------- */}
        <div>
          <SectionTitle>Profile</SectionTitle>
          <Card>
            <div className="space-y-3">
              {/* Height */}
              <div>
                <label
                  htmlFor="height-input"
                  className="block text-sm font-medium text-text-primary mb-1"
                >
                  Height (cm)
                </label>
                <input
                  id="height-input"
                  type="number"
                  min={0}
                  max={300}
                  value={userHeight}
                  onChange={(e) => handleHeightChange(e.target.value)}
                  className="w-full rounded-lg border border-border-primary bg-bg-primary px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="180"
                />
              </div>

              {/* Goal Weight */}
              <div>
                <label
                  htmlFor="goal-weight-input"
                  className="block text-sm font-medium text-text-primary mb-1"
                >
                  Goal Weight (kg)
                </label>
                <input
                  id="goal-weight-input"
                  type="number"
                  min={0}
                  max={500}
                  value={goalWeight}
                  onChange={(e) => handleGoalWeightChange(e.target.value)}
                  className="w-full rounded-lg border border-border-primary bg-bg-primary px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="80"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* AI Provider Section                                               */}
        {/* ----------------------------------------------------------------- */}
        <div>
          <SectionTitle>AI Provider</SectionTitle>

          {/* Active provider selector – pill buttons */}
          <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1">
            {AI_PROVIDERS.map((p) => {
              const isActive = activeAIProvider === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setActiveAIProvider(p.id)}
                  className={[
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border',
                    isActive
                      ? 'bg-blue-600 text-white border-transparent'
                      : 'bg-bg-secondary text-text-secondary border-border-primary hover:text-text-primary hover:bg-bg-tertiary',
                  ].join(' ')}
                >
                  <span>{p.icon}</span>
                  <span>{p.label.split(' (')[0]}</span>
                  {isActive && <Check size={12} className="ml-0.5" />}
                </button>
              );
            })}
          </div>

          {/* Provider key cards */}
          <div className="space-y-3">
            {AI_PROVIDERS.map((p) => {
              const isActive = activeAIProvider === p.id;
              const ts = testStates[p.id];
              const hasKey = !!keyInputs[p.id].trim();

              return (
                <div
                  key={p.id}
                  className={[
                    'bg-bg-secondary rounded-xl border p-4 transition-colors',
                    isActive
                      ? 'border-blue-500/50 ring-1 ring-blue-500/20'
                      : 'border-border-primary',
                  ].join(' ')}
                >
                  {/* Card header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{p.icon}</span>
                      <div>
                        <span className="text-sm font-medium text-text-primary">
                          {p.label}
                        </span>
                        <span className="block text-[11px] text-text-muted">
                          Model: {p.model}
                        </span>
                      </div>
                    </div>
                    {isActive && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </div>

                  {/* Key input */}
                  <div className="relative mb-2">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Key size={14} className="text-text-muted" />
                    </div>
                    <input
                      type={showKeys[p.id] ? 'text' : 'password'}
                      value={keyInputs[p.id]}
                      onChange={(e) => handleKeyInputChange(p.id, e.target.value)}
                      onBlur={() => handleKeySave(p.id)}
                      className="w-full rounded-lg border border-border-primary bg-bg-primary pl-9 pr-10 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-mono"
                      placeholder={p.placeholder}
                    />
                    <button
                      type="button"
                      onClick={() => toggleShowKey(p.id)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-muted hover:text-text-primary transition-colors"
                      aria-label={showKeys[p.id] ? 'Hide API key' : 'Show API key'}
                    >
                      {showKeys[p.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  {/* Actions row */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleTestKey(p.id)}
                      disabled={ts.status === 'loading' || !hasKey}
                    >
                      {ts.status === 'loading' ? 'Testing...' : 'Test Key'}
                    </Button>

                    {!isActive && hasKey && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveAIProvider(p.id)}
                      >
                        Set Active
                      </Button>
                    )}

                    {ts.status === 'success' && (
                      <span className="text-xs text-green-500 font-medium">
                        {ts.message}
                      </span>
                    )}
                    {ts.status === 'error' && (
                      <span className="text-xs text-red-500 font-medium truncate max-w-[200px]">
                        {ts.message}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Appearance                                                        */}
        {/* ----------------------------------------------------------------- */}
        <div>
          <SectionTitle>Appearance</SectionTitle>
          <Card>
            <div className="flex gap-2">
              {themeOptions.map((opt) => {
                const isActive = theme === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setTheme(opt.value)}
                    className={[
                      'flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors border',
                      isActive
                        ? 'bg-blue-600 text-white border-transparent'
                        : 'bg-bg-primary text-text-secondary border-border-primary hover:text-text-primary hover:bg-bg-tertiary',
                    ].join(' ')}
                  >
                    {opt.icon}
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Data Management                                                   */}
        {/* ----------------------------------------------------------------- */}
        <div>
          <SectionTitle>Data Management</SectionTitle>
          <Card>
            <div className="space-y-2">
              {/* Export */}
              <Button
                variant="secondary"
                size="md"
                fullWidth
                icon={<Download size={16} />}
                onClick={handleExport}
              >
                Export All Data
              </Button>

              {/* Import */}
              <Button
                variant="secondary"
                size="md"
                fullWidth
                icon={<Upload size={16} />}
                onClick={() => fileInputRef.current?.click()}
              >
                Import Data
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />

              {/* Clear All */}
              <Button
                variant={confirmClear ? 'danger' : 'secondary'}
                size="md"
                fullWidth
                icon={<Trash2 size={16} />}
                onClick={handleClearAll}
                onBlur={() => setConfirmClear(false)}
              >
                {confirmClear ? 'Confirm Clear All Data' : 'Clear All Data'}
              </Button>
              {confirmClear && (
                <p className="text-xs text-red-500 text-center">
                  This will permanently delete all your data. Click again to confirm.
                </p>
              )}
            </div>
          </Card>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* About                                                             */}
        {/* ----------------------------------------------------------------- */}
        <div>
          <SectionTitle>About</SectionTitle>
          <Card>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-text-primary">GymPlan Pro</h3>
              <p className="text-sm text-text-muted">Version 2.0.0</p>
              <p className="text-xs text-text-muted">
                Built with React + Vite + Tailwind
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
