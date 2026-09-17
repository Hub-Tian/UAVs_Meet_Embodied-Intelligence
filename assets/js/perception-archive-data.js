// Source workbook enrichment; original card data is preserved.
window.PERCEPTION_ARCHIVE_DATA = [
  {
    "id": "ad-aot",
    "category": "embodied-perception",
    "title": "Anti-distractor active object tracking in 3D environments",
    "methodName": "Ad-AOT",
    "authors": [
      "Mao Xi",
      "Yun Zhou",
      "Zheng Chen",
      "Wengang Zhou",
      "Houqiang Li"
    ],
    "taskTags": [
      "具身跟踪"
    ],
    "methodTags": [
      "RL"
    ],
    "datasets": [
      "自建数据集",
      "仿真场景"
    ],
    "venue": "TCSVT",
    "year": "2021",
    "summary": "Develops a reinforcement learning tracking framework that explicitly models 3D distractor dynamics to sustain active target tracking in complex airspace.",
    "theFirst": "首次尝试在 3D 干扰环境中探索抗干扰主动目标跟踪",
    "image": "assets/papers/perception/ad-aot.png",
    "paperUrl": "https://ieeexplore.ieee.org/document/9521193",
    "codeUrl": "",
    "cardId": "paper-card-ad-aot",
    "type": "RL",
    "publication": "TCSVT",
    "authorsText": "Xi, Mao and Zhou, Yun and Chen, Zheng and Zhou, Wengang and Li, Houqiang",
    "method": "1. 通道注意力机制（Channel-wise Attention）：利用目标模板特征对当前观测图像特征进行两次通道乘法操作，通过嵌入目标先验知识使模型产生目标感知的特征表达，从而在特征层面抑制干扰物信息 。\n2. 多头时间注意力机制（Multi-head Temporal Attention）：引入嵌入缓存（Embedding Buffer）保存历史特征，通过多头注意力计算当前帧与历史帧的关联，提取包含运动和外观变化信息的时序特征，增强跟踪的鲁棒性 。\n3. 基于 A3C 的端到端策略学习：将融合后的时空特征输入 Actor-Critic 网络，直接输出 11 类离散动作（包括 xyz 三轴移动及俯仰/偏航角旋转），实现从原始像素到控制指令的闭环控制 。\n4. 双重距离奖赏函数设计：结合视觉距离奖赏（使目标居于视野中心）和空间距离奖赏（保持理想跟踪距离），引导 Agent 学习稳定的 3D 跟踪策略 。",
    "datasetText": "1. 自建仿真环境：利用 Unreal Engine 和 UnrealCV 构建了包含多样化障碍物、随机纹理和多干扰目标的动态 3D 场景。其中 CrowdRoom 用于训练（含 13 个随机运动的行人），CityStreet（模拟城市街道）和 Nature（含植被遮挡的自然场景）用于测试 。\n2. 公开数据集验证：在 UAV123 数据集的真实世界航拍序列上进行了定性分析，验证模型在真实场景下的目标敏感度和动作响应正确性 。\n3. 数据规模与配置：训练最大全局迭代次数为 200K，采样频率为 6Hz，观测输入包括 36 像素模板和 84 像素观测序列 。",
    "results": "1. 综合性能提升：在多干扰场景（Nature）中，Ad-AOT 的平均幕长（EL）达到 $482 \\pm 77$，累计奖赏（AR）为 $371 \\pm 133$，显著优于 DaSiam ($EL=204 \\pm 163$) 和 KCF ($EL=24 \\pm 11$) 等 passive 跟踪基准 。\n2. 鲁棒性指标：在 CityStreet 环境下，Ad-AOT 的失败次数 ($R_o$) 为 0.7，远低于传统 SOTA 算法 DaSiam (1.7) 和 TLD (2.0) 。\n3. 消融实验结果：移除时间注意力模块后，Garden 环境下的 EL 从 417 降至 328；若同时移除通道注意力（Layer3 & Layer4），EL 进一步跌至 67，证明了双重注意力机制在抗干扰中的关键作用 。\n4. 实时性表现：在 GTX 1080Ti 上决策耗时仅为 13ms，满足实时处理需求 。",
    "problem": "1. 干扰物误导问题：现有主动跟踪算法多假设单目标场景，在存在多个相似干扰物（如人群）的复杂场景下易丢失目标 。\n2. 目标特征编码与区分度瓶颈：如何在有限的目标先验知识下，有效地将目标特征编码至强化学习 Agent 中以区分目标与干扰物 。\n3. 3D 空间控制失配：传统方法多局限于 2D 平面或固定视角，难以应对无人机在 3D 空间内自由运动导致的复杂控制逻辑需求 。",
    "sourceRow": 2,
    "sourceWorkbook": "具身感知文献汇总表_cleaned.xlsx"
  },
  {
    "id": "semantic-aware-path-planning",
    "category": "embodied-perception",
    "title": "Semantic-aware active perception for uavs using deep reinforcement learning",
    "methodName": "Proposed semantic-aware path-planning pipeline",
    "authors": [
      "Luca Bartolomei",
      "Lucas Teixeira",
      "Margarita Chli"
    ],
    "taskTags": [
      "主动感知",
      "具身导航"
    ],
    "methodTags": [
      "RL"
    ],
    "datasets": [
      "自建数据集",
      "真实场景"
    ],
    "venue": "IROS",
    "year": "2021",
    "summary": "Presents a deep reinforcement learning path-planning pipeline integrating semantic spatial understanding for robust active aerial perception.",
    "theFirst": "",
    "image": "assets/papers/perception/semantic-aware-path-planning.png",
    "paperUrl": "https://ieeexplore.ieee.org/document/9635893",
    "codeUrl": "",
    "cardId": "paper-card-semantic-aware-path-planning",
    "type": "RL",
    "publication": "IROS",
    "authorsText": "Bartolomei, Luca and Teixeira, Lucas and Chli, Margarita",
    "method": "1. 基于中层表示的任务解耦架构：系统由位姿估计、RL智能体和规划模块组成 。采用语义掩码作为智能体输入，通过解耦语义标签获取与路径决策，降低了输入空间维度并提升了对不同视觉表现（Texture）的泛化能力 。\n2. 动态感知权重生成的RL策略：利用Actor-Critic模型（集成CNN与LSTM）实时分析当前视野中的语义构成，输出各语义类别的感知信息化权重（Informativeness Scores），捕捉如“车辆与道路”等空间依赖关系 。\n3. 多约束感知感知路径规划：将RL输出的权重注入代价函数 。首先通过 kinodynamic $A^*$ 算法搜索满足动力学约束的代价最小路径，随后通过 B-Spline 进行轨迹优化，在确保平滑避障的同时，维持相机对高权重语义地标的追踪 。\n4. 三维联合奖励引导机制：设计的奖励函数包含生存奖励（防止丢失追踪）、定位误差奖励（RMSE惩罚）及目标进度奖励，迫使智能体在保证定位稳定性的前提下寻找通往目标的最高效路径 。",
    "datasetText": "自建数据集, 真实场景",
    "results": "1. 任务成功率显著领先：在所有6个测试场景中均取得最高成功率。在Racetrack、Baxall、Fraser、House Garden四个挑战场景中达到了100%成功率，相比于经典的反应式规划（Success Rate仅15%-20%）和之前的语义规划器（Success Rate约70%-90%）有显著提升 。\n2. 定位误差（RMSE）大幅降低：在Villages场景中，定位均方根误差从基线的5.8m降至1.2m；在Baxall实景模型中，误差控制在0.9m以内 。\n3. 零样本跨域泛化能力：实验证明策略能直接从随机生成的虚拟训练场景迁移至光实感的复杂实景模型中，无需任何针对性微调，即可动态避开水面等视觉不稳定区域 。",
    "problem": "1. 视觉定位的环境敏感性问题：单目视觉SLAM在弱纹理（如湖泊）、动态干扰（如移动车辆/随风摇摆的树木）及镜面反射区域极易产生累计误差导致定位丢失 。\n2. 感知权重静态化与不可调优性：现有感知感知规划器多依赖手动设定的固定语义权重（如二值化处理），无法随飞行环境实时变化动态调整各语义类别的“定位贡献度” 。\n3. 感知与规划耦合导致的训练瓶颈：直接从原始RGB图像学习感知权重涉及隐式语义分割，搜索空间巨大，导致强化学习难以收敛且泛化性极差 。",
    "sourceRow": 3,
    "sourceWorkbook": "具身感知文献汇总表_cleaned.xlsx"
  },
  {
    "id": "adaptive-informative-path-planning",
    "category": "embodied-perception",
    "title": "Adaptive informative path planning using deep reinforcement learning for uav-based active sensing",
    "methodName": "Adaptive Informative Path Planning Using Deep Reinforcement Learning for UAV-based Active Sensing",
    "authors": [
      "Julius Ruckin",
      "Liren Jin",
      "Popovic"
    ],
    "taskTags": [
      "主动感知"
    ],
    "methodTags": [
      "Planning+RL"
    ],
    "datasets": [
      "自建数据集",
      "真实场景"
    ],
    "venue": "ICRA",
    "year": "2022",
    "summary": "Proposes an adaptive informative path planning formulation using deep reinforcement learning for active sensing across complex terrain.",
    "theFirst": "首个在具有空间相关性的地形、大动作空间场景下，实现无人机在线自适应信息路径规划的强化学习方法 。",
    "image": "assets/papers/perception/adaptive-informative-path-planning.png",
    "paperUrl": "https://ieeexplore.ieee.org/document/9812025/",
    "codeUrl": "",
    "cardId": "paper-card-adaptive-informative-path-planning",
    "type": "Planning+RL",
    "publication": "ICRA",
    "authorsText": "Ruckin, Julius and Jin, Liren and Popovic",
    "method": "1. MCTS 与 CNN 耦合架构：结合蒙特卡洛树搜索的结构化探索能力与 CNN（基于 ERFNet 编码器）的策略-价值预测能力，通过学到的价值函数替代高方差的 Rollout 模拟，显著提升样本效率 。\n2. 低数据量训练优化组件：引入自适应回放池尺寸、指数衰减的探索常数（$c_1$）及狄利克雷噪声（$\\delta$），并采用强制采样与策略剪枝技术，在较少仿真次数下实现稳定收敛 。\n3. 轻量化在线重规划机制：在任务执行阶段，部署训练好的网络进行高效率树搜索，通过禁用噪声和强制采样来确保实时决策，使算法能在计算资源有限的设备上运行 。\n4. 多维度特征融合输入：CNN 输入端整合了当前地图协方差、剩余航行预算、无人机位置及成本特征图，并包含历史状态序列以捕捉时空语境信息 。",
    "datasetText": "2. MM-GAG：作者自建多模态目标评测数据集，包含 73 个不同地区搜索区域；每个区域按不同起终点距离 C 选择 5 组 start-goal，对每个 C 得到 365 个评测场景；支持航拍图像、地面图像、自然语言三种目标模态。",
    "results": "1. 计算性能提升：相比于现有的 CMA-ES 和 MCTS 规划方法，该方法的重规划运行时间缩短了 8-10 倍 。\n2. 感知效率优势：在感兴趣区域（ROI）的地图不确定性（$Tr(P)$）和均方根误差（RMSE）降低速度上，显著优于传统的覆盖路径（Coverage）和随机采样方案 。\n3. 实机迁移验证：仅在合成数据上训练的模型成功迁移至真实热成像数据场景，展现出比 Lawnmower 传统路径更快的感知收敛速度 。\n4. 消融实验结果：证明了自适应回放池（Adaptive replay buffer）和探索常数调度（Scheduling）是提升规划稳定性和质量的关键，相比固定尺寸设置具有更好的一致性 。",
    "problem": "1. 预测重规划的计算瓶颈：传统 IPP 方法在评估后续动作时需前向模拟多次测量，计算开销巨大，难以在计算受限的无人机平台上实现高效在线重规划 。\n2. 动作空间与规划质量的冲突：现有方法常通过离散化（如稀疏图）简化动作空间以维持计算效率，但这牺牲了规划路径的精度和质量 。\n3. 空间相关性带来的评价复杂性：在考虑地形空间相关性时，评估信息准则（如 A-最优）的计算逻辑极其复杂且昂贵 。\n4. 强化学习在机器人任务中的训练低效性：传统的 AlphaZero 类算法依赖海量仿真，而机器人主动感知任务的仿真成本高，存在明显的“低数据量”训练难题 ",
    "sourceRow": 4,
    "sourceWorkbook": "具身感知文献汇总表_cleaned.xlsx"
  },
  {
    "id": "gomaa-geo",
    "category": "embodied-perception",
    "title": "Gomaa-geo: Goal modality agnostic active geo-localization",
    "methodName": "GOMAA-Geo",
    "authors": [
      "Anindya Sarkar",
      "Srikumar Sastry",
      "Aleksis Pirinen",
      "Chongjie Zhang",
      "Nathan Jacobs",
      "Yevgeniy Vorobeychik"
    ],
    "taskTags": [
      "主动感知",
      "具身搜索"
    ],
    "methodTags": [
      "Active Perception"
    ],
    "datasets": [
      "真实场景",
      "自建数据集"
    ],
    "venue": "NeurIPS",
    "year": "2024",
    "summary": "Introduces a goal-modality agnostic framework enabling active visual geo-localization for UAVs across diverse observation and imagery conditions.",
    "theFirst": "未提及",
    "image": "assets/papers/perception/gomaa-geo.png",
    "paperUrl": "https://arxiv.org/abs/2406.01917",
    "codeUrl": "",
    "cardId": "paper-card-gomaa-geo",
    "type": "Active Perception",
    "publication": "NeurIPS",
    "authorsText": "Sarkar, Anindya and Sastry, Srikumar and Pirinen, Aleksis and Zhang, Chongjie and Jacobs, Nathan and Vorobeychik, Yevgeniy",
    "method": "1. 跨模态目标表征对齐：训练航拍图像编码器，使其通过 InfoNCE 与 CLIP 图像空间对齐，再与 CLIP 文本/地面图像表征共享统一空间，解决目标模态不一致问题。\n2. GASP 目标感知监督预训练：随机生成历史轨迹序列，让 LLM 根据历史观测、动作和目标内容预测能使 agent 更接近目标的最优动作集合，用 BCE 训练历史感知目标条件表征。\n3. LLM 表征与 RL 规划解耦：LLM 负责编码历史和目标，actor-critic PPO 负责基于该 latent 表征输出动作分布和值函数，避免仅依赖 LLM 直接规划。\n4. 密集奖励塑形：靠近目标给 +1，远离目标或重复访问给 -1，到达目标给 +2，使局部搜索过程获得更强学习信号，而不是只依赖到达目标的稀疏奖励。",
    "datasetText": "1. Masa：用于主要训练和航拍目标图像评测，论文按 70% / 15% / 15% 划分训练、验证、测试。\n2. MM-GAG：作者自建多模态目标评测数据集，包含 73 个不同地区搜索区域；每个区域按不同起终点距离 C 选择 5 组 start-goal，对每个 C 得到 365 个评测场景；支持航拍图像、地面图像、自然语言三种目标模态。\n3. xBD-pre / xBD-disaster：用于零样本灾害泛化评测，包含灾前与灾后航拍图像；模型仅在 Masa 上训练，测试时用灾前目标图像，在灾前/灾后航拍观测中定位目标。",
    "results": "1. 航拍目标主实验 SR：在 Masa 5×5、B=10 下，GOMAA-Geo 在 C=4/5/6/7/8 分别达到 0.4090 / 0.5056 / 0.7168 / 0.8034 / 0.7854，显著高于 DiT 的 0.2011 / 0.2956 / 0.3567 / 0.4216 / 0.4559；论文报告相对基线提升范围为 129.00%–232.67%。\n2. 跨目标模态零样本 SR：在 MM-GAG 上，文本目标为 0.4000 / 0.4978 / 0.6766 / 0.7702 / 0.6595，地面图像目标为 0.4383 / 0.5150 / 0.6808 / 0.7489 / 0.6893，航拍图像目标为 0.4085 / 0.5064 / 0.6638 / 0.7362 / 0.7021，说明训练只用航拍目标时仍能迁移到文本和地面图像目标。\n3. 灾害场景零样本 SR：在 xBD-disaster 上，GOMAA-Geo 为 0.4002 / 0.4632 / 0.6553 / 0.7391 / 0.6942，DiT 为 0.1012 / 0.2389 / 0.3067 / 0.3390 / 0.3543；论文报告相对基线提升 221.15%–346.83%。\n4. 消融：去掉 planner 的 LLM-Geo 在 Masa 上为 0.2331 / 0.2591 / 0.3121 / 0.3967 / 0.4051，完整 GOMAA-Geo 为 0.4090 / 0.5056 / 0.7168 / 0.8034 / 0.7854；性能差距 75.46%–129.66%。稀疏奖励 Sparse-GOMAA 在 Masa 上为 0.3562 / 0.4312 / 0.6009 / 0.7318 / 0.6978，低于完整模型。",
    "problem": "1. 目标模态与搜索观测模态失配：现实 SAR 场景中的目标线索可能是文本或地面图像，但 UAV 搜索过程中只能看到连续航拍局部视野。\n2. 局部可观测与有限搜索预算冲突：无人机不能一次看到完整区域，且受电池、任务紧迫性约束，需要根据历史观测高效选择下一步搜索方向。\n3. 训练模态单一与测试模态多样之间的泛化矛盾：训练时仅使用航拍目标图像，但测试时需要泛化到文本、地面图像、灾后场景等未见目标模态/环境分布。",
    "sourceRow": 5,
    "sourceWorkbook": "具身感知文献汇总表_cleaned.xlsx"
  },
  {
    "id": "d-vat",
    "category": "embodied-perception",
    "title": "D-VAT: End-to-end visual active tracking for micro aerial vehicles",
    "methodName": "D-VAT",
    "authors": [
      "Alberto Dionigi",
      "Simone Felicioni",
      "Mirko Leomanni",
      "Gabriele Costante"
    ],
    "taskTags": [
      "具身跟踪"
    ],
    "methodTags": [
      "RL"
    ],
    "datasets": [
      "真实场景",
      "仿真场景",
      "自建数据集"
    ],
    "venue": "RA-L",
    "year": "2024",
    "summary": "Proposes an end-to-end deep reinforcement learning visual active tracking framework for micro aerial vehicles directly mapping monocular images to flight control commands.",
    "theFirst": "首个在不严苛约束目标或追踪器运动的前提下，解决 MAV 视觉主动追踪（VAT）问题的端到端方法 。",
    "image": "assets/papers/perception/d-vat.png",
    "paperUrl": "https://arxiv.org/abs/2308.16874",
    "codeUrl": "https://github.com/isarlab-department-engineering/d-vat",
    "cardId": "paper-card-d-vat",
    "type": "RL",
    "publication": "RAL",
    "authorsText": "Dionigi, Alberto and Felicioni, Simone and Leomanni, Mirko and Costante, Gabriele",
    "method": "1. 不对称演员-评论家（Asymmetric Actor-Critic）机制：训练阶段 Critic 网络接入目标的相对位置、速度、加速度等“特权信息”以精确估计动作价值；推理阶段 Actor 网络仅凭单目 RGB 序列（H=3 帧）输出控制指令，兼顾了训练效率与部署的自主性 。\n2. 感知-控制端到端联合优化：利用 ResNet-18 提取时空视觉特征，直接将其映射为无人机机体系下的集体推力（Thrust）和角速度（Body rates），实现了从像素到低级控制指令的闭环映射 。\n3. 物理一致性的奖励函数设计：设计了包含距离评分、方位评分及仰角评分的多维奖励机制，并引入 Tanh 饱和函数和速度/控制量惩罚，确保生成的控制策略在符合物理执行器限制的同时保持平滑 。\n4. 增强型领域随机化（Domain Randomization）：在仿真中对场景纹理、光照、障碍物以及无人机动力学参数（质量、惯量、空气阻力）进行大幅度随机扰动，提升模型从仿真到现实（Sim-to-Real）的零样本迁移能力 。",
    "datasetText": "1. 仿真训练环境：基于 Unreal Engine 4 构建高保真室内外场景，训练集主要在随机化的家具房间（Box Environment）中生成，通过随机化光照和纹理增强泛化性 。\n2. 任务与轨迹生成：目标 MAV 沿参数化的正弦轨迹运动，通过采样不同的振幅（1-2.5m）、频率（0.04-0.25Hz）和相位构建动态追踪任务 。\n3. 测试场景分类：包含与训练环境类似的 Box 环境，以及跨领域（Zero-shot）的城市（Urban）、公园（Park）和办公大楼（Office）等复杂光影与高动态干扰场景 。",
    "results": "1. 跨场景性能优势：在 Urban、Park、Office 三个写实场景中，D-VAT 的综合得分 $P_c$ 分别达到 0.91、0.94 和 0.92，远超 AOT（0.03）和 AD-VAT+（0.03）等离散动作基线 。\n2. 高动态响应能力：在目标速度提升至 2 m/s 的挑战下，D-VAT 依然保持 0.88 的综合评分，而基于 SiamRPN++ 的模块化基准（LQG/PID）得分仅为 0.03 和 0.08，证明了端到端控制的响应速度 。\n3. 实机部署验证：通过混合现实框架，D-VAT 在无任何微调的情况下成功驱动实机完成 3D 八字形和螺旋形轨迹追踪，综合得分维持在 0.82 以上，验证了卓越的 Sim-to-Real 迁移性 。",
    "problem": "1. 模块化设计的鲁棒性瓶颈：传统方法将感知（目标检测）与控制（PID/LQG）解耦设计，导致两者无法联合优化，感知端的微小误差或目标剧烈运动造成的观测失配易导致整体系统崩溃 。\n2. MAV 动力学特性与动作空间受限的矛盾：现有无人机追踪研究多采用离散动作或将其简化为平面运动，无法充分利用无人机的 3D 灵活性，且生成的控制策略不平滑，易导致目标丢失 。\n3. 高维视觉观测下的样本效率问题：直接从 RGB 图像映射到机体推力和角速度存在极大的状态空间挑战，传统 DRL 在缺乏特权信息引导时难以在复杂动态场景下收敛 。",
    "sourceRow": 6,
    "sourceWorkbook": "具身感知文献汇总表_cleaned.xlsx"
  },
  {
    "id": "gc-vat",
    "category": "embodied-perception",
    "title": "Open-World Drone Active Tracking with Goal-Centered Rewards",
    "methodName": "GC-VAT",
    "authors": [],
    "taskTags": [
      "benchmark",
      "具身跟踪"
    ],
    "methodTags": [
      "Active Tracking"
    ],
    "datasets": [
      "仿真场景"
    ],
    "venue": "NeurIPS",
    "year": "2024",
    "summary": "Establishes a goal-centered reinforcement learning formulation and benchmark for open-world drone active air-to-ground tracking.",
    "theFirst": "论文自述首个开放世界无人机空对地主动跟踪基准（the first open-world drone active air-to-ground tracking benchmark）。其 Table 1 与既有方法所在环境对比自证四项独占：AD-VAT+ 环境 8 场景/1 目标/地面跟踪器/无动力学/人工建场景，D-VAT 4 场景/1 目标/简化动力学/规则目标，AOT 2 场景/1 目标/地面/规则目标；DAT 为 24 场景/24 异构目标/地面+无人机双跟踪器/全物理动力学/类人目标行为/数字孪生自动建场景。在本表三个闭环跟踪基准中的独特生态位：唯一带飞行动力学的（Gym-UnrealCV 地面第一人称、EVT-Bench 室内地面口径）。\n外部复用（单列依据）：OA-VAT（CVPR 2026, 2C）在 DAT 白天条件全部六场景做零样本评测（其训练从未见过 DAT 的车辆目标），CR 平均 242→321（+32.6%）、TSR 0.72→0.86 且方差远低——与 EVT-Bench 被 TrackVLA++/CoMaTrack/USS 复用同构。\n版本注意（检索+GitHub 仓库 SHWplus/DAT_Benchmark 确认）：arXiv v1（2412.00744，2024/12/01）题为《A Cross-Scene Benchmark for Open-World Drone Active Tracking》、方法名 R-VAT；NeurIPS 2025 定稿改现题、方法改名 GC-VAT——R-VAT 与 GC-VAT 为同一方法前后名，检索时防混淆。日期栏按 arXiv v1 优先规则取 2024/12/01（GC-VAT 行原记 2025/12/10 需同步修正）。 | DAT（Drone Active Tracking benchmark；随 GC-VAT 论文《Open-World Drone Active Tracking with Goal-Centered Rewards》发布，无独立论文）",
    "image": "assets/papers/perception/gc-vat.png",
    "paperUrl": "https://arxiv.org/abs/2412.00744",
    "codeUrl": "",
    "cardId": "paper-card-gc-vat",
    "type": "Active Tracking",
    "publication": "NeurIPS",
    "authorsText": "",
    "method": "任务定义（第 2 节）：控制无人机在动态环境中主动跟踪地面目标——凭视觉与运动传感数据学习动作，把初始位于视野中心的目标长时间保持在画面中央；观测为传感器数据（如 84×84 RGB，注意分辨率很低），动作空间可离散（预定义机动集）或连续（直接控速）；成功判据为长时间保持目标居中【TSR 的精确定义式在附录，本次上传页未含，待补核】。回合上限 1500 步，目标连续丢失超 100 步、碰撞或坠机即提前终止——闭环、跟丢即败，标准第二类口径。\n基准构成：(1) 场景——数字孪生工具（基于 Webots osm_importer）：从 OpenStreetMap 选任意区域自动生成带红绿灯与交通规则的高精路网（经 SUMO），高程与植被转 3D 资产、全部可编辑，支持无限场景扩展；据此建 6 个户外场景 × 4 种天气（日/夜/雾/雪）= 24 个城市尺度场景，按七项复杂度指标刻画（面积、色彩丰富度、建筑/树木/道路/地形/隧道密度）——如 citystreet 主考树遮挡（树密度 97.5）、village 主考隧道全遮挡下的运动预测、downtown 主考高楼密度 304.9 下的精度与避障。(2) 目标——5 类 24 个异构个体：10 种汽车（含 Tesla Model3、Bus、Truck 等）、2 种摩托、行人、5 种轮式机器人、6 种足式机器人；类人行为由 SUMO 交通流驱动（掉头、直行、限速、红绿灯、堵车、变道），每图 40 辆车、最高 20m/s、加速度 ±25m/s²。(3) 动力学——无人机全物理仿真（Webots 500Hz，算法 125Hz 更新），平移速度 40m/s、转速 2rad/s，测试高度 22m、云台俯仰 1.37rad。(4) 工程接口——场景/任务/域随机化封装为 Python 类，三种环境类（异步 A3C 式基类、Gymnasium 封装兼容 Stable-Baselines3/Tianshou、并行类支持 PPO/SAC），JSON 配置；额外提供 4 类 13 个奖励设计参数（相机参数、相机-世界与目标-世界齐次变换矩阵、含 crash 标志的跟踪器状态、目标全局位置/相对位姿等特权信息），显式支持多样奖励设计研究。\n评测协议：智能体以 4 个相对目标初始角各跑 10 回合（共 40），按图取均值方差；三档泛化——within-scene（全场景训练、原场景测）、cross-scene（跨场景）、cross-domain（日间训练→夜/雾/雪测）；指标 CR（累计奖励）与 TSR（跟踪成功率）。",
    "datasetText": "1. 基准自身设置见方法列；论文用 DAT 验证 GC-VAT：PPO（γ=0.9, GAE λ=0.95, 熵系数 0.01, clip 0.2），CNN+GRU 骨干（C8×8-16S4 / C4×4-32S2 → GRU256 → FC200/FC100 → Actor FC7 / Critic FC1），35 并行环境、各图 9.2M–21.3M 步；两阶段课程训练（CBT）：先在无遮挡直线运动的简单环境训至收敛，再迁入复杂场景。\n2. 基线为作者复现的 AOT 与 D-VAT（两者及同类均用距离式奖励——作者论证其在倾斜俯视下失真，故基线选择本身服务于论点；引用对比数字时注意 D-VAT 成绩是 GC-VAT 作者在 DAT 上的复现口径，非 D-VAT 原文口径）。\n3. 真实世界验证两级：(a) 零样本真实视频测试——VOT/DTB70/UAVDT 各 8 段车辆视频，因录制视频无相机控制，以 Correct Action Rate（预测动作正确率）衡量；(b) 真机部署——DJI Mini 3 Pro + RTX 3050 笔记本 + DJI Mobile SDK，全管线 >30 FPS。",
    "results": "1. GC-VAT 在 DAT 上（对 D-VAT 基线）：within-scene 平均 CR 提升 591%（35→242）、TSR 提升 279%（0.19→0.72）；cross-scene CR +376%（37→176）、TSR +200%（0.19→0.57）；cross-domain CR +509%（35→213）、TSR +253%（0.19→0.67）。AOT 与 D-VAT 两个基线在 DAT 上普遍学不出有效策略（CR 个位数到几十、TSR≈0.2 上下且训练奖励曲线平坦或下降）——作者归因于距离式奖励在倾斜俯视投影下给出误导反馈（附录 C.1 命题 1 理论证明），这组\"旧基线在新基准上集体失效\"本身是 DAT 复杂度论点的证据，也是引用时的口径警示。\n2. 场景难度画像（可作正文素材）：cross-scene 下 downtown（密集建筑+复杂路元素）成绩最低、village（色彩均一+简单路况）最高；cross-domain 下夜间与雾天尚可、雪天最差（场景色调变化适应性弱）。消融：无 CBT 在 citystreet/downtown/farmland 三张复杂图上不收敛；域随机化中初始角度随机化（AR）贡献最大；奖励设计消融 TSR 提升约 8–11 倍（0.06→0.57~0.72）。\n3. 鲁棒性测试：风扰（前向/侧向 2.5–7.5m/s + 偏航 0.05–0.15rad/s）TSR 降幅 <0.06；雨滴模糊仿真 TSR 降幅 <0.07；近旁放置相似车辆干扰物 TSR 0.91；未见目标类（bus）TSR 降幅 <0.03。\n4. 真实世界：24 段真实视频平均 Correct Action Rate 81.0%（随机策略约 42%，t 检验 p<0.001）；DJI Mini 3 Pro 真机零样本 TSR 88.4%、CAR 81.3%。\n5. 局限（附录 F 自述）：真实开放环境部署仍高度困难——大量相似干扰物与真实复杂度和仿真间差距显著；真机验证仅为简单真实场景。",
    "problem": "1. 统一基准缺失：既有 VAT 基准场景复杂度低、忽略跟踪器动力学或用过度简化模型，不足以检验智能体性能；先前方法用规则式目标管理，远达不到类人目标行为；且 3D 场景全靠人工搭建，工作量大、场景数受限。\n2. 固定水平视角的局限：先前方法中跟踪器只能从固定前向水平视角取像——对空对地跟踪，固定前视拍进大量天空、目标相关视觉信息少；且\"把目标保持在画面中心\"的目标使该视角把跟踪器限制在与目标同高，严重束缚感知与移动范围（此痛点同时铺垫 GC-VAT 的奖励设计动机：现有距离式奖励在倾斜俯视投影下失真，见 GC-VAT 行）。\n3. 复杂开放环境直接训练收敛慢、难以形成强行为。",
    "sourceRow": 7,
    "sourceWorkbook": "具身感知文献汇总表_cleaned.xlsx"
  },
  {
    "id": "cel",
    "category": "embodied-perception",
    "title": "Cognitive embodied learning for anomaly active target tracking",
    "methodName": "CEL",
    "authors": [
      "Qihui Wu",
      "Jiahao Li",
      "Fuhui Zhou",
      "Jiahuan Ji",
      "Haoyang Wang",
      "Hongtao Liang",
      "Kai-Kuang Ma"
    ],
    "taskTags": [
      "具身跟踪"
    ],
    "methodTags": [
      "RL"
    ],
    "datasets": [
      "仿真场景",
      "真实场景"
    ],
    "venue": "Communications Engineering",
    "year": "2025",
    "summary": "Introduces a cognitive embodied learning paradigm for UAVs to perform robust active tracking under anomalous target behaviors and dynamic environmental disturbances.",
    "theFirst": "",
    "image": "assets/papers/perception/cel.png",
    "paperUrl": "https://www.nature.com/articles/s44172-025-00556-6",
    "codeUrl": "",
    "cardId": "paper-card-cel",
    "type": "RL",
    "publication": "Communications Engineering",
    "authorsText": "Wu, Qihui and Li, Jiahao and Zhou, Fuhui and Ji, Jiahuan and Wang, Haoyang and Liang, Hongtao and Ma, Kai-Kuang",
    "method": "1. 双系统架构机制：模拟人脑双决策系统（System 1 & 2），构建常态具身学习模式与异常处理模式的动态切换机制，通过不同系统的解耦决策解决了代理在极端状态下的执行策略失效问题 。\n2. 异常认知分类逻辑：异常认知模块（ACM）整合顺序认知记忆（SCM）中的多尺度历史语义信息，对“长时遮挡”和“强干扰”进行在线分类识别，为后续针对性策略提供判断依据 。\n3. 专家规则嵌入推理：规则推理模块（RRM）利用结构化的专家知识（如Rule 1：飞越障碍物重寻目标；Rule 2：返回最近历史地标），通过推理生成恢复序列 $A_r$，解决了纯模型学习难以处理的长尾极端工况 。\n4. 分类目标函数（COF）约束：构建由常态（$J_n$）与异常态（$J_{ocl}, J_{int}$）组成的分类目标函数，通过指示函数动态切换优化目标，实现了不可度量异常状态下的函数拟合，防止了异常数据引起的训练发散 。",
    "datasetText": "1. 仿真环境数据：在Gazebo 3D机器人仿真器中构建了4类训练场景，通过模拟复杂城市动态（包括建筑物遮挡、阴影和高相似度干扰物）进行算法的高效加速训练 。\n2. 实机验证场景：在包含频繁人群、移动车辆和密集树木的食堂路口（场景6）以及预设11个穿着相同衬衫干扰者的操场（场景7）进行测试，涵盖真实世界中的严重干扰和目标逃逸情况 。\n3. 任务构成与规模：任务要求无人机仅依靠原始观察图像和目标模板图像实现持续跟踪，包含多组随机化的初始位置和目标路径实验，以消除随机性干扰 。",
    "results": "1. 成功率显著提升：在3000步上限的测试中，CEL(Rules)成功率（SR）达95.5%，相较于传统具身学习基准（EL(EA+SI)）提升16.9%，较SOTA方法提升达361.4% 。\n2. 任务完成效率优化：相对路径长度（RPL）为6.7，相比SOTA方法减少了54.4%至56.8%的无效路径，显著降低了完成任务所需的额外飞行开销 。\n3. 训练稳定性增强：实验对比显示，在混合严重异常的场景下，CEL(Rules)是唯一能够维持训练不发散的方法，最终平均回合奖励稳定在约135，而基线方法在2400-6800回合内普遍出现训练崩溃 。\n3. 强干扰下的泛化表现：在包含10个极端干扰者的泛化场景（Test Scenario-4）中，CEL仍保持76.9%的成功率，而竞品方法（EL(STF)）仅为17.1% 。",
    "problem": "1. 泛化与稳健性瓶颈：现有端到端深度强化学习框架在复杂物理场景（如密集的城市障碍物和目标机动）中面临高计算成本、严重数据依赖及泛化能力不足的问题 。\n2. 具身智能应对严重异常失效：现有的具身智能（EI）方法无法有效处理“严重异常”（如长时遮挡和强干扰物），导致跟踪任务在中途崩溃 。\n3. 训练发散与度量失配：在存在异常干扰时，传统单目标函数由于数据混淆（经验回放池污染）和函数不可度量，导致训练难以收敛或出现发散 。",
    "sourceRow": 9,
    "sourceWorkbook": "具身感知文献汇总表_cleaned.xlsx"
  },
  {
    "id": "uav-track-vla",
    "category": "embodied-perception",
    "title": "UAV-Track VLA: Embodied Aerial Tracking via Vision-Language-Action Models",
    "methodName": "UAV-Track VLA",
    "authors": [
      "Qiyao Zhang",
      "Shuhua Zheng",
      "Jianli Sun",
      "Chengxiang Li",
      "Xianke Wu",
      "Zihan Song",
      "Zhiyong Cui",
      "Yisheng Lv",
      "Yonglin Tian"
    ],
    "taskTags": [
      "具身跟踪"
    ],
    "methodTags": [
      "VLA"
    ],
    "datasets": [
      "自建数据集",
      "仿真场景"
    ],
    "venue": "arXiv",
    "year": "2026",
    "summary": "Presents a specialized vision-language-action foundation model for embodied UAV tracking supporting 4-DoF natural language flight control and zero-shot open-world transfer.",
    "theFirst": "首个面向城市环境的具身无人机跟踪视觉-语言数据集 。首个全面支持自然语言引导与 4-DoF 连续运动的无人机专用具身跟踪基准 。",
    "image": "assets/papers/perception/uav-track-vla.png",
    "paperUrl": "https://arxiv.org/abs/2604.02241",
    "codeUrl": "",
    "cardId": "paper-card-uav-track-vla",
    "type": "VLA",
    "publication": "Arxiv",
    "authorsText": "Zhang, Qiyao and Zheng, Shuhua and Sun, Jianli and Li, Chengxiang and Wu, Xianke and Song, Zihan and Cui, Zhiyong and Lv, Yisheng and Tian, Yonglin",
    "method": "1. 整体架构: 基于开源 π0.5 构建,采用\"编码器 + 双分支解码器\"的分层结构 。骨干为 PaliGemma,其中视觉塔 SigLIP 提取图像特征,语言指令经 tokenizer 后由 Gemma 完成跨模态深度融合 。\n2. 时间压缩网络 (Temporal Compression Net): 用一个无偏置线性投影层,把 3 个历史帧各自的 256 个视觉 token 压缩到每帧 64 个,再与当前帧未压缩的 256 个 token 拼接,得到 $3\\times64+256=448$ 个带时序信息的视觉特征 。在此之上加一个 $1\\times448\\times D$ 的可学习位置编码,并严格以常数零 (0.0) 初始化——这一设计确保训练开始时预训练视觉特征空间完全不受扰动,避免早期发散,同时允许模型平滑适应时序动态 。\n3. 空间感知辅助 grounding 头 (Spatial-Aware Auxiliary Grounding Head): 实例化为一个交叉注意力池化层 + MLP 。可学习查询向量以标准正态分布 ($\\sigma=0.02$) 初始化,对跨模态隐状态做注意力,池化结果经两层 GELU 激活的 MLP 输出 4D 空间相对位姿;所有线性投影用 Xavier 均匀初始化,偏置置零 。采用旁路辅助设计 (Bypass Auxiliary Design),仅在训练阶段通过辅助监督起作用,其梯度反传迫使编码器把任务相关的几何先验嵌入跨模态 token 。\n4. 流匹配动作专家 (Flow Matching Action Expert): 将已带空间先验的跨模态特征与无人机本体感受状态 $S_t$ 拼接,通过拟合理想跟踪轨迹的位移流场,生成 25 步连续位移控制序列 $A_{t+1:t+25}$ 。两个分支共享跨模态特征但在前向推理时完全解耦,以避免显式空间 grounding 特征与连续动作生成之间的表征冲突 。\n5. 动作空间设计: 动作向量 $\\bm{a}_i=[\\Delta x^{act},\\Delta y^{act},\\Delta z^{act},\\Delta\\psi^{act}]^\\top\\in\\mathbb{R}^4$ 直接表示期望的 3D 相对位移与偏航角变化,主动舍弃传统速度控制,使动作空间与感知输出 $P_t=[\\Delta x^{tar},\\Delta y^{tar},\\Delta z^{tar},\\Delta\\psi^{tar}]^\\top$ 完全同构 。\n6. 训练目标: $L_{total}=\\lambda_1 L_{pos}+\\lambda_2 L_{action}$,其中 $\\lambda_1=2$(位置损失)、$\\lambda_2=0.1$(流匹配动作损失) 。注意位置损失权重是动作损失的 20 倍 。\n7. 优化配置: 采用全参数微调而非 LoRA 。AdamW,梯度裁剪范数 0.8(用于稳定流匹配专家的训练);余弦衰减学习率,前 2000 步预热至峰值 $1.2\\times10^{-4}$,其后 35000 步衰减至 $1.0\\times10^{-6}$;对模型权重施加衰减率 0.999 的 EMA 。",
    "datasetText": "1. 规模: CARLA 中采集共 892,756 帧多模态轨迹数据,其中约 20 万帧人类专家演示 + 69 万帧自动采集;覆盖 85 个不同目标、176 条细粒度跟踪任务指令 。目标速度覆盖 0–70 m/s 。\n2. 传感器配置: 前视 RGB 相机固定安装于无人机质心正下方 0.5 m 处 ($x=0,y=0,z=-0.5$),相对位姿固定为 yaw$=0^\\circ$、roll$=0^\\circ$、pitch$=-15^\\circ$;分辨率 $800\\times600$,视场角 $135^\\circ$ 。仿真环境为 CARLA 0.9.14 + Unreal Engine 4.27 。注意: 俯仰、横滚与相机外参全部固定,即无云台自由度 。\n3. 异步采样: 视觉观测以 5 Hz 采集(提取宏观运动趋势、避免时序特征冗余),本体感受状态与动作块序列以 25 Hz 记录(支撑高频连续位移流匹配) 。\n4. 域随机化与动态干扰: 每个 episode 起始时通过 carla.WeatherParameters 均匀采样云量 [0,35]、降水 [0,40]、积水 [0,30]、风力 [0,10]、雾密度 [0,30]、雾距 [100,200] m、湿度 [0,10]、太阳方位角 [0°,360°]、太阳高度角 [−5°,90°];其中高度角下界 −5° 用于模拟极低光的夜间跟踪 。每个 episode 另生成 30 辆动态车辆(含两轮车)与 20 个漫游行人,既作候选目标,也作高动态背景干扰物与障碍物 。\n5. 专家演示的差异化控制粒度: Z 轴位移步长 0.35 m、偏航角步长 3.5°;水平 (X/Y) 方向对高速车辆用 1.35 m 分辨率,对慢速行人细化到 0.1 m,以支持近距离的平滑微调 。\n6. 自动采集与 APF 避障: 无人机在目标后方的预定空间边界内随机初始化 。自动巡航时向 4-DoF 动作持续注入随机噪声,并配一个系数 0.6 的回归项迫使无人机不断尝试恢复初始相对锚定位姿 。当障碍物进入安全边界(行人 0.35 m、车辆 0.5 m、其他 0.15 m)时激活 APF: 暂停随机扰动,施加最大幅值 1.5 的横向与纵向斥力,以及保证最低高度 0.1 m 的抗触地力 。该机制用于缓解端到端模仿学习固有的协变量偏移 。\n7. 自我中心坐标对齐: 所有记录的位置数据严格变换到以无人机为中心的相对坐标系(由 6-DoF 相机位姿构造 $R_{world\\_to\\_camera}$ 复合旋转矩阵),以杜绝模型学到与全局参考系相关的伪相关 。\n8. 视觉预处理: $800\\times600$ 原图降采样至 $224\\times224$ 输入 。不做直接 resize,而是按较大维度等比缩放(宽 800→224)后对高度零填充,以严格保持长宽比——这对辅助头准确估计 3D 相对距离与偏航角至关重要 。\n9. 指令构造: 176 条指令,模板为 [动词] + [目标属性] + [距离约束] 。车辆颜色由 CARLA 原生 RGB 十六进制码提取,先按亮度筛出黑/白/灰基础色,其余在 RGB 空间对 18 个预定义自然语言颜色做欧氏距离最近匹配;行人按年龄段(成人/青少年/儿童)与性别(男/女)组合打标 。\n10. 零样本指令划分: 176 条拆为 136 条 seen 训练指令 + 40 条 unseen 测试指令 。采用受控单变量替换策略,生成 unseen 指令时仅将基础指令中的一个语义块随机替换为同义词,分为动词替换、对象替换、距离替换三类 。\n11. 数据发布格式: 同时提供 HDF5 与 LeRobot V2.1 (Parquet) 两种标准格式 。HDF5 每条轨迹独立成文件,含 Observations/Images/(当前帧 cam_high 与 3 个历史帧,uint8 $600\\times800\\times3$)、State (float32[4])、Prompts、Action (float32 $[25\\times4]$);LeRobot 版按 chunk 分区并附 meta/ 全局统计,支持 HuggingFace 生态 。",
    "results": "1. 训练配置: 2 张 NVIDIA H100,全局 batch size 64,训练 45,000 次迭代 。基线对齐: 所有基线均严格对齐到相同的 4-DoF 连续动作空间与 25 步时间分块;π0 与 π0.5 使用官方开源仓库并改动作解码器后全参微调,ACT 与 WALL-OSS 使用 HuggingFace LeRobot 实现 。\n2. 评测设定: 每 episode 最长 500 步;异常跟踪状态(违反 FOV 或距离约束)连续 15 帧即判致命失败 。三档距离为上界形式——车辆 close $\\leq$25 m / suitable $\\leq$35 m / long $\\leq$40 m,行人 $\\leq$10/15/20 m 。因此难度顺序实为 close > suitable > far,\"far\"档约束最宽松 。\n3. Seen Maps (Town02/05/06/07/10HD) 平均: Far 行人 ATF 269.65 / SR 61.76%,Far 车辆 194.91 / 37.88%,Suitable 行人 263.61 / 60.20%,Close 车辆仅 98.47 / 12.73% 。同档最强基线 π0.5 为 Far 行人 214.28 / 44.44%、Far 车辆 174.81 / 33.90% 。ACT 与 WALL-OSS 在所有档位 SR 几乎全为 0 。\n4. Unseen Maps (Town01/03/04) 零样本: Far 行人 226.90 / 55.00%,而 π0.5 的同档 SR 崩至 5.88%;Suitable 行人 210.24 / 36.84% 。但需注意 Suitable 车辆档 π0.5 反而更优(201.72 / 33.33% vs 本文 150.00 / 29.79%) 。\n5. 车辆与行人的不对称: 论文自述在车辆跟踪上与原始 π0.5 表现相当,实质性领先只出现在行人跟踪 。逐地图明细进一步印证: Town02 Suitable 车辆 π0.5 178.33/33.33% 显著优于本文 125.52/12.12%;Town06 Close 车辆本文仅 52.00/0%,反而低于去掉辅助头的变体 (65.50/16.67%) 。最佳单点为 Town06 Far 行人 383.60 / 80% 。\n6. 辅助头消融: Seen Far 行人由 183.96/39.29% 提升至 269.65/61.76%,Unseen Far 行人由 159.22 提升至 226.90 。但 Seen Suitable 车辆档去掉辅助头反而略好 (176.13/29.87% vs 164.79/29.61%),说明该模块收益高度集中于行人这类尺度小、距离阈值紧的目标 。\n7. 跨模态注意力可视化 (附录 C.1): 取 LLM 主干最后四层中语言 token 对当前帧视觉 token 的平均注意力权重投影为热力图 。完整模型注意力高度局部化并锐利集中于正确目标车辆,能滤除道路、植被与无关邻近车辆;去掉辅助头的变体注意力高度弥散 。这为\"辅助监督的梯度反传增强了 LLM 主干内在的跨模态 grounding 能力\"提供了定性证据 。\n8. 指令敏感性分析 (附录 C.2,数值越低越敏感,按地图内归一化): 对象替换 车辆 ATF 1.46 / SR 1.60,行人 1.04 / 0.79;动词替换 车辆 1.30 / 1.38,行人 2.53 / 1.46;距离替换 车辆 1.96 / 2.18,行人 2.39 / 4.76 。论文结论为对目标对象描述最敏感、对距离副词最鲁棒 。\n9. 推理效率: 单步平均延迟 0.0571 s(约 17.5 FPS),相比原始 π0.5 的 0.0857 s 降低 33.4%;π0 为 0.0691 s,WALL-OSS 为 0.4524 s 。每个模型统计约 1200 个有效数据点;ACT 因参数量显著更小、架构不同而被排除在该对比之外 。效率提升主要归功于时间压缩网络 。\n10. 关键局限: 全部实验在 CARLA 仿真内完成,无任何真机验证 。作者在结论中明确将物理无人机平台部署与 sim-to-real 迁移列为未来工作 。",
    "problem": "1. 无人机具身跟踪的基准与方法空白: 现有 EVT 研究主要依赖地面平台(四足或轮式),相比被约束于 2D 平面的地面机器人,无人机在 3D 空间具备更强机动性与更自由的跟踪视角,但针对无人机的专用 EVT 基准与配套方法长期缺失 。\n2. 现有 UAV 跟踪范式的解耦缺陷: 当前无人机视觉跟踪主要依赖人工飞控,后端模型仅在回传图像上做被动检测或分割(如 AutoTrack、Aba-ViTrack、SGLATrack),无法实现自主追击与动态跟踪 。\n3. VAT 方法缺乏语义理解: 已有主动跟踪方法(Ad-AOT、GC-VAT、D-VAT、CEL)局限于视觉输入到电机动作的直接映射,完全省略语言模态,无法执行自然语言指定的复杂指令 。\n4. 现有数据集的运动学局限: 如 VLA-AN 所用的无人机主动跟踪数据集不包含车辆这类具备复杂运动学行为的目标,不适配城市交通场景的需求 。\n5. 通用 VLA 模型的两个结构性短板: 其一,过度依赖单帧空间特征融合,缺乏处理连续时序图像序列的能力,对高速与不规则运动目标的特征提取能力差;其二,高层语义与底层连续飞行控制之间存在严重错配 。",
    "sourceRow": 11,
    "sourceWorkbook": "具身感知文献汇总表_cleaned.xlsx"
  },
  {
    "id": "oa-vat",
    "category": "embodied-perception",
    "title": "Instance-level Visual Active Tracking with Occlusion-Aware Planning",
    "methodName": "OA-VAT",
    "authors": [
      "Haowei Sun",
      "Kai Zhou",
      "Hao Gao",
      "Shiteng Zhang",
      "Jinwu Hu",
      "Xutao Wen",
      "Qixiang Ye",
      "Mingkui Tan"
    ],
    "taskTags": [
      "具身跟踪"
    ],
    "methodTags": [
      "VFM"
    ],
    "datasets": [
      "仿真场景",
      "真实场景",
      "自建数据集"
    ],
    "venue": "CVPR",
    "year": "2026",
    "summary": "Proposes an occlusion-aware visual active tracking method utilizing instance-level planning to anticipate and avoid visual occlusions during UAV flight.",
    "theFirst": "",
    "image": "assets/papers/perception/oa-vat.png",
    "paperUrl": "https://arxiv.org/abs/2604.21453",
    "codeUrl": "",
    "cardId": "paper-card-oa-vat",
    "type": "VFM",
    "publication": "CVPR",
    "authorsText": "Sun, Haowei and Zhou, Kai and Gao, Hao and Zhang, Shiteng and Hu, Jinwu and Wen, Xutao and Ye, Qixiang and Tan, Mingkui",
    "method": "1. 实例感知离线原型初始化（Instance-Aware Offline Prototype Initialization）:免训练模块/对参考图水平/垂直翻转增强（人体目标额外用扩散模型生成多视角），用YOLO-E分割裁剪目标，再经DINOv3 + 全局平均池化提特征，将原始特征与增强集均值特征相加后 $L_2$ 归一化得到实例原型。论文给出理论保证（Proposition 1）:多视角聚合后的原型在不同实例间的最小平方距离不小于原始参考特征，即判别性单调提升。\n2. 在线原型增强跟踪器（Online Prototype Enhancement Tracker）：无初始框设定下，先用原型与候选掩码做余弦向速度匹配完整检测（阈值 $eta_s=0.5$），再用ORTrack做在线跟踪；跟踪过程中以EMA（$/beta=0.8$）在独立县城更新原型以适应外观变化。 \n3. 置信度感知卡尔曼滤波：将量测噪声协方差建模为跟踪置信度的sigmoid函数 $\\mathbf{R}_t=sigma^2(c_t)\\mathbf{I}$，$\\sigma^2(c_t)=1\\(1+e^{lambda(c_t-\\gamma)})$($\\lambda-15.0,\\gamma=0.4$)。低置信度时抑制卡尔曼增益，使滤波器更依赖内部状态预测从而在跟踪失败期间仍能持续外推目标运动，提高重捕概率。\n4. 遮挡感知轨迹规划器（Occlusion-Aware Trajectory Planner ）：借鉴Diffusion Policy，将轨迹规模建模为条件去噪扩散过程，建模$p(\\mathbf{A}_t|\\mathcal{I}_t,\\mathbf{b}_t\\)$。关键设计是把目标边界框作为显式条件（而非仅用视觉观测），迫使模型学习与目标无关（target-agnostic）的规划规律，从二零样本泛化到未见目标。连续多帧无有效量测时触发该模块。",
    "datasetText": "1. Planning-20k(自建): 在 UnrealCV 的 SimpleRoom 中生成 。随机摆放障碍物并构建 2D 占据栅格图,随机选一个障碍物、在其包围盒边上生成目标,跟踪器置于相邻边采集 RGB 图与目标框,丢弃目标完全可见的样本 。专家轨迹由 $A^*$ 搜索在占据图上求得 。共 20k 样本,其中 8k 为默认纹理、12k 为随机化纹理(纹理来自 DTD 数据集),另对光照做域随机化 。覆盖三类遮挡结构: 单侧遮挡、双侧遮挡(仅留中间缝隙)、走廊型遮挡(左/右/后三面) 。\n2. 评测环境 UnrealCV: 3 张含干扰物的地图(Parking Lot 2D、UrbanCity 4D、ComplexRoom 4D)+ 5 张单目标地图(SimpleRoom、Parking Lot、UrbanCity、UrbanRoad、Snow Village) 。\n3. 评测环境 DAT: 白天条件下的全部六个场景,与场景内训练 (within-scene) 的模型对比 。注意 DAT 目标为车辆,训练时完全未见,属零样本 。\n4. 真实图像: VOT、DTB70、UAVDT 各选 8 段视频 。\n5. 真机: DJI Tello,$320\\times240$ 视频流经 Wi-Fi 回传 RTX 3090 地面站,速度控制模式 。\n6. 原型消融用数据: PersonPath22 的 video 40(行人)、LaSOT 全部 car 视频(车辆) 。",
    "results": "1. UnrealCV 含干扰物场景: 平均 AR 390、EL 483、SR 0.93,超过 SOTA 的 TrackVLA(SR 0.91)2.2% 。参数量 584M,远小于 TrackVLA(>7B)与 EVT(748M);在单张 RTX 3090 上训练 15 小时,而 TrackVLA 需 24 张 H100 训练同等时长 。\n2. UnrealCV 无干扰物的 5 个场景: SR=1.00、EL=500,全程零丢失 。\n3. DAT 基准(零样本,目标为未见的车辆): 相比 GC-VAT,CR 平均提升 32.6%($242\\to321$),TSR 提升 19.4%($0.72\\to0.86$);TSR 标准差小于 0.02,稳定性显著优于 GC-VAT(其标准差可达 0.3 量级) 。\n4. 真实图像零样本: 平均正确动作率 (CAR) 90.8%,超过 GC-VAT 12.1% 。分数据集: VOT 0.879、DTB70 0.900、UAVDT 0.945 。对比被动跟踪器 ORTrack(即使给定真值初始框)平均仍落后本方法 13.4%(0.774 vs 0.908),且仅给参考图时直接崩溃 。\n5. DJI Tello 真机: TSR 达 81.6%,最好基线仅 18.9% 。长时遮挡下能主动绕障恢复目标,而 FAn 因无规划模块直接停滞、EVT 的离线 RL 规划器给出错误路径,两者均永久丢失目标 。\n6. 实时性: RTX 3090 上 35 FPS,而 TrackVLA 在 RTX 4090 上仅 10 FPS 。\n7. 消融(平均 SR): 原型初始化 vs 原始 DINOv3 特征 +6.9%;在线 EMA 增强 vs 不更新 +13.4%、vs 平均更新 +4.5%;置信度卡尔曼 vs 无滤波 +6.9%、vs 线性卡尔曼 +3.3%;本规划器 vs EVT 规划 +6.9%、vs 无框条件变体 +4.5% 。原型与目标/干扰物的相似度间隔达 0.28,而 DINOv3 仅 0.08 。",
    "problem": "1. 实力级判别能力确实：现有VAT方法多工作在类别级，面对多个同类相似干扰物时无法锁定特定目标实例。\n2. 缺乏主动的遮挡处理：现有pipeline方法多采用简单控制器（如PID）,仅将目标剧中，无法绕过障碍物恢复被遮挡目标，常导致跟踪彻底失败。\n3. RL路线的固有缺陷：奖励稀疏导致复杂环境下收敛差，且依赖仿真训练带来sim-to-real 鸿沟；而VLA路线（如TrackVLA）计算开销过高，在高动态场景下性能退化。",
    "sourceRow": 12,
    "sourceWorkbook": "具身感知文献汇总表_cleaned.xlsx"
  },
  {
    "id": "esarbench",
    "category": "embodied-perception",
    "title": "ESARBench: A Benchmark for Agentic UAV Embodied Search and Rescue",
    "methodName": "ESARBench",
    "authors": [
      "Daoxuan Zhang",
      "Ping Chen",
      "Jianyi Zhou",
      "Shuo Yang"
    ],
    "taskTags": [
      "benchmark",
      "主动感知"
    ],
    "methodTags": [
      "Benchmark"
    ],
    "datasets": [
      "仿真场景"
    ],
    "venue": "arXiv",
    "year": "2026",
    "summary": "Constructs an embodied benchmark and evaluation suite for autonomous agentic UAV search and rescue missions in complex spatial environments.",
    "theFirst": "论文明确声称两个\"首个\"：首次正式提出具身搜救（ESAR）任务概念；首个面向 ESAR 智能体的高保真仿真平台。任务定义的独特点：不同于只输出飞行动作的传统导航，ESAR 要求联合输出动作与新发现线索的语义+空间信息 (A,M)=π(O,S,P,H)——把\"发现并报告证据\"写进任务本身。定位上填补两个空白：传统 UAV 搜救 = 经典感知+几何规划的解耦栈，基准碎片化、各测各的预设假设；空中 VLN 依赖细粒度逐步指令，把智能体降格为被动指令跟随者，而 ESAR 的提示是抽象案情式的（目标最后已知行踪的文字描述，如\"目标 1 人，最后出现在河边，长时间向上行进\"）。与现有空中基准对比表（其 Table 1）：唯一同时具备 ESAR 任务、荒野场景、UE5、大尺度地图、13 种天气、真实数据的基准。",
    "image": "assets/papers/perception/esarbench.png",
    "paperUrl": "https://arxiv.org/abs/2605.01371",
    "codeUrl": "",
    "cardId": "paper-card-esarbench",
    "type": "Benchmark",
    "publication": "Arxiv",
    "authorsText": "Zhang, Daoxuan and Chen, Ping and Zhou, Jianyi and Yang, Shuo",
    "method": "1. 仿真平台：UE5 高保真渲染 + AirSim-Colosseum 飞行动力学；ALOS PALSAR 12m DEM + 卫星影像映射，构建四个源自中国真实搜救高发地的大尺度开放环境——鳌太线（秦岭高山草甸，2×2km，2012 年以来至少 58 人失踪/遇难）、罗布泊（荒漠戈壁，5×5km）、K2（雪峰，2×2km，另有 3×3km 图幅）、大鹏半岛（海岸丘陵，2×2km）。\n2. 场景还原：按真实搜救案例的时空逻辑部署受害者与 12 类关键线索模型（分布最多的为帐篷、水瓶、篝火、背包，另含衣物、信号弹、手电等）；传感器含 IMU、GPS、LiDAR、多视角 RGB 与深度；13 种天气可动态切换且伴随物理状态变化（积雪、水洼、沙尘覆盖）。\n3. 任务生成：Event-Snapshot-Task 三层框架——12 个真实救援事件（如 2021 鳌太线、1996 余纯顺罗布泊、1986 K2 暴风雪、2025 大鹏半岛）离散化为 60 个静态时间快照（快照内受害者与线索分布固定，保证可复现），再随机采样时间/天气/起点实例化 600 个任务。\n4. 难度分层：按起点-目标距离分位数（>373.6m 计 +4）、天气恶劣度（沙尘/雾 +3）、光照（夜间 +2）、受害者数量（+N）、强线索辅助（帐篷 −1、篝火 −2、信号弹 −3）打总分，分四档；任务占比 Simple 25.2%、Medium 27.0%、Hard 27.5%、Extreme 20.3%。\n5. 指标四件套：SR（匈牙利算法做预测-真值最优二分匹配，距离阈值 E 内计中）；TSR = max(0, SR×(1−T/Tmax)) 时间加权；CDS = 0.5·空间定位 + 0.5·精确匹配（后者需空间邻近且语义正确，语义由 LLM 评判器核验）；RS 综合分（安全 0.1 + 基础 0.3 + 时效 0.3 + 线索 0.3 加权）。\n6. 范围界定：本版聚焦\"开放、非灾难环境中的生命搜索\"以隔离多模态感知、长时推理与空间探索的核心挑战；路线图规划了向灾难封闭场景、多机协同、热成像/音频模态的扩展。",
    "datasetText": "1. 基线九个，覆盖四个谱系：基础（Random、FBE 前沿探索、Pure-MLLM 直控）；无 MLLM 地面 ObjectNav（SemExp、VLFM）；MLLM 地面（NavGPT、UniGoal）；MLLM 空中（SPF 空中 VLN、APEX 空中 ObjectNav 带 3D 体素空间记忆）。\n2. 公平性控制：所有基线接同一 AirSim 接口，用同一套四相机 YOLO-World RGB-D 模块报告线索与受害者；MLLM 组件统一用 Qwen3.5-Plus。\n3. 算力开销：全部实验在单张 A100 上运行约 140 小时，显存占用约 8G。\n4. 作者关联提示：表现最好的基线 APEX 是同一作者团队的前作（Zhang 等，arXiv 2602.00551），引用其排名结论时宜注明。\n5. 与本表 1C 方法的关系：九个基线均来自导航/探索社区，与本综述收录的 GOMAA-Geo、UAST 互无交集——搜索类的方法与基准两条线尚未接通，此空档本身可作正文观察。",
    "results": "1. 总体：APEX 全场最佳——SR 13.89、CDS 4.14、RS 13.45；SPF 次之（RS 13.12）；即便最佳者离解决任务也很远，且最强方法与基础基线差距有限，说明基准要求感知-语义推理-决策的深度整合。\n2. 空中适配关键：SPF/APEX（空中系）明显优于 NavGPT/UniGoal（地面 MLLM 系）——地面策略直接迁移不足，空中智能体需要适配大尺度户外视角、3D 运动与面向搜索的探索。\n3. 语义推理有效但需具身结构承载：四个 MLLM 基线平均 CDS 3.48 vs 非 MLLM ObjectNav 2.70；纯 MLLM 直控溃败（Overall SR 3.45），SPF/APEX 因叠加 UAV 专用动作与空间建图才把 MLLM 的引导用起来。\n4. 效率与安全双重权衡未解：SPF/APEX 的 TSR 仅 0.94/0.87——缺乏判断多目标任务\"何时已充分完成\"的主动机制，且难以在保持广域搜索的同时提升效率；附录图 5 进一步显示探索能力强的方法任务时间更长，且多数基线坠机率居高——长时安全飞行本身仍是 ESARBench 上的重大挑战。",
    "problem": "1. 传统 UAV 搜救依赖经典感知+几何路径规划的解耦栈，缺语义推理、依赖狭窄预设作业模式，导致基准高度碎片化、任务专用，无法统一评估智能体的泛化智能。\n2. 现有具身无人机研究（空中 VLN 等）依赖细粒度逐步语言指令，缺乏高层任务级目标，无法评测不确定性下的长时规划与自主探索——与真实场景中抽象、目标导向的指令差异巨大。",
    "sourceRow": 13,
    "sourceWorkbook": "具身感知文献汇总表_cleaned.xlsx"
  },
  {
    "id": "active-contact-engagement",
    "category": "embodied-perception",
    "title": "Active Contact Engagement for Aerial Navigation in Unknown Environments with Glass",
    "methodName": "Active Contact Engagement for Aerial Navigation in Unknown Environments With Glass",
    "authors": [
      "Xinyi Chen",
      "Yichen Zhang",
      "Hetai Zou",
      "Junzhe Wang",
      "Shaojie Shen"
    ],
    "taskTags": [
      "主动感知"
    ],
    "methodTags": [
      "Planning"
    ],
    "datasets": [
      "仿真场景",
      "真实场景"
    ],
    "venue": "RA-L",
    "year": "2026",
    "summary": "Explores physical contact-assisted aerial perception and navigation strategies for UAVs operating in unknown environments with transparent glass obstacles.",
    "theFirst": "论文明确声称（To the best of the authors' knowledge）：首个将主动接触交互（active contact engagement）引入玻璃密集未知环境自主空中导航的工作。相关工作中自我定位于主动感知谱系（上承 1980 年代末主动感知，与主动定位、主动 SLAM、主动跟踪并列）。",
    "image": "assets/papers/perception/active-contact-engagement.png",
    "paperUrl": "https://arxiv.org/abs/2505.00332",
    "codeUrl": "",
    "cardId": "paper-card-active-contact-engagement",
    "type": "Planning",
    "publication": "RA-L",
    "authorsText": "Chen, Xinyi and Zhang, Yichen and Zou, Hetai and Wang, Junzhe and Shen, Shaojie",
    "method": "1. 增量式视觉玻璃面检测：YOLOv8 实例分割从彩色图提取玻璃区域（置信度阈值 τs=0.75）；利用玻璃\"边框可见\"的特点，将分割边界膨胀取深度稳定的边界点，经对齐深度图投影到三维，RANSAC 拟合平面，凸包得到多边形边界；每个玻璃面维护数据结构 Gi=(质心 ci, 法向 ni, 多边形顶点 Pi, 采样点云 Ci)。\n2. 跨帧增量融合：新旧玻璃面按法向夹角（τn=0.65 rad）、质心距离（τc=1.0 m）与投影多边形 2D IoU（τiou=0.1）做数据关联；判为同一面时重新拟合平面并做多边形空间并集（Boost C++ 集合并，而非顶点简单拼接）更新边界与质心。\n3. 轻量接触传感模块：4.5 英寸柔性弯曲传感器封装于 3D 打印 TPU 外壳，接触形变→电阻变化→电压数字化上传；单个仅 3.3 g，TPU 壳兼作保护与减振悬挂；轻触代替硬碰撞，降低损伤与状态估计失效风险。\n4. 触碰动作（touch action）：就绪位姿设在 c+δs·n（δs=1.0 m）、朝向对准玻璃面，规划平滑轨迹以恒定偏航、v_touch=0.2 m/s 缓速推进至 c−δe·n（δe=1.0 m）；途中触发接触事件即确认玻璃存在，由机体位姿+模块几何反算接触位置，将点云 Ci 沿法向偏移贴到确认面上更新体素地图，返回就绪位姿重规划；全程无触发则判该疑似面为误检并作废。\n5. 导航闭环集成：基于体素地图生成标准轨迹→沿轨迹采样做玻璃相交安全检查→有相交则减速执行触碰、更新地图、重规划，迭代至到达目标；点到点任务仅为载体，替换规划器即可扩展到其他任务。",
    "datasetText": "1. 机载实现：YOLOv8 用开源透明表面数据集聚合数据定制训练；标准轨迹用文献 [40] 规划器；参数见原文 Table II（τs=0.75, τn=0.65 rad, τc=1.0 m, τiou=0.1, δs=δe=1.0 m, v_touch=0.2 m/s）。\n2. 平台：开源轻量四旋翼改装，Jetson Orin NX 16GB + NxtPx4 飞控 + RealSense D435i 全局快门双目 + 一对接触模块，起飞重量 895 g；限速 vm=1.0 m/s, am=1.0 m/s²；VINS-Fusion 视觉惯性定位；全部实验完全机载，无地面站与动捕等外部设施。\n3. 单元测试：玻璃密集走廊，手持 D435i + Livox Mid-360 采集（LiDAR 仅用于真值可视化重建，不参与系统）。\n4. 仿真基准：因仿真器难以真实渲染透明/反射玻璃，2D 玻璃检测分割由仿真器直接提供（对所有方法一致）；10 个随机非线性目标的点到点任务、每方法 5 次；基线为 Non-contact（纯视觉，把所有检出玻璃一律当障碍）与 Contact-based（改造自玻璃密集环境 SOTA 规划器 [10]，被动碰撞响应式建图）。\n5. 真机场景三组：走廊横置玻璃门框；8×7×2 m³ 房间被两扇固定玻璃窗隔断；双滑动玻璃窗（左半开敞、右半有玻璃）。",
    "results": "1. 仿真基准（Table III，均值±标准差）：Proposed 用时 223.2±2.7 s、路径 159.7±0.5 m、接触 5.2±0.4 次，全面优于 Non-contact（282.0±8.4 s，288.3±6.1 m，因保守绕行路径最长）与 Contact-based（265.2±13.7 s，248.9±7.7 m，需 35.6±3.4 次被动碰撞才能重建玻璃面）；主动触碰一次即可确认或排除一个疑似面。\n2. 玻璃门真机：标准感知规划系统在体素图上留洞、生成必然撞玻璃的不安全轨迹（未实际执行）；本系统触碰确认后动态重规划从门框上方绕过，全程 6.58 m、24.23 s。\n3. 双玻璃窗真机：先后触碰确认右窗、左窗均为实体后无可行路径，自主终止任务并安全悬停，9.48 m、27.56 s——展示多玻璃面检测与无路可走时的安全终止能力。\n4. 双滑窗真机：视觉模块对开敞半扇与玻璃半扇均给出高置信度、无法区分；第一次触碰确认右半为玻璃，重规划后第二次触碰无接触、作废左半误检，最终成功穿越，8.86 m、33.04 s——纯视觉在此场景必然失败，凸显触觉确认的必要性。",
    "problem": "1. 非接触玻璃检测不可靠：RGB/LiDAR 等外感受传感器在透明表面上产生噪声或无效测量，性能受光照条件与角度不确定性影响，完美精度不可达——单次误检即可堵死一条可行路径（假阳性），漏检则可能直接撞毁（假阴性）。\n2. 碰撞容忍机体的代价：抗碰撞机械设计防撞但增加重量与复杂度，损害续航与狭窄空间机动性；把碰撞信息当离散点用于建图需要大量碰撞才能建出透明面，低效不实用；且现有方法对接触基本是被动响应，没有把接触当作主动的环境感知信息源。",
    "sourceRow": 14,
    "sourceWorkbook": "具身感知文献汇总表_cleaned.xlsx"
  },
  {
    "id": "detrack-aadworlds",
    "category": "embodied-perception",
    "title": "DeTrack: A Benchmark and Altitude-Aware Dual World Model for Drone-embodied Tracking",
    "methodName": "DeTrack / AaDWorlds",
    "authors": [
      "Guyue Hu",
      "Haoming Liu",
      "Siyuan Song",
      "Chenglong Li",
      "Feng Chen",
      "Jin Tang"
    ],
    "taskTags": [
      "具身跟踪"
    ],
    "methodTags": [
      "World Model"
    ],
    "datasets": [
      "仿真场景"
    ],
    "venue": "arXiv",
    "year": "2026",
    "summary": "Introduces an altitude-aware dual world model and benchmark for drone-embodied active tracking across heterogeneous flight altitudes.",
    "theFirst": "1. 任务与血统层面：被动航拍跟踪社区（UAV123/VisDrone/OSTrack 谱系）向具身闭环跟踪的进军之作——与钟方威 VAT/AOT/EVT 一系互不引用的第二条血统（其相关工作引 Luo 等 DRL 主动跟踪但整体框架、指标、基线全部来自被动跟踪传统）。独特任务设定：智能体除保持跟随外须每步输出目标包围框（B^trk），把被动跟踪的 mIoU 考核缝进具身闭环——全表唯一。综述叙事价值：B4 术语映射（VAT/AOT/EVT）之外的第四个名字 drone-embodied tracking（DeTrack），且是独立社区独立提出，\"同一任务在不同社区反复重新发明\"论点的最强证据。\n2. 方法层面：首个显式建模\"高度中介的可见性-安全矛盾\"的工作——高飞视野宽障碍少但目标仅数像素、低飞细节足但遮挡密碰撞险，高度把感知与安全耦合为内生矛盾；以高/低空双世界模型 + 高度感知伪观测正面回应。与 ATRNet-LUDO（AOD-JEPA）同为世界模型用法，但用途不同：ATRNet-LUDO 用世界模型选下一视角，AaDWorlds 用世界模型想象两种高度体制的未来状态辅助当前决策，可互引对照。\n3. 注意：仅 arXiv v1 预印本（IEEE 期刊格式，疑投 TCSVT/TIP 类），入 B2 追踪名单。",
    "image": "assets/papers/perception/detrack-aadworlds.png",
    "paperUrl": "https://arxiv.org/abs/2605.17451",
    "codeUrl": "",
    "cardId": "paper-card-detrack-aadworlds",
    "type": "World Model",
    "publication": "Arxiv",
    "authorsText": "Hu, Guyue and Liu, Haoming and Song, Siyuan and Li, Chenglong and Chen, Feng and Tang, Jin",
    "method": "三件套：ReDeT 基线 + DWM 双世界模型 + AaP 高度感知模块。\n1. ReDeT（Reinforcement Drone-embodied Tracking 基线）：OSTrack 被动跟踪器（Transformer 视觉编码器，公开预训练权重初始化）在当前第一人称观测上出目标框；策略头（另配 ResNet-18 骨干）取最近 K 帧第一人称观测编码为状态，输出飞行动作——7 个离散移动指令（前/后/上/下/左/右/停）+ 偏航角与速度两个连续调节量。奖励三项：r = r_iou（预测框与真值框 IoU）+ λ_vis·r_vis（目标可见性）+ λ_col·r_col（碰撞罚 −1{Δc_t=1}）。\n2. DWM（双世界模型）：高空/低空各一个世界模型，结构同构——循环状态-动作模型（RSAM）+ 后验/先验网络（重参数化高斯）+ 共享未来预测头；训练时后验网络以\"先知观测\"（prophet observation，高空 20m/低空 3m 定高渲染的额外视角）逼近未来真实特征，先验网络仅凭循环隐状态模仿后验演化；损失 = KL(后验‖先验) + λ_mmd·MMD(预测未来 vs 先知未来) + λ_rec·潜变量重建 ℓ2。推理时摘除后验分支，先验网络纯靠动作与历史隐状态想象两种高度体制下的未来状态。\n3. AaP（高度感知模块）：掩码自编码器形式——训练时真实第一人称观测保持完整、高低空先知观测按进度感知掩码策略（掩码率随训练从 0 渐增至 1）逐步遮蔽，与高度编码、位置编码一起过共享观测编码器，训练专用解码器以重建各高度观测为监督；掩码率到 1 时自然收敛到推理范式（无先知观测），推理时从单一真实观测生成伪高空/伪低空表征。\n4. 推理合成：DWM 想象的高低空未来状态 + AaP 的伪高低空当前表征共同补给决策——低空支路供目标细节线索、高空支路供全局运动上下文，正面缓解高度矛盾。\n5. 训练配置：AaP 预训练 300 epoch（AdamW lr 3e-4）、DWM 300 epoch（lr 1e-3，DeTrack 协议采的轨迹数据）、ReDeT 策略 PPO 320K 步（lr 3e-4, clip 0.2, GAE 0.95）。",
    "datasetText": "1. 全部实验在自建 DeTrack 基准上（见 DeTrack 行）；闭环协议主要设置：640×360 RGB 刚性挂载相机（90° 水平 FOV、俯仰固定 0°——注意无云台自由度，与 DAT 的 1.37rad 云台俯仰对照）、输入统一缩放 256×256、仿真步长 Δt=0.5s、最大线速度 8.0m/s、偏航率限 ±45°/s；高低空先知观测定高 20m/3m 渲染。\n2. 对比方法为自身消融链（ReDeT 基线 → +AaP → +AaP+单世界模型(低/高) → 完整 AaDWorlds）——注意无任何外部方法对比（钟系 VAT 方法、TrackVLA 系均未复现），引用其\"superior performance\"表述时须注明比较对象仅为自身变体。\n3. 高度组合网格实验：低空 {1,3,6}m × 高空 {10,20,40}m 九组合。",
    "results": "1. 主结果（DeTrack 上，最优 3m/20m 配置）：VR 29.00%、mIoU 17.06%、TR 22.57%、SR 17.66%——全指标绝对值很低，任务远未解决；消融链单调递增（基线→+AaP→+单WM→双WM），双高度世界模型优于任一单高度。\n2. 高度组合分析：3m/20m 全指标最优；1m 低空近视角遮挡与透视不稳、6m 削弱目标细节优势；高空 10m 全局上下文不足、40m 目标过小削弱细粒度线索——极端组合更差，佐证两支路应互补而非极端化。\n3. 定性行为差异：低空世界模型变体保目标细节但贴近隧道/植被飞行、安全裕度小；高空世界模型变体转向响应更早但在狭窄区域仍有危险行为；双模型兼得。\n4. 口径警示（引用时必注）：(a) 无外部方法对比，性能结论仅相对自身消融成立；(b) SR 17.66% 与 DAT 上 GC-VAT TSR 0.72 不可直接比（不同基准不同指标定义），但可作\"基准难度谱\"叙事素材——无人机具身跟踪在高保真视觉+高度矛盾设定下远未饱和。",
    "problem": "1. 既有航拍跟踪基本困于被动范式：在固定机位或预定航线录制的 2D 视频上评测，无人机沦为被动相机——无场景感知、无运动控制、无环境交互；现有方法（相关滤波→Siamese→Transformer 系）不建模无人机运动、高度变化、视角调整如何影响未来目标可见性。\n2. 具身侧的空白：具身平台与主动感知研究集中于地面导航、探索或静态视角规划，缺一个标准化的、统一闭环评测的无人机专用跟踪设定。\n3. 任务内生矛盾：高度同时中介目标感知难度与避障难度（高空目标小而模糊、低空遮挡密而碰撞险），现有短视距无模型策略不显式推理高度变化对未来可见性/遮挡/碰撞风险的影响。",
    "sourceRow": 15,
    "sourceWorkbook": "具身感知文献汇总表_cleaned.xlsx"
  },
  {
    "id": "cosfly-track",
    "category": "embodied-perception",
    "title": "CosFly-Track: A Large-Scale Multi-Modal Dataset for UAV Visual Tracking via Multi-Constraint Trajectory Optimization",
    "methodName": "CosFly-Track",
    "authors": [
      "Xiangyue Wang",
      "Hanxuan Chen",
      "Songsheng Cheng",
      "Ruilong Ren",
      "Jie Zheng",
      "Shuai Yuan",
      "Tianle Zeng",
      "Hanzhong Guo",
      "Kangli Wang",
      "Ji Pei"
    ],
    "taskTags": [
      "benchmark",
      "具身跟踪"
    ],
    "methodTags": [
      "Dataset"
    ],
    "datasets": [
      "仿真场景"
    ],
    "venue": "arXiv",
    "year": "2026",
    "summary": "Provides a large-scale multi-modal visual tracking benchmark for UAVs optimized under multi-constraint aerial trajectory formulations.",
    "theFirst": "论文自述（To our knowledge）两处\"首个\"：1) 首个面向 UAV 视觉跟踪的大规模多模态数据集——此前空中数据集或为导航向（AerialVLN/OpenFly/AirNav 等，静态目标）、或为真实视频无动作标注（VisDrone/UAV123/UAVDT），均不含动态目标跟踪的动作级监督；2) 首个用于将 VLM 适配到 UAV 跟踪任务的大规模训练资源（含中英双语指令支持跨语言研究）。其 Table 1 自证：唯一同时具备跟踪任务、6-DoF 动作、运动学约束、可见性保证、专家/扰动配对轨迹与 7 对齐通道的空中数据集。\n综述叙事定位：第二类\"燃料侧\"唯一条目——第二类的标尺（DAT/EVT-Bench/Gym-UnrealCV）与燃料（本篇）已两头齐备，但燃料侧自带的评测仍是开环模仿指标，\"闭环基准与训练数据尚未接通到同一套协议\"本身是可写的开放问题观察（与 ESARBench\"方法与基准未接通\"形成 1C/第二类对仗）。注意：论文自我定位始终是 dataset/training resource，从未声称\"首个评测基准\"；第 6 章标题虽为 Benchmarks，实质是微调七个 VLM 验证数据有效性。配套技术报告 CosFly（arXiv 2605.19120，工程细节）为另一篇论文，不另立条目。",
    "image": "assets/papers/perception/cosfly-track.png",
    "paperUrl": "https://arxiv.org/abs/2605.17776",
    "codeUrl": "",
    "cardId": "paper-card-cosfly-track",
    "type": "Dataset",
    "publication": "Arxiv",
    "authorsText": "Wang, Xiangyue and Chen, Hanxuan and Cheng, Songsheng and Ren, Ruilong and Zheng, Jie and Yuan, Shuai and Zeng, Tianle and Guo, Hanzhong and Wang, Kangli and Pei, Ji",
    "method": "1. CosFly 六阶段模块化生成管线：(1) 环境预处理——提取并简化 3D AABB 障碍图（65K→2K 盒）；(2) 行人轨迹生成——可行走栅格上 A* + 曲率依赖变速重采样（含随机停顿，附录 C.2 给出速度公式）；(3) MuCO 跟踪优化；(4) 双轨迹增强；(5) 多模态渲染（含天气随机化）；(6) 双语指令生成——Qwen3.5-397B→2B 师生蒸馏。各阶段完全解耦可独立替换（如真实 GPS 轨迹替代仿真行人、更换渲染引擎）；已验证从 CARLA(UE4) 迁移到 SimWorld(UE5)。\n2. MuCO 多约束轨迹优化器（数据质量的来源）：在连续 3D 空间直接优化航点，9 项加权代价——跟踪距离（dopt=28m：高 20m+水平 20m 的 45° 俯角构型）、平滑（二阶差分）、jerk（三阶差分保证运动学可执行）、软安全（dinf=8m）、可见性（目标身上 5–10 采样点的多点射线投射，BVH 加速 O(n)→O(log n)）、方向感知视角代价（±15 帧窗口净位移估计行走方向，directness 因子在目标转弯时自动降权）、俯仰角（45° 目标分段二次）、高度（最低 20m+振荡惩罚）、路径长度。软/硬约束四层安全架构：软代价梯度引导→几何投影推出障碍（垂直抬升/水平绕行/局部位移，深穿透>5m 走 SDF 梯度大步推出）→速度修复（把投影尖峰重分配到后续航点）→高度平滑；解耦设计避免激进安全惩罚困住优化器同时保证零碰撞。坐标式有限差分 ε=0.5m（足以跨过树冠等小障碍以获得有效可见性梯度）、自适应学习率、单点位移裁剪 0.5m，Rayon 并行 200 航点 2–5ms/迭代。全部 9 项代价与完整参数表（附录 A/B）公开供独立复现，但管线代码因公司政策不开源。\n3. MuCO vs A*（自建 4D 时空体素跟踪规划器为最强离散基线，20 条共享轨迹）：可见性 0.906 vs 0.979（差距集中于少数窄巷重遮挡轨迹，16/20 条 MuCO 可见性>0.90）、跟踪距离相当、路径短 13%、快 22 倍（247ms vs 5,467ms）；数据集规模（>6000 轨迹）下 A* 需约 9 GPU 小时、MuCO 约 25 分钟。BVH 使单轨迹优化从 ~12s 降至 0.1–0.5s。\n4. 双轨迹增强（核心设计）：每条行人路径生成专家轨迹 + 扰动轨迹配对，逐帧两个独立 Bernoulli 事件控制位置扰动（P=0.6，位移半径 2–3m）与旋转扰动（P=0.6，视角偏差最大 5°），得 16% 无扰/24% 仅位置/24% 仅旋转/36% 全扰四态；滑窗采样器（窗 10 步 3）构造多任务样本——前 5 帧用扰动观测作输入、完整 10 帧专家轨迹作真值，同时支撑去噪（帧 0–4）与预测（帧 5–9）。支持四种训练范式：去噪、DAgger 式纠偏、对比学习、含噪历史预测。\n5. 数据构成：7 对齐通道——逐时间步五项（RGB 1280×720、米制深度 float32、CARLA 语义分割、6-DoF 位姿、目标世界坐标+可见性标志）+ 轨迹级两项（中英双语指令如\"跟随向北行走的行人，保持 25 米距离与 45° 俯仰角\"、专家/扰动标签+时间对齐索引的轨迹对元数据）。保留 <5% 瑕疵样本（目标-车辆重叠等）以维持场景自然多样性，经验证对模型性能影响可忽略。\n6. 自带评测协议（开环，重要定性依据）：给定 4 历史帧+当前帧共五张 RGB、当前 6-DoF 位姿与目标框，模型预测未来五个航点的 6-DoF 增量；指标 SR@r（最终航点落在真值 r 米内比例，r∈{0.5,1,2}）、ADE/FDE、RotAcc@d°、Yaw MAE、JointSR@(r,d)、mIoU（目标框预测）——全部为留出样本上对专家真值的回归度量，模型输出不驱动仿真器、无 rollout、无 EL/碰撞率类闭环指标。",
    "datasetText": "1. 数据规模（论文口径）：约 6,000 条行人路径→约 12,000 条专家/扰动 UAV 轨迹，240 万时间步（约 334 小时），约 1,000 万标注样本；16 个 CARLA 城镇场景、8+ 天气光照；平均轨迹约 200 步/100 秒。注意发布口径与论文口径分离：当前 HuggingFace 仅公开约 10 万帧初始子集，完整约 200 万帧渐进放出；Table 1 脚注称正扩展至 10 万+轨迹（约 2000 万帧）。评测脚本与预训练 checkpoint 另行托管，附 Croissant 元数据。\n2. 三套实验配置（均取自 2.4M 全集的不同子集）：架构对比——全参数 SFT（视觉编码器冻结），16 图 20 万样本，1 epoch，batch 64，lr 5e-6，1,160 留出样本评测；数据缩放——LoRA（r=64, α=128），25 万–100 万样本，hard 难度分割评测；消融——LoRA，21.3 万样本（760 轨迹）固定 1,672 步，11,878 样本按难度与场景熟悉度分层评测（easy 50.4%/medium 33.1%/hard 16.4%；seen 11.0%/unseen 89.0%）。全部 DeepSpeed ZeRO-2 + bf16。\n3. 评测模型七个（0.8B–9B）：Qwen3.5-0.8B/2B/9B、Qwen3-VL-2B/8B、GLM-4.6V-Flash、Gemma-4-E4B。\n4. 定性提示（引用其结果时必须注明）：全部实验为开环航点回归——模型预测不驱动仿真器、看不到自身动作后果，与本表其余基准的闭环 rollout 口径不可直接比较。",
    "results": "1. 零样本全线失效：四个零样本 VLM 输出与\"全零预测\"基线在四位小数上完全一致（SR@1m 25.17–33.47），证明该任务必须任务特化微调。SFT 后 SR@1m 达 78.34（Gemma-4-E4B）至 95.60（Qwen3.5-9B），提升 53–69 个百分点、RotAcc@1° 提升 16–31 点；三随机种子标准差 <0.5pp。\n2. 容量效应集中于旋转：Qwen3.5 家族 0.8B→9B，SR@1m 仅 +0.5pp，但 RotAcc@1° +7.0pp、MAE −18.3%——模型容量主要惠及细粒度旋转预测而非粗位置。Qwen3-VL 系全面弱于同尺寸 Qwen3.5（8B 版 MAE 近 2 倍），作者归因其视觉编码器不适合几何回归；Gemma-4-E4B 显著垫底（78.34，loss 停在 0.73），归因滑窗注意力不匹配序列航点回归。\n3. 数据缩放：25%→100%（25 万→100 万样本）ADE 降约 2%、SR@2m 升约 1.5pp，未饱和；2B 与 0.8B 收敛到几乎相同的 ADE（~2.14）/FDE（~2.64）——瓶颈在数据分布而非模型容量。\n4. 模态消融（定性关键，C2 素材）：位姿历史是决定性输入——去掉后 FDE 增 3.1 倍（1.25→3.85m）、SR@1m 从 77.6 崩至 15–17；含位姿的五种配置 FDE 全部聚在 1.24–1.27m。目标框历史对目标预测关键（去掉后 mIoU 0.60→0.48，IoU≥0.75 0.56→0.31）。位姿+框齐备时 RGB 仅带来边际收益（FDE 1.264 vs 1.249）——一个\"视觉跟踪\"评测可基本不用视觉刷到位，作者自己解释为当前基准的结构化文本先验已足以支撑路径回归，并加注 caveat：不代表 RGB 普遍无用，急转/意图变化等 OOD 场景可能仍需视觉线索（引用时须连 caveat 一起转述）。\n5. 训练范式消融（验证双轨迹设计）：去噪范式（扰动输入→专家目标）FDE 1.239 / SR@1m 78.8 全场最佳；纯专家数据训练使偏航 MAE 恶化 1.7 倍（6.54° vs 3.87°）——模型过拟合干净专家分布、学不会纠偏性航向调整。\n6. 跨场景泛化：多图 vs 单图训练，SR@1m 已饱和（+0.11pp）但严格指标显著改善——JointSR@(0.5m,1°) +5.31pp、旋转 MAE −12.5%、灾难性失败（FDE>10m）−55.6%；在完全 OOD 的 Town10HD 上仍 +5.20pp。seen→unseen 的 FDE 差距在全部含位姿配置上稳定为 +0.43–0.46m（相对约 50%），来源是轨迹分布偏移而非模态选择。\n7. 下游任务迁移（约 10 万帧微调）：Depth Anything V2 AbsRel 0.768→0.045（δ1 0.026→0.972）、SAM2.1 mIoU 0.763→0.862（AP75 0.662→0.943）、Grounding DINO AP50 85.4→94.2；Small 与 Base 变体差距 <0.5%，瓶颈在数据覆盖而非容量。\n8. 局限（第 7 节自述）：sim-to-real 未解（约 10 万帧真实数据在采集中、留待后续版本）；仅 16 个 CARLA 城镇变体；行人行为为曲率变速+随机停顿、无社会力模型；生成管线代码因公司政策不开源（仅提供附录级算法描述供独立复现）。",
    "problem": "1. 空中数据集的任务空白：aerial VLN 数据集增长迅速但清一色面向\"飞到静态目的地\"的目标导向导航；跟踪要求在每个时间步对移动目标持续适应（可见性/视角/避碰/运动学四重约束），据作者所知无任何数据集为该任务提供专用训练数据。真实 UAV 数据集（VisDrone/UAV123/UAVDT）则缺动作级标注（无人机控制指令）与语言指令，无法训练自主跟踪智能体。\n2. 跟踪轨迹生成比导航路径生成难：A* 等栅格规划器优化几何路径长度，产出运动学不可行路径、需事后平滑且继承栅格搜索的次优拓扑；跟踪轨迹须随目标移动联合优化可见性、视角质量、距离控制与避碰——这些目标在导航规划器中根本不存在。\n3. 规模化瓶颈：稠密城市场景中搜索空间随地图分辨率与轨迹长度急剧增长，离散规划算力上不可行（数据集规模下 A* 需约 9 GPU 小时，见方法列对比）。",
    "sourceRow": 16,
    "sourceWorkbook": "具身感知文献汇总表_cleaned.xlsx"
  },
  {
    "id": "uast",
    "category": "embodied-perception",
    "title": "UAST: Unified Active Search and Tracking for Arbitrary Targets with UAVs",
    "methodName": "UAST: Unified Active Search and Tracking for Arbitrary Targets with UAVs",
    "authors": [
      "Liang Qin",
      "Min Wang",
      "Xingyu Lu",
      "Aowen Qiu",
      "Wengang Zhou",
      "Houqiang Li"
    ],
    "taskTags": [
      "主动感知",
      "具身跟踪",
      "具身搜索"
    ],
    "methodTags": [
      "Active Perception"
    ],
    "datasets": [
      "自建数据集",
      "真实场景",
      "仿真场景"
    ],
    "venue": "CVPR",
    "year": "2026",
    "summary": "Presents a unified mapping-free framework that coordinates autonomous active search and target tracking within a single embodied UAV architecture.",
    "theFirst": "首个免建图（mapping-free）统一主动搜索与持续跟踪的无人机框架：仅用RGB-D输入，通过单一感知-控制管线联合实现探索、重捕获与连续跟随任意目标，无需显式建图或多阶段规划",
    "image": "assets/papers/perception/uast.png",
    "paperUrl": "https://arxiv.org/abs/2606.05000",
    "codeUrl": "",
    "cardId": "paper-card-uast",
    "type": "Active Perception",
    "publication": "CVPR",
    "authorsText": "Qin, Liang and Wang, Min and Lu, Xingyu and Qiu, Aowen and Zhou, Wengang and Li, Houqiang",
    "method": "1. 双分支感知：Target Branch用共享权重AlexNet对RGB帧与目标模板做互相关，轻量头预测边界框与粗糙掩码（按SiamFC++协议独立训练后冻结），模板机制实现类别无关泛化；Depth Branch用ResNet-18编码深度图的几何与可通行性信息，以隐式特征替代显式地图。\n2. 基于规则的点搜索策略（无学习参数）：目标可靠可见时（响应分>τdet）由边界框中心区域深度中位数反投影3D引导点；暂时不可见时用常速度卡尔曼滤波平滑/预测，残差超阈值则改用KF先验；丢失超Tlost帧则进入探索模式——未探索圆域内采样选最远有效点，无候选时螺旋扩展（r(θ)=r0+εθ），区域饱和则半径×1.5扩张。搜索与跟踪统一为单一轨迹优化问题f*(t)=argmin Ltraj(f(t); gt(mt))。\n3. Control Network：感知特征保持V×H空间网格，每格预设初始终点状态，轻量CNN对每格预测偏移ΔS={Δp,Δv,Δa}与轨迹代价分数，选分数最低格为最优终点；起终点各6约束/轴解5阶多项式，得平滑动力学可行轨迹，导数直接作飞控指令。\n4. 训练：总损失=轨迹损失+分数回归损失；轨迹损失含跟踪感知可见性损失Ltrack（仅轨迹中段1/3~2/3评估：SDF可微采样的视线遮挡项Locc + 速度方向与目标方向偏航/俯仰角FOV偏差项Lfov）、目标对齐Lgoal、平滑Lsmooth、SDF安全项Lsafe；分数回归用Smooth L1对齐预测分数与真实轨迹损失。",
    "datasetText": "自动化数据构建管线（适用仿真与真实场景）：先生成无目标的静态3D点云场景，在可导航空间随机采样UAV位姿（俯仰受限）录制RGB-D；在相机系随机选目标点，用相机内参将合成目标（四旋翼、球体、人、动物等）投影进画面并同步更新颜色与深度通道。目标距离分布：40%>10m、50%在5-10m、10%<5m，保证90%可见、其余引入轻微遮挡；引导点加米级噪声增强鲁棒性。共生成10万+样本（batch 1024，50 epoch，单卡RTX 4090约8小时）。仿真环境两类：开放环境（hall、forest，稀疏障碍）与杂乱环境（密集立柱与不规则矮墙制造遮挡），仅目标做变速机动、其余物体作干扰物。",
    "results": "1. 短程跟踪（开放环境100-150m、40条随机轨迹）：全速度段最高成功率（3m/s: 1.00, 4m/s: 1.00, 5m/s: 0.93, 6m/s: 0.88），建图类方法Vis./Elas.高速下崩溃（5m/s仅0.15/0.10）；FOV热图显示目标位置分布最集中，归因于跟踪感知可见性损失。\n2. 长程跟踪（杂乱环境1-1.5km、目标急转/急停/倒退）：5m/s成功率0.89，远超Vis. 0.05、Elas. 0.03、Yopov2 0.36（提升50%+）；单步延迟8.6ms；Yopov2跟丢后无法恢复，仅UAST能急转后快速重捕获。安全性上保持最高最小障碍间距（5m/s Min 0.13m有效vs对比方法碰撞）。\n3. 主动搜索（目标初始100m外）：搜索时间54.49s，约为RACER（176.62s）和FALCON（146.67s）的1/3，路径长度相当，搜索速度近5m/s，计算延迟最低（8.6ms vs 43.1/37.2ms）。\n4. 消融（5m/s）：去搜索机制→Long SR 0.89→0.52；去引导点策略→全指标暴跌（Long SR 0.33）；去跟踪感知损失→FOV中心偏差0.57→0.82m；去数据构建→SR下降。\n5. 真实部署：四旋翼+Jetson NX+RealSense D435+Fast-LIO定位，地下停车场与户外森林实飞验证自主搜索与持续跟踪，仿真到现实平滑迁移。",
    "problem": "1. 搜索与跟踪割裂：现有工作将搜索和跟踪视为独立任务，忽视其内在相互依赖；长期性能既需要帧内鲁棒跟踪，也需要目标被遮挡/丢失后的主动重捕获，而现有方法普遍缺乏跟丢后的可靠恢复机制。\n2. 建图开销问题：经典模块化管线（感知-建图-前端路径搜索-后端轨迹优化）依赖维护体素地图，内存与计算开销大，在高速或资源受限场景下效率受限。\n3. 端到端泛化问题：纯端到端控制器（如Yopov2）虽简化软件栈、支持敏捷飞行，但难以在效率、可解释性和跨目标/跨场景泛化间取得平衡。",
    "sourceRow": 17,
    "sourceWorkbook": "具身感知文献汇总表_cleaned.xlsx"
  },
  {
    "id": "scoutvla",
    "category": "embodied-perception",
    "title": "ScoutVLA: UAV-Centric Active Perception via a Dual-Expert VLA Model for Open-World Embodied Question Answering",
    "methodName": "ScoutVLA",
    "authors": [
      "Wenhao Lu",
      "Zhengqiu Zhu",
      "Xiaofeng Wang",
      "Xiaoran Zhang",
      "Yatai Ji",
      "Yong Zhao",
      "Yue Hu",
      "Yingzhen Nie",
      "Jinlong Zhu",
      "Zheng Zhu"
    ],
    "taskTags": [
      "主动感知",
      "具身问答"
    ],
    "methodTags": [
      "VLA"
    ],
    "datasets": [
      "自建数据集",
      "真实场景",
      "仿真场景"
    ],
    "venue": "arXiv",
    "year": "2026",
    "summary": "Develops a dual-expert vision-language-action model tailored for UAV-centric active perception and open-world embodied question answering.",
    "theFirst": "首个空中EQA细粒度主动感知基准（FG-EQA），首次形式化\"问题条件化的细粒度主动感知\"任务；首个将语言问题直接融入连续5-DoF动作生成的空中VLA（单目RGB+流匹配）",
    "image": "assets/papers/perception/scoutvla.png",
    "paperUrl": "https://arxiv.org/abs/2606.14772",
    "codeUrl": "",
    "cardId": "paper-card-scoutvla",
    "type": "VLA",
    "publication": "Arxiv",
    "authorsText": "Lu, Wenhao and Zhu, Zhengqiu and Wang, Xiaofeng and Zhang, Xiaoran and Ji, Yatai and Zhao, Yong and Hu, Yue and Nie, Yingzhen and Zhu, Jinlong and Zhu, Zheng",
    "method": "1. FG-EQA基准：每个episode隔离\"证据寻找阶段\"——目标初始可见但证据不足，需主动视角微调才能作答；5-DoF动作空间 [Δx, Δy, Δz, Δψ(偏航), Δθg(云台俯仰)]，附加停止分数（推理阈值0.85）。\n2. 双专家架构：PaliGemma 2B多模态专家（SigLIP编码）推断当前视图缺失什么证据以引导视角调整；独立300M Action Expert共享多模态上下文，用流匹配生成连续5-DoF轨迹，绕开离散动作量化；语言输出侧独立放置LMAdapter兼顾连续回归与自回归文本生成。\n3. 两阶段解耦训练+知识绝缘：Stage 1仅训动作（流匹配去噪，全参数更新）；Stage 2冻结PaliGemma主干，按批次模态切换梯度掩码（动作:语言=3:1），语言步仅更新rank-16 LoRA与LMAdapter（学习率×2.5），防止动作梯度灾难性覆盖语言推理能力。",
    "datasetText": "1. 仿真数据：基于UAV-ON的9个高保真数字孪生环境（BrushifyUrban、CabinLake、Slum等），约40K轨迹；五阶段流水线：次优初始视角生成（±15°/±30°偏航偏移，Qwen3-VL过滤全遮挡）→目标中心上半球采样终点（10名UAV专家人工筛选）→轨迹渲染（10Hz、碰撞检测）→30%轨迹注入扰动作恢复样本→人工复核。\n2. 真实数据：1,000条专业飞手遥操作轨迹，5类目标（自行车、篮球、轿车、卡车、路牌）各200条，保留风致抖动、动态模糊、镜头眩光等真实伪影。\n3. QA标注：Qwen3-VL基于最优终点视图生成七类问题（物体计数、状态识别、缺陷检测、空间推理、属性识别、行为识别、文字识别），三轮过滤（自洽验证→反事实初始视角可答性检查→人工复核）；另混入80K条LLaVA-Instruct-150K筛选的通用VQA（≤32字符短答案），合计120K+样本。",
    "results": "1. 主实验（9环境、目标训练未见）：ScoutVLA-Pi05达SSR 71.90%、TDR 80.99%、QAC 72.70%；最强非本文基线（CityEQA）仅SSR 11.79%、QAC 16.96%，平均严格成功率提升10.48×、QA正确率提升7.72×；ScoutVLA-Pi0取得最低终点距离（DT 16.20m）。\n2. 消融：去LoRA→QAC暴跌至12.32%；去知识绝缘→导航与问答同时崩溃（SSR 8.04%）；去LMAdapter→无法产生校准短答案。\n3. 终点视图可答性：冻结终点图像交外部VQA面板作答，ScoutVLA-Pi05平均QAC 36.27%远超基线（≤9.30%），证明其终点视图证据本身更充分。\n4. 真实部署（DJI无人机+RTX 5090地面站闭环）：1K真实轨迹微调后50次实飞，SSR 68.30%、TDR 81.50%、QAC 71.20%。",
    "problem": "1. 过早终止问题：现有户外EQA采用\"导航-再回答\"解耦范式，目标一进入视野即停止，终止视角/距离不佳，遮蔽了回答问题所需的关键视觉证据（如卡车尾部车牌）。\n2. 视角敏感性问题：开放世界视觉证据极端依赖视角，空间位置与相机姿态的微小偏差即决定角度依赖的细小特征是否可辨。\n3. 语义到物理映射困难：需将高度抽象的语言意图翻译为具体的3D几何搜索策略，跨模态鸿沟巨大。\n4. 高自由度连续控制困难：现有方法依赖固定多视角相机阵列或低维/离散动作空间，无法支持精确的连续视角微调。",
    "sourceRow": 18,
    "sourceWorkbook": "具身感知文献汇总表_cleaned.xlsx"
  },
  {
    "id": "activefly-bench",
    "category": "embodied-perception",
    "title": "ActiveFly-Bench: Aligning Embodied Question Answering with Vision-Language-Action for Aerial Embodied Perception",
    "methodName": "ActiveFly-Bench",
    "authors": [
      "Weichen Zhang",
      "Shiquan Yu",
      "Yinan Zhu",
      "Peizhi Tang",
      "Shilong Ji",
      "Zhiyuan Deng",
      "Tianyi Lyu",
      "Haoyang Wang",
      "Xin Zeng",
      "Chen Gao",
      "Yong Li",
      "Xinlei Chen"
    ],
    "taskTags": [
      "主动感知",
      "benchmark"
    ],
    "methodTags": [
      "VLA+LLM"
    ],
    "datasets": [
      "自建数据集",
      "真实场景"
    ],
    "venue": "arXiv",
    "year": "2026",
    "summary": "Establishes an aerial embodied question answering benchmark aligning vision-language-action representations for active perspective adjustment.",
    "theFirst": "首个对齐赛博空间与物理世界的无人机具身感知基准（the first benchmark that aligns cyberspace and the physical world for UAV embodied perception）；同时提供首个细粒度语言引导无人机控制（FLUC）数据集，联合建模机体与云台控制。",
    "image": "assets/papers/perception/activefly-bench.png",
    "paperUrl": "https://arxiv.org/abs/2607.10180",
    "codeUrl": "",
    "cardId": "paper-card-activefly-bench",
    "type": "VLA+LLM",
    "publication": "Arxiv",
    "authorsText": "Zhang, Weichen and Yu, Shiquan and Zhu, Yinan and Tang, Peizhi and Ji, Shilong and Deng, Zhiyuan and Lyu, Tianyi and Wang, Haoyang and Zeng, Xin and Gao, Chen and Li, Yong and Chen, Xinlei",
    "method": "1. 三级层次化任务分解：Air-EQA（由问题 Q 与初始观测 O0 出发，基于历史观测 O0:N 作答）、OBP（由 O0 与 Q 预测观测行为描述 Lob，作为中间步骤）、FLUC（以 Lob、当前观测 Ot 与状态 xt 预测细粒度动作 at）。三个任务由同一批轨迹构建，保证语义对齐 。\n2. 引入云台俯仰控制：动作空间包含三维平移、偏航与俯仰，比传统 VLN/VLA 更细粒度（原文 Table 1 记为 7-DoF，正文公式与 4.1 节表述为 5 维/5-DoF）。\n3. ActiveFly 闭环智能体：VLM 由初始观测与问题预测文本观测计划，该计划作为语言指令输入 VLA，结合当前观测与无人机状态预测动作；执行结束后从观测历史采样 n 张图（实测 n=16）连同问题交给 VLM 输出最终答案 。\n4. 地面-无人机协同部署：VLM 与 VLA 运行于 RTX A6000 服务器，机上仅跑 SLAM 与路径规划；无人机经 WiFi 以 30 Hz 回传 1K 第一人称视频与状态，并采用 Stop-and-infer 策略（执行完上一动作后等待下一动作）缓解通信与推理延迟造成的控制失配 。\n5. 数据构建：定义 Occlusion、Non-Frontal Orientation、Peripheral View、Distant Blur 四类观测受限场景与十种基元行为；基元行为用模板 \"<Action> until <target object> is in the center of the field of view\" 自动生成指令，复杂行为由资深标注员人工撰写；对起点、终点与中间关键路点加高斯噪声后经路径规划平滑复飞，每条指令自动生成 5 到 40 条演示 。\n6. Air-EQA 盲筛：用 GPT-5、Gemini、Qwen 仅看问题与初始观测作答，三者全部答对的样本丢弃，再人工过滤指代歧义、开放式答案及无需移动即可回答的样本，并改写不可排除的干扰项 。",
    "datasetText": "1. 规模：10k FLUC 轨迹、1.3k Air-EQA 与 1.3k OBP 问答对（结论处表述为 2.6k QA pairs）。Figure 3d 统计为 FLUC 10,076 条、Air-EQA 3,611 条 。\n2. 数据来源：正文为仿真 6.2k、真实室内 1.9k、真实室外 1.9k；Figure 3d 为仿真 5,945、真实室内 2,228、真实室外 1,903 。Air-EQA 来源为真实室内 1,840、真实室外 1,102、仿真 669 。\n3. Air-EQA 问题类别分布：物体识别 862、计数 855、空间理解 686、世界知识 672、属性识别 536 。\n4. 场景：一个真实校园室外场景、一个真实室内场景，以及两个基于 Unreal Engine 与 AirSim 的高保真城市仿真环境（EmbodiedCity 与 AerialVLN），云台俯仰范围 0 到 90 度 。\n5. 长度分布：轨迹多为 10 到 40 米；FLUC 指令 15 到 30 词，Air-EQA 问题 5 到 20 词，OBP 10 到 30 词 。\n6. 划分：FLUC 按各轨迹类别等比切分为 80% 训练（8k）与 20% 测试（2k）；Air-EQA 与 OBP 全部用于评测 。\n7. 标注形式：EQA 为四选一 MCQ（一个正确项与三个干扰项），每条有唯一 question_id 并对应唯一 data_id，并非每个样本都配有 EQA。首轮用单模型盲筛淘汰 33% 的 EQA，后改为 Gemini_2.5_Flash、GPT_5.4_Nano、Qwen3-VL_Flash 多模型投票，并引入 IDK 与 Action needed 选项、CoT 输出及人工交叉复核 。\n8. 真机采集：由 5 名资深飞手操作；从 ROS bag 提取里程计 (x, y, z, yaw) 与云台状态，按曲率变化自适应采样（默认 8 个关键点），位置加标准差 0.1 m、偏航加标准差 0.05 rad 的零均值高斯噪声，再用改造后的 EGO-Planner 加 PID 与云台伺服控制器复飞自动采图 。\n9. 硬件平台：280 mm 轴距碳纤机架、T-Motor F90 电机、Intel NUC 13 ANKB 机载计算、PX4 飞控、Livox Mid-360 激光雷达、XF C-200T 三轴云台；定位用 FAST-LIO2，局部规划用 EGO-Planner 。",
    "results": "1. 基线与指标：VLM 选 GPT-5.4、Gemini-2.5-Pro、Qwen3-VL-Max，VLA 选 OpenVLA 与 Pi-0.5，并用人类替换其一作为上界。Air-EQA 用 MCQ 准确率与 APL，FLUC 用 SR、OSR、NE、nDTW，EP 成功定义为 Sep = Sobp · OSfluc · Seqa 。\n2. 主结果（EP-SR / Air-EQA Acc. / APL / OBP Acc.）：GPT-5.4+OpenVLA 18.9 / 71.0 / 37.4 / 72.5；GPT-5.4+Pi-0.5 47.8 / 66.8 / 27.6 / 72.5；Gemini+OpenVLA 17.1 / 71.4 / 38.6 / 70.4；Gemini+Pi-0.5 49.4 / 68.1 / 27.4 / 70.4；Qwen+OpenVLA 19.1 / 70.8 / 36.7 / 63.9；Qwen+Pi-0.5 46.7 / 63.9 / 26.5 / 63.9；Human+OpenVLA 24.8 / 82.3 / 58.3 / 99.1；Human+Pi-0.5 60.3 / 85.0 / 41.2 / 99.1；GPT-5.4+Human 69.2 / 69.2 / - / 72.5；纯人类 97.3 / 98.2 / - / 99.1 。\n3. FLUC：Pi-0.5 取得 31.0% SR 与 71.0% OSR，SR 比 OpenVLA（13.1%）高 18 个点、OSR（28.9%）优势更大；但两者 nDTW 均约 12%（12.9 与 12.2），OpenVLA 的 NE（7.55）比 Pi-0.5（9.86）小约 2 米 。\n4. 整体结论：Pi-0.5 系智能体的 EP 成功率比 OpenVLA 系高约 30%；所有非人类基线的 Air-EQA 准确率都远高于 EP，主因是 Air-EQA escape 现象（Seqa=1 但 Sep=0）；APL 普遍显著低于准确率，说明成功往往依赖冗长探索；OBP 上 Qwen3 明显弱于 GPT-5.4 与 Gemini-2.5 。\n5. 类别级：Air-EQA 上 Pi-0.5 在所有问题类别的 APL 均低于 OpenVLA；OBP 在 distant blur、peripheral view 与基元轨迹上的规划成功率显著高于 occlusion 与 non-frontal orientation；FLUC 上 Pi-0.5 各子类 SR/OSR 均更高但 SR 与 OSR 差距更大，归因于其轨迹倾向于穿过目标位置而非精确停靠 。\n6. 误差分析：主导误差源为 OBP 失败与 Air-EQA escape，OBP 失败在 Pi-0.5 系中占误差最高 20%、OpenVLA 系约 15%。成功/失败/逃逸比例——OpenVLA 系约 17 到 19 / 29 / 52 到 54，Pi-0.5 系约 47 到 49 / 32 到 36 / 17 到 19 。\n7. 真机验证：室内外闭环部署，QA 用 GPT-5.4、动作预测用 OpenVLA，可自主完成推理、细粒度动作控制与具身问答。单次控制回路延迟（5 Mbps WiFi）：图像传输约 120、VLA 推理约 250、运动规划约 10、PID 响应约 10，合计约 390 毫秒，总延迟在 1 秒以内 。",
    "problem": "1. 物理世界控制与高层赛博空间推理的语义鸿沟：现有 EQA 基准要么省略中间动作执行过程，要么提供的探索轨迹缺乏显式的任务驱动行为动机；空中 VLN 只关注动作预测、缺少对应的高层 EQA 目标，其冗长且结构化的指令偏离真实人机交互，难以在其上构建 EQA 任务 。\n2. 动作控制粒度过粗：现有语言引导无人机控制任务只要求飞到目标附近位置、忽略最终朝向，而实际感知任务中无人机还需调整视角以获得期望观测 。\n3. 缺乏真实世界验证：多数语言引导交互系统仅在仿真中评测，少数工作只做了短指令的真机控制，仍缺少支持语言引导具身感知的真实系统 。",
    "sourceRow": 19,
    "sourceWorkbook": "具身感知文献汇总表_cleaned.xlsx"
  }
];
