const express = require('express')
const router = express.Router()
//import model kategori 
const Kategori = require('../../../models/Kategori')
// import model pegawai
const Pegawai = require('../../../models/Pegawai')
// import middleware untuk mengecek peran pengguna login
const {authPustakawan} = require('../.././../middlewares/auth')

router.get('/', authPustakawan, async (req, res) => {
    try {
        const pegawai = await Pegawai.getNama(req.session.pegawaiId)
        const page = parseInt(req.query.page) || 1
        const limit = 20
        const offset = (page - 1) * limit
        const flashedKeyword = req.flash('keyword')[0]

        if (flashedKeyword) {
            const data = await Kategori.searchByKategori(flashedKeyword)
            return res.render('pustakawan/data-induk/kategori/index', {
                data,
                pegawai,
                page: 1,
                totalHalaman: 1,
                keyword: flashedKeyword
            })
        }

        const data = await Kategori.getKategori(limit, offset)
        const countResult = await Kategori.getCountKategori()
        const totalKategori = countResult[0].total_kategori
        const totalHalaman = Math.ceil(totalKategori / limit)

        res.render('pustakawan/data-induk/kategori/index', { data, pegawai, page, totalHalaman })
    } catch(err) {
        console.error(err)
        req.flash('error', "Internal Server Error")
        return res.redirect('/pustakawan/dashboard')
    }
})

//menampilkan halaman untuk menambahkan data kategori
router.get('/buat', authPustakawan, async (req, res) => {
    try {
        const pegawai = await Pegawai.getNama(req.session.pegawaiId)

        res.render('pustakawan/data-induk/kategori/buat', { 
            pegawai,
            data: req.flash('data')[0]
        })
    } catch(err) {
        console.error(err)
        req.flash('error', "Internal Server Error")
        return res.redirect('/pustakawan/dashboard')
    }
})

//menabahkan data kategori baru
router.post('/create', authPustakawan, async (req, res) => {
    try {
        // destructuring req.body
        const {kategori} = req.body

        // menyimpan data yang diinputkan user
        const data = {kategori}

        // input kategori tidak boleh kosong
        if (!data.kategori) {
            req.flash("error", "Kategori tidak boleh kosong")
            req.flash('data', req.body)
            return res.redirect('/pustakawan/kategori/buat')
        }

        // memeriksa apakah kategori sudah ada
        if (await Kategori.checkKategoriCreate(data)) {
            req.flash("error", "Kategori sudah dibuat")
            req.flash('data', req.body)
            return res.redirect('/pustakawan/kategori/buat')
        }

        await Kategori.store(data)
        req.flash('success', 'Data Berhasil Ditambahkan')
        res.redirect('/pustakawan/kategori')
    } catch(err) {
        console.error(err)
        req.flash('error', "Internal Server Error")
        return res.redirect('/pustakawan/kategori')
    }
})

//menampilkan halaman untuk mengedit kategori
router.get('/edit/:id', authPustakawan, async(req, res) => {
    try {
        const {id} = req.params
        const pegawai = await Pegawai.getNama(req.session.pegawaiId)
        const data = await Kategori.getById(id)

        res.render('pustakawan/data-induk/kategori/edit', {data, pegawai})
    } catch(err) {
        console.error(err)
        req.flash('error', "Internal Server Error")
        return res.redirect('/pustakawan/kategori')
    }
})

//memgupdate data kategori berdasarkan id
router.post('/update/:id', authPustakawan, async (req, res) => {
    try {
        // destructuring req.params
        const {id} = req.params

        // destructuring req.body
        const {kategori} = req.body

        // menyimpan data yang diinputkan user
        const data = {kategori}
        
        // input kategori tidak boleh kosong
        if (!kategori) {
            req.flash("error", "Kategori tidak boleh kosong")
            req.flash('data', req.body)
            return res.redirect(`/pustakawan/kategori/edit/${id}`)
        }

        // memeriksa apakah kategori sudah ada
        if (await Kategori.checkKategoriUpdate(data, id)) {
            req.flash("error", "Kategori sudah dibuat")
            req.flash('data', req.body)
            return res.redirect(`/pustakawan/kategori/edit/${id}`)
        }

        // memperbarui data kategori
        await Kategori.update(data, id)
        req.flash('success', 'Data Berhasil Diedit')
        res.redirect('/pustakawan/kategori')
    } catch (err) {
        console.error(err)
        req.flash('error', "Internal Server Error")
        req.flash('data', req.body)
        return res.redirect('/pustakawan/kategori')
    }
})

router.post('/delete/:id', authPustakawan, async (req, res) => {
    try {
        const {id} = req.params

        if (await Kategori.checkKategoriUsed(id)) {
            req.flash("error", "Kategori masih digunakan oleh buku atau majalah lain")
            req.flash('data', req.body)
            return res.redirect('/pustakawan/kategori')
        }

        await Kategori.delete(id)
        req.flash('success', 'Data Berhasil Dihapus')
        res.redirect('/pustakawan/kategori')
    } catch(err) {
        console.error(err)
        req.flash('error', "Internal Server Error")
        return res.redirect('/pustakawan/kategori')
    }
})

router.post('/search', authPustakawan, async (req, res) => {
    try {
        const { kategori } = req.body
        req.flash('keyword', kategori || '')
        res.redirect('/pustakawan/kategori')
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal server error')
        res.redirect('/pustakawan/kategori')
    }
})

module.exports = router
