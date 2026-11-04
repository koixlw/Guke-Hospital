/* ================= 页面：工作台 ~ 入院登记 ================= */

/* ---------- 0 工作台 ---------- */
function pageDash(){
  const kpis = [
    {lb:'今日日间手术申请',vl:24,u:'例',dt:'较昨日 +6 例',cls:''},
    {lb:'待专科评估',vl:6,u:'例',dt:'超时未评估 1 例',cls:'orange'},
    {lb:'待麻醉评估',vl:5,u:'例',dt:'平均等待 3.2 小时',cls:'orange'},
    {lb:'待预约手术',vl:4,u:'例',dt:'号源充足',cls:'teal'},
    {lb:'今日入院登记',vl:8,u:'例',dt:'已报到 6 例',cls:'green'},
    {lb:'今日手术完成',vl:11,u:'例',dt:'台次利用率 86%',cls:'green'}
  ].map(k=>`<div class="kpi ${k.cls}">
      <div class="lb">${k.lb}</div>
      <div class="vl">${k.vl}<small>${k.u}</small></div>
      <div class="dt">${k.dt}</div>
    </div>`).join('');

  const flow = [
    {nm:'申请',n:24,st:'on'},{nm:'缴费冻结',n:21,st:'on'},{nm:'术前检查',n:19,st:'on'},
    {nm:'专科评估',n:18,st:'on'},{nm:'麻醉评估',n:15,st:'cur'},{nm:'手术预约',n:14,st:''},
    {nm:'入院登记',n:12,st:''},{nm:'手术登记',n:11,st:''},{nm:'术后结算',n:11,st:''}
  ].map(f=>`<div style="flex:1;text-align:center;position:relative">
      <div style="height:6px;border-radius:3px;background:${f.st==='on'?'linear-gradient(90deg,#4a9ee0,#2f7fc4)':(f.st==='cur'?'linear-gradient(90deg,#f0b45e,#d9820a)':'#e6edf5')};margin-bottom:8px"></div>
      <div style="font-size:15px;font-weight:700;color:${f.st==='cur'?'#d9820a':'#17324c'}">${f.n}</div>
      <div style="font-size:11.5px;color:var(--txt2);margin-top:2px">${f.nm}</div>
    </div>`).join('');

  const rows = [
    ['OR-1','08:30','膝关节镜下半月板成形术','王建国','李国栋','椎管内麻醉','已完成'],
    ['OR-1','10:40','腕管综合征切开减压术','李秀兰','王海涛','臂丛神经阻滞','手术中'],
    ['OR-2','09:10','桡骨远端骨折闭合复位内固定术','陈志强','陈立新','臂丛神经阻滞','已完成'],
    ['OR-2','14:30','肩关节镜下肩袖修补术','张桂芳','刘晓峰','全身麻醉','待手术'],
    ['OR-3','13:30','腰椎间盘突出椎间孔镜髓核摘除术','刘建华','赵敏','局部麻醉','待手术']
  ].map(r=>`<tr><td><b>${r[0]}</b></td><td class="num">${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td><td>${r[5]}</td><td>${statusTag(r[6]==='手术中'?'待手术':r[6])}</td></tr>`).join('');

  const todo = [
    ['麻醉评估待处理','赵文轩 等 5 例','5 例','o','anes'],
    ['专科评估超时未完成','周雅琴 已等待 26 小时','1 例','r','spec'],
    ['手术安排变动待通知','陈志强 术间/时间变更','1 例','o','schedule'],
    ['入院前通知待确认','今日 16:00 定时任务','8 例','b','notify'],
    ['退出日间手术待审核','患者电话告知不来手术','1 例','gy','quit']
  ].map(t=>`<div class="list-row" style="cursor:pointer" onclick="go('${t[4]}')">
      <div><div class="t1">${t[0]}</div><div class="t2">${t[1]}</div></div>
      <div class="rt">${tag(t[2],t[3])}</div>
    </div>`).join('');

  return `
  <div class="page-head">
    <div><div class="page-title"><span class="bar"></span>工作台</div>
      <div class="page-sub">日间手术中心 · 张敏 · 2026-11-02 星期一 · 数据截至 10:38</div></div>
    <div class="page-actions">${btn('刷新数据','','refresh')}${btn('导出日报','','down')}</div>
  </div>
  <div class="grid g-3" style="grid-template-columns:repeat(6,1fr)">${kpis}</div>
  <div class="grid g-side" style="margin-top:12px">
    <div>
      ${card('日间手术全流程实时看板', `<div style="display:flex;gap:8px;padding:2px 4px 6px">${flow}</div>
        <div class="hint" style="padding:6px 4px 0;display:flex;gap:16px;border-top:1px dashed var(--line);margin-top:8px;padding-top:8px">
          <span>● 蓝色：已完成该环节</span><span>● 橙色：当前集中环节</span><span>流程断点自动预警：滞留超过 24 小时转红</span>
        </div>`, {right:'近 7 日平均在院时长 1.4 天'})}
      ${card('今日手术安排', `<table class="tb">
        <thead><tr><th style="width:64px">手术间</th><th style="width:64px">时间</th><th>手术名称</th><th style="width:70px">患者</th><th style="width:70px">术者</th><th style="width:96px">麻醉方式</th><th style="width:76px">状态</th></tr></thead>
        <tbody>${rows}</tbody></table>`, {tight:true, right:'共 11 台 · 已完成 9 台'})}
    </div>
    <div>
      ${card('我的待办', todo, {tight:true, right:'共 16 项'})}
      ${card('短信通知状态（今日）', `
        <div style="display:flex;gap:10px;margin-bottom:10px">
          <div style="flex:1;background:#f6faf8;border:1px solid #dcefe4;border-radius:6px;padding:8px 10px">
            <div class="hint">发送成功</div><div style="font-size:19px;font-weight:700;color:#0f9d63">37</div></div>
          <div style="flex:1;background:#fdf9f4;border:1px solid #f3e3cc;border-radius:6px;padding:8px 10px">
            <div class="hint">失败待重发</div><div style="font-size:19px;font-weight:700;color:#d9820a">2</div></div>
        </div>
        <div class="hint" style="line-height:1.9">
          短信平台：已联通 · 网关状态正常<br>
          定时任务：入院前通知 16:00 自动执行<br>
          失败原因：号码空号 1 条、关机 1 条
        </div>`)}
    </div>
  </div>`;
}

