// 在脚本最前面添加
let isKeyboardVisible = false;

// 监听虚拟键盘状态
window.addEventListener('resize', () => {
    const visual = window.visualViewport;
    if (!visual) return;
    
    // 通过视口高度变化检测键盘
    const keyboardHeight = window.innerHeight - visual.height;
    isKeyboardVisible = keyboardHeight > 100;
    
    // 添加安全阈值
    if (isKeyboardVisible) {
        window.isKeyboardVisible = true;
        setTimeout(() => window.isKeyboardVisible = true, 500);
    } else {
        window.isKeyboardVisible = false;
    }
});

let replyIndex = 0;
const sequentialReplies = [
    "🌸 第一朵樱花飘落时，我在想你",
    "💌 第57次取消发送的勇气",
    "🎶 正在循环你喜欢的歌",
    "🦋 蝴蝶飞不过沧海又如何",
    "🌙 月光会记得我们的对话",
    "📮 信箱里藏着第99封信",
    "🍃 春风捎来未说出口的话",
    "💫 星光照亮所有未完成的诗",
    "🎁 礼物正在派送中...",
    "🔖 书签停留在第521页"
];

const randomReplies = [
    "⏳ 时光沙漏倒流中...",
    "🍬 糖果罐又空了一颗",
    "📻 正在调频到你的波长",
    "🌌 银河系漫游指南更新中"
];
// 歌曲数据
const songs = [
    {
        title: "第57次取消发送",
        file: "assets/music1.mp3",
        background: "assets/bg.jpg",
        color: "#26ee91",
        lyrics: [
            { time: 0, text: "第57次取消发送-菲菲公主" },
            { time: 11, text: "好像只能礼貌的问候" },
            { time: 17, text: "你的温柔也曾被我拥有" },
            { time: 22, text: "不太习惯没了你的小宇宙" },
            { time: 28, text: "念旧是上瘾感受" }
        ],
        message: "浪漫主义都是暗处迎盛阳的玫瑰🦋🌸"
    },
    {
        title: "第二首歌曲",
        file: "assets/music2.mp3",
        background: "assets/bg2.jpg",
        color: "#ff69b4",
        lyrics: [
            { time: 0, text: "第二首歌名-歌手名" },
            { time: 10, text: "第二首歌歌词第一句" },
            { time: 15, text: "第二首歌歌词第二句" }
        ],
        message: "这是我们的第二首情歌💕"
    }
];

let currentSongIndex = 0;
let audio = new Audio();
let isPlaying = false;

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    // 欢迎弹窗按钮事件
    document.getElementById('yesBtn').addEventListener('click', function() {
        document.getElementById('welcomePopup').classList.add('hidden');
        document.getElementById('mainContent').classList.remove('hidden');
        initPlayer();
        initCommentSystem(); // 移到这里初始化
    });
    
    document.getElementById('noBtn').addEventListener('click', function() {
        document.getElementById('welcomePopup').classList.add('hidden');
        document.getElementById('noPage').classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    });

    // 初始化粒子背景
    particlesJS.load('particles-js', 'particles.json', function() {
        console.log('粒子背景加载完成');
    });
});

// 初始化播放器
function initPlayer() {
    loadSong(currentSongIndex);
    initVocalControl(); // 初始化音频控制
    // 按钮事件
    document.getElementById('playBtn').addEventListener('click', togglePlay);
    document.getElementById('nextBtn').addEventListener('click', nextSong);
}

// 加载歌曲
function loadSong(index) {
    const song = songs[index];
    currentSongIndex = index;
    audio.src = song.file;
    
    // 更新界面
    document.getElementById('songTitle').textContent = song.title;
    document.querySelector('.background').style.backgroundImage = `url(${song.background})`;
    document.querySelector('.container').classList.toggle('pink-theme', index === 1);
    
    // 更新歌词
    document.getElementById('lyrics').innerHTML = song.lyrics.map(line => 
        `<div>${line.text}</div>`
    ).join('');
    
    // 更新消息
    typeWriter(song.message, document.getElementById('message'), 70);
    
    // 音频事件
    audio.addEventListener('timeupdate', updateLyrics);
    audio.addEventListener('ended', function() {
        isPlaying = false;
        document.getElementById('playBtn').textContent = '▶ 播放';
    });
}

