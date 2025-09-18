import type { BaseDictionary } from "@/lib/i18n/get-dictionary";

const dictionary: BaseDictionary = {
  languageNames: {
    en: "English",
    th: "ไทย",
  },
  appName: "First-Class",
  pageTitles: {
    home: "หน้าหลัก",
    login: "เข้าสู่ระบบ",
    signup: "สมัครสมาชิก",
    dashboard: "แดชบอร์ด",
    settings: "การตั้งค่า",
  },
  navigation: {
    platformLabel: "แพลตฟอร์ม",
    workspace: {
      title: "พื้นที่ทำงาน",
      items: [
        { title: "ภาพรวม", path: "dashboard" },
        { title: "โปรเจกต์", path: "dashboard/projects" },
        { title: "งาน", path: "dashboard/tasks" },
        { title: "ทีม", path: "dashboard/team" },
      ],
    },
    insights: {
      title: "ข้อมูลเชิงลึก",
      items: [
        { title: "รายงาน", path: "dashboard/reports" },
        { title: "การวิเคราะห์", path: "dashboard/analytics" },
        { title: "รายได้", path: "dashboard/revenue" },
      ],
    },
    management: {
      title: "การจัดการ",
      items: [
        { title: "การตั้งค่า", path: "dashboard/settings" },
        { title: "การเรียกเก็บเงิน", path: "dashboard/billing" },
        { title: "การแจ้งเตือน", path: "dashboard/notifications" },
        { title: "การผสานรวม", path: "dashboard/integrations" },
      ],
    },
    quickLinksLabel: "ลิงก์ด่วน",
    quickLinks: [
      { name: "เอกสาร", url: "https://nextjs.org/docs" },
      { name: "ศูนย์ช่วยเหลือ", url: "https://nextjs.org/learn" },
      { name: "ราคา", url: "https://nextjs.org/pricing" },
      { name: "พาร์ทเนอร์", url: "https://nextjs.org/partners" },
      { name: "บันทึกการอัปเดต", url: "https://nextjs.org/blog" },
    ],
    adminConsole: {
      title: "ศูนย์ควบคุมผู้ดูแล",
      items: [
        { title: "การจัดการผู้ใช้", path: "dashboard/admin" },
      ],
    },
  },
  settings: {
    breadcrumb: {
      home: "หน้าหลัก",
      dashboard: "แดชบอร์ด",
      settings: "การตั้งค่า",
    },
    pageTitle: "การตั้งค่าธีม",
    pageDescription: "เลือกโหมดและโทนสีที่ต้องการ การเปลี่ยนแปลงมีผลทันที.",
    appearance: {
      title: "โหมดการแสดงผล",
      description: "สลับระหว่างโหมดระบบ สว่าง หรือมืดทั่วทั้งแดชบอร์ด",
    },
    colorTheme: {
      title: "ชุดสี",
      description: "เลือกโทนสีที่เข้ากับแบรนด์ของคุณมากที่สุด",
    },
    language: {
      title: "ภาษา",
      description: "ดูตัวอย่างแดชบอร์ดในภาษาไทยหรือภาษาอังกฤษ",
    },
  },
  admin: {
    breadcrumb: {
      home: "หน้าหลัก",
      dashboard: "แดชบอร์ด",
      admin: "ศูนย์ควบคุมผู้ดูแล",
    },
    pageTitle: "ศูนย์ควบคุมผู้ดูแล",
    pageDescription:
      "พื้นที่สำหรับควบคุมบทบาทผู้ใช้ จัดการสิทธิ์ และดูการดำเนินงานระดับสูง",
    sections: {
      overview:
        "ใช้หน้าส่วนนี้เพื่อประสานงานงานที่จำเป็นสำหรับผู้ดูแลระบบและตรวจสอบข้อมูลสำคัญก่อนเผยแพร่การเปลี่ยนแปลง",
      management:
        "คุณสามารถเพิ่มการ์ด ตาราง หรืออินทิเกรชันที่จำเป็นต่อการบริหารองค์กรได้ที่นี่",
    },
    quickLinkLabel: "ศูนย์ควบคุมผู้ดูแล",
  },
  dashboard: {
    breadcrumb: {
      home: "หน้าหลัก",
      dashboard: "แดชบอร์ด",
    },
  },
  navProjects: {
    moreLabel: "เพิ่มเติม",
    viewProject: "ดูโปรเจกต์",
    shareProject: "แชร์โปรเจกต์",
    deleteProject: "ลบโปรเจกต์",
  },
  navUser: {
    upgrade: "อัปเกรดเป็น Pro",
    settings: "การตั้งค่า",
    notifications: "การแจ้งเตือน",
    billing: "การเรียกเก็บเงิน",
    logout: "ออกจากระบบ",
  },
  teamSwitcher: {
    heading: "ทีม",
    addTeam: "เพิ่มทีม",
    defaultTeamName: "ทีม",
  },
  userRoles: {
    ADMIN: "Admin",
    STAFF: "Operation",
    USER: "Member",
  },
  auth: {
    login: {
      title: "เข้าสู่บัญชีของคุณ",
      description: "กรอกอีเมลเพื่อเข้าสู่แดชบอร์ด",
      emailLabel: "อีเมล",
      passwordLabel: "รหัสผ่าน",
      forgotPassword: "ลืมรหัสผ่าน?",
      submit: "เข้าสู่ระบบ",
      google: "เข้าสู่ระบบด้วย Google",
      ctaPrompt: "ยังไม่มีบัญชีใช่ไหม?",
      ctaAction: "สมัครสมาชิก",
      error: "ไม่สามารถเข้าสู่ระบบได้ โปรดลองอีกครั้ง",
    },
    register: {
      title: "สร้างบัญชี",
      description: "กรอกแบบฟอร์มด้านล่างเพื่อสร้างบัญชีของคุณ",
      nameLabel: "ชื่อ",
      emailLabel: "อีเมล",
      passwordLabel: "รหัสผ่าน",
      submit: "สมัครสมาชิก",
      ctaPrompt: "มีบัญชีอยู่แล้วใช่ไหม?",
      ctaAction: "เข้าสู่ระบบ",
    },
  },
};

export default dictionary;