/* ---------- 1 日间手术申请 ---------- */
function pageApply(){
  const modes = MODES.map((m,i)=>`<label><input type="radio" name="mode" ${i===0?'checked':''}>${m}</label>`).join('');
  return `
  <div class="page-head">
    <div><div class="page-title"><span class="bar"></span>日间手术申请</div>
      <div class="page-sub">诊间医生站 · 门急诊医生开立 · 申请单为全流程唯一业务载体</div></div>
    <div class="page-actions">${btn('返回诊间','')}${btn('打印申请单','','print')}</div>
  </div>
  ${patientBand({extra:tag('已建档','gy')})}
  <div style="height:12px"></div>
  ${A.red('系统自动拦截：该患者口服抗凝剂停药时间不足 7 天，不允许申请日间手术',
    '系统读取门诊诊断与医嘱，识别到口服抗凝剂「利伐沙班片 10mg qd」，末次服药日期 2026-10-29，截至今日停药 <b>4 天</b>，未达到 7 天安全停药要求。请待停药满 7 天后再行申请，或经专科会诊评估后按择期普通住院办理。')}
  <div style="height:12px"></div>
  <div class="grid g-side">
    <div>
      ${card('日间手术申请单', `
        <div class="form-grid">
          <div class="field"><label>申请单号</label><input class="inp readonly" value="${CUR.apply}" readonly></div>
          <div class="field"><label>开单科室</label><input class="inp readonly" value="关节外科门诊" readonly></div>
          <div class="field"><label class="req">申请医师</label><input class="inp readonly" value="李国栋" readonly></div>
          <div class="field"><label class="req">拟手术名称</label><input class="inp" value="膝关节镜下半月板成形术"></div>
          <div class="field"><label>诊断</label><input class="inp" value="右膝内侧半月板撕裂"></div>
          <div class="field"><label>ICD 编码</label><input class="inp" value="S83.201"></div>
          <div class="field"><label class="req">拟入院日期</label><input class="inp" value="2026-11-03"></div>
          <div class="field"><label>预计手术时长</label><input class="inp" value="60 分钟"></div>
          <div class="field"><label>拟麻醉方式</label><select class="inp">${ANES.map(a=>`<option ${a===CUR.anes?'selected':''}>${a}</option>`).join('')}</select></div>
        </div>
        <div style="margin-top:14px">
          <div class="hint" style="margin-bottom:7px">业务模式（贯穿评估、预约、通知、费用全部环节，可追溯）</div>
          <div class="radio-row">${modes}
            <span style="margin-left:auto" class="hint">当前选择：手术麻醉 · 系统据此生成麻醉评估待办</span>
          </div>
        </div>
        <div style="margin-top:14px">
          <div class="hint" style="margin-bottom:6px">申请说明 / 术前注意事项</div>
          <textarea class="inp" style="width:100%;height:56px;padding:8px 9px;resize:none">患者右膝疼痛 3 个月，MRI 提示内侧半月板Ⅲ度撕裂，保守治疗无效，拟行关节镜手术。既往高血压，规律服药，血压控制稳定。</textarea>
        </div>
        <div style="margin-top:14px;display:flex;gap:9px;align-items:center;border-top:1px dashed var(--line);padding-top:12px">
          ${btn('保存草稿','')}
          <button class="btn primary" disabled style="opacity:.5">提交申请</button>
          ${btn('发起会诊','')}
          <span class="hint" style="margin-left:auto;color:#d64545">${ico('warn',12)} 抗凝剂控制未通过，提交按钮已锁定</span>
        </div>`)}
    </div>
    <div>
      ${card('抗凝剂判断明细', `
        <table class="tb"><tbody>
          <tr><td style="width:96px;color:#7b8fa3">识别来源</td><td>门诊医嘱 · 药品字典</td></tr>
          <tr><td style="color:#7b8fa3">药品名称</td><td><b>利伐沙班片</b> 10mg</td></tr>
          <tr><td style="color:#7b8fa3">服用频次</td><td>每日 1 次（qd）</td></tr>
          <tr><td style="color:#7b8fa3">末次服药</td><td>2026-10-29</td></tr>
          <tr><td style="color:#7b8fa3">停药天数</td><td><b style="color:#d64545">4 天</b>（要求 ≥ 7 天）</td></tr>
          <tr><td style="color:#7b8fa3">判断结果</td><td>${tag('拦截','r')} 不允许申请日间手术</td></tr>
        </tbody></table>`)}
      ${card('近期门诊就诊', `
        <div class="list-row" style="padding-left:0;padding-right:0"><div><div class="t1">关节外科门诊 · 李国栋</div><div class="t2">2026-10-28 · 门诊号 OP20261102031</div></div><div class="rt">${tag('已完成','gy')}</div></div>
        <div class="list-row" style="padding-left:0;padding-right:0;border-bottom:none"><div><div class="t1">影像科 · 右膝 MRI 报告</div><div class="t2">2026-10-31 · 内侧半月板Ⅲ度撕裂</div></div><div class="rt">${tag('已回传','g')}</div></div>`)}
    </div>
  </div>`;
}

