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
// 留言系统初始化
let comments = JSON.parse(localStorage.getItem('comments')) || [];

function initCommentSystem() {
    const submitBtn = document.getElementById('submitComment');
    const input = document.getElementById('commentInput');
    
    // 加载已有留言
    renderComments();
    
    // 提交事件
    submitBtn.addEventListener('click', () => {
        const content = input.value.trim();
        if(content) {
            const newComment = {
                content: content,
                time: new Date().toLocaleString('zh-CN', { 
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                })
            };
            comments.push(newComment);
            saveComments();
            renderComments();
            input.value = '';
        }
    });
    // 新增删除事件监听（使用事件委托）
    document.getElementById('commentsList').addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const item = e.target.closest('.comment-item');
            const index = parseInt(item.dataset.index);
            
            if (confirm('确定要删除这条留言吗？')) {
                comments.splice(index, 1);
                saveComments();
                renderComments();
            }
        }
    });
}

// 保存到本地存储
function saveComments() {
    localStorage.setItem('comments', JSON.stringify(comments));
}

// 渲染留言列表
function renderComments() {
    const container = document.getElementById('commentsList');
    container.innerHTML = comments.map((comment, index) => `
        <div class="comment-item" data-index="${index}">
            <div class="comment-content">
                ${escapeHtml(comment.content)}
                <button class="delete-btn">×</button>
            </div>
            <div class="comment-time">🕊 ${comment.time}</div>
        </div>
    `).join('');

    // 自动滚动到底部
    container.scrollTop = container.scrollHeight;
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