<template>
  <div>
    <h1 class="text-xl font-bold text-gray-800 mb-6">Laporan Nilai</h1>
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6 flex flex-wrap gap-4 items-end">
      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1">Filter Kelas</label>
        <select :value="filterKelas" @change="$emit('update:filterKelas', $event.target.value)"
          class="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400">
          <option value="">Semua Kelas</option>
          <option v-for="k in daftarKelas" :key="k" :value="k">{{ k }}</option>
        </select>
      </div>
      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1">Filter Mapel</label>
        <select :value="filterMapel" @change="$emit('update:filterMapel', $event.target.value)"
          class="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400">
          <option value="">Semua Mapel</option>
          <option v-for="m in daftarMapel" :key="m.id_mapel" :value="m.id_mapel">{{ m.nama_mapel }}</option>
        </select>
      </div>
      <button @click="$emit('muat')"
        class="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 text-sm rounded-lg font-medium">
        Tampilkan
      </button>
      <button v-if="laporan && laporan.detail.length > 0" @click="exportPDF"
        class="bg-green-600 hover:bg-green-700 text-white px-5 py-2 text-sm rounded-lg font-medium">
        Export PDF
      </button>
    </div>

    <template v-if="laporan">
      <div class="grid grid-cols-4 gap-4 mb-6">
        <div v-for="card in laporanCards" :key="card.label"
          :class="['rounded-xl border border-gray-100 shadow-sm p-5', card.color]">
          <p class="text-3xl font-bold">{{ card.value }}</p>
          <p class="text-xs font-medium mt-1 opacity-75">{{ card.label }}</p>
        </div>
      </div>
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-gray-50">
            <tr class="text-xs text-gray-400 uppercase">
              <th v-for="h in ['NIS','Nama','Kelas','Mapel','Tugas','UTS','UAS','Akhir','Status']"
                :key="h" class="text-left px-4 py-3 font-medium">{{ h }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="n in laporan.detail" :key="n.id_nilai"
              class="border-t border-gray-50 hover:bg-gray-50">
              <td class="px-4 py-3 font-mono text-xs text-gray-400">{{ n.nis }}</td>
              <td class="px-4 py-3 font-medium text-gray-800">{{ n.nama }}</td>
              <td class="px-4 py-3 text-gray-500">{{ n.kelas }}</td>
              <td class="px-4 py-3 text-gray-500">{{ n.nama_mapel }}</td>
              <td class="px-4 py-3 text-gray-600">{{ n.nilai_tugas }}</td>
              <td class="px-4 py-3 text-gray-600">{{ n.nilai_uts }}</td>
              <td class="px-4 py-3 text-gray-600">{{ n.nilai_uas }}</td>
              <td class="px-4 py-3 font-bold text-gray-800">{{ n.nilai_akhir }}</td>
              <td class="px-4 py-3">
                <span :class="n.status === 'Lulus'
                  ? 'px-2.5 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full'
                  : 'px-2.5 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded-full'">
                  {{ n.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const props = defineProps({
  laporan: Object,
  filterKelas: String,
  filterMapel: [String, Number],
  daftarMapel: Array,
  daftarKelas: Array,
})
defineEmits(['update:filterKelas', 'update:filterMapel', 'muat'])

const laporanCards = computed(() =>
  props.laporan
    ? [
        { label: 'Total Data', value: props.laporan.total, color: 'bg-teal-50 text-teal-600' },
        { label: 'Lulus', value: props.laporan.lulus, color: 'bg-green-50 text-green-600' },
        { label: 'Tidak Lulus', value: props.laporan.tidakLulus, color: 'bg-red-50 text-red-500' },
        { label: 'Rata-rata', value: props.laporan.rataRata, color: 'bg-yellow-50 text-yellow-600' },
      ]
    : []
)

function exportPDF() {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageW = 210
  const margin = 14
  const contentW = pageW - margin * 2
  const tgl = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })

  const C_TEAL = [13, 148, 136]
  const C_TEAL_DARK = [4, 120, 87]
  const C_TEAL_BOX = [19, 165, 152]

  // header
  doc.setFillColor(...C_TEAL)
  doc.rect(0, 0, pageW, 36, 'F')
  doc.setFillColor(...C_TEAL_BOX)
  doc.roundedRect(margin, 8, 14, 14, 2, 2, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('SN', margin + 7, 17, { align: 'center' })
  doc.setFontSize(13)
  doc.text('Sistem Nilai Akademik', margin + 17, 14)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.text('Pengolahan Nilai Akademik', margin + 17, 20)
  doc.setFillColor(...C_TEAL_BOX)
  doc.roundedRect(pageW - margin - 30, 8, 30, 14, 2, 2, 'F')
  doc.setFontSize(6)
  doc.setFont('helvetica', 'bold')
  doc.text('DICETAK', pageW - margin - 15, 13.5, { align: 'center' })
  doc.setFontSize(7.5)
  doc.setFont('helvetica', 'normal')
  doc.text(tgl, pageW - margin - 15, 19, { align: 'center' })

  // judul
  doc.setFillColor(240, 253, 250)
  doc.rect(0, 36, pageW, 20, 'F')
  doc.setTextColor(15, 118, 110)
  doc.setFontSize(17)
  doc.setFont('helvetica', 'bold')
  doc.text('Rekap Nilai Akademik Siswa', margin, 51)

  // info boxes
  const infoY = 63
  const infoH = 17
  const kelasLabel = props.filterKelas || 'Semua Kelas'
  const mapelLabel = props.filterMapel
    ? props.daftarMapel.find((m) => m.id_mapel == props.filterMapel)?.nama_mapel || '-'
    : 'Semua Mapel'
  const infos = [
    { label: 'TOTAL DATA', value: String(props.laporan.total) },
    { label: 'KELAS', value: kelasLabel },
    { label: 'MAPEL', value: mapelLabel },
  ]
  const infoW = (contentW - 8) / 3
  infos.forEach((box, i) => {
    const bx = margin + i * (infoW + 4)
    doc.setFillColor(255, 255, 255)
    doc.setDrawColor(226, 232, 240)
    doc.setLineWidth(0.3)
    doc.roundedRect(bx, infoY, infoW, infoH, 2, 2, 'FD')
    doc.setFontSize(6.5)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(107, 114, 128)
    doc.text(box.label, bx + 4, infoY + 5.5)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(30, 30, 30)
    doc.text(box.value, bx + 4, infoY + 13)
  })

  // tabel
  autoTable(doc, {
    startY: infoY + infoH + 5,
    margin: { left: margin, right: margin },
    head: [['NIS', 'Nama Siswa', 'Kelas', 'Mata Pelajaran', 'Tugas', 'UTS', 'UAS', 'Nilai Akhir', 'Status']],
    body: props.laporan.detail.map((n) => [
      n.nis, n.nama, n.kelas, n.nama_mapel, n.nilai_tugas, n.nilai_uts, n.nilai_uas, n.nilai_akhir,
      n.status === 'Tidak Lulus' ? 'Remedial' : n.status,
    ]),
    styles: { fontSize: 8, cellPadding: { top: 4, bottom: 4, left: 3, right: 3 } },
    headStyles: { fillColor: C_TEAL_DARK, textColor: 255, fontStyle: 'bold', fontSize: 8 },
    bodyStyles: { textColor: [30, 30, 30], fillColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [249, 250, 251] },
    columnStyles: {
      0: { cellWidth: 20, halign: 'center', font: 'courier' },
      1: { fontStyle: 'bold' },
      2: { halign: 'center' },
      5: { halign: 'center' },
      6: { halign: 'center' },
      7: { halign: 'center', fontStyle: 'bold', fontSize: 9 },
      8: { halign: 'center' },
    },
    willDrawCell(d) {
      if (d.column.index === 8 && d.row.section === 'body') d.cell.text = []
    },
    didDrawCell(d) {
      if (d.column.index === 8 && d.row.section === 'body') {
        const val = d.row.raw[8]
        const isLulus = val === 'Lulus'
        const cx = d.cell.x + d.cell.width / 2
        const cy = d.cell.y + d.cell.height / 2
        const bw = 20, bh = 6
        doc.setFillColor(...(isLulus ? [220, 252, 231] : [254, 215, 170]))
        doc.roundedRect(cx - bw / 2, cy - bh / 2, bw, bh, 3, 3, 'F')
        doc.setFontSize(7)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(...(isLulus ? [22, 101, 52] : [194, 65, 12]))
        doc.text(val, cx, cy + 2, { align: 'center' })
        doc.setTextColor(30, 30, 30)
      }
    },
  })

  // ringkasan
  const sumY = doc.lastAutoTable.finalY + 5
  const sumW = (contentW - 4) / 2
  doc.setFillColor(248, 250, 252)
  doc.setDrawColor(226, 232, 240)
  doc.setLineWidth(0.3)
  doc.roundedRect(margin, sumY, sumW, 24, 2, 2, 'FD')
  doc.setFontSize(7)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(107, 114, 128)
  doc.text('RATA-RATA KESELURUHAN', margin + 4, sumY + 6)
  doc.setFontSize(7)
  doc.setFont('helvetica', 'normal')
  doc.text(`Berdasarkan ${props.laporan.total} data nilai`, margin + 4, sumY + 11)
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...C_TEAL)
  doc.text(String(props.laporan.rataRata), margin + 4, sumY + 21)
  const pctLulus = props.laporan.total > 0
    ? Math.round((props.laporan.lulus / props.laporan.total) * 100) : 0
  doc.setFillColor(...C_TEAL_DARK)
  doc.roundedRect(margin + sumW + 4, sumY, sumW, 24, 2, 2, 'F')
  doc.setFontSize(7.5)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(255, 255, 255)
  doc.text('TINGKAT KELULUSAN', margin + sumW + 4 + sumW / 2, sumY + 9, { align: 'center' })
  doc.setFontSize(16)
  doc.text(`${pctLulus}%`, margin + sumW + 4 + sumW / 2, sumY + 20, { align: 'center' })

  // footer
  const footY = 285
  doc.setDrawColor(200, 200, 200)
  doc.setLineWidth(0.2)
  doc.line(margin, footY, pageW - margin, footY)
  doc.setFontSize(7)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(150, 150, 150)
  doc.text('Dokumen ini dihasilkan secara otomatis oleh Sistem Pengolahan Nilai Sistem Nilai Akademik.', margin, footY + 5)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...C_TEAL)
  doc.text('Sistem Nilai Akademik', pageW - margin, footY + 5, { align: 'right' })

  const totalHal = doc.internal.getNumberOfPages()
  if (totalHal > 1) {
    for (let i = 1; i <= totalHal; i++) {
      doc.setPage(i)
      doc.setFontSize(7)
      doc.setTextColor(150, 150, 150)
      doc.text(`Halaman ${i} / ${totalHal}`, pageW - margin, footY + 5, { align: 'right' })
    }
  }

  const keteranganKelas = props.filterKelas ? `_${props.filterKelas}` : ''
  doc.save(`rekap_nilai${keteranganKelas}.pdf`)
}
</script>