/* ---------- 2 诊间缴费记账（▲条款 1） ---------- */
function pagePay(){
  const book = [
    ['2026-10-30','血常规（五分类）','检验','28.00','已记账'],
    ['2026-10-30','凝血四项','检验','56.00','已记账'],
    ['2026-10-30','生化全套','检验','186.00','已记账'],
    ['2026-10-30','心电图（十二导联）','检查','35.00','已记账'],
    ['2026-10-30','胸部正侧位 DR','检查','128.00','已记账'],
    ['2026-10-30','右膝关节 MRI（3.0T）','检查','427.00','已记账'],
    ['2026-10-31','术前用药及耗材','材料','318.00','已记账']
  ].map(r=>`<tr><td class="num">${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td class="r num">${r[3]}</td><td class="c">${tag(r[4],'g')}</td></tr>`).join('');

  const flow = FLOWS.map(f=>`<tr><td class="num">${f.tm}</td><td>${tag(f.typ, f.typ==='冻结'?'b':(f.typ==='充值'?'g':'gy'))}</td>
    <td class="r num" style="color:${f.amt.startsWith('+')?'#0f9d63':'#33475c'};font-weight:600">${f.amt}</td>
    <td class="r num">${f.bal}</td><td>${f.op}</td><td style="color:#5b6b7f">${f.rmk}</td></tr>`).join('');

  return `
  <div class="page-head">
    <div><div class="page-title"><span class="bar"></span>诊间缴费记账 <span class="tag solid" style="margin-left:2px">▲ 条款 1</span></div>
      <div class="page-sub">日间手术专项储值金 · 充值与门诊记账 · 冻结 / 转住院结转 / 退出门诊结算</div></div>
    <div class="page-actions">${btn('打印对账单','','print')}${btn('财务对账导出','','down')}</div>
  </div>
  <div class="grid g-side-r">
    <div>
      <div class="money-account">
        <div class="st">已冻结</div>
        <div class="t">${ico('wallet',13)} 日间手术专项储值金账户 · 与普通门诊账户独立记账</div>
        <div class="big">2,800.00<small>元</small></div>
        <div class="hint" style="color:#bcdcf4">${CUR.name} · ${CUR.sex} · ${CUR.age}岁 · 病历号 ${CUR.mrn}</div>
        <div class="row">
          <div>冻结金额<b>2,800.00</b></div>
          <div>已发生费用<b>1,178.00</b></div>
          <div>可用余额<b>1,622.00</b></div>
          <div>账户状态<b style="font-size:12px">已冻结</b></div>
        </div>
      </div>
      <div class="card" style="margin-top:12px">
        <div class="card-bd" style="display:flex;gap:8px;flex-wrap:wrap;padding:11px 13px">
          ${btn('充值','','plus')}${btn('冻结储值金','','money')}${btn('转住院结转','primary','swap')}${btn('退出门诊结算','danger','exit')}${btn('查看账户详情','','doc')}
          <span class="hint" style="margin-left:auto;align-self:center">资金类操作在数据库事务内完成，实时更新冻结金额与账户状态</span>
        </div>
      </div>
      ${card('门诊记账明细', `<table class="tb">
        <thead><tr><th style="width:88px">发生日期</th><th>项目名称</th><th style="width:64px">类别</th><th style="width:80px" class="r">金额(元)</th><th style="width:76px" class="c">状态</th></tr></thead>
        <tbody>${book}</tbody>
        <tfoot><tr><td colspan="3">合计 7 项</td><td class="r num">1,178.00</td><td></td></tr></tfoot></table>`, {tight:true, right:'全部由医技收费接口自动回写'})}
    </div>
    <div>
      ${card('账户状态流转', `
        <div style="display:flex;flex-direction:column;gap:0">
          ${[
            ['充值入账','2026-10-30 08:52','收费处 · 刘芳','g'],
            ['冻结（进入日间流程）','2026-10-30 08:55','系统自动','b'],
            ['门诊记账（检查检验）','2026-10-30 08:58','系统自动 · 医技收费接口','b'],
            ['待处理：转住院结转 / 门诊结算','—','—','o']
          ].map((s,i,arr)=>`<div style="display:flex;gap:10px">
              <div style="display:flex;flex-direction:column;align-items:center;width:14px">
                <span style="width:9px;height:9px;border-radius:50%;background:${s[3]==='g'?'#0f9d63':(s[3]==='b'?'#1b6fc4':'#d9820a')};margin-top:4px"></span>
                ${i<arr.length-1?'<span style="flex:1;width:1px;background:#dfe7f0;margin:2px 0"></span>':''}
              </div>
              <div style="padding-bottom:12px;flex:1">
                <div style="font-weight:600;color:#22364c;font-size:12.5px">${s[0]}</div>
                <div class="hint">${s[1]} · ${s[2]}</div>
              </div>
            </div>`).join('')}
        </div>`)}
      ${card('资金流水', `<table class="tb">
        <thead><tr><th style="width:104px">时间</th><th style="width:56px">类型</th><th class="r" style="width:76px">金额</th><th class="r" style="width:62px">余额</th></tr></thead>
        <tbody>${FLOWS.map(f=>`<tr><td class="num" style="font-size:11.5px">${f.tm.slice(5)}</td><td>${f.typ}</td>
          <td class="r num" style="color:${f.amt.startsWith('+')?'#0f9d63':'#33475c'}">${f.amt}</td><td class="r num">${f.bal}</td></tr>`).join('')}</tbody>
      </table>`, {tight:true, right:'<span class="link">全部流水</span>'})}
      <div class="alert b" style="margin-top:12px"><span class="ai">${ico('info',16)}</span><div class="t">
        转住院时冻结金额原子性转入住院储值金并生成结转流水；退出日间手术时按实际发生费用核销、退回余额并生成结算流水，全程可追溯、账实相符。</div></div>
    </div>
  </div>`;
}

