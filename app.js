// الإعدادات وجلب البيانات الذكية من TMDB
const API_KEY = '8265bd1679663a7ea12ac168da84d2e8'; 
const IMG_PATH = 'https://image.tmdb.org/t/p/w500';
const ACTION_GENRE_ID = '28'; // الرقم التعريفي الخاص بأفلام الأكشن عالمياً

const moviesGrid = document.getElementById('moviesGrid');
const searchBox = document.getElementById('searchBox');
const pageTitle = document.getElementById('pageTitle');
const playerModal = document.getElementById('playerModal');
const videoPlayer = document.getElementById('videoPlayer');
const closeBtn = document.getElementById('closeBtn');

// دالة جلب أحدث أفلام الأكشن تلقائياً عند فتح الموقع
async function loadActionMovies() {
    // جلب الأفلام المكتشفة مرتبة حسب الأكثر شعبية وتحمل تصنيف الأكشن
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${ACTION_GENRE_ID}&sort_by=popularity.desc&language=ar&page=1`;
    fetchMovies(url);
}

// دالة البحث الشامل عن أي فيلم يكتبه المستخدم
async function searchMovies(query) {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=ar`;
    fetchMovies(url);
}

// دالة الاتصال بالسيرفر وجلب البيانات
async function fetchMovies(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        renderMovies(data.results);
    } catch (error) {
        console.error("عذراً، حدثت مشكلة أثناء تحميل الأفلام:", error);
    }
}

// دالة بناء الكروت وعرضها بشكل منسق وبصري رائع
function renderMovies(movies) {
    moviesGrid.innerHTML = '';
    
    if (!movies || movies.length === 0) {
        moviesGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #8b8f9a; font-size: 18px;">لم نجد أي أفلام بهذا الاسم، جرب كلمات أخرى.</p>';
        return;
    }

    movies.forEach(movie => {
        if (!movie.poster_path) return; // حجب الأفلام التي لا تحتوي على غلاف
        
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.innerHTML = `
            <img src="${IMG_PATH + movie.poster_path}" alt="${movie.title}">
            <div class="movie-overlay-info">
                <h3>${movie.title}</h3>
                <span class="rating-tag">⭐ ${movie.vote_average.toFixed(1)}</span>
            </div>
        `;
        
        // ربط السيرفر السريع الفوري عند الضغط
        card.addEventListener('click', () => {
            startMovie(movie.id);
        });

        moviesGrid.appendChild(card);
    });
}

// تشغيل الفيلم بسيرفر سريع ومستقر
function startMovie(id) {
    const streamServer = `https://vidsrc.me/embed/movie?tmdb=${id}`;
    videoPlayer.src = streamServer;
    playerModal.style.display = 'flex';
}

// إغلاق السينما المنبثقة وإيقاف الصوت والفيديو تماماً
closeBtn.addEventListener('click', () => {
    playerModal.style.display = 'none';
    videoPlayer.src = '';
});

// تفعيل البحث الفوري أثناء الكتابة (Real-time Search)
searchBox.addEventListener('input', (event) => {
    const searchTerm = event.target.value.trim();
    if (searchTerm !== '') {
        pageTitle.innerText = `نتائج البحث عن: ${searchTerm}`;
        searchMovies(searchTerm);
    } else {
        pageTitle.innerText = "أحدث أفلام الأكشن والإثارة 2026";
        loadActionMovies();
    }
});

// بدء التشغيل التلقائي للموقع وعرض أفلام الأكشن فوراً عند الفتح
loadActionMovies();
