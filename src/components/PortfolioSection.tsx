import React, { useState } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { PortfolioData } from '../types';
import { Edit3, Trash2, PlusCircle, Eye, EyeOff, Tag, ExternalLink, X, Cpu } from 'lucide-react';

interface PortfolioSectionProps {
  onAdd: () => void;
  onEdit: (item: PortfolioData) => void;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({ onAdd, onEdit }) => {
  const { portfolio, isEditMode, deletePortfolioItem } = useDatabase();
  const [activeDetailItem, setActiveDetailItem] = useState<PortfolioData | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`[${name}] 프로젝트 카드를 완전히 삭하시겠습니까?`)) {
      try {
        await deletePortfolioItem(id);
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Filter hidden elements for general viewers
  const visibleItems = isEditMode ? portfolio : portfolio.filter(p => p.isVisible);

  return (
    <section id="portfolio" className="max-w-7xl mx-auto px-6 lg:px-12 py-16 scroll-mt-20">
      
      {/* Section Header */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 relative">
        <div>
          <h2 className="font-headline text-2xl lg:text-[32px] font-bold text-primary-fixed mb-2">
            Portfolio
          </h2>
          <p className="text-on-surface-variant text-sm lg:text-base">
            학습용으로 직접 설계하고 조립하며 코딩한 로봇 프로젝트 결과물입니다.
          </p>
        </div>

        {isEditMode && (
          <button 
            onClick={onAdd}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-container text-surface-container-lowest hover:bg-primary-container/80 text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            <PlusCircle size={15} />
            새 프로젝트 추가
          </button>
        )}
      </div>

      {/* Grid of cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {visibleItems.length === 0 ? (
          <p className="col-span-full text-center text-xs text-on-surface-variant/40 py-12">등록된 포트폴리오 결과물이 없습니다.</p>
        ) : (
          visibleItems.map((item, index) => (
            <div 
              key={item.id ? `port-${item.id}` : `port-idx-${index}`}
              className={`glass-panel border rounded-xl overflow-hidden shadow-md flex flex-col hover:-translate-y-1.5 transition-all duration-300 relative group select-none ${
                item.isVisible ? 'border-surface-variant/30' : 'border-dashed border-red-500/20 opacity-75'
              }`}
            >
              {/* Floating invisible markers */}
              {!item.isVisible && (
                <div className="absolute top-3 left-3 z-10 bg-red-950/80 text-red-200 text-[10px] font-mono px-2 py-0.5 rounded border border-red-500/30 flex items-center gap-1">
                  <EyeOff size={10} />
                  <span>숨김 항목</span>
                </div>
              )}

              {/* CMS Overlay controllers */}
              {isEditMode && (
                <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
                  <button 
                    onClick={() => onEdit(item)}
                    className="bg-surface-container-lowest/80 backdrop-blur-sm hover:bg-primary-container text-primary-container hover:text-surface-container-lowest p-1.5 rounded-lg border border-primary-container/20 transition-all cursor-pointer"
                    title="프로젝트 수정"
                  >
                    <Edit3 size={11} />
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id, item.title)}
                    className="bg-surface-container-lowest/80 backdrop-blur-sm hover:bg-red-500 text-red-400 hover:text-white p-1.5 rounded-lg border border-red-500/20 transition-all cursor-pointer"
                    title="프로젝트 삭제"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              )}

              {/* Graphic Media */}
              <div className="w-full aspect-[4/3] bg-surface-container-lowest overflow-hidden relative">
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Details card content */}
              <div className="p-5 flex-grow flex flex-col">
                <h3 className="font-headline text-base font-bold text-on-surface line-clamp-1 mb-1.5 tracking-tight group-hover:text-primary-container transition-colors">
                  <span>{item.title}</span>
                </h3>
                
                <p className="text-on-surface-variant text-[13px] line-clamp-2 leading-relaxed flex-grow mb-4">
                  <span>{item.description}</span>
                </p>

                {/* Tags preview snippet */}
                <div className="flex flex-wrap gap-1.5 mb-5 overflow-hidden h-[22px]">
                  {(item.tags || '').split(',').map(t => t.trim()).filter(Boolean).slice(0, 2).map((tag, idx) => (
                    <span 
                      key={`tag-${item.id}-${idx}`} 
                      className="px-2 py-0.5 bg-surface-container-high border border-surface-variant/30 rounded text-[10px] font-medium text-on-surface-variant tracking-tight shrink-0"
                    >
                      {tag}
                    </span>
                  ))}
                  {(item.tags || '').split(',').map(t => t.trim()).filter(Boolean).length > 2 && (
                    <span className="text-[10px] text-on-surface-variant/50 self-center shrink-0">
                      +{(item.tags || '').split(',').map(t => t.trim()).filter(Boolean).length - 2}
                    </span>
                  )}
                </div>

                {/* Clicking triggers interactive drawer */}
                <button
                  onClick={() => setActiveDetailItem(item)}
                  className="w-full text-center py-2 bg-primary-container/5 border border-primary-container/20 text-primary-container hover:bg-primary-container hover:text-surface-container-lowest text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer md:text-sm"
                >
                  <Eye size={14} />
                  <span>자세히 보기</span>
                </button>
              </div>

            </div>
          ))
        )}
      </div>

      {/* Embedded High Definition Detail Modal */}
      {activeDetailItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-surface-container-lowest/80 backdrop-blur-md">
          <div className="w-full max-w-2xl glass-panel card-border rounded-2xl shadow-2xl overflow-hidden relative flex flex-col max-h-[85vh] animate-scale-up">
            
            {/* Float Close */}
            <button 
              onClick={() => setActiveDetailItem(null)}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-surface-container-lowest/70 backdrop-blur-sm border border-surface-variant/40 hover:border-white text-on-surface-variant hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Media Banner top */}
            <div className="w-full h-64 bg-surface-container-lowest overflow-hidden relative shrink-0">
              <img 
                src={activeDetailItem.imageUrl} 
                alt={activeDetailItem.title} 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent pointer-events-none"></div>
            </div>

            {/* Scrolling Context */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-4">
              
              <div className="flex items-center gap-2">
                <Cpu size={16} className="text-primary-container" />
                <span className="font-mono text-[10px] text-primary-fixed uppercase tracking-wider">
                  Specifications Summary
                </span>
              </div>

              <h3 className="font-headline text-lg md:text-2xl font-bold text-on-surface tracking-tight">
                <span>{activeDetailItem.title}</span>
              </h3>

              {/* Dynamic tag list */}
              <div className="flex flex-wrap gap-2 pt-1 pb-3 border-b border-surface-variant/20">
                {(activeDetailItem.tags || '').split(',').map(t => t.trim()).filter(Boolean).map((tag, idx) => (
                  <span 
                    key={`modal-tag-${idx}`} 
                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary-container/10 border border-primary-container/20 rounded-full text-xs font-semibold text-primary-container"
                  >
                    <Tag size={10} className="opacity-70" />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>

              <div className="space-y-4 pt-1">
                <h4 className="font-headline text-sm font-bold text-on-surface-variant uppercase tracking-wider">
                  <span>Project Description</span>
                </h4>
                <p className="text-on-surface-variant text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                  <span>{activeDetailItem.description}</span>
                </p>
              </div>

            </div>

            {/* Footer lock controls */}
            <div className="px-6 py-4 bg-surface-container-low border-t border-surface-variant/20 flex items-center justify-end shrink-0">
              <button 
                onClick={() => setActiveDetailItem(null)}
                className="px-5 py-2 bg-primary-container hover:bg-primary-container/85 text-surface-container-lowest font-bold text-xs md:text-sm rounded-lg shadow transition-colors cursor-pointer"
              >
                닫기
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