// 更新歌词高亮
function updateLyrics() {
    const currentTime = audio.currentTime;
    const lyrics = songs[currentSongIndex].lyrics;
    let activeIndex = 0;
    
    for (let i = 0; i < lyrics.length; i++) {
        if (currentTime >= lyrics[i].time) {
            activeIndex = i;
        }
    }
    
    const lyricsElements = document.querySelectorAll('#lyrics div');
    lyricsElements.forEach((div, index) => {
        div.className = index === activeIndex ? 'highlight' : '';
    });
}

// 播放/暂停
function togglePlay() {
    if (isPlaying) {
        audio.pause();
        document.getElementById('playBtn').textContent = '▶ 播放';
    } else {
        audio.play();
        document.getElementById('playBtn').textContent = '⏸ 暂停';
    }
    isPlaying = !isPlaying;
}

// 下一首
function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
    if (isPlaying) {
        audio.play();
    }
}

// 打字机效果
function typeWriter(text, element, speed = 50) {
    let i = 0;
    element.textContent = '';
    
    function typing() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(typing, speed);
        }
    }
    
    typing();
}

const vocalAudio = new Audio('assets/vocal.mp3');
let isVocalPlaying = false;

// 新增音频控制功能
function initVocalControl() {
    const progress = document.getElementById('vocalProgress');
    const timeDisplay = document.getElementById('vocalTime');

    // 元数据加载
    vocalAudio.addEventListener('loadedmetadata', () => {
        progress.max = vocalAudio.duration;
        timeDisplay.textContent = `00:00 / ${formatTime(vocalAudio.duration)}`;
    });

    // 时间更新
    vocalAudio.addEventListener('timeupdate', () => {
        progress.value = vocalAudio.currentTime;
        timeDisplay.textContent = `${formatTime(vocalAudio.currentTime)} / ${formatTime(vocalAudio.duration)}`;
    });
    // 进度条交互
    progress.addEventListener('input', (e) => {
        vocalAudio.currentTime = e.target.value;
    });

    // 播放/暂停控制
    document.getElementById('vocalPlayBtn').addEventListener('click', () => {
        if(isVocalPlaying) {
            vocalAudio.pause();
            document.getElementById('vocalPlayBtn').textContent = '▶';
        } else {
            vocalAudio.play();
            document.getElementById('vocalPlayBtn').textContent = '⏸';
        }
        isVocalPlaying = !isVocalPlaying;
    });
}

// 修改后的格式化时间函数
function formatTime(seconds) {
    const min = Math.floor(seconds / 60).toString().padStart(2, '0');
    const sec = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
}

// 樱花生成器
let sakuraEnabled = true;

const sakuraConfig = {
    density: 0.6, // 密度系数 (0-1)
    maxCount: 15, // 最大同时存在花瓣数
    baseInterval: 800 // 基础生成间隔
  }

function createSakura() {
  if(!sakuraEnabled) return;
   if(document.hidden || !sakuraEnabled) return;
  
  // 密度控制
  if(Math.random() > sakuraConfig.density) return;
  
  // 数量控制
  const currentCount = document.getElementsByClassName('sakura').length;
  if(currentCount >= sakuraConfig.maxCount) return;

  const sakura = document.createElement('div');
  sakura.className = 'sakura';
  const startX = Math.random() * window.innerWidth;
  const drift = (Math.random() - 0.5) * 15; // 减少水平漂移幅度
  const scale = 0.5 + Math.random() * 0.3; // 缩小缩放范围

  sakura.style.cssText = `
    left: ${startX}px;
    transform: translateX(${drift}px) scale(${scale});
    animation-duration: ${10 + Math.random() * 8}s; // 延长持续时间
    animation-delay: ${Math.random() * 2}s;
  `;

  sakuraContainer.appendChild(sakura);
  sakura.addEventListener('animationend', () => sakura.remove());
}
// 动态调整密度（示例：可通过按钮控制）
function adjustDensity(level) {
    sakuraConfig.density = level * 0.6; // 0-1 对应 0%-60%密度
    sakuraConfig.maxCount = 10 + level * 5; // 动态调整最大数量
  }
  
  // 初始化调用（中等密度）
  adjustDensity(0.5);

// 自适应窗口变化
window.addEventListener('resize', () => {
  document.querySelectorAll('.sakura').forEach(sakura => sakura.remove());
});

// 启动系统
const startSakura = () => setInterval(createSakura, 300);
let sakuraInterval = startSakura();

