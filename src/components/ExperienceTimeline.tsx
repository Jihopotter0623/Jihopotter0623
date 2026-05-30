import React from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { ExperienceData } from '../types';
import { Edit3, Trash2, PlusCircle, Calendar } from 'lucide-react';

interface ExperienceTimelineProps {
  onAdd: () => void;
  onEdit: (item: ExperienceData) => void;
}

export const ExperienceTimeline: React.FC<ExperienceTimelineProps> = ({ onAdd, onEdit }) => {
  const { experiences, isEditMode, deleteExperience } = useDatabase();

  const handleDelete = async (id: string) => {
    if (window.confirm("이 마일스톤 경험을 삭제하시겠습니까?")) {
      try {
        await deleteExperience(id);
      } catch (err) {
        console.error("Delete experience failed:", err);
      }
    }
  };

  return (
    <section id="experience" className="max-w-7xl mx-auto px-6 lg:px-12 py-16 scroll-mt-20">
      
      {/* Section Header */}
      <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 relative">
        <div>
          <h2 className="font-headline text-2xl lg:text-[32px] font-bold text-primary-fixed mb-2">
            Experience
          </h2>
          <p className="text-on-surface-variant text-sm lg:text-base">
            로봇 수업과 프로젝트를 통해 경험한 활동들을 정리했습니다.
          </p>
        </div>
        
        {isEditMode && (
          <button 
            onClick={onAdd}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-container text-surface-container-lowest hover:bg-primary-container/80 text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            <PlusCircle size={15} />
            새 경험 추가
          </button>
        )}
      </div>

      <div className="relative pl-6 lg:pl-0">
        
        {/* Timeline Line (Center for large view, Left for mobile view) */}
        <div className="absolute left-3 lg:left-1/2 top-0 bottom-0 w-px bg-surface-variant/40 -translate-x-1/2"></div>
        
        <div className="space-y-12">
          {experiences.length === 0 ? (
            <p className="text-center text-xs text-on-surface-variant/50 py-8">등록된 경험 이력이 없습니다.</p>
          ) : (
            experiences.map((exp, index) => {
              const isEven = index % 2 === 0;
              return (
                <div 
                  key={exp.id || index}
                  className={`relative flex flex-col lg:flex-row ${isEven ? 'lg:justify-start' : 'lg:justify-end'}`}
                >
                  
                  {/* Timeline Node Point Ring (Static dot) */}
                  <div className="absolute left-3 lg:left-1/2 top-7 w-4.5 h-4.5 rounded-full bg-surface-container border border-primary-container -translate-x-1/2 shadow-[0_0_10px_rgba(0,229,255,0.4)] flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-container"></div>
                  </div>

                  {/* Card content bounds */}
                  <div className={`w-full lg:w-[46%] ${isEven ? 'lg:pr-6' : 'lg:pl-6'} ml-6 lg:ml-0`}>
                    
                    <div className="glass-panel p-6 rounded-xl card-border hover:neon-glow hover:-translate-y-1 transition-all duration-300 relative group overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-primary-container/20"></div>

                      {/* Header Edit Controllers */}
                      {isEditMode && (
                        <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                          <button 
                            onClick={() => onEdit(exp)}
                            className="bg-surface-container-high hover:bg-primary-container/20 text-primary-container p-1.5 rounded-lg border border-primary-container/20 transition-all cursor-pointer"
                            title="경험 수정"
                          >
                            <Edit3 size={12} />
                          </button>
                          <button 
                            onClick={() => handleDelete(exp.id)}
                            className="bg-surface-container-high hover:bg-red-500/25 text-red-400 p-1.5 rounded-lg border border-red-500/20 transition-all cursor-pointer"
                            title="경험 삭제"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      )}

                      <div className="flex items-center gap-2 mb-3">
                        <Calendar size={14} className="text-primary-container" />
                        <span className="font-mono text-[10px] text-primary-fixed uppercase tracking-widest">
                          Milestone #{exp.sortOrder}
                        </span>
                      </div>

                      <h3 className="font-headline text-base lg:text-lg font-bold text-on-surface mb-2 tracking-tight">
                        {exp.title}
                      </h3>
                      
                      <p className="text-on-surface-variant text-xs lg:text-sm whitespace-pre-wrap leading-relaxed">
                        {exp.description}
                      </p>
                    </div>

                  </div>

                </div>
              );
            })
          )}
        </div>

      </div>

    </section>
  );
};
