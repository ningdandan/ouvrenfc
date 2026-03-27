# ---

**📋 PRD & 架构设计：NFC 扇子专属数字身份系统重构**

## **1\. 产品概述**

本项目旨在将现有的 NFC 扇子基础跳转页，升级为\*\*“实体卡激活 \-\> 唯一 Handle 绑定 \-\> 个人主页展示与编辑”\*\*的完整闭环系统。彻底废除旧版临时 PIN 码机制，引入硬核的“卡密激活”与长效 JWT Cookie 鉴权。

## **2\. 核心数据结构设计 (Vercel KV)**

由于使用 KV 数据库，我们将采用双键（Dual-Key）映射策略。系统需要两张“表”：

### **2.1 卡片库存表（Card DB）**

预先生成的编号与密码表，用于校验所有权。

* **Key:** card:\<id\> (例如: card:00001)  
* **Value:**

TypeScript

type CardRecord \= {  
  status: 'inactive' | 'active';   
  key: string;       // 实体卡上印的密码，例如 'ART-8892'  
  handle?: string;   // 激活后绑定的 handle，未激活时不存在  
}

### **2.2 用户主页表（User DB）**

激活后生成的个人空间数据。

* **Key:** user:\<handle\> (例如: user:alex)  
* **Value:**

TypeScript

type UserRecord \= {  
  id: string;              // 绑定的扇子ID，例如 '00001'  
  spaceName: string;       // 空间名  
  socialLinks: SocialLink\[\]; // 社交链接  
  theme: string;           // 皮肤标识 (五选一，例如 'theme-dark', 'theme-cyber' 等)  
}

## **3\. 核心路由与状态流转**

### **3.1 NCF 触碰入口：/link/\[id\]**

* **物理写入链接:** link.ouvre.nyc/link/00001  
* **后端逻辑 (Server端处理):**  
  1. 提取 URL 参数 id 并校验正则 ^00(0(0\[1-9\]|\[1-9\]\[0-9\])|100)$。  
  2. 查询 KV: GET card:\[id\]。  
  3. **若 status \=== 'inactive'**: 重定向 (302) 到 /activate/\[id\]。  
  4. **若 status \=== 'active'**: 提取绑定的 handle，重定向 (302) 到 /\[handle\]。

### **3.2 激活流程：/activate/\[id\]**

* **UI 展示:** 所有者验证与激活表单。  
* **步骤:**  
  1. 用户输入卡片 Key（如 ART-8892）。  
  2. 用户输入期望的 Handle（如 alex）。  
  3. **Server Action 提交:**  
     * 比对输入的 Key 与 card:\[id\].key 是否一致。  
     * 查重：查询 user:\[handle\] 是否已存在。若存在则返回错误“Handle 已被占用”。  
     * **事务/原子写入 (落库):** \* 更新 card:\[id\] \-\> status: 'active', handle: 'alex'。  
       * 创建 user:\[handle\] \-\> 写入默认 spaceName, theme, 空 socialLinks。  
     * **签发授权:** 生成 JWT（Payload 包含 { id: '00001', handle: 'alex' }），并设置为名为 auth\_token 的 HttpOnly Cookie，有效期设为 1 年（长效）。  
     * **完成:** 重定向至 /\[handle\]?edit=true（或专门的编辑路由）。

### **3.3 个人主页展示与编辑入口：/\[handle\]**

* **UI 展示:** 渲染用户对应的 spaceName, socialLinks, theme。无论访客是谁，页面固定位置**始终显示一个 \[Edit\] 按钮**。  
* **点击 Edit 逻辑:**  
  1. **前端检测:** 如果检测到有合法的 auth\_token Cookie（或调用简单的 API 校验），直接进入编辑状态/跳转到设置页。  
  2. **无权限者:** 弹窗或跳转到“请输入卡片 Key 解锁”页面。附带提示文案：“如需找回密码，请联系 Instagram 客服”。  
  3. **新设备验证登录:** 用户输入正确的 Key 后，服务端校验该 Key 是否属于当前 Handle 对应的卡片。验证通过后，重新签发 auth\_token Cookie 给该新设备。  
* **⚠️ 业务规则:** Handle 一旦绑定，前端和正常交互流中**不允许修改**。如需修改只能由后台客服手动操作 KV 数据库。

## **4\. 历史技术债清理指南（Cleanup）**

执行新功能前，必须彻底清除旧逻辑：

1. **全面移除 PIN 概念:** 搜索全代码库的 pin 关键字。删除旧的 first-init-pin sessionStorage，删除 React state 中的 verifiedPin。  
2. **清理 localStorage 缓存:** 删除前端代码中涉及 link-cache 的逻辑，不再依赖本地存储做状态持久化，全权交由 JWT Cookie 和 Server Actions。

## **5\. 给 Cursor 的开发步骤建议**

1. **Step 1:** 先编写一个用于预生成 00001-00100 卡密并注入 KV 的独立脚本（用于生产环境准备）。  
2. **Step 2:** 全局重构并删除旧的 PIN 校验系统，清理陈旧的 types 和 states。  
3. **Step 3:** 实现 /link/\[id\] 的路由中间件（Middleware）或 Server Component 重定向逻辑。  
4. **Step 4:** 开发 /activate/\[id\] 页面及对应的 Server Actions（查重、验证、双写 KV、签发 JWT Cookie）。  
5. **Step 5:** 开发 /\[handle\] 页面及 Edit Auth 鉴权逻辑。

---