// 页面可见性控制
document.addEventListener('visibilitychange', () => {
  if(document.hidden) {
    clearInterval(sakuraInterval);
    sakuraEnabled = false;
  } else {
    sakuraEnabled = true;
    sakuraInterval = startSakura();
  }
});
// 歌词与主滚动同步
const syncScroll = () => {
    const lyricsDiv = document.getElementById('lyrics');
    const scrollPercent = lyricsDiv.scrollTop / (lyricsDiv.scrollHeight - lyricsDiv.clientHeight);
    window.scrollTo(0, scrollPercent * document.body.scrollHeight);
  };
  
  // 监听歌词滚动
  document.getElementById('lyrics').addEventListener('scroll', syncScroll);
  
  // 窗口尺寸调整时重置
  window.addEventListener('resize', () => {
    document.body.style.overflow = 'auto';
    setTimeout(() => document.body.style.overflow = 'auto', 100);
  });

// ==== 修正后的initCommentSystem函数 ====
function initCommentSystem() {
    const submitBtn = document.getElementById('submitComment');
    const input = document.getElementById('commentInput');
    let lastScrollPos = 0;
    let isKeyboardVisible = false;

    // 监听虚拟键盘
    const viewport = window.visualViewport;
    viewport.addEventListener('resize', () => {
        const keyboardHeight = window.innerHeight - viewport.height;
        if (keyboardHeight > 100) {
            isKeyboardVisible = true;
            document.body.classList.add('keyboard-active');
            document.documentElement.style.setProperty('--keyboard-height', `${keyboardHeight}px`);
            setTimeout(() => {
                input.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }, 300);
        } else {
            isKeyboardVisible = false;
            document.body.classList.remove('keyboard-active');
        }
    });
    input.addEventListener('focus', () => {
        lastScrollPos = window.scrollY;
        // 锁定主容器滚动
        document.documentElement.style.overflow = 'hidden';
    });

    input.addEventListener('blur', () => {
        document.documentElement.style.overflow = '';
        if (!isKeyboardVisible) {
            window.scrollTo(0, lastScrollPos);
        }
    });
    const forceScroll = (container) => {
        const initialScroll = container.scrollTop;
        container.scrollTop = container.scrollHeight;
        
        if (container.scrollTop === initialScroll) {
            requestAnimationFrame(() => {
                container.scrollTop = container.scrollHeight;
            });
        }
    };

    const handleSubmit = () => {
        const content = input.value.trim();
        if (!content) return;

        // 保存用户留言
        const userMsg = {
            type: 'user',
            content: content,
            time: new Date().toLocaleTimeString('zh-CN', {hour: '2-digit', minute: '2-digit'})
        };
        
        if (!saveMessage(userMsg)) return;

        // 生成自动回复
        let replyContent;
        if (replyIndex < sequentialReplies.length) {
            replyContent = sequentialReplies[replyIndex];
            replyIndex++;
        } else {
            replyContent = randomReplies[Math.floor(Math.random() * randomReplies.length)];
        }

        const replyMsg = {
            type: 'system',
            content: replyContent,
            time: new Date().toLocaleTimeString('zh-CN', {hour: '2-digit', minute: '2-digit'})
        };

        // 异步处理自动回复
        setTimeout(() => {
            if (!saveMessage(replyMsg)) return;
            renderMessages(); // 只调用一次渲染
            input.value = ''; // 清空输入框
        }, 800);
    };

    submitBtn.addEventListener('click', handleSubmit);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    });
}

// ==== 增强型saveMessage函数 ====
function saveMessage(msg) {
    try {
        const messages = JSON.parse(localStorage.getItem('messages')) || [];
        messages.push(msg);
        localStorage.setItem('messages', JSON.stringify(messages));
        console.log('消息保存成功:', msg); // 调试日志
        return true;
    } catch (e) {
        console.error('本地存储失败:', e);
        alert('留言保存失败，请检查浏览器存储权限');
        return false;
    }
}

// 保存到本地存储
function saveMessage(msg) {
    try {
        const messages = JSON.parse(localStorage.getItem('messages')) || [];
        console.log('保存前的消息:', messages); // 调试日志
        messages.push(msg);
        localStorage.setItem('messages', JSON.stringify(messages));
        console.log('保存后的消息:', messages); // 调试日志
        return true;
    } catch (e) {
        console.error('存储失败:', e);
        alert('留言保存失败，请检查浏览器存储设置');
        return false;
    }
}

