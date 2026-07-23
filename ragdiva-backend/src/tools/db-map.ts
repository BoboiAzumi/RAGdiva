import { tool } from "langchain";

export const dbMap = tool(
    async () => {
        return `# Struktur Database

## Tabel majors

\`\`\`sql
CREATE TABLE majors (
    id VARCHAR(36) PRIMARY KEY,
    major_name VARCHAR(255),
    accreditation VARCHAR(50)
);
\`\`\`

Digunakan untuk menyimpan data Program Studi.

Kolom:

- id
- major_name
- accreditation

---

## Tabel criteria

\`\`\`sql
CREATE TABLE criteria (
    id VARCHAR(36) PRIMARY KEY,
    parent VARCHAR(36),
    code VARCHAR(50),
    name VARCHAR(255),
    description TEXT,
    access VARCHAR(36),

    FOREIGN KEY (parent) REFERENCES criteria(id),
    FOREIGN KEY (access) REFERENCES majors(id)
);
\`\`\`

Digunakan untuk menyimpan struktur kriteria akreditasi.

Kolom:

- id
- parent
- code
- name
- description
- access

---

## Tabel file_links

\`\`\`sql
CREATE TABLE file_links (
    id VARCHAR(36) PRIMARY KEY,
    criteria_id VARCHAR(36),
    file_id VARCHAR(36),
    criteria_link VARCHAR(255),
    page INT,

    FOREIGN KEY (criteria_id) REFERENCES criteria(id),
    FOREIGN KEY (file_id) REFERENCES files(id)
);
\`\`\`

Digunakan untuk menghubungkan kriteria dengan dokumen.

Kolom:

- id
- criteria_id
- file_id
- criteria_link
- page

---

## Tabel files

\`\`\`sql
CREATE TABLE files (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255),
    file_name VARCHAR(255),
    file_hash VARCHAR(255),
    mime_type VARCHAR(100),
    created_at DATETIME,
    update_at DATETIME,
    status VARCHAR(30)
);
\`\`\`

Digunakan untuk menyimpan metadata dokumen.

Kolom:

- id
- title
- file_name
- file_hash
- mime_type
- created_at
- update_at
- status

---

# Relasi Antar Tabel

Gunakan relasi berikut ketika melakukan JOIN.

criteria.access = majors.id

criteria.parent = criteria.id

file_links.criteria_id = criteria.id

file_links.file_id = files.id

Jangan menggunakan relasi lain selain yang telah didefinisikan di atas.

---

# Aturan Penulisan SQL

Gunakan hanya nama tabel dan kolom yang tersedia.

Jangan mengasumsikan adanya kolom lain.

Sebagai contoh, kolom berikut **tidak ada**:

- major_id (pada tabel criteria)
- majorId
- criteriaId
- parentId
- fileId

Gunakan nama kolom yang benar sesuai struktur database.

Hindari menggunakan:

\`\`\`sql
SELECT *
\`\`\`

Ambil hanya kolom yang benar-benar dibutuhkan.

Gunakan LIMIT apabila hanya membutuhkan sebagian data.

Gunakan JOIN hanya jika memang diperlukan.

Apabila hasil query pertama belum cukup untuk menjawab pertanyaan, lakukan query SELECT tambahan.

Jangan pernah mengarang isi database.

---

# Contoh Query

## Menampilkan seluruh Program Studi

\`\`\`sql
SELECT
    id,
    major_name,
    accreditation
FROM majors
ORDER BY major_name;
\`\`\`

---

## Menampilkan seluruh kriteria

\`\`\`sql
SELECT
    id,
    code,
    name
FROM criteria
ORDER BY code;
\`\`\`

---

## Menampilkan kriteria berdasarkan Program Studi

\`\`\`sql
SELECT
    c.code,
    c.name
FROM criteria c
JOIN majors m
ON c.access = m.id
WHERE m.major_name = 'Sistem Informasi';
\`\`\`

---

## Menampilkan sub-kriteria

\`\`\`sql
SELECT
    id,
    code,
    name
FROM criteria
WHERE parent = ?;
\`\`\`

---

## Menampilkan parent suatu kriteria

\`\`\`sql
SELECT
    p.code,
    p.name
FROM criteria c
JOIN criteria p
ON c.parent = p.id
WHERE c.id = ?;
\`\`\`

---

## Menampilkan dokumen yang terkait dengan suatu kriteria

\`\`\`sql
SELECT
    f.title,
    f.file_name,
    fl.page
FROM file_links fl
JOIN files f
ON fl.file_id = f.id
WHERE fl.criteria_id = ?;
\`\`\`

---

## Menampilkan metadata suatu file

\`\`\`sql
SELECT
    title,
    file_name,
    mime_type,
    status,
    created_at
FROM files
WHERE id = ?;
\`\`\`

---`;
    },
    {
        name: "db_map",
        description: "Untuk mencari informasi dari database langsung",
    },
);
