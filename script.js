document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');
    
    // 找出最后一个卡片（即飞入动画最晚结束的卡片）
    const lastCard = document.querySelector('.card:last-child');

    // 监听动画结束，启用交互
    if (lastCard) {
        lastCard.addEventListener('animationend', () => {
            cards.forEach(card => {
                card.classList.add('animation-done');
            });
            console.log('所有卡片动画已完成，交互已启用。');
        }, { once: true });
    } else {
        // 如果找不到 lastCard（例如只有一张卡片），立刻启用交互
        cards.forEach(card => card.classList.add('animation-done'));
    }

    // --- 2. 修正后的点击跳转逻辑 ---
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const artistId = card.getAttribute('data-artist-id');
            
            // 外部链接常量
            const externalUrl = 'https://sites.google.com/umail.ucc.ie/dh6033marycasatt/home?authuser=2';
            
            if (artistId === 'artist4') {
                // 如果是 artist4，跳转到外部链接，新开标签页
                window.open(externalUrl, '_blank');
            } else {
                // 其他卡片 (artist1, artist2, artist3, ...) 保持原样，跳转到本地文件
                window.location.href = `${artistId}.html`;
            }
        });
    });
    
    // ... (如果您的文件中有音乐播放器代码，请确保它们在 DOMContentLoaded 内)
    
});
