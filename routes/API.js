const express = require('express')
const router = express.Router()
const modelBuku = require('../models/Buku')
const modelMajalah = require('../models/Majalah')
const Koran = require('../models/Koran')
const PenerbitKoran = require('../models/PenerbitKoran')
const Bahasa = require('../models/Bahasa')
const Kategori = require('../models/Kategori')

router.post('/buku/search', async (req, res) => {
    try {
        const { keyword } = req.body
        
        if (!keyword || !keyword.trim()) {
            return res.status(400).json({ message: 'Keyword tidak boleh kosong' })
        }

        const result = await modelBuku.searchBukuAPI(keyword.trim())

        res.status(200).json({ result: result || [] })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})

router.post('/majalah/search', async (req, res) => {
    try {
        const { keyword } = req.body
        
        if (!keyword || !keyword.trim()) {
            return res.status(400).json({ message: 'Keyword tidak boleh kosong' })
        }

        const result = await modelMajalah.searchMajalahAPI(keyword.trim())

        res.status(200).json({ result: result || [] })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})

router.post('/buku/advance-search', async (req, res) => {
    try {
        const { judul, no_klasifikasi, id_bahasa, tahun_terbit, id_kategori, pengarang, penerbit } = req.body
        
        const filters = {}
        if (judul) filters.judul = judul
        if (no_klasifikasi) filters.no_klasifikasi = no_klasifikasi
        if (id_bahasa) filters.id_bahasa = id_bahasa
        if (tahun_terbit) filters.tahun_terbit = tahun_terbit
        if (id_kategori) filters.id_kategori = id_kategori
        if (pengarang) filters.pengarang = pengarang
        if (penerbit) filters.penerbit = penerbit

        const hasFilter = Object.keys(filters).length > 0
        if (!hasFilter) {
            return res.status(400).json({ message: 'Minimal satu filter harus diisi' })
        }

        const result = await modelBuku.advanceSearchBukuAPI(filters)

        res.status(200).json({ result: result || [] })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})

router.post('/majalah/advance-search', async (req, res) => {
    try {
        const { judul, edisi, no_klasifikasi, id_bahasa, id_kategori, tahun_terbit, penerbit } = req.body
        
        const filters = {}
        if (judul) filters.judul = judul
        if (edisi) filters.edisi = edisi
        if (no_klasifikasi) filters.no_klasifikasi = no_klasifikasi
        if (id_bahasa) filters.id_bahasa = id_bahasa
        if (id_kategori) filters.id_kategori = id_kategori
        if (tahun_terbit) filters.tahun_terbit = tahun_terbit
        if (penerbit) filters.penerbit = penerbit

        const hasFilter = Object.keys(filters).length > 0
        if (!hasFilter) {
            return res.status(400).json({ message: 'Minimal satu filter harus diisi' })
        }

        const result = await modelMajalah.advanceSearchMajalahAPI(filters)

        res.status(200).json({ result: result || [] })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})

router.get('/bahasa', async (req, res) => {
    try {
        const data = await Bahasa.getAll()
        return res.status(200).json({ data: data || [] })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})

router.get('/kategori', async (req, res) => {
    try {
        const data = await Kategori.getAll()
        return res.status(200).json({ data: data || [] })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})

router.get('/new-buku', async (req, res) => {
    try {
        const data = await modelBuku.getNewBukuAPI()

        return res.status(200).json({ data: data || [] })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})

router.get('/new-majalah', async (req, res) => {
    try {
        const data = await modelMajalah.getNewMajalahAPI()

        return res.status(200).json({ data: data || [] })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})

router.get('/buku/detail/:id', async (req, res) => {
    try {
        const { id } = req.params
        const rows = await modelBuku.getDetailBuku(id)
        const buku = rows[0]

        if (!buku) {
            return res.status(404).json({ message: 'Data tidak ditemukan' })
        }

        return res.status(200).json({ buku })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})

router.get('/majalah/detail/:id', async (req, res) => {
    try {
        const { id } = req.params
            const rows = await modelMajalah.getDetailMajalah(id)
            const majalah = rows[0]

        if (!majalah) {
            return res.status(404).json({ message: 'Data tidak ditemukan' })
        }

        return res.status(200).json({ majalah })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})

router.post('/koran/search', async (req, res) => {
    try {
        const { id_penerbit_koran, tahun, bulan } = req.body

        const koran = await Koran.searchKoranTampil({ id_penerbit_koran, tahun, bulan })

        return res.status(200).json({ koran })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})

router.get('/penerbit-koran', async (req, res) => {
    try {
        const penerbitKoran = await PenerbitKoran.getAll()

        return res.status(200).json({ penerbitKoran })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})

router.get('/new-koran', async (req, res) => {
    try {
        const data = await PenerbitKoran.getNewKoran()

        return res.status(200).json({ data })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})


module.exports = router