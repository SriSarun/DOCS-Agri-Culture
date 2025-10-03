document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('crop-table-body');

    // Function to populate the table with crop data
    const populateTable = async () => {
        try {
            const response = await fetch('/api/crops');
            const crops = await response.json();

            tableBody.innerHTML = '';

            if (crops.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="4" class="p-4 text-center">There are no crops to save.</td></tr>';
                return;
            }

            // Populate table rows with crop data
            crops.forEach( crop => {
                const row = `
                    <tr id="crop-${crop._id}">
                        <td class="p-3">${crop.name}</td>
                        <td class="p-3">${crop.sowingSeason}</td>
                        <td class="p-3">${crop.growthDuration}</td>
                        <td class="p-3 text-center">
                            <a href="/admin/edit/${crop._id}" class="text-blue-600 hover:underline mr-4">Edit</a>
                            <button data-id="${crop._id}" class="delete-btn text-red-600 hover:underline">Delete</button>
                        </td>
                    </tr>
                `;
                tableBody.insertAdjacentHTML ('beforeend',row);
            });

        } catch (error) {
            tableBody.innerHTML = `<tr><td colspan="4" class="p-4 text-center text-red-600">error: ${error.message}</td></tr>`;
        }
    };

    
    // Add event listener for delete buttons
    tableBody.addEventListener('click', async (event) => {
        if (event.target.classList.contains('delete-btn')) {
            const cropId = event.target.dataset.id;

            if (confirm('Do you want to remove this crop?')) {
                try {
                    const response = await fetch(`/api/crops/${cropId}`, {
                        method: 'DELETE',
                    });

                    if (!response.ok) {
                        const result = await response.json();
                        throw new Error(result.message);
                    }

                    document.getElementById(`crop-${cropId}`).remove();

                } catch (error) {
                    alert('Error in removal: ${error.message}');
                }
            }
        }
    });
    populateTable();


});