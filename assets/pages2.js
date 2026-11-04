/* ================= 页面：转普通入院 ~ 参数配置 ================= */

/* ---------- 9 转普通入院（▲条款 3） ---------- */
function pageTransfer(){
  const reasonOpts = ['术中探查需改为开放手术','术后出现并发症需继续住院治疗','病情变化需延长观察时间','合并症需专科会诊处理','患者及家属要求转普通住院'];
  const wayOpts = ['日间手术转普通住院','日间病区转专科病区','住院类型变更（日间→普通）'];

  return `
  <div class="page-head">
    <div><div class="page-title"><span class="bar"></span>转普通入院 <span class="tag solid" style="margin-left:2px">▲ 条款 3</span></div>
      <div class="page-sub">住院医生将日间手术住院患者转为普通住院患者 · 转住院原因与转住院方式字典化管理 · 记录完整可溯</div></div>
    <div class="page-actions">${btn('转为普通住院','primary','swap')}${btn('取消','')}</div>
  </div>
  ${patientBand({extra:tag('日间手术住院','b')})}
  <div style="height:12px"></div>
  <div class="grid g-side">
    <div>
      ${card('转普通住院登记', `
        <div class="form-grid c2">
          <div class="field"><label class="req">转住院原因</label>
            <select class="inp">${reasonOpts.map((r,i)=>`<option ${i===1?'selected':''}>${r}</option>`).join('')}</select></div>
          <div class="field"><label class="req">转住院方式</label>
            <select class="inp">${wayOpts.map((w,i)=>`<option ${i===0?'selected':''}>${w}</option>`).join('')}</select></div>
          <div class="field"><label>原住院类型</label><input class="inp readonly" value="日间手术住院" readonly></div>
          <div class="field"><label>变更后类型</label><input class="inp readonly" value="普通住院" readonly></div>
          <div class="field"><label class="req">转住院日期</label><input class="inp" value="2026-11-02 15:30"></div>
          <div class="field"><label>转入病区</label><select class="inp"><option selected>骨关节外科一病区（38 病区）</option><option>骨关节外科二病区</option></select></div>
          <div class="field"><label>床位</label><input class="inp" value="38-12"></div>
          <div class="field"><label>主诊医师</label><input class="inp readonly" value="李国栋" readonly></div>
        </div>
        <div style="margin-top:12px">
          <div class="hint" style="margin-bottom:6px">转住院说明（病程记录）</div>
          <textarea class="inp" style="width:100%;height:64px;padding:8px 9px;resize:none">患者今日行膝关节镜下半月板成形术，术中探查见内侧半月板后角桶柄状撕裂，行成形+缝合，术后出现膝关节腔积血，需继续住院观察引流及抗感染治疗，与患者家属沟通后同意转为普通住院继续治疗。</textarea>
        </div>
        <div style="margin-top:12px">
          <div class="hint" style="margin-bottom:6px">告知与签名</div>
          <div class="form-grid">
            <div class="field"><label>告知对象</label><select class="inp"><option selected>患者本人</option><option>家属（配偶）</option></select></div>
            <div class="field"><label>告知方式</label><select class="inp"><option selected>书面知情同意</option><option>口头告知并记录</option></select></div>
            <div class="field"><label>医师签名</label><input class="inp" value="李国栋"></div>
          </div>
        </div>
        <div class="alert b" style="margin-top:12px"><span class="ai">${ico('info',16)}</span><div class="t">
          转换完成后患者按普通住院流程管理：专项储值金、已发生的检查检验费用、转普通住院记录同步流转；日间手术路径自动终止并写入退出记录。</div></div>`)}
    </div>
    <div>
      ${card('当前住院信息', `
        <table class="tb"><tbody>
          <tr><td style="color:#7b8fa3;width:96px">住院号</td><td class="mono">${CUR.inp}</td></tr>
          <tr><td style="color:#7b8fa3">病区 / 床位</td><td>38 病区 / ${CUR.bed}</td></tr>
          <tr><td style="color:#7b8fa3">入院时间</td><td>2026-11-02 10:12</td></tr>
          <tr><td style="color:#7b8fa3">住院类型</td><td>${tag('日间手术住院','b')}</td></tr>
          <tr><td style="color:#7b8fa3">手术状态</td><td>${tag('已完成','gy')} 2026-11-02 10:40</td></tr>
          <tr><td style="color:#7b8fa3">已发生费用</td><td>3,978.00 元</td></tr>
          <tr><td style="color:#7b8fa3">储值金余额</td><td>1,622.00 元（转入住院储值金）</td></tr>
        </tbody></table>`)}
      ${card('转普通住院影响', `
        <div style="display:flex;flex-direction:column;gap:9px;font-size:12.5px">
          <div style="display:flex;gap:8px;align-items:flex-start"><span style="color:#0f9d63;margin-top:1px">${ico('ok',13)}</span><div>住院类型由「日间手术住院」变更为「普通住院」，医保结算路径同步切换</div></div>
          <div style="display:flex;gap:8px;align-items:flex-start"><span style="color:#0f9d63;margin-top:1px">${ico('ok',13)}</span><div>专项储值金及已发生费用自动结转，不重复计费</div></div>
          <div style="display:flex;gap:8px;align-items:flex-start"><span style="color:#0f9d63;margin-top:1px">${ico('ok',13)}</span><div>日间手术路径终止，写入退出记录（含操作人、时间、原因）</div></div>
          <div style="display:flex;gap:8px;align-items:flex-start"><span style="color:#0f9d63;margin-top:1px">${ico('ok',13)}</span><div>转普通住院记录可随病案归档，满足病历书写规范</div></div>
        </div>
        <div class="hint" style="margin-top:10px;border-top:1px dashed var(--line);padding-top:9px">字典维护：转住院原因 5 项、转住院方式 3 项，由系统管理员在【参数配置 · 字典管理】中维护</div>`)}
    </div>
  </div>`;
}