/* ---------- 3 术前检查及预约 ---------- */
function pageExam(){
  const rows = EXAMS.map(e=>`<tr>
    <td><b>${e.nm}</b><div class="hint" style="margin-top:2px">${e.cat} · 来源：${e.sys}</div></td>
    <td class="num">${e.appt}</td>
    <td>${e.sys==='LIS'?'检验科':'医技预约系统'}</td>
    <td class="c">${statusTag(e.status)}</td>
    <td class="num">${e.rpt}</td>
    <td class="c"><span class="link">查看报告</span></td></tr>`).join('');

  const logs = [
    ['10:05:12','医技预约系统','预约状态回传','成功','184ms'],
    ['10:05:13','医技收费系统','检查项目记账 427.00','成功','216ms'],
    ['10:06:40','LIS','检验报告回传（3 项）','成功','158ms'],
    ['14:12:05','医技预约系统','检查报告回传（DR）','成功','203ms'],
    ['09:42:18','医技预约系统','MRI 报告回传','成功','241ms']
  ].map(l=>`<div class="list-row" style="padding-left:0;padding-right:0">
      <div><div class="t1">${l[2]}</div><div class="t2">${l[1]} · ${l[0]} · ${l[4]}</div></div>
      <div class="rt">${tag(l[3],'g')}</div></div>`).join('');

  return `
  <div class="page-head">
    <div><div class="page-title"><span class="bar"></span>术前检查及预约</div>
      <div class="page-sub">术前检查检验在门诊完成 · 复用现有医技预约、医技收费系统 · 报告回传关联申请单</div></div>
    <div class="page-actions">${btn('新增检查申请','primary','plus')}${btn('同步报告','','refresh')}</div>
  </div>
  ${patientBand()}
  <div style="height:12px"></div>
  <div class="grid g-side">
    <div>
      ${card('术前检查检验项目', `<table class="tb">
        <thead><tr><th>项目名称</th><th style="width:118px">预约时间</th><th style="width:112px">执行科室</th><th style="width:88px" class="c">状态</th><th style="width:118px">报告回传</th><th style="width:66px" class="c">操作</th></tr></thead>
        <tbody>${rows}</tbody></table>`, {tight:true, right:'7 项全部完成 · 报告已回传'})}
    </div>
    <div>
      ${card('接口调用状态', `
        <div style="display:flex;flex-direction:column;gap:9px">
          ${[['医技预约系统','已联通','g'],['医技收费系统','已联通','g'],['LIS 检验系统','已联通','g'],['PACS 影像系统','已联通','g']].map(i=>`
            <div style="display:flex;align-items:center;gap:8px;font-size:12.5px">
              <span style="width:6px;height:6px;border-radius:50%;background:#0f9d63"></span>${i[0]}
              <span style="margin-left:auto">${tag(i[1],'g')}</span></div>`).join('')}
        </div>
        <div class="hint" style="margin-top:10px;line-height:1.8;border-top:1px dashed var(--line);padding-top:9px">
          本系统不重复建设医技功能，通过集成平台接口调用现有医技系统完成预约与收费，报告回传后与申请单自动关联。
        </div>`)}
      ${card('接口日志（今日）', logs, {tight:true})}
    </div>
  </div>`;
}

