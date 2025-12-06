document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');
    
    // 找出最后一个卡片（即飞入动画最晚结束的卡片）
    const lastCard = document.querySelector('.card:last-child');

    // 监听动画结束，启用交互
    lastCard.addEventListener('animationend', () => {
        cards.forEach(card => {
            card.classList.add('animation-done');
        });
        console.log('所有卡片动画已完成，交互已启用。');
    }, { once: true });

    // 2. 修改后的点击跳转逻辑
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const artistId = card.getAttribute('data-artist-id');
            let targetUrl = ''; // 存储最终的跳转目标

            // --- 【重点修改部分】 ---
            if (artistId === 'artist4') {
                // 如果是 artist4，跳转到特定的外部链接
                // 请将 'https://www.your-external-link.com' 替换为你的实际链接
                targetUrl = 'https://sites.google.com/umail.ucc.ie/dh6033marycasatt/home?authuser=2'; 
                
                // 建议：对于外部链接，通常会新开一个标签页
                window.open(targetUrl, '_blank');
                return; // 结束当前点击事件，避免执行下面的默认跳转
                
            } else {
                // 其他卡片 (artist1, artist2, artist3, ...) 保持原样，跳转到本地文件
                targetUrl = `${artistId}.html`;
                window.location.href = targetUrl;
            }
            // --- 【重点修改部分结束】 ---
            
            // 如果你决定不使用 window.open，可以统一使用 window.location.href
            // window.location.href = targetUrl; 
        });
    });
});
