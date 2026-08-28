CREATE TABLE lantai (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kode_lantai VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE ruangan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_lantai INT,
    kode_ruangan VARCHAR(255) NOT NULL UNIQUE,
    FOREIGN KEY (id_lantai) REFERENCES lantai(id)
);

CREATE TABLE rak (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_ruangan INT,
    kode_rak VARCHAR(255) NOT NULL UNIQUE,
    FOREIGN KEY (id_ruangan) REFERENCES ruangan(id)
);

CREATE TABLE penerbit_koran (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_penerbit VARCHAR(255) UNIQUE NOT NULL,
    foto VARCHAR(255) NOT NULL
);

CREATE TABLE koran (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_penerbit_koran INT,
    tahun YEAR,
    bulan ENUM(
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ),
    ketersediaan ENUM('Tersedia', 'Tidak Tersedia') NOT NULL DEFAULT 'Tersedia',
    dibuat_pada DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    dibuat_oleh VARCHAR(255) NOT NULL,
    diubah_pada DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    diubah_oleh VARCHAR(255),
    dihapus_pada DATETIME,
    dihapus_oleh VARCHAR(255) DEFAULT NULL,
    status_data ENUM('Tampil', 'Hapus') NOT NULL DEFAULT 'Tampil',
    UNIQUE KEY unik_penerbit_bulan_tahun (id_penerbit_koran, bulan, tahun),
    FOREIGN KEY (id_penerbit_koran) REFERENCES penerbit_koran(id)
);

CREATE TABLE bahasa (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bahasa VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE kategori (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kategori VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE majalah (
    id INT AUTO_INCREMENT PRIMARY KEY,
    judul VARCHAR(255),
    foto_cover VARCHAR(255),
    edisi VARCHAR(255),
    no_klasifikasi VARCHAR(255) UNIQUE,
    id_bahasa INT,
    tahun_terbit YEAR,
    sinopsis TEXT,
    tempat_terbit VARCHAR(255),
    penerbit VARCHAR(255),
    id_kategori INT,
    id_rak INT,
    ketersediaan ENUM('Tersedia', 'Tidak Tersedia') NOT NULL DEFAULT 'Tersedia',
    dibuat_pada DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    dibuat_oleh VARCHAR(255) NOT NULL,
    diubah_pada DATETIME ON UPDATE CURRENT_TIMESTAMP,
    diubah_oleh VARCHAR(255),
    dihapus_pada DATETIME,
    dihapus_oleh VARCHAR(255),
    status_data ENUM('Tampil', 'Hapus') NOT NULL DEFAULT 'Tampil',
    FOREIGN KEY (id_rak) REFERENCES rak(id),
    FOREIGN KEY (id_bahasa) REFERENCES bahasa(id),
    FOREIGN KEY (id_kategori) REFERENCES kategori(id)
);

CREATE TABLE buku (
    id INT AUTO_INCREMENT PRIMARY KEY,
    judul VARCHAR(255),
    foto_cover VARCHAR(255),
    isbn_issn VARCHAR(255) UNIQUE,
    no_klasifikasi VARCHAR(255) UNIQUE,
    id_bahasa INT,
    jumlah_halaman INT,
    tahun_terbit YEAR,
    sinopsis TEXT,
    tempat_terbit VARCHAR(255),
    penerbit VARCHAR(255),
    id_kategori INT,
    pengarang VARCHAR(255),
    id_rak INT,
    ketersediaan ENUM('Tersedia', 'Tidak Tersedia') NOT NULL DEFAULT 'Tersedia',
    dibuat_pada DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    dibuat_oleh VARCHAR(255) NOT NULL,
    diubah_pada DATETIME ON UPDATE CURRENT_TIMESTAMP,
    diubah_oleh VARCHAR(255),
    dihapus_pada DATETIME,
    dihapus_oleh VARCHAR(255),
    status_data ENUM('Tampil', 'Hapus') NOT NULL DEFAULT 'Tampil',
    FOREIGN KEY (id_rak) REFERENCES rak(id),
    FOREIGN KEY (id_bahasa) REFERENCES bahasa(id),
    FOREIGN KEY (id_kategori) REFERENCES kategori(id)
);
