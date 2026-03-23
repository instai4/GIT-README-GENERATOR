/* CURSOR */
const cur = document.getElementById('cursor');
document.addEventListener('mousemove', e => { cur.style.left=e.clientX+'px'; cur.style.top=e.clientY+'px'; });
document.querySelectorAll('a,button,input,textarea,select,.chip,.sk,.theme-card').forEach(el => {
  el.addEventListener('mouseenter', () => { cur.style.width='40px';cur.style.height='40px';cur.style.background='rgba(255,107,157,.15)'; });
  el.addEventListener('mouseleave', () => { cur.style.width='16px';cur.style.height='16px';cur.style.background='rgba(255,107,157,.2)'; });
});

/* STEP TABS */
document.getElementById('steps').addEventListener('click', e => {
  const btn = e.target.closest('.step');
  if (!btn) return;
  document.querySelectorAll('.step').forEach(b => b.classList.remove('on'));
  document.querySelectorAll('.sec').forEach(s => s.classList.remove('on'));
  btn.classList.add('on');
  document.getElementById('s-' + btn.dataset.s).classList.add('on');
  document.querySelector('.secs').scrollTop = 0;
});

/* PREVIEW TABS */
document.querySelectorAll('.ptab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.ptab').forEach(b => b.classList.remove('on'));
    document.querySelectorAll('.ppane').forEach(p => p.classList.remove('on'));
    btn.classList.add('on');
    document.getElementById('p-' + btn.dataset.p).classList.add('on');
  });
});

/* CHIPS */
document.querySelectorAll('.chip[data-st], .chip[data-op]').forEach(c => {
  c.addEventListener('click', () => { c.classList.toggle('on'); sched(); });
});

/* SKILLS */
document.querySelectorAll('.sk').forEach(s => {
  s.addEventListener('click', () => { s.classList.toggle('on'); sched(); });
});

/* HEADER STYLE CARDS */
document.getElementById('header-styles').addEventListener('click', e => {
  const card = e.target.closest('.theme-card');
  if (!card) return;
  document.querySelectorAll('.theme-card').forEach(c => c.classList.remove('on'));
  card.classList.add('on');
  sched();
});

/* GREETING SELECT */
document.getElementById('greeting').addEventListener('change', function() {
  document.getElementById('custom-greet-fg').style.display = this.value === 'custom' ? 'block' : 'none';
  sched();
});

/* LISTS */
const lists = { proj:[], cert:[] };
function addL(type) {
  const inp = document.getElementById(type + '-in');
  const val = inp.value.trim();
  if (!val) return;
  lists[type].push(val); inp.value = '';
  renderL(type); sched();
}
function removeL(type, idx) { lists[type].splice(idx,1); renderL(type); sched(); }
function renderL(type) {
  document.getElementById(type + '-list').innerHTML = lists[type].map((item,i) =>
    `<div class="li"><span class="li-t">${item}</span><button class="li-del" onclick="removeL('${type}',${i})"><i class="ri-close-line"></i></button></div>`
  ).join('');
}

/* HELPERS */
function v(id) { return (document.getElementById(id)?.value || '').trim(); }
function activeStats() { return [...document.querySelectorAll('#stat-chips .chip.on')].map(c => c.dataset.st); }
function activeOpts()  { return [...document.querySelectorAll('#opt-chips .chip.on')].map(c => c.dataset.op); }
function activeSkills(g) { return [...document.querySelectorAll('#' + g + ' .sk.on')].map(s => s.dataset.k); }
function headerStyle() { return document.querySelector('.theme-card.on')?.dataset.hs || 'simple'; }

