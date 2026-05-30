import React from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { CertificationData } from '../types';
import { Edit3, Trash2, PlusCircle, Trophy, Award, Inbox, Briefcase, Settings } from 'lucide-react';

interface CertificationsSectionProps {
  onAdd: () => void;
  onEdit: (item: CertificationData) => void;
}

export const CertificationsSection: React.FC<CertificationsSectionProps> = ({ onAdd, onEdit }) => {
  const { certifications, isEditMode, deleteCertification } = useDatabase();

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'military_tech':
        return <Trophy className="text-primary-container shrink-0" size={28} />;
      case 'social_leaderboard':
        return <Award className="text-primary-container shrink-0" size={28} />;
      case 'award':
        return <Trophy className="text-primary-container shrink-0" size={28} />;
      case 'briefcase':
        return <Briefcase className="text-primary-container shrink-0" size={28} />;
      case 'settings':
        return <Settings className="text-primary-container shrink-0" size={28} />;
      default:
        return <Award className="text-primary-container shrink-0" size={28} />;
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`[${name}] 수상 이력을 삭제하시겠습니까?`)) {
      try {
        await deleteCertification(id);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <section id="certifications" className="max-w-7xl mx-auto px-6 lg:px-12 py-16 scroll-mt-20">
      
      {/* Section Header */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 relative">
        <div>
          <h2 className="font-headline text-2xl lg:text-[32px] font-bold text-primary-fixed mb-2">
            Certifications & Awards
          </h2>
          <p className="text-on-surface-variant text-sm lg:text-base">
            로봇 대회 참가 및 수상 내용을 정리했습니다.
          </p>
        </div>

        {isEditMode && (
          <button 
            onClick={onAdd}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-container text-surface-container-lowest hover:bg-primary-container/80 text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            <PlusCircle size={15} />
            새 수상 추가
          </button>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certifications.length === 0 ? (
          <p className="col-span-full text-center text-xs text-on-surface-variant/40 py-8">등록된 이력이 없습니다.</p>
        ) : (
          certifications.map((cert) => (
            <div 
              key={cert.id}
              className="glass-panel p-6 rounded-xl card-border flex items-start gap-4 hover:neon-glow transition-all duration-300 relative group overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-primary-container/20"></div>

              {/* CMS Overlay controllers */}
              {isEditMode && (
                <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                  <button 
                    onClick={() => onEdit(cert)}
                    className="bg-surface-container-high hover:bg-primary-container/20 text-primary-container p-1.5 rounded-lg border border-primary-container/20 transition-all cursor-pointer"
                    title="상세 수정"
                  >
                    <Edit3 size={12} />
                  </button>
                  <button 
                    onClick={() => handleDelete(cert.id, cert.title)}
                    className="bg-surface-container-high hover:bg-red-500/25 text-red-400 p-1.5 rounded-lg border border-red-500/20 transition-all cursor-pointer"
                    title="기록 삭제"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              )}

              {/* Icon */}
              <div className="p-2.5 bg-primary-container/5 border border-primary-container/10 rounded-xl relative shrink-0">
                {getIconComponent(cert.icon)}
              </div>

              {/* Contents */}
              <div className="space-y-1">
                <h3 className="font-headline text-sm lg:text-base font-bold text-on-surface leading-tight tracking-tight pr-14">
                  {cert.title}
                </h3>
                <p className="font-mono text-[10px] text-primary-container uppercase tracking-wide">
                  {cert.subtitle}
                </p>
              </div>

            </div>
          ))
        )}
      </div>

    </section>
  );
};
