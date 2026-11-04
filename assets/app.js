/* ================= 应用外壳与路由 ================= */
const NAV = [
  {g:'总览', items:[{k:'dash', t:'工作台', i:'dash'}]},
  {g:'门诊·申请阶段', items:[
    {k:'apply', t:'日间手术申请', i:'doc'},
    {k:'pay', t:'诊间缴费记账', i:'wallet', badge:'▲'},
    {k:'exam', t:'术前检查及预约', i:'list'}
  ]},
  {g:'评估阶段', items:[
    {k:'spec', t:'专科评估', i:'steth'},
    {k:'anes', t:'麻醉评估', i:'syringe'}
  ]},
  {g:'预约·通知', items:[
    {k:'booking', t:'预约通知', i:'sms'},
    {k:'notify', t:'入院前通知', i:'bell'}
  ]},
  {g:'住院环节', items:[
    {k:'admit', t:'入院登记', i:'hosp', badge:'▲'},
    {k:'transfer', t:'转普通入院', i:'swap', badge:'▲'}
  ]},
  {g:'手术环节', items:[
    {k:'schedule', t:'手术安排', i:'cal'},
    {k:'checkin', t:'手术登记', i:'barcode'},
    {k:'fee', t:'手术费用', i:'receipt', badge:'▲'},
    {k:'order', t:'手术医嘱', i:'rx', badge:'▲'}
  ]},
  {g:'管理与统计', items:[
    {k:'manage', t:'手术管理', i:'grid'},
    {k:'query', t:'手术查询', i:'chart'},
    {k:'quit', t:'退出日间手术', i:'exit'}
  ]},
  {g:'系统设置', items:[{k:'config', t:'参数配置', i:'cog'}]}
];

const ROUTES = {
  dash:pageDash, apply:pageApply, pay:pagePay, exam:pageExam, spec:pageSpec, anes:pageAnes,
  booking:pageBooking, notify:pageNotify, admit:pageAdmit, transfer:pageTransfer,
  schedule:pageSchedule, checkin:pageCheckin, fee:pageFee, order:pageOrder,
  manage:pageManage, query:pageQuery, quit:pageQuit, config:pageConfig
};

const TITLES = {
  dash:'工作台', apply:'日间手术申请', pay:'诊间缴费记账', exam:'术前检查及预约', spec:'专科评估',
  anes:'麻醉评估', booking:'预约通知', notify:'入院前通知', admit:'入院登记', transfer:'转普通入院',
  schedule:'手术安排', checkin:'手术登记', fee:'手术费用', order:'手术医嘱', manage:'手术管理',
  query:'手术查询', quit:'退出日间手术', config:'参数配置'
};
const CRUMB = {
  apply:'门诊·申请阶段', pay:'门诊·申请阶段', exam:'门诊·申请阶段', spec:'评估阶段', anes:'评估阶段',
  booking:'预约·通知', notify:'预约·通知', admit:'住院环节', transfer:'住院环节',
  schedule:'手术环节', checkin:'手术环节', fee:'手术环节', order:'手术环节',
  manage:'管理与统计', query:'管理与统计', quit:'管理与统计', config:'系统设置'
};

function renderNav(active){
  return NAV.map(g=>`<div class="side-group">
    <div class="side-group-title">${g.g}</div>
    ${g.items.map(it=>`<div class="side-item ${it.k===active?'on':''}" onclick="go('${it.k}')">
      ${ico(it.i,15)}<span>${it.t}</span>
      ${it.badge?`<span style="margin-left:auto;color:${it.k===active?'#8fd0ff':'#5f9fd0'};font-size:10px;font-weight:700">▲</span>`:''}
    </div>`).join('')}
  </div>`).join('');
}

function go(k){
  if(!ROUTES[k]) k = 'dash';
  location.hash = '#/' + k;
}

function render(){
  const key = (location.hash.replace('#/','') || 'dash');
  const k = ROUTES[key] ? key : 'dash';
  document.getElementById('nav').innerHTML = renderNav(k);
  const crumb = CRUMB[k] ? `<span>${CRUMB[k]}</span><span>/</span><b>${TITLES[k]}</b>` : `<b>${TITLES[k]}</b>`;
  const main = document.getElementById('main');
  main.innerHTML = `<div class="crumb">${crumb}</div><div class="fade">${ROUTES[k]()}</div>`;
  main.scrollTop = 0;
  document.title = TITLES[k] + ' · ' + SYS;
}

/* 交互：提示 */
let toastTimer=null;
function toast(msg){
  const el = document.getElementById('toast');
  el.textContent = msg; el.classList.add('on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>el.classList.remove('on'), 1900);
}
/* 交互：调入费用组套 */
function loadGroup(){
  const body = document.getElementById('feeBody');
  if(!body){ toast('已调入常用组套'); return; }
  const g = GROUPS['关节镜手术组套'];
  body.innerHTML = g.map(r=>`<tr class="fade">
    <td class="mono">${r.code}</td><td>${r.nm}</td><td>${r.spec}</td>
    <td class="r num">${money(r.price)}</td><td class="c num">${r.qty}</td>
    <td class="r num">${money(r.price*r.qty)}</td><td class="c"><span class="link">删除</span></td></tr>`).join('');
  toast('已调入「关节镜手术组套」5 项，合计 4,840.00 元');
}

window.addEventListener('hashchange', render);
window.addEventListener('DOMContentLoaded', () => {
  if(!location.hash) location.hash = '#/dash';
  render();
});
