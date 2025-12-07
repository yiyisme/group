// ========================
// 初始化
// ========================
window.addEventListener('load', initializeOnLoad);
window.addEventListener('resize', initializeBackground);

// ========================
// 基础 DOM 获取 (全局变量)
// ========================
const mainContentScroll = document.getElementById("mainContentScroll");
const scrollButtons = document.querySelectorAll(".scroll-down-arrow");
const pages = document.querySelectorAll(".page");

const bg = document.getElementById("bgContainer");
const canvas = document.getElementById("canvas");
const mainImage = document.getElementById("mainScrollImage");
const explorePage = document.getElementById("explorePage");

const startTourButton = document.getElementById("startTour");
const nextTourButton = document.getElementById("nextTour");

const modal = document.getElementById("modal");
const modalImg = document.getElementById("modalImg");
const closeModal = document.getElementById("closeModal");
const wrapper = document.getElementById("imgWrapper");

// 图片原始尺寸
const BACKGROUND_WIDTH = 30073;
const ORIGINAL_IMAGE_HEIGHT = 1993;

// 热点数据
const HOTSPOT_DATA = [
    { id: 'hotspot_yatuocao', originalX: 16676, originalY: 1193, title: '鸭拓草', fullImage: '明趙文俶畫花蝶.png' },
    { id: 'hotspot_butterfly', originalX: 13885, originalY: 636, title: '蝴蝶', fullImage: 'Wen_Chu_-_Butterflies_(1630).jpg' },
    { id: 'hotspot_xuancao', originalX: 10159, originalY: 1213, title: '萱草', fullImage: '明趙文俶畫春蠶食葉.png' },
    { id: 'hotspot_shizhu', originalX: 15032, originalY: 927, title: '石竹', fullImage: 'shizhu.png' },
    { id: 'hotspot_dabinju', originalX: 6829, originalY: 1027, title: '大濱菊', fullImage: 'dabinju.png' },
    { id: 'hotspot_yinzhang', originalX: 4357, originalY: 708, title: '大濱菊', fullImage: 'dabinju.png' },
    { id: 'hotspot_qianlongzhang', originalX: 29063, originalY: 380, title: '大濱菊', fullImage: 'dabinju.png' },
];

// ========================
// 背景滑动控制 (全局变量)
// ========================
let pos = 0;       // translateX 值
const step = 200;  // 点击按钮每次移动距离
let maxScroll = 0;
let velocity = 0;
let isInertiaRunning = false;
const inertiaDamping = 0.92;
const minSpeed = 0.01;


function getScaleFactor() {
    return canvas.clientHeight / ORIGINAL_IMAGE_HEIGHT;
}

function updateBackgroundPosition() {
    if (pos > 0) pos = 0;
    if (pos < maxScroll) pos = maxScroll;
    bg.style.transform = `translateX(${pos}px)`;
}

// 动态定位 hotspot
function positionHotspots() {
    const scale = getScaleFactor();
    document.querySelectorAll('.hotspot').forEach(h => {
        const originX = parseFloat(h.dataset.originX);
        const originY = parseFloat(h.dataset.originY);
        h.style.left = `${originX * scale}px`;
        h.style.top = `${originY * scale}px`;
    });
}

// 初始化背景和 hotspot
function initializeBackground() {
    bg.style.transition = 'none';
    const scale = getScaleFactor();
    const scaledWidth = BACKGROUND_WIDTH * scale;
    maxScroll = canvas.clientWidth - scaledWidth;
    if (maxScroll > 0) maxScroll = 0;

    const initialPos = Math.max(Math.min(canvas.clientWidth / 2 - scaledWidth / 2, 0), maxScroll);
    pos = initialPos;
    updateBackgroundPosition();

    positionHotspots();

    setTimeout(() => { bg.style.transition = 'transform 0.5s ease-out'; }, 50);
}

function initializeOnLoad() {
    if (mainImage.complete && mainImage.naturalWidth !== 0) {
        initializeBackground();
    } else {
        mainImage.onload = initializeBackground;
        mainImage.onerror = initializeBackground;
    }
}

// ========================
// 页面滚动按钮
// ========================
function scrollToPage(targetId) {
    const target = document.querySelector(targetId);
    if (!target) return;

    mainContentScroll.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
    if (targetId === '#explorePage') exitTourMode();
}

scrollButtons.forEach(button => {
    button.addEventListener('click', e => {
        e.preventDefault();
        const targetId = button.getAttribute('data-target');
        scrollToPage(targetId);
    });
});

// ========================
// 左右滑动按钮
// ========================
document.getElementById("slideleft").onclick = () => { exitTourMode(); pos += step; updateBackgroundPosition(); };
document.getElementById("slideright").onclick = () => { exitTourMode(); pos -= step; updateBackgroundPosition(); };

// ========================
// 鼠标滚轮水平滑动 + 惯性
// ========================
mainContentScroll.addEventListener("wheel", (e) => {
    const exploreRect = explorePage.getBoundingClientRect();
    const isExploring = exploreRect.top >= -10 && exploreRect.top <= 10;

    if (isExploring) {
        e.preventDefault();
        exitTourMode();

        const sensitivity = 2;
        velocity += (-e.deltaY * sensitivity * 0.25);
        pos -= e.deltaY * sensitivity;
        updateBackgroundPosition();
        startInertia();
    }
}, { passive: false });

