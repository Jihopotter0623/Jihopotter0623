import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  doc, 
  setDoc, 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage, handleFirestoreError, OperationType } from '../firebase';
import { AboutData, ExperienceData, SkillData, CertificationData, PortfolioData } from '../types';
import { 
  initialAbout, 
  initialExperiences, 
  initialSkills, 
  initialCertifications, 
  initialPortfolio 
} from '../sampleData';

interface DatabaseContextProps {
  about: AboutData;
  experiences: ExperienceData[];
  skills: SkillData[];
  certifications: CertificationData[];
  portfolio: PortfolioData[];
  loading: boolean;
  isEditMode: boolean;
  setEditMode: (val: boolean) => void;
  
  // Storage operations
  uploadFile: (file: File, folder: string, onProgress?: (pct: number) => void) => Promise<string>;
  
  // Database update functions
  updateAbout: (data: AboutData) => Promise<void>;
  
  saveExperience: (data: Omit<ExperienceData, 'id'> & { id?: string }) => Promise<void>;
  deleteExperience: (id: string) => Promise<void>;
  
  saveSkill: (data: Omit<SkillData, 'id'> & { id?: string }) => Promise<void>;
  deleteSkill: (id: string) => Promise<void>;
  
  saveCertification: (data: Omit<CertificationData, 'id'> & { id?: string }) => Promise<void>;
  deleteCertification: (id: string) => Promise<void>;
  
  savePortfolioItem: (data: Omit<PortfolioData, 'id'> & { id?: string }) => Promise<void>;
  deletePortfolioItem: (id: string) => Promise<void>;
  
  triggerSeed: () => Promise<void>;
}

