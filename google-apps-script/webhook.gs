/**
 * GT Form-to-Sheets Webhook
 *
 * Cara pakai:
 * 1. Buka Google Sheets baru
 * 2. Extensions > Apps Script
 * 3. Hapus semua code default, paste seluruh code ini
 * 4. Klik Deploy > New deployment
 * 5. Pilih type: Web app
 * 6. Set "Who has access" ke "Anyone"
 * 7. Klik Deploy, copy URL-nya
 * 8. URL itu yang dipakai di form HTML
 */

// ============================================================
// doPost() — Fungsi utama yang dijalankan saat form mengirim data
// ============================================================
//
// Konsep: Saat form melakukan POST request ke URL webhook ini,
// Google Apps Script otomatis menjalankan fungsi doPost().
// Parameter "e" berisi semua data yang dikirim oleh form.
//
function doPost(e) {
  try {
    // 1. Buka spreadsheet yang aktif (yang terpasang Apps Script ini)
    //    SpreadsheetApp = objek bawaan Google untuk mengakses Sheets
    //    getActiveSpreadsheet() = ambil spreadsheet yang sedang dibuka
    //    getActiveSheet() = ambil sheet/tab pertama
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // 2. Parse data yang dikirim form
    //    Form mengirim data dalam format JSON string,
    //    jadi kita perlu parse (ubah) jadi objek JavaScript
    //
    //    e.postData.contents = isi data mentah yang dikirim
    //    JSON.parse() = fungsi untuk mengubah text JSON jadi objek
    var data = JSON.parse(e.postData.contents);

    // 3. Siapkan header (baris pertama) kalau sheet masih kosong
    //    getLastRow() = cek ada berapa baris yang sudah terisi
    //    Kalau 0 berarti sheet masih kosong, perlu bikin header dulu
    if (sheet.getLastRow() === 0) {
      // Object.keys(data) = ambil semua nama field dari data
      // Contoh: kalau data = {nama: "Panji", email: "panji@email.com"}
      //         maka keys = ["nama", "email"]
      var headers = Object.keys(data);

      // Tambah kolom "timestamp" di awal untuk mencatat waktu submit
      headers.unshift("timestamp");

      // Tulis header ke baris pertama
      // getRange(row, col, numRows, numCols) = pilih area di sheet
      // setValues() = isi area itu dengan data (harus dalam format array 2D)
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }

    // 4. Ambil header yang sudah ada untuk menentukan urutan kolom
    //    getRange(1, 1, 1, lastColumn) = ambil seluruh baris pertama
    //    getValues()[0] = ambil nilainya sebagai array
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

    // 4b. PENTING: Cek apakah ada field BARU yang belum ada di header
    //     Ini terjadi kalau form di-update (tambah field baru)
    //     tapi sheet sudah punya data lama.
    //
    //     Konsep: indexOf() mencari posisi item dalam array.
    //     Kalau return -1, artinya item TIDAK ditemukan.
    //
    //     Jadi kita loop semua field dari data,
    //     kalau ada yang belum ada di header → tambahkan kolom baru.
    var dataKeys = Object.keys(data);
    dataKeys.forEach(function(key) {
      if (headers.indexOf(key) === -1) {
        // Field baru ditemukan! Tambah ke header di kolom selanjutnya
        var newCol = headers.length + 1;
        sheet.getRange(1, newCol).setValue(key);
        headers.push(key);  // Update array headers juga
      }
    });

    // 5. Susun data sesuai urutan header
    //    map() = buat array baru berdasarkan transformasi tiap elemen
    //    Untuk setiap header, ambil nilai yang cocok dari data
    //    Kalau header "timestamp", isi dengan waktu sekarang
    //    Kalau data tidak punya field itu, isi dengan string kosong ""
    var row = headers.map(function(header) {
      if (header === "timestamp") {
        return new Date().toLocaleString("id-ID");  // Format waktu Indonesia
      }
      return data[header] || "";
    });

    // 6. Tambah row baru di baris terakhir + 1
    //    appendRow() = tambahkan baris baru di paling bawah
    sheet.appendRow(row);

    // 7. Kirim response sukses ke form
    //    ContentService = objek bawaan Google untuk membuat response
    //    createTextOutput() = buat response berupa text
    //    setMimeType(JSON) = kasih tahu bahwa response ini format JSON
    return ContentService
      .createTextOutput(JSON.stringify({
        status: "success",
        message: "Data berhasil disimpan"
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Kalau ada error, kirim response gagal
    return ContentService
      .createTextOutput(JSON.stringify({
        status: "error",
        message: error.message
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ============================================================
// doGet() — Handle GET request (untuk test apakah webhook hidup)
// ============================================================
//
// Kalau kamu buka URL webhook di browser, itu adalah GET request.
// Fungsi ini cuma untuk verifikasi bahwa webhook sudah aktif.
//
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: "active",
      message: "GT Form-to-Sheets webhook is running"
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
