import jsPDF from 'jspdf';

const RING_SIZES = [
  { fr: 41, circ: 41, diam: 13.0 },
  { fr: 42, circ: 42, diam: 13.4 },
  { fr: 44, circ: 44, diam: 14.0 },
  { fr: 46, circ: 46, diam: 14.6 },
  { fr: 48, circ: 48, diam: 15.3 },
  { fr: 50, circ: 50, diam: 15.9 },
  { fr: 52, circ: 52, diam: 16.5 },
  { fr: 54, circ: 54, diam: 17.2 },
  { fr: 56, circ: 56, diam: 17.8 },
  { fr: 58, circ: 58, diam: 18.5 },
  { fr: 60, circ: 60, diam: 19.1 },
  { fr: 62, circ: 62, diam: 19.7 },
  { fr: 64, circ: 64, diam: 20.4 },
  { fr: 66, circ: 66, diam: 21.0 },
  { fr: 68, circ: 68, diam: 21.6 },
  { fr: 70, circ: 70, diam: 22.3 },
  { fr: 72, circ: 72, diam: 22.9 },
];

const GOLD: [number, number, number] = [201, 163, 12];
const DARK: [number, number, number] = [45, 35, 20];
const MUTED: [number, number, number] = [100, 85, 60];
const LIGHT_BG: [number, number, number] = [252, 249, 242];

function hLine(doc: jsPDF, x: number, y: number, w: number, color = GOLD, lw = 0.4) {
  doc.setDrawColor(...color);
  doc.setLineWidth(lw);
  doc.line(x, y, x + w, y);
}

function sectionTitle(doc: jsPDF, title: string, x: number, y: number, w: number): number {
  doc.setTextColor(...GOLD);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(title, x, y);
  hLine(doc, x, y + 2, w);
  return y + 9;
}

