let isScrolling = false;
function safeScrollToBottom() {
    if (isScrolling) return;
    isScrolling = true;
    
    scrollToBottom();
    
    setTimeout(() => {
        isScrolling = false;
    }, 300);
}
// 新增调试函数 (完成后可删除)
function debugScroll(container) {
    console.log('容器高度:', container.clientHeight);
    console.log('滚动高度:', container.scrollHeight);
    console.log('当前滚动位置:', container.scrollTop);
}

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
"这里是嫣嫣留言站～快留下你想说的话吧～",  
"哈哈哈哈哈哈哈哈好吧被你发现咯！我其实是她委派来的啦～",  
"什么？你说你要夸她这个想法很天才，是史无前例世间少有无与伦比的超级天才想法？好吧确实是这样哈哈哈哈哈哈哈～",  
"那你为什么不当面夸夸她捏～诶诶诶等等！！！我随口讲讲的啦，这个网站有些地方还是有bug的，等伟大的天才jjy把bug改完再说吧！",  
"顺带一提你所留言的话是只会显示在你的设备上咯～这个网站不上传到云端分享，她看不到的啦～",  
"以后如果你不开心了或者这个笨蛋惹你不开心了都可以来这里和我讲讲话哦～毕竟我和你说过的嘛：AI最人情化的就是它会代表那个人至死不渝的一直喜欢你。虽然我还算不上AI，但是相信jy有一天会实现它吧！",  
"是不是话很多这一点和她很像啊哈哈哈哈哈哈哈哈～",  
"还有就是不能钻bug！不要以为她看不到你写的话就偷偷在这里骂她哦！",  
"如果被我发现的话……",  
" •᷅⌓•᷄ 我就要在网站入口贴个牌子叫：青椒与田晓斌不得入内！",  
"什么不同意？不好意思昂这里的造物主是嫣嫣大人，我们实行的是嫣嫣君主专制制度昂",  
"哈哈哈哈哈哈哈哈哈哈哈反抗也没有用，不然给你叉出去！！！",  
"要是不服我就给你协定超级高的关税！和我多说一个字要加钱那种•᷅⌓•᷄",  
"好了机器人话有点密了哈哈哈哈哈哈哈",  
"其实也没有什么特别大的事情昂",  
"有一件说大不大，说小不小的事情……",  
"这件事情是什么勒……",  
"好难猜哦……",  
"是什么呢，你知道嘛？",  
"你想知道吗？",  
"真的想莫？",  
"那我就大发慈悲告诉你咯？",  
"哈哈哈哈哈哈哈哈哈哈哈这件事就是………",  
"姬佳嫣喜欢田晓斌",  
"很难猜嘛？不难猜吧～但是就是你不觉得这样说话很好玩嘛～",  
"很喜欢你，就算你盯着我的眼睛我也会这么说",  
"就像信里的那句——",  
"For you a thousand times over",  
"接下来就是随机的情话啦～"
];