/* ---------- 10 手术安排 ---------- */
function pageSchedule(){
  const rooms = [
    {nm:'门诊手术室 1 间',list:[['08:30—10:00','膝关节镜下半月板成形术','王建国','李国栋','已完成'],['10:30—11:30','腕管综合征切开减压术','李秀兰','王海涛','手术中']]},
    {nm:'门诊手术室 2 间',list:[['09:10—11:00','桡骨远端骨折闭合复位内固定术','陈志强','陈立新','已完成'],['14:30—16:00','肩关节镜下肩袖修补术','张桂芳','刘晓峰','待手术']]},
    {nm:'门诊手术室 3 间',list:[['13:30—15:00','腰椎间盘突出椎间孔镜髓核摘除术','刘建华','赵敏','待手术'],['15:10—16:10','掌腱膜挛缩松解术','周雅琴','王海涛','待手术']]}
  ].map(r=>`<div class="card" style="flex:1">
      <div class="card-hd"><span class="ico"></span>${r.nm}<div class="right">${r.list.length} 台</div></div>
      <div class="card-bd" style="padding:8px 10px">
        ${r.list.map(x=>`<div style="border:1px solid var(--line);border-radius:6px;padding:8px 10px;margin-bottom:8px;background:${x[4]==='待手术'?'#fbfdff':'#fafcfd'}">
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:5px">
            <b style="font-size:12.5px">${x[0]}</b><span style="margin-left:auto">${statusTag(x[4])}</span></div>
          <div style="font-size:12.3px;color:#33475c;line-height:1.5">${x[1]}</div>
          <div class="hint" style="margin-top:3px">${x[2]} · 术者 ${x[3]}</div>
        </div>`).join('')}
        <div style="border:1px dashed #d9e3ee;border-radius:6px;padding:7px;text-align:center;color:#9aaabb;font-size:12px">+ 拖入患者安排手术</div>
      </div>
    </div>`).join('');

  return `
  <div class="page-head">
    <div><div class="page-title"><span class="bar"></span>手术安排</div>
      <div class="page-sub">手术台次、日期时间、术间、手术医生排班 · 安排信息与预约信息不一致时自动识别并通知患者（短信 / 电话）</div></div>
    <div class="page-actions">${btn('通知记录','','sms')}${btn('保存排班','primary','save')}</div>
  </div>
  ${A.orange('系统自动识别到 1 例手术安排变动，需通知患者确认',
    '陈志强（住院号 ZY20261102455）：预约信息为 2026-11-03 10:00 / 门诊手术室 1 间，现有安排为 2026-11-03 14:30 / 门诊手术室 2 间。<b>时间变更 + 术间变更</b>，系统已生成变动通知待办。')}
  <div style="height:12px"></div>
  <div style="display:flex;gap:12px;align-items:flex-start">${rooms}</div>
  <div style="height:12px"></div>
  <div class="grid g-side">
    ${card('变动通知处置', `
      <table class="tb">
        <thead><tr><th>患者</th><th style="width:120px">预约信息</th><th style="width:120px">安排信息</th><th style="width:120px">差异项</th><th class="c" style="width:72px">状态</th><th class="c" style="width:120px">操作</th></tr></thead>
        <tbody>
          <tr><td><b>陈志强</b></td><td>11-03 10:00 / 1 间</td><td>11-03 14:30 / 2 间</td><td>${tag('时间 + 术间','r')}</td><td class="c">${tag('待通知','o')}</td>
            <td class="c"><span class="link">短信通知</span> · <span class="link">电话通知</span></td></tr>
          <tr><td><b>张桂芳</b></td><td>11-03 14:30 / 2 间</td><td>11-03 14:30 / 2 间</td><td>无差异</td><td class="c">${tag('已一致','g')}</td><td class="c"><span class="link">查看</span></td></tr>
        </tbody>
      </table>`, {tight:true, right:'通知内容自动携带最新安排信息'})}
    ${card('通知留痕', `
      <div class="list-row" style="padding-left:0"><div><div class="t1">短信通知 · 陈志强</div><div class="t2">2026-11-01 15:43 · 已送达 139****5082</div></div><div class="rt">${tag('成功','g')}</div></div>
      <div class="list-row" style="padding-left:0;border-bottom:none"><div><div class="t1">电话通知 · 陈志强</div><div class="t2">2026-11-01 15:50 · 通话 42 秒 · 何静</div></div><div class="rt">${tag('已确认','g')}</div></div>`)}
  </div>`;
}

