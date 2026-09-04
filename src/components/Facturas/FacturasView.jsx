import React, { useState } from 'react';
import { 
  Receipt, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  MessageCircle, 
  Trash2, 
  Edit, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  User, 
  ShieldCheck, 
  Check, 
  X,
  CreditCard
} from 'lucide-react';
import { generateFacturaPDF } from '../../services/pdfGenerator';
import { generateWhatsappLink, createFacturaNotificationMessage } from '../../services/whatsapp';

export const FacturasView = ({
  facturas = [],
  pacientes = [],
  config = {},
  onSaveFactura,
  onDeleteFactura,
  onUpdateFacturaEstado,
  preselectedPaciente = null,
  onClearPreselectedPaciente
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('all');
  const [filterEstado, setFilterEstado] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFactura, setEditingFactura] = useState(null);

  // Form State
  const [formPacienteId, setFormPacienteId] = useState('');
  const [formPacienteNombre, setFormPacienteNombre] = useState('');
  const [formPacienteDni, setFormPacienteDni] = useState('');
  const [formPacienteDomicilio, setFormPacienteDomicilio] = useState('Corrientes Capital');
  const [formTipoComprobante, setFormTipoComprobante] = useState('Factura C');
  const [formNumeroFactura, setFormNumeroFactura] = useState('');
  const [formFechaEmision, setFormFechaEmision] = useState(new Date().toISOString().split('T')[0]);
  const [formPeriodo, setFormPeriodo] = useState('Septiembre 2026');
  const [formCondicionVenta, setFormCondicionVenta] = useState('Transferencia Bancaria');
  const [formCondicionIvaReceptor, setFormCondicionIvaReceptor] = useState('Consumidor Final');
  const [formEstado, setFormEstado] = useState('Cobrada');
  const [formObservaciones, setFormObservaciones] = useState('');
  const [formCae, setFormCae] = useState('');
  const [formVencimientoCae, setFormVencimientoCae] = useState('');

  // Items table
  const [items, setItems] = useState([
    { descripcion: 'Sesión de Psicoterapia Individual', cantidad: 1, precioUnitario: 25000, total: 25000 }
  ]);

  // Totals calculations
  const totalFacturado = facturas.reduce((acc, f) => acc + (f.total || 0), 0);
  const totalCobrado = facturas.filter(f => f.estado === 'Cobrada').reduce((acc, f) => acc + (f.total || 0), 0);
  const totalPendiente = facturas.filter(f => f.estado === 'Pendiente').reduce((acc, f) => acc + (f.total || 0), 0);
  const promedioComprobante = facturas.length > 0 ? Math.round(totalFacturado / facturas.length) : 0;

  // Filtrado de lista
  const facturasFiltradas = facturas.filter(f => {
    const matchSearch = 
      (f.pacienteNombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (f.pacienteDni || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (f.numeroFactura || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (f.concepto || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchTipo = filterTipo === 'all' || f.tipoComprobante === filterTipo;
    const matchEstado = filterEstado === 'all' || f.estado === filterEstado;

    return matchSearch && matchTipo && matchEstado;
  });

  // Helper para generar próximo número de factura
  const getNextFacturaNumber = () => {
    if (!facturas.length) return '0001-00000145';
    const lastNum = facturas.reduce((max, f) => {
      const match = (f.numeroFactura || '').match(/\d+$/);
      if (match) {
        const num = parseInt(match[0], 10);
        return num > max ? num : max;
      }
      return max;
    }, 144);
    return `0001-${String(lastNum + 1).padStart(8, '0')}`;
  };

  const handleOpenNuevo = (preselectedPaciente = null) => {
    setEditingFactura(null);
    const nextNum = getNextFacturaNumber();
    setFormNumeroFactura(nextNum);
    setFormFechaEmision(new Date().toISOString().split('T')[0]);
    setFormPeriodo('Septiembre 2026');
    setFormTipoComprobante('Factura C');
    setFormCondicionVenta('Transferencia Bancaria');
    setFormCondicionIvaReceptor('Consumidor Final');
    setFormEstado('Cobrada');
    setFormObservaciones('Comprobante oficial de honorarios profesionales emitido para reintegro.');
    setFormCae('74' + Math.floor(100000000000 + Math.random() * 900000000000));
    
    const d = new Date();
    d.setDate(d.getDate() + 10);
    setFormVencimientoCae(d.toISOString().split('T')[0]);

    if (preselectedPaciente) {
      setFormPacienteId(preselectedPaciente.id);
      setFormPacienteNombre(preselectedPaciente.nombreCompleto);
      setFormPacienteDni(preselectedPaciente.dni || '');
      const precio = preselectedPaciente.coseguroPactado !== undefined && preselectedPaciente.coseguroPactado > 0 
        ? preselectedPaciente.coseguroPactado 
        : 25000;
      setItems([{
        descripcion: preselectedPaciente.obraSocialId !== 'particular' 
          ? `Coseguro por Atención Psicológica (${preselectedPaciente.obraSocialId.toUpperCase()})` 
          : 'Sesión de Psicoterapia Individual',
        cantidad: 1,
        precioUnitario: precio,
        total: precio
      }]);
    } else if (pacientes.length > 0) {
      const p = pacientes[0];
      setFormPacienteId(p.id);
      setFormPacienteNombre(p.nombreCompleto);
      setFormPacienteDni(p.dni || '');
      setItems([{ descripcion: 'Sesión de Psicoterapia Individual', cantidad: 1, precioUnitario: 25000, total: 25000 }]);
    }

    setIsModalOpen(true);
  };

  React.useEffect(() => {
    if (preselectedPaciente) {
      handleOpenNuevo(preselectedPaciente);
      if (onClearPreselectedPaciente) onClearPreselectedPaciente();
    }
  }, [preselectedPaciente]);

  const handleSelectPaciente = (pacId) => {
    setFormPacienteId(pacId);
    const p = pacientes.find(item => item.id === pacId);
    if (p) {
      setFormPacienteNombre(p.nombreCompleto);
      setFormPacienteDni(p.dni || '');
      const precio = p.coseguroPactado !== undefined && p.coseguroPactado > 0 ? p.coseguroPactado : 25000;
      setItems([{
        descripcion: p.obraSocialId !== 'particular' ? `Coseguro Sesión Psicoterapia (${p.obraSocialId.toUpperCase()})` : 'Sesión de Psicoterapia Individual',
        cantidad: 1,
        precioUnitario: precio,
        total: precio
      }]);
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    const item = { ...newItems[index] };

    if (field === 'cantidad') {
      item.cantidad = Math.max(1, parseInt(value, 10) || 1);
      item.total = item.cantidad * item.precioUnitario;
    } else if (field === 'precioUnitario') {
      item.precioUnitario = Math.max(0, parseFloat(value) || 0);
      item.total = item.cantidad * item.precioUnitario;
    } else {
      item[field] = value;
    }

    newItems[index] = item;
    setItems(newItems);
  };

  const handleAddItem = () => {
    setItems([...items, { descripcion: 'Sesión de Psicoterapia', cantidad: 1, precioUnitario: 25000, total: 25000 }]);
  };

  const handleRemoveItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, idx) => idx !== index));
    }
  };

  const calculateSubtotal = () => items.reduce((acc, item) => acc + (item.total || 0), 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const subtotal = calculateSubtotal();
    const facturaData = {
      id: editingFactura ? editingFactura.id : `fac-${Date.now()}`,
      numeroFactura: formNumeroFactura || getNextFacturaNumber(),
      tipoComprobante: formTipoComprobante,
      fechaEmision: formFechaEmision,
      pacienteId: formPacienteId,
      pacienteNombre: formPacienteNombre || 'Consumidor Final',
      pacienteDni: formPacienteDni,
      pacienteDomicilio: formPacienteDomicilio,
      condicionIvaReceptor: formCondicionIvaReceptor,
      condicionVenta: formCondicionVenta,
      periodoFacturado: formPeriodo,
      concepto: items.map(i => i.descripcion).join(', '),
      items: items,
      subtotal: subtotal,
      descuento: 0,
      total: subtotal,
      estado: formEstado,
      cae: formCae,
      vencimientoCae: formVencimientoCae,
      observaciones: formObservaciones
    };

    onSaveFactura(facturaData);
    setIsModalOpen(false);
  };

  const handleDownloadPDF = (factura) => {
    const paciente = pacientes.find(p => p.id === factura.pacienteId);
    generateFacturaPDF({ factura, config, paciente });
  };

  const handleSendWhatsapp = (factura) => {
    const paciente = pacientes.find(p => p.id === factura.pacienteId);
    const telefono = paciente?.telefono || '';
    if (!telefono) {
      alert('El paciente no tiene un número de teléfono cargado.');
      return;
    }
    const message = createFacturaNotificationMessage({
      config,
      factura,
      pacienteNombre: factura.pacienteNombre
    });
    const url = generateWhatsappLink(telefono, message);
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-5 animate-fade-in">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-5 sm:p-6 rounded-3xl shadow-md border border-slate-800">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck size={12} /> Facturación Profesional
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display">Facturación y Recibos Oficiales</h2>
          <p className="text-slate-300 text-xs mt-0.5">
            Generá Facturas C, B y Recibos de Honorarios con descarga en PDF y envío directo por WhatsApp.
          </p>
        </div>

        <button
          onClick={() => handleOpenNuevo()}
          className="btn btn-primary text-xs py-2 px-4 shadow-sm self-start md:self-auto font-bold"
        >
          <Plus size={15} />
          <span>Emitir Factura / Recibo</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="card p-4.5 card-glow-purple">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Facturado</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-900">
              <DollarSign size={18} />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white mt-1">
            ${totalFacturado.toLocaleString('es-AR')}
          </h3>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
            {facturas.length} comprobantes registrados
          </p>
        </div>

        <div className="card p-4.5 card-glow-emerald">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Cobrado</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-900">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold font-display text-emerald-700 dark:text-emerald-400 mt-1">
            ${totalCobrado.toLocaleString('es-AR')}
          </h3>
          <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
            Acreditado o recibido
          </p>
        </div>

        <div className="card p-4.5 card-glow-amber">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Pendiente</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-100 dark:border-amber-900">
              <Clock size={18} />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold font-display text-amber-700 dark:text-amber-400 mt-1">
            ${totalPendiente.toLocaleString('es-AR')}
          </h3>
          <p className="text-[11px] text-amber-600 font-medium mt-0.5">
            Por regularizar
          </p>
        </div>

        <div className="card p-4.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Promedio</span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-sky-100 dark:border-sky-900">
              <Receipt size={18} />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white mt-1">
            ${promedioComprobante.toLocaleString('es-AR')}
          </h3>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
            Por emisión
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card p-3.5 sm:p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por paciente, DNI o Nro Factura..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-9 text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterTipo}
            onChange={(e) => setFilterTipo(e.target.value)}
            className="input-field py-1.5 px-2.5 text-xs w-auto"
          >
            <option value="all">Todos los Tipos</option>
            <option value="Factura C">Factura C</option>
            <option value="Factura B">Factura B</option>
            <option value="Recibo de Honorarios">Recibo de Honorarios</option>
          </select>

          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="input-field py-1.5 px-2.5 text-xs w-auto"
          >
            <option value="all">Todos los Estados</option>
            <option value="Cobrada">Cobradas</option>
            <option value="Pendiente">Pendientes</option>
            <option value="Anulada">Anuladas</option>
          </select>
        </div>
      </div>

      {/* Facturas Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3">Comprobante</th>
                <th className="px-4 py-3">Fecha & Período</th>
                <th className="px-4 py-3">Paciente / Receptor</th>
                <th className="px-4 py-3">Concepto Principal</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3 text-center">Estado</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {facturasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-5 py-10 text-center text-slate-400">
                    <Receipt size={28} className="mx-auto text-slate-300 mb-1.5 opacity-50" />
                    <p className="font-medium text-xs">No se encontraron facturas con los filtros seleccionados.</p>
                  </td>
                </tr>
              ) : (
                facturasFiltradas.map((factura) => {
                  const isCobrada = factura.estado === 'Cobrada';
                  const isFacturaC = factura.tipoComprobante?.includes('Factura');

                  return (
                    <tr key={factura.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      
                      {/* Comprobante */}
                      <td className="px-4 py-3 font-mono">
                        <div className="flex items-center gap-1.5">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            isFacturaC 
                              ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200' 
                              : 'bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200'
                          }`}>
                            {factura.tipoComprobante}
                          </span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">{factura.numeroFactura}</span>
                        </div>
                        {factura.cae && (
                          <div className="text-[10px] text-slate-400 mt-0.5 font-sans">CAE: {factura.cae.substring(0, 8)}...</div>
                        )}
                      </td>

                      {/* Fecha */}
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">{factura.fechaEmision}</div>
                        <div className="text-[10px] text-slate-400">{factura.periodoFacturado || 'Mes en curso'}</div>
                      </td>

                      {/* Paciente */}
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                          <User size={12} className="text-slate-400" />
                          {factura.pacienteNombre}
                        </div>
                        <div className="text-[10px] text-slate-400">DNI: {factura.pacienteDni || 'S/D'}</div>
                      </td>

                      {/* Concepto */}
                      <td className="px-4 py-3 max-w-xs">
                        <div className="truncate text-slate-700 dark:text-slate-300" title={factura.concepto}>
                          {factura.concepto || 'Servicios Profesionales de Psicología'}
                        </div>
                        <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                          {factura.condicionVenta}
                        </div>
                      </td>

                      {/* Total */}
                      <td className="px-4 py-3 text-right">
                        <div className="text-xs font-bold text-slate-900 dark:text-white font-mono">
                          ${Number(factura.total).toLocaleString('es-AR')}
                        </div>
                      </td>

                      {/* Estado Toggle */}
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => onUpdateFacturaEstado(factura.id, isCobrada ? 'Pendiente' : 'Cobrada')}
                          title="Click para cambiar estado"
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all cursor-pointer ${
                            isCobrada
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200'
                          }`}
                        >
                          {isCobrada ? <CheckCircle2 size={11} /> : <Clock size={11} />}
                          <span>{factura.estado}</span>
                        </button>
                      </td>

                      {/* Acciones */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleDownloadPDF(factura)}
                            title="Descargar PDF Oficial"
                            className="p-1 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950 rounded-lg transition-colors border border-emerald-100 dark:border-emerald-900"
                          >
                            <Download size={13} />
                          </button>

                          <button
                            onClick={() => handleSendWhatsapp(factura)}
                            title="Enviar aviso por WhatsApp"
                            className="p-1 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950 rounded-lg transition-colors border border-emerald-100 dark:border-emerald-900"
                          >
                            <MessageCircle size={13} />
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`¿Eliminar la factura ${factura.numeroFactura}?`)) {
                                onDeleteFactura(factura.id);
                              }
                            }}
                            title="Eliminar Factura"
                            className="p-1 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg transition-colors border border-rose-100 dark:border-rose-900"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nueva / Editar Factura */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="card max-w-2xl w-full p-5 sm:p-6 shadow-xl space-y-4 max-h-[92vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Receipt size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-display text-slate-900 dark:text-white">
                    {editingFactura ? 'Editar Comprobante' : 'Emisión de Factura / Recibo Oficial'}
                  </h3>
                  <p className="text-[11px] text-slate-400">Comprobante fiscal o recibo con formato estándar</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tipo de Comprobante
                  </label>
                  <select
                    value={formTipoComprobante}
                    onChange={(e) => setFormTipoComprobante(e.target.value)}
                    className="input-field text-xs"
                  >
                    <option value="Factura C">Factura C (Monotributo)</option>
                    <option value="Recibo de Honorarios">Recibo de Honorarios</option>
                    <option value="Factura B">Factura B (Resp. Inscripto)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Número
                  </label>
                  <input
                    type="text"
                    value={formNumeroFactura}
                    onChange={(e) => setFormNumeroFactura(e.target.value)}
                    placeholder="0001-00000145"
                    className="input-field text-xs font-mono font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Fecha de Emisión
                  </label>
                  <input
                    type="date"
                    value={formFechaEmision}
                    onChange={(e) => setFormFechaEmision(e.target.value)}
                    className="input-field text-xs"
                    required
                  />
                </div>
              </div>

              {/* Patient / Receptor */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2.5">
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <User size={12} /> Datos del Receptor / Paciente
                </span>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">
                      Seleccionar Paciente
                    </label>
                    <select
                      value={formPacienteId}
                      onChange={(e) => handleSelectPaciente(e.target.value)}
                      className="input-field text-xs"
                    >
                      <option value="">-- Cargar manualmente --</option>
                      {pacientes.map((p) => (
                        <option key={p.id} value={p.id}>{p.nombreCompleto} (DNI: {p.dni || 'S/D'})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">
                      Nombre y Apellido
                    </label>
                    <input
                      type="text"
                      value={formPacienteNombre}
                      onChange={(e) => setFormPacienteNombre(e.target.value)}
                      placeholder="Nombre del paciente"
                      className="input-field text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">
                      DNI / CUIT
                    </label>
                    <input
                      type="text"
                      value={formPacienteDni}
                      onChange={(e) => setFormPacienteDni(e.target.value)}
                      placeholder="38.452.190"
                      className="input-field text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">
                      Condición IVA Receptor
                    </label>
                    <select
                      value={formCondicionIvaReceptor}
                      onChange={(e) => setFormCondicionIvaReceptor(e.target.value)}
                      className="input-field text-xs"
                    >
                      <option value="Consumidor Final">Consumidor Final</option>
                      <option value="Monotributo">Responsable Monotributo</option>
                      <option value="Exento">IVA Exento</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">
                      Condición de Pago
                    </label>
                    <select
                      value={formCondicionVenta}
                      onChange={(e) => setFormCondicionVenta(e.target.value)}
                      className="input-field text-xs"
                    >
                      <option value="Transferencia Bancaria">Transferencia Bancaria</option>
                      <option value="Efectivo">Efectivo</option>
                      <option value="Mercado Pago">Mercado Pago / QR</option>
                      <option value="Débito">Tarjeta de Débito</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">
                      Período Facturado
                    </label>
                    <input
                      type="text"
                      value={formPeriodo}
                      onChange={(e) => setFormPeriodo(e.target.value)}
                      placeholder="Septiembre 2026"
                      className="input-field text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Detalle de Conceptos / Sesiones
                  </span>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold"
                  >
                    <Plus size={13} />
                    <span>Agregar Ítem</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/40 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Descripción del concepto"
                          value={item.descripcion}
                          onChange={(e) => handleItemChange(idx, 'descripcion', e.target.value)}
                          className="input-field text-xs"
                          required
                        />
                      </div>
                      <div className="w-16">
                        <input
                          type="number"
                          min="1"
                          placeholder="Cant."
                          value={item.cantidad}
                          onChange={(e) => handleItemChange(idx, 'cantidad', e.target.value)}
                          className="input-field text-xs text-center font-bold"
                          required
                        />
                      </div>
                      <div className="w-28">
                        <input
                          type="number"
                          min="0"
                          step="100"
                          placeholder="Precio Unit."
                          value={item.precioUnitario}
                          onChange={(e) => handleItemChange(idx, 'precioUnitario', e.target.value)}
                          className="input-field text-xs text-right font-bold"
                          required
                        />
                      </div>
                      <div className="w-24 text-right font-bold text-xs text-emerald-600 dark:text-emerald-400 pr-1">
                        ${Number(item.total).toLocaleString('es-AR')}
                      </div>
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Subtotal */}
                <div className="flex justify-end pt-1">
                  <div className="bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-right min-w-[200px]">
                    <span className="text-[11px] text-slate-500">Total a Facturar:</span>
                    <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                      ${calculateSubtotal().toLocaleString('es-AR')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Fiscal CAE / Observaciones */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">
                    CAE Electrónico (AFIP)
                  </label>
                  <input
                    type="text"
                    value={formCae}
                    onChange={(e) => setFormCae(e.target.value)}
                    placeholder="74392019482910"
                    className="input-field text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">
                    Vencimiento CAE
                  </label>
                  <input
                    type="date"
                    value={formVencimientoCae}
                    onChange={(e) => setFormVencimientoCae(e.target.value)}
                    className="input-field text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">
                    Estado Inicial
                  </label>
                  <select
                    value={formEstado}
                    onChange={(e) => setFormEstado(e.target.value)}
                    className="input-field text-xs font-semibold"
                  >
                    <option value="Cobrada">Cobrada</option>
                    <option value="Pendiente">Pendiente</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 mb-1">
                  Observaciones / Leyenda para Reintegro
                </label>
                <input
                  type="text"
                  value={formObservaciones}
                  onChange={(e) => setFormObservaciones(e.target.value)}
                  placeholder="Ej: Factura emitida para reintegro de OSDE / IOSCOR..."
                  className="input-field text-xs"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary text-xs"
                >
                  <Check size={14} />
                  <span>Guardar Comprobante</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
