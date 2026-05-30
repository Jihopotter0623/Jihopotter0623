import { AboutData, ExperienceData, SkillData, CertificationData, PortfolioData } from './types';

export const initialAbout: AboutData = {
  title: "My robot Sirius",
  aboutTitle: "Building robot, and coding ",
  aboutSubtitle: "로봇을 만들고, 코딩을 하는 과정을 소개",
  aboutDescription: "저는 로봇을 만들고 코딩하며 문제를 해결하는 것을 좋아합니다. 센서와 모터를 활용해 로봇이 스스로 움직이도록 만드는 과정에 관심이 있습니다. 실패한 로봇을 다시 수정하고 테스트하면서 더 나은 해결 방법을 찾는 과정을 배우고 있습니다.",
  aboutGoal: "Goal: 앞으로 로봇을 많이 만들면서 창의력을 키우겠다.",
  aboutImageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuASPRtFDU8aZXWbn4oFM_o4o_MbkWfZAX1OVdMfygN7ptx8SjNvG4t5PcJHYeQr5zucY7f0Ggzz1n7M8m_MhIucR3rpcwVP2PzYlfdv7vE1T8Xv7MkiJcqYA28qLcGdotFqdTY_CJa-nYJL6Ygy6LC3qbA_4aqXQPU5CFyQv8PtTdxzkHP72D6b7ZFGieKKjve9LOu_R2aNlxjJIkmVAmGG64cR6C4wld4Czz97WVHs9YkbAnq9613LXVgEqnyh5homimfem9ziSc4X"
};

export const initialExperiences: ExperienceData[] = [
  {
    id: "exp_1",
    title: "2025 Robot Challenge: SUMO",
    description: "SUMO 종목에 참가했다",
    sortOrder: 1
  },
  {
    id: "exp_2",
    title: "2026 RoboCup Korea Open: CoSpace Rescue U12",
    description: "코스페이스 종목 참가, World 1 프로그래머로 활약, 팀명: K.F.C.Sirius",
    sortOrder: 2
  },
  {
    id: "exp_3",
    title: "2026 RoboCup Singapore Open: CoSpace Rescue U12",
    description: "코스페이스 종목 참가, 디버거로 활약, 팀명: K.F.C.Nova",
    sortOrder: 3
  }
];

export const initialSkills: SkillData[] = [
  { id: "skill_1", name: "C Coding", sortOrder: 1 },
  { id: "skill_2", name: "Micro Python Coding", sortOrder: 2 },
  { id: "skill_3", name: "Block Coding", sortOrder: 3 },
  { id: "skill_4", name: "Robot Building", sortOrder: 4 },
  { id: "skill_5", name: "Problem Solving", sortOrder: 5 },
  { id: "skill_6", name: "Teamwork", sortOrder: 6 },
  { id: "skill_7", name: "PPT Presentation", sortOrder: 7 },
  { id: "skill_8", name: "Instruction Making", sortOrder: 8 }
];

export const initialCertifications: CertificationData[] = [
  {
    id: "cert_1",
    title: "2026 RoboCup Korea Open (CoSpace U12)",
    subtitle: "Super Team 1st place",
    icon: "military_tech",
    sortOrder: 1
  },
  {
    id: "cert_2",
    title: "2026 RoboCup Singapore Open (CoSpace U12)",
    subtitle: "Influencer Awards",
    icon: "social_leaderboard",
    sortOrder: 2
  }
];

export const initialPortfolio: PortfolioData[] = [
  {
    id: "port_1",
    title: "Line Tracing Robot",
    description: "컬러 센서를 사용해 검은 선을 따라가는 로봇 프로젝트입니다.",
    tags: "Color Sensor, Motor Control, Block Coding",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCJ4lD8hWn_NYS0CNWGJo_Mu2JXeMrakIbTl4Ai3fsuzNLO7epcgg8pv6ZkAiMse38L8T0vJ8Jff17Vk9QaTzw0ajsTW13mupO-Yfn1RCgUsDfDJ0AK7fIXBhL86PCYMC4xq-ZROuiYn838g_CAwDx7GacRNkpcoRz3OlhLJttEhuBwLpKLKahBMpDwfOhpSLrJ_aMGTBtjExzNhov0SctIG-qJ3YBy8shsS7K1QgdW71bqoTxX4pVv3Mu9c_KBoaXi73TKT6kO4mUm",
    sortOrder: 1,
    isVisible: true
  },
  {
    id: "port_2",
    title: "Sumo Robot",
    description: "상대 로봇을 감지하고 밀어내는 로봇 프로젝트입니다.",
    tags: "Ultrasonic Sensor, Motor Power, Robot Design",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC9667oKv-G1H3yKV4LbjpVm8oIpbR7dWEfSS3qM4WEcoeaEir0oTKYUZTGasapOkFdxcaO3WgP83FwMbq5Clg0vHke3-5L298BNJI7t0rB0n8fkKj3EKEbmYUHt1keGbY9tJhz_3abYDnKLTCFEQ0L9k_A1Fb49JIgGStZzphTNudBy6qUv76M4MMnZY9xqk4m4OsVc1Vg9WE_UHTt5-s6_aa5LoiMPtunEx68J2103Dr_30JR83NNu4FwdeQvgkf4HOEg1qxngjqW",
    sortOrder: 2,
    isVisible: true
  },
  {
    id: "port_3",
    title: "Mission Robot",
    description: "정해진 미션을 수행하기 위해 구조와 코드를 설계한 프로젝트입니다.",
    tags: "Mission Strategy, Sensor Control, Debugging",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCtoe905mgpAR5AgJHALuW-0SXguis_-2b2wDxGLmHf4d6SUNiKwewn1uChUp6odN29jm-2JGXiRBvjcc29GAw3OB561Y5nmSGNGIX99L6uECOJ1rWwpmdW6n0GEDTDOsdLxtvHOG2cV_WnOeityrDBWLH_fWVP0wjQHW9xxh81g88za0Q41mzu3pU--ZeHQZ4xCQMOmZGPVrDkcALx0LsFgwxNejaP-bO1RdsnA_nlbI0xp_teUR2Xdn8svfbxd1i2dqtXQWrfpQST",
    sortOrder: 3,
    isVisible: true
  },
  {
    id: "port_4",
    title: "Robot Portfolio Web App",
    description: "나의 로봇 프로젝트를 소개하기 위해 만든 웹앱입니다.",
    tags: "Web Design, AI Tool, Portfolio Design",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA2v5PZBW0QiyT-BDQmRuNcb4yIZwhGTLb_SqbPTyBWGLpMFYykHTUdRkuWabDjYv2PRDAAmFv-ve_AIpbQSfvuTRFvliVclqQm9EUF-uk24usPGDuC4fQ3kpAOcnza6YQHlNcpZ5MJAuT3mj2QhARKRt2r8qorOwxF2Gvh32iMrA15aCBYcA4zf7s100DuN5dmrbFyodCL1bDwHvFTzb5wRF4pxlw6cKsy60YAquN8fs5bgcrNNAGHf-DkZubSFiPY6thmzgEj1W4N",
    sortOrder: 4,
    isVisible: true
  }
];