/* ---------- 11 手术登记 ---------- */
function pageCheckin(){
  const drugs = [
    ['盐酸罗哌卡因注射液','100mg/10ml','15mg','蛛网膜下腔注射'],
    ['枸橼酸舒芬太尼注射液','50μg/1ml','5μg','蛛网膜下腔注射'],
    ['注射用头孢呋辛钠','1.5g','1.5g','静脉滴注（术前 30 分钟）']
  ].map(d=>`<tr><td>${d[0]}</td><td class="mono">${d[1]}</td><td class="num">${d[2]}</td><td>${d[3]}</td></tr>`).join('');

  return `
  <div class="page-head">
    <div><div class="page-title"><span class="bar"></span>手术登记</div>
      <div class="page-sub">扫申请单条码 / 刷医保卡·就诊卡·身份证 / 手工输入病历号或申请单号报到 · 查看报告与术中药品 · 打印知情同意书</div></div>
    <div class="page-actions">${btn('打印手术知情同意书','primary','print')}</div>
  </div>
  ${card('', `<div class="card-bd" style="display:flex;gap:10px;align-items:center;padding:11px 14px">
      <span class="chk-chip on">${ico('scan',12)} 扫申请单条码</span>
      <span class="chk-chip">刷医保卡</span><span class="chk-chip">刷就诊卡</span><span class="chk-chip">刷身份证</span>
      <span class="chk-chip">手工输入病历号</span><span class="chk-chip">手工输入申请单号</span>
      <span style="width:1px;height:20px;background:var(--line);margin:0 4px"></span>
      <input class="inp" style="width:230px" value="DZ20261102007" placeholder="扫码后自动填入">
      ${btn('报到登记','primary','ok')}
      <span class="hint" style="margin-left:auto">设备：扫码枪（USB-HID）已连接 · 读卡器已连接</span>
    </div>`, {tight:true})}
  <div style="height:12px"></div>
  ${patientBand({extra:tag('已报到','g')})}
  <div style="height:12px"></div>
  <div class="grid g-side">
    <div>
      ${card('术前检查检验报告', `<table class="tb">
        <thead><tr><th>项目名称</th><th style="width:150px">报告时间</th><th style="width:130px">结论</th><th class="c" style="width:72px">操作</th></tr></thead>
        <tbody>
          <tr><td>血常规（五分类）</td><td class="num">2026-10-30 10:05</td><td>未见明显异常</td><td class="c"><span class="link">查看</span></td></tr>
          <tr><td>凝血四项</td><td class="num">2026-10-30 10:05</td><td>凝血功能基本正常</td><td class="c"><span class="link">查看</span></td></tr>
          <tr><td>心电图（十二导联）</td><td class="num">2026-10-30 09:25</td><td>窦性心律，大致正常</td><td class="c"><span class="link">查看</span></td></tr>
          <tr><td>右膝关节 MRI（3.0T）</td><td class="num">2026-10-31 09:40</td><td>内侧半月板Ⅲ度撕裂</td><td class="c"><span class="link">查看</span></td></tr>
        </tbody></table>`, {tight:true, right:'共 7 份 · 全部已回传'})}
      ${card('术中药品（麻醉药 / 抗菌药）', `<table class="tb">
        <thead><tr><th>药品名称</th><th style="width:110px">规格</th><th style="width:80px">剂量</th><th style="width:190px">给药途径</th></tr></thead>
        <tbody>${drugs}</tbody></table>`, {tight:true, right:'来源：手术医嘱 · 费用已记账'})}
    </div>
    <div>
      ${card('报到信息', `
        <table class="tb"><tbody>
          <tr><td style="color:#7b8fa3;width:88px">报到时间</td><td>2026-11-02 08:12</td></tr>
          <tr><td style="color:#7b8fa3">报到方式</td><td>扫申请单条码</td></tr>
          <tr><td style="color:#7b8fa3">报到护士</td><td>何静</td></tr>
          <tr><td style="color:#7b8fa3">手术间 / 台次</td><td>1 间 / 第 1 台</td></tr>
          <tr><td style="color:#7b8fa3">术前核对</td><td>${tag('已核对','g')} 身份·术式·部位·过敏史</td></tr>
        </tbody></table>
        <div style="margin-top:10px">${btn('打印知情同意书（套打模板）','','print')}</div>`)}
      ${card('今日报到统计', `
        <div style="display:flex;gap:10px">
          <div style="flex:1;background:#f6faf8;border:1px solid #dcefe4;border-radius:6px;padding:8px 10px">
            <div class="hint">已报到</div><div style="font-size:19px;font-weight:700;color:#0f9d63">6</div></div>
          <div style="flex:1;background:#fdf9f4;border:1px solid #f3e3cc;border-radius:6px;padding:8px 10px">
            <div class="hint">未报到</div><div style="font-size:19px;font-weight:700;color:#d9820a">2</div></div>
        </div>
        <div class="hint" style="margin-top:9px;line-height:1.9">未报到患者将于 09:30 自动短信提醒；超时未到转日间手术中心电话确认。</div>`)}
    </div>
  </div>`;
}