/* SKILL BADGE */
function skillBadge(name, style) {
  const map = {
    'Python':['python','3776AB','white','python'],'Java':['java','ED8B00','white','openjdk'],
    'JavaScript':['javascript','F7DF1E','black','javascript'],'TypeScript':['typescript','3178C6','white','typescript'],
    'C':['c','00599C','white','c'],'C++':['c%2B%2B','00599C','white','cplusplus'],
    'HTML5':['html5','E34F26','white','html5'],'CSS3':['css3','1572B6','white','css3'],
    'SQL':['sql','4479A1','white','mysql'],'Bash':['bash','4EAA25','white','gnubash'],
    'R':['r','276DC3','white','r'],'Go':['go','00ADD8','white','go'],
    'Rust':['rust','000000','white','rust'],'PHP':['php','777BB4','white','php'],
    'Kotlin':['kotlin','7F52FF','white','kotlin'],'Swift':['swift','FA7343','white','swift'],
    'React':['react','61DAFB','black','react'],'Vue.js':['vue.js','35495E','4FC08D','vuedotjs'],
    'Next.js':['next.js','000000','white','nextdotjs'],'Node.js':['node.js','6DA55F','white','nodedotjs'],
    'Express':['express','404040','white','express'],'Django':['django','092E20','white','django'],
    'Flask':['flask','000000','white','flask'],'FastAPI':['fastapi','005571','white','fastapi'],
    'TensorFlow':['tensorflow','FF6F00','white','tensorflow'],'PyTorch':['pytorch','EE4C2C','white','pytorch'],
    'Pandas':['pandas','150458','white','pandas'],'NumPy':['numpy','013243','white','numpy'],
    'Scikit-learn':['scikit--learn','F7931E','white','scikitlearn'],'Keras':['keras','D00000','white','keras'],
    'Tailwind CSS':['tailwind%20css','38B2AC','white','tailwindcss'],'Bootstrap':['bootstrap','563D7C','white','bootstrap'],
    'MySQL':['mysql','4479A1','white','mysql'],'MongoDB':['mongodb','4EA94B','white','mongodb'],
    'PostgreSQL':['postgresql','316192','white','postgresql'],'Redis':['redis','DD0031','white','redis'],
    'Firebase':['firebase','039BE5','white','firebase'],'Supabase':['supabase','3ECF8E','white','supabase'],
    'Docker':['docker','0DB7ED','white','docker'],'Kubernetes':['kubernetes','326CE5','white','kubernetes'],
    'Git':['git','F05033','white','git'],'GitHub Actions':['github%20actions','2671E5','white','githubactions'],
    'AWS':['aws','FF9900','white','amazonaws'],'GCP':['google%20cloud','4285F4','white','googlecloud'],
    'Jupyter':['jupyter','F37626','white','jupyter'],'VS Code':['visual%20studio%20code','0078D4','white','visualstudiocode'],
    'Figma':['figma','F24E1E','white','figma'],'Linux':['linux','FCC624','black','linux'],
  };
  const d = map[name]; const bs = style||'flat-square';
  if (!d) return `![${name}](https://img.shields.io/badge/${encodeURIComponent(name)}-555555?style=${bs})`;
  return `![${d[0]}](https://img.shields.io/badge/${d[0]}-${d[1]}?style=${bs}&logo=${d[3]}&logoColor=${d[2]})`;
}

/* SOCIAL BADGE */
function socialBadge(label, url, color, logo) {
  return `[![${label}](https://img.shields.io/badge/${encodeURIComponent(label)}-${color}?style=for-the-badge&logo=${logo}&logoColor=white)](${url})`;
}

/* SCHEDULE */
let genTimer;
function sched() { clearTimeout(genTimer); genTimer = setTimeout(generate, 350); }
let currentMd = '';

