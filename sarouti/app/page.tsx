import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">SAROUTI</h1>
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-600 hover:text-blue-600">Accueil</a>
            <a href="#" className="text-gray-600 hover:text-blue-600">Biens</a>
            <a href="#" className="text-gray-600 hover:text-blue-600">Clients</a>
            <a href="#" className="text-gray-600 hover:text-blue-600">Agents</a>
            <a href="#" className="text-gray-600 hover:text-blue-600">Contact</a>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-700">Biens en vente</h3>
            <p className="text-3xl font-bold text-blue-600">24</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-700">Biens en location</h3>
            <p className="text-3xl font-bold text-blue-600">12</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-700">Clients actifs</h3>
            <p className="text-3xl font-bold text-blue-600">156</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-700">Rendez-vous</h3>
            <p className="text-3xl font-bold text-blue-600">8</p>
          </div>
        </div>

        {/* Recent Properties */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Derniers biens ajoutés</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="h-48 bg-gray-200 relative">
                  <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                    À vendre
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">Appartement T3 - Centre ville</h3>
                  <p className="text-gray-600 mb-2">120m² • 3 chambres • 2 salles de bain</p>
                  <p className="text-blue-600 font-bold">250 000 €</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Actions rapides</h2>
            <div className="grid grid-cols-2 gap-4">
              <button className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700">
                Ajouter un bien
              </button>
              <button className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700">
                Nouveau client
              </button>
              <button className="bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700">
                Planifier RDV
              </button>
              <button className="bg-orange-600 text-white p-3 rounded-lg hover:bg-orange-700">
                Voir rapports
              </button>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Rendez-vous aujourd'hui</h2>
            <div className="space-y-4">
              {[1, 2].map((item) => (
                <div key={item} className="flex items-center justify-between border-b pb-3">
                  <div>
                    <p className="font-semibold">Visite appartement T2</p>
                    <p className="text-sm text-gray-600">14:30 - 15:30</p>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800">
                    Voir détails
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">SAROUTI</h3>
              <p className="text-gray-400">Votre partenaire immobilier de confiance</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-gray-400">Email: contact@sarouti.com</p>
              <p className="text-gray-400">Tél: +212 5XX-XXXXXX</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Suivez-nous</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">Facebook</a>
                <a href="#" className="text-gray-400 hover:text-white">Instagram</a>
                <a href="#" className="text-gray-400 hover:text-white">LinkedIn</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
