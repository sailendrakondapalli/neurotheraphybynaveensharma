import { useEffect, useState } from 'react'
import { Phone, MessageCircle, Mail, Eye, Trash2, X, ChevronDown, AlertTriangle } from 'lucide-react'
import { getAllAppointmentsAdmin, updateAppointmentStatus, deleteAppointment } from '../../services/neurotherapyService'
import { getWebsiteSettings } from '../../services/neurotherapyService'
import toast from 'react-hot-toast'

const STATUSES = ['new', 'contacted', 'scheduled', 'completed', 'cancelled']
const STATUS_COLORS = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  scheduled: 'bg-purple-100 text-purple-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center overflow-y-auto py-8 px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>{children}</div>
    </div>
  )
}

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([])
  const [settings, setSettings] = useState({})
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const load = () => {
    Promise.all([getAllAppointmentsAdmin(), getWebsiteSettings()])
      .then(([a, s]) => { setAppointments(a); setSettings(s) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const filtered = filter === 'all' ? appointments : appointments.filter(a => a.status === filter)

  const handleStatusChange = async (id, status) => {
    try { await updateAppointmentStatus(id, status); load(); if (selected?.id === id) setSelected(a => ({...a, status})) }
    catch { toast.error('Update failed') }
  }

  const handleDelete = async (id) => {
    try { await deleteAppointment(id); toast.success('Deleted'); setDeleteConfirm(null); setSelected(null); load() }
    catch (err) { toast.error(err.message) }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-[#063B63]">Appointments & Enquiries</h1>
        <p className="text-[#3D5A73] text-sm mt-0.5">{appointments.length} total enquiries</p>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['all', ...STATUSES].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all capitalize ${filter === s ? 'bg-[#063B63] text-white' : 'bg-white border border-gray-200 text-[#3D5A73] hover:border-blue-200'}`}>
            {s === 'all' ? `All (${appointments.length})` : `${s} (${appointments.filter(a => a.status === s).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-[#0877B8] border-t-transparent rounded-full animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <p className="text-[#7A9BB5]">No appointments in this category</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 text-[#3D5A73] font-semibold text-xs">Patient</th>
                  <th className="text-left px-4 py-3 text-[#3D5A73] font-semibold text-xs hidden md:table-cell">Service</th>
                  <th className="text-left px-4 py-3 text-[#3D5A73] font-semibold text-xs hidden lg:table-cell">Date / Time</th>
                  <th className="text-left px-4 py-3 text-[#3D5A73] font-semibold text-xs">Status</th>
                  <th className="text-right px-4 py-3 text-[#3D5A73] font-semibold text-xs">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(a => (
                  <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-semibold text-[#063B63] text-sm">{a.name}</p>
                        <p className="text-[#7A9BB5] text-xs">{a.phone}</p>
                        {a.email && <p className="text-[#7A9BB5] text-xs">{a.email}</p>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#3D5A73] text-xs hidden md:table-cell">{a.service_name || 'â€“'}</td>
                    <td className="px-4 py-3 text-[#3D5A73] text-xs hidden lg:table-cell">
                      {a.preferred_date ? new Date(a.preferred_date).toLocaleDateString('en-IN') : 'â€“'} {a.preferred_time && `@ ${a.preferred_time}`}
                    </td>
                    <td className="px-4 py-3">
                      <div className="relative">
                        <select value={a.status} onChange={e => handleStatusChange(a.id, e.target.value)}
                          className={`text-xs font-semibold px-2 py-1.5 rounded-full border-0 cursor-pointer capitalize appearance-none pr-5 ${STATUS_COLORS[a.status]}`}
                          style={{ backgroundImage: 'none' }}>
                          {STATUSES.map(s => <option key={s} value={s} className="bg-white text-gray-700">{s}</option>)}
                        </select>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setSelected(a)} className="p-2 text-[#0877B8] hover:bg-blue-50 rounded-lg transition-all"><Eye size={15} /></button>
                        <a href={`tel:${a.phone}`} className="p-2 text-[#159447] hover:bg-green-50 rounded-lg transition-all"><Phone size={15} /></a>
                        <a href={`https://wa.me/${a.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="p-2 text-[#25D366] hover:bg-green-50 rounded-lg transition-all"><MessageCircle size={15} /></a>
                        {a.email && <a href={`mailto:${a.email}`} className="p-2 text-[#0877B8] hover:bg-blue-50 rounded-lg transition-all"><Mail size={15} /></a>}
                        <button onClick={() => setDeleteConfirm(a.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View modal */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <div>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-bold text-[#063B63]">Appointment Details</h2>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600"><X size={17} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  { label: 'Name', value: selected.name },
                  { label: 'Phone', value: selected.phone },
                  { label: 'Email', value: selected.email || 'â€“' },
                  { label: 'Service', value: selected.service_name || 'â€“' },
                  { label: 'Preferred Date', value: selected.preferred_date ? new Date(selected.preferred_date).toLocaleDateString('en-IN') : 'â€“' },
                  { label: 'Preferred Time', value: selected.preferred_time || 'â€“' },
                  { label: 'Submitted', value: new Date(selected.created_at).toLocaleString('en-IN') },
                ].map(item => (
                  <div key={item.label} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-[#7A9BB5] text-xs mb-0.5">{item.label}</p>
                    <p className="text-[#063B63] font-semibold text-sm">{item.value}</p>
                  </div>
                ))}
              </div>
              {selected.message && (
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-[#7A9BB5] text-xs mb-1">Message</p>
                  <p className="text-[#3D5A73] text-sm">{selected.message}</p>
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-[#063B63] mb-1">Update Status</label>
                <select value={selected.status} onChange={e => handleStatusChange(selected.id, e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-[#12304A] text-sm focus:outline-none focus:ring-2 focus:ring-[#0877B8]/30">
                  {STATUSES.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
                </select>
              </div>
              <div className="flex gap-3">
                <a href={`tel:${selected.phone}`} className="flex-1 flex items-center justify-center gap-2 bg-[#063B63] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-[#0877B8] transition-all">
                  <Phone size={15} /> Call
                </a>
                <a href={`https://wa.me/${selected.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-[#1ebc5a] transition-all">
                  <MessageCircle size={15} /> WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
        <div className="p-6 text-center">
          <AlertTriangle size={40} className="text-red-500 mx-auto mb-3" />
          <h3 className="font-bold text-[#063B63] text-lg mb-2">Delete Appointment?</h3>
          <p className="text-[#3D5A73] text-sm mb-5">This cannot be undone.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => setDeleteConfirm(null)} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm">Cancel</button>
            <button onClick={() => handleDelete(deleteConfirm)} className="px-5 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600">Delete</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}


