/**
 * CryptoSharia Affiliate Command Center
 * Frontend Logic — PHP/MySQL API Version
 */

const App = {
    // Current data caches
    leads: [],
    contents: [],
    performances: [],
    calendar: [],
    settings: window.APP_SETTINGS || { promo_code: 'P-NFL', affiliate_type: 'P', affiliate_initial: 'NFL', affiliate_number: '', admin_whatsapp: '' },
    
    // Core API Wrapper
    async apiCall(endpoint, action = 'list', payload = {}) {
        try {
            payload.action = action;
            const res = await fetch(`/api/${endpoint}.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
            if (res.status === 401) {
                window.location.href = 'login.php';
                return null;
            }

            const data = await res.json();
            if (!data.success) {
                this.showToast(data.message || 'Terjadi kesalahan pada server', 'error');
                return null;
            }
            
            if (['create', 'update', 'delete', 'reset', 'save', 'import'].includes(action)) {
                if (data.message) this.showToast(data.message, 'success');
            }
            
            return data;
        } catch (err) {
            console.error('API Error:', err);
            this.showToast('Gagal terhubung ke server', 'error');
            return null;
        }
    },

    // UI Utilities
    showToast(msg, type = 'success') {
        const toast = document.getElementById('toast');
        if (!toast) return;
        toast.textContent = msg;
        toast.style.background = type === 'success' ? 'var(--green-500)' : 'var(--red-500)';
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    },

    copyToClipboard(text, msg = 'Teks disalin!') {
        navigator.clipboard.writeText(text).then(() => this.showToast(msg));
    },

    quickCopy(type) {
        let txt = '';
        if (type === 'cta') txt = `Gunakan kode promo saya: ${this.settings.promo_code} untuk dapat diskon Rp250.000 + bonus Discord Premium 6 bulan.`;
        else if (type === 'admin') txt = `Silakan chat admin pusat untuk daftar ya kak, jangan lupa sebutkan kode promo: ${this.settings.promo_code}`;
        else if (type === 'followup') txt = `Halo kak! Masih tertarik ikut kelasnya? Promo kode ${this.settings.promo_code} masih berlaku lho.`;
        else if (type === 'caption') txt = `Belajar crypto aman dan syariah dari ahlinya.\n\nKlik link di bio / DM untuk info.\nKode Promo: ${this.settings.promo_code}\n\n#CryptoSyariah #BelajarCrypto`;
        else if (type === 'disclaimer') txt = `Disclaimer: Konten ini murni untuk edukasi. Crypto adalah aset berisiko tinggi. Keputusan investasi dan trading adalah tanggung jawab masing-masing individu. Lakukan riset mandiri (DYOR) dan pastikan koin yang Anda beli sesuai dengan prinsip syariah.`;
        this.copyToClipboard(txt, 'Teks disalin ke clipboard');
    },

    // Navigation (Tabs/Sections)
    initNav() {
        const links = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('.section');

        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                links.forEach(l => l.classList.remove('active'));
                sections.forEach(s => s.classList.remove('active'));

                link.classList.add('active');
                const targetId = link.getAttribute('data-section');
                document.getElementById(targetId).classList.add('active');

                // Trigger specific load on tab change
                this.onSectionEnter(targetId);

                if (window.innerWidth <= 768) {
                    document.getElementById('sidebar').classList.remove('active');
                    document.getElementById('menuToggle').classList.remove('active');
                }
            });
        });

        // Mobile menu toggle
        document.getElementById('menuToggle').addEventListener('click', function () {
            this.classList.toggle('active');
            document.getElementById('sidebar').classList.toggle('active');
        });

        // Content Studio Inner Tabs
        const studioTabs = document.querySelectorAll('#studio .tab-btn');
        const studioContents = document.querySelectorAll('#studio .tab-content');
        studioTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                studioTabs.forEach(t => t.classList.remove('active'));
                studioContents.forEach(c => c.classList.remove('active'));
                tab.classList.add('active');
                document.getElementById(tab.getAttribute('data-tab')).classList.add('active');
            });
        });

        // Assets inner tabs
        const assetTabs = document.querySelectorAll('#assets .tab-btn');
        assetTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                assetTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.loadAssets(tab.getAttribute('data-asset-tab'));
            });
        });
    },

    onSectionEnter(sectionId) {
        if (sectionId === 'dashboard') this.loadDashboard();
        else if (sectionId === 'leads') this.loadLeads();
        else if (sectionId === 'studio') { this.loadContents(); this.loadBanks(); }
        else if (sectionId === 'performance') this.loadPerformance();
        else if (sectionId === 'calendar') { this.loadCalendar(); this.loadChecklist(); }
        else if (sectionId === 'assets') this.loadAssets('prompt_karakter');
        else if (sectionId === 'promo') this.renderTemplates();
    },

    // ==================== DASHBOARD ====================
    async loadDashboard() {
        const res = await this.apiCall('dashboard', 'get');
        if (!res) return;
        const data = res.data;

        document.getElementById('dashPromoCode').textContent = data.settings.promo_code;
        document.getElementById('statTotalLeads').textContent = data.totalLeads;
        document.getElementById('statDirected').textContent = data.directed;
        document.getElementById('statRegistered').textContent = data.registered;
        document.getElementById('statContent').textContent = data.postedContent;
        document.getElementById('statKomisi').textContent = 'Rp' + data.komisi.toLocaleString('id-ID');

        // Progress bars
        const reg = data.registered;
        const setProgress = (id, target) => {
            let pct = (reg / target) * 100;
            if (pct > 100) pct = 100;
            document.getElementById(`progress${target}`).style.width = pct + '%';
            document.getElementById(`progress${target}Text`).textContent = `${reg}/${target}`;
        };
        setProgress(3, 3);
        setProgress(5, 5);
        setProgress(10, 10);

        // Best Content
        if (data.bestContent) {
            document.getElementById('bestContent').innerHTML = `
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                    <strong style="color:var(--text-light);">${data.bestContent.content_name}</strong>
                    <span class="badge badge-gold">${data.bestContent.platform}</span>
                </div>
                <div class="text-sm text-muted"><strong>Hook:</strong> "${data.bestContent.hook || '-'}"</div>
                <div style="display:flex;gap:12px;margin-top:8px;font-size:12px;color:var(--text-muted);">
                    <span>👁️ ${data.bestContent.views}</span>
                    <span>👥 ${data.bestContent.leads} Lead</span>
                    <span style="color:var(--green-400);">✅ ${data.bestContent.registrants} Daftar</span>
                </div>
            `;
        } else {
            document.getElementById('bestContent').innerHTML = '<p class="text-muted">Belum ada data</p>';
        }

        // Best CTA
        if (data.bestCTA) {
            document.getElementById('bestCTA').innerHTML = `
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                    <strong style="color:var(--text-light);">${data.bestCTA.content_name}</strong>
                    <span class="badge badge-gold">${data.bestCTA.platform}</span>
                </div>
                <div style="margin-top:8px;font-size:12px;color:var(--green-400);">✅ Menghasilkan ${data.bestCTA.registrants} Pendaftar</div>
            `;
        } else {
            document.getElementById('bestCTA').innerHTML = '<p class="text-muted">Belum ada data konversi pendaftar</p>';
        }

        // Insights
        let insightHtml = '';
        if (data.bestCategory && data.bestCategory.category) {
            insightHtml += `<li>Kategori paling banyak lead: <strong class="text-gold">${data.bestCategory.category.toUpperCase()}</strong> (${data.bestCategory.total_leads} lead)</li>`;
        }
        if (data.bestPlatform && data.bestPlatform.platform) {
            insightHtml += `<li>Platform terbaik: <strong class="text-gold">${data.bestPlatform.platform}</strong> (${data.bestPlatform.total_leads} lead)</li>`;
        }
        if (data.perfTotals && data.perfTotals.total > 0) {
            let conv = data.perfTotals.total_views > 0 ? ((data.perfTotals.total_leads / data.perfTotals.total_views) * 100).toFixed(2) : 0;
            insightHtml += `<li>Conversion rate dari Views ke Lead: <strong class="text-gold">${conv}%</strong></li>`;
        }
        
        if (insightHtml) {
            document.getElementById('contentInsights').innerHTML = `<ul class="guideline-list" style="margin-top:0;">${insightHtml}</ul>`;
        } else {
            document.getElementById('contentInsights').innerHTML = '<p class="text-muted">Posting lebih banyak konten untuk melihat insight.</p>';
        }

        this.updateABSelects();
    },

    // ==================== LEADS ====================
    async loadLeads() {
        const res = await this.apiCall('leads', 'list');
        if (res) {
            this.leads = res.data;
            this.renderLeads();
        }
    },

    renderLeads() {
        const tbody = document.getElementById('leadTableBody');
        const search = document.getElementById('leadSearch').value.toLowerCase();
        const filter = document.getElementById('leadFilter').value;
        tbody.innerHTML = '';

        let filtered = this.leads.filter(l => {
            const matchSearch = l.name.toLowerCase().includes(search) || (l.contact || '').toLowerCase().includes(search);
            const matchFilter = filter === '' || l.status === filter;
            return matchSearch && matchFilter;
        });

        if (filtered.length === 0) {
            document.getElementById('leadEmpty').hidden = false;
            document.getElementById('leadTable').hidden = true;
            return;
        }

        document.getElementById('leadEmpty').hidden = true;
        document.getElementById('leadTable').hidden = false;

        const statusColors = {
            'baru masuk': 'var(--blue-500)',
            'tanya-tanya': 'var(--yellow-500)',
            'sudah dikirim info': 'var(--orange-500)',
            'sudah diarahkan ke admin': 'var(--purple-500)',
            'sudah chat admin': 'var(--brown-500)',
            'sudah daftar': 'var(--green-500)',
            'belum jadi': 'var(--red-500)',
            'follow up nanti': 'var(--gray-500)'
        };

        filtered.forEach(lead => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${lead.entry_date}</td>
                <td><strong>${lead.name}</strong></td>
                <td>${lead.contact || '-'}</td>
                <td><span class="badge" style="background:rgba(255,255,255,0.1);">${lead.platform}</span></td>
                <td><span class="badge" style="background:${statusColors[lead.status] || '#555'};">${lead.status}</span></td>
                <td class="text-xs">${lead.notes || '-'}</td>
                <td>
                    <button class="btn btn-sm btn-ghost" onclick="App.editLead(${lead.id})">✏️</button>
                    <button class="btn btn-sm btn-ghost" onclick="App.deleteData('leads', ${lead.id})" style="color:var(--red-500);">❌</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    },

    async saveLead(e) {
        e.preventDefault();
        const id = document.getElementById('leadEditId').value;
        const payload = {
            name: document.getElementById('leadName').value,
            contact: document.getElementById('leadContact').value,
            platform: document.getElementById('leadPlatform').value,
            source_content: document.getElementById('leadContent').value,
            status: document.getElementById('leadStatus').value,
            entry_date: document.getElementById('leadDate') ? document.getElementById('leadDate').value : new Date().toISOString().split('T')[0], // if no date input, use today
            follow_up_date: document.getElementById('leadFollowUp').value,
            notes: document.getElementById('leadNotes').value
        };

        let action = 'create';
        if (id) {
            action = 'update';
            payload.id = id;
        }

        const res = await this.apiCall('leads', action, payload);
        if (res) {
            this.resetLeadForm();
            this.loadLeads();
            this.loadDashboard();
        }
    },

    editLead(id) {
        const lead = this.leads.find(l => parseInt(l.id) === parseInt(id));
        if (!lead) return;
        document.getElementById('leadEditId').value = lead.id;
        document.getElementById('leadName').value = lead.name;
        document.getElementById('leadContact').value = lead.contact || '';
        document.getElementById('leadPlatform').value = lead.platform;
        document.getElementById('leadContent').value = lead.source_content || '';
        document.getElementById('leadStatus').value = lead.status;
        document.getElementById('leadFollowUp').value = lead.follow_up_date || '';
        document.getElementById('leadNotes').value = lead.notes || '';
        window.scrollTo({ top: document.getElementById('leads').offsetTop, behavior: 'smooth' });
    },

    resetLeadForm() {
        document.getElementById('leadForm').reset();
        document.getElementById('leadEditId').value = '';
    },

    filterLeads() { this.renderLeads(); },

    // ==================== CONTENTS ====================
    async loadContents() {
        const res = await this.apiCall('contents', 'list');
        if (res) {
            this.contents = res.data;
            this.renderContents();
        }
    },

    renderContents() {
        const tbody = document.getElementById('contentTableBody');
        const search = document.getElementById('contentSearch').value.toLowerCase();
        tbody.innerHTML = '';

        let filtered = this.contents.filter(c => c.title.toLowerCase().includes(search));

        if (filtered.length === 0) {
            document.getElementById('contentEmpty').hidden = false;
            document.getElementById('contentTable').hidden = true;
            return;
        }
        document.getElementById('contentEmpty').hidden = true;
        document.getElementById('contentTable').hidden = false;

        const statColors = { 'draft': 'var(--gray-500)', 'ready': 'var(--blue-500)', 'posted': 'var(--green-500)' };

        filtered.forEach(c => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${c.title}</strong></td>
                <td>${c.platform}</td>
                <td><span class="badge" style="background:rgba(255,255,255,0.1);">${c.category}</span></td>
                <td><span class="badge" style="background:${statColors[c.status] || '#555'};">${c.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-ghost" onclick="App.editContent(${c.id})">✏️</button>
                    <button class="btn btn-sm btn-ghost" onclick="App.deleteData('contents', ${c.id})" style="color:var(--red-500);">❌</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    },

    async saveContent(e) {
        e.preventDefault();
        const id = document.getElementById('contentEditId').value;
        const payload = {
            title: document.getElementById('contentTitle').value,
            platform: document.getElementById('contentPlatform').value,
            category: document.getElementById('contentCategory').value,
            hook: document.getElementById('contentHook').value,
            script_body: document.getElementById('contentScript').value,
            cta: document.getElementById('contentCTA').value,
            caption: document.getElementById('contentCaption').value,
            status: document.getElementById('contentStatus').value,
            notes: document.getElementById('contentNotes').value
        };

        const res = await this.apiCall('contents', id ? 'update' : 'create', { ...payload, id });
        if (res) {
            this.resetContentForm();
            this.loadContents();
        }
    },

    editContent(id) {
        const c = this.contents.find(x => parseInt(x.id) === parseInt(id));
        if (!c) return;
        document.getElementById('contentEditId').value = c.id;
        document.getElementById('contentTitle').value = c.title;
        document.getElementById('contentPlatform').value = c.platform;
        document.getElementById('contentCategory').value = c.category;
        document.getElementById('contentHook').value = c.hook || '';
        document.getElementById('contentScript').value = c.script_body || '';
        document.getElementById('contentCTA').value = c.cta || '';
        document.getElementById('contentCaption').value = c.caption || '';
        document.getElementById('contentStatus').value = c.status;
        document.getElementById('contentNotes').value = c.notes || '';
    },

    resetContentForm() {
        document.getElementById('contentForm').reset();
        document.getElementById('contentEditId').value = '';
    },
    
    filterContent() { this.renderContents(); },

    // ==================== BANK/TEMPLATES ====================
    async loadBanks() {
        const res = await this.apiCall('templates', 'list');
        if (res) {
            const data = res.data;
            const ideas = data.filter(d => d.template_type === 'idea');
            const hooks = data.filter(d => d.template_type === 'hook');
            const ctas = data.filter(d => d.template_type === 'cta');
            const scripts = data.filter(d => d.template_type === 'script');

            const renderBank = (id, items) => {
                const el = document.getElementById(id);
                if(!el) return;
                el.innerHTML = items.map(item => `
                    <div class="bank-item">
                        <span class="bank-item-text">${item.content.replace(/\n/g, '<br>')}</span>
                        <button class="btn btn-sm btn-ghost" onclick="App.copyToClipboard('${item.content.replace(/'/g, "\\'").replace(/\n/g, "\\n")}')">📋</button>
                    </div>
                `).join('') || '<p class="text-muted">Kosong</p>';
            };

            renderBank('ideaBank', ideas);
            renderBank('hookBank', hooks);
            renderBank('ctaBank', ctas);
            renderBank('scriptBank', scripts);
            
            // Also store for promo page
            this.waTemplates = data.filter(d => d.template_type === 'whatsapp');
            this.renderTemplates();
        }
    },

    renderTemplates() {
        const grid = document.getElementById('templateGrid');
        if(!grid || !this.waTemplates) return;
        grid.innerHTML = this.waTemplates.map(t => `
            <div class="card" style="display:flex; flex-direction:column;">
                <h4 style="margin-bottom:var(--space-2); color:var(--gold-400);">${t.title}</h4>
                <div class="bank-item" style="flex:1; align-items:flex-start; margin-bottom:var(--space-3); background:rgba(255,255,255,0.02);">
                    <span class="bank-item-text" style="font-size:var(--font-size-sm); white-space:pre-wrap;">${t.content}</span>
                </div>
                <button class="btn btn-outline btn-sm" onclick="App.copyToClipboard('${t.content.replace(/'/g, "\\'").replace(/\n/g, "\\n")}')">📋 Copy Pesan</button>
            </div>
        `).join('');
    },

    // ==================== PROMO & SETTINGS ====================
    copyPromoCode() {
        this.copyToClipboard(this.settings.promo_code, 'Kode Promo disalin!');
    },

    simulatePromo() {
        const type = document.getElementById('promoType').value;
        const initial = document.getElementById('promoInitial').value.toUpperCase().replace(/[^A-Z]/g, '');
        const number = document.getElementById('promoNumber').value.replace(/[^0-9]/g, '');
        
        let code = `${type}-${initial}`;
        if (number) code += `${number}`;
        
        document.getElementById('promoSimResult').textContent = code;
        return code;
    },

    async savePromoSettings() {
        const code = this.simulatePromo();
        const payload = {
            promo_code: code,
            affiliate_type: document.getElementById('promoType').value,
            affiliate_initial: document.getElementById('promoInitial').value.toUpperCase(),
            affiliate_number: document.getElementById('promoNumber').value,
            admin_whatsapp: document.getElementById('waAdminNumber').value
        };

        const res = await this.apiCall('settings', 'update', payload);
        if (res) {
            this.settings = payload;
            document.getElementById('dashPromoCode').textContent = code;
            document.getElementById('promoCodeDisplay').textContent = code;
            this.updateWAPreview();
        }
    },

    updateWAPreview() {
        const promo = this.settings.promo_code;
        const el = document.getElementById('waPreview');
        if(el) {
            el.innerHTML = `Assalamu'alaikum Admin CryptoSharia, saya ingin daftar CryptoSharia Masterclass menggunakan kode promo: <strong>${promo}</strong>.`;
        }
    },

    getWAPesan() {
        const name = document.getElementById('waName').value;
        const intro = name ? `Assalamu'alaikum Admin CryptoSharia, ini ${name}, saya ingin daftar CryptoSharia Masterclass menggunakan kode promo: ` : `Assalamu'alaikum Admin CryptoSharia, saya ingin daftar CryptoSharia Masterclass menggunakan kode promo: `;
        return `${intro}${this.settings.promo_code}`;
    },

    copyWAMessage() {
        this.copyToClipboard(this.getWAPesan(), 'Pesan WhatsApp disalin!');
    },

    openWhatsApp() {
        const num = document.getElementById('waAdminNumber').value.replace(/[^0-9]/g, '');
        if (!num) {
            this.showToast('Masukkan nomor WA admin dulu', 'error');
            return;
        }
        const text = encodeURIComponent(this.getWAPesan());
        window.open(`https://wa.me/${num}?text=${text}`, '_blank');
    },

    // ==================== PERFORMANCE ====================
    async loadPerformance() {
        const res = await this.apiCall('performances', 'list');
        if (res) {
            this.performances = res.data;
            this.renderPerformance();
            this.updateABSelects();
        }
    },

    renderPerformance() {
        const tbody = document.getElementById('perfTableBody');
        const search = document.getElementById('perfSearch').value.toLowerCase();
        tbody.innerHTML = '';

        let totalViews = 0, totalLeads = 0, totalReg = 0;
        let filtered = this.performances.filter(p => {
            if (p.content_name.toLowerCase().includes(search)) {
                totalViews += parseInt(p.views);
                totalLeads += parseInt(p.leads);
                totalReg += parseInt(p.registrants);
                return true;
            }
            return false;
        });

        document.getElementById('perfTotal').textContent = filtered.length;
        document.getElementById('perfViews').textContent = totalViews.toLocaleString('id-ID');
        document.getElementById('perfLeads').textContent = totalLeads.toLocaleString('id-ID');
        document.getElementById('perfReg').textContent = totalReg.toLocaleString('id-ID');
        let conv = totalViews > 0 ? ((totalLeads / totalViews) * 100).toFixed(2) : 0;
        document.getElementById('perfConv').textContent = conv + '%';

        if (filtered.length === 0) {
            document.getElementById('perfEmpty').hidden = false;
            document.getElementById('perfTable').hidden = true;
            return;
        }
        document.getElementById('perfEmpty').hidden = true;
        document.getElementById('perfTable').hidden = false;

        filtered.forEach(p => {
            let p_eng = parseInt(p.likes) + parseInt(p.comments) + parseInt(p.shares);
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${p.content_name}</strong><br><span class="text-xs text-muted">${p.post_date || '-'}</span></td>
                <td><span class="badge" style="background:rgba(255,255,255,0.1);">${p.platform}</span></td>
                <td>👁️ ${p.views}</td>
                <td>❤️ ${p_eng}</td>
                <td>👥 ${p.leads}</td>
                <td style="color:var(--green-400);">✅ ${p.registrants}</td>
                <td>
                    <button class="btn btn-sm btn-ghost" onclick="App.editPerf(${p.id})">✏️</button>
                    <button class="btn btn-sm btn-ghost" onclick="App.deleteData('performances', ${p.id})" style="color:var(--red-500);">❌</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    },

    async savePerf(e) {
        e.preventDefault();
        const id = document.getElementById('perfEditId').value;
        const payload = {
            content_name: document.getElementById('perfName').value,
            platform: document.getElementById('perfPlatform').value,
            post_date: document.getElementById('perfDate').value,
            category: document.getElementById('perfCat').value,
            hook: document.getElementById('perfHook').value,
            views: parseInt(document.getElementById('perfViewsInput').value) || 0,
            likes: parseInt(document.getElementById('perfLikes').value) || 0,
            comments: parseInt(document.getElementById('perfComments').value) || 0,
            shares: parseInt(document.getElementById('perfShares').value) || 0,
            dms: parseInt(document.getElementById('perfDM').value) || 0,
            leads: parseInt(document.getElementById('perfLeadIn').value) || 0,
            registrants: parseInt(document.getElementById('perfLeadReg').value) || 0,
            notes: document.getElementById('perfNotes').value
        };

        const res = await this.apiCall('performances', id ? 'update' : 'create', { ...payload, id });
        if (res) {
            this.resetPerfForm();
            this.loadPerformance();
        }
    },

    editPerf(id) {
        const p = this.performances.find(x => parseInt(x.id) === parseInt(id));
        if (!p) return;
        document.getElementById('perfEditId').value = p.id;
        document.getElementById('perfName').value = p.content_name;
        document.getElementById('perfPlatform').value = p.platform;
        document.getElementById('perfDate').value = p.post_date || '';
        document.getElementById('perfCat').value = p.category;
        document.getElementById('perfHook').value = p.hook || '';
        document.getElementById('perfViewsInput').value = p.views;
        document.getElementById('perfLikes').value = p.likes;
        document.getElementById('perfComments').value = p.comments;
        document.getElementById('perfShares').value = p.shares;
        document.getElementById('perfDM').value = p.dms;
        document.getElementById('perfLeadIn').value = p.leads;
        document.getElementById('perfLeadReg').value = p.registrants;
        document.getElementById('perfNotes').value = p.notes || '';
    },

    resetPerfForm() {
        document.getElementById('perfForm').reset();
        document.getElementById('perfEditId').value = '';
    },
    
    filterPerf() { this.renderPerformance(); },

    // A/B testing Selects
    updateABSelects() {
        const selA = document.getElementById('abSelectA');
        const selB = document.getElementById('abSelectB');
        if(!selA || !selB) return;
        
        let opts = '<option value="">Pilih Hook...</option>';
        this.performances.forEach(p => {
            let label = p.content_name;
            if (p.hook) label += ` ("${p.hook.substring(0,20)}...")`;
            opts += `<option value="${p.id}">${label}</option>`;
        });
        
        const valA = selA.value;
        const valB = selB.value;
        selA.innerHTML = opts;
        selB.innerHTML = opts;
        selA.value = valA;
        selB.value = valB;
    },

    compareHooks() {
        const idA = document.getElementById('abSelectA').value;
        const idB = document.getElementById('abSelectB').value;
        
        const fill = (id, prefix) => {
            const p = this.performances.find(x => x.id == id);
            if (p) {
                document.getElementById(`${prefix}Views`).value = p.views;
                document.getElementById(`${prefix}DM`).value = p.dms;
                document.getElementById(`${prefix}Lead`).value = p.leads;
                document.getElementById(`${prefix}Reg`).value = p.registrants;
            } else {
                document.getElementById(`${prefix}Views`).value = 0;
                document.getElementById(`${prefix}DM`).value = 0;
                document.getElementById(`${prefix}Lead`).value = 0;
                document.getElementById(`${prefix}Reg`).value = 0;
            }
        };
        
        fill(idA, 'hookA');
        fill(idB, 'hookB');
    },

    // ==================== KOMISI ====================
    calculateKomisi() {
        let n = parseInt(document.getElementById('komisiInput').value) || 0;
        let t1 = 0, t2 = 0, total = 0;

        if (n > 0) {
            if (n < 4) {
                t1 = n * 750000;
                total = t1;
            } else {
                t2 = n * 1000000;
                total = t2;
            }
        }

        document.getElementById('komisi1').textContent = 'Rp' + t1.toLocaleString('id-ID');
        document.getElementById('komisi2').textContent = 'Rp' + t2.toLocaleString('id-ID');
        const k3 = document.getElementById('komisi3');
        if (k3) k3.textContent = 'Rp0';
        document.getElementById('komisiTotal').textContent = 'Rp' + total.toLocaleString('id-ID');
    },

    setKomisiExample(n) {
        document.getElementById('komisiInput').value = n;
        this.calculateKomisi();
    },

    // ==================== CALENDAR & CHECKLIST ====================
    async loadCalendar() {
        const res = await this.apiCall('calendar', 'list');
        if (res) {
            this.calendar = res.data;
            this.renderCalendar();
        }
    },

    renderCalendar() {
        const tbody = document.getElementById('calTableBody');
        tbody.innerHTML = '';
        if (this.calendar.length === 0) {
            document.getElementById('calEmpty').hidden = false;
            document.getElementById('calTable').hidden = true;
            return;
        }
        document.getElementById('calEmpty').hidden = true;
        document.getElementById('calTable').hidden = false;

        const colors = { 'ide': 'var(--gray-500)', 'script': 'var(--yellow-500)', 'ready': 'var(--blue-500)', 'posted': 'var(--green-500)' };

        this.calendar.forEach(c => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${c.planned_date.substring(5)}</td>
                <td><strong>${c.title}</strong><br><span class="text-xs text-muted">${c.platform}</span></td>
                <td><span class="badge" style="background:${colors[c.production_status] || '#555'};">${c.production_status}</span></td>
                <td>
                    <button class="btn btn-sm btn-ghost" onclick="App.editCal(${c.id})">✏️</button>
                    <button class="btn btn-sm btn-ghost" onclick="App.deleteData('calendar', ${c.id})" style="color:var(--red-500);">❌</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    },

    async saveCal(e) {
        e.preventDefault();
        const id = document.getElementById('calEditId').value;
        const payload = {
            planned_date: document.getElementById('calDate').value,
            platform: document.getElementById('calPlatform').value,
            title: document.getElementById('calTitle').value,
            theme: document.getElementById('calTheme').value,
            production_status: document.getElementById('calStatus').value
        };
        const res = await this.apiCall('calendar', id ? 'update' : 'create', { ...payload, id });
        if (res) {
            this.resetCalForm();
            this.loadCalendar();
        }
    },

    editCal(id) {
        const c = this.calendar.find(x => parseInt(x.id) === parseInt(id));
        if (!c) return;
        document.getElementById('calEditId').value = c.id;
        document.getElementById('calDate').value = c.planned_date;
        document.getElementById('calPlatform').value = c.platform;
        document.getElementById('calTitle').value = c.title;
        document.getElementById('calTheme').value = c.theme || '';
        document.getElementById('calStatus').value = c.production_status;
    },

    resetCalForm() {
        document.getElementById('calForm').reset();
        document.getElementById('calEditId').value = '';
    },

    async loadChecklist() {
        const today = new Date().toISOString().split('T')[0];
        const res = await this.apiCall('checklist', 'list', { date: today });
        if (res) {
            this.renderChecklist(res.data || {});
        }
    },

    renderChecklist(dataObj) {
        const items = [
            { id: 'chk_1', label: 'Cari 1 ide konten hari ini' },
            { id: 'chk_2', label: 'Tulis 1 script pendek' },
            { id: 'chk_3', label: 'Balas DM / Komentar' },
            { id: 'chk_4', label: 'Follow up lead yang masih menggantung' },
            { id: 'chk_5', label: 'Cek performa video kemarin' },
            { id: 'chk_6', label: 'Post minimal 1 konten' },
            { id: 'chk_7', label: 'Baca materi syariah (10 menit)' }
        ];

        const container = document.getElementById('dailyChecklist');
        container.innerHTML = '';
        
        let doneCount = 0;

        items.forEach(item => {
            const isChecked = dataObj[item.id] === true;
            if(isChecked) doneCount++;
            
            const div = document.createElement('div');
            div.className = 'checklist-item';
            div.innerHTML = `
                <input type="checkbox" id="${item.id}" ${isChecked ? 'checked' : ''} onchange="App.saveChecklist()">
                <label for="${item.id}">${item.label}</label>
            `;
            container.appendChild(div);
        });

        const pct = Math.round((doneCount / items.length) * 100);
        document.getElementById('checklistProgress').style.width = pct + '%';
    },

    async saveChecklist() {
        const today = new Date().toISOString().split('T')[0];
        const boxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
        const items = {};
        boxes.forEach(b => items[b.id] = b.checked);
        
        await this.apiCall('checklist', 'save', { date: today, items: items });
        // update progress bar visually
        const doneCount = Array.from(boxes).filter(b => b.checked).length;
        const pct = Math.round((doneCount / boxes.length) * 100);
        document.getElementById('checklistProgress').style.width = pct + '%';
    },

    async resetChecklist() {
        const today = new Date().toISOString().split('T')[0];
        await this.apiCall('checklist', 'reset', { date: today });
        this.loadChecklist();
    },

    // ==================== ASSETS ====================
    async loadAssets(type = 'prompt_karakter') {
        const res = await this.apiCall('assets', 'list', { type });
        if (res) {
            const container = document.getElementById('assetListContainer');
            container.innerHTML = res.data.map(a => `
                <div class="bank-item">
                    <span class="bank-item-text">${a.content}</span>
                    <button class="btn btn-sm btn-ghost" onclick="App.copyToClipboard('${a.content.replace(/'/g, "\\'").replace(/\n/g, "\\n")}')">📋</button>
                    <button class="btn btn-sm btn-ghost" onclick="App.deleteData('assets', ${a.id}, '${type}')" style="color:var(--red-500);">❌</button>
                </div>
            `).join('') || '<p class="text-muted">Belum ada asset di kategori ini.</p>';
            
            // Set active type for form
            document.getElementById('assetForm').setAttribute('data-type', type);
            let lbl = 'Asset';
            if(type.includes('prompt')) lbl = 'Prompt';
            else if(type === 'voiceover') lbl = 'Catatan Voiceover';
            else if(type === 'caption') lbl = 'Catatan Caption';
            document.getElementById('assetInputLabel').textContent = `Tambah ${lbl} Baru`;
        }
    },

    async saveAsset(e) {
        e.preventDefault();
        const type = document.getElementById('assetForm').getAttribute('data-type') || 'prompt_karakter';
        const content = document.getElementById('assetInput').value;
        const res = await this.apiCall('assets', 'create', { asset_type: type, content });
        if (res) {
            document.getElementById('assetInput').value = '';
            this.loadAssets(type);
        }
    },

    // ==================== COMMON CRUD / UTILS ====================
    deleteData(module, id, extraParam = null) {
        this.confirmAction('Hapus Data', 'Yakin ingin menghapus data ini?', async () => {
            const res = await this.apiCall(module, 'delete', { id });
            if (res) {
                if (module === 'leads') this.loadLeads();
                else if (module === 'contents') this.loadContents();
                else if (module === 'performances') this.loadPerformance();
                else if (module === 'calendar') this.loadCalendar();
                else if (module === 'assets') this.loadAssets(extraParam);
                if(['leads','performances'].includes(module)) this.loadDashboard();
            }
        });
    },

    resetModule(module) {
        this.confirmAction('Reset Semua Data', `Yakin ingin mereset SEMUA data ${module}?`, async () => {
            const res = await this.apiCall(module, 'reset');
            if (res) {
                if (module === 'contents') this.loadContents();
            }
        });
    },

    confirmAction(title, message, callback) {
        const modal = document.getElementById('confirmModal');
        document.getElementById('confirmTitle').textContent = title;
        document.getElementById('confirmMessage').textContent = message;
        modal.hidden = false;

        const onOk = () => { close(); callback(); };
        const onCancel = () => { close(); };
        const close = () => {
            modal.hidden = true;
            document.getElementById('confirmOk').removeEventListener('click', onOk);
            document.getElementById('confirmCancel').removeEventListener('click', onCancel);
        };

        document.getElementById('confirmOk').addEventListener('click', onOk);
        document.getElementById('confirmCancel').addEventListener('click', onCancel);
    },

    exportCSV(type) {
        let data = [];
        let filename = '';
        let headers = [];

        if (type === 'leads') {
            data = this.leads;
            filename = 'leads_export.csv';
            headers = ['Tanggal', 'Nama', 'Kontak', 'Platform', 'Status', 'Catatan'];
        } else if (type === 'performance') {
            data = this.performances;
            filename = 'performance_export.csv';
            headers = ['Tanggal', 'Konten', 'Platform', 'Views', 'Likes', 'Comments', 'Shares', 'DM', 'Leads', 'Pendaftar'];
        }

        if (data.length === 0) return this.showToast('Data kosong', 'error');

        let csv = headers.join(',') + '\n';
        data.forEach(row => {
            let rowData = [];
            if (type === 'leads') {
                rowData = [row.entry_date, `"${row.name}"`, `"${row.contact}"`, row.platform, row.status, `"${row.notes || ''}"`];
            } else if (type === 'performance') {
                rowData = [row.post_date, `"${row.content_name}"`, row.platform, row.views, row.likes, row.comments, row.shares, row.dms, row.leads, row.registrants];
            }
            csv += rowData.join(',') + '\n';
        });

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },

    // ==================== MIGRATION FEATURE ====================
    checkLocalStorageMigration() {
        const lsLeads = localStorage.getItem('cs_leads');
        const lsContents = localStorage.getItem('cs_contents');
        const lsPerf = localStorage.getItem('cs_performance');
        
        if (lsLeads || lsContents || lsPerf) {
            document.getElementById('migrationAlert').style.display = 'block';
        }
    },
    
    async importFromLocalStorage() {
        this.confirmAction('Import Data', 'Proses ini akan mengimpor data localStorage ke database. Lanjutkan?', async () => {
            let successCount = 0;
            
            const lsLeads = JSON.parse(localStorage.getItem('cs_leads') || '[]');
            if(lsLeads.length > 0) {
                const res = await this.apiCall('settings', 'import', { import_type: 'leads', data: lsLeads });
                if(res) successCount++;
            }
            
            const lsContents = JSON.parse(localStorage.getItem('cs_contents') || '[]');
            if(lsContents.length > 0) {
                const res = await this.apiCall('settings', 'import', { import_type: 'contents', data: lsContents });
                if(res) successCount++;
            }
            
            const lsPerf = JSON.parse(localStorage.getItem('cs_performance') || '[]');
            if(lsPerf.length > 0) {
                const res = await this.apiCall('settings', 'import', { import_type: 'performance', data: lsPerf });
                if(res) successCount++;
            }
            
            if(successCount > 0) {
                this.showToast('Import berhasil. Menghapus localStorage lama...');
                localStorage.removeItem('cs_leads');
                localStorage.removeItem('cs_contents');
                localStorage.removeItem('cs_performance');
                localStorage.removeItem('cs_calendar');
                localStorage.removeItem('cs_checklist');
                document.getElementById('migrationAlert').style.display = 'none';
                setTimeout(() => window.location.reload(), 1500);
            } else {
                this.showToast('Tidak ada data yang valid untuk diimport.', 'error');
                document.getElementById('migrationAlert').style.display = 'none';
            }
        });
    },

    // ==================== INITIALIZATION ====================
    init() {
        this.initNav();
        
        // Listeners
        document.getElementById('leadForm').addEventListener('submit', (e) => this.saveLead(e));
        document.getElementById('contentForm').addEventListener('submit', (e) => this.saveContent(e));
        document.getElementById('perfForm').addEventListener('submit', (e) => this.savePerf(e));
        document.getElementById('calForm').addEventListener('submit', (e) => this.saveCal(e));
        document.getElementById('assetForm').addEventListener('submit', (e) => this.saveAsset(e));

        // Initial Load Dashboard
        this.onSectionEnter('dashboard');
        
        // Check for old data
        this.checkLocalStorageMigration();
    }
};

// Start App
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
