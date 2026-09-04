import jsPDF from 'jspdf';

export const generateConstanciaPDF = ({ paciente, turno, config, sede }) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const primaryColor = [13, 148, 136]; // #0d9488
  const darkColor = [30, 41, 59]; // #1e293b
  const grayColor = [100, 116, 139]; // #64748b

  // Header Banner
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 25, 'F');

  // Header Text
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('CONSTANCIA DE ASISTENCIA A SESIÓN PSICOLÓGICA', 105, 16, { align: 'center' });

  // Professional details
  doc.setTextColor(...darkColor);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(config.nombre || 'Lic. Virna Toledo', 20, 38);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...grayColor);
  doc.text(`${config.titulo || 'Licenciada en Psicología'} | ${config.matriculaProvincial || 'M.P. 1842'}`, 20, 44);
  doc.text(`${config.colegio || 'Colegio de Psicólogos de Corrientes'} | CUIT: ${config.cuit || '27-38452190-4'}`, 20, 49);
  doc.text(`Contacto: ${config.telefono || ''} | ${config.email || ''}`, 20, 54);

  // Divider
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(20, 58, 190, 58);

  // Body content
  doc.setTextColor(...darkColor);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');

  const fechaHoy = new Date().toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  doc.text(`Corrientes Capital, ${fechaHoy}`, 190, 68, { align: 'right' });

  const textoCuerpo = `Por medio de la presente, la profesional que suscribe hace constar que el/la paciente ${paciente.nombreCompleto}, DNI Nº ${paciente.dni || '..........'}, asistió a sesión de atención psicológica el día ${turno?.fecha || '....................'} en el horario de ${turno?.horaInicio || '..........'} hs en ${sede?.nombre || 'el consultorio profesional'}.`;

  const splitText = doc.splitTextToSize(textoCuerpo, 170);
  doc.text(splitText, 20, 85);

  doc.text('Se extiende la presente constancia a pedido del/de la interesado/a para ser presentada ante las autoridades que correspondan.', 20, 115);

  // Signature area
  doc.setDrawColor(148, 163, 184);
  doc.line(115, 175, 185, 175);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(config.nombre || 'Lic. Virna Toledo', 150, 182, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...grayColor);
  doc.text(config.matriculaProvincial || 'M.P. 1842', 150, 187, { align: 'center' });
  doc.text(config.colegio || 'Colegio de Psicólogos de Corrientes', 150, 192, { align: 'center' });

  // Footer note
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('Documento emitido digitalmente por PsicoPlus - Sistema de Gestión Clínica y Multisede', 105, 280, { align: 'center' });

  doc.save(`Constancia_${paciente.nombreCompleto.replace(/\s+/g, '_')}_${turno?.fecha || 'sesion'}.pdf`);
};

export const generatePlanillaLiquidacionPDF = ({ obraSocial, periodo, pacientes, config, liquidacion }) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Header
  doc.setFillColor(15, 23, 42); // #0f172a
  doc.rect(0, 0, 210, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(`PLANILLA DE LIQUIDACIÓN DE PRESTACIONES - ${obraSocial.nombre.toUpperCase()}`, 105, 15, { align: 'center' });

  // Details
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Profesional: ${config.nombre}`, 20, 34);
  doc.text(`Período de Facturación: ${periodo}`, 130, 34);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Matrícula: ${config.matriculaProvincial} | CUIT: ${config.cuit}`, 20, 40);
  doc.text(`Obra Social: ${obraSocial.nombre} (${obraSocial.tipo})`, 20, 46);
  doc.text(`Arancel por sesión: $${obraSocial.arancelSesion.toLocaleString('es-AR')}`, 130, 46);

  // Table header
  let y = 58;
  doc.setFillColor(241, 245, 249);
  doc.rect(20, y - 5, 170, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('PACIENTE', 23, y);
  doc.text('DNI', 65, y);
  doc.text('Nº AFILIADO / ORDEN', 95, y);
  doc.text('SESIONES', 140, y);
  doc.text('TOTAL ($)', 175, y, { align: 'right' });

  // Table rows
  y += 6;
  doc.setFont('helvetica', 'normal');
  let totalSesiones = 0;
  let totalMonto = 0;

  pacientes.forEach((p, idx) => {
    const ses = p.sesionesConsumidas || 1;
    const monto = ses * obraSocial.arancelSesion;
    totalSesiones += ses;
    totalMonto += monto;

    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(20, y - 4, 170, 7, 'F');
    }

    doc.text(p.nombreCompleto.substring(0, 22), 23, y);
    doc.text(p.dni || '-', 65, y);
    doc.text(`${p.numeroAfiliado || '-'} (${p.numeroOrden || '-'})`.substring(0, 24), 95, y);
    doc.text(ses.toString(), 145, y);
    doc.text(`$${monto.toLocaleString('es-AR')}`, 188, y, { align: 'right' });
    y += 7;
  });

  // Table Total
  y += 4;
  doc.setDrawColor(203, 213, 225);
  doc.line(20, y - 3, 190, y - 3);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('TOTAL GENERAL A LIQUIDAR:', 95, y + 2);
  doc.text(`${totalSesiones}`, 145, y + 2);
  doc.text(`$${totalMonto.toLocaleString('es-AR')}`, 188, y + 2, { align: 'right' });

  // Signature
  doc.line(120, 230, 185, 230);
  doc.text('Firma y Sello Profesional', 152, 237, { align: 'center' });

  doc.save(`Liquidacion_${obraSocial.sigla}_${periodo.replace(/\s+/g, '_')}.pdf`);
};

