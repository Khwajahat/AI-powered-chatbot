const form = document.getElementById('spec-form');
const resultDiv = document.getElementById('result');
const clearBtn = document.getElementById('clear-btn');
const presetBtns = document.querySelectorAll('[data-preset]');
const genreSelect = document.getElementById('genre-filter');
const preferredGenre = document.getElementById('preferred-genre');

function scoreClass(score) {
	if (score >= 1.0) return 'good';
	if (score >= 0.7) return 'ok';
	return 'poor';
}

function showSkeleton() {
	resultDiv.innerHTML = `
		<div class="skeleton-grid">
			<div class="skeleton"></div>
			<div class="skeleton"></div>
			<div class="skeleton"></div>
		</div>
	`;
}

function ringMarkup(percent, label) {
	const circ = 56, radius = 56/2 - 8/2; // but we're using fixed dasharray
	const dash = 175.8; // 2 * Math.PI * r (approx)
	const offset = Math.max(0, Math.min(dash, dash - (dash * (percent / 100))));
	return `
		<div class="ring">
			<svg viewBox="0 0 56 56">
				<defs>
					<linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
						<stop offset="0%" stop-color="#06b6d4" />
						<stop offset="100%" stop-color="#22d3ee" />
					</linearGradient>
				</defs>
				<circle class="bg" cx="28" cy="28" r="24"></circle>
				<circle class="fg" cx="28" cy="28" r="24" style="stroke-dashoffset:${offset}"></circle>
			</svg>
			<div class="label">${label}</div>
		</div>
	`;
}

function renderCards(payload) {
	const { user_specs, results, error } = payload || {};
	if (error) {
		resultDiv.innerHTML = `<div class="card">Error: ${error}</div>`;
		return;
	}
	if (!Array.isArray(results) || results.length === 0) {
		resultDiv.innerHTML = `<div class="card">No matching games found for your specs.</div>`;
		return;
	}

	// Filter by preferred genre if set
	let filtered = results;
	if (preferredGenre && preferredGenre.value && preferredGenre.value !== 'any') {
		filtered = results.filter(r => (r.genre || '').toLowerCase() === preferredGenre.value.toLowerCase());
		if (filtered.length === 0) filtered = results; // fallback to all if none match
	}

	// Populate genre filter from current results
	const genres = Array.from(new Set(results.map(r => (r.genre || '').trim()).filter(Boolean)));
	genreSelect.innerHTML = '<option value="all" selected>All genres</option>' + genres.map(g => `<option value="${g}">${g}</option>`).join('');

	const header = `
		<div class="card">
			<h3>Top Suggestions</h3>
			<small>Your specs — CPU: ${user_specs.cpu_score}, GPU: ${user_specs.gpu_score}, RAM: ${user_specs.ram_gb}GB</small>
		</div>
	`;

	const cards = filtered.map((r, i) => {
		const cls = scoreClass(r.score);
		const pct = Math.max(0, Math.min(120, Math.round(r.score * 100)));
		return `
			<div class="game-card" style="animation-delay: ${i * 60}ms" data-genre="${r.genre || ''}">
				<div class="game-title">
					${ringMarkup(pct, r.score)}
					<div>
						<strong>${r.title}</strong>
						<div class="game-genre">${r.genre || ''}</div>
					</div>
				</div>
				<div class="specs">
					<div>
						<div class="badge ${cls}">Min</div>
						<div style="margin-top:6px; font-size:12px; color:#94a3b8;">CPU ${r.minimum_specs.cpu} • GPU ${r.minimum_specs.gpu} • RAM ${r.minimum_specs.ram}GB</div>
					</div>
					<div>
						<div class="badge ${cls}">Rec</div>
						<div style="margin-top:6px; font-size:12px; color:#94a3b8;">CPU ${r.recommended_specs.cpu} • GPU ${r.recommended_specs.gpu} • RAM ${r.recommended_specs.ram}GB</div>
					</div>
				</div>
			</div>
		`;
	}).join('');

	resultDiv.innerHTML = header + `<div class="cards" id="results-cards">${cards}</div>`;
}

function applyPreset(preset) {
	const cpu = document.getElementById('cpu');
	const gpu = document.getElementById('gpu');
	const ram = document.getElementById('ram');
	if (preset === 'low') {
		cpu.value = 'i3-8100';
		gpu.value = 'GTX 1050';
		ram.value = '8';
	} else if (preset === 'mid') {
		cpu.value = 'i5-10400';
		gpu.value = 'GTX 1660';
		ram.value = '16';
	} else if (preset === 'high') {
		cpu.value = 'Ryzen 7 3700X';
		gpu.value = 'RTX 3070';
		ram.value = '32';
	}
}

function clearForm() {
	document.getElementById('cpu').value = '';
	document.getElementById('gpu').value = '';
	document.getElementById('ram').value = '';
	if (preferredGenre) preferredGenre.value = 'any';
	resultDiv.innerHTML = '';
}

function filterByGenre() {
	const val = genreSelect.value;
	const cards = document.querySelectorAll('#results-cards .game-card');
	cards.forEach(card => {
		const g = (card.getAttribute('data-genre') || '').trim();
		card.style.display = (val === 'all' || g === val) ? '' : 'none';
	});
}

genreSelect?.addEventListener('change', filterByGenre);

presetBtns.forEach(btn => btn.addEventListener('click', () => applyPreset(btn.dataset.preset)));

clearBtn.addEventListener('click', () => clearForm());

form.addEventListener('submit', async (e) => {
	e.preventDefault();
	const payload = {
		cpu: document.getElementById('cpu').value,
		gpu: document.getElementById('gpu').value,
		ram: document.getElementById('ram').value
	};

	showSkeleton();
	try {
		const res = await fetch('/api/recommend', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		});
		const data = await res.json();
		renderCards(data);
		genreSelect.value = 'all';
	} catch (err) {
		resultDiv.innerHTML = `<div class="card">${err.message || String(err)}</div>`;
	}
});
