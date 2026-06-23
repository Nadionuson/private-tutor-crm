export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#f1f0f8' }}>
      <div className="bg-white rounded-2xl shadow-sm border border-indigo-100 p-10 w-full max-w-sm text-center">
        <div className="text-4xl mb-4">🔒</div>
        <h1 className="text-xl font-bold text-indigo-950 mb-2">Access denied</h1>
        <p className="text-sm text-gray-500">
          This Google account is not authorised. Contact the owner to request access.
        </p>
      </div>
    </div>
  )
}
