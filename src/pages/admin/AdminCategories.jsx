import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Edit2, X, Image as ImageIcon } from "lucide-react"
import { useNewsAdminStore } from "../../store/newsAdminStore"
import { uploadProductImage } from "../../services/storageService"
import toast from "react-hot-toast"

export default function AdminCategories() {
  const { categories, loadCategories, updateCategory } = useNewsAdminStore()
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)

  useEffect(() => {
    loadCategories()
  }, [])

  const handleEdit = (category) => {
    setEditingCategory(category)
    setShowForm(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-500 text-sm mt-1">{categories.length} categories</p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map(cat => (
          <div key={cat.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-32 bg-gradient-to-br from-[#1B2B5E] to-[#2A3F7E] flex items-center justify-center">
              {cat.image_url ? (
                <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
              ) : (
                <ImageIcon size={40} className="text-white/30" />
              )}
              <div className="absolute inset-0 bg-black/30" />
              <h3 className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">
                {cat.name}
              </h3>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <span>Order: {cat.display_order}</span>
                <span className={`px-2 py-1 rounded ${cat.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                  {cat.status}
                </span>
              </div>
              <button onClick={() => handleEdit(cat)}
                className="w-full flex items-center justify-center gap-2 bg-[#1B2B5E] text-white py-2 rounded-lg hover:bg-[#2A3F7E] transition-colors text-sm">
                <Edit2 size={14} /> Edit Image
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Form Modal */}
      <AnimatePresence>
        {showForm && (
          <CategoryImageForm
            category={editingCategory}
            onClose={() => { setShowForm(false); setEditingCategory(null) }}
            onSave={async (data) => {
              try {
                await updateCategory(editingCategory.id, data)
                toast.success("Category image updated")
                setShowForm(false)
                setEditingCategory(null)
                loadCategories()
              } catch (e) {
                toast.error(e.message)
              }
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function CategoryImageForm({ category, onClose, onSave }) {
  const [imageUrl, setImageUrl] = useState(category?.image_url || "")
  const [uploading, setUploading] = useState(false)

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadProductImage(file)
      setImageUrl(url)
      toast.success("Image uploaded")
    } catch (e) {
      toast.error(e.message)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({ image_url: imageUrl })
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
        className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Edit Category Image</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <div className="bg-gray-50 px-4 py-3 rounded-lg">
              <p className="text-lg font-semibold text-gray-900">{category.name}</p>
              <p className="text-xs text-gray-500">{category.slug}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category Image</label>
            {imageUrl && (
              <div className="mb-3 relative">
                <img src={imageUrl} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                <button type="button" onClick={() => setImageUrl("")}
                  className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700">
                  <X size={16} />
                </button>
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#1B2B5E] file:text-white hover:file:bg-[#2A3F7E]" />
            <p className="text-xs text-gray-500 mt-1">Upload an image for this category box</p>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" disabled={uploading}
              className="flex-1 bg-[#1B2B5E] text-white py-2.5 rounded-lg hover:bg-[#2A3F7E] transition-colors font-medium disabled:opacity-50">
              Update Image
            </button>
            <button type="button" onClick={onClose}
              className="px-6 border border-gray-200 text-gray-700 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}