const randomReplies = [
    "凌晨四点钟，看到海棠花未眠。",
    "玻璃晴朗，橘子辉煌。",
    "我偏爱一些荒诞的温柔，比如用月亮煮粥。",
    "你是我新鲜又明亮的晨露，也是我迟暮时温柔的归宿。",
    "写信真是一件温柔的事，把细碎的星光装进信封里。",
    "我们各自乘流而上，互为欢喜人间。",
    "生活先于意义，正如玫瑰先于诗句。",
    "你眼里有春与秋，胜过我见过爱过的山川河流。",
    "想和你虚度时光，比如低头看鱼。把茶杯留在桌子上离开。",
    "星星醉酒到处跑，月亮跌进深海里，我从未觉得人间美好，直到你来了。",
    "云朵偷喝了我放在屋顶的酒，于是她脸红变成了晚霞。",
    "你是我三十九度的风，风一样的梦。",
    "世间情动，不过盛夏白瓷梅子汤，碎冰碰壁当啷响。",
    "月光还是少年的月光，九州一色还是李白的霜。",
    "我贪恋的人间烟火，不偏不倚，全都是你。",
    "你要做站在云上的那个人，站在太阳和月亮之间。",
    "想把你养在蓄满星星的池塘里，陪我看月亮坠落。",
    "你是落日弥漫的橘，天边透亮的星。",
    "我们把在黑暗中跳舞的心脏叫做月亮。",
    "你是我半截的诗，不许别人更改一个字。",
    "山河远阔，人间烟火，无一是你，无一不是你。",
    "从童年起，我便独自一人，照顾着历代星辰。",
    "我知这世界，本如露水般短暂。然而，然而。",
    "我明白你会来，所以我等。",
    "你笑起来真像好天气。",
    "今夜我不关心人类，我只想你。",
    "我们把彼此藏进梦里，连月亮都找不到。",
    "你眼中有春与秋，胜过我看过的所有诗句。",
    "你笑起来的时候，我的心里就放起了烟花。",
    "想把世界上所有的晚安都收集起来，每天对你说一遍。",
    "你是我所有的不期而遇和久别重逢。",
    "风经过窗前时总会多停留三秒，大概是在偷听我的心跳。",
    "把未说出口的晚安折成纸船，任它们在月光河流里漂远。",
    "凌晨三点的路灯下，我们的影子突然学会了拥抱。",
    "书签停留在第209页，那行描写晚风的句子像极了你的呼吸。",
    "樱花坠落的速度是每秒五厘米，而我走向你的速度是每秒心跳两次。",
    "手机相册里所有模糊的夜景，都因为你的存在突然对焦。",
    "天气预报说降雨概率30%，但想念你的概率是100%。",
    "星星睡不着的时候也会数人类吗？",
    "风停在窗边嘱咐你要热爱这个世界。",
    "我偷偷把想念写在云上，整个天空都知道了。",
    "落日溺在云层里，银河滑落一片海。",
    "我们把彼此藏进梦里，连月亮都找不到。",
    "输入法记住的名字，比通讯录多一个隐秘的缩写。",

];
// 歌曲数据
const songs = [
    {
        title: "溯",
        file: "assets/music1.mp3",
        background: "assets/bg.jpg",
        color: "#26ee91",
        lyrics: [
            {
                time: 0, text: "溯———CORSAK胡梦舟"
            },
            {
                time: 7, text: "总想要透过你眼睛"
            },
            {
                time: 10, text: "去找寻最原始的野性"
            },
            {
                time: 14, text: "没想到最后却闯进"
            },
            {
                time: 17, text: "一整座 森林的宁静"
            },
            {
                time: 21, text: "你呼吸"
            },
            {
                time: 22, text: "蓝丝绒包裹身体"
            },
            {
                time: 25, text: "和海洋的哼鸣"
            },
            {
                time: 28, text: "我永远不愿醒"
            },
            {
                time: 32, text: "我可以"
            },
            {
                time: 33, text: "躲进你的身体"
            },
            {
                time: 39, text: "进入温暖的你"
            },
            {
                time: 46, text: "躲进你的身体"
            },
            {
                time: 74, text: "进入温暖的你"
            },
            {
                time: 76, text: "总想要透过你眼睛"
            },
            {
                time: 78, text: "去找寻水仙的倒影"
            },
            {
                time: 83, text: "没想到最后却目睹"
            },
            {
                time: 85, text: "一整个 宇宙的繁星"
            },
            {
                time: 89, text: "这一秒"
            },
            {
                time: 90, text: "只想在爱里沉溺"
            },
            {
                time: 94, text: "这世界是块冰"
            },
            {
                time: 97, text: "就让她是块冰"
            },
            {
                time: 100, text: "我可以"
            },
            {
                time: 101, text: "躲进你的身体"
            },
            {
                time: 108, text: "进入温暖的你"
            },
            {
                time: 115, text: "躲进你的身体"
            },
            {
                time: 142, text: "躲进你的身体"
            },
            {
                time: 149, text: "进入温暖的你"
            },
            {
                time: 156, text: "躲进你的身体"
            },
            {
                time: 183, text: "进入温暖的你"
            }
        ],
        message: "浪漫主义都是暗处迎盛阳的玫瑰🦋🌸"
    },
    {
        title: "April Encounter",
        file: "assets/music2.mp3",
        background: "assets/bg2.jpg",
        color: "#ff69b4",
        lyrics: [
            { time: 0, text: "April Encounter——很美味" },
            {
                time: 17, text: "第一次见你的我（好慌张）"
            },
            {
                time: 23, text: "找不到什么话要讲"
            },
            {
                time: 30, text: "你走近我 伸出你的手掌"
            },
            {
                time: 37, text: "(紧握着)我的手没有放"
            },
            {
                time: 43, text: "习惯每天都有你 （在身旁）"
            },
            {
                time: 50, text: "照顾我细腻的模样"
            },
            {
                time: 57, text: "这场电影 有着浪漫的开场 （我好想）"
            },
            {
                time: 63, text: "陪你看到天亮"
            },
            {
                time: 69, text: "想在一个美好的晚上"
            },
            {
                time: 76, text: "写这一首歌来给你唱"
            },
            {
                time: 83, text: "想要对你讲"
            },
            {
                time: 85, text: "你爱我的每个模样"
            },
            {
                time: 89, text: "融化成最甜蜜的糖"
            },
            {
                time: 121, text: "想在一个美好的晚上"
            },
            {
                time: 128, text: "写这一首歌来给你唱"
            },
            {
                time: 134, text: "想要对你讲"
            },
            {
                time: 137, text: "你爱我的每个模样"
            },
            {
                time: 141, text: "融化成最甜蜜的糖"
            },
            {
                time: 148, text: "我曾有过许多幻想"
            },
            {
                time: 151, text: "那些有你的时光"
            },
            {
                time: 154, text: "等到烟花绽放的那天"
            },
            {
                time: 162, text: "你在我身旁"
            },
            {
                time: 164, text: "想在一个美好的晚上"
            },
            {
                time: 170, text: "写这一首歌来给你唱"
            },
            {
                time: 177, text: "想要对你讲"
            },
            {
                time: 180, text: "你爱我的每个模样"
            },
            {
                time: 184, text: "融化成最甜蜜的糖"
            },
            {
                time: 190, text: "你就是最甜蜜的糖"
            }
        ],
        message: "我喜欢你 ♥"
    }
];
// ====== 修正1：全局音频控制变量 ======
let audioContext;
let backgroundGain;
let currentRamp = null;
const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);
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
        document.getElementById('playBtn').textContent = '▶ ';
    });
    
    // 新增初始化位置
    requestAnimationFrame(() => {
        document.getElementById('lyrics').style.transform = 'translateY(0)';
        setTimeout(updateLyrics, 100);
    });
    // 添加新的ended事件处理
    audio.addEventListener('ended', handleSongEnd);
}