/* GENERATE */
function generate() {
  const name        = v('name') || 'Your Name';
  const username    = v('username') || 'username';
  const role        = v('role');
  const location    = v('location');
  const email       = v('email');
  const greetType   = v('greeting');
  const bio         = v('bio');
  const learning    = v('learning');
  const collab      = v('collab');
  const funfact     = v('funfact');
  const askme       = v('askme');
  const portfolio   = v('portfolio');
  const linkedin    = v('linkedin');
  const twitter     = v('twitter');
  const instagram   = v('instagram');
  const youtube     = v('youtube');
  const devto       = v('devto');
  const medium      = v('medium');
  const bmc         = v('bmc');
  const leetcode    = v('leetcode');
  const kaggle      = v('kaggle');
  const statsTheme  = v('stats-theme') || 'radical';
  const statsLayout = v('stats-layout') || 'side';
  const alignment   = v('alignment') || 'center';
  const divider     = v('divider') || 'wave';
  const badgeSt     = v('badge-style') || 'flat-square';
  const typingTexts = v('typing-texts') || 'Developer,Problem Solver,Open Source Contributor';
  const hStyle      = headerStyle();
  const statsOn = activeStats();
  const optsOn  = activeOpts();
  const langs   = activeSkills('sk-langs');
  const frames  = activeSkills('sk-frames');
  const tools   = activeSkills('sk-tools');
  const isCenter = alignment === 'center';
  const wrapOpen = isCenter ? '<div align="center">\n\n' : '';

  let md = '';

  let greetLine = '';
  if (greetType === 'wave')          greetLine = `# 👋 Hey there! I'm ${name}`;
  else if (greetType === 'terminal') greetLine = `# // Hello World! I'm ${name}`;
  else if (greetType === 'bold')     greetLine = `# 🚀 I'm ${name}`;
  else if (greetType === 'emoji')    greetLine = `# ✨ Hi, I'm ${name} ✨`;
  else                               greetLine = `# ${v('custom-greeting') || `Hi, I'm ${name}`}`;

  if (hStyle === 'banner') {
    md += `${wrapOpen}![Header](https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=200&section=header&text=${encodeURIComponent(name)}&fontSize=50&fontColor=fff&animation=twinkling&fontAlignY=35&desc=${encodeURIComponent(role||'Developer')}&descAlignY=55&descAlign=50)\n\n`;
    md += greetLine + '\n\n';
  } else if (hStyle === 'animated') {
    md += `${wrapOpen}![Header](https://capsule-render.vercel.app/api?type=venom&color=gradient&customColorList=2&height=200&section=header&text=${encodeURIComponent(name)}&fontSize=50&fontColor=fff&animation=fadeIn)\n\n`;
    md += greetLine + '\n\n';
  } else {
    md += wrapOpen + greetLine + '\n\n';
  }

  if (role) md += `### ${role}\n\n`;
  if (location || email) {
    if (location) md += `📍 **${location}**`;
    if (location && email) md += `  &nbsp;|&nbsp;  `;
    if (email) md += `📧 **${email}**`;
    md += '\n\n';
  }
  if (optsOn.includes('typing') && typingTexts) {
    const typeStr = typingTexts.split(',').map(t => t.trim()).join(';');
    md += `[![Typing SVG](https://readme-typing-svg.herokuapp.com?font=Fira+Code&pause=1000&color=FF6B9D&center=${isCenter}&vCenter=true&width=435&lines=${encodeURIComponent(typeStr)})](https://git.io/typing-svg)\n\n`;
  }
  if (optsOn.includes('visitors')) {
    md += `![Profile Views](https://komarev.com/ghpvc/?username=${username}&label=Profile+Views&color=FF6B9D&style=flat)\n\n`;
  }
  if (isCenter) md += '</div>\n\n';

  const DIV = {
    wave:`\n![Wave](https://raw.githubusercontent.com/trinib/trinib/82213791fa9ff58d3ca768ddd6de2489ec23ffca/images/footer.svg)\n\n`,
    line:`\n---\n\n`, dots:`\n<p align="center">• • • • • • • • • •</p>\n\n`, none:'\n'
  };
  const div = DIV[divider] || '\n---\n\n';

  if (bio || learning || collab || funfact || askme || portfolio) {
    md += `## 🙋‍♂️ About Me\n\n`;
    if (bio)       md += `${bio}\n\n`;
    if (learning)  md += `- 🌱 **Currently Learning:** ${learning}\n`;
    if (collab)    md += `- 👯 **Looking to collaborate on:** ${collab}\n`;
    if (askme)     md += `- 💬 **Ask me about:** ${askme}\n`;
    if (funfact)   md += `- ⚡ **Fun fact:** ${funfact}\n`;
    if (portfolio) md += `- 🌐 **Portfolio:** [${portfolio}](${portfolio})\n`;
    md += '\n' + div;
  }

  const allSkills = [...langs,...frames,...tools];
  if (allSkills.length) {
    md += `## 🛠️ Tech Stack & Tools\n\n`;
    if (langs.length)  { md += `**Languages:**  \n`; md += langs.map(s=>skillBadge(s,badgeSt)).join(' ')+'\n\n'; }
    if (frames.length) { md += `**Frameworks & Libraries:**  \n`; md += frames.map(s=>skillBadge(s,badgeSt)).join(' ')+'\n\n'; }
    if (tools.length)  { md += `**Databases & DevOps:**  \n`; md += tools.map(s=>skillBadge(s,badgeSt)).join(' ')+'\n\n'; }
    md += div;
  }

  if (statsOn.length) {
    md += `## 📊 GitHub Stats\n\n`;
    if (statsLayout === 'side') {
      md += `<div align="center">\n\n`;
      if (statsOn.includes('stats'))  md += `![${name}'s GitHub Stats](https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&theme=${statsTheme}&hide_border=true&count_private=true)\n`;
      if (statsOn.includes('streak')) md += `![GitHub Streak](https://github-readme-streak-stats.herokuapp.com/?user=${username}&theme=${statsTheme}&hide_border=true)\n`;
      md += '\n</div>\n\n';
    } else {
      if (statsOn.includes('stats'))  md += `![${name}'s GitHub Stats](https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&theme=${statsTheme}&hide_border=true&count_private=true)\n\n`;
      if (statsOn.includes('streak')) md += `![GitHub Streak](https://github-readme-streak-stats.herokuapp.com/?user=${username}&theme=${statsTheme}&hide_border=true)\n\n`;
    }
    if (statsOn.includes('langs'))    md += `<div align="center">\n\n![Top Languages](https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&layout=compact&theme=${statsTheme}&hide_border=true&langs_count=8)\n\n</div>\n\n`;
    if (statsOn.includes('trophies')) md += `<div align="center">\n\n![Trophies](https://github-profile-trophy.vercel.app/?username=${username}&theme=${statsTheme}&no-frame=true&no-bg=false&margin-w=4)\n\n</div>\n\n`;
    if (statsOn.includes('activity')) md += `![Activity Graph](https://github-readme-activity-graph.vercel.app/graph?username=${username}&theme=react-dark&hide_border=true)\n\n`;
    if (statsOn.includes('snake'))    md += `<div align="center">\n\n![Snake animation](https://raw.githubusercontent.com/${username}/${username}/output/github-contribution-grid-snake-dark.svg)\n\n</div>\n\n`;
    md += div;
  }

  if (lists.proj.length) {
    md += `## 🚀 Featured Projects\n\n`;
    lists.proj.forEach(p => {
      const parts = p.split('—').map(x=>x.trim());
      md += `### [${parts[0]}](https://github.com/${username}/${parts[0].toLowerCase().replace(/\s+/g,'-')})\n`;
      if (parts[1]) md += `> ${parts[1]}\n`;
      md += '\n';
    });
    md += div;
  }

  if (lists.cert.length) {
    md += `## 🏆 Certifications\n\n`;
    lists.cert.forEach(c => { md += `- 📜 ${c}\n`; });
    md += '\n' + div;
  }

  const socials = [
    linkedin  && socialBadge('LinkedIn',  linkedin,  '0077B5','linkedin'),
    twitter   && socialBadge('Twitter',   twitter,   '1DA1F2','twitter'),
    instagram && socialBadge('Instagram', instagram, 'E4405F','instagram'),
    youtube   && socialBadge('YouTube',   youtube,   'FF0000','youtube'),
    devto     && socialBadge('Dev.to',    devto,     '0A0A0A','devdotto'),
    medium    && socialBadge('Medium',    medium,    '12100E','medium'),
    leetcode  && socialBadge('LeetCode',  leetcode,  'FFA116','leetcode'),
    kaggle    && socialBadge('Kaggle',    kaggle,    '20BEFF','kaggle'),
    bmc       && `[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](${bmc})`,
    portfolio && `[![Portfolio](https://img.shields.io/badge/Portfolio-FF6B9D?style=for-the-badge&logo=google-chrome&logoColor=white)](${portfolio})`,
  ].filter(Boolean);

  if (socials.length && optsOn.includes('connect')) {
    md += `## 🤝 Connect With Me\n\n<div align="center">\n\n`;
    md += socials.join('\n') + '\n\n</div>\n\n' + div;
  }

  if (optsOn.includes('quote')) {
    md += `## 💬 Quote of the Day\n\n<div align="center">\n\n![Readme Quotes](https://quotes-github-readme.vercel.app/api?type=horizontal&theme=radical)\n\n</div>\n\n${div}`;
  }
  if (optsOn.includes('waka')) {
    md += `## ⏱ WakaTime Stats\n\n[![WakaTime](https://github-readme-stats.vercel.app/api/wakatime?username=${username}&theme=${statsTheme}&hide_border=true)](https://wakatime.com/@${username})\n\n${div}`;
  }

  md += `<div align="center">\n\n⭐ **If you find my work interesting, consider giving it a star!** ⭐\n\n`;
  if (hStyle === 'banner' || hStyle === 'animated') {
    md += `![Footer](https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=100&section=footer)\n\n`;
  }
  md += `</div>\n`;

  currentMd = md;
  document.getElementById('raw-textarea').value = md;
  renderPreview(md);
}

/* PREVIEW RENDERER */
function renderPreview(md) {
  let html = md
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%;vertical-align:middle;margin:2px">')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm,  '<h2>$1</h2>')
    .replace(/^# (.+)$/gm,   '<h1>$1</h1>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g,     '<em>$1</em>')
    .replace(/```[\w]*\n([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>(\n|$))+/g, m => `<ul>${m}</ul>`)
    .replace(/\n\n+/g, '</p><p>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>');
  document.getElementById('preview-render').innerHTML = html;
}

/* COPY */
function copyMd() {
  if (!currentMd) { toast('Generate first!'); return; }
  navigator.clipboard.writeText(currentMd).then(() => toast('Copied to clipboard! ✅'));
}

/* DOWNLOAD */
function downloadMd() {
  if (!currentMd) { toast('Generate first!'); return; }
  const blob = new Blob([currentMd], {type:'text/markdown'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'README.md'; a.click();
  toast('Downloaded README.md ✅');
}

/* TOAST */
function toast(msg) {
  const t = document.getElementById('toast');
  document.getElementById('toast-txt').textContent = msg;
  t.classList.add('on');
  setTimeout(() => t.classList.remove('on'), 2500);
}

generate();
