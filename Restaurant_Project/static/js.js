document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('predictionForm');
    
    // Only run if the form exists
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show the results area
            const resultsArea = document.getElementById('resultsArea');
            resultsArea.classList.remove('hidden');

            // Render the chart
            const ctx = document.getElementById('predictionChart').getContext('2d');
            
            // Safety check: destroy old chart if it exists to prevent glitches
            if (window.myNexusChart) {
                window.myNexusChart.destroy();
            }

            window.myNexusChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
                    datasets: [{
                        label: 'Predicted Sales ($)',
                        data: [1200, 1900, 3000, 5000, 2000, 3000, 4500],
                        borderColor: '#00b4b4',
                        backgroundColor: 'rgba(0, 180, 180, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: { responsive: true, plugins: { legend: { display: false } } }
            });
        });
    }
});