export function generateSizeGuidePdf() {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = 210;
  const M = 18; // margin
  const CW = W - M * 2; // content width

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // PAGE 1
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // Header band
  doc.setFillColor(25, 20, 12);
  doc.rect(0, 0, W, 40, 'F');
  doc.setTextColor(...GOLD);
  doc.setFontSize(26);
  doc.setFont('helvetica', 'bold');
  doc.text('YARAGOLD', W / 2, 17, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(220, 200, 160);
  doc.text('Guide des Tailles \u2014 Or 18 Carats', W / 2, 26, { align: 'center' });
  doc.setFontSize(7);
  doc.setTextColor(160, 140, 110);
  doc.text('www.yaragold.com', W / 2, 34, { align: 'center' });

  let y = 50;

  // ── BAGUES ──
  y = sectionTitle(doc, 'BAGUES & ALLIANCES', M, y, CW);

  // Instructions
  doc.setTextColor(...DARK);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Comment mesurer votre doigt', M, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...MUTED);
  const steps = [
    '1.  Coupez une bande de papier fine (5 mm de large).',
    '2.  Enroulez-la autour de la base du doigt sans serrer.',
    '3.  Marquez le point de rencontre au stylo.',
    '4.  Mesurez la longueur en mm : c\u2019est votre taille fran\u00e7aise.',
  ];
  for (const s of steps) {
    doc.text(s, M + 2, y);
    y += 4.5;
  }
  y += 2;

  // Tips box
  doc.setFillColor(...LIGHT_BG);
  doc.roundedRect(M, y, CW, 18, 2, 2, 'F');
  doc.setTextColor(...GOLD);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text('Conseils', M + 4, y + 5.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...MUTED);
  doc.setFontSize(8);
  doc.text('\u2022  Mesurez en fin de journ\u00e9e quand le doigt est le plus large.', M + 4, y + 10.5);
  doc.text('\u2022  En cas d\u2019h\u00e9sitation, choisissez la taille sup\u00e9rieure.', M + 4, y + 15);
  y += 24;

  // ── TABLE ──
  doc.setTextColor(...DARK);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Tableau de Correspondance', M, y);
  y += 5;

  // Table: 3 columns properly sized
  const col1X = M;
  const col2X = M + 55;
  const col3X = M + 115;
  const rowH = 6.5;

  // Header row
  doc.setFillColor(...GOLD);
  doc.rect(M, y, CW, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('Taille FR', col1X + 4, y + 5);
  doc.text('Circonf\u00e9rence (mm)', col2X + 4, y + 5);
  doc.text('Diam\u00e8tre (mm)', col3X + 4, y + 5);
  y += 7;

  // Data rows
  for (let i = 0; i < RING_SIZES.length; i++) {
    const row = RING_SIZES[i];
    const ry = y + i * rowH;

    if (i % 2 === 0) {
      doc.setFillColor(...LIGHT_BG);
      doc.rect(M, ry, CW, rowH, 'F');
    }

    doc.setTextColor(...DARK);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.text(String(row.fr), col1X + 4, ry + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...MUTED);
    doc.text(`${row.circ} mm`, col2X + 4, ry + 4.5);
    doc.text(`${row.diam} mm`, col3X + 4, ry + 4.5);
  }

  // Table border
  const tableH = RING_SIZES.length * rowH;
  doc.setDrawColor(200, 190, 170);
  doc.setLineWidth(0.2);
  doc.rect(M, y, CW, tableH);

  y += tableH + 8;

  // Ring circles
  doc.setTextColor(...DARK);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text('Cercles de r\u00e9f\u00e9rence (taille r\u00e9elle) \u2014 posez votre bague dessus', M, y);
  y += 6;

  const circles = [
    { label: '41', diam: 13.0 },
    { label: '48', diam: 15.3 },
    { label: '52', diam: 16.5 },
    { label: '57', diam: 18.1 },
    { label: '64', diam: 20.4 },
    { label: '72', diam: 22.9 },
  ];
  const spacing = CW / circles.length;
  const circleCenterY = y + 13;
  for (let i = 0; i < circles.length; i++) {
    const cx = M + spacing * i + spacing / 2;
    const r = circles[i].diam / 2;
    doc.setDrawColor(...GOLD);
    doc.setLineWidth(0.5);
    doc.circle(cx, circleCenterY, r);
    doc.setTextColor(...DARK);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text(`T.${circles[i].label}`, cx, circleCenterY + r + 4, { align: 'center' });
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // PAGE 2
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  doc.addPage();
  y = 20;

  // ── COLLIERS ──
  y = sectionTitle(doc, 'COLLIERS & SAUTOIRS', M, y, CW);

  doc.setTextColor(...MUTED);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text(
    'Mesurez votre cou avec un m\u00e8tre ruban souple. Ajoutez 2 \u00e0 5 cm selon le style souhait\u00e9.',
    M, y
  );
  y += 8;

  const necklaces = [
    { name: 'Choker', range: '35 \u2013 40 cm', desc: 'Se porte ajust\u00e9 \u00e0 la base du cou. Id\u00e9al pour un look \u00e9l\u00e9gant et structur\u00e9.' },
    { name: 'Princesse', range: '42 \u2013 48 cm', desc: 'La longueur classique, tombe sur le haut du buste. Parfait pour pendentifs.' },
    { name: 'Matin\u00e9e', range: '50 \u2013 60 cm', desc: 'Id\u00e9al pour les pendentifs imposants et les tenues habill\u00e9es.' },
    { name: 'Sautoir / Op\u00e9ra', range: '70 \u2013 90 cm', desc: 'Peut \u00eatre port\u00e9 en double tour pour un effet sophistiqu\u00e9.' },
  ];

  for (const n of necklaces) {
    // Gold left bar
    doc.setFillColor(...GOLD);
    doc.rect(M, y - 1, 2.5, 13, 'F');

    doc.setTextColor(...DARK);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(n.name, M + 6, y + 3);

    doc.setTextColor(...GOLD);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.text(n.range, M + 6 + doc.getTextWidth(n.name + '  '), y + 3);

    doc.setTextColor(...MUTED);
    doc.setFontSize(8);
    doc.text(n.desc, M + 6, y + 9);

    y += 18;
  }

  y += 5;

  // Visual: necklace length diagram
  doc.setTextColor(...DARK);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text('Guide visuel des longueurs', M, y);
  y += 6;

  const neckX = W / 2;
  const neckTop = y;
  const lengths = [
    { label: 'Choker', cm: 38, r: 12 },
    { label: 'Princesse', cm: 45, r: 18 },
    { label: 'Matin\u00e9e', cm: 55, r: 25 },
    { label: 'Sautoir', cm: 80, r: 33 },
  ];
  for (const l of lengths) {
    doc.setDrawColor(...GOLD);
    doc.setLineWidth(0.3);
    doc.ellipse(neckX, neckTop + 2, l.r, l.r * 0.7);
    doc.setTextColor(...MUTED);
    doc.setFontSize(6.5);
    doc.text(l.label, neckX + l.r + 2, neckTop + 2 + l.r * 0.7 - 1);
  }

  y = neckTop + 55;

  // ── BRACELETS ──
  y = sectionTitle(doc, 'BRACELETS & JONCS', M, y, CW);

  doc.setTextColor(...MUTED);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  const braceletLines = doc.splitTextToSize(
    'Mesurez votre poignet avec un m\u00e8tre ruban souple juste au-dessus de l\u2019os du poignet. '
    + 'Ajoutez 1,5 \u00e0 2 cm selon le confort souhait\u00e9 (ajust\u00e9 ou libre).',
    CW
  );
  doc.text(braceletLines, M, y);
  y += braceletLines.length * 4.5 + 6;

  // Bracelet sizes — 3 cards
  const cardW = (CW - 10) / 3;
  const bracelets = [
    { size: 'Small', range: '15 \u2013 16 cm', desc: 'Poignet fin' },
    { size: 'Medium', range: '17 \u2013 18 cm', desc: 'Standard' },
    { size: 'Large', range: '19 \u2013 20 cm', desc: 'Poignet large' },
  ];

  for (let i = 0; i < bracelets.length; i++) {
    const bx = M + i * (cardW + 5);

    doc.setFillColor(...LIGHT_BG);
    doc.roundedRect(bx, y, cardW, 24, 2, 2, 'F');
    doc.setDrawColor(...GOLD);
    doc.setLineWidth(0.3);
    doc.roundedRect(bx, y, cardW, 24, 2, 2, 'S');

    doc.setTextColor(...GOLD);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(bracelets[i].size, bx + cardW / 2, y + 8, { align: 'center' });

    doc.setTextColor(...DARK);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(bracelets[i].range, bx + cardW / 2, y + 14, { align: 'center' });

    doc.setTextColor(...MUTED);
    doc.setFontSize(7);
    doc.text(bracelets[i].desc, bx + cardW / 2, y + 19, { align: 'center' });
  }

  y += 35;

  // ── Tips box ──
  doc.setFillColor(25, 20, 12);
  doc.roundedRect(M, y, CW, 22, 2, 2, 'F');
  doc.setTextColor(...GOLD);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Bon \u00e0 savoir', M + 6, y + 7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(220, 200, 160);
  doc.setFontSize(8);
  doc.text('\u2022  Chaque pi\u00e8ce YaraGold peut \u00eatre ajust\u00e9e sur mesure dans nos ateliers.', M + 6, y + 13);
  doc.text('\u2022  Contactez-nous pour toute question : contact@yaragold.com', M + 6, y + 18);

  // ── Footer on both pages ──
  for (let p = 1; p <= doc.getNumberOfPages(); p++) {
    doc.setPage(p);
    hLine(doc, M, 282, CW, [200, 190, 170], 0.2);
    doc.setTextColor(160, 145, 115);
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.text(
      'YaraGold Heritage \u2014 Or 18 Carats \u2014 Bijoux artisanaux marocains',
      W / 2, 286, { align: 'center' }
    );
    doc.text(`Page ${p} / 2`, W / 2, 290, { align: 'center' });
  }

  doc.save('Guide-Tailles-YaraGold.pdf');
}