/* ---------- 4 专科评估 ---------- */
function pageSpec(){
  const list = EXAMS.slice(0,6).map((e,i)=>`<div class="list-row" style="cursor:pointer;${i===1?'background:#f2f8ff;border-left:2px solid #1b6fc4':''}">
      <div><div class="t1">${e.nm}</div><div class="t2">${e.rpt} · 已回传</div></div>
      <div class="rt">${tag('已查看','gy')}</div></div>`).join('');

  const reasons = FAIL_REASON.slice(0,4).map((r,i)=>`<span class="chk-chip ${i===0?'on':''}">${i===0?'✓ ':''}${r}</span>`).join('');

  return `
  <div class="page-head">
    <div><div class="page-title"><span class="bar"></span>专科评估</div>
      <div class="page-sub">专科医师在线评估 · 报告同屏查看 · 未通过原因提供常见选项并与退出流程联动</div></div>
    <div class="page-actions">${btn('暂存','')}${btn('提交评估结论','primary','ok')}</div>
  </div>
  ${patientBand()}
  <div style="height:12px"></div>
  <div style="display:flex;gap:12px;align-items:flex-start">
    <div style="width:246px;flex:0 0 246px">
      ${card('术前检查检验报告', list, {tight:true, right:'7 项'})}
    </div>
    <div style="flex:1;min-width:0">
      ${card('报告详情 · 凝血四项（2026-10-30 10:05）', `
        <div class="report-line"><div class="k">凝血酶原时间 PT</div><div class="v">12.4 s <em>参考 11.0—14.5</em></div></div>
        <div class="report-line"><div class="k">国际标准化比值 INR</div><div class="v">1.05 <em>参考 0.80—1.20</em></div></div>
        <div class="report-line"><div class="k">活化部分凝血活酶 APTT</div><div class="v">33.8 s <em>参考 28.0—45.0</em></div></div>
        <div class="report-line"><div class="k">纤维蛋白原 FIB</div><div class="v">3.42 g/L <em>参考 2.00—4.00</em></div></div>
        <div class="report-line"><div class="k">D-二聚体</div><div class="v abn">0.86 mg/L <em>参考 &lt; 0.50</em></div></div>
        <div class="report-line"><div class="k">报告结论</div><div class="v">凝血功能基本正常，D-二聚体轻度升高，建议结合临床。</div></div>
        <div class="report-line"><div class="k">审核</div><div class="v">检验科 · 周敏 副主任技师</div></div>`, {tight:true, right:'<span class="link">切换报告</span>'})}
      ${card('专科评估意见', `
        <div class="form-grid c2">
          <div class="field"><label>评估结论</label>
            <div class="radio-row"><label><input type="radio" name="r" checked>通过</label><label><input type="radio" name="r">不通过</label></div></div>
          <div class="field"><label>ASA 分级</label><select class="inp"><option>Ⅰ 级</option><option selected>Ⅱ 级</option><option>Ⅲ 级</option></select></div>
        </div>
        <div style="margin-top:10px"><div class="hint" style="margin-bottom:6px">评估意见</div>
          <textarea class="inp" style="width:100%;height:46px;padding:7px 9px;resize:none">患者一般情况可，心肺功能可耐受手术，术前检查检验结果无明显手术禁忌，同意行日间手术。</textarea></div>`)}
    </div>
    <div style="width:352px;flex:0 0 352px">
      ${card('评估表单（未通过时填写）', `
        <div class="hint" style="margin-bottom:7px">常见原因（可多选，支持自定义补充）</div>
        <div style="display:flex;flex-wrap:wrap;gap:6px">${reasons}</div>
        <div class="hint" style="margin:10px 0 5px">自定义补充</div>
        <textarea class="inp" style="width:100%;height:44px;padding:7px 9px;resize:none" placeholder="请填写具体原因，将同步至病案与退出记录"></textarea>
        <div class="hint" style="margin:10px 0 5px">评估结论流转</div>
        <div style="background:#f7fafd;border:1px solid #e3edf7;border-radius:6px;padding:9px 11px;font-size:12px;line-height:1.8;color:#42586e">
          通过 → 生成麻醉评估待办<br>不通过 → 一键触发退出日间路径（需选择退出原因）</div>
        <div style="display:flex;gap:8px;margin-top:12px">
          ${btn('保存','primary','save')}${btn('签发','teal','ok')}
        </div>`)}
      ${card('评估记录', `
        <div class="list-row" style="padding-left:0"><div><div class="t1">专科评估 · 通过</div><div class="t2">李国栋 · 2026-10-31 11:02</div></div><div class="rt">${tag('已签发','g')}</div></div>
        <div class="list-row" style="padding-left:0;padding-right:0;border-bottom:none"><div><div class="t1">术前访视记录</div><div class="t2">日间手术中心 · 何静 · 2026-10-31</div></div><div class="rt">${tag('已完成','gy')}</div></div>`)}
    </div>
  </div>`;
}

/* ---------- 5 麻醉评估 ---------- */
function pageAnes(){
  const flowItems = ['术前访视','气道评估','麻醉风险分级(ASA)','评估结论'];
  const list = EXAMS.slice(0,5).map(e=>`<div class="list-row" style="cursor:pointer">
      <div><div class="t1">${e.nm}</div><div class="t2">${e.rpt}</div></div>
      <div class="rt">${tag('查看','b')}</div></div>`).join('');

  return `
  <div class="page-head">
    <div><div class="page-title"><span class="bar"></span>麻醉评估</div>
      <div class="page-sub">麻醉医师按医院自定义流程评估 · 评估时同屏查看术前检查检验报告 · 未通过强制转退出管理</div></div>
    <div class="page-actions">${btn('流程配置','','cog')}${btn('提交评估','primary','ok')}</div>
  </div>
  ${patientBand()}
  <div style="height:12px"></div>
  ${card('', `<div style="padding:12px 16px 6px">
      <div style="display:flex;align-items:center;margin-bottom:10px">
        <div style="font-weight:700;font-size:13px">麻醉评估流程</div>
        <span class="hint" style="margin-left:10px">当前流程共 4 个环节，由系统管理员在【参数配置 · 麻醉评估流程】中自定义，配置后即时生效，无需二次开发</span>
        <span style="margin-left:auto">${tag('可配置','t')}</span>
      </div>
      ${steps(flowItems, 2)}
    </div>`, {tight:false})}
  <div style="height:12px"></div>
  <div class="grid g-side">
    <div>
      ${card('评估表单 · 麻醉风险分级', `
        <div class="form-grid">
          <div class="field"><label>身高 / 体重</label><input class="inp" value="172 cm / 74 kg"></div>
          <div class="field"><label>BMI</label><input class="inp readonly" value="25.0" readonly></div>
          <div class="field"><label>禁食时间</label><input class="inp" value="≥ 8 小时（达标）"></div>
          <div class="field"><label>气道评估</label><select class="inp"><option>Mallampati Ⅰ 级</option><option selected>Mallampati Ⅱ 级</option><option>Ⅲ 级</option></select></div>
          <div class="field"><label>张口度</label><input class="inp" value="3 横指"></div>
          <div class="field"><label>合并症</label><input class="inp" value="高血压（控制稳定）"></div>
        </div>
        <div style="margin-top:12px">
          <div class="hint" style="margin-bottom:6px">ASA 分级（决定能否继续日间手术流程）</div>
          <div class="radio-row">
            <label><input type="radio" name="asa">Ⅰ 级</label>
            <label><input type="radio" name="asa" checked>Ⅱ 级</label>
            <label><input type="radio" name="asa">Ⅲ 级</label>
            <label><input type="radio" name="asa">Ⅳ 级</label>
            <span class="hint" style="margin-left:8px">Ⅲ 级及以上系统提示需科主任复核</span>
          </div>
        </div>
        <div style="margin-top:12px"><div class="hint" style="margin-bottom:6px">麻醉计划</div>
          <textarea class="inp" style="width:100%;height:52px;padding:7px 9px;resize:none">拟行椎管内麻醉（L3-4 腰硬联合），局麻药选用 0.5% 罗哌卡因 15mg，术中监测血压、心率、血氧，备全身麻醉预案。</textarea></div>
        <div class="result-bar" style="margin-top:12px">${ico('ok',15)} 评估结论：通过 · 可继续日间手术流程（下一步：手术预约）</div>`)}
    </div>
    <div>
      ${card('术前检查检验报告', list, {tight:true, right:'<span class="link">全部</span>'})}
      ${card('评估环节配置', `
        <div class="list-row" style="padding-left:0"><div><div class="t1">1. 术前访视</div><div class="t2">必填 6 项 · 护士/医师</div></div><div class="rt">${tag('启用','g')}</div></div>
        <div class="list-row" style="padding-left:0"><div><div class="t1">2. 气道评估</div><div class="t2">必填 4 项 · 麻醉医师</div></div><div class="rt">${tag('启用','g')}</div></div>
        <div class="list-row" style="padding-left:0"><div><div class="t1">3. 麻醉风险分级</div><div class="t2">必填 3 项 · 麻醉医师</div></div><div class="rt">${tag('启用','g')}</div></div>
        <div class="list-row" style="padding-left:0;border-bottom:none"><div><div class="t1">4. 评估结论</div><div class="t2">必填 · 通过/不通过</div></div><div class="rt">${tag('启用','g')}</div></div>`)}
    </div>
  </div>`;
}

