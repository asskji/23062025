document.addEventListener('DOMContentLoaded', function () {
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('.section');

navItems.forEach(item => {
    item.addEventListener('click', function () {
        const sectionId = this.getAttribute('data-section');

        navItems.forEach(navItem => navItem.classList.remove('active'));
        sections.forEach(section => section.classList.remove('active'));

        this.classList.add('active');
        document.getElementById(sectionId).classList.add('active');
    });
});

const areaSelect = document.getElementById('area-select');
const machineSelect = document.getElementById('machine-select');
const operatorCol = document.getElementById('operator-col');

areaSelect.addEventListener('change', function () {
    if (this.value === 'format-cutting') {
        machineSelect.value = 'machine1';
    }


    if (this.value !== 'edge-banding2') {
        operatorCol.classList.add('hidden');
        document.getElementById('operator-select').value = 'operator1';
    } else {
        operatorCol.classList.remove('hidden');
    }
});
const shiftCountInput = document.getElementById('shift-count');
const shiftInputsContainer = document.getElementById('shift-inputs-container');

shiftCountInput.addEventListener('change', function () {
    const shiftCount = parseInt(this.value);
    const area = document.getElementById('area-select').value;
    shiftInputsContainer.innerHTML = '';

    if (shiftCount <= 0) return;

    for (let i = 1; i <= shiftCount; i++) {
        const shiftGroup = document.createElement('div');
        shiftGroup.className = 'shift-group';

        const shiftTitle = document.createElement('div');
        shiftTitle.className = 'shift-title';
        shiftTitle.textContent = `Смена ${i}`;
        shiftGroup.appendChild(shiftTitle);

        const formRow = document.createElement('div');
        formRow.className = 'form-row';

        // В зависимости от участка показываем разные поля
        if (area === 'format-cutting') {
            // Форматно-раскроечный участок
            const operativeTimeCol = document.createElement('div');
            operativeTimeCol.className = 'form-col';
            operativeTimeCol.innerHTML = `
                        <div class="form-group">
                            <label>Введите оперативное время для смены ${i} (чч:мм:сс)</label>
                            <input type="text" class="operative-time" placeholder="00:00:00" data-shift="${i}" maxlength="8">
                        </div>
                    `;
            formRow.appendChild(operativeTimeCol);

            const durationCol = document.createElement('div');
            durationCol.className = 'form-col';
            durationCol.innerHTML = `
                        <div class="form-group">
                            <label>Введите длительность для смены ${i} (чч:мм:сс)</label>
                            <input type="text" class="duration" placeholder="00:00:00" data-shift="${i}" maxlength="8">
                        </div>
                    `;
            formRow.appendChild(durationCol);
        }
        else if (area === 'edge-banding1' || area === 'edge-banding2') {
            // Кромко-облицовочные участки
            const operativeTimeCol = document.createElement('div');
            operativeTimeCol.className = 'form-col';
            operativeTimeCol.innerHTML = `
                        <div class="form-group">
                            <label>Введите оперативное время для смены ${i} (чч:мм:сс)</label>
                            <input type="text" class="operative-time" placeholder="00:00:00" data-shift="${i}" maxlength="8">
                        </div>
                    `;
            formRow.appendChild(operativeTimeCol);

            const reconfigurationsCol = document.createElement('div');
            reconfigurationsCol.className = 'form-col';
            reconfigurationsCol.innerHTML = `
                        <div class="form-group">
                            <label>Введите перестройки для смены ${i} (чч:мм:сс)</label>
                            <input type="text" class="reconfigurations" placeholder="00:00:00" data-shift="${i}" maxlength="8">
                        </div>
                    `;
            formRow.appendChild(reconfigurationsCol);

            const durationCol = document.createElement('div');
            durationCol.className = 'form-col';
            durationCol.innerHTML = `
                        <div class="form-group">
                            <label>Введите длительность для смены ${i} (чч:мм:сс)</label>
                            <input type="text" class="duration" placeholder="00:00:00" data-shift="${i}" maxlength="8">
                        </div>
                    `;
            formRow.appendChild(durationCol);
        }
        else if (area === 'nesting') {
            // Нестинг
            const operativeTimeCol = document.createElement('div');
            operativeTimeCol.className = 'form-col';
            operativeTimeCol.innerHTML = `
                        <div class="form-group">
                            <label>Введите оперативное время для смены ${i} (чч:мм:сс)</label>
                            <input type="text" class="operative-time" placeholder="00:00:00" data-shift="${i}" maxlength="8">
                        </div>
                    `;
            formRow.appendChild(operativeTimeCol);
        }
        else if (area === 'membrane-pressing') {
            // Мембранно-вакуумный
            const durationCol = document.createElement('div');
            durationCol.className = 'form-col';
            durationCol.innerHTML = `
                        <div class="form-group">
                            <label>Введите длительность для смены ${i} (чч:мм:сс)</label>
                            <input type="text" class="duration" placeholder="00:00:00" data-shift="${i}" maxlength="8">
                        </div>
                    `;
            formRow.appendChild(durationCol);
        }

        shiftGroup.appendChild(formRow);
        shiftInputsContainer.appendChild(shiftGroup);
    }


    addTimeInputHandlers();
});


function addTimeInputHandlers() {
    const timeInputs = document.querySelectorAll('.operative-time, .duration, .reconfigurations');

    timeInputs.forEach(input => {
        input.addEventListener('input', function (e) {
            let value = this.value.replace(/[^\d]/g, '');

            if (value.length > 2) {
                value = value.substring(0, 2) + ':' + value.substring(2);
            }
            if (value.length > 5) {
                value = value.substring(0, 5) + ':' + value.substring(5, 7);
            }

            this.value = value;
        });


        input.addEventListener('paste', function (e) {
            e.preventDefault();
            let pasteData = e.clipboardData.getData('text').replace(/[^\d]/g, '');

            if (pasteData.length >= 6) {
                this.value = pasteData.substring(0, 2) + ':' +
                    pasteData.substring(2, 4) + ':' +
                    pasteData.substring(4, 6);
            }
        });
    });
}

function timeToMinutes(timeStr) {
    if (!timeStr) return 0;

    const parts = timeStr.split(':');
    if (parts.length !== 3) return 0;

    const hours = parseInt(parts[0]) || 0;
    const minutes = parseInt(parts[1]) || 0;
    const seconds = parseInt(parts[2]) || 0;

    return hours * 60 + minutes + Math.round(seconds / 60);
}


const modal = document.getElementById('deleteModal');
const cancelBtn = document.querySelector('.cancel-btn');
const deleteConfirmBtn = document.querySelector('.delete-confirm-btn');
let rowToDelete = null;


const deleteAllModal = document.getElementById('deleteAllModal');
const deleteAllConfirmBtn = document.querySelector('.delete-all-confirm-btn');


document.addEventListener('click', function (e) {
    if (e.target.classList.contains('delete-btn') || e.target.parentElement.classList.contains('delete-btn')) {
        rowToDelete = e.target.closest('tr');
        modal.style.display = 'block';
    }

    if (e.target.id === 'delete-all-btn') {
        deleteAllModal.style.display = 'block';
    }
});

cancelBtn.addEventListener('click', function () {
    modal.style.display = 'none';
    deleteAllModal.style.display = 'none';
    rowToDelete = null;
});

deleteConfirmBtn.addEventListener('click', function () {
    if (rowToDelete) {
        rowToDelete.remove();
        modal.style.display = 'none';
        rowToDelete = null;
        saveDataToLocalStorage();
    }
});


deleteAllConfirmBtn.addEventListener('click', function () {
    const tables = document.querySelectorAll('table tbody');
    tables.forEach(table => {
        table.innerHTML = '';
    });
    deleteAllModal.style.display = 'none';
    saveDataToLocalStorage();
});


window.addEventListener('click', function (e) {
    if (e.target === modal || e.target === deleteAllModal) {
        modal.style.display = 'none';
        deleteAllModal.style.display = 'none';
        rowToDelete = null;
    }
});


document.addEventListener('click', function (e) {
    if (e.target.classList.contains('full-report-btn')) {
        const sectionId = e.target.closest('.section').id;
        const table = document.querySelector(`#${sectionId}-table`);
        table.querySelectorAll('th, td').forEach(cell => cell.style.display = '');
    }

    if (e.target.classList.contains('short-report-btn')) {
        const sectionId = e.target.closest('.section').id;
        const table = document.querySelector(`#${sectionId}-table`);
        const headers = table.querySelectorAll('th');
        const rows = table.querySelectorAll('tbody tr');

        let nameIndex = 0;
        let salaryIndex = -1;

        headers.forEach((header, index) => {
            if (header.textContent.includes('ЗП') || header.textContent.includes('Стоп') || header.textContent.includes('СТоп') || header.textContent.includes('Тсмен')) {
                salaryIndex = index;
            }
        });

        headers.forEach((header, index) => {
            if (index !== nameIndex && index !== salaryIndex && !header.textContent.includes('Удалить')) {
                header.style.display = 'none';
            }
        });

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            cells.forEach((cell, index) => {
                if (index !== nameIndex && index !== salaryIndex && !cell.classList.contains('delete-btn')) {
                    cell.style.display = 'none';
                }
            });
        });
    }
});

