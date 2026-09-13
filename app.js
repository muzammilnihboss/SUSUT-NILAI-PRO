// app.js - Enjin Pengurusan Data SusutNilai Pro

const AppStore = {
    getAssets: function() {
        return JSON.parse(localStorage.getItem('susutnilai_assets')) || [];
    },

    saveAsset: function(asset) {
        const assets = this.getAssets();
        asset.id = 'AST-' + String(assets.length + 1).padStart(3, '0');
        asset.tarikhKemaskini = new Date().toISOString().split('T')[0];
        assets.push(asset);
        localStorage.setItem('susutnilai_assets', JSON.stringify(assets));
    },

    getMetrics: function() {
        const assets = this.getAssets();
        const currentYear = new Date().getFullYear();
        let totalCost = 0, currentBookValue = 0, accDep = 0;

        assets.forEach(a => {
            const kos = parseFloat(a.jumlah) || 0;
            const sisa = parseFloat(a.nilaiSisa) || 0;
            const hayat = parseInt(a.jangkaHayat) || 1;
            const buyYear = new Date(a.tarikhBeli).getFullYear();
            
            const annualDep = (kos - sisa) / hayat;
            const yearsPassed = Math.max(1, currentYear - buyYear + 1);
            const currentAccDep = Math.min(kos - sisa, annualDep * yearsPassed);
            const bookVal = Math.max(sisa, kos - currentAccDep);

            totalCost += kos;
            accDep += currentAccDep;
            currentBookValue += bookVal;
        });

        return { totalCost, currentBookValue, accDep, count: assets.length };
    }
};

function renderDashboardMetrics() {
    const metrics = AppStore.getMetrics();
    if (document.getElementById('totalCost')) {
        document.getElementById('totalCost').innerText = 'RM ' + metrics.totalCost.toFixed(2);
        document.getElementById('bookValue').innerText = 'RM ' + metrics.currentBookValue.toFixed(2);
        document.getElementById('accDep').innerText = 'RM ' + metrics.accDep.toFixed(2);
        document.getElementById('registeredAssets').innerText = metrics.count;
    }
}
