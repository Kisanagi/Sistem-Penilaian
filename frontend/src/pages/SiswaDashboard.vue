<template>
  <div class="min-h-screen bg-gray-50">

    <!-- topbar -->
    <div class="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-full bg-teal-600 flex items-center justify-center text-white text-sm font-bold">
          {{ initials }}
        </div>
        <div>
          <p class="text-sm font-semibold text-gray-800">{{ auth.user?.username }}</p>
          <p class="text-xs text-gray-400">NIS: {{ auth.user?.nis || '-' }}</p>
        </div>
      </div>
      <button @click="handleLogout" class="text-sm text-gray-400 hover:text-red-500 transition-colors">
        Keluar
      </button>
    </div>

    <!-- konten -->
    <div class="max-w-2xl mx-auto px-6 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-xl font-bold text-gray-800">Nilai Saya</h1>
        <button v-if="daftarNilai.length > 0" @click="exportPDF"
          class="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg font-medium">
          Export PDF
        </button>
      </div>

      <!-- kartu statistik -->
      <div v-if="!loading && daftarNilai.length > 0" class="grid grid-cols-3 gap-4 mb-7">
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
          <p class="text-2xl font-bold text-teal-600">{{ daftarNilai.length }}</p>
          <p class="text-xs text-gray-400 mt-0.5">Mata Pelajaran</p>
        </div>
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
          <p class="text-2xl font-bold text-green-600">{{ jumlahLulus }}</p>
          <p class="text-xs text-gray-400 mt-0.5">Lulus</p>
        </div>
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
          <p class="text-2xl font-bold text-red-500">{{ jumlahTidakLulus }}</p>
          <p class="text-xs text-gray-400 mt-0.5">Tidak Lulus</p>
        </div>
      </div>

      <!-- loading -->
      <div v-if="loading" class="text-center py-16 text-gray-300">Memuat data...</div>

      <!-- kosong -->
      <div v-else-if="daftarNilai.length === 0" class="text-center py-16">
        <p class="text-gray-400 text-sm">Belum ada nilai yang diinput</p>
      </div>

      <!-- daftar nilai -->
      <div v-else class="space-y-3">
        <div v-for="n in daftarNilai" :key="n.id_nilai"
          class="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <p class="font-semibold text-gray-800">{{ n.nama_mapel }}</p>
              <p class="text-xs text-gray-400 mt-0.5">{{ n.nama_guru }}</p>
              <div class="flex gap-4 mt-3">
                <div v-for="item in [{ label:'Tugas', value:n.nilai_tugas },{ label:'UTS', value:n.nilai_uts },{ label:'UAS', value:n.nilai_uas }]"
                  :key="item.label" class="text-center">
                  <p class="text-xs text-gray-400">{{ item.label }}</p>
                  <p class="text-sm font-semibold text-gray-700 mt-0.5">{{ item.value }}</p>
                </div>
              </div>
            </div>
            <div class="text-right ml-4">
              <p class="text-2xl font-bold text-gray-800">{{ n.nilai_akhir }}</p>
              <span :class="n.status === 'Lulus'
                ? 'px-2.5 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full'
                : 'px-2.5 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded-full'">
                {{ n.status }}
              </span>
            </div>
          </div>
        </div>

        <!-- kartu rata-rata -->
        <div :class="['rounded-xl p-5 text-center mt-2', jumlahTidakLulus === 0
          ? 'bg-green-50 border border-green-200'
          : 'bg-yellow-50 border border-yellow-200']">
          <p class="text-xs font-medium text-gray-500 mb-1">Rata-rata Keseluruhan</p>
          <p :class="['text-4xl font-bold', jumlahTidakLulus === 0 ? 'text-green-700' : 'text-yellow-700']">
            {{ rataRata }}
          </p>
          <p :class="['text-sm font-medium mt-1.5', jumlahTidakLulus === 0 ? 'text-green-600' : 'text-yellow-600']">
            {{ jumlahTidakLulus === 0 ? 'Lulus Semua Mata Pelajaran' : `${jumlahTidakLulus} mata pelajaran belum lulus` }}
          </p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { getNilaiSaya } from '../services/nilaiService';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const auth        = useAuthStore();
