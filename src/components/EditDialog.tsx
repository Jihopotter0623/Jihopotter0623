import React, { useState, useEffect } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { AboutData, ExperienceData, SkillData, CertificationData, PortfolioData } from '../types';
import { X, Upload, Loader2, Check, AlertCircle } from 'lucide-react';

interface EditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'about' | 'experience' | 'skill' | 'certification' | 'portfolio';
  item: any; // ExperienceData, SkillData, CertificationData, PortfolioData, or null (for adding)
}

export const EditDialog: React.FC<EditDialogProps> = ({ isOpen, onClose, type, item }) => {
  const { 
    uploadFile, 
    updateAbout, 
    saveExperience, 
    saveSkill, 
    saveCertification, 
    savePortfolioItem 
  } = useDatabase();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Upload states
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);

  // Local Form state
  const [aboutForm, setAboutForm] = useState<AboutData>({
    title: '',
    aboutTitle: '',
    aboutSubtitle: '',
    aboutDescription: '',
    aboutGoal: '',
    aboutImageUrl: ''
  });

  const [expForm, setExpForm] = useState({
    title: '',
    description: '',
    sortOrder: 1
  });

  const [skillForm, setSkillForm] = useState({
    name: '',
    sortOrder: 1
  });

  const [certForm, setCertForm] = useState({
    title: '',
    subtitle: '',
    icon: 'military_tech',
    sortOrder: 1
  });

  const [portForm, setPortForm] = useState({
    title: '',
    description: '',
    tags: '',
    imageUrl: '',
    sortOrder: 1,
    isVisible: true
  });

  useEffect(() => {
    setError(null);
    setSuccess(null);
    setUploadProgress(null);
    
    if (type === 'about' && item) {
      setAboutForm({ ...(item as AboutData) });
    } else if (type === 'experience') {
      if (item) {
        setExpForm({
          title: (item as ExperienceData).title,
          description: (item as ExperienceData).description,
          sortOrder: (item as ExperienceData).sortOrder
        });
      } else {
        setExpForm({ title: '', description: '', sortOrder: 1 });
      }
    } else if (type === 'skill') {
      if (item) {
        setSkillForm({
          name: (item as SkillData).name,
          sortOrder: (item as SkillData).sortOrder
        });
      } else {
        setSkillForm({ name: '', sortOrder: 1 });
      }
    } else if (type === 'certification') {
      if (item) {
        setCertForm({
          title: (item as CertificationData).title,
          subtitle: (item as CertificationData).subtitle,
          icon: (item as CertificationData).icon,
          sortOrder: (item as CertificationData).sortOrder
        });
      } else {
        setCertForm({ title: '', subtitle: '', icon: 'military_tech', sortOrder: 1 });
      }
    } else if (type === 'portfolio') {
      if (item) {
        setPortForm({
          title: (item as PortfolioData).title,
          description: (item as PortfolioData).description,
          tags: (item as PortfolioData).tags,
          imageUrl: (item as PortfolioData).imageUrl,
          sortOrder: (item as PortfolioData).sortOrder,
          isVisible: (item as PortfolioData).isVisible
        });
      } else {
        setPortForm({
          title: '',
          description: '',
          tags: 'Sensor, Control, Coding',
          imageUrl: '',
          sortOrder: 1,
          isVisible: true
        });
      }
    }
  }, [isOpen, type, item]);

  if (!isOpen) return null;

  // Handle Drag / File click uploads
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);
    setUploadProgress(0);

    try {
      const folderName = type === 'about' ? 'about' : 'portfolio';
      const downloadUrl = await uploadFile(file, folderName, (progress) => {
        setUploadProgress(Math.round(progress));
      });

      if (type === 'about') {
        setAboutForm(prev => ({ ...prev, aboutImageUrl: downloadUrl }));
      } else if (type === 'portfolio') {
        setPortForm(prev => ({ ...prev, imageUrl: downloadUrl }));
      }
      setSuccess("이미지가 성공적으로 업로드되었습니다!");
    } catch (err: any) {
      setError(err.message || "이미지 전송 과정에 실패했습니다.");
    } finally {
      setUploading(false);
      setUploadProgress(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (type === 'about') {
        await updateAbout(aboutForm);
      } else if (type === 'experience') {
        await saveExperience({
          id: item?.id,
          ...expForm
        });
      } else if (type === 'skill') {
        await saveSkill({
          id: item?.id,
          ...skillForm
        });
      } else if (type === 'certification') {
        await saveCertification({
          id: item?.id,
          ...certForm
        });
      } else if (type === 'portfolio') {
        if (!portForm.imageUrl) {
          throw new Error("포트폴리오 이미지를 업로드해 주세요.");
        }
        await savePortfolioItem({
          id: item?.id,
          ...portForm
        });
      }
      setSuccess("저장되었습니다!");
      setTimeout(() => {
        onClose();
      }, 800);
    } catch (err: any) {
      setError(err.message || "문서 저장 과정에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-surface-container-lowest/80 backdrop-blur-md">
      <div className="w-full max-w-lg glass-panel card-border rounded-xl shadow-2xl relative flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-variant/30">
          <h2 className="font-headline text-lg font-bold text-primary-fixed">
            {type.toUpperCase()} - {item ? "편집 수정" : "새 항목 추가"}
          </h2>
          <button 
            onClick={onClose}
            className="text-on-surface-variant hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="flex-grow overflow-y-auto p-6 space-y-4">
          
          {error && (
            <div className="flex items-start gap-2 bg-red-950/40 border border-red-500/50 p-3 rounded-lg text-red-200 text-sm">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-start gap-2 bg-emerald-950/40 border border-emerald-500/50 p-3 rounded-lg text-emerald-200 text-sm animate-pulse">
              <Check size={16} className="mt-0.5 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Contextual form fields */}
          {type === 'about' && (
            <div className="space-y-4">
              <div>
                <label className="block font-mono text-xs text-primary-container mb-1">헤더 브랜드 이름</label>
                <input 
                  type="text" 
                  value={aboutForm.title} 
                  onChange={e => setAboutForm({ ...aboutForm, title: e.target.value })}
                  className="w-full bg-surface-container-lowest border border-surface-variant rounded-lg px-3 py-2 text-on-surface md:text-sm focus:border-primary-container focus:outline-none"
                  required 
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-primary-container mb-1">소개 제목</label>
                <input 
                  type="text" 
                  value={aboutForm.aboutTitle} 
                  onChange={e => setAboutForm({ ...aboutForm, aboutTitle: e.target.value })}
                  className="w-full bg-surface-container-lowest border border-surface-variant rounded-lg px-3 py-2 text-on-surface md:text-sm focus:border-primary-container focus:outline-none"
                  required 
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-primary-container mb-1">소개 부제목 (로봇 소개...)</label>
                <input 
                  type="text" 
                  value={aboutForm.aboutSubtitle} 
                  onChange={e => setAboutForm({ ...aboutForm, aboutSubtitle: e.target.value })}
                  className="w-full bg-surface-container-lowest border border-surface-variant rounded-lg px-3 py-2 text-on-surface md:text-sm focus:border-primary-container focus:outline-none"
                  required 
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-primary-container mb-1">설명 문구 (한글/줄바꿈 가능)</label>
                <textarea 
                  rows={4}
                  value={aboutForm.aboutDescription} 
                  onChange={e => setAboutForm({ ...aboutForm, aboutDescription: e.target.value })}
                  className="w-full bg-surface-container-lowest border border-surface-variant rounded-lg px-3 py-2 text-on-surface md:text-sm focus:border-primary-container focus:outline-none resize-none"
                  required 
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-primary-container mb-1">목표 (Goal)</label>
                <input 
                  type="text" 
                  value={aboutForm.aboutGoal} 
                  onChange={e => setAboutForm({ ...aboutForm, aboutGoal: e.target.value })}
                  className="w-full bg-surface-container-lowest border border-surface-variant rounded-lg px-3 py-2 text-on-surface md:text-sm focus:border-primary-container focus:outline-none"
                  required 
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-primary-container mb-1">프로필 이미지 파일 업로드 (5MB 제한)</label>
                <div className="mt-1 flex flex-col items-center justify-center border-2 border-dashed border-surface-variant rounded-lg p-4 bg-surface-container-lowest relative hover:border-primary-container transition-colors">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileUpload} 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    disabled={uploading}
                  />
                  {uploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 size={24} className="text-primary-container animate-spin" />
                      <span className="text-xs text-on-surface-variant">Uploading... {uploadProgress}%</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-center">
                      <Upload size={24} className="text-primary-container opacity-60" />
                      <span className="text-xs text-on-surface-variant">Click or Drag & Drop image file</span>
                      <span className="text-[10px] text-on-surface-variant/40">JPG, PNG, WebP allowed</span>
                    </div>
                  )}
                </div>
                {aboutForm.aboutImageUrl && (
                  <div className="mt-2 relative w-20 h-20 rounded-lg overflow-hidden border border-surface-variant">
                    <img src={aboutForm.aboutImageUrl} alt="About preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          )}

          {type === 'experience' && (
            <div className="space-y-4">
              <div>
                <label className="block font-mono text-xs text-primary-container mb-1">경험 연도 & 제목</label>
                <input 
                  type="text" 
                  value={expForm.title} 
                  onChange={e => setExpForm({ ...expForm, title: e.target.value })}
                  className="w-full bg-surface-container-lowest border border-surface-variant rounded-lg px-3 py-2 text-on-surface md:text-sm focus:border-primary-container focus:outline-none"
                  placeholder="예: 2026 RoboCup Korea..."
                  required 
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-primary-container mb-1">설명 문구</label>
                <textarea 
                  rows={3}
                  value={expForm.description} 
                  onChange={e => setExpForm({ ...expForm, description: e.target.value })}
                  className="w-full bg-surface-container-lowest border border-surface-variant rounded-lg px-3 py-2 text-on-surface md:text-sm focus:border-primary-container focus:outline-none resize-none"
                  placeholder="역할, 팀명 등..."
                  required 
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-primary-container mb-1">정렬 순서</label>
                <input 
                  type="number" 
                  value={expForm.sortOrder} 
                  onChange={e => setExpForm({ ...expForm, sortOrder: Number(e.target.value) })}
                  className="w-full bg-surface-container-lowest border border-surface-variant rounded-lg px-3 py-2 text-on-surface md:text-sm focus:border-primary-container focus:outline-none"
                  required 
                />
              </div>
            </div>
          )}

          {type === 'skill' && (
            <div className="space-y-4">
              <div>
                <label className="block font-mono text-xs text-primary-container mb-1">기술 이름 (Tag)</label>
                <input 
                  type="text" 
                  value={skillForm.name} 
                  onChange={e => setSkillForm({ ...skillForm, name: e.target.value })}
                  className="w-full bg-surface-container-lowest border border-surface-variant rounded-lg px-3 py-2 text-on-surface md:text-sm focus:border-primary-container focus:outline-none"
                  placeholder="예: Python Coding"
                  required 
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-primary-container mb-1">정렬 순서</label>
                <input 
                  type="number" 
                  value={skillForm.sortOrder} 
                  onChange={e => setSkillForm({ ...skillForm, sortOrder: Number(e.target.value) })}
                  className="w-full bg-surface-container-lowest border border-surface-variant rounded-lg px-3 py-2 text-on-surface md:text-sm focus:border-primary-container focus:outline-none"
                  required 
                />
              </div>
            </div>
          )}

          {type === 'certification' && (
            <div className="space-y-4">
              <div>
                <label className="block font-mono text-xs text-primary-container mb-1">인증 및 수상명</label>
                <input 
                  type="text" 
                  value={certForm.title} 
                  onChange={e => setCertForm({ ...certForm, title: e.target.value })}
                  className="w-full bg-surface-container-lowest border border-surface-variant rounded-lg px-3 py-2 text-on-surface md:text-sm focus:border-primary-container focus:outline-none"
                  required 
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-primary-container mb-1">부제 (설명)</label>
                <input 
                  type="text" 
                  value={certForm.subtitle} 
                  onChange={e => setCertForm({ ...certForm, subtitle: e.target.value })}
                  className="w-full bg-surface-container-lowest border border-surface-variant rounded-lg px-3 py-2 text-on-surface md:text-sm focus:border-primary-container focus:outline-none"
                  required 
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-primary-container mb-1">아이콘 선택</label>
                <select 
                  value={certForm.icon} 
                  onChange={e => setCertForm({ ...certForm, icon: e.target.value })}
                  className="w-full bg-surface-container-lowest border border-[#112240] rounded-lg px-3 py-2 text-on-surface md:text-sm focus:border-primary-container focus:outline-none"
                >
                  <option value="military_tech">Military Tech (Badge/Award)</option>
                  <option value="social_leaderboard">Leaderboard (Social/Awards)</option>
                  <option value="award">Gold Cup Award</option>
                  <option value="briefcase">Work/Milestone</option>
                  <option value="settings">Development gear</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-xs text-primary-container mb-1">정렬 순서</label>
                <input 
                  type="number" 
                  value={certForm.sortOrder} 
                  onChange={e => setCertForm({ ...certForm, sortOrder: Number(e.target.value) })}
                  className="w-full bg-surface-container-lowest border border-surface-variant rounded-lg px-3 py-2 text-on-surface md:text-sm focus:border-primary-container focus:outline-none"
                  required 
                />
              </div>
            </div>
          )}

          {type === 'portfolio' && (
            <div className="space-y-4">
              <div>
                <label className="block font-mono text-xs text-primary-container mb-1">로봇 프로젝트 제목</label>
                <input 
                  type="text" 
                  value={portForm.title} 
                  onChange={e => setPortForm({ ...portForm, title: e.target.value })}
                  className="w-full bg-surface-container-lowest border border-surface-variant rounded-lg px-3 py-2 text-on-surface md:text-sm focus:border-primary-container focus:outline-none"
                  required 
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-primary-container mb-1">프로젝트 간단 설명</label>
                <textarea 
                  rows={3}
                  value={portForm.description} 
                  onChange={e => setPortForm({ ...portForm, description: e.target.value })}
                  className="w-full bg-surface-container-lowest border border-surface-variant rounded-lg px-3 py-2 text-on-surface md:text-sm focus:border-primary-container focus:outline-none resize-none"
                  required 
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-primary-container mb-1">기술 태그 (쉼표로 구분)</label>
                <input 
                  type="text" 
                  value={portForm.tags} 
                  onChange={e => setPortForm({ ...portForm, tags: e.target.value })}
                  className="w-full bg-surface-container-lowest border border-surface-variant rounded-lg px-3 py-2 text-on-surface md:text-sm focus:border-primary-container focus:outline-none"
                  placeholder="예: Sensor, Motor Control, C++"
                  required 
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-primary-container mb-1">스토리 이미지 업로드 (5MB 제한)</label>
                <div className="mt-1 flex flex-col items-center justify-center border-2 border-dashed border-surface-variant rounded-lg p-4 bg-surface-container-lowest relative hover:border-primary-container transition-colors">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileUpload} 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    disabled={uploading}
                  />
                  {uploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 size={24} className="text-primary-container animate-spin" />
                      <span className="text-xs text-on-surface-variant">Uploading... {uploadProgress}%</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-center">
                      <Upload size={24} className="text-primary-container opacity-60" />
                      <span className="text-xs text-on-surface-variant">Click or Drag & Drop image file</span>
                      <span className="text-[10px] text-on-surface-variant/40">JPG, PNG, WebP allowed</span>
                    </div>
                  )}
                </div>
                {portForm.imageUrl && (
                  <div className="mt-2 relative w-32 h-20 rounded-lg overflow-hidden border border-surface-variant">
                    <img src={portForm.imageUrl} alt="Portfolio preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="isVisible"
                    checked={portForm.isVisible} 
                    onChange={e => setPortForm({ ...portForm, isVisible: e.target.checked })}
                    className="w-4 h-4 bg-surface-container-lowest border border-surface-variant rounded text-primary-container focus:ring-0 focus:ring-offset-0" 
                  />
                  <label htmlFor="isVisible" className="font-mono text-xs text-on-surface">화면에 노출</label>
                </div>

                <div className="flex-grow flex items-center gap-2 justify-end">
                  <label className="font-mono text-xs text-primary-container text-right shrink-0">소트 번호</label>
                  <input 
                    type="number" 
                    value={portForm.sortOrder} 
                    onChange={e => setPortForm({ ...portForm, sortOrder: Number(e.target.value) })}
                    className="w-20 bg-surface-container-lowest border border-surface-variant rounded-lg px-2 py-1 text-on-surface md:text-sm focus:border-primary-container focus:outline-none"
                    required 
                  />
                </div>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="pt-4 border-t border-surface-variant/30 flex items-center justify-end gap-3 shrink-0">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 bg-transparent text-on-surface-variant border border-surface-variant rounded-lg hover:border-white hover:text-white transition-all text-sm font-medium"
              disabled={saving || uploading}
            >
              취소
            </button>
            <button 
              type="submit"
              className="px-5 py-2 bg-primary-container hover:bg-primary-container/80 text-surface-container-lowest font-semibold rounded-lg shadow-md transition-all flex items-center gap-1.5 text-sm"
              disabled={saving || uploading}
            >
              {(saving || uploading) && <Loader2 size={16} className="animate-spin" />}
              저장하기
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
