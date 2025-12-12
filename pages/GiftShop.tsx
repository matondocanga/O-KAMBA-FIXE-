import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ExternalLink, CheckCircle, Truck, Package } from 'lucide-react';

export default function GiftShop() {
  const { products } = useStore();
  // Local state for "Tracking" simulation
  const [orderStatus, setOrderStatus] = useState<Record<string, string>>({});

  const updateStatus = (pid: string, status: string) => {
    setOrderStatus(prev => ({ ...prev, [pid]: status }));
  };

  return (
    <div className="space-y-6">
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold font-header text-christmasRed">Loja de Presentes Kamba</h1>
        <p className="text-gray-500">Presentes locais selecionados para seu amigo oculto.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
            <div key={product.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:border-christmasGold transition-all group">
                <div className="aspect-square relative overflow-hidden">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                        {product.currency} {product.price.toLocaleString()}
                    </div>
                </div>
                
                <div className="p-5">
                    <h3 className="font-bold text-gray-800 text-lg mb-1">{product.name}</h3>
                    
                    <a href={product.link} target="_blank" rel="noreferrer" className="flex items-center justify-center w-full bg-gray-900 text-white py-3 rounded-xl font-bold text-sm mb-4 hover:bg-gray-800 transition-colors">
                        Comprar Agora <ExternalLink size={14} className="ml-2" />
                    </a>

                    {/* Manual Tracking Simulation */}
                    <div className="border-t pt-4">
                        <p className="text-xs text-gray-400 font-bold uppercase mb-2">Meu Rastreio</p>
                        <div className="flex justify-between">
                             <button 
                                onClick={() => updateStatus(product.id, 'ordered')}
                                className={`p-2 rounded-lg transition-colors ${orderStatus[product.id] === 'ordered' ? 'bg-blue-100 text-blue-600' : 'text-gray-300 hover:bg-gray-50'}`}
                                title="Pedido"
                             >
                                <CheckCircle size={20} />
                             </button>
                             <button 
                                onClick={() => updateStatus(product.id, 'shipped')}
                                className={`p-2 rounded-lg transition-colors ${orderStatus[product.id] === 'shipped' ? 'bg-orange-100 text-orange-600' : 'text-gray-300 hover:bg-gray-50'}`}
                                title="Enviado"
                             >
                                <Truck size={20} />
                             </button>
                             <button 
                                onClick={() => updateStatus(product.id, 'delivered')}
                                className={`p-2 rounded-lg transition-colors ${orderStatus[product.id] === 'delivered' ? 'bg-green-100 text-green-600' : 'text-gray-300 hover:bg-gray-50'}`}
                                title="Entregue"
                             >
                                <Package size={20} />
                             </button>
                        </div>
                        {orderStatus[product.id] && (
                            <p className="text-center text-xs font-bold mt-2 text-christmasGreen capitalize">
                                Estado: {orderStatus[product.id] === 'ordered' ? 'Pedido' : orderStatus[product.id] === 'shipped' ? 'Enviado' : 'Entregue'}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
}