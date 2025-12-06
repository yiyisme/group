document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');
    
    // 找出最后一个卡片（即飞入动画最晚结束的卡片）
    // 在我们的 HTML 中，卡片 4 (i=4, delay=0.8s) 是最后一个
    const lastCard = document.querySelector('.card:last-child');

    // 监听最后一个卡片的 CSS 动画结束事件
    lastCard.addEventListener('animationend', () => {
        // 动画结束后，给所有卡片添加 'animation-done' 类
        cards.forEach(card => {
            card.classList.add('animation-done');
        });
        
        console.log('所有卡片动画已完成，交互已启用。');

    }, { once: true }); // { once: true } 确保事件只触发一次

    // 2. 点击跳转到艺术家页面 (与之前保持一致)
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const artistId = card.getAttribute('data-artist-id');
            // 确保您已创建 artist1.html, artist2.html, ... 等文件
            window.location.href = `${artistId}.html`; 
        });
    });
});