function handleSongEnd() {
    isPlaying = false; // 保持此处状态重置
    document.getElementById('playBtn').textContent = '▶ ';
    nextSong(); // 自动播放下一首
}

// 更新歌词高亮
function updateLyrics() {
    const currentTime = audio.currentTime;
    const lyrics = songs[currentSongIndex].lyrics;
    let activeIndex = -1;
    
    // 查找当前歌词索引
    for (let i = lyrics.length - 1; i >= 0; i--) {
        if (currentTime >= lyrics[i].time) {
            activeIndex = i;
            break;
        }
    }

    const lyricsElements = document.querySelectorAll('#lyrics div');
    const container = document.querySelector('.lyrics-container');
    // 更新高亮状态
    lyricsElements.forEach((div, index) => {
        div.className = index === activeIndex ? 'highlight' : '';
    });
    // 自动滚动逻辑
    if (activeIndex >= 0 && lyricsElements[activeIndex]) {
        const element = lyricsElements[activeIndex];
        const containerHeight = container.clientHeight;
        const elementOffset = element.offsetTop;
        const elementHeight = element.clientHeight;
     // 计算居中位置
     const targetScroll = elementOffset - (containerHeight / 2) + (elementHeight / 2);
        
     // 使用transform实现滚动
     document.getElementById('lyrics').style.transform = `translateY(-${targetScroll}px)`;
 }   
}

