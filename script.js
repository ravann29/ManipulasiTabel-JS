document.addEventListener("DOMContentLoaded", () => {
  // Data Awal
  let students = [
    {
      id: 1,
      nim: "123456789",
      nama: "Anisa Putri",
      kelas: "3A",
      prodi: "Sistem Informasi (S1)",
      alamat: "Jl. Merdeka No. 10",
    },
    {
      id: 2,
      nim: "234567890",
      nama: "Budi Santoso",
      kelas: "2B",
      prodi: "Informatika (S1)",
      alamat: "Jl. Pahlawan No. 5",
    },
    {
      id: 3,
      nim: "345678901",
      nama: "Citra Dewi",
      kelas: "4A",
      prodi: "Perbankan Syariah (S1)",
      alamat: "Jl. Diponegoro No. 15",
    },
    {
      id: 4,
      nim: "456789012",
      nama: "Dimas Prayoga",
      kelas: "1C",
      prodi: "Manajemen Bisnis Syariah (S1)",
      alamat: "Jl. Ahmad Yani No. 20",
    },
    {
      id: 5,
      nim: "567890123",
      nama: "Eka Fitriani",
      kelas: "3B",
      prodi: "Teknik Industri (S1)",
      alamat: "Jl. Sudirman No. 25",
    },
  ];

  // Daftar Prodi
  const prodiList = [
    "Perbankan Syariah (S1)",
    "Manajemen Bisnis Syariah (S1)",
    "Sistem Informasi (S1)",
    "Bisnis Digital (S1)",
    "Komputerisasi Akuntansi (D3)",
    "Agribisnis (S1)",
    "Teknologi Pangan (S1)",
    "Pendidikan Bahasa Inggris (S1)",
    "Bimbingan dan Konseling (S1)",
    "Teknik Industri (S1)",
    "Informatika (S1)",
  ];

  // API URL Serverless (simulasi)
  const API_URL = "https://api.example.com/students";

  // Elemen DOM
  const tableBody = document.getElementById("tableBody");
  const addButton = document.getElementById("addButton");
  const loadingIndicator = document.getElementById("loadingIndicator");
  const messageElement = document.getElementById("message");
  const saveToLocalStorageBtn = document.getElementById("saveToLocalStorage");
  const saveToAPIBtn = document.getElementById("saveToAPI");
  const loadFromLocalStorageBtn = document.getElementById(
    "loadFromLocalStorage"
  );
  const loadFromAPIBtn = document.getElementById("loadFromAPI");
  const clearDataBtn = document.getElementById("clearDataBtn");
  const storageMessage = document.getElementById("storageMessage");
  const editModal = document.getElementById("editModal");
  const closeEditModal = document.getElementById("closeEditModal");
  const editForm = document.getElementById("editForm");
  const cellEditor = document.getElementById("cellEditor");
  const cellInput = document.getElementById("cellInput");
  const cellSaveBtn = document.getElementById("cellSaveBtn");
  const cellCancelBtn = document.getElementById("cellCancelBtn");
  const restoreButton = document.getElementById("restoreButton");

  let editingCell = null;
  let deletedStudents = [];

  // Fungsi untuk menampilkan pesan
  function showMessage(message, type = "info") {
    messageElement.textContent = message;
    messageElement.className = `message ${type}`;
    messageElement.style.display = "block";

    setTimeout(() => {
      messageElement.style.display = "none";
    }, 3000);
  }

  // Fungsi untuk menampilkan pesan penyimpanan
  function showStorageMessage(message, isSuccess = true) {
    storageMessage.textContent = message;
    storageMessage.className = isSuccess ? "success-message" : "error-message";
    storageMessage.style.display = "block";

    setTimeout(() => {
      storageMessage.style.display = "none";
    }, 3000);
  }

  // Function to save data to cookie
  function saveToCookie() {
    try {
      const studentsJSON = JSON.stringify(students);
      // Periksa ukuran data
      if (studentsJSON.length > 4000) {
        showStorageMessage(
          "Data terlalu besar untuk disimpan di cookie (>4kb)",
          false
        );
        return false;
      }

      // Set cookie dengan expiry 30 hari
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);
      document.cookie = `studentData=${encodeURIComponent(
        studentsJSON
      )};expires=${expiryDate.toUTCString()};path=/`;

      showStorageMessage("Data berhasil disimpan ke cookie");
      return true;
    } catch (error) {
      showStorageMessage(
        "Gagal menyimpan data ke cookie: " + error.message,
        false
      );
      return false;
    }
  }

  // Function to load data from cookie
  function loadFromCookie() {
    try {
      const cookies = document.cookie.split(";");
      for (let cookie of cookies) {
        const [name, value] = cookie.trim().split("=");
        if (name === "studentData") {
          const studentsJSON = decodeURIComponent(value);
          students = JSON.parse(studentsJSON);
          renderTable();
          showStorageMessage("Data berhasil dimuat dari cookie");
          return true;
        }
      }
      showStorageMessage("Tidak ada data yang tersimpan di cookie", false);
      return false;
    } catch (error) {
      showStorageMessage(
        "Gagal memuat data dari cookie: " + error.message,
        false
      );
      return false;
    }
  }

  // Function to save data to API (simulasi) with retry mechanism
  async function saveToAPIServer(retries = 3) {
    if (retries <= 0) {
      loadingIndicator.style.display = "none";
      return;
    }

    loadingIndicator.style.display = "block";
    try {
      // Simulasi API call dengan mock data karena URL tidak valid
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulasi successful response
      showStorageMessage("Data berhasil disimpan ke server");
      loadingIndicator.style.display = "none";
    } catch (error) {
      if (retries > 1) {
        setTimeout(() => saveToAPIServer(retries - 1), 1000);
      } else {
        showStorageMessage("Gagal menyimpan data ke server", false);
        loadingIndicator.style.display = "none";
      }
    }
  }

  // Function to load data from API (simulasi) with retry mechanism
  async function loadFromAPIServer(retries = 3) {
    if (retries <= 0) {
      loadingIndicator.style.display = "none";
      return;
    }

    loadingIndicator.style.display = "block";
    try {
      // Simulasi API call dengan mock data
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulasi successful response dengan data awal
      const mockResponse = [...students];
      students = mockResponse;
      restoreDeletedStudents();
      renderTable();
      showStorageMessage("Data berhasil dimuat dari server");
      loadingIndicator.style.display = "none";
    } catch (error) {
      if (retries > 1) {
        setTimeout(() => loadFromAPIServer(retries - 1), 1000);
      } else {
        showStorageMessage("Gagal memuat data dari server", false);
        loadingIndicator.style.display = "none";
      }
    }
  }

  // Function to save data to local storage
  function saveToLocalStorage() {
    localStorage.setItem("students", JSON.stringify(students));
    showStorageMessage("Data berhasil disimpan ke Local Storage");
  }

  // Function to restore deleted students from local storage
  function restoreDeletedStudents() {
    const storedDeletedData = localStorage.getItem("deletedStudents");
    if (storedDeletedData) {
      deletedStudents = JSON.parse(storedDeletedData);
      students = students.concat(deletedStudents);
      deletedStudents = [];
    }
  }

  // Function to save deleted students to local storage
  function saveDeletedStudents() {
    localStorage.setItem("deletedStudents", JSON.stringify(deletedStudents));
  }

  // Function to load data from local storage
  function loadFromLocalStorage() {
    const storedData = localStorage.getItem("students");
    if (storedData) {
      students = JSON.parse(storedData);
      restoreDeletedStudents(); // Restore deleted students
      renderTable();
      showStorageMessage("Data berhasil dimuat dari Local Storage");
      return true;
    } else {
      showStorageMessage(
        "Tidak ada data yang tersimpan di Local Storage",
        false
      );
      return false;
    }
  }

  // Modify the renderTable function to save data to local storage
  function renderTable() {
    tableBody.innerHTML = "";
    students.forEach((student, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${index + 1}</td>
        <td class="editable" data-id="${student.id}" data-field="nim">${
        student.nim
      }</td>
        <td class="editable" data-id="${student.id}" data-field="nama">${
        student.nama
      }</td>
        <td class="editable" data-id="${student.id}" data-field="kelas">${
        student.kelas
      }</td>
        <td class="editable" data-id="${student.id}" data-field="prodi">${
        student.prodi
      }</td>
        <td class="editable" data-id="${student.id}" data-field="alamat">${
        student.alamat
      }</td>
        <td style="white-space: nowrap; text-align: center;">
          <button class="action-btn edit-btn" onclick="editStudent(${
            student.id
          })">Edit</button><button class="action-btn delete-btn" onclick="deleteStudent(${
        student.id
      })">Hapus</button>
        </td>
      `;
      tableBody.appendChild(row);
    });

    // Add double-click event listeners for editable cells
    document.querySelectorAll(".editable").forEach((cell) => {
      cell.addEventListener("dblclick", (event) => {
        editingCell = event.target;
        cellInput.value = editingCell.textContent;
        cellEditor.style.display = "block";
        cellEditor.style.top = `${editingCell.offsetTop}px`;
        cellEditor.style.left = `${editingCell.offsetLeft}px`;
        cellInput.focus();
      });
    });

    saveToCookie(); // Save changes to cookie whenever the table is rendered
    saveToLocalStorage(); // Save changes to local storage whenever the table is rendered
    saveDeletedStudents(); // Save deleted students to local storage
  }

  // Add event listeners for buttons
  addButton.addEventListener("click", () => {
    editForm.reset();
    editModal.style.display = "block";
  });

  closeEditModal.addEventListener("click", () => {
    editModal.style.display = "none";
  });

  saveToLocalStorageBtn.addEventListener("click", () => {
    saveToLocalStorage();
    showMessage("Data berhasil disimpan ke Local Storage");
  });

  saveToAPIBtn.addEventListener("click", () => {
    saveToAPIServer();
    showMessage("Data berhasil disimpan ke server");
  });

  loadFromLocalStorageBtn.addEventListener("click", loadFromLocalStorage);

  loadFromAPIBtn.addEventListener("click", loadFromAPIServer);

  clearDataBtn.addEventListener("click", clearAllData);

  // Function to add a new student
  editForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const newStudent = {
      id: students.length ? students[students.length - 1].id + 1 : 1,
      nim: editForm.editNim.value,
      nama: editForm.editNama.value,
      kelas: editForm.editKelas.value,
      prodi: editForm.editProdi.value,
      alamat: editForm.editAlamat.value,
    };
    students.push(newStudent);
    renderTable();
    saveToLocalStorage();
    saveToAPIServer();
    editModal.style.display = "none";
    showMessage("Data berhasil ditambahkan");
  });

  // Function to clear all data
  function clearAllData() {
    students = [];
    renderTable();
    localStorage.removeItem("students");
    showMessage("All data cleared");
  }

  // Function to edit a student
  window.editStudent = function (id) {
    const student = students.find((student) => student.id === id);
    if (student) {
      editForm.editNim.value = student.nim;
      editForm.editNama.value = student.nama;
      editForm.editKelas.value = student.kelas;
      editForm.editProdi.value = student.prodi;
      editForm.editAlamat.value = student.alamat;
      editModal.style.display = "block";

      editForm.onsubmit = function (event) {
        event.preventDefault();
        student.nim = editForm.editNim.value;
        student.nama = editForm.editNama.value;
        student.kelas = editForm.editKelas.value;
        student.prodi = editForm.editProdi.value;
        student.alamat = editForm.editAlamat.value;
        renderTable();
        saveToLocalStorage();
        saveToAPIServer();
        editModal.style.display = "none";
        showMessage("Data berhasil diperbarui");
      };
    }
  };

  // Function to delete a student
  window.deleteStudent = function (id) {
    const studentIndex = students.findIndex((student) => student.id === id);
    if (studentIndex !== -1) {
      const deletedStudent = students.splice(studentIndex, 1)[0];
      deletedStudents.push(deletedStudent);
      renderTable();
      saveToLocalStorage(); // Save changes to local storage
      saveToAPIServer(); // Save changes to API
      saveDeletedStudents(); // Save deleted students to local storage
      showMessage(`Deleted student with ID: ${id}`);
    }
  };

  // Function to restore the last deleted student
  function restoreLastDeletedStudent() {
    if (deletedStudents.length > 0) {
      const restoredStudent = deletedStudents.pop();
      students.push(restoredStudent);
      renderTable();
      saveToLocalStorage(); // Save changes to local storage
      saveToAPIServer(); // Save changes to API
      showMessage(`Restored student with ID: ${restoredStudent.id}`);
    } else {
      showMessage("No students to restore", "error");
    }
  }

  // Event listeners for cell editor
  cellSaveBtn.addEventListener("click", () => {
    if (editingCell) {
      const id = editingCell.dataset.id;
      const field = editingCell.dataset.field;
      const student = students.find((student) => student.id == id);
      if (student) {
        student[field] = cellInput.value;
        renderTable();
        saveToLocalStorage();
        saveToAPIServer();
        showMessage("Data berhasil diperbarui");
      }
      cellEditor.style.display = "none";
      editingCell = null;
    }
  });

  cellCancelBtn.addEventListener("click", () => {
    cellEditor.style.display = "none";
    editingCell = null;
  });

  // Load data from local storage or cookie or API on page load
  if (!loadFromLocalStorage() && !loadFromCookie()) {
    renderTable(); // Use initial data if no data is loaded from local storage or cookie
  }

  // Call renderTable to populate the table with initial data
  renderTable();
});