/* ---------- 12 手术费用（▲条款 4） ---------- */
function pageFee(){
  const rows = GROUPS['关节镜手术组套'].map(r=>`<tr>
    <td class="mono">${r.code}</td><td>${r.nm}</td><td>${r.spec}</td>
    <td class="r num">${money(r.price)}</td><td class="c num">${r.qty}</td>
    <td class="r num">${money(r.price*r.qty)}</td><td class="c"><span class="link">删除</span></td></tr>`).join('');

  return `
  <div class="page-head">
    <div><div class="page-title"><span class="bar"></span>手术费用 <span class="tag solid" style="margin-left:2px">▲ 条款 4</span></div>
      <div class="page-sub">手术室补录手术费用 · 支持调入手术费用常用组套批量带出项目与标准 · 补录完成即时进入住院费用清单</div></div>
    <div class="page-actions">${btn('保存并提交','primary','save')}${btn('打印费用清单','','print')}</div>
  </div>
  ${patientBand({extra:tag('术中','o')})}
  <div style="height:12px"></div>
  <div class="grid g-side">
    <div>
      ${card('补录手术费用', `
        <div style="display:flex;gap:9px;align-items:flex-end;flex-wrap:wrap">
          <div class="field" style="flex:0 0 auto"><label style="flex:0 0 62px">项目名称</label><input class="inp" style="width:250px" value="膝关节镜下半月板成形术"></div>
          <div class="field" style="flex:0 0 auto"><label style="flex:0 0 44px">规格</label><input class="inp" style="width:70px" value="例"></div>
          <div class="field" style="flex:0 0 auto"><label style="flex:0 0 44px">单价</label><input class="inp" style="width:84px" value="2400.00"></div>
          <div class="field" style="flex:0 0 auto"><label style="flex:0 0 44px">数量</label><input class="inp" style="width:56px" value="1"></div>
          ${btn('添加','','plus')}
          <span style="width:1px;height:22px;background:var(--line);margin:0 2px"></span>
          <div class="field" style="flex:0 0 auto"><label style="flex:0 0 62px">常用组套</label>
            <select class="inp" style="width:170px" id="grpSel">
              <option>关节镜手术组套</option><option>日间手术基础组套</option><option>麻醉耗材组套</option>
            </select></div>
          <button class="btn teal" onclick="loadGroup()">${ico('down',13)}调入常用组套</button>
        </div>
        <div class="hint" style="margin-top:9px">${ico('info',12)} 调入组套后自动带出项目编码、名称、规格、单价，可修改数量；费用数据与 HIS 收费结算直接衔接</div>`, {right:'补录人：手术室 · 唐雪梅'})}
      ${card('已补录费用明细', `<table class="tb">
        <thead><tr><th style="width:96px">项目编码</th><th>项目名称</th><th style="width:80px">规格</th><th class="r" style="width:88px">单价(元)</th><th class="c" style="width:58px">数量</th><th class="r" style="width:92px">金额(元)</th><th class="c" style="width:58px">操作</th></tr></thead>
        <tbody id="feeBody">${rows}</tbody>
        <tfoot><tr><td colspan="5">合计 5 项</td><td class="r num">4,840.00</td><td></td></tr></tfoot></table>`, {tight:true, right:'组套：关节镜手术组套（5 项）'})}
    </div>
    <div>
      ${card('费用汇总', `
        <table class="tb"><tbody>
          <tr><td style="color:#7b8fa3;width:104px">术前门诊费用</td><td class="r num">1,178.00</td></tr>
          <tr><td style="color:#7b8fa3">本次手术费用</td><td class="r num">4,840.00</td></tr>
          <tr><td style="color:#7b8fa3">麻醉费用</td><td class="r num">480.00</td></tr>
          <tr><td style="color:#7b8fa3">耗材费用</td><td class="r num">2,260.00</td></tr>
          <tr style="background:#f6fafd"><td style="font-weight:700">住院费用合计</td><td class="r num" style="font-weight:700;font-size:14px;color:#1b6fc4">8,758.00</td></tr>
        </tbody></table>`)}
      ${card('HIS 收费衔接', `
        <div class="result-bar" style="margin-bottom:9px">${ico('ok',15)} 已同步至 HIS 费用清单</div>
        <div class="list-row" style="padding-left:0"><div><div class="t1">费用写入 HIS 住院费用</div><div class="t2">10:52:18 · 5 条明细 · 成功</div></div><div class="rt">${tag('成功','g')}</div></div>
        <div class="list-row" style="padding-left:0"><div><div class="t1">医保项目对照</div><div class="t2">按医保编码自动对照 · 自付比例 0%</div></div><div class="rt">${tag('已对照','g')}</div></div>
        <div class="list-row" style="padding-left:0;border-bottom:none"><div><div class="t1">住院储值金扣减</div><div class="t2">可用 1,622.00 元 · 不足部分出院结算</div></div><div class="rt">${tag('待结算','o')}</div></div>`)}
    </div>
  </div>`;
}