/* ---------- 6 预约通知 ---------- */
function pageBooking(){
  const records = SMS.slice(0,6).map(s=>`<tr>
    <td class="num">${s.tm}</td><td>${s.to}</td><td>${tag(s.typ, s.typ==='预约成功'?'b':'t')}</td>
    <td class="c">${tag(s.status, s.status==='已送达'?'g':'r')}</td><td class="c">${s.status==='已送达'?'<span class="link">详情</span>':'<span class="link">重发</span>'}</td></tr>`).join('');

  return `
  <div class="page-head">
    <div><div class="page-title"><span class="bar"></span>预约通知</div>
      <div class="page-sub">手术预约完成即自动发送预约成功短信 · 模板后台可配置 · 发送记录全量留痕</div></div>
    <div class="page-actions">${btn('短信模板配置','','cog')}${btn('完成预约并发送短信','primary','sms')}</div>
  </div>
  ${patientBand()}
  <div style="height:12px"></div>
  <div class="grid g-side">
    <div>
      ${card('手术预约', `
        <div class="form-grid">
          <div class="field"><label class="req">手术日期</label><input class="inp" value="2026-11-03"></div>
          <div class="field"><label class="req">手术时段</label><select class="inp"><option>08:30 — 10:00</option><option selected>10:00 — 11:30</option><option>13:30 — 15:00</option></select></div>
          <div class="field"><label class="req">手术间</label><select class="inp"><option>门诊手术室 1 间</option><option selected>门诊手术室 2 间</option><option>门诊手术室 3 间</option></select></div>
          <div class="field"><label>台次</label><input class="inp" value="第 2 台"></div>
          <div class="field"><label>术者</label><select class="inp">${DOCTORS.map(d=>`<option ${d===CUR.doc?'selected':''}>${d}</option>`).join('')}</select></div>
          <div class="field"><label>麻醉医师</label><select class="inp"><option>周文斌</option><option>王海涛</option></select></div>
        </div>
        <div class="hint" style="margin-top:11px">${ico('info',12)} 预约保存后系统按模板自动向患者手机号 138****7261 发送预约成功短信，默认在预约完成时发送</div>`)}
      ${card('短信内容预览（模板：手术预约成功通知）', `
        <div class="phone">
          <div class="sms-bubble">
            <div class="h"><span style="color:#0aa2a2">【四川省骨科医院】</span><span style="margin-left:auto">106****8899</span></div>
            王建国您好，您的手术已预约成功：<br>
            手术日期：2026 年 11 月 3 日（周二）10:00—11:30<br>
            手术科室：关节外科 · 主刀：李国栋<br>
            手术间：门诊手术室 2 间 · 麻醉方式：椎管内麻醉<br>
            请于 11 月 2 日 14:00 前到住院部一楼日间手术中心办理入院，术前禁食 8 小时，携带身份证、医保卡。如有疑问请致电 028-65238736。
          </div>
          <div style="display:flex;gap:8px;margin-top:10px;align-items:center">
            <span class="hint">模板变量：{患者姓名} {手术日期} {时段} {术间} {术者} {麻醉方式}</span>
            <span style="margin-left:auto">${btn('编辑模板','sm','')}</span>
          </div>
        </div>`)}
    </div>
    <div>
      ${card('短信发送记录', `<table class="tb">
        <thead><tr><th style="width:104px">发送时间</th><th style="width:96px">接收号码</th><th style="width:104px">类型</th><th class="c" style="width:72px">状态</th><th class="c" style="width:52px">操作</th></tr></thead>
        <tbody>${records}</tbody></table>`, {tight:true, right:'今日 39 条'})}
      ${card('发送统计', `
        <div style="display:flex;gap:10px;margin-bottom:10px">
          <div style="flex:1;background:#f6faf8;border:1px solid #dcefe4;border-radius:6px;padding:8px 10px">
            <div class="hint">预约成功短信</div><div style="font-size:19px;font-weight:700;color:#0f9d63">24</div></div>
          <div style="flex:1;background:#fdf9f4;border:1px solid #f3e3cc;border-radius:6px;padding:8px 10px">
            <div class="hint">入院前通知</div><div style="font-size:19px;font-weight:700;color:#d9820a">13</div></div>
          <div style="flex:1;background:#fbf5f5;border:1px solid #f3dcdc;border-radius:6px;padding:8px 10px">
            <div class="hint">发送失败</div><div style="font-size:19px;font-weight:700;color:#d64545">2</div></div>
        </div>
        <div class="hint" style="line-height:1.9">短信平台：中国移动云 MAS · 网关正常<br>失败自动重试 2 次，仍失败转人工电话通知并留痕</div>`)}
    </div>
  </div>`;
}

