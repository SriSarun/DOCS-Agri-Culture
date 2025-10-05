document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('crop-table-body');


    // Fetch and populate the crops table
    const populateTable = async () => {
        try {
            const response = await fetch('/api/crops');
            const crops = await response.json();
            tableBody.innerHTML = '';
            if (crops.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="3" class="p-4 text-center">There are no crops..</td></tr>';
                return;
            }
            crops.forEach(crop => {
                const row = `
                    <tr id="crop-${crop._id}">
                        <td class="p-3">${crop.name}</td>
                        <td class="p-3">${crop.sowingSeason || 'N/A'}</td>
                        <td class="p-3 text-center">
                            <a href="/admin/edit/${crop._id}" class="text-blue-600 hover:underline mr-4"> Edit </a>
                            <button data-id="${crop._id}" class="delete-btn text-red-600 hover:underline"> Delete </button>
                        </td>
                    </tr>`;
                tableBody.insertAdjacentHTML('beforeend', row);
            });
        } catch (error) { console.error('Dashboard error:', error); }
    };


    // Handle delete button clicks
    tableBody.addEventListener('click', async (event) => {
        if (event.target.classList.contains('delete-btn')) {
            const cropId = event.target.dataset.id;
            if (confirm('Do you want to remove this crop?')) {
                try {
                    const response = await fetch(`/api/crops/${cropId}`, { method: 'DELETE' });
                    if (!response.ok) throw new Error('Error deleting');
                    document.getElementById(`crop-${cropId}`).remove();
                } catch (error) { alert(`error: ${error.message}`); }
            }
        }
    });

    populateTable();
});