/* ---------- 13 手术医嘱（▲条款 5） ---------- */
function pageOrder(){
  const rows = [
    ['临时','丙泊酚中/长链脂肪乳注射液','200mg/20ml','150mg','静脉注射','术中','诱导'],
    ['临时','枸橼酸舒芬太尼注射液','50μg/1ml','20μg','静脉注射','术中','诱导'],
    ['临时','注射用苯磺顺阿曲库铵','10mg','8mg','静脉注射','术中','诱导'],
    ['临时','盐酸右美托咪定注射液','200μg/2ml','40μg','静脉泵入','术中','维持'],
    ['临时','盐酸罗哌卡因注射液','100mg/10ml','15mg','蛛网膜下腔注射','术中一次','麻醉'],
    ['长期','注射用头孢呋辛钠','1.5g','1.5g','静脉滴注','bid','抗感染']
  ].map(r=>`<tr><td class="c">${tag(r[0], r[0]==='临时'?'b':'t')}</td><td><b>${r[1]}</b></td><td class="mono">${r[2]}</td>
    <td class="num">${r[3]}</td><td>${r[4]}</td><td>${r[5]}</td><td>${r[6]}</td><td class="c"><span class="link">删除</span></td></tr>`).join('');

  return `
  <div class="page-head">
    <div><div class="page-title"><span class="bar"></span>手术医嘱 <span class="tag solid" style="margin-left:2px">▲ 条款 5</span></div>
      <div class="page-sub">手术室补录手术医嘱 · 至少包括术中麻醉药 · 支持常用医嘱模板一键带出 · 与病案、费用衔接</div></div>
    <div class="page-actions">${btn('保存并提交','primary','save')}${btn('打印医嘱单','','print')}</div>
  </div>
  ${patientBand({extra:tag('术中','o')})}
  <div style="height:12px"></div>
  <div class="grid g-side">
    <div>
      ${card('补录手术医嘱', `
        <div style="display:flex;gap:9px;align-items:flex-end;flex-wrap:wrap">
          <div class="field" style="flex:0 0 auto"><label style="flex:0 0 44px">类型</label>
            <select class="inp" style="width:76px"><option>临时</option><option>长期</option></select></div>
          <div class="field" style="flex:0 0 auto"><label style="flex:0 0 62px">药品名称</label><input class="inp" style="width:240px" value="盐酸罗哌卡因注射液"></div>
          <div class="field" style="flex:0 0 auto"><label style="flex:0 0 44px">剂量</label><input class="inp" style="width:74px" value="15mg"></div>
          <div class="field" style="flex:0 0 auto"><label style="flex:0 0 44px">用法</label>
            <select class="inp" style="width:132px"><option>蛛网膜下腔注射</option><option>静脉注射</option><option>静脉滴注</option><option>静脉泵入</option></select></div>
          <div class="field" style="flex:0 0 auto"><label style="flex:0 0 44px">频次</label><input class="inp" style="width:70px" value="术中一次"></div>
          ${btn('添加','','plus')}
          <span style="width:1px;height:22px;background:var(--line);margin:0 2px"></span>
          <div class="field" style="flex:0 0 auto"><label style="flex:0 0 62px">医嘱模板</label>
            <select class="inp" style="width:172px"><option>全身麻醉医嘱模板</option><option selected>椎管内麻醉医嘱模板</option></select></div>
          <button class="btn teal" onclick="toast('已按模板带出 4 条医嘱')">${ico('down',13)}一键带出</button>
        </div>
        <div class="hint" style="margin-top:9px">${ico('info',12)} 医嘱模板由系统管理员维护，覆盖麻醉诱导、维持、辅助用药与抗感染用药，减少手工录入</div>`, {right:'补录人：麻醉医师 · 周文斌'})}
      ${card('手术医嘱明细', `<table class="tb">
        <thead><tr><th class="c" style="width:56px">类型</th><th>药品名称</th><th style="width:100px">规格</th><th style="width:66px">剂量</th><th style="width:132px">用法</th><th style="width:76px">频次</th><th style="width:72px">时机</th><th class="c" style="width:52px">操作</th></tr></thead>
        <tbody>${rows}</tbody></table>`, {tight:true, right:'共 6 条 · 含术中麻醉药 5 条'})}
    </div>
    <div>
      ${card('麻醉药核对', `
        <div class="result-bar" style="margin-bottom:10px">${ico('ok',15)} 术中麻醉药记录完整</div>
        <table class="tb"><tbody>
          <tr><td style="color:#7b8fa3;width:104px">全身麻醉药</td><td>丙泊酚、舒芬太尼、顺阿曲库铵</td></tr>
          <tr><td style="color:#7b8fa3">局部麻醉药</td><td>罗哌卡因</td></tr>
          <tr><td style="color:#7b8fa3">肌肉松弛剂</td><td>苯磺顺阿曲库铵</td></tr>
          <tr><td style="color:#7b8fa3">辅助用药</td><td>右美托咪定、地塞米松</td></tr>
          <tr><td style="color:#7b8fa3">抗菌药</td><td>头孢呋辛（术前 30 分钟）</td></tr>
        </tbody></table>
        <div class="hint" style="margin-top:9px">符合手术安全核查与病历书写规范要求</div>`)}
      ${card('下游衔接', `
        <div class="list-row" style="padding-left:0"><div><div class="t1">病案首页 · 麻醉记录</div><div class="t2">医嘱数据自动归集至麻醉记录单</div></div><div class="rt">${tag('已归集','g')}</div></div>
        <div class="list-row" style="padding-left:0"><div><div class="t1">费用 · 药品记账</div><div class="t2">6 条医嘱对应药品已记账 486.00 元</div></div><div class="rt">${tag('已记账','g')}</div></div>
        <div class="list-row" style="padding-left:0;border-bottom:none"><div><div class="t1">手术护理记录</div><div class="t2">术中用药与护理记录自动核对</div></div><div class="rt">${tag('一致','g')}</div></div>`)}
    </div>
  </div>`;
}

/* ---------- 14 手术管理 ---------- */
function pageManage(){
  const tabs = [['未安排',12,'cur'],['已安排',18,''],['已完成',34,'']].map(t=>`
    <div style="padding:7px 16px;border-radius:5px;font-size:12.8px;cursor:pointer;${t[2]==='cur'?'background:#1b6fc4;color:#fff;font-weight:600':'color:#5b6b7f'}">${t[0]} <b style="margin-left:4px">${t[1]}</b></div>`).join('');

  const rows = P.slice(0,7).map((x,i)=>`<tr ${i===0?'class="sel"':''}>
    <td><b>${x.name}</b><div class="hint">${x.sex} · ${x.age}岁</div></td>
    <td class="mono">${x.apply}</td><td>${x.dept}</td><td>${x.op}</td>
    <td>${x.anes}</td><td class="num">${i%2?'2026-11-04 10:00':'2026-11-03 14:30'}</td>
    <td class="c">${statusTag(i<3?'待手术':'待评估')}</td>
    <td class="c"><span class="link">安排手术</span> · <span class="link">详情</span></td></tr>`).join('');

  return `
  <div class="page-head">
    <div><div class="page-title"><span class="bar"></span>手术管理</div>
      <div class="page-sub">手术患者集中管理 · 按未安排 / 已安排 / 已完成检索 · 按业务权限操作，防止越权</div></div>
    <div class="page-actions">${btn('导出列表','','down')}${btn('刷新','','refresh')}</div>
  </div>
  <div class="card"><div class="card-bd" style="padding:9px 12px;display:flex;gap:8px;align-items:center">
    ${tabs}
    <span style="margin-left:auto;display:flex;gap:8px;align-items:center">
      <input class="inp" style="width:190px" placeholder="住院号 / 床号 / 姓名">
      <select class="inp" style="width:130px"><option>全部科室</option>${DEPTS.map(d=>`<option>${d}</option>`).join('')}</select>
      ${btn('查询','primary','search')}
    </span>
  </div></div>
  <div style="height:12px"></div>
  <div class="grid g-side">
    <div>
      ${card('手术患者列表 · 未安排（12 例）', `<table class="tb">
        <thead><tr><th style="width:96px">患者</th><th style="width:112px">申请单号</th><th style="width:110px">科室</th><th>手术名称</th><th style="width:110px">麻醉方式</th><th style="width:132px">预约时间</th><th class="c" style="width:80px">状态</th><th class="c" style="width:120px">操作</th></tr></thead>
        <tbody>${rows}</tbody></table>`, {tight:true, right:'第 1 页 / 共 2 页'})}
    </div>
    <div>
      ${card('业务权限提示', A.blue('当前角色：日间手术中心 · 张敏','「未安排」由日间手术中心与手术室操作；「已安排」由手术室操作；「已完成」仅可查询与统计。').replace('class="alert b"','class="alert b" style="border:none;background:#f5f9fe"'))}
      ${card('状态统计', `
        <table class="tb"><tbody>
          <tr><td style="color:#7b8fa3;width:96px">未安排</td><td class="r num"><b>12</b> 例</td><td style="width:90px"><div class="prog o"><i style="width:32%"></i></div></td></tr>
          <tr><td style="color:#7b8fa3">已安排</td><td class="r num"><b>18</b> 例</td><td><div class="prog"><i style="width:48%"></i></div></td></tr>
          <tr><td style="color:#7b8fa3">已完成</td><td class="r num"><b>34</b> 例</td><td><div class="prog g"><i style="width:90%"></i></div></td></tr>
        </tbody></table>
        <div class="hint" style="margin-top:9px">今日台次利用率 86%，平均手术时长 52 分钟</div>`)}
    </div>
  </div>`;
}