export const generateFacturaPDF = ({ factura, config, paciente }) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const isFacturaC = factura.tipoComprobante?.includes('Factura');
  const letra = isFacturaC ? 'C' : 'R';
  const codigoComprobante = isFacturaC ? 'COD. 011' : 'RECIBO PRO';

  // Outer border box
  doc.setDrawColor(79, 70, 229); // indigo
  doc.setLineWidth(0.4);
  doc.rect(14, 12, 182, 270);

  // Center letter box
  doc.setFillColor(245, 243, 255);
  doc.rect(98, 12, 14, 15, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(79, 70, 229);
  doc.text(letra, 105, 22, { align: 'center' });
  doc.setFontSize(6);
  doc.setTextColor(100, 116, 139);
  doc.text(codigoComprobante, 105, 26, { align: 'center' });

  // Dividing vertical line in header
  doc.setDrawColor(226, 232, 240);
  doc.line(105, 27, 105, 68);

  // Left header: Emisor
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(config.nombre || 'Lic. Virna Toledo', 18, 22);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`${config.titulo || 'Licenciada en Psicología'} - ${config.matriculaProvincial || 'M.P. 1842'}`, 18, 28);
  doc.text(config.colegio || 'Colegio de Psicólogos de Corrientes', 18, 33);
  doc.text(`Domicilio: ${config.domicilioComercial || 'Pellegrini 1250, 1° Piso - Corrientes'}`, 18, 38);
  doc.text(`IVA: ${config.condicionIva || 'Responsable Monotributo'}`, 18, 43);
  doc.text(`Contacto: ${config.telefono || ''} | ${config.email || ''}`, 18, 48);

  // Right header: Comprobante & Fechas
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(factura.tipoComprobante?.toUpperCase() || 'FACTURA C', 115, 22);

  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(`Punto de Venta: ${config.puntoVenta || '0001'}   Comp. Nro: ${factura.numeroFactura || '00000001'}`, 115, 28);
  doc.text(`Fecha de Emisión: ${factura.fechaEmision || new Date().toISOString().split('T')[0]}`, 115, 34);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`CUIT: ${config.cuit || '27-38452190-4'}`, 115, 40);
  doc.text(`Ingresos Brutos: ${config.ingresosBrutos || config.cuit || '27-38452190-4'}`, 115, 45);
  doc.text(`Inicio de Actividades: ${config.inicioActividades || '15/03/2019'}`, 115, 50);

  // Divider Line
  doc.setDrawColor(79, 70, 229);
  doc.setLineWidth(0.3);
  doc.line(14, 68, 196, 68);

  // Receptor Section
  doc.setFillColor(248, 250, 252);
  doc.rect(14, 68, 182, 28, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text('DATOS DEL RECEPTOR / PACIENTE', 18, 74);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(`Nombre / Razón Social:`, 18, 80);
  doc.setFont('helvetica', 'bold');
  doc.text(factura.pacienteNombre || paciente?.nombreCompleto || 'Consumidor Final', 58, 80);

  doc.setFont('helvetica', 'normal');
  doc.text(`DNI / CUIT:`, 18, 86);
  doc.setFont('helvetica', 'bold');
  doc.text(factura.pacienteDni || paciente?.dni || 'Sin especificar', 58, 86);

  doc.setFont('helvetica', 'normal');
  doc.text(`Condición IVA:`, 18, 92);
  doc.text(factura.condicionIvaReceptor || 'Consumidor Final', 58, 92);

  doc.text(`Domicilio:`, 115, 80);
  doc.text(factura.pacienteDomicilio || 'Corrientes Capital', 140, 80);

  doc.text(`Condición Venta:`, 115, 86);
  doc.text(factura.condicionVenta || 'Contado / Transferencia', 140, 86);

  if (factura.periodoFacturado) {
    doc.text(`Período Facturado:`, 115, 92);
    doc.text(factura.periodoFacturado, 145, 92);
  }

  // Divider Line
  doc.setDrawColor(203, 213, 225);
  doc.line(14, 96, 196, 96);

  // Items Table Header
  doc.setFillColor(79, 70, 229);
  doc.rect(14, 98, 182, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('CÓDIGO / DETALLE', 18, 103);
  doc.text('CANTIDAD', 120, 103, { align: 'center' });
  doc.text('PRECIO UNITARIO', 150, 103, { align: 'right' });
  doc.text('SUBTOTAL', 190, 103, { align: 'right' });

  // Items Rows
  let currentY = 111;
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'normal');

  const items = (factura.items && factura.items.length > 0) 
    ? factura.items 
    : [{ descripcion: factura.concepto || 'Servicios Profesionales de Psicología', cantidad: 1, precioUnitario: factura.total, total: factura.total }];

  items.forEach((item, index) => {
    if (index % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, currentY - 5, 182, 7, 'F');
    }

    doc.text(item.descripcion.substring(0, 55), 18, currentY);
    doc.text(String(item.cantidad || 1), 120, currentY, { align: 'center' });
    doc.text(`$${Number(item.precioUnitario || 0).toLocaleString('es-AR', { minimumFractionDigits: 2 })}`, 150, currentY, { align: 'right' });
    doc.text(`$${Number(item.total || 0).toLocaleString('es-AR', { minimumFractionDigits: 2 })}`, 190, currentY, { align: 'right' });
    
    currentY += 8;
  });

  // Observations if any
  if (factura.observaciones) {
    currentY += 4;
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`Observaciones: ${factura.observaciones}`, 18, currentY);
  }

  // Totals Box
  const totalsY = 195;
  doc.setDrawColor(226, 232, 240);
  doc.line(14, totalsY, 196, totalsY);

  doc.setFillColor(245, 243, 255);
  doc.rect(115, totalsY + 4, 81, 24, 'FD');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Subtotal:', 120, totalsY + 11);
  doc.text(`$${Number(factura.subtotal || factura.total).toLocaleString('es-AR', { minimumFractionDigits: 2 })}`, 190, totalsY + 11, { align: 'right' });

  if (factura.descuento && factura.descuento > 0) {
    doc.text('Descuento:', 120, totalsY + 16);
    doc.text(`-$${Number(factura.descuento).toLocaleString('es-AR', { minimumFractionDigits: 2 })}`, 190, totalsY + 16, { align: 'right' });
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(79, 70, 229);
  doc.text('Importe Total:', 120, totalsY + 23);
  doc.text(`$${Number(factura.total).toLocaleString('es-AR', { minimumFractionDigits: 2 })}`, 190, totalsY + 23, { align: 'right' });

  // Fiscal / CAE Box (Bottom Left)
  const caeY = 230;
  doc.setDrawColor(203, 213, 225);
  doc.line(14, caeY, 196, caeY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);

  if (factura.cae) {
    doc.text(`CAE Nº: ${factura.cae}`, 18, caeY + 8);
    doc.text(`Fecha de Vencimiento de CAE: ${factura.vencimientoCae || '10 días posteriores'}`, 18, caeY + 14);
  } else {
    doc.text(`Comprobante Electrónico Autorizado / Emitido en Línea`, 18, caeY + 8);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`Forma de Cancelación: ${factura.condicionVenta || 'Transferencia / Efectivo'}`, 18, caeY + 14);
  }

  // Signature line
  doc.setDrawColor(148, 163, 184);
  doc.line(135, caeY + 25, 185, caeY + 25);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);
  doc.text(config.nombre || 'Lic. Virna Toledo', 160, caeY + 30, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(config.matriculaProvincial || 'M.P. 1842', 160, caeY + 34, { align: 'center' });

  // System stamp footer
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('Comprobante emitido a través de PsicoPlus PRO - Sistema Integral de Gestión Profesional y Multisede', 105, 276, { align: 'center' });

  doc.save(`Factura_${(factura.numeroFactura || '0001').replace(/\s+/g, '_')}_${(factura.pacienteNombre || 'Paciente').replace(/\s+/g, '_')}.pdf`);
};

