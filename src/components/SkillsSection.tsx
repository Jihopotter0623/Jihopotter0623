import React, { useState } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { Plus, X, Tag } from 'lucide-react';

export const SkillsSection: React.FC = () => {
  const { skills, isEditMode, saveSkill, deleteSkill } = useDatabase();
  const [newSkillName, setNewSkillName] = useState('');
  const [adding, setAdding] = useState(false);

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    setAdding(true);
    try {
      const nextSortOrder = skills.length > 0 ? Math.max(...skills.map(s => s.sortOrder)) + 1 : 1;
      await saveSkill({
        name: newSkillName.trim(),
        sortOrder: nextSortOrder
      });
      setNewSkillName('');
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`[${name}] 기술 태그를 삭제하시겠습니까?`)) {
      try {
        await deleteSkill(id);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <section id="skills" className="max-w-7xl mx-auto px-6 lg:px-12 py-16 scroll-mt-20">
      
      {/* Section Header */}
      <div className="mb-10 text-center lg:text-left">
        <h2 className="font-headline text-2xl lg:text-[32px] font-bold text-primary-fixed mb-2">
          Skills
        </h2>
        <p className="text-on-surface-variant text-sm lg:text-base">
          로봇 프로젝트를 진행하며 배운 기술과 역량입니다.
        </p>
      </div>

      {/* Inline Input Appender (Only in Edit Mode) */}
      {isEditMode && (
        <form onSubmit={handleAddSkill} className="mb-8 flex max-w-sm items-center gap-2 mx-auto lg:mx-0">
          <input 
            type="text"
            placeholder="새 기술 태그 입력 (예: Python)"
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
            className="flex-grow bg-surface-container-lowest border border-surface-variant rounded-lg px-3 py-1.5 text-xs text-on-surface focus:border-primary-container focus:outline-none"
            disabled={adding}
          />
          <button 
            type="submit"
            className="px-3 py-1.5 bg-primary-container hover:bg-primary-container/85 text-surface-container-lowest font-bold rounded-lg text-xs flex items-center gap-1 transition-all cursor-pointer"
            disabled={adding}
          >
            <Plus size={13} />
            태그 추가
          </button>
        </form>
      )}

      {/* Skills Grid */}
      <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
        {skills.length === 0 ? (
          <p className="text-xs text-on-surface-variant/40 py-4">등록된 기술 가 없습니다.</p>
        ) : (
          skills.map((skill, index) => (
            <div 
              key={skill.id ? `skill-${skill.id}` : `skill-idx-${index}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-container/5 border border-primary-container/20 rounded-full text-xs font-semibold text-primary-container hover:bg-primary-container/10 transition-colors uppercase cursor-default relative group"
            >
              <Tag size={12} className="opacity-60" />
              <span>{skill.name}</span>
              
              {/* Overlaid deletes */}
              {isEditMode && (
                <button 
                  onClick={() => handleDelete(skill.id, skill.name)}
                  className="ml-1 hover:text-red-400 text-on-surface-variant/70 transition-colors cursor-pointer"
                  title="태그 삭제"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          ))
        )}
      </div>

    </section>
  );
};