/* ---------- 15 手术查询 ---------- */
function pageQuery(){
  const rows = [
    ['ZY20261102481','38-12','王建国','膝关节镜下半月板成形术','李国栋','椎管内麻醉','2026-11-02','已完成'],
    ['ZY20261102455','36-05','陈志强','桡骨远端骨折闭合复位内固定术','陈立新','臂丛神经阻滞','2026-11-02','已完成'],
    ['ZY20261102442','42-11','张桂芳','肩关节镜下肩袖修补术','刘晓峰','全身麻醉','2026-11-02','待手术'],
    ['ZY20261102470','39-03','吴大海','踝关节镜下清理术','孙志刚','椎管内麻醉','2026-11-01','已完成'],
    ['ZY20261102431','37-08','何俊','锁骨骨折切开复位内固定术','李国栋','全身麻醉','2026-11-01','已完成'],
    ['ZY20261102418','41-05','徐小梅','腱鞘囊肿切除术','陈立新','局部麻醉','2026-10-31','已完成']
  ].map(r=>`<tr><td class="mono">${r[0]}</td><td>${r[1]}</td><td><b>${r[2]}</b></td><td>${r[3]}</td><td>${r[4]}</td><td>${r[5]}</td>
    <td class="num">${r[6]}</td><td class="c">${statusTag(r[7]==='待手术'?'待手术':'已完成')}</td><td class="c"><span class="link">查看</span></td></tr>`).join('');

  const bars = [['创伤骨科',42,38],['关节外科',58,46],['脊柱外科',26,21],['手外科',34,30],['足踝外科',18,14],['运动医学',22,19]]
    .map(b=>`<div class="bar-col">
      <div style="font-size:11px;color:#7b8fa3;margin-bottom:4px">${b[1]+b[2]}</div>
      <div class="bar-stack" style="height:${Math.round((b[1]+b[2])*1.5)}px">
        <div class="bar" style="height:${Math.round(b[1]*1.5*0.6)}px"></div>
        <div class="bar b2" style="height:${Math.round(b[1]*1.5*0.4)}px"></div>
      </div>
      <div class="bar-x">${b[0]}</div></div>`).join('');

  return `
  <div class="page-head">
    <div><div class="page-title"><span class="bar"></span>手术查询</div>
      <div class="page-sub">按住院号码 / 床号 / 姓名组合检索 · 手术统计、麻醉统计、术后统计报表，支持科室、医生、护士维度与导出</div></div>
    <div class="page-actions">${btn('导出 Excel','','down')}${btn('打印报表','','print')}</div>
  </div>
  ${card('', `<div class="card-bd" style="display:flex;gap:10px;align-items:center;padding:11px 14px">
      <div class="field" style="flex:0 0 auto"><label style="flex:0 0 52px">住院号</label><input class="inp" style="width:150px" value="ZY20261102481"></div>
      <div class="field" style="flex:0 0 auto"><label style="flex:0 0 40px">床号</label><input class="inp" style="width:80px"></div>
      <div class="field" style="flex:0 0 auto"><label style="flex:0 0 40px">姓名</label><input class="inp" style="width:110px"></div>
      <div class="field" style="flex:0 0 auto"><label style="flex:0 0 68px">手术日期</label><input class="inp" style="width:120px" value="2026-10-01"> — <input class="inp" style="width:120px" value="2026-11-02"></div>
      ${btn('查询','primary','search')}${btn('重置','')}
      <span class="hint" style="margin-left:auto">查询响应 0.6 秒 · 支持多条件组合</span>
    </div>`, {tight:true})}
  <div style="height:12px"></div>
  <div class="grid g-side">
    <div>
      ${card('日间手术信息', `<table class="tb">
        <thead><tr><th style="width:118px">住院号</th><th style="width:56px">床号</th><th style="width:70px">姓名</th><th>手术名称</th><th style="width:66px">术者</th><th style="width:100px">麻醉方式</th><th style="width:96px">手术日期</th><th class="c" style="width:74px">状态</th><th class="c" style="width:52px">操作</th></tr></thead>
        <tbody>${rows}</tbody></table>`, {tight:true, right:'共 87 条 · 当前显示 6 条'})}
      ${card('统计维度', `
        <div style="display:flex;gap:8px">
          <span class="chk-chip on">全部科室</span><span class="chk-chip">按医生</span><span class="chk-chip">按护士</span>
          <span style="margin-left:auto">${btn('手术统计','sm','')}${btn('麻醉统计','sm','')}${btn('术后统计','sm','')}</span>
        </div>`)}
    </div>
    <div>
      ${card('手术统计（近 30 日 · 按科室）', `
        <div class="bars" style="height:124px">${bars}</div>
        <div class="legend"><span><i style="background:#2f7fc4"></i>日间手术</span><span><i style="background:#25a5a5"></i>转为普通住院</span></div>
        <table class="tb" style="margin-top:6px"><tbody>
          <tr><td style="color:#7b8fa3;width:104px">手术总量</td><td class="r num"><b>200</b> 台</td></tr>
          <tr><td style="color:#7b8fa3">麻醉例数</td><td class="r num"><b>168</b> 例（84%）</td></tr>
          <tr><td style="color:#7b8fa3">转普通住院</td><td class="r num"><b>12</b> 例（6.0%）</td></tr>
          <tr><td style="color:#7b8fa3">平均术前等待</td><td class="r num">0.4 天</td></tr>
          <tr><td style="color:#7b8fa3">退出日间路径</td><td class="r num">7 例（3.5%）</td></tr>
        </tbody></table>`)}
    </div>
  </div>`;
}

