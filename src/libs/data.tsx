import { type IOption, type ITabBarCommon } from './model'

export const studentFunc: ITabBarCommon[] = [
  { label: '个人信息', value: 0, name: 'personInfo' },
  { label: '设备管理', value: 1, name: 'deviceManager' },
  { label: '组会管理', value: 2, name: 'groupManage' },
  { label: '周报管理', value: 3, name: 'weekReport' },
  // { label: '经费报销', value: 4, name: 'reimbursement' },
  { label: '请假管理', value: 4, name: 'leaveRequest' },
  { label: '成果管理', value: 5, name: 'production' },
  { label: '项目管理', value: 6, name: 'project' }
]

export const teacherFunc: ITabBarCommon[] = [
  { label: '个人信息', value: 0, name: 'personInfo' },
  { label: '成员管理', value: 1, name: 'teamManager' },
  { label: '设备管理', value: 2, name: 'TDeviceManager' },
  { label: '组会管理', value: 3, name: 'groupManage' },
  { label: '周报管理', value: 4, name: 'TWeekReport' },
  // { label: '经费报销', value: 5, name: 'TReimbursement' },
  { label: '请假管理', value: 5, name: 'TLeaveRequest' },
  { label: '成果管理', value: 6, name: 'TProduction' },
  { label: '项目管理', value: 7, name: 'TProject' },
  { label: '数据管理', value: 8, name: 'TDataManage' }
]

export const managerFunc: ITabBarCommon[] = [
  { label: '个人信息', value: 0, name: 'MInfo' },
  { label: '用户管理', value: 1, name: 'userControl' }
  // { label: '经费报销', value: 2, name: 'MReimbursement' }
  // { label: '数据管理', value: 3, name: 'MDataManage' }
]

export const StuModuleOption: IOption[] = [
  { value: 'meeting', label: '组会模块' },
  { value: 'report', label: '周报模块' },
  { value: 'reimbursement', label: '报销模块' },
  { value: 'request', label: '请假模块' },
  { value: 'production', label: '成果管理' },
  { value: 'project', label: '项目管理' }
]

export const TeaModuleOption: IOption[] = [
  { value: 'device', label: '设备模块' },
  { value: 'meeting', label: '组会模块' },
  { value: 'reimbursement', label: '报销模块' }
]

export const NavItem: IOption[] = [
  { value: 'patent', label: '专利' },
  { value: 'thesis', label: '论文' },
  { value: 'copyright', label: '著作权' },
  { value: 'winning', label: '获奖' }
]

export const copyRightType: IOption[] = [
  { value: '01', label: '文字作品' },
  { value: '02', label: '口述作品' },
  { value: '03', label: '音乐、戏剧、曲艺、舞蹈、杂技艺术作品' },
  { value: '04', label: '美术、建筑作品' },
  { value: '05', label: '摄影作品' },
  { value: '06', label: '电影作品和以类似摄制电影的方法创作的作品' },
  { value: '07', label: '工程设计图、产品设计图、地图、示意图等图形作品和模型作品' },
  { value: '08', label: '计算机软件' },
  { value: '09', label: '法律、行政法规规定的其他作品' }
]

export const awardGradeOption: IOption[] = [
  { value: '01', label: '一等奖' },
  { value: '02', label: '二等奖' },
  { value: '03', label: '三等奖' },
  { value: '04', label: '特等奖' },
  { value: '05', label: '其他' }
]

export const awardLevelOption: IOption[] = [
  { value: '01', label: '国家级' },
  { value: '02', label: '省级' },
  { value: '03', label: '市级' },
  { value: '04', label: '区级' },
  { value: '05', label: '校级' },
  { value: '06', label: '国际级' },
  { value: '07', label: '其他' }
]

export const principalClassificationNumberOption: IOption[] = [
  { value: 'A', label: 'A - 人类生活必需' },
  { value: 'B', label: 'B - 作业；运输' },
  { value: 'C', label: 'C - 化学；冶金' },
  { value: 'D', label: 'D - 纺织；造纸' },
  { value: 'E', label: 'E - 固定建筑物' },
  { value: 'F', label: 'F - 机械工程;照明;加热;武器;爆破' },
  { value: 'G', label: 'G - 物理' },
  { value: 'H', label: 'H - 电学' }
]