const router      = useRouter();
const daftarNilai = ref([]);
const loading     = ref(true);

const initials       = computed(() => auth.user?.username?.slice(0, 2).toUpperCase() || '??');
const jumlahLulus    = computed(() => daftarNilai.value.filter(n => n.status === 'Lulus').length);
const jumlahTidakLulus = computed(() => daftarNilai.value.filter(n => n.status === 'Tidak Lulus').length);
const rataRata       = computed(() => {
  if (!daftarNilai.value.length) return null;
  return (daftarNilai.value.reduce((s, n) => s + n.nilai_akhir, 0) / daftarNilai.value.length).toFixed(1);
});

function exportPDF() {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageW   = 210;
  const margin  = 14;
  const contentW = pageW - margin * 2;

  const nama  = auth.user?.username || '-';
  const nis   = auth.user?.nis || '-';
  const kelas = daftarNilai.value[0]?.kelas || '-';
  const tgl   = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });

  const C_TEAL      = [13, 148, 136];
  const C_TEAL_DARK = [4,  120,  87];
  const C_TEAL_BOX  = [19, 165, 152];

  // ── HEADER TEAL ─────────────────────────────────────────────
  doc.setFillColor(...C_TEAL);
  doc.rect(0, 0, pageW, 36, 'F');

  // kotak "99"
  doc.setFillColor(...C_TEAL_BOX);
  doc.roundedRect(margin, 8, 14, 14, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('SN', margin + 7, 17, { align: 'center' });

  // nama sekolah
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Sistem Nilai Akademik', margin + 17, 14);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Sistem Pengolahan Nilai Akademik', margin + 17, 20);

  // kotak tanggal (kanan)
  doc.setFillColor(...C_TEAL_BOX);
  doc.roundedRect(pageW - margin - 30, 8, 30, 14, 2, 2, 'F');
  doc.setFontSize(6);
  doc.setFont('helvetica', 'bold');
  doc.text('DICETAK', pageW - margin - 15, 13.5, { align: 'center' });
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text(tgl, pageW - margin - 15, 19, { align: 'center' });

  // ── JUDUL ───────────────────────────────────────────────────
  doc.setFillColor(240, 253, 250);
  doc.rect(0, 36, pageW, 20, 'F');
  doc.setTextColor(15, 118, 110);
  doc.setFontSize(17);
  doc.setFont('helvetica', 'bold');
  doc.text('Laporan Nilai Akademik Siswa', margin, 51);

  // ── INFO BOXES ──────────────────────────────────────────────
  const infoY  = 63;
  const infoH  = 17;
  const infoW  = (contentW - 8) / 3;
  const infos  = [
    { label: 'NAMA SISWA', value: nama },
    { label: 'NIS',        value: nis  },
    { label: 'KELAS',      value: kelas },
  ];

  infos.forEach((box, i) => {
    const bx = margin + i * (infoW + 4);
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.roundedRect(bx, infoY, infoW, infoH, 2, 2, 'FD');
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(107, 114, 128);
    doc.text(box.label, bx + 4, infoY + 5.5);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 30, 30);
    doc.text(box.value, bx + 4, infoY + 13);
  });

  // ── TABEL ───────────────────────────────────────────────────
  autoTable(doc, {
    startY: infoY + infoH + 5,
    margin: { left: margin, right: margin },
    head: [['Mata Pelajaran', 'Guru', 'Tugas', 'UTS', 'UAS', 'Nilai Akhir', 'Status']],
    body: daftarNilai.value.map(n => [
      n.nama_mapel,
      n.nama_guru,
      n.nilai_tugas,
      n.nilai_uts,
      n.nilai_uas,
      n.nilai_akhir,
      n.status === 'Tidak Lulus' ? 'Remedial' : n.status,
    ]),
    styles: {
      fontSize: 9,
      cellPadding: { top: 5, bottom: 5, left: 4, right: 4 },
    },
    headStyles: {
      fillColor: C_TEAL_DARK,
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 9,
    },
    bodyStyles:          { textColor: [30, 30, 30], fillColor: [255, 255, 255] },
    alternateRowStyles:  { fillColor: [249, 250, 251] },
    columnStyles: {
      0: { fontStyle: 'bold' },
      2: { halign: 'center' },
      3: { halign: 'center' },
      4: { halign: 'center' },
      5: { halign: 'center', fontStyle: 'bold', fontSize: 11 },
      6: { halign: 'center' },
    },
    // badge status warna
    willDrawCell(d) {
      if (d.column.index === 6 && d.row.section === 'body') {
        // kosongkan teks bawaan, diganti manual di didDrawCell
        d.cell.text = [];
      }
    },
    didDrawCell(d) {
      if (d.column.index === 6 && d.row.section === 'body') {
        const val    = d.row.raw[6];
        const isLulus = val === 'Lulus';
        const cx     = d.cell.x + d.cell.width / 2;
        const cy     = d.cell.y + d.cell.height / 2;
        const bw = 20, bh = 7;

        doc.setFillColor(...(isLulus ? [220, 252, 231] : [254, 215, 170]));
        doc.roundedRect(cx - bw / 2, cy - bh / 2, bw, bh, 3, 3, 'F');
        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...(isLulus ? [22, 101, 52] : [194, 65, 12]));
        doc.text(val, cx, cy + 2.2, { align: 'center' });
        doc.setTextColor(30, 30, 30);
      }
    },
  });

  // ── RINGKASAN ───────────────────────────────────────────────
  const sumY  = doc.lastAutoTable.finalY + 5;
  const sumW  = (contentW - 4) / 2;

  // kotak kiri: rata-rata
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, sumY, sumW, 24, 2, 2, 'FD');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(107, 114, 128);
  doc.text('RATA-RATA KESELURUHAN', margin + 4, sumY + 6);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text(`Berdasarkan ${daftarNilai.value.length} mata pelajaran`, margin + 4, sumY + 11);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...C_TEAL);
  doc.text(String(rataRata.value), margin + 4, sumY + 21);

  // kotak kanan: status akhir
  const statusAkhir = jumlahTidakLulus.value > 0 ? 'REMEDIAL' : 'LULUS';
  doc.setFillColor(...C_TEAL_DARK);
  doc.roundedRect(margin + sumW + 4, sumY, sumW, 24, 2, 2, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('STATUS AKHIR', margin + sumW + 4 + sumW / 2, sumY + 9, { align: 'center' });
  doc.setFontSize(16);
  doc.text(statusAkhir, margin + sumW + 4 + sumW / 2, sumY + 20, { align: 'center' });

  // ── FOOTER ──────────────────────────────────────────────────
  const footY = 285;
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.2);
  doc.line(margin, footY, pageW - margin, footY);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(150, 150, 150);
  doc.text('Dokumen ini dihasilkan secara otomatis oleh Sistem Pengolahan Nilai Sistem Nilai Akademik.', margin, footY + 5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...C_TEAL);
  doc.text('Sistem Nilai Akademik', pageW - margin, footY + 5, { align: 'right' });

  doc.save(`nilai_${nama}.pdf`);
}

function handleLogout() {
  auth.logout();
  router.push('/login');
}

onMounted(async () => {
  if (auth.user?.nis) {
    try {
      daftarNilai.value = await getNilaiSaya(auth.user.nis);
    } catch (e) {
      console.error(e);
    }
  }
  loading.value = false;
});
</script>