/* ---------- 16 退出日间手术 ---------- */
function pageQuit(){
  const opts = QUIT_REASON.map((r,i)=>`<option ${i===0?'selected':''}>${r}</option>`).join('');
  return `
  <div class="page-head">
    <div><div class="page-title"><span class="bar"></span>退出日间手术</div>
      <div class="page-sub">麻醉评估未通过、患者电话告知不来手术等情形，由日间手术中心退出日间路径 · 选择退出原因 · 自动衔接门诊结算</div></div>
    <div class="page-actions">${btn('确认退出','danger','exit')}${btn('取消','')}</div>
  </div>
  ${patientBand({extra:tag('待退出','o')})}
  <div style="height:12px"></div>
  <div class="grid g-side">
    <div>
      ${A.orange('退出前请确认已完成信息核对','退出日间路径后，患者将不再进入手术安排与入院流程，已执行检查检验费用按门诊规则核销，余额原路退回。')}
      <div style="height:12px"></div>
      ${card('退出登记', `
        <div class="form-grid c2">
          <div class="field"><label class="req">退出原因</label><select class="inp">${opts}</select></div>
          <div class="field"><label class="req">退出日期</label><input class="inp" value="2026-11-02"></div>
          <div class="field"><label>告知方式</label><select class="inp"><option>电话告知日间手术中心</option><option>现场办理</option><option>短信回复</option></select></div>
          <div class="field"><label>评估环节</label><input class="inp readonly" value="麻醉评估（未通过）" readonly></div>
          <div class="field"><label>操作人</label><input class="inp readonly" value="日间手术中心 · 张敏" readonly></div>
          <div class="field"><label>联系电话</label><input class="inp" value="138****7261"></div>
        </div>
        <div style="margin-top:12px"><div class="hint" style="margin-bottom:6px">退出说明</div>
          <textarea class="inp" style="width:100%;height:52px;padding:8px 9px;resize:none">麻醉评估 ASA Ⅲ 级，合并重度睡眠呼吸暂停，日间手术风险较高，经与患者及家属沟通，改为普通住院择期手术。</textarea></div>`)}
      ${card('资金结算预览（自动衔接）', `<table class="tb">
        <thead><tr><th>项目</th><th class="r" style="width:130px">金额(元)</th><th style="width:180px">说明</th></tr></thead>
        <tbody>
          <tr><td>专项储值金冻结金额</td><td class="r num">2,800.00</td><td>充值后全额冻结</td></tr>
          <tr><td>已发生检查检验费用</td><td class="r num">1,178.00</td><td>按门诊规则核销</td></tr>
          <tr><td>应退余额</td><td class="r num" style="color:#0f9d63;font-weight:700">1,622.00</td><td>原支付渠道退回</td></tr>
        </tbody>
        <tfoot><tr><td>结算结果</td><td class="r num">1,622.00</td><td>生成结算流水 SK20261102012</td></tr></tfoot></table>`, {tight:true, right:'结算方式：门诊结算（原路退回）'})}
    </div>
    <div>
      ${card('退出流程', `<div style="padding-top:4px">${steps(['退出申请','原因确认','资金结算','资源释放'],1)}</div>`)}
      ${card('资源释放', `
        <div class="list-row" style="padding-left:0"><div><div class="t1">手术间 / 台次</div><div class="t2">门诊手术室 2 间 · 11-03 10:00 第 2 台</div></div><div class="rt">${tag('已释放','g')}</div></div>
        <div class="list-row" style="padding-left:0"><div><div class="t1">床位预占</div><div class="t2">38 病区 38-12</div></div><div class="rt">${tag('已释放','g')}</div></div>
        <div class="list-row" style="padding-left:0;border-bottom:none"><div><div class="t1">短信通知</div><div class="t2">向患者发送退出确认短信</div></div><div class="rt">${tag('待发送','o')}</div></div>`)}
      ${card('退出记录留痕', `
        <div class="hint" style="line-height:2">操作人：张敏（日间手术中心）<br>操作时间：2026-11-02 11:02:35<br>操作内容：退出日间路径 + 门诊结算<br>退出原因：麻醉评估未通过<br>结果：成功 · 已写入退出记录表</div>`)}
    </div>
  </div>`;
}

