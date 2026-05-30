import React, { useState } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { Lock, Unlock, Settings, X, ShieldAlert, KeyRound } from 'lucide-react';

export const AdminBar: React.FC = () => {
  const { isEditMode, setEditMode } = useDatabase();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const ADMIN_PASSWORD = "0623";

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setEditMode(true);
      setShowPasswordModal(false);
      setPassword('');
      setErrorMessage(null);
    } else {
      setErrorMessage("비밀번호가 올바르지 않습니다.");
    }
  };

  const handleExitEditMode = () => {
    setEditMode(false);
  };

  return (
    <>
      {/* Sticky Edit Mode Active Banner */}
      {isEditMode && (
        <div className="fixed top-0 left-0 right-0 z-[80] bg-primary-container text-surface-container-lowest font-headline font-bold text-center py-2.5 px-4 shadow-lg flex items-center justify-center gap-4 text-xs tracking-wider animate-bounce-short">
          <span className="flex items-center gap-1.5 uppercase">
            <Unlock size={14} className="animate-pulse" />
            관리자 편집 모드가 활성화되었습니다.
          </span>
          <button 
            onClick={handleExitEditMode}
            className="bg-surface-container-lowest text-primary-container hover:bg-surface-container-lowest/90 px-3 py-1 rounded font-mono text-[10px] uppercase font-bold transition-all shadow border border-primary-container"
          >
            편집 종료
          </button>
        </div>
      )}

      {/* Floating Launcher Trigger Widgets (Bottom-Right) */}
      <div className="fixed bottom-6 right-6 z-[90] flex flex-col gap-3">
        {isEditMode ? (
          <button 
            onClick={handleExitEditMode}
            title="편집 종료"
            className="w-12 h-12 bg-primary-container text-surface-container-lowest hover:scale-105 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-all cursor-pointer"
          >
            <Unlock size={20} />
          </button>
        ) : (
          <button 
            onClick={() => {
              setErrorMessage(null);
              setShowPasswordModal(true);
            }}
            title="관리자 설정"
            className="w-12 h-12 bg-surface-container border border-[#112240] text-primary-container hover:text-white hover:border-primary-container hover:scale-105 rounded-full flex items-center justify-center shadow-lg transition-all cursor-pointer"
          >
            <Lock size={18} />
          </button>
        )}
      </div>

      {/* Authentication Dialog Overlay */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-surface-container-lowest/85 backdrop-blur-md">
          <div className="w-full max-w-sm glass-panel card-border rounded-xl shadow-2xl p-6 relative">
            <button 
              onClick={() => setShowPasswordModal(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-white transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex flex-col items-center gap-2 mb-6 text-center">
              <div className="w-12 h-12 rounded-full bg-primary-container/10 flex items-center justify-center text-primary-container border border-primary-container/30">
                <KeyRound size={22} />
              </div>
              <h3 className="font-headline text-lg font-bold text-primary-fixed">
                관리자 비밀번호 입력
              </h3>
              <p className="text-xs text-on-surface-variant">
                포트폴리오 콘텐츠의 편집 시스템에 접속합니다.
              </p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <input 
                  type="password"
                  placeholder="비밀번호 입력 (기본: 1234)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-surface-variant rounded-lg px-4 py-2.5 text-center text-on-surface focus:border-primary-container focus:outline-none"
                  autoFocus
                  required
                />
              </div>

              {errorMessage && (
                <div className="flex items-center gap-1.5 text-red-400 text-xs justify-center bg-red-950/20 border border-red-500/20 py-2 rounded-lg">
                  <ShieldAlert size={14} />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="flex items-center gap-2.5">
                <button 
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 py-2 bg-transparent text-on-surface-variant border border-surface-variant rounded-lg hover:border-white hover:text-white transition-colors text-xs font-semibold"
                >
                  닫기
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2 bg-primary-container hover:bg-primary-container/80 text-surface-container-lowest font-bold rounded-lg transition-colors text-xs"
                >
                  제출하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