function saveDataToLocalStorage() {
    const data = {};
    const tables = document.querySelectorAll('table');

    tables.forEach(table => {
        const sectionId = table.id.replace('-table', '');
        const rows = table.querySelectorAll('tbody tr');
        const tableData = [];

        rows.forEach(row => {
            const rowData = [];
            row.querySelectorAll('td').forEach((cell, index) => {
                if (!cell.classList.contains('delete-btn')) {
                    rowData.push(cell.textContent);
                }
            });
            tableData.push(rowData);
        });

        data[sectionId] = tableData;
    });

    localStorage.setItem('calculatorData', JSON.stringify(data));
}

function loadDataFromLocalStorage() {
    const savedData = localStorage.getItem('calculatorData');
    if (savedData) {
        const data = JSON.parse(savedData);

        for (const sectionId in data) {
            const table = document.querySelector(`#${sectionId}-table tbody`);
            if (table) {
                const rowsData = data[sectionId];

                rowsData.forEach(rowData => {
                    const newRow = document.createElement('tr');
                    let rowHtml = '';
                    if (sectionId === 'format-cutting') {
                        rowHtml = `
                                    <td>${rowData[0]}</td>
                                    <td>${rowData[1]}</td>
                                    <td>${rowData[2]}</td>
                                    <td>${rowData[3]}</td>
                                    <td>${rowData[4]}</td>
                                    <td>${rowData[5]}</td>
                                    <td>${rowData[6]}</td>
                                    <td>${rowData[7]}</td>
                                    <td>${rowData[8]}</td>
                                    <td>${rowData[9]}</td>
                                    <td>${rowData[10]}</td>
                                    <td class="delete-btn"><i class="fas fa-times"></i></td>
                                `;
                    } else if (sectionId === 'edge-banding1') {
                        rowHtml = `
                                    <td>${rowData[0]}</td>
                                    <td>${rowData[1]}</td>
                                    <td>${rowData[2]}</td>
                                    <td>${rowData[3]}</td>
                                    <td>${rowData[4]}</td>
                                    <td>${rowData[5]}</td>
                                    <td>${rowData[6]}</td>
                                    <td>${rowData[7]}</td>
                                    <td>${rowData[8]}</td>
                                    <td>${rowData[9]}</td>
                                    <td>${rowData[10]}</td>
                                    <td>${rowData[11]}</td>
                                    <td>${rowData[12]}</td>
                                    <td>${rowData[13]}</td>
                                    <td class="delete-btn"><i class="fas fa-times"></i></td>
                                `;
                    } else if (sectionId === 'edge-banding2') {
                        rowHtml = `
                                    <td>${rowData[0]}</td>
                                    <td>${rowData[1]}</td>
                                    <td>${rowData[2]}</td>
                                    <td>${rowData[3]}</td>
                                    <td>${rowData[4]}</td>
                                    <td>${rowData[5]}</td>
                                    <td>${rowData[6]}</td>
                                    <td>${rowData[7]}</td>
                                    <td>${rowData[8]}</td>
                                    <td>${rowData[9]}</td>
                                    <td>${rowData[10]}</td>
                                    <td>${rowData[11]}</td>
                                    <td>${rowData[12]}</td>
                                    <td>${rowData[13]}</td>
                                    <td class="delete-btn"><i class="fas fa-times"></i></td>
                                `;
                    } else if (sectionId === 'nesting') {
                        rowHtml = `
                                    <td>${rowData[0]}</td>
                                    <td>${rowData[1]}</td>
                                    <td>${rowData[2]}</td>
                                    <td>${rowData[3]}</td>
                                    <td>${rowData[4]}</td>
                                    <td>${rowData[5]}</td>
                                    <td>${rowData[6]}</td>
                                    <td>${rowData[7]}</td>
                                    <td>${rowData[8]}</td>
                                    <td class="delete-btn"><i class="fas fa-times"></i></td>
                                `;
                    } else if (sectionId === 'membrane-pressing') {
                        rowHtml = `
                                    <td>${rowData[0]}</td>
                                    <td>${rowData[1]}</td>
                                    <td class="delete-btn"><i class="fas fa-times"></i></td>
                                `;
                    }

                    newRow.innerHTML = rowHtml;
                    table.appendChild(newRow);
                });
            }
        }
    }
}
function exportToExcel() {
    const tables = document.querySelectorAll('table');
    const wb = XLSX.utils.book_new();

    tables.forEach(table => {
        const sectionId = table.id.replace('-table', '');
        const worksheet = XLSX.utils.table_to_sheet(table);
        XLSX.utils.book_append_sheet(wb, worksheet, sectionId);
    });

    const date = new Date();
    const dateStr = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    XLSX.writeFile(wb, `Отчет_${dateStr}.xlsx`);
}
document.getElementById('export-excel-btn').addEventListener('click', exportToExcel);
document.getElementById('calculate-btn').addEventListener('click', function () {
    const operator = document.getElementById('ono-select').value;
    const area = document.getElementById('area-select').value;
    const operatorName = document.getElementById('operator-select').options[document.getElementById('operator-select').selectedIndex].text;
    const selectedOperator = document.getElementById('ono-select').options[document.getElementById('ono-select').selectedIndex].text;
    const operativeTimes = document.querySelectorAll('.operative-time');
    const durations = document.querySelectorAll('.duration');
    const reconfigurations = document.querySelectorAll('.reconfigurations');

    let totalOperativeTime = 0;
    let totalDuration = 0;
    let totalReconfigurations = 0;

    operativeTimes.forEach(input => {
        totalOperativeTime += timeToMinutes(input.value);
    });

    durations.forEach(input => {
        totalDuration += timeToMinutes(input.value);
    });

    reconfigurations.forEach(input => {
        totalReconfigurations += timeToMinutes(input.value);
    });

    const table = document.querySelector(`#${area}-table tbody`);
    const newRow = document.createElement('tr');

    if (area === 'format-cutting') {
        // Форматно-раскроечный участок
        const kmEff = totalOperativeTime / totalDuration * 100;
        const kkvPerem = 1;
        const kkvPost = 1;
        const kst = 1;
        const rop = 5;
        const stop = totalDuration * rop;
        let premia = 0;
        if (kmEff >= 74) {
            premia = 10000;
        }
        let zp = 0;
        if (totalDuration > 0) {
            zp = ((kst * (kmEff / 100) * stop) * kkvPerem * kkvPost + premia)
        }
        newRow.innerHTML = `
                    <td>${selectedOperator}</td>
                    <td>${totalOperativeTime}</td>
                    <td>${totalDuration}</td>
                    <td>${kmEff.toFixed(2)}</td>
                    <td>${kkvPerem}</td>
                    <td>${kkvPost}</td>
                    <td>${kst}</td>
                    <td>${rop}</td>
                    <td>${stop.toFixed(2)}</td>
                    <td>${premia}</td>
                    <td>${Math.round(zp)}</td>
                    <td class="delete-btn"><i class="fas fa-times"></i></td>
                `;
    }
    else if (area === 'edge-banding1') {
        // Кромко-облицовочный 1
        const obitogo = totalOperativeTime + totalReconfigurations;
        const kmEff = obitogo / totalDuration * 100;
        const rop = 14.3;
        const stom = totalDuration * rop;
        const stomKeff = stom * (kmEff / 100);
        const kop1 = 0.64;
        const stomTop1 = stomKeff * kop1;
        const kkv = 1;
        let premia = 0;
        if (kmEff >= 70) {
            premia = 10000;
        }
        const zp = stomTop1 * kkv + premia;
        newRow.innerHTML = `
                    <td>${selectedOperator}</td>
                    <td>${totalOperativeTime}</td>
                    <td>${totalReconfigurations}</td>
                    <td>${obitogo}</td>
                    <td>${totalDuration}</td>
                    <td>${(totalDuration - obitogo).toFixed(2)}</td>
                    <td>${kmEff.toFixed(2)}</td>
                    <td>${Math.round(stom)}</td>
                    <td>${Math.round(stomKeff)}</td>
                    <td>${kop1}</td>
                    <td>${Math.round(stomTop1)}</td>
                    <td>${kkv}</td>
                    <td>${premia}</td>
                    <td>${Math.round(zp)}</td>
                    <td class="delete-btn"><i class="fas fa-times"></i></td>
                `;
    }
    else if (area === 'edge-banding2') {
        // Кромко-облицовочный 2
        const obitogo = totalOperativeTime + totalReconfigurations;
        const kmEff = obitogo / totalDuration * 100;
        const rop = 15.6;
        const stom = totalDuration * rop;
        const stomKeff = stom * (kmEff / 100);
        const kop2 = 0.41;
        const stomTop2 = stomKeff * kop2;
        const kkv = 1;
        let premia = 0;
        if (kmEff >= 70) {
            premia = 6000;
        }
        const zp = stomTop2 * kkv + premia;
        newRow.innerHTML = `
                    <td>${operatorName}</td>
                    <td>${totalOperativeTime}</td>
                    <td>${totalReconfigurations}</td>
                    <td>${obitogo}</td>
                    <td>${totalDuration}</td>
                    <td>${(totalDuration - obitogo).toFixed(2)}</td>
                    <td>${kmEff.toFixed(2)}</td>
                    <td>${Math.round(stom)}</td>
                    <td>${Math.round(stomKeff)}</td>
                    <td>${kop2}</td>
                    <td>${Math.round(stomTop2)}</td>
                    <td>${kkv}</td>
                    <td>${premia}</td>
                    <td>${Math.round(zp)}</td>
                    <td class="delete-btn"><i class="fas fa-times"></i></td>
                `;
    }
    else if (area === 'nesting') {
        // Нестинг
        const shiftCount = parseInt(document.getElementById('shift-count').value) || 0;
        const trdv = 750 * shiftCount;
        const kmEff = totalOperativeTime / trdv * 100;
        const kkvPerem = 1;
        const kkvPost = 1;
        const rop = 2;
        const stop = trdv * rop;
        const zp = ((kmEff / 100) * stop) * kkvPerem * kkvPost;
        newRow.innerHTML = `
                    <td>${selectedOperator}</td>
                    <td>${totalOperativeTime}</td>
                    <td>${trdv}</td>
                    <td>${kmEff.toFixed(2)}</td>
                    <td>${kkvPerem}</td>
                    <td>${kkvPost}</td>
                    <td>${rop}</td>
                    <td>${stop.toFixed(2)}</td>
                    <td>${Math.round(zp)}</td>
                    <td class="delete-btn"><i class="fas fa-times"></i></td>
                `;
    }
    else if (area === 'membrane-pressing') {
        // Мембранно-вакуумный
        newRow.innerHTML = `
                    <td>${selectedOperator}</td>
                    <td>${totalDuration}</td>
                    <td class="delete-btn"><i class="fas fa-times"></i></td>
                `;
    }
    table.appendChild(newRow);
    saveDataToLocalStorage();
    document.querySelector(`.nav-item[data-section="${area}"]`).click();
    document.getElementById('ono-select').value = '';
    document.getElementById('area-select').value = '';
    document.getElementById('machine-select').value = '';
    document.getElementById('operator-select').value = '';
    document.getElementById('shift-count').value = '';
    shiftInputsContainer.innerHTML = '';
    operatorCol.classList.add('hidden');
});

loadDataFromLocalStorage();
});