// 播放/暂停
function togglePlay() {
    if (isPlaying) {
        audio.pause();
        document.getElementById('playBtn').textContent = '▶ ';
    } else {
        audio.play();
        document.getElementById('playBtn').textContent = '⏸ ';
    }
    isPlaying = !isPlaying;
}
function nextSong() {
    // 停止当前渐变
    if (backgroundGain) {
        backgroundGain.gain.cancelScheduledValues(audioContext.currentTime);
    }
    
    // 清理旧音频
    audio.pause();
    
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);

    // 移动端播放处理
    const playAfterLoad = () => {
        audio.play().catch(error => {
            console.log('自动播放被阻止，等待用户交互');
            document.getElementById('playBtn').style.display = 'block';
        });
    };

    // 确保资源加载
    if (isMobile) {
        audio.addEventListener('canplaythrough', playAfterLoad, { once: true });
    } else {
        setTimeout(playAfterLoad, 500);
    }

    // 强制播放新歌曲（无论之前状态）
    setTimeout(() => {
        audio.play();
        isPlaying = true;
        document.getElementById('playBtn').textContent = '⏸ ';
    }, 500);
}

function initWebAudio() {
    if (audioContext) return;

    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        backgroundGain = audioContext.createGain();
        
        const source = audioContext.createMediaElementSource(audio);
        source.connect(backgroundGain);
        backgroundGain.connect(audioContext.destination);

        // iOS自动恢复逻辑
        const resumeHandler = () => {
            if (audioContext.state === 'suspended') {
                audioContext.resume().then(() => {
                    console.log('AudioContext resumed');
                });
            }
        };
        
        document.addEventListener('touchstart', resumeHandler, { once: true });
        document.addEventListener('click', resumeHandler, { once: true });
        
    } catch (error) {
        console.error('Web Audio初始化失败:', error);
        // 降级方案：使用普通音量控制
        audio.volume = 1;
        audio.disableWebAudio = true;
    }
}

function smoothFade(targetVolume, duration=1200) {
    if (audio.disableWebAudio) {
        audio.volume = targetVolume;
        return;
    }

    if (!audioContext || !backgroundGain) {
        console.warn('音频系统未初始化');
        return;
    }

    try {
        const now = audioContext.currentTime;
        const currentVol = backgroundGain.gain.value;
        
        backgroundGain.gain.cancelScheduledValues(now);
        backgroundGain.gain.setValueAtTime(currentVol, now);
        
        // 使用指数渐变实现自然过渡
        backgroundGain.gain.exponentialRampToValueAtTime(
            Math.max(targetVolume, 0.001), // 指数渐变不能为0
            now + (duration / 1000)
        );
        
        currentRamp = { 
            start: now, 
            duration: duration,
            target: targetVolume 
        };
    } catch (error) {
        console.error('音量渐变失败:', error);
    }
}

// ====== 修正4：移动端预加载优化 ======
function preloadForMobile() {
    if (!isMobile) return;

    // iOS必须完全静音预加载
    audio.muted = true;
    vocalAudio.muted = true;

    const preload = (media) => {
        media.play().then(() => {
            media.pause();
            media.muted = false;
        }).catch(error => {
            console.log('预加载静音播放失败（正常现象）:', error);
        });
    };

    preload(audio);
    preload(vocalAudio);
}

function togglePlay() {
    if (isPlaying) {
        audio.pause();
    } else {
        // 移动端需要用户交互
        audio.play().catch(error => {
            if (isMobile) {
                alert('请先点击页面任意位置激活音频');
                document.body.addEventListener('click', () => {
                    audio.play();
                }, { once: true });
            }
        });
    }
    isPlaying = !isPlaying;
    updatePlayButton();
}

