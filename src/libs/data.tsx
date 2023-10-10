import { type IOption, type ITabBarCommon } from './model'

export const memberFunc: ITabBarCommon[] = [
  { label: '个人信息', value: 0, name: 'personInfo' },
  { label: '设备管理', value: 1, name: 'MemberDevice' },
  { label: '上传周报', value: 2, name: 'MemberWeekReport' },
  { label: '历史周报', value: 3, name: 'MemberHistoryReport' }
]

export const leaderFunc: ITabBarCommon[] = [
  { label: '个人信息', value: 0, name: 'personInfo' },
  { label: '组员管理', value: 1, name: 'groupManage' },
  { label: '设备管理', value: 2, name: 'LDevice' },
  { label: '上传周报', value: 3, name: 'LeaderWeekReport' },
  { label: '历史周报', value: 4, name: 'LeaderHistoryReport' },
  { label: '某成员周报查询', value: 5, name: 'LSBReport' },
  { label: '整体周报提交情况', value: 6, name: 'LAllReport' }
]

export const managerFunc: ITabBarCommon[] = [
  { label: '个人信息', value: 0, name: 'MInfo' },
  { label: '成员管理', value: 1, name: 'TeamManage' },
  { label: '设备管理', value: 2, name: 'MDevice' },
  { label: '某成员周报查询', value: 3, name: 'MSBReport' },
  { label: '整体周报提交情况', value: 4, name: 'MAllReport' }
]

export const treeData = [
  {
    value: '1',
    title: '项目服务',
    disabled: true,
    children: [
      {
        value: '1-1',
        title: '纵向',
        disabled: true,
        children: [
          {
            value: '1-1-1',
            title: '项目申请（申请材料撰写，答辩ppt制作等和项目申请相关的工作）',
            disabled: false
          },
          {
            value: '1-1-2',
            title: '项目运营（项目的研发，各单位协调，中期审核，项目出差等）',
            disabled: false
          },
          {
            value: '1-1-3',
            title: '项目结题 （项目结题答辩，项目结题材料撰写等）',
            disabled: false
          }
        ]
      },
      {
        value: '1-2',
        title: '横向',
        disabled: true,
        children: [
          {
            value: '1-2-1',
            disabled: false,
            title: '项目申请（合同，标书等申请材料撰写）'
          },
          {
            value: '1-2-2',
            disabled: false,
            title: '项目执行 （项目期间的数据采集，技术研发，项目出差，和甲方沟通等）'
          },
          {
            value: '1-2-3',
            disabled: false,
            title: '项目验收 （验收材料撰写，技术验收等）'
          }
        ]
      },
      {
        value: '1-3',
        title: '成果产出',
        disabled: true,
        children: [
          {
            value: '1-3-1',
            disabled: false,
            title: '奖项申请（国家级或省部级奖项的申请工作）'
          },
          {
            value: '1-3-2',
            disabled: false,
            title: '知识产权（软著，专利等材料撰写）'
          }
        ]
      }
    ]
  },
  {
    value: '2',
    title: '课程教学',
    disabled: true,
    children: [
      {
        value: '2-1',
        disabled: false,
        title: '助教（协助完成课程管理，课程流程设计，组织考试，学生答疑，作业批改等课程日常工作）'
      },
      {
        value: '2-2',
        disabled: false,
        title: '其他（教学成果产出，书籍撰写，课程调研等）'
      }
    ]
  },
  {
    value: '3',
    title: '设备服务',
    disabled: true,
    children: [
      {
        value: '3-1',
        title: '大型设备采购',
        disabled: true,
        children: [
          {
            value: '3-1-1',
            disabled: false,
            title: '招投标（采购调研，招投标，可行性分析等学校采购流程材料撰写，采购手续，合同签订等）'
          },
          {
            value: '3-1-2',
            disabled: false,
            title: '财务流程（外贸免税材料，财务支付，各类凭证票据管理）'
          },
          {
            value: '3-1-3',
            disabled: false,
            title: '设备验收（贵重物品验收报告等，学校财产验收流程）'
          }
        ]
      },
      {
        value: '3-2',
        disabled: false,
        title: '设备维护(常规维护，设备管理，集体设备维修，比如十卡，无人车等)'
      }
    ]
  },
  {
    value: '4',
    title: '涉密服务',
    disabled: true,
    children: [
      {
        value: '4-1',
        disabled: false,
        title: '保密检查（协调组织团队应对学校或北京市的保密检查等相关事务）'
      },
      {
        value: '4-2',
        disabled: false,
        title: '涉密手续（跑学校的保密手续，涉密任务，涉密涉密材料撰写，团队的日常涉密任务等诸多涉密相关任务）'
      },
      {
        value: '4-3',
        disabled: false,
        title: '涉密项目（具体细则遵循项目服务，包括项目申请，项目中期，项目结题等）'
      }
    ]
  },
  {
    value: '5',
    title: '科研服务',
    disabled: true,
    children: [
      {
        value: '5-1',
        disabled: false,
        title: '团队信息维护（团队网站维护，paper_reading等学习资料的维护）'
      },
      {
        value: '5-2',
        disabled: false,
        title: '数据集采集（团队的数据集标注，数据集采集等）'
      },
      {
        value: '5-3',
        disabled: false,
        title: '团队宣传与招生（夏令营宣讲，代表团队进行学术报告，宣传新闻稿撰写，宣传海报制作，宣传视频设计，招生面试等）'
      },
      {
        value: '5-4',
        disabled: false,
        title: '团队集群管理（服务器的定期数据清理，协调服务器的正常使用）'
      },
      {
        value: '5-5',
        disabled: false,
        title: '其他（其他财务流程，独立于上述各点的材料书写，方案设计，科研小组组长）'
      }
    ]
  },
  {
    value: '6',
    disabled: false,
    title: '其他此项包括任何独立于上述选项的额外的因团队占用大块时间的部分（比如所庆，承办大型会议，接待外校老师等）'
  }
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
