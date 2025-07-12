export interface Developer {
  id: number;
  name: string;
  role: string;
  github: string;
  avatarUrl: string;
  linkedin: string;
}

export const developers: Developer[] = [
  {
    id: 1,
    name: "Evan Alif Widhyatma",
    role: "IoT Engineer, Firmware Engineer, Database Designer, Fullstack Developer, AI Researcher",
    github: "evanalif113",
    avatarUrl: "https://gravatar.com/avatar/908ca1637c2e533406b4c1e5145cb0bc?size=256",
    linkedin: "evan-alif-widhyatma-371966180/",
  },
  {
    id: 2,
    name: "Aisyah Hanan",
    role: "UI/UX Designer, Frontend Developer, Data Analis, Sistem Analis",
    github: "aisyahhhhanannn192",
    avatarUrl: "https://media.licdn.com/dms/image/v2/D5603AQHslpUSuncQmA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1719328817369?e=1757548800&v=beta&t=tLB8YN2t7-On3UXRLnf-Yx4MrwiXX4YR6QJ0FUoSZK4",
    linkedin: "aisyah-hanan-467a4a215/",
  },
  {
    id: 3,
    name: "Putri Cahya Ningrum",
    role: "Public Relation, Dokumenter Projek, Quality Assurance, Desainer Logo",
    github: "putriningrum",
    avatarUrl: "/img/putri-cahya.jpg",
    linkedin: "putri-cahya-ningrum-b8b3a5256",
  },
];
