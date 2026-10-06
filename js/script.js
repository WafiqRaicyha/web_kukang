document.addEventListener('DOMContentLoaded', () => {
    // 0. Scroll Reveal Animations
    const revealEls = document.querySelectorAll('.fade-up');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if ('IntersectionObserver' in window && !reduceMotion) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
        revealEls.forEach(el => observer.observe(el));
    } else {
        revealEls.forEach(el => el.classList.add('visible'));
    }
    // 1. Mobile Menu Toggle
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if(btn && menu) {
        btn.addEventListener('click', () => {
            menu.classList.toggle('hidden');
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.add('hidden');
            });
        });
    }

    // 2. Navbar Scroll Effect
    window.addEventListener('scroll', () => {
        const nav = document.getElementById('navbar');
        if(nav) {
            if (window.scrollY > 20) {
                nav.classList.add('shadow-md');
                nav.classList.remove('shadow-sm');
            } else {
                nav.classList.add('shadow-sm');
                nav.classList.remove('shadow-md');
            }
        }
    });

    // 3. Init Leaflet Map
    const mapElement = document.getElementById('map');
    if(mapElement && typeof L !== 'undefined') {
        const map = L.map('map', {
            zoomControl: false,
            scrollWheelZoom: false,
            doubleClickZoom: false,
            dragging: false,
            touchZoom: false,
            boxZoom: false
        }).setView([-2.5, 118.0], 5);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Data: IUCN Red List'
        }).addTo(map);

        const kukangSpecies = [
            {
                name: "Kukang Sunda",
                scientific: "Nycticebus coucang",
                location: "Sumatera Selatan, Riau, Batam & Kepulauan Riau",
                coords: [-0.5, 102.0],
                status: "Endangered",
                statusClass: "iucn-en",
                desc: "Memiliki garis punggung cokelat gelap yang memanjang hingga ke kepala."
            },
            {
                name: "Kukang Jawa",
                scientific: "Nycticebus javanicus",
                location: "Jawa Barat, Jawa Tengah, Banten",
                coords: [-7.0, 107.5],
                status: "Critically Endangered",
                statusClass: "iucn-cr",
                desc: "Spesies paling terancam. Wajahnya memiliki pola garpu putih terang."
            },
            {
                name: "Kukang Kalamasan",
                scientific: "Nycticebus menagensis",
                location: "Kalimantan Utara & Timur",
                coords: [3.0, 116.0],
                status: "Vulnerable",
                statusClass: "iucn-vu",
                desc: "Berwarna pucat kemerahan tanpa penanda wajah yang kontras."
            },
            {
                name: "Kukang Sumatera Utara",
                scientific: "Nycticebus hilleri",
                location: "Sumatera Utara & Aceh",
                coords: [3.5, 98.5],
                status: "Endangered",
                statusClass: "iucn-en",
                desc: "Dulu subspesies N. coucang. Terancam pembalakan liar di ekosistem Leuser."
            },
            {
                name: "Kukang Kayan",
                scientific: "Nycticebus kayan",
                location: "Kalimantan Timur & Tengah",
                coords: [1.5, 115.0],
                status: "Vulnerable",
                statusClass: "iucn-vu",
                desc: "Memiliki pola wajah topeng yang gelap dan sangat kontras."
            },
            {
                name: "Kukang Bangka",
                scientific: "Nycticebus bancanus",
                location: "Pulau Bangka & Belitung",
                coords: [-2.5, 106.0],
                status: "Critically Endangered",
                statusClass: "iucn-cr",
                desc: "Populasi sangat terbatas di pulau kecil, habitat tergerus oleh pertambangan."
            },
            {
                name: "Kukang Borneo",
                scientific: "Nycticebus borneanus",
                location: "Kalimantan Barat & Selatan",
                coords: [-1.0, 112.0],
                status: "Vulnerable",
                statusClass: "iucn-vu",
                desc: "Berwajah lebih membulat dengan garis punggung yang agak samar."
            }
        ];

        kukangSpecies.forEach(sp => {
            const marker = L.marker(sp.coords).addTo(map);
            const popupContent = `
                <div class="min-w-[200px]">
                    <h3 class="font-bold text-slate-800 text-base mb-0">${sp.name}</h3>
                    <p class="text-slate-500 italic text-sm mb-2">${sp.scientific}</p>
                    <p class="text-sm text-slate-700 mb-2"><strong>Sebaran:</strong> ${sp.location}</p>
                    <p class="text-xs text-slate-600 mb-3 border-t pt-2">${sp.desc}</p>
                    <span class="iucn-badge ${sp.statusClass}">${sp.status}</span>
                </div>
            `;
            marker.bindPopup(popupContent);
        });
    }

    // 4. File Upload Logic
    const fileUpload = document.getElementById('file-upload');
    if(fileUpload) {
        fileUpload.addEventListener('change', function(e) {
            const fileName = e.target.files[0]?.name;
            if(fileName) {
                const nameEl = document.getElementById('file-name');
                nameEl.textContent = "File terpilih: " + fileName;
                nameEl.classList.remove('hidden');
            }
        });
    }

    // 5. Geolocation API
    const btnLokasi = document.getElementById('btn-lokasi');
    if(btnLokasi) {
        btnLokasi.addEventListener('click', function() {
            const input = document.getElementById('koordinat');
            const btn = this;
            
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Mencari...';
            
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const lat = position.coords.latitude.toFixed(6);
                        const lng = position.coords.longitude.toFixed(6);
                        input.value = `${lat}, ${lng}`;
                        btn.innerHTML = '<i class="fa-solid fa-check mr-2"></i> Berhasil';
                        btn.classList.replace('bg-slate-800', 'bg-brand-600');
                        btn.classList.replace('hover:bg-slate-900', 'hover:bg-brand-700');
                    },
                    (error) => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Gagal',
                            text: 'Gagal mendapatkan lokasi. Pastikan GPS aktif dan izin diberikan.',
                            confirmButtonColor: '#059669'
                        });
                        btn.innerHTML = '<i class="fa-solid fa-location-dot mr-2"></i> Coba Lagi';
                    }
                );
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Tidak Didukung',
                    text: 'Browser Anda tidak mendukung fitur lokasi.',
                    confirmButtonColor: '#059669'
                });
                btn.innerHTML = '<i class="fa-solid fa-location-dot mr-2"></i> Manual Saja';
            }
        });
    }

    // 6. Form Submit
    const laporForm = document.getElementById('laporForm');
    if(laporForm) {
        laporForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            Swal.fire({
                title: 'Mengirim Laporan...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            setTimeout(() => {
                Swal.fire({
                    icon: 'success',
                    title: 'Laporan Diterima!',
                    text: 'Terima kasih atas kepedulian Anda. Tim rescue kami akan segera menindaklanjuti laporan ini.',
                    confirmButtonColor: '#059669',
                    confirmButtonText: 'Tutup'
                }).then(() => {
                    this.reset();
                    document.getElementById('file-name').classList.add('hidden');
                    document.getElementById('koordinat').value = '';
                    if(btnLokasi) {
                        btnLokasi.innerHTML = '<i class="fa-solid fa-location-dot mr-2"></i> Deteksi Otomatis';
                        btnLokasi.classList.replace('bg-brand-600', 'bg-slate-800');
                        btnLokasi.classList.replace('hover:bg-brand-700', 'hover:bg-slate-900');
                    }
                });
            }, 1500);
        });
    }

    // 7. Modal Infografis Poster
    const btnInfografis = document.getElementById('btn-infografis');
    if(btnInfografis) {
        btnInfografis.addEventListener('click', function() {
            Swal.fire({
                title: 'Melindungi Kukang Melalui Edukasi Masyarakat',
                imageUrl: 'program_konservasi.jpeg',
                imageAlt: 'Infografis Program Konservasi Kukang',
                width: '100%',
                imageWidth: '100%',
                showCloseButton: true,
                showConfirmButton: true,
                confirmButtonText: '<i class="fa-solid fa-download mr-2"></i>Unduh Gambar',
                confirmButtonColor: '#059669',
                customClass: {
                    popup: 'max-w-4xl',
                    image: 'rounded-xl shadow-md border border-slate-100 object-contain max-h-[80vh]'
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    const link = document.createElement('a');
                    link.href = 'program_konservasi.jpeg';
                    link.download = 'Poster_Edukasi_Kukang.jpeg';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            });
        });
    }

    // 8. Process Instagram Embeds
    if (window.instgrm && window.instgrm.Embeds) {
        window.instgrm.Embeds.process();
    }

    // 9. Footer Modals
    const btnPrivasi = document.getElementById('btn-privasi');
    if (btnPrivasi) {
        btnPrivasi.addEventListener('click', function(e) {
            e.preventDefault();
            Swal.fire({
                title: 'Kebijakan Privasi',
                html: `
                    <div class="text-left text-sm text-slate-600 space-y-4">
                        <p><strong>Perlindungan Data Pelapor:</strong> Seluruh informasi yang Anda kirimkan melalui Formulir Lapor Kukang (termasuk nama, nomor WhatsApp, dan lokasi GPS) akan dienkripsi dan dijaga kerahasiaannya secara ketat.</p>
                        <p><strong>Penggunaan Data:</strong> Data hanya akan diakses oleh tim rescue internal gabungan Akasia Riau dan Natural Aceh murni untuk tujuan evakuasi darurat, rehabilitasi, dan penegakan hukum konservasi satwa liar.</p>
                        <p><strong>Tidak Ada Pihak Ketiga:</strong> Kami tidak akan pernah menjual, menyewakan, atau membagikan data pribadi Anda kepada pihak ketiga komersial manapun tanpa persetujuan tertulis Anda.</p>
                    </div>
                `,
                confirmButtonColor: '#059669',
                confirmButtonText: 'Saya Mengerti'
            });
        });
    }

    const btnSyarat = document.getElementById('btn-syarat');
    if (btnSyarat) {
        btnSyarat.addEventListener('click', function(e) {
            e.preventDefault();
            Swal.fire({
                title: 'Syarat & Ketentuan',
                html: `
                    <div class="text-left text-sm text-slate-600 space-y-4">
                        <p><strong>Tujuan Platform:</strong> Platform Kukang Riau dibangun semata-mata sebagai sarana edukasi masyarakat dan wadah pelaporan cepat atas penemuan kukang dalam kondisi darurat.</p>
                        <p><strong>Validitas Laporan:</strong> Anda setuju untuk memberikan informasi pelaporan (termasuk foto bukti) yang jujur, akurat, dan dapat dipertanggungjawabkan.</p>
                        <p><strong>Batasan Tanggung Jawab:</strong> Tim rescue akan berupaya merespons setiap laporan dengan secepat mungkin. Namun, waktu respons di lapangan bergantung pada ketersediaan relawan, kondisi cuaca, dan tingkat urgensi.</p>
                    </div>
                `,
                confirmButtonColor: '#059669',
                confirmButtonText: 'Saya Setuju'
            });
        });
    }
});
