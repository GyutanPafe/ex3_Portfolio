document.addEventListener('DOMContentLoaded', () => {

    /* --- テーマ切替（M3 ダークテーマ） --- */
    const root = document.documentElement;
    const themeToggle = document.querySelector('.js-theme-toggle');
    const stored = localStorage.getItem('slowday-theme');
    if (stored === 'dark' || stored === 'light') {
        root.dataset.theme = stored;
    }
    syncThemeIcon();

    themeToggle.addEventListener('click', () => {
        root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('slowday-theme', root.dataset.theme);
        syncThemeIcon();
    });

    function syncThemeIcon() {
        const dark = root.dataset.theme === 'dark';
        themeToggle.setAttribute('aria-label', dark ? 'ライトモードに切り替え' : 'ダークモードに切り替え');
    }

    /* --- デモバナーの閉じる --- */
    const demoBanner = document.querySelector('.js-demo-banner');
    const bannerClose = document.querySelector('.js-banner-close');
    if (bannerClose && demoBanner) {
        bannerClose.addEventListener('click', () => {
            demoBanner.classList.add('hide');
            setTimeout(() => { demoBanner.remove(); }, 350);
        });
    }

    /* --- Top App Bar のスクロール変化 --- */
    const header = document.querySelector('.js-header');
    const fab = document.querySelector('.js-fab');
    const onScroll = () => {
        header.classList.toggle('is-scrolled', window.scrollY > 24);
        const showFab = window.scrollY > 600;
        fab.hidden = false;
        fab.classList.toggle('show', showFab);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    fab.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* --- ナビゲーションドロワー --- */
    const navToggle = document.querySelector('.js-nav-toggle');
    const drawer = document.querySelector('.js-drawer');
    const scrim = document.querySelector('.js-scrim');
    const drawerClose = document.querySelector('.js-drawer-close');

    function openDrawer() {
        scrim.hidden = false;
        requestAnimationFrame(() => {
            scrim.classList.add('show');
            drawer.classList.add('open');
        });
        drawer.setAttribute('aria-hidden', 'false');
        navToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }
    function closeDrawer() {
        scrim.classList.remove('show');
        drawer.classList.remove('open');
        drawer.setAttribute('aria-hidden', 'true');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        setTimeout(() => { scrim.hidden = true; }, 320);
    }
    navToggle.addEventListener('click', openDrawer);
    drawerClose.addEventListener('click', closeDrawer);
    scrim.addEventListener('click', closeDrawer);
    drawer.querySelectorAll('.drawer-link').forEach(link => {
        link.addEventListener('click', closeDrawer);
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && drawer.classList.contains('open')) closeDrawer();
    });

    /* --- アンカースムーススクロール（固定ヘッダ分のオフセット） --- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const id = anchor.getAttribute('href');
            if (id === '#') return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            const top = target.getBoundingClientRect().top + window.pageYOffset - 72;
            window.scrollTo({ top, behavior: 'smooth' });
            history.replaceState(null, '', id);
        });
    });

    /* --- スクロールリビール --- */
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    /* --- コンタクトフォーム → スナックバー --- */
    const form = document.getElementById('contact-form');
    const snackbar = document.querySelector('.js-snackbar');
    const snackbarClose = document.querySelector('.js-snackbar-close');
    let snackbarTimer;

    function showSnackbar() {
        clearTimeout(snackbarTimer);
        snackbar.classList.add('show');
        snackbarTimer = setTimeout(() => snackbar.classList.remove('show'), 5000);
    }
    snackbarClose.addEventListener('click', () => {
        clearTimeout(snackbarTimer);
        snackbar.classList.remove('show');
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        form.reset();
        showSnackbar();
    });

    /* --- M3 リップル --- */
    document.querySelectorAll('.btn, .icon-btn, .fab, .drawer-link').forEach(el => {
        el.addEventListener('pointerdown', (e) => {
            const rect = el.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
            el.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
});