/* ---------- 7 入院前通知 ---------- */
function pageNotify(){
  const rows = [
    ['王建国','关节外科','2026-11-03 10:00','门诊手术室 2 间','138****7261','待发送'],
    ['陈志强','创伤骨科','2026-11-03 14:30','门诊手术室 2 间','139****5082','待发送'],
    ['张桂芳','关节外科','2026-11-03 14:30','门诊手术室 2 间','137****4437','待发送'],
    ['吴大海','运动医学科','2026-11-03 08:30','门诊手术室 1 间','135****9918','已发送'],
    ['赵文轩','足踝外科','2026-11-04 10:00','门诊手术室 1 间','136****3384','待发送']
  ].map(r=>`<tr><td><b>${r[0]}</b></td><td>${r[1]}</td><td class="num">${r[2]}</td><td>${r[3]}</td><td class="num">${r[4]}</td><td class="c">${statusTag(r[5]==='待发送'?'待通知':r[5])}</td><td class="c"><span class="link">发送</span></td></tr>`).join('');

  return `
  <div class="page-head">
    <div><div class="page-title"><span class="bar"></span>入院前通知</div>
      <div class="page-sub">入院前一天自动短信通知（提前天数参数化配置，默认 1 天） · 通知记录留痕、支持补发</div></div>
    <div class="page-actions">${btn('立即执行通知任务','primary','sms')}${btn('参数配置','','cog')}</div>
  </div>
  <div class="grid g-side">
    <div>
      ${card('通知任务配置', `
        <div class="form-grid c4">
          <div class="field"><label>提前通知天数</label><input class="inp" value="1" style="max-width:80px"><span class="hint">天</span></div>
          <div class="field"><label>发送时间</label><input class="inp" value="16:00"></div>
          <div class="field"><label>通知范围</label><select class="inp"><option selected>次日入院且评估通过</option><option>全部待入院患者</option></select></div>
          <div class="field"><label>重复发送</label><select class="inp"><option selected>不重复</option><option>允许重复</option></select></div>
        </div>
        <div class="hint" style="margin-top:10px">${ico('info',12)} 参数由系统管理员维护，修改后即时生效；今日任务将于 16:00 自动执行，当前待发送 <b style="color:#d9820a">8</b> 条</div>`)}
      ${card('待通知 / 已通知患者', `<table class="tb">
        <thead><tr><th>姓名</th><th>科室</th><th style="width:132px">手术时间</th><th style="width:132px">手术间</th><th style="width:104px">手机号</th><th class="c" style="width:78px">通知状态</th><th class="c" style="width:52px">操作</th></tr></thead>
        <tbody>${rows}</tbody></table>`, {tight:true, right:'共 5 条待处理'})}
    </div>
    <div>
      ${card('通知短信预览', `
        <div class="sms-bubble" style="font-size:12.3px">
          <div class="h" style="margin-bottom:6px"><span style="color:#0aa2a2">【四川省骨科医院】</span></div>
          王建国您好，您预约的膝关节镜手术将于明日（11 月 3 日）10:00 进行，请于今日 14:00 前到住院部一楼日间手术中心办理入院手续，入院前请空腹 8 小时，携带身份证、医保卡及既往检查资料。
        </div>
        <div class="hint" style="margin-top:9px;line-height:1.8">提前通知天数变更示例：设为 2 天时，将于 11 月 1 日发送同一模板。</div>`)}
      ${card('通知记录', `
        <div class="list-row" style="padding-left:0"><div><div class="t1">王建国 · 入院前通知</div><div class="t2">2026-11-01 16:20 · 已送达</div></div><div class="rt">${tag('成功','g')}</div></div>
        <div class="list-row" style="padding-left:0"><div><div class="t1">陈志强 · 入院前通知</div><div class="t2">2026-11-01 16:20 · 已送达</div></div><div class="rt">${tag('成功','g')}</div></div>
        <div class="list-row" style="padding-left:0"><div><div class="t1">张桂芳 · 入院前通知</div><div class="t2">2026-11-01 16:21 · 已送达</div></div><div class="rt">${tag('成功','g')}</div></div>
        <div class="list-row" style="padding-left:0;border-bottom:none"><div><div class="t1">吴大海 · 入院前通知</div><div class="t2">2026-11-01 16:21 · 补发 1 次</div></div><div class="rt">${tag('成功','g')}</div></div>`)}
    </div>
  </div>`;
}

