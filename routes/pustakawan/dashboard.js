const express = require('express')
const router = express.Router()
// import model buku
const Buku = require('../../models/Buku')
// import model majalah
const Majalah = require('../../models/Majalah')
// import model koran
const Koran = require('../../models/Koran')
// import model pegawai
const Pegawai = require('../../models/Pegawai')
// import middleware untuk mengecek peran pengguna login
const {authPustakawan} = require('../../middlewares/auth')

router.get('/', authPustakawan, async (req, res) => {
    try {
        const pegawai = await Pegawai.getNama(req.session.pegawaiId)

        const totalBuku = await Buku.getCountBuku()
        const totalMajalah = await Majalah.getCountMajalah()
        const totalKoran = await Koran.getCountKoran()
        const newBuku = await Buku.getNewBuku()
        const newMajalah = await Majalah.getNewMajalah()
        const newKoran = await Koran.getNewKoran()
        
        res.render('pustakawan/dashboard', { totalBuku, totalMajalah, totalKoran, newBuku, newMajalah, newKoran, pegawai })
    } catch (err) {
        console.error(err)
        req.flash('error', "Internal Server Error")
        res.redirect('/')
    }
})

module.exports = router