/* ---------- 17 参数配置 ---------- */
function pageConfig(){
  return `
  <div class="page-head">
    <div><div class="page-title"><span class="bar"></span>参数配置</div>
      <div class="page-sub">业务参数界面化配置 · 字典管理 · 角色权限 · 配置即时生效，无需二次开发</div></div>
    <div class="page-actions">${btn('保存配置','primary','save')}</div>
  </div>
  <div class="grid g-side-l">
    <div>
      ${card('参数分类', `
        <div style="display:flex;flex-direction:column;gap:2px">
          ${['业务参数','麻醉评估流程','字典管理','角色权限','短信模板'].map((x,i)=>`
            <div style="padding:8px 10px;border-radius:5px;font-size:12.5px;${i===0?'background:#eaf2fd;color:#155a9e;font-weight:600':'color:#4a5d73'}">${x}</div>`).join('')}
        </div>`)}
      ${card('配置变更记录', `
        <div class="list-row" style="padding-left:0"><div><div class="t1">入院前提前通知天数 2 → 1</div><div class="t2">系统管理员 · 2026-10-20 09:12</div></div></div>
        <div class="list-row" style="padding-left:0;border-bottom:none"><div><div class="t1">麻醉评估流程新增「气道评估」环节</div><div class="t2">系统管理员 · 2026-10-18 15:40</div></div></div>`)}
    </div>
    <div>
      ${card('业务参数', `<table class="tb">
        <thead><tr><th style="width:210px">参数名称</th><th style="width:130px">当前值</th><th>说明</th><th class="c" style="width:64px">操作</th></tr></thead>
        <tbody>
          <tr><td>入院前通知提前天数</td><td><b>1</b> 天</td><td>默认提前 1 天自动发送入院通知短信</td><td class="c"><span class="link">修改</span></td></tr>
          <tr><td>口服抗凝剂停药天数</td><td><b>7</b> 天</td><td>停药不足该天数自动拦截日间手术申请</td><td class="c"><span class="link">修改</span></td></tr>
          <tr><td>入院前通知发送时间</td><td><b>16:00</b></td><td>定时任务每日执行时间</td><td class="c"><span class="link">修改</span></td></tr>
          <tr><td>预约成功短信发送时机</td><td>预约完成时</td><td>可配置为预约完成时或次日 09:00</td><td class="c"><span class="link">修改</span></td></tr>
          <tr><td>手术安排一致性校验</td><td>开启</td><td>安排与预约不一致时自动生成通知待办</td><td class="c"><span class="link">修改</span></td></tr>
          <tr><td>短信失败重试次数</td><td>2 次</td><td>失败后转人工电话通知并留痕</td><td class="c"><span class="link">修改</span></td></tr>
        </tbody></table>`, {tight:true, right:'参数修改即时生效'})}
      ${card('麻醉评估流程配置', `
        <div class="hint" style="margin-bottom:9px">医院可按自身管理要求配置评估环节、评估顺序、表单字段及必填项</div>
        <table class="tb">
          <thead><tr><th class="c" style="width:52px">顺序</th><th style="width:160px">评估环节</th><th style="width:120px">执行角色</th><th style="width:90px">必填项</th><th>表单字段</th><th class="c" style="width:64px">操作</th></tr></thead>
          <tbody>
            <tr><td class="c">1</td><td>术前访视</td><td>护士 / 医师</td><td>6 项</td><td>生命体征、过敏史、既往史、用药史</td><td class="c"><span class="link">配置</span></td></tr>
            <tr><td class="c">2</td><td>气道评估</td><td>麻醉医师</td><td>4 项</td><td>Mallampati 分级、张口度、甲颏距离、颈椎活动度</td><td class="c"><span class="link">配置</span></td></tr>
            <tr><td class="c">3</td><td>麻醉风险分级</td><td>麻醉医师</td><td>3 项</td><td>ASA 分级、合并症、麻醉计划</td><td class="c"><span class="link">配置</span></td></tr>
            <tr><td class="c">4</td><td>评估结论</td><td>麻醉医师</td><td>必填</td><td>通过 / 不通过、原因</td><td class="c"><span class="link">配置</span></td></tr>
          </tbody></table>`, {tight:true, right:'<span class="link">+ 新增环节</span>'})}
      ${card('角色权限（RBAC）', `<table class="tb">
        <thead><tr><th style="width:170px">角色</th><th>可访问模块</th><th style="width:190px">数据权限</th></tr></thead>
        <tbody>
          <tr><td>门急诊医生</td><td>日间手术申请、专科评估（查看）</td><td>本科室患者</td></tr>
          <tr><td>收费人员</td><td>诊间缴费记账</td><td>全院患者（仅资金数据）</td></tr>
          <tr><td>专科医师 / 麻醉医师</td><td>专科评估、麻醉评估</td><td>本科室患者</td></tr>
          <tr><td>日间手术中心</td><td>预约通知、入院前通知、手术管理、退出日间手术</td><td>全院日间手术患者</td></tr>
          <tr><td>住院登记处 / 护士</td><td>入院登记、手术登记</td><td>本院区患者</td></tr>
          <tr><td>手术室人员</td><td>手术安排、手术费用、手术医嘱、手术管理</td><td>手术患者</td></tr>
          <tr><td>系统管理员</td><td>参数配置、权限管理</td><td>配置数据（不含患者诊疗数据）</td></tr>
        </tbody></table>`, {tight:true, right:'最小权限原则 · 患者数据按科室隔离'})}
    </div>
  </div>`;
}