/* ---------- 8 入院登记（▲条款 2） ---------- */
function pageAdmit(){
  const trans = [
    ['日间手术申请单','DZ20261102007','1 份','已调入'],
    ['术前检查检验项目及报告','7 项 / 7 份报告','全部','已转入'],
    ['专项储值金','2,800.00 元','转入住院储值金','已结转'],
    ['专科评估记录 / 麻醉评估记录','各 1 份','全部','已转入'],
    ['手术预约记录','2026-11-03 10:00—11:30','1 条','已转入']
  ].map((r,i)=>`<tr><td>${r[0]}</td><td class="mono">${r[1]}</td><td>${r[2]}</td><td class="c">${tag(r[3],'g')}</td></tr>`).join('');

  const logs = [
    ['10:12:06','HIS 入院登记接口','调入日间手术住院证','成功','186ms'],
    ['10:12:07','HIS 入院登记接口','生成住院号 ZY20261102481','成功','142ms'],
    ['10:12:08','HIS 储值金接口','专项储值金 2,800.00 转入住院储值金','成功','221ms'],
    ['10:12:09','HIS 入院登记接口','住院登记信息回写 HIS','成功','197ms'],
    ['10:12:10','院内集成平台','一致性校验（患者/费用/住院号）','一致','96ms']
  ].map(l=>`<div class="list-row" style="padding-left:0;padding-right:0">
      <div><div class="t1">${l[2]}</div><div class="t2">${l[1]} · ${l[0]} · 耗时 ${l[4]}</div></div>
      <div class="rt">${tag(l[3],'g')}</div></div>`).join('');

  return `
  <div class="page-head">
    <div><div class="page-title"><span class="bar"></span>入院登记 <span class="tag solid" style="margin-left:2px">▲ 条款 2</span></div>
      <div class="page-sub">调入日间手术住院证完成入院登记 · 与 HIS 入院登记系统一体化 · 申请、报告、储值金随患者转入住院</div></div>
    <div class="page-actions">${btn('扫码调入','','scan')}${btn('确认登记并回写 HIS','primary','ok')}</div>
  </div>
  ${card('', `<div class="card-bd" style="display:flex;gap:10px;align-items:center;padding:11px 14px">
      <span style="font-size:12.5px;color:#5b6b7f">住院证号</span>
      <input class="inp" style="width:210px" value="ZZ202611020088">
      ${btn('从 HIS 调入住院证','','refresh')}
      <span style="width:1px;height:20px;background:var(--line)"></span>
      <span class="hint">支持扫描住院证条码 / 刷身份证 / 输入住院证号调入</span>
      <span style="margin-left:auto;display:flex;align-items:center;gap:6px">${tag('HIS 已联通','g')}${tag('集成平台正常','g')}</span>
    </div>`, {tight:true})}
  <div style="height:12px"></div>
  ${patientBand()}
  <div style="height:12px"></div>
  <div class="grid g-side">
    <div>
      ${card('随患者转入住院的信息（自动带出，无需二次录入）', `<table class="tb">
        <thead><tr><th>转入项</th><th style="width:210px">内容 / 单号</th><th style="width:150px">数量</th><th class="c" style="width:82px">状态</th></tr></thead>
        <tbody>${trans}</tbody></table>`, {tight:true, right:'数据来源：HIS 住院证 + 本系统申请单'})}
      ${card('住院登记信息', `
        <div class="form-grid">
          <div class="field"><label>住院号</label><input class="inp readonly" value="ZY20261102481" readonly></div>
          <div class="field"><label>病区</label><select class="inp"><option selected>骨关节外科一病区（38 病区）</option><option>日间手术病区</option></select></div>
          <div class="field"><label>床位</label><select class="inp"><option selected>38-12</option><option>38-15</option><option>39-02</option></select></div>
          <div class="field"><label>入院日期</label><input class="inp" value="2026-11-02 10:12"></div>
          <div class="field"><label>入院诊断</label><input class="inp" value="右膝内侧半月板撕裂（S83.201）"></div>
          <div class="field"><label>护理级别</label><select class="inp"><option selected>二级护理</option><option>一级护理</option><option>三级护理</option></select></div>
          <div class="field"><label>主诊医师</label><input class="inp readonly" value="李国栋" readonly></div>
          <div class="field"><label>住院类型</label><input class="inp readonly" value="日间手术住院" readonly></div>
          <div class="field"><label>医保类型</label><select class="inp"><option selected>城镇职工医保</option><option>城乡居民医保</option><option>自费</option></select></div>
        </div>
        <div style="margin-top:12px;display:flex;gap:9px;align-items:center;border-top:1px dashed var(--line);padding-top:11px">
          <span class="hint">${ico('info',12)} 登记成功后将自动衔接手术安排与手术登记环节，HIS 侧实时可见</span>
          <span style="margin-left:auto;display:flex;gap:8px">${btn('打印住院证','','print')}${btn('保存','')}</span>
        </div>`)}
    </div>
    <div>
      ${card('HIS 一体化联动状态', `
        <div class="result-bar" style="margin-bottom:10px">${ico('ok',15)} 入院登记一体化成功 · 双方数据一致</div>
        ${logs}`)}
      ${card('一致性校验', `
        <table class="tb"><tbody>
          <tr><td style="color:#7b8fa3;width:104px">患者基本信息</td><td>一致</td><td class="c">${tag('通过','g')}</td></tr>
          <tr><td style="color:#7b8fa3">住院号 / 住院证</td><td>ZY20261102481</td><td class="c">${tag('通过','g')}</td></tr>
          <tr><td style="color:#7b8fa3">专项储值金</td><td>2,800.00 → 住院储值金</td><td class="c">${tag('通过','g')}</td></tr>
          <tr><td style="color:#7b8fa3">检查检验报告</td><td>7 份全部关联</td><td class="c">${tag('通过','g')}</td></tr>
        </tbody></table>`)}
    </div>
  </div>`;
}
