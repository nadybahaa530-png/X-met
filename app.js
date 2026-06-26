const API_KEY = '8265bd1679663a7ea12ac168da84d2e8'; 
const IMG_PATH = 'https://image.tmdb.org/t/p/w500';

// الأكواد التعريفية للتصنيفات والدول عالمياً
const CONFIGS = {
    action: `with_genres=28`,
    anime: `with_keywords=210024|287501&with_genres=16`, // جلب الأنمي الياباني والرسوم المتحركة للكبار
    bollywood: `with_original_language=hi`, // الأفلام الهندية
    hollywood: `with_original_language=en`, // الأفلام الأجنبية (الإنجليزية)
    chinese: `with_original_language=zh|cn` // الأفلام الصينية والآسيوية
};

let currentCategory = 'action';

const moviesGrid = document.getElementById('moviesGrid');
const searchBox = document.getElementById('searchBox');
const pageTitle = document.getElementById('pageTitle');
const playerModal = document.getElementById('playerModal');
const videoPlayer = document.getElementById('videoPlayer');
const closeBtn = document.getElementById('closeBtn');
const downloadBtn = document.getElementById('downloadBtn');

// دالة جلب البيانات حسب القسم المختار
async function loadMovies() {
    const filterQuery = CONFIGS[currentCategory];
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&${filterQuery}&sort_by=popularity.desc&language=ar&page=1`;
    fetchMovies(url);
}

// تبديل الأقسام عند الضغط على الأزرار
function changeCategory(category, titleText) {
    currentCategory = category;
    pageTitle.innerText = titleText;
    
    // تفعيل وتلوين الزر المختار
    document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    searchBox.value = ''; // مسح خانة البحث عند التبديل
    loadMovies();
}

async function searchMovies(query) {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=ar`;
    fetchMovies(url);
}

async function fetchMovies(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        renderMovies(data.results);
    } catch (error) {
        console.error("حدث خطأ في تحميل المحتوى:", error);
    }
}

function renderMovies(movies) {
    moviesGrid.innerHTML = '';
    if (!movies || movies.length === 0) {
        moviesGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #8b8f9a; font-size: 18px;">لم نجد نتائج، جرب كلمات أخرى.</p>';
        return;
    }

    movies.forEach(movie => {
        if (!movie.poster_path) return; 
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.innerHTML = `
            <img src="${IMG_PATH + movie.poster_path}" alt="${movie.title}">
            <div class="movie-overlay-info">
                <h3>${movie.title}</h3>
                <span class="rating-tag">⭐ ${movie.vote_average.toFixed(1)}</span>
            </div>
        `;
        card.addEventListener('click', () => startMovie(movie.id));
        moviesGrid.appendChild(card);
    });
}

// تشغيل الفيلم وتجهيز زر التحميل عبر أقوى سيرفر عالمي مباشر
function startMovie(id) {
    // سيرفر vidsrc.pm يدعم المشاهدة والتحميل المباشر من نفس الواجهة
    const streamServer = `https://vidsrc.pm/embed/movie/${id}`;
    videoPlayer.src = streamServer;
    
    // ربط زر التحميل برابط التحميل المباشر المتاح من السيرفر
    downloadBtn.href = `https://vidsrc.pm/embed/movie/${id}`;
    
    playerModal.style.display = 'flex';
}

closeBtn.addEventListener('click', () => {
    playerModal.style.display = 'none';
    videoPlayer.src = '';
});

searchBox.addEventListener('input', (event) => {
    const searchTerm = event.target.value.trim();
    if (searchTerm !== '') {
        pageTitle.innerText = `نتائج البحث عن: ${searchTerm}`;
        searchMovies(searchTerm);
    } else {
        loadMovies();
    }
});

// بدء التشغيل التلقائي عند فتح الموقع لأول مرة
loadMovies();