// ==== 修改renderMessages函数 ====
// 修改renderMessages函数
function renderMessages() {
    const container = document.getElementById('commentsList');
    if (!container) return;

    // 使用文档片段批量操作DOM
    const fragment = document.createDocumentFragment();
    const messages = JSON.parse(localStorage.getItem('messages')) || [];
    
    messages.forEach(msg => {
        const div = document.createElement('div');
        div.className = `message ${msg.type}`;
        div.innerHTML = `
            <div class="bubble">
                ${msg.type === 'system' ? '<div class="prefix">嫣嫣ovo</div>' : ''}
                <div class="content">${escapeHtml(msg.content)}</div>
                <div class="time">${msg.time}</div>
            </div>
        `;
        fragment.appendChild(div);
    });

    // 同步DOM操作
    container.innerHTML = '';
    container.appendChild(fragment);

    // 立即触发滚动
    const scrollToBottom = () => {
        const prevScroll = container.scrollTop;
        container.scrollTop = container.scrollHeight;
        
        // 强制同步布局
        if (container.scrollTop === prevScroll) {
            container.style.overflowY = 'hidden';
            container.scrollTop = container.scrollHeight;
            container.style.overflowY = 'auto';
        }
    };

    // 使用双requestAnimationFrame保证执行时机
    requestAnimationFrame(() => {
        requestAnimationFrame(scrollToBottom);
    });

    // 移动端键盘处理（保持原有逻辑）
    if (window.isKeyboardVisible) {
        const input = document.getElementById('commentInput');
        requestAnimationFrame(() => {
            input.scrollIntoView({ 
                behavior: 'auto',
                block: 'nearest',
                inline: 'start'
            });
        });
    }
}

// 修改留言提交处理
async function handleSubmit() {
    const input = document.getElementById('commentInput');
    const content = input.value.trim();
    if (!content) return;

    // 创建临时消息实现即时显示
    const tempId = Date.now();
    const tempMsg = {
        id: tempId,
        type: 'user',
        content: content,
        time: new Date().toLocaleTimeString('zh-CN', {hour: '2-digit', minute: '2-digit'}),
        temp: true
    };

    // 立即更新DOM
    const container = document.getElementById('commentsList');
    const div = document.createElement('div');
    div.className = 'message user temp';
    div.innerHTML = `
        <div class="bubble">
            <div class="content">${escapeHtml(content)}</div>
            <div class="time">${tempMsg.time}</div>
        </div>
    `;
    container.appendChild(div);
    
    // 立即滚动
    container.scrollTop = container.scrollHeight;

    try {
        // 异步保存
        await saveMessage(tempMsg);
        
        // 替换临时消息
        const newMsg = {...tempMsg, temp: false};
        div.className = 'message user';
        div.innerHTML = `
            <div class="bubble">
                <div class="content">${escapeHtml(newMsg.content)}</div>
                <div class="time">${newMsg.time}</div>
            </div>
        `;

        // 生成回复
        const reply = await generateReply();
        await saveMessage(reply);
        
        // 直接追加回复（避免重新渲染全部）
        const replyDiv = document.createElement('div');
        replyDiv.className = 'message system';
        replyDiv.innerHTML = `
            <div class="bubble">
                <div class="prefix">嫣嫣ovo</div>
                <div class="content">${escapeHtml(reply.content)}</div>
                <div class="time">${reply.time}</div>
            </div>
        `;
        container.appendChild(replyDiv);

        // 最终滚动
        requestAnimationFrame(() => {
            container.scrollTop = container.scrollHeight;
            if (window.isKeyboardVisible) {
                input.focus();
            }
        });

    } catch (error) {
        // 错误处理
        div.classList.add('error');
        console.error('提交失败:', error);
    } finally {
        input.value = '';
    }
}

// 防止XSS攻击
function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}
document.getElementById('commentsList').addEventListener('scroll', () => {
    console.log('当前滚动位置:', this.scrollTop);
});
function forceScroll(container) {
    const initialScroll = container.scrollTop;
    container.scrollTop = container.scrollHeight;
    
    // 如果滚动未生效，使用备用方案
    if (container.scrollTop === initialScroll) {
        container.style.overflowY = 'hidden';
        container.offsetHeight; // 强制重排
        container.style.overflowY = 'auto';
        container.scrollTop = container.scrollHeight;
    }
    
    // 最终保障
    requestAnimationFrame(() => {
        container.scrollTop = container.scrollHeight;
    });
}