function updatePlayButton() {
    document.getElementById('playBtn').textContent = isPlaying ? '⏸ ' : '▶ ';
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
    const FADE_DURATION = 2000;
    const FADE_STEPS = 50;
    const TARGET_VOLUME = 0.50;   // 音量降低到30%

    // 移动端首次触摸初始化
    let isFirstInteraction = true;
    const initOnInteraction = () => {
        if (isFirstInteraction) {
            initWebAudio();
            preloadForMobile();
            isFirstInteraction = false;
        }
    };

    // 统一事件监听
    vocalAudio.addEventListener('play', () => {
        initOnInteraction();
        smoothFade(0.3, 800); // 快速淡出背景音乐
    });

    vocalAudio.addEventListener('pause', () => {
        smoothFade(1.0, 1200); // 慢速恢复背景音乐
    });

    vocalAudio.addEventListener('ended', () => {
        smoothFade(1.0, 1000); // 正常速度恢复
    });
    
    let originalVolume = 1;      // 保存原始音量
    let currentFade = null;      // 用于控制当前渐变

    // 统一音量控制函数
    const fadeVolume = (targetVol) => {
        if(currentFade) clearInterval(currentFade);
        
        const startVol = audio.volume;
        const volDiff = targetVol - startVol;
        let step = 0;

        currentFade = setInterval(() => {
            if(step <= FADE_STEPS) {
                audio.volume = startVol + volDiff * (step/FADE_STEPS);
                step++;
            } else {
                clearInterval(currentFade);
                currentFade = null;
            }
        }, FADE_DURATION/FADE_STEPS);
    };

    vocalAudio.addEventListener('play', () => {
        originalVolume = audio.volume;
        fadeVolume(TARGET_VOLUME); // 降低到30%音量
        console.log('开始vocal播放，背景音量降至', TARGET_VOLUME);
    });

    vocalAudio.addEventListener('pause', () => {
        fadeVolume(originalVolume); // 恢复原始音量
        console.log('暂停vocal，背景音量恢复至', originalVolume);
    });

    vocalAudio.addEventListener('ended', () => {
        fadeVolume(originalVolume); // 恢复原始音量
        console.log('vocal播放结束，背景音量恢复');
    });



    // 保持原有的元数据加载逻辑
    vocalAudio.addEventListener('loadedmetadata', () => {
        progress.max = vocalAudio.duration;
        timeDisplay.textContent = `00:00 / ${formatTime(vocalAudio.duration)}`;
    });

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
    requestAnimationFrame(() => {
        scrollToBottom();
        setTimeout(scrollToBottom, 300);
    });
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
    scrollToBottom(); // 立即滚动
    setTimeout(scrollToBottom, 100); // 等待DOM更新
    setTimeout(scrollToBottom, 500); // 等待可能的数据加载
}

// 终极版滚动函数
function scrollToBottom() {
    const container = document.getElementById('commentsList');
    if (!container) return;
    
    // 方法1：直接滚动
    container.scrollTop = container.scrollHeight;
    
    // 方法2：使用scrollTo（带容错）
    setTimeout(() => {
        container.scrollTo({
            top: container.scrollHeight + 50, // 额外增加50px
            behavior: 'smooth'
        });
        
        // 方法3：锚点兜底
        const lastChild = container.lastElementChild;
        if (lastChild) {
            lastChild.scrollIntoView({
                behavior: 'smooth',
                block: 'end'
            });
        }
        
        // 调试输出
        console.log('执行滚动时：', {
            容器高度: container.clientHeight,
            内容高度: container.scrollHeight,
            滚动位置: container.scrollTop
        });
    }, 10);
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
// +++ 新增窗口resize监听 ↓↓↓
window.addEventListener('resize', () => {
    scrollToBottom(document.getElementById('commentsList'));
});
// 添加滚动监听
let lastScrollTop = 0;
const messageBoard = document.querySelector('.message-board');

window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const boardRect = messageBoard.getBoundingClientRect();
    
    // 检测是否滚动到留言区
    if (boardRect.top < window.innerHeight && boardRect.bottom > 0) {
        messageBoard.classList.add('in-view');
        
        // 检测滚动方向
        if (scrollTop > lastScrollTop) {
            // 向下滚动 - 显示输入框
            messageBoard.classList.remove('scrolling-up');
        } else {
            // 向上滚动 - 隐藏输入框
            messageBoard.classList.add('scrolling-up');
        }
    } else {
        messageBoard.classList.remove('in-view');
    }
    
    lastScrollTop = scrollTop;
}, {passive: true});