function startInertia() {
    if (isInertiaRunning) return;
    isInertiaRunning = true;

    function stepInertia() {
        velocity *= inertiaDamping;
        pos += velocity;
        updateBackgroundPosition();

        if (Math.abs(velocity) > minSpeed) requestAnimationFrame(stepInertia);
        else { velocity = 0; isInertiaRunning = false; }
    }

    requestAnimationFrame(stepInertia);
}

// ========================
// 导览功能
// ========================
let tourIndex = -1;

function goToHotspot(index) {
    const data = HOTSPOT_DATA[index];
    if (!data) return;

    const scale = getScaleFactor();
    const hotspotXOnScreen = data.originalX * scale;
    pos = (canvas.clientWidth / 2) - hotspotXOnScreen;
    updateBackgroundPosition();

    document.querySelectorAll('.hotspot').forEach(el => el.classList.remove('active-tour'));
    const el = document.getElementById(data.id);
    if (el) el.classList.add('active-tour');

    const isLast = index === HOTSPOT_DATA.length - 1;
    if (isLast) nextTourButton.textContent = "Back to start";
    else nextTourButton.textContent = `Next`;
}

startTourButton.addEventListener('click', () => {
    tourIndex = 0;
    startTourButton.style.display = 'none';
    nextTourButton.style.display = 'inline-block';
    goToHotspot(tourIndex);
});

nextTourButton.addEventListener('click', () => {
    if (tourIndex === HOTSPOT_DATA.length - 1) {
        exitTourMode();
        initializeBackground();
    } else {
        tourIndex++;
        goToHotspot(tourIndex);
    }
});

function exitTourMode() {
    tourIndex = -1;
    document.getElementById('startTour').style.display = 'inline-block';
    nextTourButton.style.display = 'none';
    document.querySelectorAll('.hotspot').forEach(el => el.classList.remove('active-tour'));
}


// ========================
// modal 图片缩放 + 拖拽 (全局变量)
// ========================
let scale = 1, minScale = 1, maxScale = 5;
let posX = 0, posY = 0, startX = 0, startY = 0, isDragging = false;

// 定义 updateTransform 函数，使其全局可用
function updateTransform() {
    modalImg.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
}

wrapper.addEventListener("wheel", e => {
    e.preventDefault();
    scale = e.deltaY < 0 ? Math.min(scale + 0.1, maxScale) : Math.max(scale - 0.1, minScale);
    updateTransform();
});

wrapper.addEventListener("mousedown", e => {
    isDragging = true;
    startX = e.clientX - posX;
    startY = e.clientY - posY;
});

window.addEventListener("mousemove", e => {
    if (!isDragging) return;
    posX = e.clientX - startX;
    posY = e.clientY - startY;
    updateTransform();
});

window.addEventListener("mouseup", () => { isDragging = false; });

closeModal.addEventListener("click", () => {
    scale = 1; posX = 0; posY = 0;
    updateTransform();
});


// =========================================================================================
// DOMContentLoaded 监听器：所有需要在 DOM 加载后执行的逻辑都在这里
// =========================================================================================
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. 点击 Gallery item 弹出 modal ---
    const galleryItems = document.querySelectorAll(".gallery-item");

    galleryItems.forEach(item => {
        const img = item.querySelector('img');
        if (img) {
            item.addEventListener("click", () => {
                const fullSrc = img.getAttribute('data-full-src') || img.src; // 优先使用 data-full-src
                modalImg.src = fullSrc;
                
                // 每次打开时重置 modal 的缩放和位置
                scale = 1; posX = 0; posY = 0;
                updateTransform(); 
                
                modal.style.display = "flex";
            });
        }
    });

    // 重新关联关闭按钮的点击事件
    closeModal.onclick = () => {
        modal.style.display = "none";
    };


    // --- 2. 音乐播放器逻辑 (修正后的代码) ---
    const music = document.getElementById('backgroundMusic');
    const toggleButton = document.getElementById('musicToggleButton');
    let isPlaying = false; 
    
    // 确保 toggleButton 和 music 存在，防止 null 错误
    if (!music || !toggleButton) {
        console.error("无法找到音乐播放器元素或控制按钮！");
        return; // 如果找不到元素，提前退出
    }

    // Helper function for button text/icon update
    function updateButtonText(playing) {
        if (playing) {
            toggleButton.innerHTML = '⏸'; 
        } else {
            toggleButton.innerHTML = '▶'; 
        }
    }


    // --- 按钮点击逻辑 ---
    toggleButton.addEventListener('click', () => {
        if (isPlaying) {
            music.pause();
            isPlaying = false;
        } else {
            // 用户点击后，浏览器通常会允许播放
            music.play().catch(error => {
                console.error("播放音乐时出错:", error);
            });
            isPlaying = true;
        }
        updateButtonText(isPlaying);
    });
    
    // --- 状态同步 ---
    music.onplaying = () => {
        isPlaying = true;
        updateButtonText(isPlaying);
    };
    
    music.onpause = () => {
        isPlaying = false;
        updateButtonText(isPlaying);
    };
});
