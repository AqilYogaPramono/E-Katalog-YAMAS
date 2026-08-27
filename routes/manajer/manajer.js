const express = require('express')
const router = express.Router()
// import bcryptjs
const bcrypt = require('bcryptjs')
// import model pegawai
const Pegawai = require('../../models/Pegawai')
// import middleware untuk mengecek peran pengguna login
const {authManajer} = require('../../middlewares/auth')

// router get form ubah kata sandi
router.get('/ubah-kata-sandi', authManajer, async (req, res) => {
    try {
        const pegawai = await Pegawai.getNama(req.session.pegawaiId)

        res.render('manajer/manajer/ubahKataSandi', { 
            pegawai,
            data: req.flash('data')[0]
        })
    } catch (err) {
        console.error(err)
        res.redirect('/manajer/dashboard')
    }
})

router.post('/change-password', authManajer, async (req, res) => {
    try {
        const pegawaiId = req.session.pegawaiId
        const pegawai = await Pegawai.getById(pegawaiId)

        // destructuring req.body
        const {kata_sandi, kata_sandi_baru, konfirmasi_kata_sandi_baru} = req.body
        // menyimpan data yang diinputkan user
        const data = {kata_sandi, kata_sandi_baru, konfirmasi_kata_sandi_baru}

        // input kata sandi tidak boleh kosong
        if (!kata_sandi) {
            req.flash('error', 'kata sandi tidak boleh kosong')
            req.flash('data', req.body)
            return res.redirect('/manajer/ubah-kata-sandi')
        }

        // input kata sandi baru tidak boleh kosong
        if (!kata_sandi_baru) {
            req.flash('error', 'kata sandi baru tidak boleh kosong')
            req.flash('data', req.body)
            return res.redirect('/manajer/ubah-kata-sandi')
        }

        // input konfirmasi kata sandi baru tidak boleh kosong
        if (!konfirmasi_kata_sandi_baru) {
            req.flash('error', 'konfirmasi kata sandi baru tidak boleh kosong')
            req.flash('data', req.body)
            return res.redirect('/manajer/ubah-kata-sandi')
        }

        // mengecek kecocokan kata sandi lama dengan yang ada di database
        if (!(await bcrypt.compare(kata_sandi, pegawai.kata_sandi))) {
            req.flash('error', 'Kata sandi yang anda inputkan salah')
            req.flash('data', req.body)
            return res.redirect('/manajer/ubah-kata-sandi')
        }

        // kata sandi minimal 6 karakter
        if (kata_sandi_baru.length < 6) {
            req.flash('error', 'Kata Sandi Minimal 6 karakter')
            req.flash('data', req.body)
            return res.redirect('/manajer/ubah-kata-sandi')
        }

        // kata sandi minimal 1 huruf kapital
        if (!/[A-Z]/.test(kata_sandi)) {
            req.flash('error', 'Kata Sandi Minimal 1 Huruf Kapital')
            req.flash('data', req.body)
            return res.redirect('/manajer/ubah-kata-sandi')
        }

        // kata sandi minimal 1 huruf kecil
        if (!/[a-z]/.test(kata_sandi_baru)) {
            req.flash('error', 'Kata Sandi Minimal 1 Huruf Kecil')
            req.flash('data', req.body)
            return res.redirect('/manajer/ubah-kata-sandi')
        }

        // kata sandi minimal 1 angka
        if (!/\d/.test(kata_sandi_baru)) {
            req.flash('error', 'Kata Sandi Minimal 1 Angka')
            req.flash('data', req.body)
            return res.redirect('/manajer/ubah-kata-sandi')
        }

        // cek kesesuaian kata_sandi dan konfirmasi_kata_sandi 
        if (kata_sandi_baru != konfirmasi_kata_sandi_baru) {
            req.flash('error', 'Konfirmasi kata sandi baru tidak sama')
            req.flash('data', req.body)
            return res.redirect('/manajer/ubah-kata-sandi')
        }

        await Pegawai.changePassword(data, pegawaiId)
        req.flash('success', 'Kata sandi berhasil diubah')
        res.redirect('/masuk-manajer')
    } catch (err) {
        req.flash('error', "Internal Server Error")
        res.redirect('/manajer/ubah-kata-sandi')
    }
})

module.exports = router