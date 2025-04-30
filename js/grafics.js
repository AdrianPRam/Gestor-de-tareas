function initChart(tasks) {
    try {
        const canvas = document.getElementById('tasksChart');
        if (!canvas) {
            console.error('No se encontró el elemento #tasksChart en el DOM');
            return;
        }

        const completedTasks = tasks.filter(task => task.realitzada);
        const today = new Date();
        let startYear = today.getFullYear();
        if (completedTasks.length > 0) {
            const years = completedTasks
                .filter(task => task.data)
                .map(task => new Date(task.data).getFullYear());
            startYear = Math.min(...years);
        }

        const months = [];
        for (let year = startYear; year <= today.getFullYear(); year++) {
            const startMonth = year === startYear ? 0 : 0;
            const endMonth = year === today.getFullYear() ? today.getMonth() : 11;
            for (let month = startMonth; month <= endMonth; month++) {
                const date = new Date(year, month, 1);
                months.push(date.toLocaleString('es-ES', { month: 'short', year: 'numeric' }));
            }
        }

        const monthCounts = {};
        months.forEach(month => {
            monthCounts[month] = 0;
        });
        completedTasks.forEach(task => {
            if (task.data) {
                const date = new Date(task.data);
                const monthYear = date.toLocaleString('es-ES', { month: 'short', year: 'numeric' });
                if (monthYear in monthCounts) {
                    monthCounts[monthYear]++;
                }
            }
        });

        const labels = months;
        const data = labels.map(label => monthCounts[label]);
        const totalCompletedTasks = completedTasks.length;

        const colors = labels.map((_, index) => {
            const hue = (index * 137.5) % 360;
            return `hsl(${hue}, 70%, 60%)`;
        });

        if (canvas.chart) {
            canvas.chart.destroy();
        }

        canvas.chart = new Chart(canvas, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Tasques Acabades per Mes',
                    data: data,
                    backgroundColor: colors,
                    borderColor: colors,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { labels: { color: '#e0e0e0' } },
                    tooltip: { enabled: false }
                },
                scales: {
                    x: { ticks: { color: '#e0e0e0' }, grid: { color: '#555' } },
                    y: {
                        beginAtZero: true,
                        max: totalCompletedTasks || 1,
                        ticks: { color: '#e0e0e0', stepSize: 1 },
                        grid: { color: '#555' }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error al inicializar el gráfico:', error);
    }
}

export { initChart };

// no voy a mentir aqui he tenido bastante ayuda no tenia ni idea de como va chart
//la mitad es intentando añadir snippets de codigo de la pagina de charts y la otra es ayuda