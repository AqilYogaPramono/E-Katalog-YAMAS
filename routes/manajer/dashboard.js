const express = require('express')
const router = express.Router()
const Pegawai = require('../../models/Pegawai')
const Majalah = require('../../models/Majalah')
const Buku = require('../../models/Buku')
const {authManajer} = require('../../middlewares/auth')
const Koran = require('../../models/Koran')

router.get('/', authManajer, async (req, res) => {
    try {
        const pegawai = await Pegawai.getNama(req.session.pegawaiId)
        const totalBukuHapus = await Buku.getCountBukuHapus()
        const totalMajalahHapus = await Majalah.getCountMajalahHapus()
        const totalKoranHapus = await Koran.getCountKoranHapus()
        const newBukuHapus = await Buku.getNewBukuHapus()
        const newMajalahHapus = await Majalah.getNewMajalahHapus()
        const newKoranHapus = await Koran.getNewKoranHapus()

        res.render('manajer/dashboard', { totalBukuHapus, totalMajalahHapus, totalKoranHapus, newBukuHapus, newMajalahHapus, newKoranHapus, pegawai })
    } catch(err) {
        console.error(err)
        req.flash('error', "Internal Server Error")
        res.redirect('/')
    }
})

module.exports = router