export const publicationNameOption: IOption[] = [
  { value: 'T', label: 'T类 - 特种刊物论文' },
  { value: 'A', label: 'A类 - 权威核心刊物论文' },
  { value: 'B', label: 'B类 - 重要核心刊物论文' },
  { value: 'C', label: 'C类 - 一般核心刊物论文' },
  { value: 'D', label: 'D类 - 一般公开刊物论文' },
  { value: 'E', label: 'E类 - 受限公开刊物论文' }
]

export const disciplineOneOption: IOption[] = [
  { value: '110', label: '110 - 数学' },
  { value: '120', label: '120 - 信息科学与系统科学' },
  { value: '130', label: '130 - 力学' },
  { value: '140', label: '140 - 物理学' },
  { value: '150', label: '150 - 化学' },
  { value: '160', label: '160 - 天文学' },
  { value: '170', label: '170 - 地球科学' },
  { value: '180', label: '180 - 生物学' },
  { value: '210', label: '210 - 农学' },
  { value: '220', label: '220 - 林学' },
  { value: '230', label: '230 - 畜牧、兽医科学' },
  { value: '240', label: '240 - 水产学' },
  { value: '310', label: '310 - 基础医学' },
  { value: '320', label: '320 - 临床医学' },
  { value: '330', label: '330 - 预防医学与卫生学' },
  { value: '340', label: '340 - 军事医学与特种医学' },
  { value: '350', label: '350 - 药学' },
  { value: '360', label: '360 - 中医学与中药学' },
  { value: '410', label: '410 - 工程与技术科学基础学科' },
  { value: '420', label: '420 - 测绘科学技术' },
  { value: '430', label: '430 - 材料科学' },
  { value: '440', label: '440 - 矿山工程技术' },
  { value: '450', label: '450 - 冶金工程技术' },
  { value: '460', label: '460 - 机械工程' },
  { value: '470', label: '470 - 动力与电气工程' },
  { value: '480', label: '480 - 能源科学技术' },
  { value: '490', label: '490 - 核科学技术' },
  { value: '510', label: '510 - 电子、通信与自动控制技术' },
  { value: '520', label: '520 - 计算机科学技术' },
  { value: '530', label: '530 - 化学工程' },
  { value: '540', label: '540 - 纺织科学技术' },
  { value: '550', label: '550 - 食品科学技术' },
  { value: '560', label: '560 - 土木建筑工程' },
  { value: '570', label: '570 - 水利工程' },
  { value: '580', label: '580 - 交通运输工程' },
  { value: '590', label: '590 - 航空、航天科学技术' },
  { value: '610', label: '610 - 环境科学技术' },
  { value: '620', label: '620 - 安全科学技术' },
  { value: '630', label: '630 - 管理学' },
  { value: '710', label: '710 - 马克思主义' },
  { value: '720', label: '720 - 哲学' },
  { value: '730', label: '730 - 宗教学' },
  { value: '740', label: '740 - 语言学' },
  { value: '750', label: '750 - 文学' },
  { value: '760', label: '760 - 艺术学' },
  { value: '770', label: '770 - 历史学' },
  { value: '780', label: '780 - 考古学' },
  { value: '790', label: '790 - 经济学' },
  { value: '810', label: '810 - 政治学' },
  { value: '820', label: '820 - 法学' },
  { value: '830', label: '830 - 军事学' },
  { value: '840', label: '840 - 社会学' },
  { value: '850', label: '850 - 民族学' },
  { value: '860', label: '860 - 新闻学与传播学' },
  { value: '870', label: '870 - 图书馆、情报与文献学' },
  { value: '880', label: '880 - 教育学' },
  { value: '890', label: '890 - 体育科学' },
  { value: '910', label: '910 - 统计学' }
]