const DatabaseContext = createContext<DatabaseContextProps | undefined>(undefined);

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [about, setAbout] = useState<AboutData>(initialAbout);
  const [experiences, setExperiences] = useState<ExperienceData[]>([]);
  const [skills, setSkills] = useState<SkillData[]>([]);
  const [certifications, setCertifications] = useState<CertificationData[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Persist edit mode temporarily in session state
  const [isEditMode, setIsEditModeState] = useState(() => {
    return sessionStorage.getItem('admin_edit_mode') === 'true';
  });

  const setEditMode = (val: boolean) => {
    setIsEditModeState(val);
    sessionStorage.setItem('admin_edit_mode', String(val));
  };

  // Seeding action to pre-fill the database with standard portfolio content
  const triggerSeed = async () => {
    setLoading(true);
    try {
      // 1. Seed About
      await setDoc(doc(db, 'siteContent', 'main'), {
        title: initialAbout.title,
        aboutTitle: initialAbout.aboutTitle,
        aboutSubtitle: initialAbout.aboutSubtitle,
        aboutDescription: initialAbout.aboutDescription,
        aboutGoal: initialAbout.aboutGoal,
        aboutImageUrl: initialAbout.aboutImageUrl,
        updatedAt: new Date().toISOString()
      });

      // 2. Seed Experiences
      for (const exp of initialExperiences) {
        await setDoc(doc(db, 'experiences', exp.id), {
          title: exp.title,
          description: exp.description,
          sortOrder: exp.sortOrder,
          updatedAt: new Date().toISOString()
        });
      }

      // 3. Seed Skills
      for (const sk of initialSkills) {
        await setDoc(doc(db, 'skills', sk.id), {
          name: sk.name,
          sortOrder: sk.sortOrder
        });
      }

      // 4. Seed Certifications
      for (const cert of initialCertifications) {
        await setDoc(doc(db, 'certifications', cert.id), {
          title: cert.title,
          subtitle: cert.subtitle,
          icon: cert.icon,
          sortOrder: cert.sortOrder
        });
      }

      // 5. Seed Portfolio Items
      for (const port of initialPortfolio) {
        await setDoc(doc(db, 'portfolio', port.id), {
          title: port.title,
          description: port.description,
          tags: port.tags,
          imageUrl: port.imageUrl,
          sortOrder: port.sortOrder,
          isVisible: port.isVisible,
          updatedAt: new Date().toISOString()
        });
      }

      console.log("Database successfully seeded with standard Sirius assets");
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'seeding');
    } finally {
      setLoading(false);
    }
  };

  // 1. Realtime Listeners for synchronization
  useEffect(() => {
    let activeListenersCount = 0;
    const cleanupFns: (() => void)[] = [];

    // Listener A: About Context Document
    const mainDocRef = doc(db, 'siteContent', 'main');
    const unsubAbout = onSnapshot(mainDocRef, (snapshot) => {
      if (snapshot.exists()) {
        setAbout(snapshot.data() as AboutData);
      } else {
        // Automatically trigger seeding on first-load if database is empty
        triggerSeed();
      }
    }, (err) => {
      console.warn("About Section load failed (likely not seeded yet):", err);
    });
    cleanupFns.push(unsubAbout);

    // Listener B: Experiences (Ordered by SortOrder)
    const expColRef = query(collection(db, 'experiences'), orderBy('sortOrder', 'asc'));
    const unsubExp = onSnapshot(expColRef, (snapshot) => {
      const list: ExperienceData[] = [];
      snapshot.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as ExperienceData);
      });
      setExperiences(list);
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, 'experiences');
    });
    cleanupFns.push(unsubExp);

    // Listener C: Skills
    const skillColRef = query(collection(db, 'skills'), orderBy('sortOrder', 'asc'));
    const unsubSkill = onSnapshot(skillColRef, (snapshot) => {
      const list: SkillData[] = [];
      snapshot.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as SkillData);
      });
      setSkills(list);
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, 'skills');
    });
    cleanupFns.push(unsubSkill);

    // Listener D: Certifications
    const certColRef = query(collection(db, 'certifications'), orderBy('sortOrder', 'asc'));
    const unsubCert = onSnapshot(certColRef, (snapshot) => {
      const list: CertificationData[] = [];
      snapshot.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as CertificationData);
      });
      setCertifications(list);
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, 'certifications');
    });
    cleanupFns.push(unsubCert);

    // Listener E: Portfolio Grid (Ordered by SortOrder)
    const portColRef = query(collection(db, 'portfolio'), orderBy('sortOrder', 'asc'));
    const unsubPort = onSnapshot(portColRef, (snapshot) => {
      const list: PortfolioData[] = [];
      snapshot.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as PortfolioData);
      });
      setPortfolio(list);
      setLoading(false);
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, 'portfolio');
    });
    cleanupFns.push(unsubPort);

    return () => {
      cleanupFns.forEach(fn => fn());
    };
  }, []);

  // Upload routine into Storage
  const uploadFile = async (file: File, folder: string, onProgress?: (pct: number) => void): Promise<string> => {
    // Basic file protection
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("File size must not exceed 5MB.");
    }
    if (!file.type.match(/^image\/(jpeg|jpg|png|webp|gif)$/)) {
      throw new Error("Only images (.jpg, .jpeg, .png, .webp, .gif) are permitted.");
    }

    const uniqueName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
    const fileRef = ref(storage, `${folder}/${uniqueName}`);
    
    return new Promise((resolve, reject) => {
      // Use Firebase SDK native upload bytes resumable for robust progress tracking
      const uploadTask = uploadBytesResumable(fileRef, file);
      
      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) onProgress(progress);
        }, 
        (error) => {
          console.error("Storage upload error details:", error);
          reject(new Error(`Storage transmission failed: ${error.message}`));
        }, 
        async () => {
          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadUrl);
          } catch (err) {
            reject(err);
          }
        }
      );
    });
  };

  // Database mutations
  const updateAbout = async (data: AboutData) => {
    try {
      const refMain = doc(db, 'siteContent', 'main');
      await setDoc(refMain, {
        title: data.title,
        aboutTitle: data.aboutTitle,
        aboutSubtitle: data.aboutSubtitle,
        aboutDescription: data.aboutDescription,
        aboutGoal: data.aboutGoal,
        aboutImageUrl: data.aboutImageUrl,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'siteContent/main');
    }
  };

  const saveExperience = async (data: Omit<ExperienceData, 'id'> & { id?: string }) => {
    const docId = data.id || `exp_${Date.now()}`;
    try {
      const refDoc = doc(db, 'experiences', docId);
      await setDoc(refDoc, {
        title: data.title,
        description: data.description,
        sortOrder: Number(data.sortOrder),
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `experiences/${docId}`);
    }
  };

  const deleteExperience = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'experiences', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `experiences/${id}`);
    }
  };

  const saveSkill = async (data: Omit<SkillData, 'id'> & { id?: string }) => {
    const docId = data.id || `skill_${Date.now()}`;
    try {
      const refDoc = doc(db, 'skills', docId);
      await setDoc(refDoc, {
        name: data.name,
        sortOrder: Number(data.sortOrder)
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `skills/${docId}`);
    }
  };

  const deleteSkill = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'skills', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `skills/${id}`);
    }
  };

  const saveCertification = async (data: Omit<CertificationData, 'id'> & { id?: string }) => {
    const docId = data.id || `cert_${Date.now()}`;
    try {
      const refDoc = doc(db, 'certifications', docId);
      await setDoc(refDoc, {
        title: data.title,
        subtitle: data.subtitle,
        icon: data.icon,
        sortOrder: Number(data.sortOrder)
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `certifications/${docId}`);
    }
  };

  const deleteCertification = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'certifications', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `certifications/${id}`);
    }
  };

  const savePortfolioItem = async (data: Omit<PortfolioData, 'id'> & { id?: string }) => {
    const docId = data.id || `port_${Date.now()}`;
    try {
      const refDoc = doc(db, 'portfolio', docId);
      await setDoc(refDoc, {
        title: data.title,
        description: data.description,
        tags: data.tags,
        imageUrl: data.imageUrl,
        sortOrder: Number(data.sortOrder),
        isVisible: Boolean(data.isVisible),
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `portfolio/${docId}`);
    }
  };

  const deletePortfolioItem = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'portfolio', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `portfolio/${id}`);
    }
  };

  return (
    <DatabaseContext.Provider value={{
      about,
      experiences,
      skills,
      certifications,
      portfolio,
      loading,
      isEditMode,
      setEditMode,
      uploadFile,
      updateAbout,
      saveExperience,
      deleteExperience,
      saveSkill,
      deleteSkill,
      saveCertification,
      deleteCertification,
      savePortfolioItem,
      deletePortfolioItem,
      triggerSeed
    }}>
      {children}
    </DatabaseContext.Provider>
  );
};
