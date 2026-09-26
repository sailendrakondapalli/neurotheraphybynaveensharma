import { useEffect, useState } from "react"
import { Users, Search } from "lucide-react"
import { supabase } from "../../lib/supabase"

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.admin.listUsers()
      if (error) throw error
      setUsers(data?.users || [])
    } catch (e) {
      console.error("Failed to load users:", e.message)
    }
    setLoading(false)
  }

  const filteredUsers = users.filter(u => 
    !search || 
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.user_metadata?.full_name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-500 text-sm mt-1">{users.length} registered users</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Users size={20} className="text-[#1B2B5E]" />
          <h2 className="text-lg font-semibold text-gray-900">Total Users</h2>
          <span className="ml-auto text-2xl font-bold text-[#1B2B5E]">{users.length}</span>
        </div>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} 
          placeholder="Search by email or name..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B2B5E]" />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading && (
          <div className="p-8 text-center">
            <div className="w-6 h-6 border-2 border-[#1B2B5E] border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        )}
        {!loading && filteredUsers.length === 0 && (
          <div className="p-8 text-center text-gray-400">No users found</div>
        )}
        {!loading && filteredUsers.length > 0 && (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Email</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Name</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Created</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Last Sign In</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-900">{user.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {user.user_metadata?.full_name || user.user_metadata?.name || '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
